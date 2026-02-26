# NaariSamata Organization Registration Portal (NASA Sakhi)

A full-stack organization registration portal for NaariSamata, enabling NGOs and support organizations to self-register, and providing volunteers and admins with a review + data management workflow.

## Project Overview

**Mission:** Empowering women and vulnerable children across India through accessible support services.

### Key Features

- Multi-step organization registration form (7 steps)
- Volunteer portal with organization review and approval workflow
- Admin data management panels (service categories/resources, faiths, social categories, regional data, languages)
- Multi-language support for 30 Indian languages (translation via Bhashini API)
- REST API for mobile app integration
- 121 legacy organizations migrated from previous system
- 76 detailed service resources across 14 categories

## Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Database:** PostgreSQL 17 (via Prisma ORM)
- **Authentication:** NextAuth.js (email + password)
- **Translation:** Bhashini API
- **File Storage:** AWS S3 / Cloudflare R2
- **Hosting:** Vercel (root/frontend app), standalone Docker server (backend app)

## Architecture

The project uses a **split-deployment architecture**:

- **Root app** (`src/`) — the primary Next.js app deployed to Vercel. Handles the public registration form, volunteer portal, admin CRUD API routes, and mobile/public API endpoints.
- **Backend app** (`backend/`) — a separate Next.js app with `output: 'standalone'` for Docker deployment on a dedicated server (`NaSaSakhiBEStg`).

Both apps share the same PostgreSQL database (`NaSaSakhiDB`). The root app's Prisma client is generated from `backend/prisma/schema.prisma` via the root `prisma.config.ts`, giving it access to all 25 database models.

## Staging Infrastructure

- `NaSaSakhiDB` — PostgreSQL 17 database instance
- `NaSaSakhiBEStg` — Backend standalone server (Docker)
- `NaSaSakhiFEStg` — Frontend/root app on Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Generate Prisma client (uses backend/prisma/schema.prisma)
npx prisma generate

# Run database migrations
npx prisma db push

# Seed initial data
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Environment Variables

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
BHASHINI_USER_ID=...
BHASHINI_API_KEY=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
```

## Project Structure

```
nasa-sakhi/
├── src/
│   ├── app/
│   │   ├── api/                  # API routes (deployed with root app on Vercel)
│   │   │   ├── admin/            # Admin CRUD routes (ADMIN/SUPER_ADMIN only)
│   │   │   │   ├── service-categories/   # GET, POST, PATCH [id], DELETE [id]
│   │   │   │   ├── service-resources/    # GET, POST, PATCH [id], DELETE [id]
│   │   │   │   ├── faiths/               # GET, POST, PATCH [id], DELETE [id]
│   │   │   │   ├── social-categories/    # GET, POST, PATCH [id], DELETE [id]
│   │   │   │   ├── regions/              # GET, POST (cities), PATCH [id], DELETE [id]
│   │   │   │   └── languages/            # GET, POST, PATCH [id], DELETE [id]
│   │   │   ├── auth/             # NextAuth.js signup + session
│   │   │   ├── orgs/             # Public org search API (mobile app)
│   │   │   ├── reference/        # Reference data (categories, languages, etc.)
│   │   │   ├── registration/     # Draft save/submit
│   │   │   ├── upload/           # File upload
│   │   │   └── volunteer/        # Volunteer org review API
│   │   ├── register/             # Public registration form (7 steps)
│   │   └── volunteer/            # Volunteer portal (auth-protected)
│   │       ├── admin/            # Admin data management pages
│   │       │   ├── service-categories/
│   │       │   ├── service-resources/
│   │       │   ├── faiths/
│   │       │   ├── social-categories/
│   │       │   ├── regions/
│   │       │   └── languages/
│   │       ├── dashboard/        # Volunteer dashboard + admin tiles
│   │       ├── login/            # Volunteer sign-in
│   │       └── organizations/    # Org review pages
│   ├── components/               # Shared React components
│   │   ├── register/             # Registration form step components
│   │   └── ui/                   # Base UI components (LoadingSpinner, etc.)
│   └── lib/                      # Utilities, auth helpers, Prisma client
│       ├── auth.ts               # getServerSession + isAdmin() helper
│       ├── prisma.ts             # Prisma client singleton
│       └── validation/           # Zod schemas
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         # Full database schema (25 models)
│   │   └── seed.ts               # Initial seed data (121 orgs, 76 resources, etc.)
│   └── src/app/api/              # Backend-specific API routes
├── prisma.config.ts              # Points Prisma CLI to backend/prisma/schema.prisma
├── docs/                         # Documentation
├── scripts/                      # Migration and utility scripts
└── Sqls/                         # SQL dumps from previous system
```

## Pages & Routes

### Public

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/register` | Registration flow entry |
| `/register/form` | 7-step organization registration form |

