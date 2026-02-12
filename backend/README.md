# NASA Sakhi Backend

This directory contains the monolithic Next.js application (frontend + backend combined) for deployment to DC Deploy.

## Structure

```
backend/
├── src/                    # Source code
│   ├── app/               # Next.js App Router pages and API routes
│   │   ├── api/           # Backend API endpoints
│   │   │   ├── health/    # Health check endpoint
│   │   │   └── db-test/   # Database test endpoint
│   │   ├── page.tsx       # Homepage (frontend)
│   │   └── layout.tsx     # Root layout
│   ├── lib/               # Shared libraries
│   │   ├── prisma.ts      # Database client
│   │   └── api/           # API client utilities
│   └── middleware.ts      # CORS middleware
├── prisma/                # Database schema and migrations
│   └── schema.prisma      # Prisma schema
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── next.config.ts         # Next.js configuration
└── prisma.config.ts       # Prisma configuration

```

## Deployment to DC Deploy

### Build Command
```bash
npm install && npm run build
```

### Start Command
```bash
npm start
```

### Port
```
3000
```

### Environment Variables

Required environment variables for DC Deploy:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://JQZAEG:%2B1h8t3x%7Baa@nasasakhidbstg:5432/nasasakhidbstg-db
NEXT_PUBLIC_APP_URL=https://your-app.dcdeployapp.com
NEXTAUTH_URL=https://your-app.dcdeployapp.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
```

## Local Development

```bash
cd backend
npm install
npm run dev
```

Access at: http://localhost:3000

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/db-test` - Database connectivity test

## Architecture

This is a **monolithic** deployment where frontend and backend are combined in a single Next.js application:
- Frontend pages are in `src/app/`
- Backend API routes are in `src/app/api/`
- Both run on the same server (port 3000)

For split architecture documentation, see the root-level documentation files.

---

## Deployment History

**Last Updated:** February 3, 2026 18:25 IST
**Status:** Production deployment in progress
**Build:** Docker multi-stage build with Next.js standalone output
**Configuration:** Monolithic (port 3000), Node 20, React 19
