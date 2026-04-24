# 🚀 Deploying Vyntrix Script Hub — Complete Beginner Guide

This guide will walk you through deploying your website **100% free** using:

- 🍃 **MongoDB Atlas** — free cloud database (512 MB forever-free)
- 🧠 **Render.com** — free backend hosting + free static site hosting
- 🐙 **GitHub** — stores your code

**Total cost:** $0 · **Time needed:** ~30–45 minutes · **Coding required:** None

---

## 📋 Before You Start — Checklist

- [ ] You've already pushed your code to GitHub from Emergent
- [ ] You have a working email address
- [ ] You have your YouTube API key handy (from `backend/.env`): `AIzaSyCSiAdNZ2ocZx9C2VL0z2kM3ANveKeREcQ`

---

## PART 1 — 🍃 MongoDB Atlas (Free Database)

Your website needs a database to store the admin password and script links. MongoDB Atlas gives us a free one.

### Step 1.1 — Sign up

1. Go to **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with Google or email (takes 1 minute)
3. When asked about your experience level → pick anything (doesn't matter)

### Step 1.2 — Create a Free Cluster

1. After login, click **"Build a Database"**
2. Choose the **FREE** option (labeled **M0**) — it says "Free forever"
3. **Provider:** AWS (default is fine)
4. **Region:** Pick whichever is closest to your country (e.g., Singapore for Philippines)
5. **Cluster Name:** keep as `Cluster0` (default)
6. Click **"Create Deployment"**

### Step 1.3 — Create Database User

A popup will appear asking for credentials:

1. **Username:** `vyntrix_admin` (or anything you want — remember it)
2. **Password:** Click **"Autogenerate Secure Password"** → **COPY AND SAVE IT SOMEWHERE SAFE**
   > ⚠️ You'll need this password in a moment. Save it in Notes or a txt file!
3. Click **"Create Database User"**

### Step 1.4 — Allow Access from Anywhere

1. Scroll down to "Where would you like to connect from?"
2. Click **"Add My Current IP Address"** — then also click **"Add a Different IP Address"**
3. In the IP field type: `0.0.0.0/0` and click **Add Entry**
   > This allows Render's servers to connect. (It's safe — your database still requires username + password)
4. Click **"Finish and Close"**

### Step 1.5 — Get Your Connection String

1. On the left sidebar, click **"Database"** (under Deployment)
2. On your `Cluster0` card, click the **"Connect"** button
3. Choose **"Drivers"**
4. Select **Driver:** Python, **Version:** 3.12 or later
5. **COPY** the connection string it shows you — looks like:
   ```
   mongodb+srv://vyntrix_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Replace `<password>`** in that string with the password you saved in Step 1.3
7. Save this full string in your notes — you'll paste it into Render in Part 2

✅ **Part 1 done!** Your free database is ready.

---

## PART 2 — 🧠 Deploy the Backend (FastAPI) on Render

### Step 2.1 — Sign up for Render

1. Go to **https://render.com**
2. Click **"Get Started for Free"** → sign up with GitHub (easiest — it will auto-link your repo)

### Step 2.2 — Create a Web Service (Backend)

1. On the Render dashboard, click **"+ New"** (top right) → **"Web Service"**
2. Click **"Connect"** next to your `vyntrix-script-hub` repo (or whatever you named it)
3. Fill out the form **exactly like this**:

| Field | Value |
|-------|-------|
| **Name** | `vyntrix-backend` |
| **Region** | Same region you picked for MongoDB (e.g., Singapore) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn server:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | **Free** |

### Step 2.3 — Add Environment Variables

Scroll down to **"Environment Variables"** and click **"Add Environment Variable"** for each of these:

| Key | Value |
|-----|-------|
| `MONGO_URL` | *(paste the MongoDB connection string from Step 1.5)* |
| `DB_NAME` | `vyntrix_script_hub` |
| `JWT_SECRET` | `7b1c93a4f2e8d5a6c0b9f3e1d4a7b2c8e5f9a3d6b1c4e7f2a5d8b3c6e9f1a4d7` |
| `ADMIN_USERNAME` | `Vyntrix` |
| `ADMIN_PASSWORD` | `c4222009` |
| `YOUTUBE_API_KEY` | `AIzaSyCSiAdNZ2ocZx9C2VL0z2kM3ANveKeREcQ` |
| `YOUTUBE_CHANNEL_HANDLE` | `vyntrixscripts` |
| `CORS_ORIGINS` | `*` *(for now — we'll tighten later)* |

### Step 2.4 — Deploy

1. Click **"Create Web Service"** at the bottom
2. Wait **~3–5 minutes** while Render builds your backend
3. When you see ✅ **"Your service is live"** at the top, **copy the URL** at the top of the page

   It looks like: `https://vyntrix-backend.onrender.com`

### Step 2.5 — Test the Backend

Open the URL in your browser and add `/api/` to the end:

```
https://vyntrix-backend.onrender.com/api/
```

You should see:
```json
{"service":"Vyntrix Script Hub","status":"ok"}
```

