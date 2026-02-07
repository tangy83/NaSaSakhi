# NASA Sakhi MVP - Master Project Plan
## Overall Team Coordination & Progress Tracking
## Timeline: February 3-7, 2026

---

## 📋 Quick Links

- **Akshara's Work Plan:** [AKSHARA_WORKPLAN.md](./AKSHARA_WORKPLAN.md) (Backend - 45%)
- **Sunitha's Work Plan:** [SUNITHA_WORKPLAN.md](./SUNITHA_WORKPLAN.md) (Frontend - 45%)
- **Tanuj's Tasks:** Inline below (UI/UX Lead - 10%)
- **DC Deploy Configuration:** [DC_DEPLOY_ACTUAL_CONFIG.md](./DC_DEPLOY_ACTUAL_CONFIG.md)

---

## 🎯 Project Overview

**Mission:** Build an MVP organization registration portal for NASA Sakhi that enables NGOs and support organizations to self-register their services.

**Deadline:** February 7, 2026 (Customer Demo)

**Team:**
- **Tanuj (10%)** - UI/UX Lead, Design Review, QA, Customer Demo
- **Sunitha (45%)** - Frontend Lead, 7-Step Registration Form
- **Akshara (45%)** - Backend Lead, Database, API, Migration

**Success Criteria:**
- ✅ Complete 7-step registration form functional
- ✅ 121 legacy organizations migrated
- ✅ Form submits to database successfully
- ✅ Mobile responsive
- ✅ Deployed to staging for customer demo

---

## 📅 Timeline at a Glance

```
Feb 3 (Mon)      Feb 4 (Tue)         Feb 5 (Wed)         Feb 6 (Thu)         Feb 7 (Fri)
─────────────────────────────────────────────────────────────────────────────────────────
│ Setup          │ Core Dev           │ Core Dev           │ Integration        │ QA & Demo
│                │                    │                    │                    │
│ Tanuj:         │ Tanuj:             │ Tanuj:             │ Tanuj:             │ Tanuj:
│ • Design sys   │ • Review comps     │ • Review upload    │ • Integration test │ • Final QA
│ • Wireframes   │ • Review steps     │ • Review submit    │ • Mobile check     │ • Demo prep
│ • API contract │                    │                    │ • Error review     │ • Customer demo
│                │                    │                    │                    │
│ Sunitha:       │ Sunitha:           │ Sunitha:           │ Sunitha:           │ Sunitha:
│ • Env setup    │ • Component lib    │ • Steps 4-6        │ • API integration  │ • Bug fixes
│ • Mock data    │ • Steps 1-3        │ • Step 7, draft    │ • Error handling   │ • Mobile test
│                │ • Validation       │ • Navigation       │ • Merge to staging │ • Polish
│                │                    │                    │                    │
│ Akshara:        │ Akshara:            │ Akshara:            │ Akshara:            │ Akshara:
│ • Env setup    │ • Prisma schema    │ • Ref data APIs    │ • Validation       │ • API testing
│ • Local DB     │ • Migrations       │ • Draft API        │ • Migration        │ • Bug fixes
│                │ • Seed data        │ • Submit API       │ • Integration      │ • Deployment
│                │                    │ • File upload      │                    │
─────────────────────────────────────────────────────────────────────────────────────────
    Phase 1: Setup     Phase 2: Independent Dev       Phase 3: Integration    Phase 4: QA
```

---

## 👥 Team Members & Responsibilities

### Tanuj (UI/UX Lead - 10%)

**Primary Responsibilities:**
- Define design system (colors, typography, components)
- Review UI implementations at key checkpoints
- Perform end-to-end QA testing
- Prepare and deliver customer demo

**Key Deliverables:**
- [ ] Design system document (Feb 3)
- [ ] Form wireframes (Feb 3)
- [ ] Component approval (Feb 4)
- [ ] UI reviews (Feb 4-5)
- [ ] Integration testing report (Feb 6)
- [ ] Customer demo (Feb 7)

**Time Allocation:** ~15 hours across 5 days

**Progress Tracking:**
- **Feb 3:** ⬜ Design system ⬜ Wireframes ⬜ API contract
- **Feb 4:** ⬜ Component review ⬜ Steps 1-2 review
- **Feb 5:** ⬜ Upload review ⬜ Submit review
- **Feb 6:** ⬜ Integration test ⬜ Mobile check ⬜ Error review
- **Feb 7:** ⬜ Final QA ⬜ Demo prep ⬜ Customer demo ⬜ Feedback doc

---

### Sunitha (Frontend Lead - 45%)

**Primary Responsibilities:**
- Build complete 7-step registration form UI
- Implement client-side validation (Zod)
- Create reusable component library
- Draft save/resume functionality
- Mobile responsiveness

**Key Deliverables:**
- [ ] Component library (TextInput, Dropdown, Checkbox, etc.) - Feb 4
- [ ] Steps 1-3 (Org details, Contact, Services) - Feb 4
- [ ] Steps 4-6 (Branches, Languages, Documents) - Feb 5
- [ ] Step 7 (Review & Submit) - Feb 5
- [ ] Draft save/resume functionality - Feb 5
- [ ] API integration (switch from mocks to real API) - Feb 6
- [ ] Bug fixes and mobile testing - Feb 7

**Time Allocation:** ~44 hours across 5 days

**Detailed Progress:** See [SUNITHA_WORKPLAN.md](./SUNITHA_WORKPLAN.md)

**Progress Tracking (16 Stages):**
- **Feb 3 PM:** ⬜ Stage 1: Environment setup
- **Feb 4 AM:** ⬜ Stage 2: Form input components ⬜ Stage 3: Layout components
- **Feb 4 PM:** ⬜ Stage 4: Validation schemas ⬜ Stage 5: Step 1
- **Feb 5 AM:** ⬜ Stage 6: Step 2 ⬜ Stage 7: Step 3
- **Feb 5 PM:** ⬜ Stage 8: Step 4 ⬜ Stage 9: Steps 5-6
- **Feb 6 AM:** ⬜ Stage 10: Step 7 ⬜ Stage 11: Draft save ⬜ Stage 12: Navigation
- **Feb 6 PM:** ⬜ Stage 13: API integration
- **Feb 7 AM:** ⬜ Stage 14: Error handling ⬜ Stage 15: Mobile responsive
- **Feb 7 PM:** ⬜ Stage 16: Bug fixes

