# Backend Implementation Guide for Akarsha
## NASA Sakhi - Complete Backend Development Roadmap

**Developer:** Akarsha (Backend Lead)  
**Teammate:** Sunita (Frontend Lead - you don't need to work on frontend)  
**Timeline:** Follow your workplan stages

---

## 📊 Current Status Assessment

### ✅ What's Already Done

1. **Project Setup:**
   - ✅ Next.js 15 project structure in `backend/` directory
   - ✅ Prisma 7.3.0 configured
   - ✅ PostgreSQL connection setup (`src/lib/prisma.ts`)
   - ✅ Basic health check endpoint (`/api/health`)
   - ✅ Database test endpoint (`/api/db-test`)
   - ✅ TypeScript types defined (`src/types/api.ts`)

2. **Dependencies Installed:**
   - ✅ Next.js, React, TypeScript
   - ✅ Prisma ORM
   - ✅ Zod for validation
   - ✅ NextAuth.js (for future auth)
   - ✅ All required packages in `package.json`

### ❌ What Needs to Be Built

**Following your workplan (16 stages), you need to implement:**

1. **Database Schema (Stages 2-4):**
   - Complete Prisma schema with all models
   - Reference data models (categories, resources, languages, cities, states)
   - Authentication models (User, Account, Session)
   - Document storage models

2. **Reference Data APIs (Stage 6):**
   - `/api/reference/categories` - GET
   - `/api/reference/resources` - GET
   - `/api/reference/languages` - GET
   - `/api/reference/cities` - GET
   - `/api/reference/states` - GET

3. **Registration APIs (Stages 7-8):**
   - `/api/registration/draft` - POST (save draft)
   - `/api/registration/draft/[token]` - GET (load draft), DELETE
   - `/api/registration/submit` - POST (submit registration)

4. **File Upload APIs (Stage 9):**
   - `/api/upload/document` - POST
   - `/api/upload/logo` - POST

5. **Server-Side Validation (Stage 10):**
   - Validation functions in `src/lib/validation/server/`

6. **Data Migration (Stage 11):**
   - Migration script for 121 organizations from MySQL

7. **Authentication (Stage 12):**
   - NextAuth.js setup (basic for MVP)

---

## 🚀 Step-by-Step Implementation Plan

### **PHASE 1: Database Schema (Priority: CRITICAL)**

#### Step 1: Complete Prisma Schema

**File:** `backend/prisma/schema.prisma`

**Current state:** Only has minimal test models (HealthCheck, User, Organization)

**What to do:** Replace with complete schema from your workplan (Stage 2-4)

**Key Models to Add:**
- Organization (with all fields)
- OrganizationBranch
- ContactInformation
- BranchTimings
- ServiceCategory
- ServiceResource
- BranchCategory (junction table)
- BranchResource (junction table)
- Language
- OrganizationLanguage (junction table)
- State
- City
- Faith
- SocialCategory
- Document
- RegistrationDraft
- User (NextAuth compatible)
- Account, Session, VerificationToken (for NextAuth)

**Action Items:**
1. Open `backend/prisma/schema.prisma`
2. Replace the minimal schema with the complete schema from your workplan (lines 452-830 in AKARSHA_WORKPLAN.md)
3. Run `npx prisma format` to validate syntax
4. Run `npx prisma generate` to generate Prisma Client
5. Run `npx prisma db push` to apply schema to database (or create migration)

**⚠️ Important:** You're using the staging database, so be careful with schema changes!

---

#### Step 2: Seed Reference Data

**File:** Create `backend/prisma/seed.ts`

**What to do:** Create seed script to populate:
- 30 languages
- 36 states/UTs
- Major cities (50+)
- 14 service categories
- 76 service resources
- Faith options
- Social categories

**Action Items:**
1. Create `backend/prisma/seed.ts` (use template from workplan lines 838-1039)
2. Update `package.json` to add seed script:
   ```json
   {
     "prisma": {
       "seed": "tsx prisma/seed.ts"
     }
   }
   ```
3. Run `npx prisma db seed` to populate database

**Test:** Query database to verify data:
```bash
# Connect to database and check
SELECT COUNT(*) FROM "Language"; -- Should be 30
SELECT COUNT(*) FROM "State"; -- Should be 36
SELECT COUNT(*) FROM "ServiceCategory"; -- Should be 14
```

---

### **PHASE 2: Reference Data APIs (Priority: HIGH)**

These APIs are needed by Sunita's frontend for dropdowns and lists.

#### Step 3: Categories Endpoint

**File:** Create `backend/src/app/api/reference/categories/route.ts`

**Implementation:**
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { ApiResponse, ServiceCategory } from '@/types/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        targetGroup: true,
        displayOrder: true,
      },
    });

    const response: ApiResponse<ServiceCategory[]> = {
      success: true,
      data: categories,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
```

**Test:**
```bash
curl http://localhost:3000/api/reference/categories
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Education Support",
      "targetGroup": "CHILDREN",
      "displayOrder": 1
    },
    ...
  ]
}
```

---

#### Step 4: Resources Endpoint

**File:** Create `backend/src/app/api/reference/resources/route.ts`

**Implementation:** Similar to categories, but with optional `categoryId` query parameter

**Test:**
```bash
curl http://localhost:3000/api/reference/resources
curl http://localhost:3000/api/reference/resources?categoryId=<uuid>
```

---

#### Step 5: Languages Endpoint

**File:** Create `backend/src/app/api/reference/languages/route.ts`

**Implementation:** Return all active languages

**Test:**
```bash
curl http://localhost:3000/api/reference/languages
```

---

#### Step 6: Cities Endpoint

**File:** Create `backend/src/app/api/reference/cities/route.ts`

**Implementation:** Support optional `search` query parameter for filtering

**Test:**
```bash
curl http://localhost:3000/api/reference/cities
curl http://localhost:3000/api/reference/cities?search=Bang
```

---

#### Step 7: States Endpoint

**File:** Create `backend/src/app/api/reference/states/route.ts`

**Implementation:** Return all states/UTs

**Test:**
```bash
curl http://localhost:3000/api/reference/states
```

---

### **PHASE 3: Registration APIs (Priority: CRITICAL)**

These are the core APIs for the registration form.

#### Step 8: Draft Save/Load API

**Files:**
- `backend/src/app/api/registration/draft/route.ts` (POST - save draft)
- `backend/src/app/api/registration/draft/[token]/route.ts` (GET - load, DELETE - delete)

**Implementation:** Follow workplan Stage 7 (lines 1310-1475)

**Key Points:**
- Save draft data as JSON in `RegistrationDraft` table
- Generate unique token (UUID)
- Set expiry to 30 days
- Return token for resume link

**Test:**
```bash
# Save draft
curl -X POST http://localhost:3000/api/registration/draft \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "draftData": {
      "organizationName": "Test NGO",
      "step": 2
    }
  }'

