# 🚀 KRYNTRA Deployment Guide

This guide details how to deploy the **KRYNTRA** autonomous cyber defense platform using **Vercel** for the Next.js frontend and **Render / Railway** for the FastAPI backend.

---

## 🏗️ Architecture Overview

- **Frontend**: Next.js 16 (React 19, Tailwind CSS) deployed on **Vercel** (Global Edge CDN)
- **Backend API**: FastAPI + Python 3.11 + Uvicorn + SQLite/PostgreSQL deployed on **Render** or **Railway**

---

## Step 1: Deploy Backend to Render (or Railway)

### Option A: Deploy on Render
1. Go to [dashboard.render.com](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository: `https://github.com/himanshusonkar719-max/KRYNTRA`.
3. Configure the service settings:
   - **Name**: `kryntra-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. In **Environment Variables**, add:
   - `SECRET_KEY`: *(Generate a 32+ character random string)*
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `1440`
   - `ENVIRONMENT`: `production`
5. Click **Create Web Service**. Once deployed, copy your backend URL (e.g., `https://kryntra-api.onrender.com`).

---

## Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com/) and click **Add New...** → **Project**.
2. Import your GitHub repository (`himanshusonkar719-max/KRYNTRA`).
3. In **Project Settings**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. In **Environment Variables**, configure:
   - `NEXT_PUBLIC_API_URL`: `https://kryntra-api.onrender.com` *(your Render backend URL from Step 1)*
   - `NEXT_PUBLIC_SITE_URL`: `https://your-domain.vercel.app` *(your custom domain or Vercel URL)*
5. Click **Deploy**.

---

## Step 3: Verify End-to-End Connectivity

1. Visit your Vercel deployment URL (e.g. `https://your-domain.vercel.app`).
2. Test user registration at `/register`.
3. Launch a perimeter reconnaissance scan on `/dashboard/scanner`.
4. Inspect the AI triage queue at `/dashboard/triage` and continuous compliance reports at `/dashboard/compliance`.

---

## Alternative: Single-Command Docker Deployment

If you want to run the full stack containerized on a VPS (Ubuntu / Debian / AWS EC2):

```bash
# Clone the repository
git clone https://github.com/himanshusonkar719-max/KRYNTRA.git
cd KRYNTRA

# Launch both frontend and backend
docker compose up -d --build
```
- **Frontend**: `http://<your-vps-ip>:3000`
- **Backend API**: `http://<your-vps-ip>:8000/docs`