**Current Status:** 🔴 Not Started

---

### Akshara (Backend Lead - 45%)

**Primary Responsibilities:**
- Design and implement Prisma database schema
- Seed reference data (languages, categories, resources, cities)
- Build RESTful API endpoints
- Server-side validation and duplicate detection
- Data migration (121 organizations from MySQL)
- File upload handling

**Key Deliverables:**
- [ ] Complete Prisma schema with all models - Feb 4
- [ ] Database seeded with reference data - Feb 4
- [ ] Reference data API endpoints - Feb 5
- [ ] Draft save/load API - Feb 5
- [ ] Registration submission API - Feb 5
- [ ] File upload API - Feb 5
- [ ] Data migration script (121 orgs) - Feb 6
- [ ] Server-side validation - Feb 6
- [ ] Integration with frontend - Feb 6
- [ ] Deployment to staging - Feb 7

**Time Allocation:** ~44 hours across 5 days

**Detailed Progress:** See [AKSHARA_WORKPLAN.md](./AKSHARA_WORKPLAN.md)

**Progress Tracking (16 Stages):**
- **Feb 3 PM:** ⬜ Stage 1: Environment setup
- **Feb 4 AM:** ⬜ Stage 2: Core models ⬜ Stage 3: Reference data models
- **Feb 4 PM:** ⬜ Stage 4: Auth & documents ⬜ Stage 5: Seed data
- **Feb 5 AM:** ⬜ Stage 6: Reference APIs ⬜ Stage 7: Draft API
- **Feb 5 PM:** ⬜ Stage 8: Submit API ⬜ Stage 9: File upload
- **Feb 6 AM:** ⬜ Stage 10: Validation ⬜ Stage 11: Migration
- **Feb 6 PM:** ⬜ Stage 12: Auth setup
- **Feb 7 AM:** ⬜ Stage 13: API testing ⬜ Stage 14: Integration
- **Feb 7 PM:** ⬜ Stage 15: Optimization ⬜ Stage 16: Deployment

**Current Status:** 🔴 Not Started

---

## 🏗️ Technical Architecture

### System Components

```
┌───────────────────────────────────────────────────────────────┐
│                     NASA Sakhi MVP                            │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────┐           ┌─────────────────────┐   │
│  │   FRONTEND          │    HTTP   │    BACKEND          │   │
│  │   (Sunitha)         │◄──────────┤    (Akshara)         │   │
│  │                     │           │                     │   │
│  │ • Next.js 15        │  JSON     │ • Next.js API       │   │
│  │ • React 19          │           │ • Prisma ORM        │   │
│  │ • TypeScript        │           │ • PostgreSQL        │   │
│  │ • Tailwind CSS      │           │ • NextAuth.js       │   │
│  │ • React Hook Form   │           │ • Zod Validation    │   │
│  │ • Zod Validation    │           │                     │   │
│  └─────────────────────┘           └─────────────────────┘   │
│           │                                  │                │
│           │                                  │                │
│           │         ┌─────────────┐          │                │
│           └─────────┤   TANUJ     ├──────────┘                │
│                     │  (Review)   │                           │
│                     │             │                           │
│                     │ • Design    │                           │
│                     │ • QA        │                           │
│                     │ • Demo      │                           │
│                     └─────────────┘                           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Deployment Infrastructure

**Platform:** DC Deploy (Docker-based PaaS)
**Status:** ✅ Successfully Deployed (Build #24 - Feb 3, 2026)

```
┌─────────────────────────────────────────────────────────────┐
│            DC Deploy Production Environment                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────┐        │
│  │  nasassakhibestg (Docker Container)           │        │
│  │                                                │        │
│  │  GitHub (main) ──push──▶ DC Deploy ──build──▶ │        │
│  │                                                │        │
│  │  • Node 20 Alpine                             │        │
│  │  • Next.js 15 (Monolithic)                    │        │
│  │  • Port 3000 (internal)                       │        │
│  │  • Auto-deploy on push                        │        │
│  │                                                │        │
│  │  URL: https://nasassakhibestg.dcdeployapp.com │        │
│  └───────────────┬───────────────────────────────┘        │
│                  │                                          │
│                  │ DATABASE_URL                             │
│                  ▼                                          │
│  ┌──────────────────────────────────────────────┐         │
│  │  nasasakhidbstg (PostgreSQL 17.5)            │         │
│  │                                               │         │
│  │  • Managed Database (DC Deploy)              │         │
│  │  • Port 5432                                 │         │
│  │  • Automatic backups                         │         │
│  └──────────────────────────────────────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Deployment Process:**
1. Developer: `git push origin main`
2. DC Deploy detects push via webhook
3. Runs Docker build from `backend/Dockerfile`
4. Deploys new container automatically (~2-3 min)
5. App available at https://nasassakhibestg.dcdeployapp.com

**Environment Variables (configured in DC Deploy):**
- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL=postgresql://JQZAEG:***@nasasakhidbstg:5432/nasasakhidbstg-db`
- `NEXT_PUBLIC_APP_URL=https://nasassakhibestg.dcdeployapp.com`
- `NEXTAUTH_URL=https://nasassakhibestg.dcdeployapp.com`
- `NEXTAUTH_SECRET=[configured securely]`

### Tech Stack Summary

