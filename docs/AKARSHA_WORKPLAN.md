# NASA Sakhi MVP - Backend Development Plan
## Developer: Akarsha (Backend Lead - 45% of Work)
## Timeline: February 3-7, 2026

---

## 📋 Table of Contents

1. [Project Background](#project-background)
2. [Your Role in the Team](#your-role-in-the-team)
3. [Team Structure & Collaboration](#team-structure--collaboration)
4. [Technical Architecture](#technical-architecture)
5. [Your Development Stages (16 Stages)](#your-development-stages-16-stages)
6. [API Contract Reference](#api-contract-reference)
7. [Database Schema Guide](#database-schema-guide)
8. [Integration Process](#integration-process)
9. [Resources & Documentation](#resources--documentation)
10. [Success Criteria](#success-criteria)

---

## 🌟 Project Background

### What is NASA Sakhi?

NASA Sakhi is a comprehensive web-based organization registration portal designed to empower women and vulnerable children across India through accessible support services. The platform enables NGOs, support organizations, and service providers to self-register their services, undergo admin vetting, and make their offerings discoverable through a mobile app ecosystem.

**Mission:** Democratize access to support services for women and children across India by creating a centralized, multilingual, and accessible registry of organizations.

### Current State

- **Legacy System:** 121 existing organizations in a MySQL database
- **New System:** Modern Next.js + PostgreSQL architecture with AI-powered translation
- **Your Task:** Build the backend infrastructure to power the new system

### Key Statistics

- **121 organizations** to migrate from legacy MySQL
- **30 Indian languages** to support
- **14 service categories** (7 for children, 7 for women)
- **76 service resources** across all categories
- **Target:** 500+ organizations in Year 1
- **Mobile App:** 100,000+ downloads expected

### Target Users

1. **NGO Administrators** - Primary users who will register their organizations
2. **System Administrators** - NaariSamata team who vet and approve registrations
3. **Mobile App Users** - Women and families seeking services (consume your API)

---

## 👤 Your Role in the Team

### Backend Lead (45% of Total Effort)

You are responsible for building the complete backend infrastructure that powers the NASA Sakhi registration portal. Your work is the foundation upon which the frontend depends.

**Your Core Responsibilities:**

1. **Database Architecture**
   - Design complete Prisma schema with all models and relationships
   - Set up PostgreSQL database with proper indexes and constraints
   - Ensure data integrity and referential integrity

2. **API Development**
   - Build RESTful API endpoints for registration, drafts, and reference data
   - Implement proper error handling and validation
   - Return consistent JSON responses

3. **Data Migration**
   - Migrate 121 organizations from legacy MySQL to PostgreSQL
   - Transform data to match new schema
   - Ensure data quality and completeness

4. **Server-Side Validation**
   - Re-validate all client inputs (never trust the client)
   - Implement business logic (duplicate detection, cross-validation)
   - Return clear error messages

5. **File Upload**
   - Handle document uploads (registration certificates, logos)
   - Validate file types and sizes
   - Store files securely

6. **Authentication**
   - Set up NextAuth.js for email/password authentication
   - Manage user sessions
   - Role-based access control (basic for MVP)

### Why Your Work is Critical

- **Frontend depends on you:** Sunitha's UI needs your API to function
- **Data integrity:** You ensure all data is valid, consistent, and secure
- **Scalability:** Your architecture must support 500+ organizations
- **Migration:** 121 existing organizations must be preserved accurately

---

## 🤝 Team Structure & Collaboration

### Team Composition

```
┌─────────────────────────────────────────────────────┐
│                  NASA Sakhi MVP                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐         ┌──────────────────┐     │
│  │  SUNITHA     │   API   │     SASHI        │     │
│  │  Frontend    │◄────────┤  (YOU) Backend   │     │
│  │  (45%)       │ Contract│     (45%)        │     │
│  │              │         │                  │     │
│  │ - Form UI    │         │ - Database       │     │
│  │ - Validation │         │ - API Routes     │     │
│  │ - Components │         │ - Migration      │     │
│  └──────────────┘         └──────────────────┘     │
│         │                          │                │
│         │       ┌──────────┐       │                │
│         └───────┤  TANUJ   ├───────┘                │
│                 │ UI Lead  │                        │
│                 │  (10%)   │                        │
│                 │          │                        │
│                 │ - Design │                        │
│                 │ - QA     │                        │
│                 │ - Demo   │                        │
│                 └──────────┘                        │
└─────────────────────────────────────────────────────┘
```

### How You'll Work Together

**Independent Phase (Feb 4-5):**
- You work independently testing with **Postman**
- Sunitha works independently with **mock data**
- No dependencies between you

**Integration Phase (Feb 6):**
- You merge your backend first
- Sunitha switches from mocks to your real API
- You work together to fix any integration issues

**QA Phase (Feb 7):**
- Tanuj tests the complete application
- You fix any backend bugs he finds
- Final deployment to staging

### Communication

**Daily Standup:** 10 AM (15 minutes)
- What you completed yesterday
- What you're working on today
- Any blockers

**Communication Channels:**
- `#nasa-sakhi-dev` - General updates
- `#nasa-sakhi-bugs` - Bug reports
- Tag teammates when blocked

**When to Reach Out Immediately:**
- API contract needs to change (coordinate with Sunitha)
- Blocker preventing progress
- Critical bug found during testing
- Integration failure on Feb 6

---

## 🏗️ Technical Architecture

### Technology Stack

**Backend:**
- **Framework:** Next.js 15 API Routes
- **ORM:** Prisma (already configured)
- **Database:** PostgreSQL 15
- **Language:** TypeScript (strict mode)
- **Authentication:** NextAuth.js
- **Validation:** Zod schemas
- **File Storage:** Local filesystem (MVP), AWS S3/Cloudflare R2 (future)

**Development Environment:**
- **Branch:** `feature/backend-api`
- **Local Database:** PostgreSQL running on localhost
- **Testing:** Postman or Thunder Client
- **Node Version:** 18+

### Project Structure

```
nasa_sakhi/
├── prisma/
│   ├── schema.prisma          # You design this (all models)
│   ├── seed.ts                # You create this (seed reference data)
│   └── migrations/            # Generated by Prisma
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── reference/     # You build: categories, resources, languages, cities
│   │       ├── registration/  # You build: draft save, submit
│   │       ├── upload/        # You build: file uploads
│   │       └── auth/          # You configure: NextAuth.js
│   ├── lib/
│   │   ├── prisma.ts          # Database client
│   │   └── validation/
│   │       └── server/        # You build: server-side validation
│   └── types/
│       └── api.ts             # Shared TypeScript interfaces (Tanuj creates)
├── scripts/
│   ├── db-connect.ts          # MySQL connection helper (exists)
│   └── migrate-organizations.ts  # You build: migration script
└── docs/
    └── API.md                 # You document: API endpoints
```

---

## 🚀 Your Development Stages (16 Stages)

### Timeline Overview

- **Feb 3 PM:** Environment Setup
- **Feb 4:** Database schema design, migrations, seeding
- **Feb 5:** API endpoints (reference data, draft save, registration, file upload)
- **Feb 6:** Validation, migration script, integration with Sunitha
- **Feb 7:** Testing, bug fixes, deployment

---

### Stage 1: Environment Setup
**Date:** Feb 3-4 (2 hours)

**🎯 Goal:** Set up local development environment to work with DC Deploy infrastructure

---

#### 1. Clone the Repository

```bash
git clone https://github.com/tangy83/NaSaSakhi.git
cd nasa_sakhi
```

#### 2. Navigate to Backend Directory

**Important:** All backend work happens in the `backend/` directory:

```bash
cd backend
```

This is the directory that DC Deploy deploys from.

#### 3. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Next.js 15
- Prisma 7.3.0
- React 19
- TypeScript
- All other dependencies

#### 4. Configure Environment

Create `backend/.env`:

```env
# Database (Use staging database for development)
DATABASE_URL="postgresql://JQZAEG:%2B1h8t3x%7Baa@nasasakhidbstg:5432/nasasakhidbstg-db"

# Node Environment
NODE_ENV=development

# NextAuth (for local testing)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="yiPTbj2ltp7Z01URNJhaNhxOsuyuqb2VMYwVAuAeeyQ"
```

**⚠️ Important Notes:**
- We use the **staging database** (nasasakhidbstg) for development
- No local PostgreSQL installation needed
- The database is already configured with all necessary tables
- This is the same database used in production (DC Deploy)

#### 5. Generate Prisma Client

```bash
npx prisma generate
```

This generates the Prisma Client based on `prisma/schema.prisma`.

Expected output:
```
✔ Generated Prisma Client (v7.3.0) to ./node_modules/@prisma/client in XXms
```

#### 6. Test Database Connection

```bash
npm run dev
```

Open browser and test endpoints:
- **Health Check:** http://localhost:3000/api/health
  - Should return `{"status":"healthy",...}`
- **Database Test:** http://localhost:3000/api/db-test
  - Should return `{"success":true,"message":"Database connection successful!",...}`

If both work, your environment is ready! ✅

---

#### 7. Understanding the Project Structure

```
backend/                          ← DC Deploy deploys from here
├── src/
│   ├── app/                     ← Next.js App Router
│   │   ├── api/                 ← YOUR API ROUTES GO HERE
│   │   │   ├── health/          ← Health check endpoint
│   │   │   └── db-test/         ← Database test endpoint
│   │   ├── page.tsx             ← Homepage
│   │   └── layout.tsx           ← Root layout
│   ├── lib/                     ← Shared libraries
│   │   ├── prisma.ts            ← Prisma client singleton
│   │   └── api/                 ← API utilities
│   └── middleware.ts            ← CORS middleware
├── prisma/                      ← YOUR DATABASE WORK GOES HERE
│   └── schema.prisma            ← Database schema definition
├── package.json                 ← Dependencies
├── Dockerfile                   ← Docker build config (DC Deploy)
└── .env                         ← Environment variables (YOU CREATE THIS)
```

---

#### 8. Development Workflow

**Daily Development Loop:**

1. **Work in `backend/src/app/api/` for API routes**
   ```bash
   # Example: Create new API endpoint
   mkdir -p src/app/api/reference/categories
   touch src/app/api/reference/categories/route.ts
   ```

2. **Work in `backend/prisma/` for database schema**
   ```bash
   # Edit schema
   nano prisma/schema.prisma

   # Generate Prisma Client
   npx prisma generate
   ```

3. **Test locally**
   ```bash
   npm run dev
   # Test at http://localhost:3000/api/your-endpoint
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "Add: Your feature description"
   ```

5. **Deploy to DC Deploy**
   ```bash
   git push origin main
   ```

   DC Deploy automatically:
   - Detects the push
   - Builds Docker container from `backend/Dockerfile`
   - Deploys to https://nasassakhibestg.dcdeployapp.com
   - Takes ~2-3 minutes

6. **Test deployed endpoint**
   ```bash
   curl https://nasassakhibestg.dcdeployapp.com/api/your-endpoint
   ```

---

#### 9. DC Deploy Configuration (Already Done for You)

**Application:** nasassakhibestg
**Database:** nasasakhidbstg
**Status:** ✅ Successfully deployed (Build #24)

**Environment Variables (Configured in DC Deploy):**
- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL=postgresql://JQZAEG:***@nasasakhidbstg:5432/nasasakhidbstg-db`
- `NEXT_PUBLIC_APP_URL=https://nasassakhibestg.dcdeployapp.com`
- `NEXTAUTH_URL=https://nasassakhibestg.dcdeployapp.com`
- `NEXTAUTH_SECRET=[configured]`

You don't need to configure these - they're already set up in DC Deploy.

---

#### 10. Testing Your Setup

**✅ Checklist:**

1. **Local development works:**
   ```bash
   cd backend
   npm run dev
   # Open http://localhost:3000 - should see homepage
   ```

2. **Database connection works:**
   ```bash
   curl http://localhost:3000/api/db-test
   # Should return success: true
   ```

3. **Can create API routes:**
   ```bash
   # Try creating a test endpoint in src/app/api/test/route.ts
   # Verify it works locally
   ```

4. **Can deploy:**
   ```bash
   # Make a small change, commit, push to main
   # Check DC Deploy dashboard - build should start
   # Wait ~2-3 min, test deployed URL
   ```

---

**✅ Deliverable:** Local development environment working, can access staging database, can deploy to DC Deploy

---

**Next:** Proceed to Stage 2 (Prisma Schema Design)

---


---

### Stage 2: Prisma Schema Design - Core Models
**Date:** Feb 4 AM (3 hours)

**Task:** Design the core database models in `/prisma/schema.prisma`

**Models to Create:**

1. **Organization Model**
   ```prisma
   model Organization {
     id                  String   @id @default(uuid())
     name                String
     registrationType    RegistrationType
     registrationNumber  String
     yearEstablished     Int
     faithId             String?
     status              OrganizationStatus @default(PENDING)
     websiteUrl          String?

     // Relationships
     branches            OrganizationBranch[]
     contacts            ContactInformation[]
     languages           OrganizationLanguage[]
     documents           Document[]

     createdAt           DateTime @default(now())
     updatedAt           DateTime @updatedAt

     @@index([name, status])
   }

   enum RegistrationType {
     NGO
     TRUST
     GOVERNMENT
     PRIVATE
     OTHER
   }

   enum OrganizationStatus {
     PENDING
     APPROVED
     REJECTED
     CLARIFICATION_REQUESTED
   }
   ```

2. **OrganizationBranch Model**
   ```prisma
   model OrganizationBranch {
     id              String   @id @default(uuid())
     organizationId  String
     addressLine1    String
     addressLine2    String?
     cityId          String
     stateId         String
     pinCode         String   @db.VarChar(6)
     latitude        Decimal? @db.Decimal(10, 8)
     longitude       Decimal? @db.Decimal(11, 8)

     // Relationships
     organization    Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
     city            City @relation(fields: [cityId], references: [id])
     state           State @relation(fields: [stateId], references: [id])
     timings         BranchTimings[]
     categories      BranchCategory[]
     resources       BranchResource[]

     createdAt       DateTime @default(now())
     updatedAt       DateTime @updatedAt

     @@index([cityId, stateId])
     @@index([pinCode])
   }
   ```

3. **ContactInformation Model**
   ```prisma
   model ContactInformation {
     id              String   @id @default(uuid())
     organizationId  String
     isPrimary       Boolean  @default(false)
     name            String
     phone           String   @db.VarChar(10)
     email           String
     facebookUrl     String?
     instagramHandle String?
     twitterHandle   String?

     // Relationships
     organization    Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

     createdAt       DateTime @default(now())
     updatedAt       DateTime @updatedAt
   }
   ```

4. **BranchTimings Model**
   ```prisma
   model BranchTimings {
     id         String   @id @default(uuid())
     branchId   String
     dayOfWeek  DayOfWeek
     openTime   String?  // Format: "HH:MM" (24-hour)
     closeTime  String?  // Format: "HH:MM" (24-hour)
     isClosed   Boolean  @default(false)

     // Relationships
     branch     OrganizationBranch @relation(fields: [branchId], references: [id], onDelete: Cascade)

     @@unique([branchId, dayOfWeek])
   }

   enum DayOfWeek {
     MONDAY
     TUESDAY
     WEDNESDAY
     THURSDAY
     FRIDAY
     SATURDAY
     SUNDAY
   }
   ```

**Deliverable:** ✅ Core Prisma models defined with relationships

**Validation:** Run `npx prisma format` to check syntax

---

### Stage 3: Prisma Schema - Reference Data Models
**Date:** Feb 4 AM (2 hours)

**Task:** Add reference data models and junction tables

**Models to Create:**

1. **Service Models**
   ```prisma
   model ServiceCategory {
     id           String   @id @default(uuid())
     name         String
     targetGroup  TargetGroup
     displayOrder Int

     // Relationships
     resources    ServiceResource[]
     branches     BranchCategory[]

     @@unique([name, targetGroup])
   }

   enum TargetGroup {
     CHILDREN
     WOMEN
   }

   model ServiceResource {
     id          String   @id @default(uuid())
     categoryId  String
     name        String
     description String?

     // Relationships
     category    ServiceCategory @relation(fields: [categoryId], references: [id])
     branches    BranchResource[]
   }
   ```

2. **Location Models**
   ```prisma
   model State {
     id       String   @id @default(uuid())
     name     String   @unique
     code     String   @unique @db.VarChar(2)

     // Relationships
     cities   City[]
     branches OrganizationBranch[]
   }

   model City {
     id       String   @id @default(uuid())
     name     String
     stateId  String

     // Relationships
     state    State @relation(fields: [stateId], references: [id])
     branches OrganizationBranch[]

     @@unique([name, stateId])
   }
   ```

3. **Language Models**
   ```prisma
   model Language {
     id            String   @id @default(uuid())
     name          String   @unique
     code          String   @unique @db.VarChar(3)
     isActive      Boolean  @default(true)

     // Relationships
     organizations OrganizationLanguage[]
   }
   ```

4. **Other Reference Data**
   ```prisma
   model Faith {
     id   String @id @default(uuid())
     name String @unique
   }

   model SocialCategory {
     id   String @id @default(uuid())
     name String @unique
   }
   ```

5. **Junction Tables** (Many-to-Many relationships)
   ```prisma
   model BranchCategory {
     branchId   String
     categoryId String

     branch     OrganizationBranch @relation(fields: [branchId], references: [id], onDelete: Cascade)
     category   ServiceCategory @relation(fields: [categoryId], references: [id])

     @@id([branchId, categoryId])
   }

   model BranchResource {
     branchId   String
     resourceId String

     branch     OrganizationBranch @relation(fields: [branchId], references: [id], onDelete: Cascade)
     resource   ServiceResource @relation(fields: [resourceId], references: [id])

     @@id([branchId, resourceId])
   }

   model OrganizationLanguage {
     organizationId String
     languageId     String

     organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
     language       Language @relation(fields: [languageId], references: [id])

     @@id([organizationId, languageId])
   }
   ```

**Deliverable:** ✅ Complete reference data models with junction tables

---

### Stage 4: Prisma Schema - Auth & Documents
**Date:** Feb 4 PM (2 hours)

**Task:** Add authentication and document storage models

**Models to Create:**

1. **User & Authentication** (NextAuth.js compatible)
   ```prisma
   model User {
     id            String    @id @default(uuid())
     email         String    @unique
     emailVerified DateTime?
     name          String?
     password      String?   // Hashed
     role          UserRole  @default(ORGANIZATION)

     // Relationships
     accounts      Account[]
     sessions      Session[]

     createdAt     DateTime  @default(now())
     updatedAt     DateTime  @updatedAt
   }

   enum UserRole {
     ORGANIZATION
     ADMIN
     SUPER_ADMIN
   }

   model Account {
     id                String  @id @default(uuid())
     userId            String
     type              String
     provider          String
     providerAccountId String
     refresh_token     String? @db.Text
     access_token      String? @db.Text
     expires_at        Int?
     token_type        String?
     scope             String?
     id_token          String? @db.Text
     session_state     String?

     user              User @relation(fields: [userId], references: [id], onDelete: Cascade)

     @@unique([provider, providerAccountId])
   }

   model Session {
     id           String   @id @default(uuid())
     sessionToken String   @unique
     userId       String
     expires      DateTime

     user         User @relation(fields: [userId], references: [id], onDelete: Cascade)
   }

   model VerificationToken {
     identifier String
     token      String   @unique
     expires    DateTime

     @@unique([identifier, token])
   }
   ```

2. **Document Storage**
   ```prisma
   model Document {
     id             String       @id @default(uuid())
     organizationId String
     type           DocumentType
     filename       String
     fileUrl        String
     fileSize       Int          // in bytes
     mimeType       String

     // Relationships
     organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

     uploadedAt     DateTime     @default(now())
   }

   enum DocumentType {
     REGISTRATION_CERTIFICATE
     LOGO
     ADDITIONAL_CERTIFICATE
   }
   ```

3. **Draft Storage**
   ```prisma
   model RegistrationDraft {
     id        String   @id @default(uuid())
     token     String   @unique @default(uuid())
     email     String?
     draftData Json     // Stores entire form state as JSON
     expiresAt DateTime

     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt

     @@index([token])
     @@index([email])
   }
   ```

**Final Step:** Run migration
```bash
npx prisma migrate dev --name init
```

**Deliverable:** ✅ Database migrated with all tables created

**Verify:** Check PostgreSQL
```bash
psql nasa_sakhi_dev
\dt  # List all tables - should see ~20 tables
```

---

### Stage 5: Seed Reference Data
**Date:** Feb 4 PM (3 hours)

**Task:** Create seed script to populate reference data

**Create `/prisma/seed.ts`:**

```typescript
import { PrismaClient, TargetGroup } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Seed Languages (30 Indian languages)
  const languages = [
    { name: 'Hindi', code: 'hi' },
    { name: 'English', code: 'en' },
    { name: 'Bengali', code: 'bn' },
    { name: 'Telugu', code: 'te' },
    { name: 'Marathi', code: 'mr' },
    { name: 'Tamil', code: 'ta' },
    { name: 'Gujarati', code: 'gu' },
    { name: 'Urdu', code: 'ur' },
    { name: 'Kannada', code: 'kn' },
    { name: 'Odia', code: 'or' },
    { name: 'Malayalam', code: 'ml' },
    { name: 'Punjabi', code: 'pa' },
    { name: 'Assamese', code: 'as' },
    { name: 'Maithili', code: 'mai' },
    { name: 'Sanskrit', code: 'sa' },
    { name: 'Konkani', code: 'kok' },
    { name: 'Nepali', code: 'ne' },
    { name: 'Sindhi', code: 'sd' },
    { name: 'Dogri', code: 'doi' },
    { name: 'Kashmiri', code: 'ks' },
    { name: 'Manipuri', code: 'mni' },
    { name: 'Bodo', code: 'brx' },
    { name: 'Santali', code: 'sat' },
    { name: 'Meitei', code: 'mni' },
    { name: 'Tulu', code: 'tcy' },
    { name: 'Bhojpuri', code: 'bho' },
    { name: 'Magahi', code: 'mag' },
    { name: 'Haryanvi', code: 'bgc' },
    { name: 'Rajasthani', code: 'raj' },
    { name: 'Chhattisgarhi', code: 'hne' },
  ];

  await prisma.language.createMany({ data: languages, skipDuplicates: true });
  console.log('✅ Seeded 30 languages');

  // 2. Seed Indian States
  const states = [
    { name: 'Andhra Pradesh', code: 'AP' },
    { name: 'Arunachal Pradesh', code: 'AR' },
    { name: 'Assam', code: 'AS' },
    { name: 'Bihar', code: 'BR' },
    { name: 'Chhattisgarh', code: 'CG' },
    { name: 'Goa', code: 'GA' },
    { name: 'Gujarat', code: 'GJ' },
    { name: 'Haryana', code: 'HR' },
    { name: 'Himachal Pradesh', code: 'HP' },
    { name: 'Jharkhand', code: 'JH' },
    { name: 'Karnataka', code: 'KA' },
    { name: 'Kerala', code: 'KL' },
    { name: 'Madhya Pradesh', code: 'MP' },
    { name: 'Maharashtra', code: 'MH' },
    { name: 'Manipur', code: 'MN' },
    { name: 'Meghalaya', code: 'ML' },
    { name: 'Mizoram', code: 'MZ' },
    { name: 'Nagaland', code: 'NL' },
    { name: 'Odisha', code: 'OD' },
    { name: 'Punjab', code: 'PB' },
    { name: 'Rajasthan', code: 'RJ' },
    { name: 'Sikkim', code: 'SK' },
    { name: 'Tamil Nadu', code: 'TN' },
    { name: 'Telangana', code: 'TG' },
    { name: 'Tripura', code: 'TR' },
    { name: 'Uttar Pradesh', code: 'UP' },
    { name: 'Uttarakhand', code: 'UK' },
    { name: 'West Bengal', code: 'WB' },
    // Union Territories
    { name: 'Andaman and Nicobar Islands', code: 'AN' },
    { name: 'Chandigarh', code: 'CH' },
    { name: 'Dadra and Nagar Haveli and Daman and Diu', code: 'DH' },
    { name: 'Delhi', code: 'DL' },
    { name: 'Jammu and Kashmir', code: 'JK' },
    { name: 'Ladakh', code: 'LA' },
    { name: 'Lakshadweep', code: 'LD' },
    { name: 'Puducherry', code: 'PY' },
  ];

  await prisma.state.createMany({ data: states, skipDuplicates: true });
  console.log('✅ Seeded 36 states/UTs');

  // 3. Seed Major Cities (top 50 for MVP)
  const karnataka = await prisma.state.findUnique({ where: { code: 'KA' } });
  const maharashtra = await prisma.state.findUnique({ where: { code: 'MH' } });
  const delhi = await prisma.state.findUnique({ where: { code: 'DL' } });
  const tamilNadu = await prisma.state.findUnique({ where: { code: 'TN' } });
  const westBengal = await prisma.state.findUnique({ where: { code: 'WB' } });

  const cities = [
    // Karnataka
    { name: 'Bangalore', stateId: karnataka!.id },
    { name: 'Mysore', stateId: karnataka!.id },
    { name: 'Mangalore', stateId: karnataka!.id },
    // Maharashtra
    { name: 'Mumbai', stateId: maharashtra!.id },
    { name: 'Pune', stateId: maharashtra!.id },
    { name: 'Nagpur', stateId: maharashtra!.id },
    // Delhi
    { name: 'New Delhi', stateId: delhi!.id },
    { name: 'Delhi', stateId: delhi!.id },
    // Tamil Nadu
    { name: 'Chennai', stateId: tamilNadu!.id },
    { name: 'Coimbatore', stateId: tamilNadu!.id },
    // West Bengal
    { name: 'Kolkata', stateId: westBengal!.id },
    // Add more cities as needed...
  ];

  await prisma.city.createMany({ data: cities, skipDuplicates: true });
  console.log('✅ Seeded major cities');

  // 4. Seed Service Categories (14 categories)
  const categories = [
    // For Children (7)
    { name: 'Education Support', targetGroup: TargetGroup.CHILDREN, displayOrder: 1 },
    { name: 'Child Protection', targetGroup: TargetGroup.CHILDREN, displayOrder: 2 },
    { name: 'Healthcare', targetGroup: TargetGroup.CHILDREN, displayOrder: 3 },
    { name: 'Nutrition', targetGroup: TargetGroup.CHILDREN, displayOrder: 4 },
    { name: 'Recreation', targetGroup: TargetGroup.CHILDREN, displayOrder: 5 },
    { name: 'Skill Development', targetGroup: TargetGroup.CHILDREN, displayOrder: 6 },
    { name: 'Legal Aid for Children', targetGroup: TargetGroup.CHILDREN, displayOrder: 7 },
    // For Women (7)
    { name: "Women's Healthcare", targetGroup: TargetGroup.WOMEN, displayOrder: 8 },
    { name: 'Legal Support for Women', targetGroup: TargetGroup.WOMEN, displayOrder: 9 },
    { name: 'Skill Training', targetGroup: TargetGroup.WOMEN, displayOrder: 10 },
    { name: 'Shelter/Safe Housing', targetGroup: TargetGroup.WOMEN, displayOrder: 11 },
    { name: 'Counseling Services', targetGroup: TargetGroup.WOMEN, displayOrder: 12 },
    { name: 'Economic Empowerment', targetGroup: TargetGroup.WOMEN, displayOrder: 13 },
    { name: 'Awareness Programs', targetGroup: TargetGroup.WOMEN, displayOrder: 14 },
  ];

  await prisma.serviceCategory.createMany({ data: categories, skipDuplicates: true });
  console.log('✅ Seeded 14 service categories');

  // 5. Seed Service Resources (76 resources)
  const educationSupport = await prisma.serviceCategory.findFirst({
    where: { name: 'Education Support' },
  });

  const resources = [
    // Education Support resources
    { name: 'After-school tutoring', categoryId: educationSupport!.id },
    { name: 'Scholarship programs', categoryId: educationSupport!.id },
    { name: 'School supplies distribution', categoryId: educationSupport!.id },
    { name: 'Digital literacy programs', categoryId: educationSupport!.id },
    { name: 'Career counseling', categoryId: educationSupport!.id },
    // Add all 76 resources across 14 categories...
    // (For brevity, showing sample - you'll need to add all 76)
  ];

  await prisma.serviceResource.createMany({ data: resources, skipDuplicates: true });
  console.log('✅ Seeded service resources');

  // 6. Seed Faith options
  const faiths = [
    { name: 'Hindu' },
    { name: 'Muslim' },
    { name: 'Christian' },
    { name: 'Sikh' },
    { name: 'Buddhist' },
    { name: 'Jain' },
    { name: 'Other' },
    { name: 'Prefer not to say' },
  ];

  await prisma.faith.createMany({ data: faiths, skipDuplicates: true });
  console.log('✅ Seeded faith options');

  // 7. Seed Social Categories
  const socialCategories = [
    { name: 'General' },
    { name: 'Scheduled Caste (SC)' },
    { name: 'Scheduled Tribe (ST)' },
    { name: 'Other Backward Class (OBC)' },
    { name: 'Economically Weaker Section (EWS)' },
  ];

  await prisma.socialCategory.createMany({ data: socialCategories, skipDuplicates: true });
  console.log('✅ Seeded social categories');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Configure package.json:**
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

**Run seed:**
```bash
npx prisma db seed
```

**Deliverable:** ✅ Database populated with all reference data (30 languages, 36 states, 14 categories, 76 resources, cities, faith, social categories)

**Verify:**
```bash
psql nasa_sakhi_dev
SELECT COUNT(*) FROM "Language";  -- Should be 30
SELECT COUNT(*) FROM "State";     -- Should be 36
SELECT COUNT(*) FROM "ServiceCategory";  -- Should be 14
```

---

### Stage 6: API Route - Reference Data Endpoints
**Date:** Feb 5 AM (3 hours)

**Task:** Build API endpoints for reference data (dropdowns, lists)

**1. Categories Endpoint**

Create `/src/app/api/reference/categories/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
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

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}
```

**Test with Postman:**
```
GET http://localhost:3000/api/reference/categories
Expected: { success: true, data: [...14 categories] }
```

**2. Resources Endpoint**

Create `/src/app/api/reference/resources/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');

    const where = categoryId ? { categoryId } : {};

    const resources = await prisma.serviceResource.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: resources,
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch resources',
      },
      { status: 500 }
    );
  }
}
```

**Test:**
```
GET http://localhost:3000/api/reference/resources
GET http://localhost:3000/api/reference/resources?categoryId=<uuid>
```

**3. Languages Endpoint**

Create `/src/app/api/reference/languages/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const languages = await prisma.language.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        code: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: languages,
    });
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch languages',
      },
      { status: 500 }
    );
  }
}
```

**4. Cities Endpoint (with search)**

Create `/src/app/api/reference/cities/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    const where = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const cities = await prisma.city.findMany({
      where,
      take: 50, // Limit results for performance
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        stateId: true,
        state: {
          select: {
            name: true,
          },
        },
      },
    });

    // Transform to match API contract
    const transformedCities = cities.map((city) => ({
      id: city.id,
      name: city.name,
      stateId: city.stateId,
      stateName: city.state.name,
    }));

    return NextResponse.json({
      success: true,
      data: transformedCities,
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cities',
      },
      { status: 500 }
    );
  }
}
```

**Test:**
```
GET http://localhost:3000/api/reference/cities
GET http://localhost:3000/api/reference/cities?search=Bang
```

**5. States Endpoint**

Create `/src/app/api/reference/states/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const states = await prisma.state.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: states,
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch states',
      },
      { status: 500 }
    );
  }
}
```

**Deliverable:** ✅ All 5 reference data API endpoints working and tested with Postman

---

### Stage 7: API Route - Draft Save/Load
**Date:** Feb 5 AM (3 hours)

**Task:** Implement draft save and resume functionality

**Create `/src/app/api/registration/draft/route.ts`:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Save draft
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, draftData } = body;

    // Set expiry to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const draft = await prisma.registrationDraft.create({
      data: {
        email,
        draftData,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        token: draft.token,
        expiresAt: draft.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save draft',
      },
      { status: 500 }
    );
  }
}
```

