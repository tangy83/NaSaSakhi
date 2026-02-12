# NASA Sakhi - Deployment Quick Start Guide

## Current Status ✅

Your codebase is **deployment-ready** in two modes:

1. **Monolithic** (Frontend + Backend in one app) - ✅ Fully tested locally
2. **Split** (Separate Frontend and Backend apps) - ✅ Code ready, not yet tested

---

## Which Mode Should You Choose?

### Recommended: Monolithic (For 4-Day MVP Timeline)

**Why?**
- ✅ Simpler and faster to deploy
- ✅ Already tested and working locally
- ✅ One service to manage
- ✅ Lower chance of deployment issues during customer demo
- ✅ Can easily split later if needed

**When to use:**
- You need to deploy quickly (MVP on Feb 7)
- You want to minimize deployment complexity
- You're still iterating on features

### Advanced: Split (For Production Scaling)

**Why?**
- ✅ Independent scaling of frontend/backend
- ✅ Separate deployments (update backend without touching frontend)
- ✅ Better architecture for production
- ✅ Team can work on frontend/backend independently

**When to use:**
- You have time for more complex setup
- You need to scale frontend/backend independently
- You're ready for production architecture

---

## Deployment Steps

### Option A: Monolithic Deployment (RECOMMENDED)

#### 1. Push to GitHub

```bash
cd /Users/tanujsaluja/nasa_sakhi
git add .
git commit -m "Add deployment configuration for DC Deploy"
git push origin main
```

#### 2. Create DC Deploy Application

1. Go to DC Deploy dashboard
2. Click "New Application"
3. Connect to GitHub repository: `tangy83/NaSaSakhi`
4. Branch: `main`
5. Name: `nasa-sakhi-mvp`

#### 3. Configure Build Settings

```
Build Command: npm run build
Start Command: npm start
Port: 3000
```

#### 4. Add Environment Variables

Copy these values to DC Deploy → Settings → Environment Variables:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://JQZAEG:%2B1h8t3x%7Baa@nasasakhidbstg:5432/nasasakhidbstg-db
NEXT_PUBLIC_APP_URL=https://nasa-sakhi-mvp.dcdeployapp.com
NEXTAUTH_URL=https://nasa-sakhi-mvp.dcdeployapp.com
NEXTAUTH_SECRET=<generate-new>
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```
Copy output and paste as `NEXTAUTH_SECRET` value.

#### 5. Deploy

Click "Deploy" button and wait 2-5 minutes.

#### 6. Update URLs After First Deploy

DC Deploy will give you actual URL (e.g., `https://nasa-sakhi-mvp-xyz123.dcdeployapp.com`)

Update these environment variables with actual URL:
- `NEXT_PUBLIC_APP_URL`
- `NEXTAUTH_URL`

Redeploy (DC Deploy may auto-redeploy when you change env vars).

#### 7. Verify Deployment

```bash
# Health check
curl https://your-actual-url.dcdeployapp.com/api/health

# Database test
curl https://your-actual-url.dcdeployapp.com/api/db-test

# Homepage
open https://your-actual-url.dcdeployapp.com
```

**Expected responses:**
- Health check: `{"status":"healthy",...}`
- Database test: `{"success":true,"message":"Database connection successful!",...}`
- Homepage: Purple landing page with "NASA Sakhi"

---

### Option B: Split Deployment (ADVANCED)

See [DC_DEPLOY_SPLIT_CONFIG.md](./DC_DEPLOY_SPLIT_CONFIG.md) and [DC_DEPLOY_SPLIT_TESTING.md](./DC_DEPLOY_SPLIT_TESTING.md) for detailed instructions.

**Summary:**
1. Create two DC Deploy applications (backend and frontend)
2. Deploy backend first with database and secrets
3. Deploy frontend with backend URL
4. Test CORS and cross-origin requests

---

## Files Reference