| Layer | Technology | Owner |
|-------|-----------|-------|
| **Frontend** | Next.js 15, React 19, TypeScript | Sunitha |
| **Styling** | Tailwind CSS | Sunitha |
| **Forms** | React Hook Form + Zod | Sunitha |
| **Backend** | Next.js API Routes | Akshara |
| **Database** | PostgreSQL 17.5 + Prisma | Akshara |
| **Auth** | NextAuth.js | Akshara |
| **Validation** | Zod (client + server) | Both |
| **File Storage** | Local filesystem (MVP) | Akshara |
| **Deployment** | Docker (DC Deploy) | Automated |
| **Container** | Node 20 Alpine | DC Deploy |

### Development Environment

**Cross-Platform Support:**
- ✅ Works on Windows, macOS, and Linux
- ✅ No Docker Desktop required for development
- ✅ Native installation or WSL2 on Windows

**Key Documentation:**
- [CROSS-PLATFORM.md](../CROSS-PLATFORM.md) - Cross-platform development guide
- [WINDOWS-SETUP.md](../WINDOWS-SETUP.md) - Windows-specific setup
- [deployment/DEPLOYMENT-GUIDE.md](../deployment/DEPLOYMENT-GUIDE.md) - Staging deployment

---

## 🗄️ Database & Staging Access

### Development Database (Local)

Each developer runs their own PostgreSQL instance locally:

**Connection String:**
```
postgresql://postgres:password@localhost:5432/nasa_sakhi_dev
```

**Setup:**
- See individual work plans for platform-specific setup
- [WINDOWS-SETUP.md](../WINDOWS-SETUP.md) for Windows users
- [CROSS-PLATFORM.md](../CROSS-PLATFORM.md) for all platforms

### Staging Database (NaSaSakhiDB)

Shared staging database for integration testing (Feb 6+):

**Connection String:**
```
postgresql://naarisamata_user:STAGING_PASSWORD@NaSaSakhiDB_IP:5432/naarisamata_staging
```

**Access:**
- Available from Feb 6 (integration day)
- Credentials provided by infrastructure team
- Use for integration testing only, not daily development

**Note:** Keep local and staging separate. Develop locally, test integration on staging.

### Staging Deployment Options

**Option A: Monolithic (Recommended for MVP)**
- Deploy entire Next.js app to **NaSaSakhiFEStg**
- Frontend + Backend in one process
- Simpler for MVP
- Uses PM2 + Nginx

**Option B: Split Deployment (Future)**
- Frontend on **NaSaSakhiFEStg**
- Backend API on **NaSaSakhiBEStg**
- Better scalability
- More complex setup

**For Feb 6-7:** Use Option A (monolithic) for faster deployment.

### DC Deploy Staging Access Setup

**Timeline:** Required by Feb 6 (integration day)

**Overview:**
The team needs access to DC Deploy staging infrastructure on Feb 6 for integration testing and deployment. This section explains what access is needed and how to set it up.

**Who Needs What:**

| Team Member | SSH Access | Database Access | When Needed |
|-------------|-----------|----------------|-------------|
| **Akshara** | ✅ Yes (NaSaSakhiFEStg) | ✅ Yes (NaSaSakhiDB) | Feb 6 AM (deploy backend) |
| **Sunitha** | ⚠️ Optional (NaSaSakhiFEStg) | ❌ No | Feb 6 PM (test/deploy frontend) |
| **Tanuj** | ⚠️ Optional (for QA) | ⚠️ Optional (verify data) | Feb 7 (QA testing) |

---

#### Required Credentials (Request by Feb 5)

**From Infrastructure Team, obtain:**

**1. SSH Access to NaSaSakhiFEStg Server**

```bash
# Server details
HOST="<IP address or hostname>"
USER="<ssh-username>"  # e.g., deploy, ubuntu, etc.
PORT="22"  # Default SSH port

# Authentication method: SSH key (recommended) or password
SSH_KEY="~/.ssh/nasasakhi_staging_rsa"
```

**How to set up SSH key:**

```bash
# Generate SSH key pair (if you don't have one)
ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f ~/.ssh/nasasakhi_staging_rsa

# Copy public key to server (ask infrastructure team to add it)
cat ~/.ssh/nasasakhi_staging_rsa.pub
# Send this to infrastructure team

# Test connection
ssh -i ~/.ssh/nasasakhi_staging_rsa <USER>@<HOST>
```

**2. PostgreSQL Database Credentials (NaSaSakhiDB)**

```bash
# Request these details
DB_HOST="<NaSaSakhiDB IP or hostname>"
DB_PORT="5432"
DB_NAME="naarisamata_staging"
DB_USER="naarisamata_user"
DB_PASSWORD="<staging-password>"

# Full connection string
DATABASE_URL="postgresql://naarisamata_user:<PASSWORD>@<DB_HOST>:5432/naarisamata_staging"
```

**3. Firewall/Network Access**

Check if servers are behind firewall:

```bash
# Can you reach the server from your location?
ping <NaSaSakhiFEStg_HOST>
telnet <NaSaSakhiFEStg_HOST> 22
telnet <NaSaSakhiDB_IP> 5432
```

If not accessible:
- **VPN access:** Request VPN credentials
- **IP whitelisting:** Provide your IP address to infrastructure team
- **Bastion/Jump host:** May need to SSH through intermediate server

**4. Application Deployment Details**

```bash
# Where is the app deployed on NaSaSakhiFEStg?
APP_DIR="/var/www/nasa_sakhi"  # Confirm with infrastructure team

# Which user owns the app files?
APP_USER="deploy"  # or www-data, ubuntu, etc.

# How is the app managed?
# - PM2 (recommended)
# - Systemd service
# - Docker container
```

---

#### Pre-Integration Setup (Before Feb 6)

**Akshara's Setup Checklist:**

- [ ] Receive SSH credentials for NaSaSakhiFEStg
- [ ] Test SSH connection: `ssh <USER>@<HOST>`
- [ ] Receive database credentials for NaSaSakhiDB
- [ ] Test database connection:
  ```bash
  psql "postgresql://naarisamata_user:<PASSWORD>@<DB_HOST>:5432/naarisamata_staging"
  ```