**Create `/src/app/api/registration/draft/[token]/route.ts`:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Load draft
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    const draft = await prisma.registrationDraft.findUnique({
      where: { token },
    });

    if (!draft) {
      return NextResponse.json(
        {
          success: false,
          error: 'Draft not found or expired',
        },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date() > draft.expiresAt) {
      // Delete expired draft
      await prisma.registrationDraft.delete({ where: { token } });

      return NextResponse.json(
        {
          success: false,
          error: 'Draft has expired',
        },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      data: draft.draftData,
    });
  } catch (error) {
    console.error('Error loading draft:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load draft',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete draft
export async function DELETE(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    await prisma.registrationDraft.delete({
      where: { token },
    });

    return NextResponse.json({
      success: true,
      message: 'Draft deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting draft:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete draft',
      },
      { status: 500 }
    );
  }
}
```

**Test with Postman:**

1. Save draft:
```
POST http://localhost:3000/api/registration/draft
Body (JSON):
{
  "email": "test@example.com",
  "draftData": {
    "organizationName": "Test NGO",
    "step": 2
  }
}
Expected: { success: true, data: { token: "...", expiresAt: "..." } }
```

2. Load draft:
```
GET http://localhost:3000/api/registration/draft/<token-from-above>
Expected: { success: true, data: { organizationName: "Test NGO", step: 2 } }
```

3. Delete draft:
```
DELETE http://localhost:3000/api/registration/draft/<token>
Expected: { success: true, message: "Draft deleted successfully" }
```

**Deliverable:** ✅ Draft save/load/delete API working

---

### Stage 8: API Route - Registration Submission
**Date:** Feb 5 PM (4 hours)

**Task:** Build the main registration submission endpoint (most complex)

**Create `/src/app/api/registration/submit/route.ts`:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const registrationSchema = z.object({
  organizationName: z.string().min(3).max(100),
  registrationType: z.enum(['NGO', 'TRUST', 'GOVERNMENT', 'PRIVATE', 'OTHER']),
  registrationNumber: z.string().min(1).max(50),
  yearEstablished: z.number().int().min(1800).max(new Date().getFullYear()),
  faithId: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal('')),

  primaryContact: z.object({
    name: z.string().min(2).max(100),
    phone: z.string().length(10),
    email: z.string().email(),
  }),

  secondaryContact: z.object({
    name: z.string().min(2).max(100),
    phone: z.string().length(10),
    email: z.string().email(),
  }).optional(),

  facebookUrl: z.string().url().optional().or(z.literal('')),
  instagramHandle: z.string().optional(),
  twitterHandle: z.string().optional(),

  categoryIds: z.array(z.string()).min(1),
  resourceIds: z.array(z.string()).min(1),

  branches: z.array(z.object({
    addressLine1: z.string().min(10).max(200),
    addressLine2: z.string().max(200).optional(),
    cityId: z.string(),
    stateId: z.string(),
    pinCode: z.string().length(6),
    timings: z.array(z.object({
      dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
      openTime: z.string().optional(),
      closeTime: z.string().optional(),
      isClosed: z.boolean(),
    })).optional(),
  })).min(1),

  languageIds: z.array(z.string()).min(1),

  documents: z.object({
    registrationCertificateUrl: z.string(),
    logoUrl: z.string().optional(),
    additionalCertificateUrls: z.array(z.string()).optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = registrationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validationResult.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check for duplicate (organization name + first branch city)
    const firstBranch = data.branches[0];
    const existingOrg = await prisma.organization.findFirst({
      where: {
        name: data.organizationName,
        branches: {
          some: {
            cityId: firstBranch.cityId,
          },
        },
      },
    });

    if (existingOrg) {
      return NextResponse.json(
        {
          success: false,
          error: 'An organization with this name already exists in this city',
        },
        { status: 409 }
      );
    }

    // Create organization with all related data in a transaction
    const organization = await prisma.$transaction(async (tx) => {
      // 1. Create organization
      const org = await tx.organization.create({
        data: {
          name: data.organizationName,
          registrationType: data.registrationType,
          registrationNumber: data.registrationNumber,
          yearEstablished: data.yearEstablished,
          faithId: data.faithId,
          websiteUrl: data.websiteUrl || null,
          status: 'PENDING',
        },
      });

      // 2. Create contacts
      await tx.contactInformation.create({
        data: {
          organizationId: org.id,
          isPrimary: true,
          name: data.primaryContact.name,
          phone: data.primaryContact.phone,
          email: data.primaryContact.email,
          facebookUrl: data.facebookUrl || null,
          instagramHandle: data.instagramHandle || null,
          twitterHandle: data.twitterHandle || null,
        },
      });

      if (data.secondaryContact) {
        await tx.contactInformation.create({
          data: {
            organizationId: org.id,
            isPrimary: false,
            name: data.secondaryContact.name,
            phone: data.secondaryContact.phone,
            email: data.secondaryContact.email,
          },
        });
      }

      // 3. Create branches with timings
      for (const branchData of data.branches) {
        const branch = await tx.organizationBranch.create({
          data: {
            organizationId: org.id,
            addressLine1: branchData.addressLine1,
            addressLine2: branchData.addressLine2 || null,
            cityId: branchData.cityId,
            stateId: branchData.stateId,
            pinCode: branchData.pinCode,
          },
        });

        // Create branch timings if provided
        if (branchData.timings && branchData.timings.length > 0) {
          await tx.branchTimings.createMany({
            data: branchData.timings.map((timing) => ({
              branchId: branch.id,
              dayOfWeek: timing.dayOfWeek,
              openTime: timing.openTime || null,
              closeTime: timing.closeTime || null,
              isClosed: timing.isClosed,
            })),
          });
        }

        // Create branch-category associations
        await tx.branchCategory.createMany({
          data: data.categoryIds.map((categoryId) => ({
            branchId: branch.id,
            categoryId,
          })),
        });

        // Create branch-resource associations
        await tx.branchResource.createMany({
          data: data.resourceIds.map((resourceId) => ({
            branchId: branch.id,
            resourceId,
          })),
        });
      }

      // 4. Create organization-language associations
      await tx.organizationLanguage.createMany({
        data: data.languageIds.map((languageId) => ({
          organizationId: org.id,
          languageId,
        })),
      });

      // 5. Create document records
      await tx.document.create({
        data: {
          organizationId: org.id,
          type: 'REGISTRATION_CERTIFICATE',
          filename: 'registration-certificate',
          fileUrl: data.documents.registrationCertificateUrl,
          fileSize: 0, // Will be updated by file upload endpoint
          mimeType: 'application/pdf',
        },
      });

      if (data.documents.logoUrl) {
        await tx.document.create({
          data: {
            organizationId: org.id,
            type: 'LOGO',
            filename: 'logo',
            fileUrl: data.documents.logoUrl,
            fileSize: 0,
            mimeType: 'image/jpeg',
          },
        });
      }

      if (data.documents.additionalCertificateUrls) {
        for (const url of data.documents.additionalCertificateUrls) {
          await tx.document.create({
            data: {
              organizationId: org.id,
              type: 'ADDITIONAL_CERTIFICATE',
              filename: 'additional-certificate',
              fileUrl: url,
              fileSize: 0,
              mimeType: 'application/pdf',
            },
          });
        }
      }

      return org;
    });

    return NextResponse.json({
      success: true,
      data: {
        organizationId: organization.id,
        status: organization.status,
        message: 'Registration submitted successfully. Your submission will be reviewed by our team within 48 hours.',
      },
    });

  } catch (error) {
    console.error('Error submitting registration:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit registration. Please try again.',
      },
      { status: 500 }
    );
  }
}
```

**Test with Postman:**
Create a complete JSON payload with all fields and POST to:
```
POST http://localhost:3000/api/registration/submit
```

**Deliverable:** ✅ Registration submission API working with full validation and database transactions

---

### Stage 9: API Route - File Upload
**Date:** Feb 5 PM (3 hours)

**Task:** Implement file upload for documents and logos

**Install dependencies:**
```bash
npm install formidable
npm install -D @types/formidable
```

**Create `/src/app/api/upload/document/route.ts`:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Only PDF, JPEG, and PNG are allowed.',
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'File size exceeds 5MB limit.',
        },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = path.join(uploadsDir, filename);

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return public URL
    const fileUrl = `/uploads/documents/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        filename,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type,
      },
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload document',
      },
      { status: 500 }
    );
  }
}
```

