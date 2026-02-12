# NASA Sakhi - Repository Structure

## Date: February 3, 2026

This repository supports both **monolithic** and **split** deployment architectures.

---

## Directory Structure

```
nasa_sakhi/
├── backend/                    # ← DC Deploy deploys from here
│   ├── src/                    # Source code
│   │   ├── app/               # Next.js pages + API routes
│   │   ├── lib/               # Shared libraries
│   │   └── middleware.ts      # CORS middleware
│   ├── prisma/                # Database schema
│   ├── package.json           # Dependencies
│   ├── next.config.ts         # Next.js config
│   └── README.md              # Backend deployment guide
│
├── apps/                      # Legacy monorepo structure (unused)
│   ├── backend/               # Old backend (ignore)
│   └── frontend/              # Old frontend (ignore)
│
├── src/                       # Root-level source (mirrors backend/)
│   └── (same structure as backend/src/)
│
├── docs/                      # Team documentation
│   ├── MASTER_PROJECT_PLAN.md
│   ├── SHASHI_WORKPLAN.md
│   └── SUNITHA_WORKPLAN.md
│
├── deployment/                # Deployment guides
│   └── DEPLOYMENT-GUIDE.md
│
├── DC_DEPLOY_*.md            # DC Deploy configuration docs
├── DEPLOYMENT_QUICKSTART.md  # Quick start guide
└── README.md                 # Main project README
```

---

## For DC Deploy Deployment

### Configuration

**DC Deploy Settings:**
```yaml
Application Name: nasa-sakhi-backend
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
Port: 3000
```

### Environment Variables (DC Deploy Dashboard)

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://JQZAEG:%2B1h8t3x%7Baa@nasasakhidbstg:5432/nasasakhidbstg-db
NEXT_PUBLIC_APP_URL=https://your-app.dcdeployapp.com
NEXTAUTH_URL=https://your-app.dcdeployapp.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
```

### Deployment Process

1. **Push to GitHub:** Changes automatically trigger DC Deploy build
2. **DC Deploy extracts:** `/backend` directory
3. **Builds:** Runs `npm install && npm run build` in `/backend`
4. **Starts:** Runs `npm start` on port 3000
5. **Accessible:** Frontend + API at `https://your-app.dcdeployapp.com`

---

## Architecture: Monolithic

```
┌─────────────────────────────────────────┐
│  backend/ directory (Port 3000)         │
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │  Frontend    │    │  Backend     │  │
│  │  (Next.js    │───→│  (API        │  │
│  │   Pages)     │    │   Routes)    │  │
│  └──────────────┘    └──────┬───────┘  │
│                             │           │
│                             ↓           │
│                      ┌──────────────┐   │
│                      │  PostgreSQL  │   │
│                      │  (DC Deploy) │   │
│                      └──────────────┘   │
└─────────────────────────────────────────┘
```

**Key Points:**
- Single application contains both frontend and backend
- Frontend pages: `backend/src/app/page.tsx`, etc.
- Backend API: `backend/src/app/api/health/route.ts`, etc.
- Database connection: `backend/src/lib/prisma.ts`

---

## Why Two Copies of Source Code?

### `/backend` directory
- **Purpose:** DC Deploy deployment
- **Contains:** Complete deployable application
- **Used by:** DC Deploy build process

### Root-level files (`/src`, `/prisma`, etc.)
- **Purpose:** Local development and reference
- **Contains:** Same files as `/backend`
- **Used by:** Developers working locally

### `/apps` directory
- **Status:** Legacy monorepo structure (unused)
- **Action:** Will be removed in cleanup

---

## Local Development

### Option 1: Work in `/backend` directory
```bash
cd backend
npm install
npm run dev
```

### Option 2: Work at root level
```bash
npm install
npm run dev
```

Both work identically. Changes should be made at **root level**, then copied to `/backend` before deployment.

---

## Synchronization

When you make changes at root level, sync to backend:

```bash
# Copy updated files to backend/
cp -r src backend/
cp -r prisma backend/
cp package.json package-lock.json tsconfig.json next.config.ts backend/

# Commit and push
git add backend/
git commit -m "Sync changes to backend deployment directory"
git push origin main
```

---

## API Endpoints

After deployment, test these:

```bash
# Health check
curl https://your-app.dcdeployapp.com/api/health

# Database test
curl https://your-app.dcdeployapp.com/api/db-test
```

Expected responses:
- Health: `{"status":"healthy",...}`
- DB Test: `{"success":true,"message":"Database connection successful!",...}`

---

## Team Members

### Tanuj (10%)
- Deployment configuration
- UI/UX review
- Customer demo

### Sunitha (45%)
- Frontend development
- Works in `/src/app/` (root or backend)

### Shashi (45%)
- Backend API development
- Works in `/src/app/api/` (root or backend)
- Database migrations in `/prisma`

---

## Next Steps

1. ✅ Repository restructured with `/backend` directory
2. ⏳ Commit and push changes
3. ⏳ DC Deploy will auto-deploy from `/backend`
4. ⏳ Verify deployment
5. ⏳ Share URL with team

---

## Documentation

- [backend/README.md](backend/README.md) - Backend deployment guide
- [DEPLOYMENT_QUICKSTART.md](DEPLOYMENT_QUICKSTART.md) - Quick start
- [DC_DEPLOY_ACTUAL_CONFIG.md](DC_DEPLOY_ACTUAL_CONFIG.md) - Actual credentials
- [DC_DEPLOY_SPLIT_CONFIG.md](DC_DEPLOY_SPLIT_CONFIG.md) - Split architecture (advanced)

---

**Document Version:** 1.0
**Date:** February 3, 2026
**Status:** Backend directory created, ready to deploy