# Load draft (use token from above)
curl http://localhost:3000/api/registration/draft/<token>

# Delete draft
curl -X DELETE http://localhost:3000/api/registration/draft/<token>
```

---

#### Step 9: Registration Submit API

**File:** Create `backend/src/app/api/registration/submit/route.ts`

**Implementation:** Follow workplan Stage 8 (lines 1478-1750)

**This is the MOST COMPLEX endpoint!**

**Key Requirements:**
1. Validate all input using Zod schema
2. Check for duplicate organizations (name + city)
3. Use Prisma transaction to create:
   - Organization
   - Contacts (primary + optional secondary)
   - Branches (with timings)
   - Branch-category associations
   - Branch-resource associations
   - Organization-language associations
   - Documents
4. Return organization ID and status

**Validation Schema:** Use Zod to validate:
- Organization name (3-100 chars)
- Registration type (enum)
- Phone (10 digits, starts with 6/7/8/9)
- Email (valid format)
- PIN code (6 digits)
- Year (1800 to current year)
- Required fields

**Test:**
```bash
curl -X POST http://localhost:3000/api/registration/submit \
  -H "Content-Type: application/json" \
  -d @test-registration.json
```

**⚠️ Important:** Use Prisma transactions! If any part fails, rollback everything.

---

### **PHASE 4: File Upload APIs (Priority: HIGH)**

#### Step 10: Document Upload

**File:** Create `backend/src/app/api/upload/document/route.ts`

**Implementation:** Follow workplan Stage 9 (lines 1752-1854)

**Key Requirements:**
- Accept multipart/form-data
- Validate file type (PDF, JPEG, PNG)
- Validate file size (max 5MB)
- Save to `public/uploads/documents/`
- Return file URL

**Test:**
```bash
curl -X POST http://localhost:3000/api/upload/document \
  -F "file=@test-document.pdf"