**Create `/src/app/api/upload/logo/route.ts`:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Only JPEG, PNG, and SVG are allowed.',
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'File size exceeds 2MB limit.',
        },
        { status: 400 }
      );
    }

    // Create uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'logos');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = path.join(uploadsDir, filename);

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return public URL
    const fileUrl = `/uploads/logos/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        filename,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type,
      },
    });

  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload logo',
      },
      { status: 500 }
    );
  }
}
```

**Test with Postman:**
```
POST http://localhost:3000/api/upload/document
Body: form-data
Key: file
Value: [Select a PDF file]

Expected: { success: true, data: { filename: "...", fileUrl: "/uploads/documents/...", ... } }
```

**Deliverable:** ✅ File upload API working for both documents and logos

---

### Stage 10: Server-Side Validation
**Date:** Feb 6 AM (3 hours)

**Task:** Implement comprehensive server-side validation functions

**Create `/src/lib/validation/server/index.ts`:**

```typescript
import { prisma } from '@/lib/prisma';

export class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export async function validateOrganizationName(name: string): Promise<void> {
  if (!name || name.trim().length < 3) {
    throw new ValidationError('organizationName', 'Organization name must be at least 3 characters');
  }

  if (name.length > 100) {
    throw new ValidationError('organizationName', 'Organization name cannot exceed 100 characters');
  }
}

export async function validateEmail(email: string): Promise<void> {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    throw new ValidationError('email', 'Invalid email format');
  }
}

export async function validatePhone(phone: string): Promise<void> {
  // Must be exactly 10 digits and start with 6/7/8/9
  const phoneRegex = /^[6-9]\d{9}$/;

  if (!phoneRegex.test(phone)) {
    throw new ValidationError('phone', 'Phone number must be 10 digits starting with 6, 7, 8, or 9');
  }
}

export async function validatePinCode(pinCode: string, cityId: string): Promise<void> {
  // Must be exactly 6 digits
  if (!/^\d{6}$/.test(pinCode)) {
    throw new ValidationError('pinCode', 'PIN code must be exactly 6 digits');
  }

  // TODO: Cross-validate PIN code with city (requires PIN code database)
  // For MVP, we'll skip this validation
}

export async function checkDuplicateOrganization(
  name: string,
  cityId: string
): Promise<boolean> {
  const existing = await prisma.organization.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive', // Case-insensitive
      },
      branches: {
        some: {
          cityId,
        },
      },
    },
  });

  return !!existing;
}

export async function validateYear(year: number): Promise<void> {
  const currentYear = new Date().getFullYear();

  if (year < 1800 || year > currentYear) {
    throw new ValidationError(
      'yearEstablished',
      `Year must be between 1800 and ${currentYear}`
    );
  }
}

export async function validateCategoryAndResources(
  categoryIds: string[],
  resourceIds: string[]
): Promise<void> {
  // Check that all resources belong to selected categories
  const resources = await prisma.serviceResource.findMany({
    where: {
      id: {
        in: resourceIds,
      },
    },
    select: {
      id: true,
      categoryId: true,
    },
  });

  const resourceCategoryIds = new Set(resources.map((r) => r.categoryId));

  for (const categoryId of categoryIds) {
    if (!resourceCategoryIds.has(categoryId)) {
      throw new ValidationError(
        'resources',
        `No resources selected for category ${categoryId}`
      );
    }
  }
}
```

