# NASA Sakhi - DC Deploy Deployment Guide

## 🎯 Quick Deploy to DC Deploy (Bare Minimum)

This guide will help you deploy NASA Sakhi to DC Deploy with minimal configuration.

---

## ✅ Prerequisites

1. **DC Deploy Account** - Sign up at DC Deploy
2. **GitHub Repository** - `tangy83/NaSaSakhi`
3. **Database Created** - PostgreSQL database in DC Deploy ✓ (You have this!)

---

## 📋 Step 1: Configure DC Deploy Application

### Basic Settings

```yaml
Application Name: nasa-sakhi-staging
Runtime: Node.js 18.x or 20.x
Build Command: npm run build
Start Command: npm start
Port: 3000
```

### Important Files DC Deploy Needs

✅ `package.json` - Has all dependencies and scripts
✅ `next.config.ts` - Next.js configuration
✅ `tsconfig.json` - TypeScript configuration
✅ `prisma/schema.prisma` - Database schema

---

## 🔑 Step 2: Set Environment Variables in DC Deploy

**Go to DC Deploy → Your App → Settings → Environment Variables**

Add these (minimum required):

```bash
# Application
NODE_ENV=production
PORT=3000

# Database (DC Deploy should auto-provide this if using managed database)
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Public URL (DC Deploy will give you this - update after first deploy)
NEXT_PUBLIC_APP_URL=https://your-app.dcdeployapp.com

# Authentication
NEXTAUTH_URL=https://your-app.dcdeployapp.com
NEXTAUTH_SECRET=<paste-output-of: openssl rand -base64 32>
```

### How to Generate NEXTAUTH_SECRET

Run this in your terminal:
```bash
openssl rand -base64 32
```

Copy the output and paste it as the value for `NEXTAUTH_SECRET`.

---

## 🚀 Step 3: Deploy

1. **Connect GitHub**
   - In DC Deploy, connect to repository: `tangy83/NaSaSakhi`
   - Select branch: `main`

2. **Deploy**
   - Click "Deploy" button
   - Wait for build to complete (2-5 minutes)

3. **After Deployment**
   - DC Deploy will give you a URL like: `https://nasa-sakhi.dcdeployapp.com`
   - Update these environment variables with the actual URL:
     - `NEXT_PUBLIC_APP_URL`
     - `NEXTAUTH_URL`
   - Redeploy (or DC Deploy may auto-redeploy)

---

## ✅ Step 4: Verify Deployment

### Test Endpoints

Once deployed, test these URLs in your browser:

```bash
# Health Check (should return JSON with status: healthy)
https://your-app.dcdeployapp.com/api/health

# Database Test (should return JSON with success: true)
https://your-app.dcdeployapp.com/api/db-test

# Homepage (should show NASA Sakhi landing page)
https://your-app.dcdeployapp.com/
```

### Expected Responses

**✅ /api/health**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-03T...",
  "service": "NASA Sakhi API",
  "version": "1.0.0",
  "environment": "production"
}
```

**✅ /api/db-test**
```json
{
  "success": true,
  "message": "Database connection successful!",
  "data": {
    "testRecord": { ... },
    "totalHealthChecks": 1,
    "database": {
      "type": "PostgreSQL",
      "connected": true
    }
  }
}
```

**✅ Homepage**
Should show colorful landing page with "NASA Sakhi" title and system status.

---

## 🗄️ Step 5: Initialize Database

After successful deployment, initialize your database:

### Option A: Run migrations via DC Deploy terminal (if available)

```bash
# SSH or use DC Deploy web terminal
npx prisma migrate deploy
```

### Option B: Run from local machine

```bash
# Use DC Deploy database URL from environment variables
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### Option C: Push schema without migrations

```bash
DATABASE_URL="postgresql://..." npx prisma db push
```

This will create the tables:
- `health_checks` - For testing
- `users` - For authentication
- `organizations` - For registrations

---

## 📊 Complete Environment Variables Reference

### Minimum (Required)

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=<DC-Deploy-provides>
NEXT_PUBLIC_APP_URL=<DC-Deploy-provides>
NEXTAUTH_URL=<same-as-above>
NEXTAUTH_SECRET=<generate-random>
```

### Full List (Optional extras)

```bash
# Logging
LOG_LEVEL=info

# File Upload
UPLOAD_DIR=/tmp/uploads
MAX_FILE_SIZE=5242880

# Legacy MySQL (for data migration later)
# MYSQL_HOST=
# MYSQL_PORT=3306
# MYSQL_DATABASE=
# MYSQL_USER=
# MYSQL_PASSWORD=
```

---

## 🔍 Troubleshooting

### Build Fails

**Error:** `prisma generate` fails
**Solution:** Make sure `DATABASE_URL` is set in environment variables

**Error:** `next build` fails
**Solution:** Check that `next.config.ts` and `tsconfig.json` exist at root

### Database Connection Fails

**Check:** Visit `/api/db-test` to see detailed error

**Common causes:**
- DATABASE_URL not set correctly
- Database not accessible from DC Deploy
- Database credentials wrong

**Solution:**
- Verify DATABASE_URL format: `postgresql://user:pass@host:5432/dbname`
- Check database is running in DC Deploy
- Test connection from DC Deploy terminal

### Application Won't Start

**Check logs in DC Deploy**

**Common causes:**
- PORT not set (should be 3000)
- NODE_ENV not set
- Missing environment variables

---

## 📝 Post-Deployment: Share Configuration

After successful deployment, share these with your team:

```bash
# Application URL
Staging URL: https://<your-actual-url>.dcdeployapp.com

# Database URL (from DC Deploy environment variables)
DATABASE_URL: postgresql://user:pass@host:5432/dbname

# For team to test:
Health Check: https://<your-url>.dcdeployapp.com/api/health
DB Test: https://<your-url>.dcdeployapp.com/api/db-test
```

Update the workplan documents with these actual values!

---

## 🎯 What You've Achieved

After following this guide, you have:

✅ **Frontend Working** - Next.js app serving React pages
✅ **Backend Working** - API routes responding at `/api/*`
✅ **Database Connected** - PostgreSQL accessible and tested
✅ **Git Integration** - Auto-deploys from GitHub
✅ **Health Checks** - Monitoring endpoints functional

**Next Steps:**
- Share configuration with Shashi and Sunitha
- Update workplan documents with actual URLs
- Team can start building features on top of this foundation

---

## 📖 Additional Resources

- **Full deployment guide**: `deployment/DEPLOYMENT-GUIDE.md`
- **DC Deploy setup**: `docs/DC_DEPLOY_CONFIG.md`
- **Team access checklist**: `docs/DC_DEPLOY_ACCESS_CHECKLIST.md`

---

**Ready to deploy? Follow Steps 1-5 above!** 🚀
