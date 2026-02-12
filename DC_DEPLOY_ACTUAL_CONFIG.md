# NASA Sakhi - DC Deploy Configuration (Actual Values)
## ✅ Your Database is Ready and Tested!

**Date:** February 3, 2026
**Status:** Database Connected ✅ | Full Stack Tested ✅

---

## 🎯 Your DC Deploy Database Details

### Database Information

```yaml
Database Name: nasasakhidbstg-db
Database Type: PostgreSQL 17.5
Status: ✅ Connected and tested
Tables Created: ✅ health_checks, users, organizations
```

### Connection Strings

**External (for local development):**
```
postgresql://JQZAEG:+1h8t3x{aa@nasasakhidbstg-nmjuxe7e5m.tcp-proxy-2212.dcdeploy.cloud:30095/nasasakhidbstg-db
```

**Internal (for DC Deploy deployment):**
```
postgresql://JQZAEG:+1h8t3x{aa@nasasakhidbstg:5432/nasasakhidbstg-db
```

**URL-Encoded (for .env files):**
```bash
# Password special characters encoded: + → %2B, { → %7B
# External (local dev):
DATABASE_URL="postgresql://JQZAEG:%2B1h8t3x%7Baa@nasasakhidbstg-nmjuxe7e5m.tcp-proxy-2212.dcdeploy.cloud:30095/nasasakhidbstg-db"

# Internal (DC Deploy app):
DATABASE_URL="postgresql://JQZAEG:%2B1h8t3x%7Baa@nasasakhidbstg:5432/nasasakhidbstg-db"
```

---

## 🚀 DC Deploy Application Configuration

### Step 1: Create New Application in DC Deploy

```yaml
Application Name: nasa-sakhi-staging
Runtime: Node.js 18.x (or 20.x)
Repository: tangy83/NaSaSakhi
Branch: main
```

### Step 2: Set Build Commands

```bash
Build Command: npm run build
Start Command: npm start
Port: 3000
```

### Step 3: Add Environment Variables

**Go to: DC Deploy Dashboard → Your App → Settings → Environment Variables**

Add these variables exactly as shown:

```bash
# Application Environment
NODE_ENV=production
PORT=3000

# Database (Use INTERNAL connection for DC Deploy)
DATABASE_URL=postgresql://JQZAEG:%2B1h8t3x%7Baa@nasasakhidbstg:5432/nasasakhidbstg-db

# Application URL (Update after first deploy)
NEXT_PUBLIC_APP_URL=https://your-app.dcdeployapp.com
NEXTAUTH_URL=https://your-app.dcdeployapp.com

# Authentication Secret (Generate new one)
NEXTAUTH_SECRET=<paste-output-of-command-below>
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` value.

---

## ✅ Deployment Checklist

### Before Deploying

- [x] Database created in DC Deploy
- [x] Database schema pushed (tables created)
- [x] Local testing successful
- [ ] Code committed to GitHub
- [ ] DC Deploy application created
- [ ] Environment variables configured
- [ ] Build commands set

### After First Deploy

- [ ] Note the URL DC Deploy provides (e.g., `https://nasa-sakhi-xyz.dcdeployapp.com`)
- [ ] Update these environment variables with actual URL:
  - `NEXT_PUBLIC_APP_URL`
  - `NEXTAUTH_URL`
- [ ] Trigger redeploy (or DC Deploy may auto-redeploy)

---

## 🧪 Verification URLs

After deployment, test these endpoints:

```bash
# Replace <your-url> with actual DC Deploy URL

# Homepage (should show purple landing page)
https://<your-url>.dcdeployapp.com/

# Health check (should return JSON with status: healthy)
https://<your-url>.dcdeployapp.com/api/health

# Database test (should return success: true)
https://<your-url>.dcdeployapp.com/api/db-test
```

### Expected Responses

**✅ /api/health**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-03T...",
  "service": "NASA Sakhi API",
  "version": "0.1.0",
  "environment": "production"
}
```

**✅ /api/db-test**
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
      "version": "PostgreSQL 17.5 ...",
      "connected": true
    }
  }
}
```

---

## 📦 Required NPM Packages

Your `package.json` already includes these (no action needed):