```

---

#### Step 11: Logo Upload

**File:** Create `backend/src/app/api/upload/logo/route.ts`

**Implementation:** Similar to document upload, but:
- Max size: 2MB
- Allowed types: JPEG, PNG, SVG
- Save to `public/uploads/logos/`

**Test:**
```bash
curl -X POST http://localhost:3000/api/upload/logo \
  -F "file=@test-logo.png"
```

---

### **PHASE 5: Server-Side Validation (Priority: MEDIUM)**

#### Step 12: Validation Functions

**File:** Create `backend/src/lib/validation/server/index.ts`

**Implementation:** Follow workplan Stage 10 (lines 1957-2076)

**Functions to Create:**
- `validateOrganizationName()`
- `validateEmail()`
- `validatePhone()`
- `validatePinCode()`
- `checkDuplicateOrganization()`
- `validateYear()`
- `validateCategoryAndResources()`

**Usage:** Import and use in registration submit endpoint

---

### **PHASE 6: Data Migration (Priority: MEDIUM)**

#### Step 13: Migration Script

**File:** Create `backend/scripts/migrate-organizations.ts`

**Implementation:** Follow workplan Stage 11 (lines 2079-2181)

**Key Requirements:**
- Connect to MySQL legacy database
- Fetch 121 organizations
- Transform data to match new schema
- Insert into PostgreSQL using Prisma
- Generate migration report

**Test:**
```bash
npm run db:migrate-organizations
```

**⚠️ Important:** Test on staging database first! Keep MySQL as backup.

---

### **PHASE 7: Authentication (Priority: LOW for MVP)**

#### Step 14: NextAuth.js Setup

**File:** Create `backend/src/app/api/auth/[...nextauth]/route.ts`

**Implementation:** Basic email/password authentication

**For MVP:** This can be simplified or deferred if not critical for initial release.

---

## 📋 Implementation Checklist

Use this checklist to track your progress:

### Database & Schema
- [ ] Complete Prisma schema with all models
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push` (or create migration)
- [ ] Create seed script
- [ ] Run seed script and verify data

### Reference Data APIs
- [ ] `/api/reference/categories` - GET
- [ ] `/api/reference/resources` - GET
- [ ] `/api/reference/languages` - GET
- [ ] `/api/reference/cities` - GET
- [ ] `/api/reference/states` - GET
- [ ] Test all endpoints with Postman/curl

### Registration APIs
- [ ] `/api/registration/draft` - POST
- [ ] `/api/registration/draft/[token]` - GET
- [ ] `/api/registration/draft/[token]` - DELETE
- [ ] `/api/registration/submit` - POST
- [ ] Test with complete registration payload

### File Upload APIs
- [ ] `/api/upload/document` - POST
- [ ] `/api/upload/logo` - POST
- [ ] Test file uploads

### Validation
- [ ] Create validation functions
- [ ] Integrate into registration endpoint
- [ ] Test validation errors

### Migration
- [ ] Create migration script
- [ ] Test migration on staging
- [ ] Generate migration report

### Testing
- [ ] Test all endpoints with Postman
- [ ] Verify response formats match `api.ts` types
- [ ] Test error handling
- [ ] Test edge cases

---

## 🧪 Testing Strategy

### 1. Unit Testing (Manual)
Test each endpoint individually:

```bash
# Health check
curl http://localhost:3000/api/health

# Database test
curl http://localhost:3000/api/db-test

# Reference data
curl http://localhost:3000/api/reference/categories
curl http://localhost:3000/api/reference/resources
curl http://localhost:3000/api/reference/languages
curl http://localhost:3000/api/reference/cities
curl http://localhost:3000/api/reference/states

# Draft save
curl -X POST http://localhost:3000/api/registration/draft \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","draftData":{}}'

# Registration submit (use real data)
curl -X POST http://localhost:3000/api/registration/submit \
  -H "Content-Type: application/json" \
  -d @test-payload.json
```

### 2. Integration Testing
Test complete registration flow:
1. Save draft
2. Load draft
3. Upload documents
4. Submit registration
5. Verify data in database

