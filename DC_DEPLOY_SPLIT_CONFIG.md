# NASA Sakhi - Split Backend/Frontend Deployment
## Deploy Backend and Frontend as Separate Services on DC Deploy

**Architecture:** Microservices (Backend API + Frontend App)
**Date:** February 3, 2026

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     DC Deploy                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────┐      ┌──────────────────┐   │
│  │  Frontend Service    │      │  Backend Service │   │
│  │  nasa-sakhi-frontend │──────│  nasa-sakhi-api  │   │
│  │                      │ API  │                  │   │
│  │  • Next.js Pages     │ calls│  • Next.js API   │   │
│  │  • React Components  │─────▶│  • Prisma DB     │   │
│  │  • Static Assets     │      │  • Auth Logic    │   │
│  │                      │      │                  │   │
│  │  Port: 3000          │      │  Port: 4000      │   │
│  │  Public: ✅          │      │  Public: ✅      │   │
│  └──────────────────────┘      └──────────────────┘   │
│           │                             │              │
│           │                             │              │
│           └─────────────┬───────────────┘              │
│                         │                              │
│                         ▼                              │
│               ┌──────────────────┐                     │
│               │  NaSaSakhiDB     │                     │
│               │  PostgreSQL 17.5 │                     │
│               └──────────────────┘                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Service 1: Backend API

### Configuration

```yaml
Service Name: nasa-sakhi-api
Description: Backend API for NASA Sakhi
Repository: tangy83/NaSaSakhi
Branch: main
Runtime: Node.js 18.x
Port: 4000
```

### Build Commands

```bash
Install Command: npm install
Build Command: npm run build
Start Command: npm start
```

### Environment Variables (Backend)

```bash
# ========================================
# Application
# ========================================
NODE_ENV=production
PORT=4000

# ========================================
# Database (Internal Connection)
# ========================================
DATABASE_URL=postgresql://JQZAEG:%2B1h8t3x%7Baa@nasasakhidbstg:5432/nasasakhidbstg-db

# ========================================
# Authentication
# ========================================
# Frontend URL (where users will be)
NEXTAUTH_URL=https://nasa-sakhi-frontend.dcdeployapp.com

# Secret (generate: openssl rand -base64 32)
NEXTAUTH_SECRET=<paste-random-secret-here>

# ========================================
# CORS - Allow Frontend
# ========================================
ALLOWED_ORIGINS=https://nasa-sakhi-frontend.dcdeployapp.com

# ========================================
# Legacy MySQL (for data migration)
# ========================================
# MYSQL_HOST=your-mysql-host
# MYSQL_PORT=3306
# MYSQL_DATABASE=sakhi
# MYSQL_USER=your-user
# MYSQL_PASSWORD=your-password

# ========================================
# API Keys (Server-Side Only)
# ========================================
# GOOGLE_TRANSLATE_API_KEY=
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# SENDGRID_API_KEY=
```

### URLs

```
Backend API Base URL: https://nasa-sakhi-api.dcdeployapp.com
Health Check: https://nasa-sakhi-api.dcdeployapp.com/api/health
Database Test: https://nasa-sakhi-api.dcdeployapp.com/api/db-test
```

---

## 🎨 Service 2: Frontend App

### Configuration

```yaml
Service Name: nasa-sakhi-frontend
Description: Frontend web app for NASA Sakhi
Repository: tangy83/NaSaSakhi
Branch: main
Runtime: Node.js 18.x
Port: 3000
```

### Build Commands

```bash
Install Command: npm install
Build Command: npm run build
Start Command: npm start
```

### Environment Variables (Frontend)

```bash
# ========================================
# Application
# ========================================
NODE_ENV=production
PORT=3000

# ========================================
# Public URLs (Exposed to Browser)
# ========================================
# Frontend URL
NEXT_PUBLIC_APP_URL=https://nasa-sakhi-frontend.dcdeployapp.com

# Backend API URL
NEXT_PUBLIC_API_URL=https://nasa-sakhi-api.dcdeployapp.com

# ========================================
# Authentication
# ========================================
# Frontend URL (same as NEXT_PUBLIC_APP_URL)
NEXTAUTH_URL=https://nasa-sakhi-frontend.dcdeployapp.com

# Same secret as backend (important!)
NEXTAUTH_SECRET=<same-secret-as-backend>

# ========================================
# NO Database URL Here!
# ========================================
# Frontend does NOT connect to database directly
# It calls the backend API instead
```

### URLs

```
Frontend Base URL: https://nasa-sakhi-frontend.dcdeployapp.com
Homepage: https://nasa-sakhi-frontend.dcdeployapp.com/
Registration: https://nasa-sakhi-frontend.dcdeployapp.com/register/step1
```

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend First

1. **Go to DC Deploy Dashboard**
2. **Create New Application:**
   - Name: `nasa-sakhi-api`
   - Repository: `tangy83/NaSaSakhi`
   - Branch: `main`
   - Runtime: Node.js 18.x

3. **Add Environment Variables** (see Backend section above)

4. **Set Build Commands:**
   ```
   Build: npm run build
   Start: npm start
   Port: 4000
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for completion (~3-5 minutes)
   - **Note the URL:** e.g., `https://nasa-sakhi-api.dcdeployapp.com`

6. **Test Backend:**
   ```bash
   curl https://nasa-sakhi-api.dcdeployapp.com/api/health
   curl https://nasa-sakhi-api.dcdeployapp.com/api/db-test
   ```