- [ ] If database not accessible, set up SSH tunnel:
  ```bash
  ssh -L 5433:<DB_IP>:5432 <USER>@<NaSaSakhiFEStg_HOST>
  ```
- [ ] Verify app directory exists on server: `ls /var/www/nasa_sakhi`
- [ ] Verify PM2 is installed: `pm2 --version`
- [ ] Verify Node.js version: `node --version` (should be 18+)
- [ ] Review [deployment/DEPLOYMENT-GUIDE.md](../deployment/DEPLOYMENT-GUIDE.md)

**Sunitha's Setup Checklist:**

- [ ] Receive staging application URL: `http://<NaSaSakhiFEStg_IP>`
- [ ] Test URL accessibility from browser
- [ ] (Optional) Receive SSH credentials if deploying directly
- [ ] Confirm with Akshara: Will he deploy or should you?
- [ ] Know how to test deployed app from mobile (VPN if needed)

**Tanuj's Setup Checklist:**

- [ ] Ensure team has all required credentials by Feb 5
- [ ] Test staging URL is accessible: `http://<NaSaSakhiFEStg_IP>`
- [ ] (Optional) Get database read-only access for QA verification
- [ ] Prepare list of test scenarios for Feb 7 QA
- [ ] Ensure mobile testing setup ready (devices or browser dev tools)

---

#### Staging Access Troubleshooting

**Problem: Can't SSH into NaSaSakhiFEStg**

```bash
# 1. Check if server is reachable
ping <NaSaSakhiFEStg_HOST>

# 2. Check if SSH port is open
telnet <NaSaSakhiFEStg_HOST> 22
# or
nc -zv <NaSaSakhiFEStg_HOST> 22

# 3. Check SSH key permissions
chmod 600 ~/.ssh/nasasakhi_staging_rsa
ls -l ~/.ssh/nasasakhi_staging_rsa

# 4. Try verbose SSH to see errors
ssh -v -i ~/.ssh/nasasakhi_staging_rsa <USER>@<HOST>

# 5. If behind firewall, connect to VPN first
# Then retry SSH
```

**Problem: Can't connect to NaSaSakhiDB database**

```bash
# 1. Check if PostgreSQL port is accessible
telnet <NaSaSakhiDB_IP> 5432
# or
nc -zv <NaSaSakhiDB_IP> 5432

# 2. If port not accessible, use SSH tunnel
ssh -L 5433:<NaSaSakhiDB_IP>:5432 <USER>@<NaSaSakhiFEStg_HOST>
# Keep this terminal open

# 3. In another terminal, connect via tunnel
psql "postgresql://naarisamata_user:<PASSWORD>@localhost:5433/naarisamata_staging"

# 4. Check if pg_hba.conf allows your IP (ask infrastructure team)
# 5. Check if firewall allows port 5432 (ask infrastructure team)
```

**Problem: Permission denied on server**

```bash
# 1. Check which user you logged in as
whoami

# 2. Check file/directory ownership
ls -l /var/www/nasa_sakhi

# 3. Check your user groups
groups

# 4. May need to be added to 'www-data' or 'deploy' group
# Contact infrastructure team to add you:
# sudo usermod -aG www-data <your-username>
```

**Problem: PM2 commands not working**

```bash
# 1. Check if PM2 is installed
which pm2
pm2 --version

# 2. Check if PM2 processes exist
pm2 list

# 3. If empty, app may not be managed by PM2
# Check systemd instead:
sudo systemctl status nasa-sakhi

# 4. Or check if running as different user
sudo pm2 list
```

**Problem: Staging URL not accessible from browser**

```bash
# 1. Check if Nginx is running
sudo systemctl status nginx

# 2. Test locally on server
ssh <USER>@<HOST>
curl http://localhost:3000  # Test app directly
curl http://localhost/      # Test through Nginx

# 3. Check Nginx configuration
sudo nginx -t
sudo cat /etc/nginx/sites-enabled/nasa_sakhi

# 4. Check firewall allows HTTP/HTTPS
sudo ufw status
# Should show: 80/tcp ALLOW, 443/tcp ALLOW

# 5. If still not working, may need VPN to access
```

---

#### Emergency Contact (If Stuck)

If you encounter access issues on Feb 6:

1. **First:** Check troubleshooting section above
2. **Next:** Contact Tanuj immediately (don't wait)
3. **If urgent:** Contact infrastructure team directly (get contact from Tanuj)

**Don't let access issues block integration. Escalate quickly.**

---

**For Feb 6-7:** Use Option A (monolithic) for faster deployment.

---

## 🔄 Work Phases & Dependencies

### Phase 1: Setup & Independent Development (Feb 3-5)

**Goal:** Everyone works independently without blocking each other

**Tanuj's Tasks:**
1. ✅ Define design system (colors, typography, spacing)
2. ✅ Create form wireframes
3. ✅ Define API contract (`/src/types/api.ts`)
4. ✅ Create mock data for Sunitha (`/src/mocks/api.json`)

**Sunitha's Tasks:**
1. Set up dev environment with mock data
2. Build component library
3. Build all 7 form steps
4. Implement client validation
5. Test with mock API

**Akshara's Tasks:**
1. Set up local PostgreSQL
2. Design Prisma schema
3. Seed reference data
4. Build all API endpoints
5. Test with Postman

**Key Success Factor:** API contract defined upfront ensures compatibility

---

### Phase 2: Integration (Feb 6)

**Goal:** Connect frontend to real backend

**Morning (Integration Day 1):**

1. **Akshara merges first**
   ```bash
   git checkout -b integration/mvp
   git merge feature/backend-api
   git push origin integration/mvp
   ```

2. **Deploy backend to staging (NaSaSakhiFEStg)**

   **Option A: Using PM2 + Nginx (Recommended)**

   SSH into staging server:
   ```bash
   ssh user@NaSaSakhiFEStg
   cd /var/www/nasa_sakhi
   git pull origin integration/mvp
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run build
   pm2 reload all
   ```

   **Option B: Using Docker Compose**

   See [deployment/DEPLOYMENT-GUIDE.md](../deployment/DEPLOYMENT-GUIDE.md)
   ```bash
   cd deployment/docker
   docker-compose -f docker-compose.staging.yml up -d
   ```

3. **Configure staging environment variables**

   On NaSaSakhiFEStg server, edit `.env`:
   ```env
   NODE_ENV=staging
   DATABASE_URL="postgresql://naarisamata_user:PASSWORD@NaSaSakhiDB_IP:5432/naarisamata_staging"
   NEXTAUTH_URL="http://NaSaSakhiFEStg_IP"
   NEXTAUTH_SECRET="staging-secret"
   ```

4. **Verify API endpoints accessible**
   ```bash
   curl http://NaSaSakhiFEStg_IP/api/reference/categories
   curl http://NaSaSakhiFEStg_IP/health
   ```

5. **Sunitha switches to real API**

   Locally:
   ```bash
   git checkout feature/registration-form
   git pull origin integration/mvp  # Get Akshara's changes
   ```

   Update API calls to use staging or Akshara's local:
   ```typescript
   // Before (mocks):
   import { fetchCategoriesMock } from '@/lib/api/mock';

   // After (real API - point to Akshara's local or staging):
   const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
   const response = await fetch(`${API_BASE}/api/reference/categories`);
   ```

6. **Local integration testing**
   - Sunitha runs frontend locally
   - Points to Akshara's local backend: `http://localhost:3000/api`
   - Or points to staging: `http://NaSaSakhiFEStg_IP/api`
   - Both test complete flow
   - Fix any contract mismatches
   - Adjust response formats if needed

**Afternoon (Integration Day 2):**

1. **Sunitha merges frontend**
   ```bash
   git checkout integration/mvp
   git merge feature/registration-form
   # Resolve any conflicts
   git push origin integration/mvp
   ```

2. **Deploy full application to staging**

   **SSH into NaSaSakhiFEStg:**
   ```bash
   ssh user@NaSaSakhiFEStg
   cd /var/www/nasa_sakhi

   # Pull latest code
   git pull origin integration/mvp

   # Install dependencies
   npm install

   # Build frontend
   npm run build

   # Restart PM2
   pm2 reload all

   # Verify deployment
   curl http://localhost:3000/health
   pm2 status
   pm2 logs
   ```

   **Verify Nginx is running:**
   ```bash
   sudo systemctl status nginx
   sudo nginx -t  # Test configuration
   ```

   **Check application logs:**
   ```bash
   pm2 logs nasa_sakhi --lines 50
   tail -f /var/log/nginx/access.log
   ```

3. **End-to-end testing on staging**

   Access staging from browser: `http://NaSaSakhiFEStg_IP`

   Test:
   - [ ] Complete registration flow (all 7 steps)
   - [ ] Draft save/resume
   - [ ] Client validation (all fields)
   - [ ] Server validation (test API errors)
   - [ ] File upload (documents, logo)
   - [ ] Mobile viewport (Chrome DevTools or real device)
   - [ ] Database persistence (check PostgreSQL)

4. **Database verification**

   Connect to NaSaSakhiDB:
   ```bash
   psql "postgresql://naarisamata_user:PASSWORD@NaSaSakhiDB_IP:5432/naarisamata_staging"

   # Verify tables exist
   \dt

   # Check test submission
   SELECT * FROM "Organization" ORDER BY "createdAt" DESC LIMIT 5;
   ```

5. **Bug tracking & fixes**

   Create shared bug tracking doc:
   - Google Sheet or GitHub Issues
   - Columns: Bug ID, Reporter, Description, Priority, Assigned To, Status

   **Bug Priority:**
   - **Critical:** Blocks basic functionality (P0)
   - **High:** Important but has workaround (P1)
   - **Medium:** Nice to fix (P2)
   - **Low:** Polish (P3)

6. **Fix and redeploy**

   For each bug:
   - Fix in feature branch
   - Merge to integration/mvp
   - Redeploy to staging
   - Retest
   - Mark as fixed

**Evening:**
- All critical bugs fixed
- All high-priority bugs fixed
- Staging deployment stable
- Ready for Tanuj's QA on Feb 7

**Staging URLs (for testing):**
- Frontend: `http://NaSaSakhiFEStg_IP`
- API: `http://NaSaSakhiFEStg_IP/api`
- Health: `http://NaSaSakhiFEStg_IP/health`
- Database: `postgresql://naarisamata_user:PASSWORD@NaSaSakhiDB_IP:5432/naarisamata_staging`

---

### Phase 3: QA & Demo Preparation (Feb 7)

**Morning - Tanuj's QA:**

1. **Functionality Testing** (2 hours)
   - Register 3 different organizations (NGO, Trust, Government)
   - Test all service categories
   - Test multi-branch (add 5 branches)
   - Test draft save/resume at each step
   - Test file uploads (valid and invalid files)

2. **UI/UX Testing** (1 hour)
   - Check text readability (contrast, size)
   - Check spacing consistency
   - Check button alignment
   - Check error messages clarity
   - Check mobile responsiveness

3. **Edge Case Testing** (1 hour)
   - Try to skip steps → Should be prevented
   - Try to submit without terms → Should be disabled
   - Try to upload .exe file → Should be blocked
   - Try 200-char name → Should show error
   - Try category without resources → Should show error

4. **Create Punch List**
   - Critical bugs (must fix)
   - High priority (should fix)
   - Medium priority (nice to fix)
   - Low priority (polish)

**Afternoon - Bug Fixes (Both):**

Sunitha and Akshara work through punch list:
- Fix critical bugs first
- Then high priority
- Medium if time permits

Redeploy after each batch of fixes.

**Evening - Demo Preparation:**

Tanuj prepares:
1. Demo organization data
   - Name: "Mumbai Women's Shelter"
   - Type: NGO
   - Services: Shelter, Counseling, Legal Support
   - 3 branches

2. Demo script (15 minutes)
   - Introduction (2 min)
   - Walk through all 7 steps (10 min)
   - Q&A (3 min)

3. Practice demo 2-3 times

---

## 📊 Progress Dashboard

### Overall Project Status

| Milestone | Owner | Target Date | Status |
|-----------|-------|-------------|--------|
| Design system defined | Tanuj | Feb 3 | 🔴 Not Started |
| API contract agreed | Tanuj | Feb 3 | 🔴 Not Started |
| Mock data created | Tanuj | Feb 3 | 🔴 Not Started |
| Component library built | Sunitha | Feb 4 | 🔴 Not Started |
| Database schema complete | Akshara | Feb 4 | 🔴 Not Started |
| Reference data seeded | Akshara | Feb 4 | 🔴 Not Started |
| Steps 1-3 built | Sunitha | Feb 4 | 🔴 Not Started |
| Steps 4-7 built | Sunitha | Feb 5 | 🔴 Not Started |
| All API endpoints ready | Akshara | Feb 5 | 🔴 Not Started |
| Data migration complete | Akshara | Feb 6 | 🔴 Not Started |
| Frontend integrated | Sunitha | Feb 6 | 🔴 Not Started |
| Deployed to staging | Both | Feb 6 | 🔴 Not Started |
| QA completed | Tanuj | Feb 7 | 🔴 Not Started |
| Customer demo delivered | Tanuj | Feb 7 | 🔴 Not Started |

**Legend:**
- 🔴 Not Started
- 🟡 In Progress
- 🟢 Completed
- ⚠️ Blocked

---

### Daily Progress Updates

**Update this section daily after standup**

#### Feb 3 (Monday) - Setup Day
**Standup Notes:**
- [ ] Tanuj: Design system status
- [ ] Sunitha: Environment setup status
- [ ] Akshara: Database setup status

**Completed Today:**
-

**Blockers:**
-

**Tomorrow's Focus:**
-

---

#### Feb 4 (Tuesday) - Core Development Day 1
**Standup Notes:**
- [ ] Tanuj: Reviews scheduled
- [ ] Sunitha: Component library progress
- [ ] Akshara: Schema progress

**Completed Today:**
-

**Blockers:**
-

**Tomorrow's Focus:**
-

---

#### Feb 5 (Wednesday) - Core Development Day 2
**Standup Notes:**
- [ ] Tanuj: UI reviews
- [ ] Sunitha: Steps progress
- [ ] Akshara: API endpoints progress

**Completed Today:**
-

**Blockers:**
-

**Tomorrow's Focus:**
-

---

#### Feb 6 (Thursday) - Integration Day
**Standup Notes:**
- [ ] Tanuj: Testing plan
- [ ] Sunitha: API integration status
- [ ] Akshara: Backend deployment status

**Integration Testing Results:**
- ✅ Complete registration flow:
- ✅ Draft save/resume:
- ✅ Validation:
- ✅ File upload:
- ✅ Mobile:

**Bug Count:**
- Critical:
- High:
- Medium:
- Low:

**Completed Today:**
-

**Blockers:**
-

**Tomorrow's Focus:**
-

---

#### Feb 7 (Friday) - QA & Demo Day
**Standup Notes:**
- [ ] Tanuj: QA findings
- [ ] Sunitha: Bug fixes
- [ ] Akshara: Bug fixes

**QA Results:**
- Total bugs found:
- Bugs fixed:
- Bugs deferred:

**Demo Status:**
- [ ] Demo script ready
- [ ] Demo data prepared
- [ ] Demo rehearsed
- [ ] Customer demo delivered
- [ ] Feedback received

**Final Status:**
-

---

## 🔑 Critical Success Factors

### 1. API Contract Adherence
**Importance:** HIGH
**Mitigation:**
- Define TypeScript interfaces upfront (Feb 3)
- Both Sunitha and Akshara commit to exact format
- Verify with Postman before integration

### 2. Communication
**Importance:** HIGH
**Mitigation:**
- Daily 15-min standup at 10 AM
- Immediate notification of blockers
- Slack channel for quick questions
- Integration day requires close coordination

### 3. Independent Work Setup
**Importance:** HIGH
**Mitigation:**
- Mock data allows Sunitha to work independently
- Postman allows Akshara to test independently
- No cross-dependencies until Feb 6

### 4. Tight Timeline
**Importance:** HIGH
**Mitigation:**
- Focus on MVP scope only (no nice-to-haves)
- Parallel development maximizes efficiency
- Buffer day (Feb 6) for integration issues
- Clear priorities (P0 must-have, P1 should-have, P2 nice-to-have)

### 5. Mobile Responsiveness
**Importance:** MEDIUM
**Mitigation:**
- Sunitha tests on 375px viewport throughout
- Tanuj reviews mobile on Feb 6
- Touch targets ≥44px

---

## 📋 Integration Checklist

Use this before declaring integration successful:

### Pre-Integration (Feb 3-5)
- [ ] API contract defined (`/src/types/api.ts`)
- [ ] Mock data created (`/src/mocks/api.json`)
- [ ] Design system documented
- [ ] Database schema finalized
- [ ] Reference data seeded (30 languages, 14 categories, 76 resources, cities)
- [ ] All API endpoints tested with Postman
- [ ] All frontend components tested with mocks

### Integration Day 1 (Feb 6 AM)
- [ ] Backend merged to `integration/mvp` branch
- [ ] Backend deployed to staging
- [ ] API endpoints accessible from staging
- [ ] Frontend updated to use real API
- [ ] Local integration testing passed
- [ ] API contract verified (no mismatches)

### Integration Day 2 (Feb 6 PM)
- [ ] Frontend merged to `integration/mvp` branch
- [ ] Full app deployed to staging
- [ ] Complete registration flow tested end-to-end
- [ ] Draft save/resume tested
- [ ] Validation tested (client + server)
- [ ] File upload tested
- [ ] Mobile testing completed (375px viewport)
- [ ] Bug list created and prioritized
- [ ] Critical bugs fixed

### QA Day (Feb 7)
- [ ] Tanuj's QA session completed
- [ ] All critical bugs fixed
- [ ] All high-priority bugs fixed
- [ ] Demo script prepared
- [ ] Demo data created and tested
- [ ] Demo rehearsed 2-3 times
- [ ] Customer demo delivered
- [ ] Feedback documented

---

## 🚨 Escalation & Issue Resolution

### When to Escalate

**Immediate Escalation (notify all):**
- Critical bug blocking progress
- Integration failure
- Data loss or corruption
- Security vulnerability discovered
- Timeline at risk (>4 hours behind)

**Regular Escalation (standup):**
- Minor bug
- Design decision needed
- Clarification on requirements
- Resource constraint

### Escalation Process

1. **Post in Slack** `#nasa-sakhi-dev` with:
   - Issue description
   - Impact (blocking/high/medium/low)
   - What you've tried
   - What you need

2. **Tag relevant person:**
   - Design: @Tanuj
   - Backend: @Akshara
   - Frontend: @Sunitha

3. **Decision timeline:**
   - Blocking issues: <30 min response
   - High priority: <2 hours
   - Medium/low: Next standup

---

## 📞 Communication Guidelines

### Daily Standup (10 AM, 15 minutes)

**Format:**
Each person shares:
1. What I completed yesterday
2. What I'm working on today
3. Any blockers

**Rules:**
- Start on time
- Keep it brief (max 5 min per person)
- Save detailed discussions for after
- Update this document after standup

### Slack Channels

- **#nasa-sakhi-dev** - General updates, questions, coordination
- **#nasa-sakhi-bugs** - Bug reports only
- **#nasa-sakhi-demo** - Customer demo related

### Response Time Expectations

| Priority | Expected Response Time |
|----------|----------------------|
| Blocking | <30 minutes |
| High | <2 hours |
| Medium | <4 hours |
| Low | Next standup |

### Code Review Guidelines

**Tanuj reviews:**
- All UI components (design compliance)
- Form flows (UX)

**Sunitha reviews:**
- API response formats (matches expectations)

**Akshara reviews:**
- API calls from frontend (correct usage)

**Review turnaround:** <2 hours during working hours

---

## 🎯 MVP Scope (What We're Building)

### In Scope (Must Have - P0)

✅ **7-step registration form**
- Step 1: Organization details
- Step 2: Contact information
- Step 3: Service categories & resources
- Step 4: Branch locations (multi-branch support)
- Step 5: Language preferences
- Step 6: Document uploads
- Step 7: Review & submit

✅ **Validation**
- Client-side (real-time feedback)
- Server-side (security)

✅ **Draft Save/Resume**
- Auto-save every 2 minutes
- Manual save button
- Resume via link

✅ **File Upload**
- Registration certificate (required)
- Logo (optional)

✅ **Database**
- Complete schema with all relationships
- 121 legacy organizations migrated
- Reference data seeded

✅ **API Endpoints**
- Reference data (categories, resources, languages, cities)
- Draft management
- Registration submission
- File upload

✅ **Mobile Responsive**
- Works on 375px+ viewport

✅ **Deployed to Staging**
- Accessible via URL
- Stable for demo

---

### Out of Scope (Future Iterations)

❌ **Advanced Features**
- Admin dashboard (defer to Week 2)
- Email notifications (defer to Week 2)
- Translation API integration (defer to Week 2)
- Advanced duplicate detection (fuzzy matching)
- Analytics tracking
- SMS notifications
- WhatsApp integration
- OAuth login (only email/password for MVP)

❌ **Polish**
- Animations
- Advanced error recovery
- Offline support
- PWA features
- Advanced accessibility (WCAG AAA)

**Rationale:** Focus on core registration flow first, iterate based on customer feedback.

---

## 📚 Resources & Documentation

### Project Documentation

| Document | Purpose | Owner |
|----------|---------|-------|
| [PRD.md](../PRD.md) | Complete product requirements | Tanuj |
| [PRD-DataEntry-Validation.md](../PRD-DataEntry-Validation.md) | Field-level validation specs | Tanuj |
| [AKSHARA_WORKPLAN.md](./AKSHARA_WORKPLAN.md) | Backend detailed plan | Akshara |
| [SUNITHA_WORKPLAN.md](./SUNITHA_WORKPLAN.md) | Frontend detailed plan | Sunitha |
| [DEPLOYMENT-GUIDE.md](../deployment/DEPLOYMENT-GUIDE.md) | Staging deployment | DevOps |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | UI design guidelines | Tanuj |
| `/src/types/api.ts` | API contract (TypeScript) | Tanuj |

### Technical References

- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **React Hook Form:** https://react-hook-form.com
- **Zod:** https://zod.dev
- **Tailwind CSS:** https://tailwindcss.com
- **NextAuth.js:** https://next-auth.js.org

---

## 🎉 Success Metrics

### Project Success (Feb 7 Evening)

**MVP Definition Met:**
- [x] 7-step form functional
- [x] Client validation working
- [x] Server validation working
- [x] File upload working
- [x] Draft save/resume working
- [x] 121 organizations migrated
- [x] Mobile responsive
- [x] Deployed to staging
- [x] Customer demo delivered

**Quality Metrics:**
- Form completion rate: >70% (track after launch)
- Time to complete: <20 minutes median
- Validation error rate: <10% per field
- Mobile usability: No layout breaks on 375px

**Technical Metrics:**
- API uptime: 100% during demo
- Page load time: <2 seconds
- API response time: <200ms (p95)
- Zero critical bugs in production

---

## 📝 Post-MVP Plan (Week 2: Feb 8-14)

After customer demo and feedback, we'll iterate:

**Week 2 Priorities:**
1. **Admin Dashboard** (Akshara: backend, Sunitha: frontend)
   - View pending submissions
   - Approve/reject organizations
   - Download documents

2. **Email Notifications** (Akshara)
   - Submission confirmation
   - Approval/rejection notification
   - Draft expiry reminder

3. **UI Polish** (Sunitha)
   - Animations
   - Loading states
   - Success confirmations
   - Improved error messages

4. **Translation Integration** (Akshara)
   - Google Cloud Translation API
   - Translate organization data
   - Cache translations

5. **Testing** (Both)
   - Unit tests
   - Integration tests
   - E2E tests

**Work Distribution (Week 2):**
- Tanuj: 10% (review, customer communication)
- Sunitha: 45% (admin UI, polish)
- Akshara: 45% (admin API, email, translation)

---

## 🚀 Getting Started

### For Team Members

**Tanuj:**
1. Read this master plan
2. Create design system document
3. Define API contract with Akshara and Sunitha
4. Create mock data for Sunitha

**Sunitha:**
1. Read [SUNITHA_WORKPLAN.md](./SUNITHA_WORKPLAN.md)
2. Set up dev environment
3. Wait for Tanuj's design system (Feb 3)
4. Start Stage 1 (Environment Setup)

**Akshara:**
1. Read [AKSHARA_WORKPLAN.md](./AKSHARA_WORKPLAN.md)
2. Set up local PostgreSQL
3. Wait for Tanuj's API contract (Feb 3)
4. Start Stage 1 (Environment Setup)

### First Day Checklist (Feb 3)

**Everyone:**
- [ ] Read master plan
- [ ] Attend 10 AM standup
- [ ] Join Slack channels
- [ ] Review cross-platform setup: [CROSS-PLATFORM.md](../CROSS-PLATFORM.md)
- [ ] Run `npm run setup` (cross-platform automated setup)
- [ ] Run `npm run generate-secrets` (generate secure secrets)

**Tanuj:**
- [ ] Create design system document (`/docs/DESIGN_SYSTEM.md`)
- [ ] Create form wireframes
- [ ] Create `/src/types/api.ts` (API contract)
- [ ] Create `/src/mocks/api.json` (mock data)
- [ ] Commit to main branch
- [ ] Notify Sunitha and Akshara

**Sunitha:**
- [ ] Clone repo
- [ ] Platform-specific setup:
  - **Windows:** See [WINDOWS-SETUP.md](../WINDOWS-SETUP.md)
  - **macOS/Linux:** Standard Unix setup
- [ ] Run `npm run setup`
- [ ] Create feature branch: `feature/registration-form`
- [ ] Pull Tanuj's files (design system, api.ts, mocks)
- [ ] Verify dev server runs: `npm run dev`
- [ ] Access http://localhost:3000

**Akshara:**
- [ ] Clone repo
- [ ] Platform-specific setup:
  - **Windows:** See [WINDOWS-SETUP.md](../WINDOWS-SETUP.md) (WSL2 recommended)
  - **macOS:** `brew install postgresql@15`
  - **Linux:** `sudo apt install postgresql-15`
- [ ] Run `npm run setup`
- [ ] Create feature branch: `feature/backend-api`
- [ ] Set up local PostgreSQL database: `nasa_sakhi_dev`
- [ ] Configure `.env` with database URL
- [ ] Pull Tanuj's files (api.ts)
- [ ] Verify Prisma connection: `npx prisma db push`
- [ ] Verify dev server runs: `npm run dev`

**Staging Access (Not needed until Feb 6):**
- [ ] Obtain NaSaSakhiDB credentials (for integration testing)
- [ ] Test staging database connection
- [ ] Review [deployment/DEPLOYMENT-GUIDE.md](../deployment/DEPLOYMENT-GUIDE.md)

---

## 📅 Meeting Schedule

### Daily Standup
- **Time:** 10:00 AM - 10:15 AM
- **Format:** Each person shares (Yesterday, Today, Blockers)
- **Location:** Slack call / Video call
- **Required:** All three team members

### Review Checkpoints
- **Feb 4 PM:** Sunitha component review (with Tanuj)
- **Feb 5 AM:** Sunitha steps review (with Tanuj)
- **Feb 6 AM:** Mobile responsiveness check (with Tanuj)
- **Feb 6 PM:** Integration debrief (all three)
- **Feb 7 AM:** QA findings review (all three)
- **Feb 7 PM:** Post-demo retrospective (all three)

---

## 🎬 Customer Demo (Feb 7, 5 PM)

**Duration:** 15 minutes

**Attendees:**
- Customer representative
- Tanuj (presenter)
- Sunitha (support)
- Akshara (support)

**Demo Flow:**
1. **Introduction** (2 min)
   - Project overview
   - Goals and features

2. **Live Demo** (10 min)
   - Walk through complete registration
   - Demonstrate all 7 steps
   - Show validation, draft save, file upload
   - Show mobile responsiveness

3. **Q&A** (3 min)
   - Answer questions
   - Gather feedback

**Demo Preparation:**
- Rehearse 2-3 times
- Have backup demo data ready
- Test on staging 1 hour before
- Record demo for reference

**Post-Demo:**
- Document feedback
- Prioritize changes
- Plan next iteration

---

## 🏁 Final Notes

This master plan is the single source of truth for project coordination. Update it daily after standup to reflect progress, blockers, and decisions.

**Remember:**
- **Communication is key** - Overcommunicate rather than under-communicate
- **API contract is sacred** - Don't change without agreement
- **MVP scope is fixed** - Resist feature creep
- **Quality over speed** - But respect the deadline

**Good luck to the team! Let's build something impactful! 🚀**

---

**Last Updated:** Feb 3, 2026 19:00 IST
**Status:** ✅ Successfully Deployed to DC Deploy (Build #24)
**Deployed URL:** https://nasassakhibestg.dcdeployapp.com
**Next Milestone:** Team onboarding & development start (Feb 4)
