from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, List

import bcrypt
import jwt
import httpx
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

# -------------------- Config --------------------
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24 * 7  # 7 days

YOUTUBE_API_KEY = os.environ["YOUTUBE_API_KEY"]
YOUTUBE_CHANNEL_HANDLE = os.environ.get("YOUTUBE_CHANNEL_HANDLE", "vyntrixscripts")

ADMIN_USERNAME = os.environ["ADMIN_USERNAME"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]

# -------------------- DB --------------------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# -------------------- App --------------------
app = FastAPI(title="Vyntrix Script Hub API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("vyntrix")


# -------------------- Models --------------------
class LoginRequest(BaseModel):
    username: str
    password: str


class UserPublic(BaseModel):
    username: str
    role: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class ScriptUpdate(BaseModel):
    script_url: str = Field(..., min_length=1, max_length=2000)


class ScriptItem(BaseModel):
    video_id: str
    script_url: str
    updated_at: str


class Video(BaseModel):
    video_id: str
    title: str
    description: str
    thumbnail: str
    published_at: str
    view_count: int
    like_count: int
    comment_count: int
    duration: str
    script_url: Optional[str] = None


class ChannelInfo(BaseModel):
    channel_id: str
    title: str
    description: str
    thumbnail: str
    subscriber_count: int
    video_count: int


# -------------------- Auth helpers --------------------
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(username: str, role: str) -> str:
    payload = {
        "sub": username,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> dict:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = await db.users.find_one({"username": username}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# -------------------- Seed --------------------
async def seed_admin():
    existing = await db.users.find_one({"username": ADMIN_USERNAME})
    if existing is None:
        await db.users.insert_one({
            "username": ADMIN_USERNAME,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user: %s", ADMIN_USERNAME)
    elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
        await db.users.update_one(
            {"username": ADMIN_USERNAME},
            {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
        )
        logger.info("Updated admin password for: %s", ADMIN_USERNAME)


# -------------------- YouTube (cached) --------------------
YT_BASE = "https://www.googleapis.com/youtube/v3"
_cache = {"channel": None, "channel_ts": 0.0, "videos": None, "videos_ts": 0.0}
CACHE_TTL = 300  # seconds


def _now() -> float:
    return datetime.now(timezone.utc).timestamp()


async def _yt_get(path: str, params: dict) -> dict:
    params = {**params, "key": YOUTUBE_API_KEY}
    async with httpx.AsyncClient(timeout=20.0) as cx:
        r = await cx.get(f"{YT_BASE}/{path}", params=params)
    if r.status_code != 200:
        logger.error("YouTube API error %s: %s", r.status_code, r.text[:500])
        raise HTTPException(status_code=502, detail="YouTube API error")
    return r.json()


async def fetch_channel_info() -> dict:
    if _cache["channel"] and _now() - _cache["channel_ts"] < CACHE_TTL:
        return _cache["channel"]
    data = await _yt_get("channels", {"part": "snippet,statistics,contentDetails", "forHandle": f"@{YOUTUBE_CHANNEL_HANDLE}"})
    items = data.get("items") or []
    if not items:
        raise HTTPException(status_code=404, detail="Channel not found")
    it = items[0]
    snip = it["snippet"]
    stats = it.get("statistics", {})
    thumbs = snip.get("thumbnails", {})
    thumb = (thumbs.get("high") or thumbs.get("medium") or thumbs.get("default") or {}).get("url", "")
    info = {
        "channel_id": it["id"],
        "uploads_playlist": it["contentDetails"]["relatedPlaylists"]["uploads"],
        "title": snip.get("title", ""),
        "description": snip.get("description", ""),
        "thumbnail": thumb,
        "subscriber_count": int(stats.get("subscriberCount", 0)),
        "video_count": int(stats.get("videoCount", 0)),
    }
    _cache["channel"] = info
    _cache["channel_ts"] = _now()
    return info


async def fetch_all_videos() -> List[dict]:
    if _cache["videos"] and _now() - _cache["videos_ts"] < CACHE_TTL:
        return _cache["videos"]
    ch = await fetch_channel_info()
    uploads = ch["uploads_playlist"]
    video_ids: List[str] = []
    page_token = None
    # cap at 200 videos to keep quota low
    while len(video_ids) < 200:
        params = {"part": "contentDetails", "playlistId": uploads, "maxResults": 50}
        if page_token:
            params["pageToken"] = page_token
        data = await _yt_get("playlistItems", params)
        for it in data.get("items", []):
            vid = it["contentDetails"].get("videoId")
            if vid:
                video_ids.append(vid)
        page_token = data.get("nextPageToken")
        if not page_token:
            break

    videos: List[dict] = []
    # batch fetch in chunks of 50
    for i in range(0, len(video_ids), 50):
        chunk = video_ids[i:i + 50]
        data = await _yt_get("videos", {
            "part": "snippet,statistics,contentDetails",
            "id": ",".join(chunk),
        })
        for it in data.get("items", []):
            snip = it["snippet"]
            stats = it.get("statistics", {})
            thumbs = snip.get("thumbnails", {})
            thumb = (thumbs.get("maxres") or thumbs.get("high") or thumbs.get("medium") or thumbs.get("default") or {}).get("url", "")
            videos.append({
                "video_id": it["id"],
                "title": snip.get("title", ""),
                "description": snip.get("description", ""),
                "thumbnail": thumb,
                "published_at": snip.get("publishedAt", ""),
                "view_count": int(stats.get("viewCount", 0)),
                "like_count": int(stats.get("likeCount", 0)),
                "comment_count": int(stats.get("commentCount", 0)),
                "duration": it["contentDetails"].get("duration", ""),
            })

    _cache["videos"] = videos
    _cache["videos_ts"] = _now()
    return videos


# -------------------- Routes --------------------
@api_router.get("/")
async def root():
    return {"service": "Vyntrix Script Hub", "status": "ok"}


@api_router.post("/auth/login", response_model=LoginResponse)
async def login(body: LoginRequest):
    user = await db.users.find_one({"username": body.username})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token(user["username"], user["role"])
    return LoginResponse(
        access_token=token,
        user=UserPublic(username=user["username"], role=user["role"]),
    )


@api_router.get("/auth/me", response_model=UserPublic)
async def me(user: dict = Depends(get_current_user)):
    return UserPublic(username=user["username"], role=user["role"])


@api_router.post("/auth/logout")
async def logout(user: dict = Depends(get_current_user)):
    return {"ok": True}


@api_router.get("/channel", response_model=ChannelInfo)
async def get_channel():
    info = await fetch_channel_info()
    return ChannelInfo(
        channel_id=info["channel_id"],
        title=info["title"],
        description=info["description"],
        thumbnail=info["thumbnail"],
        subscriber_count=info["subscriber_count"],
        video_count=info["video_count"],
    )


@api_router.get("/videos", response_model=List[Video])
async def list_videos():
    videos = await fetch_all_videos()
    # merge scripts
    scripts = {}
    async for doc in db.scripts.find({}, {"_id": 0}):
        scripts[doc["video_id"]] = doc.get("script_url")
    out = []
    for v in videos:
        out.append(Video(**v, script_url=scripts.get(v["video_id"])))
    return out


@api_router.get("/scripts", response_model=List[ScriptItem])
async def list_scripts():
    items = []
    async for doc in db.scripts.find({}, {"_id": 0}):
        items.append(ScriptItem(
            video_id=doc["video_id"],
            script_url=doc.get("script_url", ""),
            updated_at=doc.get("updated_at", ""),
        ))
    return items


@api_router.put("/scripts/{video_id}", response_model=ScriptItem)
async def upsert_script(video_id: str, body: ScriptUpdate, _: dict = Depends(require_admin)):
    now = datetime.now(timezone.utc).isoformat()
    await db.scripts.update_one(
        {"video_id": video_id},
        {"$set": {"video_id": video_id, "script_url": body.script_url, "updated_at": now}},
        upsert=True,
    )
    return ScriptItem(video_id=video_id, script_url=body.script_url, updated_at=now)


@api_router.delete("/scripts/{video_id}")
async def delete_script(video_id: str, _: dict = Depends(require_admin)):
    await db.scripts.delete_one({"video_id": video_id})
    return {"ok": True}


# -------------------- Mount --------------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("username", unique=True)
    await db.scripts.create_index("video_id", unique=True)
    await seed_admin()


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