✅ **Backend works!** Save that URL — you'll need it for the frontend.

> 💡 **Free tier note:** Render's free backend sleeps after 15 min of inactivity. First request after sleep takes ~30 seconds to wake up. Upgrade to $7/mo later if you want instant loads.

---

## PART 3 — 🎨 Deploy the Frontend (React) on Render

### Step 3.1 — Create a Static Site

1. On Render dashboard → **"+ New"** → **"Static Site"**
2. Pick the same GitHub repo (`vyntrix-script-hub`)
3. Fill out **exactly like this**:

| Field | Value |
|-------|-------|
| **Name** | `vyntrix-scripthub` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `yarn install && yarn build` |
| **Publish Directory** | `build` |

### Step 3.2 — Add Environment Variable

Under **"Environment Variables"** click **"Add Environment Variable"**:

| Key | Value |
|-----|-------|
| `REACT_APP_BACKEND_URL` | *(paste your backend URL from Step 2.4)* e.g., `https://vyntrix-backend.onrender.com` |

> ⚠️ **No trailing slash!** Just `https://vyntrix-backend.onrender.com` (NOT with `/` at the end)

### Step 3.3 — Deploy

1. Click **"Create Static Site"**
2. Wait **~3–5 minutes** for the build
3. When you see ✅ **"Your site is live"**, **copy the URL** at the top

   It looks like: `https://vyntrix-scripthub.onrender.com`

### Step 3.4 — Add a Redirect Rule (Fixes React Router)

This step prevents 404 errors when someone shares a link to a specific section:

1. In your static site's dashboard, click **"Redirects/Rewrites"** in the left sidebar
2. Click **"Add Rule"** and fill:

| Field | Value |
|-------|-------|
| **Source Path** | `/*` |
| **Destination** | `/index.html` |
| **Action** | **Rewrite** |

3. Click **Save**

---

## PART 4 — 🔒 Tighten Backend CORS (Security)

Right now your backend accepts requests from any website. Let's restrict it to only your frontend:

1. Go to Render → your `vyntrix-backend` service → **"Environment"** tab
2. Find the `CORS_ORIGINS` variable and click the pencil ✏️ to edit
3. Change value from `*` to your frontend URL:
   ```
   https://vyntrix-scripthub.onrender.com
   ```
4. Click **"Save Changes"** — backend auto-restarts (~30 sec)

---

## ✅ You're Done!

Open your frontend URL in a browser:

```
https://vyntrix-scripthub.onrender.com
```

You should see your Vyntrix Script Hub live on the internet! 🎉

### Test these:
- [ ] Videos load from your YouTube channel
- [ ] Click **Admin** (top right) → login with `Vyntrix` / `c4222009`
- [ ] Click the pencil icon on a video → add a script link → save → "Script Ready" badge appears
- [ ] Toggle light/dark theme in Settings
- [ ] PayPal donate modal shows correct info
- [ ] UGPhone link works

---

## 🌐 Using a Custom Domain (Optional)

If you buy a domain like `vyntrix.com`:

1. Render → Static Site → **Settings** → **Custom Domains** → Add
2. Follow Render's DNS instructions (they'll give you a CNAME to add at your domain registrar)
3. Update `CORS_ORIGINS` on the backend to your new domain

---

## 🆘 Troubleshooting

### "Videos not loading"
- Check backend URL is correct in frontend env var (no trailing slash!)
- Visit `https://vyntrix-backend.onrender.com/api/videos` directly — should return JSON with 49 videos
- If backend is sleeping (free tier), wait 30 sec after first visit

### "Login fails"
- Check `ADMIN_USERNAME` and `ADMIN_PASSWORD` env vars are set on backend
- Open browser DevTools → Network tab → try login → check the response

### "Backend won't deploy"
- Check Render build logs (click "Logs" in backend service)
- Most common: wrong Root Directory — must be `backend`, not `/backend` or `app/backend`

### "Frontend builds but shows blank page"
- Check the Redirects/Rewrites rule from Step 3.4 is added
- Open browser console → check for errors

### "Changes I make in Emergent don't show on the live site"
- Every time you make changes in Emergent, you must **push to GitHub** again
- Render auto-deploys when it detects new commits on your GitHub repo
- Changes take ~3–5 min to go live

---

## 💰 Keeping It Free Forever

| Service | Free Tier Limits |
|---------|------------------|
| MongoDB Atlas M0 | 512 MB storage (plenty for scripts) |
| Render Web Service | 750 hrs/month (enough for 1 app 24/7) but sleeps after 15 min idle |
| Render Static Site | 100 GB bandwidth/month (plenty) |
| YouTube API | 10,000 units/day (your site uses <3,000) |

**Total forever cost:** $0

Upgrade only if:
- You want the backend to never sleep ($7/mo on Render)
- You get >100 GB/month of frontend traffic (very unlikely until you're massive)

---

## 🎉 Credits

Built with Emergent · Hosted on Render · Data by MongoDB Atlas · Videos via YouTube Data API v3