**Update your registration endpoint to use these validators.**

**Deliverable:** ✅ Comprehensive server-side validation functions

---

### Stage 11: Data Migration Script
**Date:** Feb 6 AM (4 hours)

**Task:** Migrate 121 organizations from MySQL to PostgreSQL

**Create `/scripts/migrate-organizations.ts`:**

```typescript
import { PrismaClient } from '@prisma/client';
import { createMySQLConnection } from './db-connect';

const prisma = new PrismaClient();

interface LegacyOrganization {
  id: number;
  name: string;
  type: string;
  registration_number: string;
  year_established: number;
  // Add other fields from your MySQL schema
}

async function migrateOrganizations() {
  console.log('🚀 Starting organization migration...');

  const mysql = await createMySQLConnection();

  try {
    // Fetch all organizations from MySQL
    const [rows] = await mysql.query<LegacyOrganization[]>(
      'SELECT * FROM organizations'
    );

    console.log(`Found ${rows.length} organizations to migrate`);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const legacyOrg of rows) {
      try {
        // Transform and insert into PostgreSQL
        await prisma.organization.create({
          data: {
            name: legacyOrg.name,
            registrationType: mapRegistrationType(legacyOrg.type),
            registrationNumber: legacyOrg.registration_number,
            yearEstablished: legacyOrg.year_established,
            status: 'APPROVED', // Existing orgs are pre-approved
            // Map other fields...
          },
        });

        successCount++;
        console.log(`✅ Migrated: ${legacyOrg.name}`);
      } catch (error) {
        errorCount++;
        const errorMsg = `Failed to migrate ${legacyOrg.name}: ${error}`;
        errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    // Generate report
    console.log('\n📊 Migration Report:');
    console.log(`Total: ${rows.length}`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);

    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.forEach((err) => console.log(`  - ${err}`));
    }

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mysql.end();
    await prisma.$disconnect();
  }
}

function mapRegistrationType(type: string): string {
  const mapping: Record<string, string> = {
    'NGO': 'NGO',
    'Trust': 'TRUST',
    'Government': 'GOVERNMENT',
    'Private': 'PRIVATE',
  };

  return mapping[type] || 'OTHER';
}

migrateOrganizations();
```