### Step 2: Deploy Frontend Second

1. **Create Another Application:**
   - Name: `nasa-sakhi-frontend`
   - Repository: `tangy83/NaSaSakhi` (same repo!)
   - Branch: `main`
   - Runtime: Node.js 18.x

2. **Add Environment Variables** (see Frontend section above)
   - **Important:** Set `NEXT_PUBLIC_API_URL` to the backend URL from Step 1

3. **Set Build Commands:**
   ```
   Build: npm run build
   Start: npm start
   Port: 3000
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for completion
   - **Note the URL:** e.g., `https://nasa-sakhi-frontend.dcdeployapp.com`

5. **Update Backend CORS:**
   - Go back to backend service
   - Update `ALLOWED_ORIGINS` with frontend URL
   - Redeploy backend

6. **Test Frontend:**
   - Open `https://nasa-sakhi-frontend.dcdeployapp.com`
   - Should show homepage
   - Test API calls work (check browser console)

---

## 🔧 Code Changes Needed

To make the split work properly, you need a few code changes:

### 1. Update API Calls in Frontend

**Create `/src/lib/api/client.ts`:**

```typescript
// API Client for Frontend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiCall(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Example usage functions
export async function fetchCategories() {
  return apiCall('/api/reference/categories');
}

export async function submitRegistration(data: any) {
  return apiCall('/api/registration/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

### 2. Add CORS Support to Backend

**Create `/src/middleware.ts`:**

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

  // Create response
  const response = NextResponse.next();

  // Add CORS headers
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

### 3. Update next.config.ts for Backend

**For backend service, optimize for API routes only:**

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',

  // Backend: Optimize for API routes
  experimental: {
    outputFileTracingRoot: undefined,
  },

  // Allow CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGINS || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 📊 Port Configuration Summary

| Service | Port | Public Access | Purpose |
|---------|------|---------------|---------|
| **Backend** | 4000 | ✅ Yes | API endpoints only |
| **Frontend** | 3000 | ✅ Yes | Web pages + calls backend |
| **Database** | 5432 | ❌ No (internal) | PostgreSQL |

---

## 🔐 Environment Variables Summary

### Backend (nasa-sakhi-api)

**Has Access To:**
- ✅ Database credentials
- ✅ API keys and secrets
- ✅ Server-side only variables
- ❌ NO `NEXT_PUBLIC_*` variables needed

**Port:** 4000

### Frontend (nasa-sakhi-frontend)

**Has Access To:**
- ✅ Public URLs (`NEXT_PUBLIC_*`)
- ✅ Backend API URL
- ❌ NO database credentials
- ❌ NO API keys or secrets

**Port:** 3000

---

## ✅ Verification Checklist

### After Backend Deployment

- [ ] Backend deployed successfully
- [ ] Backend URL noted: `https://nasa-sakhi-api.dcdeployapp.com`
- [ ] `/api/health` returns healthy status
- [ ] `/api/db-test` returns success
- [ ] Database connection working

### After Frontend Deployment

- [ ] Frontend deployed successfully
- [ ] Frontend URL noted: `https://nasa-sakhi-frontend.dcdeployapp.com`
- [ ] Homepage loads correctly
- [ ] Browser console shows no CORS errors
- [ ] API calls to backend working
- [ ] Registration form can submit to backend

---

## 🐛 Troubleshooting

### CORS Errors

**Error:** `Access to fetch at 'https://backend...' from origin 'https://frontend...' has been blocked by CORS`

**Solution:**
1. Check `ALLOWED_ORIGINS` in backend includes frontend URL
2. Verify CORS middleware is set up
3. Redeploy backend after updating

### Frontend Can't Reach Backend

**Error:** `Failed to fetch` or `Network error`

**Solution:**
1. Verify `NEXT_PUBLIC_API_URL` is set correctly in frontend
2. Test backend URL directly in browser
3. Check backend is running and accessible

### Authentication Not Working

**Error:** NextAuth redirects fail

**Solution:**
1. Verify `NEXTAUTH_SECRET` is **exactly the same** in both services
2. Check `NEXTAUTH_URL` points to frontend URL
3. Ensure cookies are allowed cross-domain

---

## 💰 Cost Consideration

**Split Deployment:**
- 2 DC Deploy instances (may cost 2x)
- More complex to manage
- Better scalability

**Monolithic Deployment:**
- 1 DC Deploy instance (cheaper)
- Simpler to manage
- Sufficient for MVP

**Recommendation:** Start with split if you need it for your infrastructure requirements, but monolithic is fine for MVP.

---

## 📝 Quick Reference

**Backend URL Format:**
```
https://nasa-sakhi-api.dcdeployapp.com/api/health
https://nasa-sakhi-api.dcdeployapp.com/api/db-test
https://nasa-sakhi-api.dcdeployapp.com/api/reference/categories
```

**Frontend URL Format:**
```
https://nasa-sakhi-frontend.dcdeployapp.com/
https://nasa-sakhi-frontend.dcdeployapp.com/register/step1
```

**Frontend calls Backend:**
```typescript
fetch('https://nasa-sakhi-api.dcdeployapp.com/api/reference/categories')
```

---

**Ready to deploy split architecture!** Follow Steps 1-2 above. 🚀

---

**Document Version:** 1.0
**Created:** February 3, 2026
**Architecture:** Split Microservices
