# DC Deploy Services Configuration

## Current Setup

You have **two DC Deploy services** configured:

### 1. Backend Service: `saathibestg`
- **Status:** ✅ Deploying from `/backend` directory
- **Type:** Monolithic (Frontend + Backend combined)
- **Port:** 3000
- **Build:** Docker
- **Structure:**
  ```
  backend/
  ├── Dockerfile        ✅ Created
  ├── src/              ✅ Present
  ├── prisma/           ✅ Present
  └── package.json      ✅ Present
  ```

### 2. Frontend Service: `saathifestg`
- **Status:** ❌ Failing - looking for `/frontend` directory
- **Issue:** No `/frontend` directory exists in repository
- **Error:** `cp: can't stat '/tmp/extracted/.../frontend/*': No such file or directory`

---

## Recommended Configuration

### Option 1: Use Only Backend Service (RECOMMENDED)

Since the backend is **monolithic** (contains both frontend and backend), you only need ONE service:

**Keep:** `saathibestg` (backend service)
**Disable/Delete:** `saathifestg` (frontend service)

**Why?**
- The backend service already serves the frontend pages
- No need for a separate frontend deployment
- Simpler architecture
- Less to manage

**How to disable frontend service in DC Deploy:**
1. Go to DC Deploy dashboard
2. Find `saathifestg` application
3. Pause or delete the application

---

### Option 2: True Split Deployment (ADVANCED)

If you want separate frontend and backend services:

**Backend Service:** `saathibestg`
- Root Directory: `backend`
- Serves API only at `/api/*`
- Port: 4000

**Frontend Service:** `saathifestg`
- Root Directory: `frontend` (needs to be created)
- Serves pages only
- Calls backend API
- Port: 3000

**Action Required:**
- Create `/frontend` directory with frontend-only code
- Configure CORS between services
- More complex setup

---

## Current Deployment Status

### Backend Service Build Log Analysis

```
✅ Downloading source... SUCCESS
✅ Extracting source... SUCCESS
✅ Found files in /backend:
   - README.md
   - next.config.ts
   - package.json
   - package-lock.json
   - prisma/
   - prisma.config.ts
   - src/
   - tsconfig.json

❌ Looking for Dockerfile... NOT FOUND (now fixed)
```

**Solution:** Dockerfile created in `/backend/Dockerfile`

### Frontend Service Build Log Analysis

```
✅ Downloading source... SUCCESS
✅ Extracting source... SUCCESS
❌ Looking for /frontend directory... NOT FOUND
```

**Solution:** Disable this service or create `/frontend` directory

---

## Recommended Action for MVP

**For Feb 3-7 MVP Timeline:**

1. **Keep backend service only** (monolithic deployment)
2. **Disable frontend service** in DC Deploy dashboard
3. **Deploy backend service** - it serves both frontend and backend
4. **Test:** Both pages and API work from one URL

**Result:**
- Single application at: `https://saathibestg.dcdeployapp.com`
- Frontend pages: `https://saathibestg.dcdeployapp.com/`
- Backend API: `https://saathibestg.dcdeployapp.com/api/*`

---

## Environment Variables

### Backend Service Only (Monolithic)

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://JQZAEG:%2B1h8t3x%7Baa@saathidbstg:5432/saathidbstg-db
NEXT_PUBLIC_APP_URL=https://saathibestg.dcdeployapp.com
NEXTAUTH_URL=https://saathibestg.dcdeployapp.com
NEXTAUTH_SECRET=<generate-with-openssl>
```

**Note:** No `NEXT_PUBLIC_API_URL` needed - frontend and backend are same domain

---

## Next Steps

1. ✅ Dockerfile created for backend service
2. ⏳ Commit and push Dockerfile
3. ⏳ Trigger new deployment of backend service
4. ⏳ Disable frontend service in DC Deploy dashboard
5. ⏳ Test deployed application

---

**Document Version:** 1.0
**Date:** February 3, 2026
**Status:** Backend Dockerfile created, ready to deploy