**Run migration:**
```bash
npx ts-node scripts/migrate-organizations.ts
```

**Deliverable:** ✅ 121 organizations migrated successfully with report

---

### Stage 12-16: Remaining Stages

Due to space constraints, I'll summarize the remaining stages:

**Stage 12: Authentication Setup (Feb 6 PM - 3 hours)**
- Configure NextAuth.js in `/src/app/api/auth/[...nextauth]/route.ts`
- Set up Credentials provider (email/password)
- Hash passwords with bcrypt
- Test login/signup flow

**Stage 13: API Testing & Documentation (Feb 7 AM - 2 hours)**
- Create `/docs/API.md` documenting all endpoints
- Test all endpoints end-to-end with Postman
- Create Postman collection for Sunitha to use

**Stage 14: Integration with Frontend (Feb 7 AM - 2 hours)**
- Work with Sunitha to connect frontend to your API
- Debug any contract mismatches
- Adjust response formats if needed

**Stage 15: Database Optimization (Feb 7 PM - 2 hours)**
- Add indexes for performance
- Test query performance
- Optimize slow queries

**Stage 16: Bug Fixes & Deployment (Feb 7 PM - 2 hours)**
- Fix bugs from integration testing
- Deploy to staging environment
- Smoke test on staging

---

## 📚 API Contract Reference

