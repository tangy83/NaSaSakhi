# DC Deploy - Actual Production Configuration

**Last Updated:** February 3, 2026 19:00 IST
**Status:** ✅ Successfully Deployed (Build #24)

---

## Application Configuration

**Application Name:** nasassakhibestg
**Platform:** DC Deploy (Docker-based PaaS)
**Deployment URL:** https://nasassakhibestg.dcdeployapp.com
**Status:** Active and running

---

## Build Configuration

**Root Directory:** `backend`
**Build Command:** `npm install && npm run build`
**Start Command:** `npm start`
**Port:** 3000

**Dockerfile Location:** `backend/Dockerfile`
**Build Type:** Docker multi-stage build
**Base Image:** node:20-alpine
**Output:** Next.js standalone

---

## Database Configuration

**Database Instance:** nasasakhidbstg
**Type:** PostgreSQL 17.5 (DC Deploy Managed)
**Port:** 5432
**Connection String Format:**
```
postgresql://[USER]:[PASSWORD]@nasasakhidbstg:5432/nasasakhidbstg-db
```

**Connection String (Development):**
```
DATABASE_URL="postgresql://JQZAEG:%2B1h8t3x%7Baa@nasasakhidbstg:5432/nasasakhidbstg-db"
```

---

## Environment Variables

Configured in DC Deploy Dashboard:

| Variable | Value | Purpose |
|----------|-------|---------|
| NODE_ENV | production | Runtime environment |
| PORT | 3000 | Application port |
| DATABASE_URL | postgresql://JQZAEG:***@nasasakhidbstg:5432/nasasakhidbstg-db | Database connection |
| NEXT_PUBLIC_APP_URL | https://nasassakhibestg.dcdeployapp.com | Public app URL |
| NEXTAUTH_URL | https://nasassakhibestg.dcdeployapp.com | NextAuth base URL |
| NEXTAUTH_SECRET | [Securely configured] | NextAuth secret key |

---

## Deployment Process

### Automatic Deployment

1. **Developer Action:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **DC Deploy Process:**
   - Detects push to main branch via webhook
   - Pulls latest code from GitHub
   - Extracts `backend/` directory
   - Runs Docker build using `backend/Dockerfile`
   - Generates Prisma Client
   - Builds Next.js application
   - Deploys new container
   - Restarts application

3. **Build Time:** ~2-3 minutes
4. **Downtime:** < 10 seconds (rolling deployment)

### Monitoring Deployment

- **DC Deploy Dashboard:** View build logs and status
- **GitHub:** Check commit triggered build
- **Health Check:**
  ```bash
  curl https://nasassakhibestg.dcdeployapp.com/api/health
  ```

---

## Testing Deployed Application

### Health Check (No Database)
```bash
curl https://nasassakhibestg.dcdeployapp.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-03T...",
  "service": "NASA Sakhi API",
  "version": "1.0.0",
  "environment": "production"
}
```

### Database Connection Test
```bash
curl https://nasassakhibestg.dcdeployapp.com/api/db-test
```

Expected response:
```json
{
  "success": true,
  "message": "Database connection successful!",
  "data": {
    "testRecord": {
      "id": "...",
      "status": "ok",
      "timestamp": "..."
    },
    "totalHealthChecks": 1,
    "database": {
      "type": "PostgreSQL",
      "version": "PostgreSQL 17.5...",
      "connected": true
    }
  },
  "timestamp": "2026-02-03T..."
}
```

---

## Local Development Setup

### For Backend Development (Akarsha)

1. **Clone Repository:**
   ```bash
   git clone https://github.com/tangy83/NaSaSakhi.git
   cd nasa_sakhi
   ```

2. **Navigate to Backend:**
   ```bash
   cd backend
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Configure Environment:**
   Create `backend/.env`:
   ```env
   DATABASE_URL="postgresql://JQZAEG:%2B1h8t3x%7Baa@nasasakhidbstg:5432/nasasakhidbstg-db"
   NODE_ENV=development
   ```

5. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

6. **Run Development Server:**
   ```bash
   npm run dev
   ```

7. **Access Application:**
   - Frontend: http://localhost:3000
   - API Health: http://localhost:3000/api/health
   - API DB Test: http://localhost:3000/api/db-test

### For Frontend Development (Sunitha)

1. **Same setup as backend** (monolithic architecture - both work in `backend/` directory)

2. **Work in these directories:**
   - Pages: `backend/src/app/`
   - Components: `backend/src/components/`
   - Utilities: `backend/src/lib/`

3. **API Integration:**
   Use relative paths (no CORS issues):
   ```typescript
   // ✅ CORRECT
   const response = await fetch('/api/health');

   // ❌ WRONG
   const response = await fetch('http://localhost:3000/api/health');
   ```

---

## Development Workflow

### Daily Development Loop

1. **Work on features:**
   - Backend: Work in `backend/src/app/api/` for API routes
   - Frontend: Work in `backend/src/app/` for pages
   - Both: Work in `backend/src/components/` for shared components

2. **Test locally:**
   ```bash
   cd backend
   npm run dev
   # Open http://localhost:3000
   ```

3. **Commit changes:**
   ```bash
   git add .
   git commit -m "Add: Feature description"
   ```

4. **Deploy to DC Deploy:**
   ```bash
   git push origin main
   ```

5. **Monitor deployment:**
   - Check DC Deploy dashboard for build logs
   - Wait ~2-3 minutes for build to complete
   - Test deployed app at https://nasassakhibestg.dcdeployapp.com

6. **Verify deployment:**
   ```bash
   curl https://nasassakhibestg.dcdeployapp.com/api/health
   ```

---

## Troubleshooting

### Build Failed

**Symptoms:**
- DC Deploy dashboard shows build failure
- Red status in deployment logs

**Common Causes & Solutions:**

1. **TypeScript compilation errors:**
   ```bash
   # Test locally first
   cd backend
   npm run build
   # Fix any TypeScript errors
   ```

2. **Missing dependencies:**
   ```bash
   # Ensure package.json is up to date
   npm install
   git add package.json package-lock.json
   git commit -m "Update dependencies"
   git push origin main
   ```

3. **Prisma schema issues:**
   ```bash
   # Generate Prisma Client locally
   npx prisma generate
   # If schema changed, create migration
   npx prisma migrate dev --name migration_name
   ```

### Application Not Responding

**Symptoms:**
- URL returns 502/503 error
- Application not accessible

**Solutions:**

1. **Check DC Deploy dashboard:**
   - Is container running?
   - Check application logs for errors

2. **Verify environment variables:**
   - Ensure DATABASE_URL is set correctly
   - Check all required env vars are configured

3. **Check database connection:**
   - Verify nasasakhidbstg instance is running
   - Test DATABASE_URL format

### Database Connection Issues

**Symptoms:**
- `/api/db-test` returns error
- Application logs show Prisma connection errors

**Solutions:**

1. **Verify DATABASE_URL format:**
   ```
   postgresql://[USER]:[PASSWORD]@nasasakhidbstg:5432/nasasakhidbstg-db
   ```
   Note: Password must be URL-encoded (`%2B` for `+`, `%7B` for `{`, etc.)

2. **Check database instance:**
   - Verify nasasakhidbstg is running in DC Deploy
   - Check database credentials

3. **Test locally:**
   ```bash
   cd backend
   npx prisma db pull
   # Should connect successfully
   ```

4. **Regenerate Prisma Client:**
   ```bash
   npx prisma generate
   npm run build
   git push origin main
   ```

---

## Architecture

### Type
**Monolithic Next.js Application**

### Components
- **Frontend:** Next.js App Router pages (React 19)
- **Backend:** Next.js API Routes (serverless functions)
- **Database:** PostgreSQL 17.5 via Prisma ORM
- **ORM:** Prisma 7.3.0
- **Styling:** Tailwind CSS
- **Validation:** Zod + React Hook Form

### Deployment Model
```
┌─────────────────────────────────────────────────┐
│  GitHub Repository (main branch)                │
└────────────────┬────────────────────────────────┘
                 │
                 │ git push
                 ▼
┌─────────────────────────────────────────────────┐
│  DC Deploy (Webhook Trigger)                    │
│  - Detects push to main                         │
│  - Clones repository                            │
│  - Extracts backend/ directory                  │
└────────────────┬────────────────────────────────┘
                 │
                 │ Docker build
                 ▼
┌─────────────────────────────────────────────────┐
│  Docker Build Process                           │
│  1. Base image: node:20-alpine                  │
│  2. Install dependencies (npm ci)               │
│  3. Generate Prisma Client                      │
│  4. Build Next.js (npm run build)               │
│  5. Create standalone output                    │
└────────────────┬────────────────────────────────┘
                 │
                 │ Deploy container
                 ▼
┌─────────────────────────────────────────────────┐
│  Running Container (nasassakhibestg)            │
│  - Port: 3000 (internal)                        │
│  - URL: https://nasassakhibestg.dcdeployapp.com │
│  - Connects to: nasasakhidbstg (PostgreSQL)     │
└─────────────────────────────────────────────────┘
```

### Advantages

- ✅ **Single deployment** - Frontend + backend together
- ✅ **No CORS issues** - Same origin (monolithic)
- ✅ **Automatic deployments** - Git push triggers build
- ✅ **Managed database** - Backups, scaling handled by DC Deploy
- ✅ **Docker containerization** - Consistent environments
- ✅ **Simple workflow** - No separate frontend/backend deploys
- ✅ **Zero downtime** - Rolling deployments

---

## Build History

| Build | Date | Time | Status | Changes |
|-------|------|------|--------|---------|
| #24 | Feb 3, 2026 | 18:52 IST | ✅ Success | Added public/ directory, full deployment working |
| #23 | Feb 3, 2026 | 18:45 IST | ⚠️ Build ✅, Docker ❌ | Dynamic import fix for Prisma |
| #22 | Feb 3, 2026 | 18:30 IST | ❌ Failed | DATABASE_URL missing during build |
| #21 | Feb 3, 2026 | 18:20 IST | ❌ Failed | DATABASE_URL configuration error |
| #20 | Feb 3, 2026 | 18:10 IST | ❌ Failed | React.Node type error |
| #19 | Feb 3, 2026 | 18:00 IST | ❌ Failed | Node.js version mismatch |

**Latest Successful Deployment:** Build #24 (Feb 3, 2026 18:52 IST)

### Build #24 Changes
- Added `backend/public/` directory (required by Next.js)
- Dynamic imports for Prisma Client to avoid build-time DATABASE_URL requirement
- All health checks passing (API + Database)
- Full production deployment successful

---

## Team Access

### Repository Access
- **GitHub Repository:** https://github.com/tangy83/NaSaSakhi.git
- **Branch Strategy:**
  - `main` - Production (auto-deploys to DC Deploy)
  - Feature branches: `feature/backend-api`, `feature/registration-form`
  - Integration branch: `integration/mvp`

### Team Members

| Name | Role | Access Level | Responsibilities |
|------|------|--------------|------------------|
| Tanuj | Tech Lead / UI Lead | Admin | Infrastructure, design review, customer demo (10%) |
| Akarsha | Backend Lead | Developer | Database, API endpoints, migrations (45%) |
| Sunitha | Frontend Lead | Developer | UI components, forms, validation (45%) |

### Development Directories

**Akarsha (Backend):**
- `backend/src/app/api/` - API routes
- `backend/prisma/` - Database schema
- `backend/src/lib/` - Server utilities

**Sunitha (Frontend):**
- `backend/src/app/` - Pages and layouts
- `backend/src/components/` - React components
- `backend/src/lib/` - Client utilities

**Shared:**
- `backend/src/types/` - TypeScript type definitions
- `backend/public/` - Static assets

---

## Security Notes

### Sensitive Information

- ⚠️ **Never commit `.env` files** to git
- ⚠️ **Never commit credentials** in code
- ✅ All secrets managed in DC Deploy dashboard
- ✅ DATABASE_URL password is URL-encoded
- ✅ NEXTAUTH_SECRET is securely generated

### Environment Variable Security

**Local Development:**
- Store in `backend/.env` (gitignored)
- Never share .env files via Slack/email

**Production:**
- Configured in DC Deploy dashboard
- Access restricted to admin users
- Automatically injected at runtime

---

## Support & Resources

### DC Deploy Dashboard
- Access build logs
- Monitor application status
- Configure environment variables
- View database metrics

### Documentation
- **Project Plan:** [MASTER_PROJECT_PLAN.md](MASTER_PROJECT_PLAN.md)
- **Backend Workplan:** [SHASHI_WORKPLAN.md](SHASHI_WORKPLAN.md)
- **Frontend Workplan:** [SUNITHA_WORKPLAN.md](SUNITHA_WORKPLAN.md)
- **Deployment Guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Quick Reference Commands

```bash
# Local development
cd backend && npm run dev

# Test health
curl http://localhost:3000/api/health

# Deploy to production
git push origin main

# Check deployed app
curl https://nasassakhibestg.dcdeployapp.com/api/health

# Database operations
npx prisma studio          # Open database browser
npx prisma migrate dev     # Create migration
npx prisma db push         # Push schema changes
npx prisma generate        # Regenerate client
```

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| Feb 3, 2026 19:00 IST | Initial production deployment (Build #24) | Tanuj |
| Feb 3, 2026 18:52 IST | Added public/ directory fix | Tanuj |
| Feb 3, 2026 18:45 IST | Dynamic Prisma imports | Tanuj |
| Feb 3, 2026 | Database setup (nasasakhidbstg) | Tanuj |
| Feb 3, 2026 | Initial DC Deploy configuration | Tanuj |

---

**Document Version:** 1.0
**Last Reviewed:** February 3, 2026 19:00 IST
**Status:** ✅ Production Ready