### 3. Postman Collection
Create a Postman collection with all endpoints for easy testing.

---

## 🔗 Integration with Sunita's Frontend

### API Contract
**CRITICAL:** Your API responses MUST match the types in `src/types/api.ts`

**Response Format:**
```typescript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": "Error message"
}

// Validation Errors
{
  "success": false,
  "errors": [
    { "field": "organizationName", "message": "..." }
  ]
}
```

### Endpoints Sunita Will Use

1. **Reference Data (for dropdowns):**
   - GET `/api/reference/categories`
   - GET `/api/reference/resources?categoryId=...`
   - GET `/api/reference/languages`
   - GET `/api/reference/cities?search=...`
   - GET `/api/reference/states`

2. **Draft Management:**
   - POST `/api/registration/draft` (auto-save every 2 min)
   - GET `/api/registration/draft/:token` (resume)

3. **File Upload:**
   - POST `/api/upload/document` (registration certificate)
   - POST `/api/upload/logo` (organization logo)

4. **Registration:**
   - POST `/api/registration/submit` (final submission)

### Testing Together (Feb 6)
1. You deploy your backend first
2. Sunita switches from mock data to your real API
3. Test together and fix any mismatches
4. Ensure all response formats match

---

## 🚨 Important Reminders

1. **Never Trust the Client:** Always validate on server, even if frontend validates
2. **Use Transactions:** Registration submit creates multiple records - use Prisma transactions
3. **Follow API Contract:** Response format must match `src/types/api.ts` exactly
4. **Test Everything:** Use Postman to test each endpoint before moving to next
5. **Database:** You're using staging database - be careful with schema changes
6. **Error Handling:** Return clear, actionable error messages
7. **Logging:** Use `console.error()` for errors (will help with debugging)

---

## 📚 Reference Documents

1. **Your Workplan:** `docs/AKARSHA_WORKPLAN.md` (2458 lines - your complete guide)
2. **API Types:** `src/types/api.ts` (shared contract with frontend)
3. **PRD:** `PRD.md` (product requirements)
4. **Database Schema:** See workplan Stages 2-4

---

## 🎯 Priority Order

**Week 1 (Critical Path):**
1. ✅ Complete Prisma schema
2. ✅ Seed reference data
3. ✅ Build all 5 reference data APIs
4. ✅ Build draft save/load API
5. ✅ Build registration submit API

**Week 2 (High Priority):**
6. ✅ Build file upload APIs
7. ✅ Add server-side validation
8. ✅ Test all endpoints

**Week 3 (Medium Priority):**
9. ✅ Create migration script
10. ✅ Test migration
11. ✅ Integration with Sunita

**Week 4 (Polish):**
12. ✅ Bug fixes
13. ✅ Documentation
14. ✅ Deployment

---

## 💡 Quick Start Commands

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not done)
npm install

# Generate Prisma Client
npx prisma generate

# Start development server
npm run dev

# Test health endpoint
curl http://localhost:3000/api/health

# Test database connection
curl http://localhost:3000/api/db-test

# Format Prisma schema
npx prisma format

# View database in Prisma Studio
npx prisma studio

# Seed database
npx prisma db seed
```

---

## 🆘 When You're Stuck

1. **Check your workplan:** `docs/AKARSHA_WORKPLAN.md` has detailed examples
2. **Check API types:** `src/types/api.ts` shows expected response formats
3. **Test with Postman:** Use Postman to debug API issues
4. **Check Prisma docs:** https://www.prisma.io/docs
5. **Check Next.js API routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

## ✅ Success Criteria

By the end of your work, you should have:

- ✅ Complete database schema with all tables
- ✅ All reference data seeded (30 languages, 14 categories, 76 resources, etc.)
- ✅ All 10+ API endpoints working
- ✅ Server-side validation on all inputs
- ✅ File upload working
- ✅ Draft save/load working
- ✅ Registration submission working
- ✅ All endpoints tested with Postman
- ✅ API responses match `api.ts` types exactly
- ✅ Ready for Sunita to integrate

---

**Good luck, Akarsha! You're building the foundation for a platform that will help thousands of organizations. 🚀**

**Remember:** Focus on backend only. Sunita will handle all frontend work. Your job is to make sure the APIs are rock-solid and ready for her to use.