**Shared TypeScript Interfaces** (from `/src/types/api.ts`):

These interfaces are shared between you and Sunitha. Your API responses must match these exactly.

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface ServiceCategory {
  id: string;
  name: string;
  targetGroup: 'children' | 'women';
  displayOrder: number;
}

export interface ServiceResource {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
}

// ... (see plan file for complete interfaces)
```

**Your responses MUST follow this format:**
- Success: `{ success: true, data: {...} }`
- Error: `{ success: false, error: "message" }`
- Validation errors: `{ success: false, errors: [{field: "...", message: "..."}] }`

---

## 🗄️ Database Schema Guide

**Key Relationships:**

1. **Organization → OrganizationBranch** (One-to-Many)
   - One organization can have multiple branches

2. **OrganizationBranch → BranchTimings** (One-to-Many)
   - Each branch has 7 timings (one per day)

3. **Organization → ContactInformation** (One-to-Many)
   - One primary contact + optional secondary contact

4. **OrganizationBranch ↔ ServiceCategory** (Many-to-Many via BranchCategory)
   - Branches can offer multiple categories

5. **OrganizationBranch ↔ ServiceResource** (Many-to-Many via BranchResource)
   - Branches provide specific resources

6. **Organization ↔ Language** (Many-to-Many via OrganizationLanguage)
   - Organizations support multiple languages

**Important Constraints:**

- Use `onDelete: Cascade` for dependent data (branches, contacts, timings)
- Use unique indexes for duplicate prevention (name + city)
- Use regular indexes for query performance (status, cityId)

---

## 🔗 Integration Process

### How Your Work Connects to Sunitha's

**Phase 1: Independent Development (Feb 4-5)**
- You build and test APIs with Postman
- Sunitha builds UI with mock data
- No coordination needed

**Phase 2: Integration (Feb 6 AM)**
- You merge your backend to `integration/mvp` branch first
- Deploy to staging
- Sunitha switches from mocks to your real API
- You test together locally

**Phase 3: Staging Deployment (Feb 6 PM)**
- Sunitha merges her frontend
- Full application deployed to staging
- You both test end-to-end flows
- Fix any bugs together

**Integration Checklist:**
- [ ] All API endpoints return correct response format
- [ ] Response data matches TypeScript interfaces
- [ ] Validation errors are clear and actionable
- [ ] File uploads work correctly
- [ ] Draft save/load works
- [ ] Registration submission creates all related records
- [ ] Database constraints prevent invalid data

**Common Integration Issues:**

1. **Response format mismatch**
   - Solution: Ensure you follow `ApiResponse<T>` format exactly

2. **Missing fields in response**
   - Solution: Add missing fields or make them optional in TypeScript interface

3. **Validation too strict**
   - Solution: Adjust validation to match frontend expectations

4. **CORS errors**
   - Solution: Next.js API routes don't have CORS issues (same origin)

---

## 📚 Resources & Documentation

### Reference Documents

1. **PRD.md** - Full product requirements (1,329 lines)
   - Read sections 4, 6, 10 for functional requirements
   - Section 6.2 has complete database schema reference

2. **PRD-DataEntry-Validation.md** - Validation specifications (1,378 lines)
   - Every field, every validation rule
   - Error messages to return

3. **Plan File** - Overall team plan with integration details
   - Located at `/Users/tanujsaluja/.claude/plans/nifty-discovering-stroustrup.md`

### Technical Documentation

- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **NextAuth.js:** https://next-auth.js.org
- **Zod Validation:** https://zod.dev

### Database Tools

```bash
# Connect to PostgreSQL
psql nasa_sakhi_dev

