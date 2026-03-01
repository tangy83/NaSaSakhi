# Quick Start Guide - Backend Development
## For Akarsha (Backend Lead)

---

## 🎯 Your Mission

Build the complete backend API for Saathi registration portal. Sunita handles all frontend - you only need to focus on backend APIs.

---

## 📍 Current Status

### ✅ Already Done
- Project setup in `backend/` directory
- Basic health check and database test endpoints
- Prisma configured
- TypeScript types defined (`src/types/api.ts`)

### ❌ What You Need to Build

**Priority 1 (Do First):**
1. Complete Prisma schema (replace minimal schema with full schema)
2. Seed reference data (30 languages, 14 categories, 76 resources, states, cities)
3. Build 5 reference data APIs (categories, resources, languages, cities, states)

**Priority 2 (Do Next):**
4. Draft save/load API
5. Registration submit API (most complex!)
6. File upload APIs (document + logo)

**Priority 3 (Do After):**
7. Server-side validation functions
8. Data migration script (121 organizations)
9. Basic authentication (if needed for MVP)

---

## 🚀 Start Here (Step-by-Step)

### Step 1: Review Your Workplan
Read `docs/AKARSHA_WORKPLAN.md` - it has detailed instructions for all 16 stages.

### Step 2: Complete Database Schema
1. Open `backend/prisma/schema.prisma`
2. Replace minimal schema with complete schema from your workplan (Stages 2-4)
3. Run:
   ```bash
   cd backend
   npx prisma format
   npx prisma generate
   npx prisma db push
   ```

### Step 3: Seed Reference Data
1. Create `backend/prisma/seed.ts` (use template from workplan Stage 5)
2. Run:
   ```bash
   npx prisma db seed
   ```

### Step 4: Build Reference Data APIs
Create these files in `backend/src/app/api/reference/`:
- `categories/route.ts`
- `resources/route.ts`
- `languages/route.ts`
- `cities/route.ts`
- `states/route.ts`

Test each:
```bash
curl http://localhost:3000/api/reference/categories
```

### Step 5: Build Registration APIs
Create:
- `backend/src/app/api/registration/draft/route.ts` (POST)
- `backend/src/app/api/registration/draft/[token]/route.ts` (GET, DELETE)
- `backend/src/app/api/registration/submit/route.ts` (POST - most complex!)

### Step 6: Build File Upload APIs
Create:
- `backend/src/app/api/upload/document/route.ts` (POST)
- `backend/src/app/api/upload/logo/route.ts` (POST)

---

## 📋 Key Files to Know

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema (you need to complete this) |
| `prisma/seed.ts` | Seed script (you need to create this) |
| `src/types/api.ts` | API contract (already defined - follow this!) |
| `src/lib/prisma.ts` | Prisma client (already set up) |
| `src/app/api/*/route.ts` | API endpoints (you need to create these) |

---

## ⚠️ Critical Rules

1. **API Response Format:** MUST match `src/types/api.ts`
   ```typescript
   // Success
   { "success": true, "data": {...} }
   
   // Error
   { "success": false, "error": "..." }
   ```

2. **Use Transactions:** Registration submit creates many records - use Prisma transactions

3. **Validate Everything:** Never trust client input - validate on server

4. **Test with Postman:** Test each endpoint before moving to next

---

## 🧪 Testing

Start dev server:
```bash
cd backend
npm run dev
```

Test endpoints:
```bash
# Health check
curl http://localhost:3000/api/health

# Database test
curl http://localhost:3000/api/db-test

# Your new APIs (after you build them)
curl http://localhost:3000/api/reference/categories
```

---

## 📚 Documentation

- **Full Guide:** `BACKEND_IMPLEMENTATION_GUIDE.md` (detailed instructions)
- **Your Workplan:** `docs/AKARSHA_WORKPLAN.md` (complete 16-stage plan)
- **API Types:** `src/types/api.ts` (response format contract)

---

## 🆘 Need Help?

1. Check your workplan (`docs/AKARSHA_WORKPLAN.md`) - it has code examples
2. Check `BACKEND_IMPLEMENTATION_GUIDE.md` for detailed steps
3. Test with Postman to debug issues
4. Check Prisma docs: https://www.prisma.io/docs

---

## ✅ Success Checklist

- [ ] Complete Prisma schema
- [ ] Seed reference data
- [ ] All 5 reference data APIs working
- [ ] Draft save/load working
- [ ] Registration submit working
- [ ] File uploads working
- [ ] All endpoints tested with Postman
- [ ] Ready for Sunita to integrate

---

**You've got this! Focus on one stage at a time, test as you go, and you'll have a solid backend ready for Sunita. 🚀**
