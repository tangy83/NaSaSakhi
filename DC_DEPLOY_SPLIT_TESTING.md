# Testing Split Backend/Frontend Setup

## Local Testing Before Deployment

### Step 1: Test Monolithic Setup (Current Working Configuration)

Before splitting, verify the current monolithic setup works:

```bash
cd /Users/tanujsaluja/nasa_sakhi

# Install dependencies (if not already done)
npm install

# Start the application
npm run dev
```

**Test endpoints:**
```bash
# Health check
curl http://localhost:3000/api/health

# Database test
curl http://localhost:3000/api/db-test

# Homepage
open http://localhost:3000
```

All should work. This is your baseline.

---

## Option A: Deploy as Monolithic (Recommended for MVP)

**Pros:**
- Simpler deployment (one service)
- Less configuration
- No CORS issues
- Faster for MVP

**Configuration:**
Single DC Deploy application with these environment variables:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://JQZAEG:%2B1h8t3x%7Baa@nasasakhidbstg:5432/nasasakhidbstg-db
NEXT_PUBLIC_APP_URL=https://your-app.dcdeployapp.com
NEXTAUTH_URL=https://your-app.dcdeployapp.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
```

**Deploy:**
1. Push to GitHub: `git push origin main`
2. Create DC Deploy application
3. Connect to GitHub repository
4. Add environment variables
5. Deploy

**Result:**
- Frontend + Backend both at: `https://your-app.dcdeployapp.com`
- API routes accessible at: `https://your-app.dcdeployapp.com/api/*`

---

## Option B: Deploy as Split (Advanced)

**Pros:**
- Independent scaling (scale frontend/backend separately)
- Independent deployment (update backend without redeploying frontend)
- Better for production architecture

**Cons:**
- More complex setup
- Two services to manage
- CORS configuration required
- Takes longer to set up

### Backend Service Configuration

**DC Deploy Application 1: nasa-sakhi-backend**

**Environment Variables:**
```bash
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://JQZAEG:%2B1h8t3x%7Baa@nasasakhidbstg:5432/nasasakhidbstg-db
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
ALLOWED_ORIGINS=https://your-frontend.dcdeployapp.com,https://your-frontend-staging.dcdeployapp.com
```

**Build Command:** `npm run build`
**Start Command:** `npm start`
**Port:** 4000

### Frontend Service Configuration

**DC Deploy Application 2: nasa-sakhi-frontend**

**Environment Variables:**
```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://your-frontend.dcdeployapp.com
NEXT_PUBLIC_API_URL=https://your-backend.dcdeployapp.com
NEXTAUTH_URL=https://your-frontend.dcdeployapp.com
```

**Build Command:** `npm run build`
**Start Command:** `npm start`
**Port:** 3000

### Testing Split Setup Locally

**Terminal 1 - Backend:**
```bash
cd /Users/tanujsaluja/nasa_sakhi

# Create .env.backend with backend variables
cat > .env.backend << 'EOF'
NODE_ENV=development
PORT=4000
DATABASE_URL="postgresql://JQZAEG:%2B1h8t3x%7Baa@nasasakhidbstg-nmjuxe7e5m.tcp-proxy-2212.dcdeploy.cloud:30095/nasasakhidbstg-db"
ALLOWED_ORIGINS=http://localhost:3000
EOF

# Load backend env and start on port 4000
export $(cat .env.backend | xargs) && npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /Users/tanujsaluja/nasa_sakhi

# Create .env.frontend with frontend variables
cat > .env.frontend << 'EOF'
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
EOF

# Load frontend env and start on port 3000
export $(cat .env.frontend | xargs) && npm run dev
```

**Test split setup:**
```bash
# Test backend directly
curl http://localhost:4000/api/health
curl http://localhost:4000/api/db-test

# Test frontend
open http://localhost:3000

# Frontend should call backend API at http://localhost:4000
```

---

## How to Choose: Monolithic vs Split?

### Choose **Monolithic** if:
- ✅ You need MVP quickly (4-day timeline)
- ✅ You want simpler deployment
- ✅ You don't need independent scaling yet
- ✅ Team is small (3 people)
- ✅ You want to deploy and iterate fast

### Choose **Split** if:
- ✅ You need to scale frontend/backend independently
- ✅ You want to deploy frontend/backend separately
- ✅ You have time for more complex setup
- ✅ You're planning long-term production architecture
- ✅ You have dedicated DevOps resources

---

## Recommendation for Feb 3-7 MVP Timeline

**Deploy as Monolithic first**, then split later if needed.

**Reasoning:**
1. **Time Constraint**: 4 days to MVP. Monolithic is faster.
2. **Simplicity**: One service, one deployment, fewer variables.
3. **Lower Risk**: Less to go wrong during customer demo.
4. **Easy Migration**: You can split later without code changes (API client already created).

**Post-MVP**: After customer approval, split architecture for production scaling.

---

## Migration Path: Monolithic → Split

The codebase is **ready for both** architectures:

**Monolithic Mode:**
- Frontend calls `/api/health` (same domain)
- `NEXT_PUBLIC_API_URL` not set → uses same domain

**Split Mode:**
- Frontend calls `NEXT_PUBLIC_API_URL/api/health` (different domain)
- `NEXT_PUBLIC_API_URL` set → uses backend domain

**To switch:** Just change environment variables, no code changes needed!

---

## Current Status (Feb 3, 2026)

✅ **Monolithic Setup**: Fully tested, database connected, ready to deploy
✅ **Split Architecture Files**: Created (API client, CORS middleware, updated config)
⏳ **Split Testing**: Not tested locally yet
⏳ **Deployment**: Not deployed yet

**Next Step:**
1. **For MVP**: Deploy monolithic to DC Deploy (faster)
2. **For Learning**: Test split setup locally first

**Both options are valid. Your call based on priorities!**

---

## Testing Checklist

### Monolithic Deployment Testing:
- [ ] Create DC Deploy application
- [ ] Add environment variables
- [ ] Deploy
- [ ] Test `https://your-app.dcdeployapp.com/api/health`
- [ ] Test `https://your-app.dcdeployapp.com/api/db-test`
- [ ] Test homepage `https://your-app.dcdeployapp.com`

### Split Deployment Testing:
- [ ] Create backend DC Deploy application
- [ ] Create frontend DC Deploy application
- [ ] Add environment variables to both
- [ ] Deploy backend first
- [ ] Deploy frontend
- [ ] Test `https://backend.dcdeployapp.com/api/health`
- [ ] Test `https://backend.dcdeployapp.com/api/db-test`
- [ ] Test `https://frontend.dcdeployapp.com` (should call backend)
- [ ] Check browser console for CORS errors

---

**Document Version:** 1.0
**Date:** February 3, 2026
**Status:** Split architecture ready, not yet tested locally