# Useful commands
\dt              # List tables
\d "Organization"  # Describe table
SELECT COUNT(*) FROM "Organization";  # Count records

# Prisma commands
npx prisma studio  # Visual database browser
npx prisma migrate reset  # Reset database (WARNING: deletes all data)
npx prisma db seed  # Re-run seed script
```

---

## ✅ Success Criteria

By **Feb 7 evening**, you must have:

### Must-Have (P0):
- ✅ Complete Prisma schema with all models (20+ tables)
- ✅ Database seeded with reference data (30 languages, 14 categories, 76 resources, cities)
- ✅ All 10+ API endpoints working and tested:
  - 5 reference data endpoints (categories, resources, languages, cities, states)
  - 3 draft endpoints (save, load, delete)
  - 1 registration submission endpoint
  - 2 file upload endpoints (document, logo)
- ✅ Server-side validation enforced (never trust client)
- ✅ 121 organizations migrated from MySQL
- ✅ File upload functional (local storage for MVP)
- ✅ Integrated with Sunitha's frontend
- ✅ Deployed to staging environment

### Should-Have (P1):
- ✅ Basic authentication with NextAuth.js
- ✅ API documentation in `/docs/API.md`
- ✅ Database indexes for performance
- ✅ Error handling and logging
- ✅ Postman collection for testing

### Nice-to-Have (P2, can skip for MVP):
- Advanced duplicate detection (fuzzy matching)
- Email notification integration
- S3/R2 file storage (using local storage for MVP is fine)
- Rate limiting
- API versioning

---

## 🚨 Important Reminders

1. **API Contract is Sacred**
   - Your responses MUST match TypeScript interfaces exactly
   - Coordinate with Sunitha before changing any interface

2. **Never Trust the Client**
   - Re-validate everything on the server
   - Frontend validation is for UX, not security

3. **Use Transactions**
   - Registration submission creates multiple records - use Prisma transactions
   - All-or-nothing: if one fails, rollback everything

4. **Test Everything with Postman**
   - Test each endpoint before moving to next stage
   - Don't wait until integration day to find bugs

5. **Communication is Key**
   - Daily standup at 10 AM
   - Reach out immediately if blocked
   - Integration day (Feb 6) requires close coordination

6. **Data Quality Matters**
   - Migration script must preserve all 121 organizations accurately
   - Generate report to verify migration success

---

## 📞 Contact & Support

**Team Members:**
- **Tanuj** (UI Lead, 10%) - Design feedback, QA, customer demo
- **Sunitha** (Frontend Lead, 45%) - Registration form UI
- **You (Akarsha)** (Backend Lead, 45%) - API & database

**Communication:**
- Daily Standup: 10 AM (15 minutes)
- Slack: `#nasa-sakhi-dev` for updates
- Reach out to Tanuj for:
  - Blockers preventing progress
  - API contract changes
  - Architecture decisions

**Good Luck! You're building the foundation for a platform that will help thousands of organizations serve women and children across India. 🚀**

---

**Last Updated:** Feb 3, 2026 19:00 IST
**Status:** DC Deploy deployment configured and ready