### Configuration Files
- `.env.monolithic.example` - Example for single-app deployment
- `.env.backend.example` - Example for backend service (split mode)
- `.env.frontend.example` - Example for frontend service (split mode)

### Documentation Files
- `DC_DEPLOY_ACTUAL_CONFIG.md` - Your actual DC Deploy database credentials
- `DC_DEPLOY_README.md` - General deployment guide
- `DC_DEPLOY_SPLIT_CONFIG.md` - Split architecture detailed guide
- `DC_DEPLOY_SPLIT_TESTING.md` - Testing guide for split setup
- `DEPLOYMENT_QUICKSTART.md` - This file

### Code Files (Ready for Both Modes)
- `src/middleware.ts` - CORS middleware for API routes
- `src/lib/api/client.ts` - API client for frontend → backend calls
- `next.config.ts` - Next.js config with CORS headers
- `src/lib/prisma.ts` - Database connection with pg adapter

---

## What You've Built So Far ✅

### Database Layer
- ✅ PostgreSQL 17.5 on DC Deploy
- ✅ Prisma 7 schema with 3 tables (health_checks, users, organizations)
- ✅ Connection tested successfully
- ✅ Test record created: ID `fdd856e6-15b9-44a2-a419-4d74ca80bdca`

### Backend (API)
- ✅ `/api/health` - Health check endpoint
- ✅ `/api/db-test` - Database connectivity test
- ✅ CORS middleware for split deployment
- ✅ API client for cross-domain requests

### Frontend
- ✅ Homepage with system status
- ✅ Ready to call backend API (same domain or cross-domain)

### Infrastructure
- ✅ Git repository: `tangy83/NaSaSakhi`
- ✅ Environment configuration for both deployment modes
- ✅ Documentation for team (Sunitha, Shashi)

---

## Next Steps

### Immediate (Today - Feb 3)

1. **Choose deployment mode**: Monolithic (recommended) or Split
2. **Push to GitHub**: `git push origin main`
3. **Deploy to DC Deploy**: Follow steps above
4. **Verify deployment**: Test health and db-test endpoints
5. **Share URL with team**: Update workplan documents

### This Week (Feb 4-7 - MVP Development)

1. **Sunitha**: Build 7-step registration form (frontend)
2. **Shashi**: Build registration API and data migration (backend)
3. **Integration**: Feb 6 - Connect frontend to backend
4. **Demo**: Feb 7 - Customer presentation

### Post-MVP (Feb 8+)

1. Iterate based on customer feedback
2. Consider splitting to production architecture if needed
3. Add admin dashboard
4. Implement email notifications

---

## Need Help?

### Common Issues

**Build fails on DC Deploy:**
- Check that `DATABASE_URL` is set
- Ensure `package.json` has all dependencies
- Check build logs for errors

**Database connection fails:**
- Use internal DC Deploy URL: `@nasasakhidbstg:5432`
- Ensure password is URL-encoded: `%2B1h8t3x%7Baa`
- Check database service is running in DC Deploy

**CORS errors (split mode only):**
- Ensure `ALLOWED_ORIGINS` includes frontend URL
- Check frontend is using `NEXT_PUBLIC_API_URL`
- Verify middleware is applied to API routes

### Resources

- **DC Deploy Docs**: [DC Deploy Documentation]
- **Next.js Deployment**: [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- **Prisma 7**: [Prisma Docs](https://www.prisma.io/docs)

---

## Summary

**You're ready to deploy!** 🚀

- ✅ Code is tested and working locally
- ✅ Database is connected and ready
- ✅ Documentation is complete
- ✅ Both deployment modes are supported

**Recommended:** Deploy as **Monolithic** for MVP speed, then split later for production scaling if needed.

**Timeline:**
- Today: Deploy to DC Deploy
- Tomorrow: Share URL with Sunitha and Shashi
- Feb 4-6: Build MVP features
- Feb 7: Customer demo

---

**Document Version:** 1.0
**Date:** February 3, 2026
**Status:** Deployment Ready ✅
