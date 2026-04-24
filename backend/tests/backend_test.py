"""Backend tests for Vyntrix Script Hub."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # fall back to frontend/.env
    from pathlib import Path
    for line in Path("/app/frontend/.env").read_text().splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip().rstrip("/")

ADMIN_USER = "Vyntrix"
ADMIN_PASS = "c4222009"


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(api):
    r = api.post(f"{BASE_URL}/api/auth/login",
                 json={"username": ADMIN_USER, "password": ADMIN_PASS})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# -------------------- Health --------------------
class TestHealth:
    def test_root(self, api):
        r = api.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert "service" in data


# -------------------- Channel / Videos --------------------
class TestChannel:
    def test_get_channel(self, api):
        r = api.get(f"{BASE_URL}/api/channel")
        assert r.status_code == 200, r.text
        d = r.json()
        for k in ("channel_id", "title", "thumbnail", "subscriber_count", "video_count"):
            assert k in d
        assert isinstance(d["subscriber_count"], int)
        assert d["title"]

    def test_get_videos(self, api):
        r = api.get(f"{BASE_URL}/api/videos")
        assert r.status_code == 200, r.text
        videos = r.json()
        assert isinstance(videos, list)
        assert len(videos) >= 40, f"expected >=40 videos, got {len(videos)}"
        v = videos[0]
        for k in ("video_id", "title", "thumbnail", "view_count",
                  "published_at", "duration"):
            assert k in v, f"missing {k} in video"
        assert "script_url" in v  # may be None


# -------------------- Auth --------------------
class TestAuth:
    def test_login_success(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login",
                     json={"username": ADMIN_USER, "password": ADMIN_PASS})
        assert r.status_code == 200
        d = r.json()
        assert "access_token" in d and d["access_token"]
        assert d["user"]["username"] == ADMIN_USER
        assert d["user"]["role"] == "admin"

    def test_login_wrong_password(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login",
                     json={"username": ADMIN_USER, "password": "wrong"})
        assert r.status_code == 401

    def test_login_wrong_username(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login",
                     json={"username": "nobody", "password": "whatever"})
        assert r.status_code == 401

    def test_me_with_token(self, api, admin_headers):
        r = api.get(f"{BASE_URL}/api/auth/me", headers=admin_headers)
        assert r.status_code == 200
        d = r.json()
        assert d["username"] == ADMIN_USER
        assert d["role"] == "admin"

    def test_me_without_token(self, api):
        # Use fresh session to avoid any saved auth
        r = requests.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401

    def test_me_invalid_token(self, api):
        r = requests.get(f"{BASE_URL}/api/auth/me",
                         headers={"Authorization": "Bearer invalid.token.here"})
        assert r.status_code == 401


# -------------------- Scripts CRUD --------------------
class TestScripts:
    @pytest.fixture(scope="class")
    def sample_video_id(self, api):
        r = api.get(f"{BASE_URL}/api/videos")
        assert r.status_code == 200
        videos = r.json()
        assert videos
        return videos[0]["video_id"]

    def test_put_script_no_auth(self, api, sample_video_id):
        r = requests.put(f"{BASE_URL}/api/scripts/{sample_video_id}",
                         json={"script_url": "https://example.com/TEST"})
        assert r.status_code == 401

    def test_delete_script_no_auth(self, api, sample_video_id):
        r = requests.delete(f"{BASE_URL}/api/scripts/{sample_video_id}")
        assert r.status_code == 401

    def test_put_script_admin_and_persist(self, api, admin_headers, sample_video_id):
        url = f"https://example.com/TEST_script_{uuid.uuid4().hex[:8]}"
        r = requests.put(
            f"{BASE_URL}/api/scripts/{sample_video_id}",
            json={"script_url": url},
            headers={**admin_headers, "Content-Type": "application/json"},
        )
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["video_id"] == sample_video_id
        assert d["script_url"] == url
        assert d["updated_at"]

        # GET /api/scripts reflects it
        r2 = api.get(f"{BASE_URL}/api/scripts")
        assert r2.status_code == 200
        found = [s for s in r2.json() if s["video_id"] == sample_video_id]
        assert found and found[0]["script_url"] == url

        # GET /api/videos reflects the new script_url
        r3 = api.get(f"{BASE_URL}/api/videos")
        assert r3.status_code == 200
        match = [v for v in r3.json() if v["video_id"] == sample_video_id]
        assert match and match[0]["script_url"] == url

    def test_delete_script_admin(self, api, admin_headers, sample_video_id):
        # ensure one exists
        url = "https://example.com/TEST_to_delete"
        requests.put(
            f"{BASE_URL}/api/scripts/{sample_video_id}",
            json={"script_url": url},
            headers={**admin_headers, "Content-Type": "application/json"},
        )
        r = requests.delete(
            f"{BASE_URL}/api/scripts/{sample_video_id}",
            headers=admin_headers,
        )
        assert r.status_code == 200
        assert r.json().get("ok") is True

        r2 = api.get(f"{BASE_URL}/api/scripts")
        assert not any(s["video_id"] == sample_video_id for s in r2.json())
