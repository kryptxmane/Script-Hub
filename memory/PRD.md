# PRD — Vyntrix Script Hub

## Problem Statement (verbatim)
Create a modern, high-end, fully responsive website for YouTube channel "Vyntrix Script Hub".
Must feel futuristic, smooth, premium. Dark theme + purple neon gradients, glassmorphism UI,
smooth animations. Homepage auto-fetches YouTube videos via Data API (channel @vyntrixscripts),
shows modern cards (thumbnail, title, views, date, Get Script). Sort (Latest/Oldest/Most Popular)
+ search with "No Results Found". Admin account (Vyntrix/c4222009) unlocks Edit Script per video.
UGPhone collab section. Support/Donation modal (PayPal). Settings panel (dark/light + accent color).
Profile in navbar. Skeleton loading, sticky nav, mobile responsive.

## Architecture
- FastAPI backend + MongoDB (motor), JWT auth (Bearer), bcrypt, httpx for YouTube v3 proxy
- React 19 + Tailwind + Sora font + shadcn (via existing ui components + sonner toasts)
- YouTube API key hidden server-side in /app/backend/.env
- Token stored in localStorage key `vx_token`; backend prefix `/api`

## User Personas
- **Public visitor** — browse videos, search, sort, copy script link, view UGPhone, donate
- **Admin (Vyntrix)** — log in → edit/add/remove script URL per video

## Implemented (2026-02-24)
- Backend: auth (`/api/auth/login`, `/me`, `/logout`), `/api/channel`, `/api/videos`, `/api/scripts`, `PUT/DELETE /api/scripts/{video_id}` (admin), 5-min YouTube cache, admin seed on startup
- Frontend: glass sticky navbar (Vyntrix logo + Support + Settings + Admin login + theme toggle), Hero w/ channel stats, UGPhone collab (moved above Trending per user), Trending This Week strip, sortable/searchable video grid w/ "No Results Found", Script modal (view + copy + open), Edit Script modal (admin), Donate modal (PayPal), Settings modal (dark/light + 8 accent presets + hue slider + Apply), skeleton loading, sonner toasts, footer

## Testing
- 13/13 pytest backend tests ✅
- Full Playwright e2e ✅ (login, admin edit persist, sort, search, settings apply, donate, UGPhone)

## Backlog (P1)
- Add rate limiting to /api/auth/login
- Tighten CORS from `*` to explicit frontend origin before prod
- HttpUrl validation on ScriptUpdate
- Optional: custom domain, view counter on script clicks (analytics)

## Backlog (P2)
- Category tags per video (Roblox game tags)
- Password reset flow (currently admin only)
- Public script submission queue (community scripts)
- Pagination if channel exceeds 200 videos

## Credentials
- See /app/memory/test_credentials.md
