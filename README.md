# NaariSamata Organization Registration Portal

A multi-language organization registration portal for NaariSamata, enabling NGOs and support organizations to self-register with admin vetting workflow and mobile app integration.

## Project Overview

**Mission:** Empowering women and vulnerable children across India through accessible support services.

### Key Features

- 📝 Multi-step organization registration form
- 🌍 Support for 30 Indian languages with AI-assisted translation
- ✅ Admin vetting workflow with approval/rejection
- 📱 REST API for mobile app integration
- 🔄 Migration of 121 existing organizations from previous system
- 🏷️ 76 detailed service resources taxonomy

## Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** NextAuth.js
- **Translation:** Google Cloud Translation API
- **File Storage:** AWS S3 / Cloudflare R2
- **Hosting:** Vercel or Custom Server

## Staging Infrastructure

- `NaSaSakhiDB` - PostgreSQL Database Instance
- `NaSaSakhiBEStg` - Backend Staging Server
- `NaSaSakhiFEStg` - Frontend Staging Server

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Git

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
npx prisma migrate dev

# Seed initial data
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
naarisamata-portal/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   └── lib/             # Utility functions and helpers
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── migrations/      # Database migrations
│   └── seed.ts          # Seed data
├── scripts/             # Migration and utility scripts
├── Sqls/               # SQL dumps from previous system (30 files)
├── public/             # Static assets
└── docs/               # Documentation

```

## Development Phases

### Phase 0: Data Extraction (Week 1) - IN PROGRESS
- Extract 121 organizations from existing MySQL database
- Import service taxonomy (14 categories, 76 resources)
- Create migration scripts

### Phase 1: Foundation (Weeks 2-3)
- PostgreSQL schema design with Prisma
- Import migrated data
- NextAuth.js authentication setup

### Phase 2: Registration Flow (Weeks 3-4)
- Multi-step registration form
- AI-assisted translation interface
- File upload handling

### Phase 3: Admin Workflow (Weeks 5-6)
- Admin dashboard
- Submission review interface
- Approval/rejection workflow

### Phase 4: Mobile App API (Week 7)
- REST API endpoints
- Language-aware content delivery
- Search functionality

### Phase 5: Testing (Week 8)
- Unit and integration tests
- E2E tests
- Security audit

### Phase 6: Deployment (Week 9)
- Production deployment
- Monitoring setup
- Documentation

## Database Migration

The project migrates data from an existing MySQL database:

- **121 organizations** across Gujarat, Jharkhand, Telangana, Karnataka
- **76 service resources** with detailed taxonomy
- **14 service categories** (7 for Children, 7 for Women)
- **5 existing languages** (expanding to 30)

Migration scripts are located in `/scripts/` directory.

## Contributing

This is a private project for NaariSamata. For questions or issues, please contact the development team.

## License

Private and Confidential - NaariSamata Organization

## Links

- **GitHub:** https://github.com/tangy83/NaSaSakhi.git
- **NaariSamata Website:** https://naarisamata.org/
- **PRD Document:** See `/docs/prd.md`

## Support

For questions or support, contact the NaariSamata development team.