```json
{
  "dependencies": {
    "@prisma/client": "^7.3.0",
    "@prisma/adapter-pg": "latest",
    "pg": "latest",
    "next": "^15.1.6",
    "react": "^19.0.0",
    "prisma": "^7.3.0"
  }
}
```

---

## 🔧 Configuration Files Summary

All these files are ready in your repository:

| File | Purpose | Status |
|------|---------|--------|
| `next.config.ts` | Next.js configuration | ✅ Created |
| `tsconfig.json` | TypeScript configuration | ✅ Created |
| `prisma/schema.prisma` | Database schema | ✅ Created |
| `src/app/page.tsx` | Homepage | ✅ Created |
| `src/app/api/health/route.ts` | Health check endpoint | ✅ Created |
| `src/app/api/db-test/route.ts` | Database test endpoint | ✅ Created |
| `src/lib/prisma.ts` | Prisma client (with pg adapter) | ✅ Created |
| `.env.local` | Local environment variables | ✅ Created (do not commit) |
| `.env` | Database URL (do not commit) | ✅ Updated |

---

## 🎯 Quick Deploy Steps

### 1. Commit Changes to GitHub

```bash
cd /Users/tanujsaluja/nasa_sakhi

# Add all changes
git add next.config.ts tsconfig.json prisma/ src/ package.json DC_DEPLOY_ACTUAL_CONFIG.md DC_DEPLOY_README.md

# Commit
git commit -m "Add simplified Next.js structure for DC Deploy

- Single app structure (frontend + backend combined)
- Prisma 7 with pg adapter
- Health check and database test endpoints
- Ready for DC Deploy deployment"

# Push to GitHub
git push origin main
```

### 2. Configure DC Deploy

1. Go to DC Deploy dashboard
2. Create new application
3. Connect to GitHub repository: `tangy83/NaSaSakhi`
4. Add environment variables (see Step 3 above)
5. Set build commands (see Step 2 above)

### 3. Deploy

1. Click "Deploy" button
2. Wait 2-5 minutes for build
3. Note the URL DC Deploy provides
4. Update `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL` with actual URL
5. Redeploy

### 4. Verify

Visit the test URLs (see Verification URLs section above)

---

## 📊 What's Been Tested Locally

✅ **Homepage** - Renders correctly with system status
✅ **Health Check API** - Returns healthy status
✅ **Database Connection** - Successfully connected to DC Deploy PostgreSQL
✅ **Database Write** - Created test record in `health_checks` table
✅ **Database Read** - Retrieved record count
✅ **PostgreSQL Version** - Confirmed PostgreSQL 17.5

**Test Record Created:**
```json
{
  "id": "fdd856e6-15b9-44a2-a419-4d74ca80bdca",
  "status": "ok",
  "timestamp": "2026-02-03T16:50:53.684Z"
}
```

---

## 🔑 Credentials Summary

**For DC Deploy Environment Variables:**

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://JQZAEG:%2B1h8t3x%7Baa@nasasakhidbstg:5432/nasasakhidbstg-db
NEXT_PUBLIC_APP_URL=<update-after-deploy>
NEXTAUTH_URL=<update-after-deploy>
NEXTAUTH_SECRET=<generate-random>
```

**Database Credentials:**
```
Host: nasasakhidbstg (internal) or nasasakhidbstg-nmjuxe7e5m.tcp-proxy-2212.dcdeploy.cloud (external)
Port: 5432 (internal) or 30095 (external)
Database: nasasakhidbstg-db
Username: JQZAEG
Password: +1h8t3x{aa (use %2B1h8t3x%7Baa in connection strings)
```

---

## 📞 After Deployment

**Share these with me:**

```
Deployed URL: ___________________________
Status: ___________________________
```

And I'll:
1. Update all workplan documents with actual values
2. Share configuration with Shashi and Sunitha
3. Verify everything is ready for team development

---

## 🎉 You're Ready to Deploy!

All configuration is complete. Your next action:

1. Commit changes to GitHub (see Quick Deploy Steps above)
2. Configure DC Deploy application
3. Deploy!
4. Share the URL with me

**Everything is tested and working locally. Deployment should be straightforward!** 🚀

---

**Document Version:** 1.0
**Last Updated:** February 3, 2026
**Database Status:** ✅ Connected and Tested
**Local Testing:** ✅ All Endpoints Working