### Volunteer Portal

| Route | Access | Description |
|-------|--------|-------------|
| `/volunteer/login` | Public | Volunteer/admin sign-in |
| `/volunteer/dashboard` | VOLUNTEER+ | Org review queue + admin data management tiles |
| `/volunteer/organizations/[id]/review` | VOLUNTEER+ | Review, approve, or reject an organization |
| `/volunteer/admin/service-categories` | ADMIN+ | Manage service categories |
| `/volunteer/admin/service-resources` | ADMIN+ | Manage service resources |
| `/volunteer/admin/faiths` | ADMIN+ | Manage faiths/religious affiliations |
| `/volunteer/admin/social-categories` | ADMIN+ | Manage social groups (SC, ST, OBC, etc.) |
| `/volunteer/admin/regions` | ADMIN+ | Manage states and cities |
| `/volunteer/admin/languages` | ADMIN+ | Manage supported languages |

## User Roles

| Role | Description |
|------|-------------|
| `ORGANIZATION` | Organization submitting a registration |
| `VOLUNTEER` | Reviews submitted organizations, approve/reject |
| `ADMIN` | Volunteer capabilities + full data management access |
| `SUPER_ADMIN` | Full access, including user/admin management |

## API Route Groups

| Group | Base Path | Auth Required | Description |
|-------|-----------|---------------|-------------|
| Reference | `/api/reference/...` | No | Categories, resources, states, cities, languages |
| Registration | `/api/registration/...` | No | Draft save/load/delete, form submit |
| Upload | `/api/upload/...` | No | Document and logo file uploads |
| Volunteer | `/api/volunteer/...` | VOLUNTEER+ | Organization review, approve/reject |
| Admin | `/api/admin/...` | ADMIN+ | CRUD for all reference data entities |
| Public Orgs | `/api/orgs/...` | No | Mobile app org search and detail |
| Auth | `/api/auth/...` | – | NextAuth.js session management |

## Database Models

25 models in `backend/prisma/schema.prisma`. Key models:

| Model | Description |
|-------|-------------|
| `Organization` | Core registration record (status: PENDING/APPROVED/REJECTED) |
| `OrganizationBranch` | Branch locations with address and timings |
| `ServiceCategory` | Service taxonomy category (target: CHILDREN/WOMEN) |
| `ServiceResource` | Specific service within a category |
| `Faith` | Religious affiliation options |
| `SocialCategory` | Social group classifications (SC, ST, OBC, etc.) |
| `State` / `City` | Regional data for branch addresses |
| `Language` | Supported languages with Bhashini metadata |
| `User` | Volunteer/admin accounts (NextAuth) |
| `RegistrationDraft` | Temporary form draft storage (30-day TTL) |
| `TranslationJob` | Bhashini translation queue |

## Development Phases

- ✅ **Phase 0:** Data extraction — 121 organizations, 14 categories, 76 resources from legacy MySQL DB
- ✅ **Phase 1:** Foundation — PostgreSQL schema (Prisma), seeded data, NextAuth.js authentication
- ✅ **Phase 2:** Registration form — 7-step form, Zod validation, draft save/resume, file upload
- ✅ **Phase 3:** Volunteer portal — Login, organization review queue, approve/reject workflow
- ✅ **Phase 4:** Admin data management — CRUD panels for all reference data entities
- ✅ **Phase 5:** Translation pipeline — Bhashini API integration, translation job queue
- ✅ **Phase 6:** Public/mobile API — Organization search and filter endpoints for mobile app

## Contributing

This is a private project for NaariSamata. For questions or issues, please contact the development team.

## License

Private and Confidential — NaariSamata Organization

## Links

- **GitHub:** https://github.com/tangy83/NaSaSakhi.git
- **NaariSamata Website:** https://naarisamata.org/
- **PRD Document:** See `/docs/prd.md`
- **API Documentation:** See `/docs/API.md`
- **Master Project Plan:** See `/docs/MASTER_PROJECT_PLAN.md`

## Support

For questions or support, contact the NaariSamata development team.
