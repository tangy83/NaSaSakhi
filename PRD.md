# Product Requirements Document (PRD)
## NASA Sakhi - NaariSamata Organization Registration Portal

**Version:** 1.0
**Date:** February 1, 2026
**Status:** Draft
**Project Phase:** Phase 0 (Data Migration - In Progress)

---

## Executive Summary

NASA Sakhi is a comprehensive web-based organization registration portal designed to empower women and vulnerable children across India through accessible support services. The platform enables NGOs, support organizations, and service providers to self-register their services, undergo admin vetting, and make their offerings discoverable through a mobile app ecosystem supporting 30 Indian languages.

**Mission:** Democratize access to support services for women and children across India by creating a centralized, multilingual, and accessible registry of organizations.

**Current State:** Migrating 121 existing organizations from a legacy MySQL system to a modern Next.js + PostgreSQL architecture with AI-powered translation capabilities.

---

## 1. Project Background

### 1.1 Problem Statement

- **Fragmented Service Discovery:** Women and children in need struggle to find relevant support services in their locality and language
- **Language Barriers:** Existing platforms don't adequately support India's linguistic diversity (30+ languages)
- **Manual Registration:** Legacy systems require manual organization onboarding, limiting scalability
- **Data Quality:** Inconsistent organization data across platforms makes verification and trust difficult
- **Mobile-First Gap:** Modern users need mobile app access, but legacy systems lack proper API infrastructure

### 1.2 Solution Overview

NASA Sakhi addresses these challenges through:

1. **Self-Service Registration:** Multi-step web form enabling organizations to register independently
2. **Admin Vetting Workflow:** Quality control through administrative review and approval
3. **Multilingual Support:** AI-powered translation across 30 Indian languages using Google Cloud Translation
4. **Mobile API:** RESTful API enabling mobile app integration for service discovery
5. **Service Taxonomy:** Standardized categorization (14 categories, 76 service resources)
6. **Geographic Coverage:** Support for organizations across all Indian states and cities

### 1.3 Target Users

**Primary Users:**
- NGO administrators and coordinators
- Support service providers (shelters, counseling centers, legal aid, medical facilities)
- Social workers registering organizations on behalf of communities

**Secondary Users:**
- System administrators (NaariSamata team)
- Mobile app users (women and families seeking services)

---

## 2. Goals and Objectives

### 2.1 Business Goals

1. **Scale Service Registry:** Migrate 121 existing organizations and onboard 500+ new organizations within Year 1
2. **Language Accessibility:** Support 30 Indian languages with automated translation
3. **Quality Assurance:** Maintain >95% verified organization data through admin vetting
4. **Mobile Adoption:** Enable mobile app integration serving 100,000+ users
5. **Operational Efficiency:** Reduce manual registration overhead by 80% through self-service

### 2.2 User Goals

**For Organizations:**
- Complete registration in <20 minutes
- Update organization details independently
- Manage multiple branch locations
- Specify services offered across 14 categories

**For Administrators:**
- Review submissions efficiently (target: <48 hours)
- Validate organization authenticity
- Manage service taxonomy
- Monitor data quality metrics

**For End Users (via Mobile App):**
- Find relevant services in their language
- Filter by location, category, and resource type
- Access verified, up-to-date organization information

---

## 3. User Personas

### 3.1 Persona 1: Priya - NGO Administrator

**Background:**
- Works for a women's shelter in tier-2 city
- Moderate tech literacy
- Manages operations for 3 branch locations

**Goals:**
- Register organization quickly
- Keep service information updated
- Reach more beneficiaries

**Pain Points:**
- Limited time for administrative tasks
- Difficulty with complex forms
- Needs content in regional language

**User Needs:**
- Simple, step-by-step registration
- Progress saving (can complete later)
- Clear instructions and help text

---

### 3.2 Persona 2: Rahul - System Administrator

**Background:**
- NaariSamata tech team member
- Responsible for data quality
- Reviews 10-15 submissions daily

**Goals:**
- Efficiently vet new registrations
- Maintain high data quality
- Identify duplicate entries
- Monitor system health

**Pain Points:**
- Incomplete submission information
- Duplicate organization entries
- Lack of verification documents

**User Needs:**
- Bulk review capabilities
- Organization search/filtering
- Audit logs and activity tracking
- Duplicate detection tools

---

### 3.3 Persona 3: Meera - Mobile App End User

**Background:**
- Mother seeking childcare resources
- Prefers Hindi language
- Limited literacy, high smartphone usage

**Goals:**
- Find nearby childcare services
- Understand services offered
- Contact organizations easily

**Pain Points:**
- Information in English only
- Outdated contact details
- Unclear service descriptions

**User Needs:**
- Content in native language
- Location-based search
- Direct calling/WhatsApp links
- Simple, icon-based navigation

---

## 4. Functional Requirements

### 4.1 Organization Registration Flow

**FR-1: Multi-Step Registration Form**

**Priority:** P0 (Must Have)

**Description:** Organizations complete registration through a wizard-style multi-step form.

**Steps:**
1. **Organization Details**
   - Organization name (required, multilingual input supported)
   - Registration type (NGO, Trust, Government, Private, Other)
   - Registration number/certificate (required)
   - Year of establishment
   - Faith/religious affiliation (optional, from predefined list)
   - Social category served (optional, from predefined list)

2. **Contact Information**
   - Primary contact name, phone, email (required)
   - Secondary contact (optional)
   - Website URL (optional)
   - Social media links (Facebook, Instagram, Twitter)

3. **Service Categories & Resources**
   - Select applicable categories (checkboxes from 14 options)
     - 7 for Children: Education Support, Child Protection, Healthcare, Nutrition, Recreation, Skill Development, Legal Aid
     - 7 for Women: Women's Healthcare, Legal Support, Skill Training, Shelter/Safe Housing, Counseling, Economic Empowerment, Awareness Programs
   - For each category, select specific resources (from 76 total resources)
   - Multi-select with search/filter capability

4. **Branch Locations**
   - Add one or more branch addresses
   - For each branch:
     - Address line 1, 2 (required)
     - City (dropdown, searchable)
     - State (dropdown)
     - PIN code (6-digit validation)
     - Country (default: India)
     - Geographic coordinates (optional, future: map picker)
     - Branch operating hours (day-wise timings)

5. **Language Preferences**
   - Select languages in which services are offered
   - Multi-select from 30 Indian languages
   - Default: Hindi, English

6. **Document Uploads**
   - Registration certificate (PDF/image, max 5MB)
   - Organization logo (image, max 2MB)
   - Additional certifications (optional, max 3 files)
   - File validation: format, size, virus scanning

7. **Review & Submit**
   - Summary of all entered information
   - Edit buttons for each section
   - Terms & conditions checkbox
   - Submit button

**Acceptance Criteria:**
- Form supports save-as-draft functionality
- Validation errors displayed inline
- Progress indicator shows current step (Step X of 7)
- Users can navigate back/forward between steps
- File uploads show preview and allow removal
- Form auto-saves every 2 minutes to prevent data loss

---

**FR-2: Form Validation & Error Handling**

**Priority:** P0 (Must Have)

**Validation Rules:**
- Required fields enforced at each step
- Email format validation
- Phone number: 10 digits (Indian format)
- PIN code: 6 digits
- File size limits enforced
- Duplicate organization detection (by name + city)

**Error Handling:**
- Inline validation on field blur
- Summary of errors at form submission
- Clear error messages in plain language
- Prevent step progression if current step has errors

---

**FR-3: Draft Saving & Resume**

**Priority:** P1 (Should Have)

**Description:** Users can save incomplete forms and resume later.

**Features:**
- Auto-save draft every 2 minutes
- Manual "Save Draft" button
- Email/SMS notification with resume link
- Draft expiry: 30 days
- Resume via secure token link

---

### 4.2 Admin Vetting Workflow

**FR-4: Admin Dashboard**

**Priority:** P0 (Must Have)

**Description:** Centralized dashboard for administrators to manage submissions.

**Features:**
- **Submission Queue:**
  - List of pending submissions (table view)
  - Columns: Organization name, submission date, category, city, status
  - Sortable and filterable
  - Search by organization name
  - Status badges: Pending, Under Review, Approved, Rejected, Clarification Requested

- **Submission Details View:**
  - Full organization details in read-only mode
  - Download uploaded documents
  - View submission history/timeline
  - Notes section for internal comments

- **Review Actions:**
  - Approve button
  - Reject button (requires reason)
  - Request clarification (opens email composer)
  - Flag for review (escalation)

**Acceptance Criteria:**
- Dashboard loads in <2 seconds
- Actions require confirmation modal
- Approval triggers email to organization
- Rejection email includes reason and resubmission link

---

**FR-5: Duplicate Detection**

**Priority:** P1 (Should Have)

**Description:** Automatically detect potential duplicate organizations.

**Detection Logic:**
- Exact match on organization name + city
- Fuzzy match on name (>85% similarity)
- Same phone number or email
- Flag duplicates in admin dashboard

**Workflow:**
- Show warning during registration ("Similar organization exists")
- Admin can merge duplicates
- Admin can mark as "Not Duplicate"

---

**FR-6: Communication Tools**

**Priority:** P1 (Should Have)

**Description:** Email templates for admin-organization communication.

**Templates:**
- Submission received confirmation
- Approval notification
- Rejection notification (with reason)
- Clarification request
- Password reset
- Draft expiry reminder

**Requirements:**
- Templating engine (Handlebars/EJS)
- Multilingual support (organization's preferred language)
- Email tracking (opened, clicked)

---

### 4.3 Multilingual Support

**FR-7: Language Selection & Translation**

**Priority:** P0 (Must Have)

**Supported Languages (30):**
Hindi, English, Bengali, Telugu, Marathi, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi, Assamese, Maithili, Sanskrit, Konkani, Nepali, Sindhi, Dogri, Kashmiri, Manipuri, Bodo, Santali, Meitei, Tulu, Bhojpuri, Magahi, Haryanvi, Rajasthani, Chhattisgarhi

**Features:**
- Language selector in header (dropdown)
- User preference saved in session/cookie
- UI labels, buttons, help text translated
- Static content translation (pre-translated)
- Dynamic content translation (AI-powered via Google Cloud Translation API)

**Translation Strategy:**
- **Static Content:** Pre-translated JSON files for UI strings
- **Dynamic Content:** On-demand translation for organization-submitted data
- **Caching:** Translated content cached in database for performance
- **Fallback:** English as default if translation fails

**Acceptance Criteria:**
- Language change reflects immediately without page reload
- All UI elements translated (100% coverage)
- Translation accuracy: >90% (human review sample)
- API response time for translation: <500ms

---

**FR-8: Multilingual Data Entry**

**Priority:** P1 (Should Have)

**Description:** Allow organizations to enter data in their preferred language.

**Features:**
- Input fields accept Unicode (all Indian languages)
- Language-specific input methods (IME support)
- Option to provide English translation alongside
- RTL (Right-to-Left) support for Urdu

---

### 4.4 Mobile API

**FR-9: RESTful API for Mobile Apps**

**Priority:** P0 (Must Have)

**Endpoints:**

1. **GET /api/organizations**
   - List approved organizations
   - Query parameters: `city`, `state`, `category`, `resource`, `language`, `page`, `limit`
   - Response: Paginated list with 20 items per page
   - Include: Organization name, branch addresses, categories, resources, contact info

2. **GET /api/organizations/:id**
   - Get single organization details
   - Include all fields + branch timings

3. **GET /api/categories**
   - List all service categories
   - Response: Array of categories with IDs and names (multilingual)

4. **GET /api/resources**
   - List all service resources
   - Query parameter: `categoryId` (optional filter)
   - Response: Array of resources

5. **GET /api/locations**
   - List cities/states with organization count
   - For location-based filtering in app

6. **POST /api/search**
   - Full-text search across organizations
   - Body: `{ query: string, filters: { city?, category? } }`
   - Response: Ranked results

**API Standards:**
- REST conventions
- JSON responses
- JWT authentication (for future user-specific features)
- Rate limiting: 100 requests/minute per IP
- CORS enabled for mobile app domains
- API versioning: `/api/v1/...`
- Error responses follow RFC 7807 (Problem Details)

**Acceptance Criteria:**
- API response time: <200ms (p95)
- API uptime: >99.5%
- API documentation (OpenAPI/Swagger)
- Automated tests for all endpoints

---

### 4.5 Data Migration

**FR-10: Legacy Data Migration**

**Priority:** P0 (Must Have)

**Description:** Migrate 121 organizations from MySQL legacy system to PostgreSQL.

**Migration Scripts:**
1. `migrate-languages.ts` - Migrate 30 language records
2. `migrate-services.ts` - Migrate 14 categories + 76 resources
3. `migrate-organizations.ts` - Migrate 121 organizations with branches

**Data Validation:**
- Audit script (`audit-mysql-data.ts`) to check data quality
- Validate required fields present
- Check for duplicates
- Ensure referential integrity

**Process:**
1. Run audit script on MySQL data
2. Fix data quality issues
3. Run migration scripts in sequence
4. Validate migrated data in PostgreSQL
5. Manual review of sample (10%)
6. Generate migration report

**Rollback Strategy:**
- Keep MySQL database as backup
- PostgreSQL migrations are reversible
- Dry-run mode for testing

---

### 4.6 Search & Discovery

**FR-11: Organization Search**

**Priority:** P1 (Should Have)

**Features:**
- Full-text search by organization name
- Filter by city, state, category, resource
- Filter by language supported
- Sort by: Name (A-Z), Recently added, City
- Pagination (20 results per page)
- Export results as CSV (admin only)

---

### 4.7 User Management & Authentication

**FR-12: Authentication System**

**Priority:** P0 (Must Have)

**User Roles:**
1. **Organization User** (registered organization representative)
   - Can register organization
   - Can edit own organization details
   - Can manage branches

2. **Admin** (NaariSamata team)
   - Full access to admin dashboard
   - Approve/reject submissions
   - Manage service taxonomy
   - View analytics

3. **Super Admin** (system administrator)
   - All admin permissions
   - User management
   - System configuration
   - Database access

**Authentication:**
- NextAuth.js implementation
- Email + password login
- Password requirements: Min 8 chars, 1 uppercase, 1 number, 1 special
- Password reset via email link
- Session timeout: 24 hours
- Optional: OAuth (Google, Microsoft) for admins

**Authorization:**
- Role-based access control (RBAC)
- Organizations can only edit their own data
- Admins can view/edit all data

**Security:**
- Passwords hashed with bcrypt
- CSRF protection
- Rate limiting on login (5 attempts per 15 min)
- Email verification for new accounts

---

## 5. Non-Functional Requirements

### 5.1 Performance

**NFR-1: Page Load Time**
- Homepage: <1.5 seconds
- Registration form: <2 seconds
- Admin dashboard: <2 seconds
- API responses: <200ms (p95)

**NFR-2: Scalability**
- Support 10,000 concurrent users
- Handle 500 organizations initially, scale to 10,000+
- Database optimized for 100,000+ service lookups per day

**NFR-3: Caching**
- Static assets cached (1 year)
- API responses cached (5 minutes for organization list)
- Translation cache in database
- CDN for images/documents

---

### 5.2 Security

**NFR-4: Data Protection**
- HTTPS enforced (TLS 1.3)
- Environment variables for secrets
- Database connection pooling with encrypted connections
- File uploads scanned for malware
- SQL injection prevention (Prisma ORM)
- XSS prevention (React escaping + CSP headers)

**NFR-5: Privacy**
- GDPR-style data handling
- User consent for data processing
- Right to data deletion
- Audit logs for sensitive operations
- PII (Personally Identifiable Information) encrypted at rest

**NFR-6: Compliance**
- Indian IT Act compliance
- Data residency: All data stored in Indian servers
- Audit trail for all data changes

---

### 5.3 Accessibility

**NFR-7: WCAG Compliance**
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatible
- Color contrast ratio >4.5:1
- Alt text for all images
- ARIA labels for interactive elements

**NFR-8: Mobile Responsiveness**
- Responsive design (mobile-first)
- Tested on devices: 360px - 1920px width
- Touch-friendly targets (min 44x44px)
- Works on Android 8+ and iOS 12+

---

### 5.4 Reliability

**NFR-9: Uptime**
- System uptime: >99.5% (max 3.65 hours downtime/month)
- Scheduled maintenance windows: Monthly, off-peak hours
- Health check endpoints for monitoring

**NFR-10: Error Handling**
- Graceful degradation
- User-friendly error messages
- Error logging (Sentry/equivalent)
- Automatic retry for transient failures

**NFR-11: Backup & Recovery**
- Database backups: Daily (retained 30 days)
- Incremental backups: Every 6 hours
- Recovery Time Objective (RTO): <4 hours
- Recovery Point Objective (RPO): <6 hours

---

### 5.5 Maintainability

**NFR-12: Code Quality**
- TypeScript strict mode enforced
- ESLint rules enforced
- Code review required for all PRs
- Test coverage: >70%
- Documentation: JSDoc for complex functions

**NFR-13: Monitoring & Logging**
- Application logs (Winston/Pino)
- Access logs (Nginx)
- Error tracking (Sentry)
- Performance monitoring (APM)
- Uptime monitoring (UptimeRobot/Pingdom)

---

## 6. Technical Architecture

### 6.1 Technology Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS
- React Hook Form + Zod
- Axios (API client)

**Backend:**
- Next.js API Routes
- NextAuth.js
- Prisma ORM
- Node.js 18+

**Database:**
- PostgreSQL 15+ (primary)
- MySQL (legacy, read-only)

**External Services:**
- Google Cloud Translation API
- AWS S3 / Cloudflare R2 (file storage)
- SendGrid / Resend (email)

**DevOps:**
- Docker (containerization)
- PM2 (process manager)
- Nginx (reverse proxy)
- GitHub (version control)

---

### 6.2 Database Schema

**Key Tables:**

1. **Organization**
   - id (UUID, primary key)
   - name (text, multilingual)
   - registrationType (enum)
   - registrationNumber (text)
   - yearEstablished (integer)
   - faithId (foreign key, nullable)
   - socialCategoryId (foreign key, nullable)
   - websiteUrl (text, nullable)
   - status (enum: pending, approved, rejected)
   - createdAt, updatedAt

2. **OrganizationBranch**
   - id (UUID, primary key)
   - organizationId (foreign key)
   - addressLine1, addressLine2 (text)
   - cityId (foreign key)
   - stateId (foreign key)
   - pinCode (string, 6 chars)
   - latitude, longitude (decimal, nullable)
   - createdAt, updatedAt

3. **ContactInformation**
   - id (UUID, primary key)
   - organizationId (foreign key)
   - isPrimary (boolean)
   - name (text)
   - phone (text)
   - email (text)
   - facebookUrl, instagramUrl, twitterUrl (text, nullable)

4. **ServiceCategory**
   - id (UUID, primary key)
   - name (text, multilingual)
   - targetGroup (enum: children, women)
   - displayOrder (integer)

5. **ServiceResource**
   - id (UUID, primary key)
   - categoryId (foreign key)
   - name (text, multilingual)
   - description (text, nullable)

6. **BranchCategory** (junction table)
   - branchId (foreign key)
   - categoryId (foreign key)
   - Primary key: (branchId, categoryId)

7. **BranchResource** (junction table)
   - branchId (foreign key)
   - resourceId (foreign key)
   - Primary key: (branchId, resourceId)

8. **Language**
   - id (UUID, primary key)
   - name (text)
   - code (text, ISO 639-1)
   - isActive (boolean)

9. **OrganizationLanguage** (junction table)
   - organizationId (foreign key)
   - languageId (foreign key)

10. **BranchTimings**
    - id (UUID, primary key)
    - branchId (foreign key)
    - dayOfWeek (enum: Mon-Sun)
    - openTime, closeTime (time)
    - isClosed (boolean)

11. **Document**
    - id (UUID, primary key)
    - organizationId (foreign key)
    - type (enum: registration, logo, certificate)
    - filename (text)
    - fileUrl (text)
    - fileSize (integer)
    - mimeType (text)
    - uploadedAt

12. **User** (NextAuth)
    - id (UUID, primary key)
    - email (text, unique)
    - passwordHash (text)
    - role (enum: organization, admin, superAdmin)
    - organizationId (foreign key, nullable)
    - emailVerified (boolean)
    - createdAt, updatedAt

13. **SubmissionLog**
    - id (UUID, primary key)
    - organizationId (foreign key)
    - adminId (foreign key, nullable)
    - action (enum: submitted, approved, rejected, clarificationRequested)
    - notes (text, nullable)
    - timestamp

---

### 6.3 Deployment Architecture

**Staging Environment:**

1. **NaSaSakhiDB Server** (PostgreSQL)
   - Ubuntu 22.04
   - PostgreSQL 15
   - 4GB RAM, 2 vCPU
   - Firewall: Allow port 5432 from app servers only

2. **NaSaSakhiFEStg Server** (Application)
   - Ubuntu 22.04
   - Node.js 18+
   - PM2 (cluster mode, 2 instances)
   - Nginx reverse proxy
   - 8GB RAM, 4 vCPU

3. **NaSaSakhiBEStg Server** (Optional, for scaling)
   - Same as frontend
   - Separate API server

**Production Environment:**
- Same architecture with higher resources
- Load balancer (Nginx/HAProxy)
- Auto-scaling (Kubernetes optional)
- CDN for static assets
- Database read replicas

---

## 7. User Stories

### 7.1 Organization Registration Stories

**US-1: As an NGO administrator, I want to register my organization so that it appears in the mobile app directory.**

**Acceptance Criteria:**
- Can complete registration in 7 steps
- Can save draft and resume later
- Receive email confirmation upon submission
- See submission status (pending/approved/rejected)

---

**US-2: As an organization with multiple branches, I want to add all branch locations so that users can find the nearest one.**

**Acceptance Criteria:**
- Can add unlimited branches
- Each branch has separate address and timings
- Can assign different services to different branches
- Can edit/delete branches after submission

---

**US-3: As a non-English speaker, I want to complete registration in my regional language so that I can provide accurate information.**

**Acceptance Criteria:**
- Can select language from header
- All form labels and help text in selected language
- Can type organization details in regional language
- Validation errors shown in selected language

---

### 7.2 Admin Stories

**US-4: As an admin, I want to review pending submissions so that I can verify organization authenticity before approval.**

**Acceptance Criteria:**
- Can see list of pending submissions
- Can view full organization details
- Can download uploaded documents
- Can approve, reject, or request clarification

---

**US-5: As an admin, I want to detect duplicate organizations so that the directory stays clean.**

**Acceptance Criteria:**
- System flags potential duplicates automatically
- Can view both organizations side-by-side
- Can merge duplicates into one
- Can mark as "not duplicate" if false positive

---

### 7.3 API Consumer Stories

**US-6: As a mobile app developer, I want to fetch organizations by city and category so that users can find relevant services.**

**Acceptance Criteria:**
- API endpoint returns filtered results
- Results paginated (20 per page)
- Response includes organization name, address, contact, services
- Response time <200ms

---

**US-7: As a mobile app developer, I want to get organization details in the user's preferred language so that content is accessible.**

**Acceptance Criteria:**
- API accepts `language` query parameter
- Organization name and services translated to requested language
- Fallback to English if translation unavailable

---

## 8. Success Metrics

### 8.1 Business Metrics

- **Organization Growth:** 500 approved organizations by end of Year 1
- **Geographic Coverage:** Presence in all 28 Indian states
- **Language Coverage:** Active usage of all 30 supported languages
- **Data Quality:** <5% rejection rate for submissions
- **Mobile App Usage:** 100,000+ downloads, 50,000+ monthly active users

### 8.2 Technical Metrics

- **API Uptime:** >99.5%
- **Page Load Time:** <2 seconds (p95)
- **API Response Time:** <200ms (p95)
- **Error Rate:** <0.1% of requests
- **Translation Accuracy:** >90% (human-evaluated sample)

### 8.3 User Metrics

- **Registration Completion Rate:** >70% of started forms completed
- **Time to Complete Registration:** <20 minutes (median)
- **Admin Review Time:** <48 hours (median)
- **User Satisfaction:** >4.0/5.0 (post-registration survey)

---

## 9. Project Phases & Timeline

### Phase 0: Data Migration (IN PROGRESS)
**Duration:** 2 weeks
**Status:** In Progress (as of Jan 31, 2025)

**Tasks:**
- ✅ Set up MySQL connection
- ✅ Create data audit script
- 🔄 Audit legacy data quality
- 🔄 Write migration scripts (languages, services, organizations)
- Run migrations
- Validate migrated data

**Deliverables:**
- 121 organizations migrated to PostgreSQL
- 30 languages in database
- 14 categories + 76 resources in database

---

### Phase 1: Database Schema & Authentication
**Duration:** 2 weeks
**Status:** Pending

**Tasks:**
- Finalize Prisma schema
- Run migrations
- Seed reference data (categories, resources, languages)
- Implement NextAuth.js authentication
- Create user roles and permissions
- Build login/signup pages

**Deliverables:**
- Complete database schema
- Working authentication system
- Admin and organization user roles

---

### Phase 2: Organization Registration Flow
**Duration:** 4 weeks
**Status:** Pending

**Tasks:**
- Build multi-step form components
- Implement form validation (Zod schemas)
- Integrate file upload (S3/R2)
- Implement draft save/resume
- Create submission confirmation page
- Build organization edit page

**Deliverables:**
- Fully functional registration form
- Draft saving feature
- File upload system
- Email notifications

---

### Phase 3: Admin Vetting Workflow
**Duration:** 3 weeks
**Status:** Pending

**Tasks:**
- Build admin dashboard
- Create submission queue table
- Build submission details page
- Implement approve/reject actions
- Build duplicate detection algorithm
- Create email templates
- Implement communication tools

**Deliverables:**
- Admin dashboard
- Vetting workflow
- Email notification system
- Duplicate detection

---

### Phase 4: Multilingual Support
**Duration:** 2 weeks
**Status:** Pending

**Tasks:**
- Integrate Google Cloud Translation API
- Create translation cache system
- Build language selector component
- Translate UI strings (30 languages)
- Implement RTL support for Urdu
- Test all languages

**Deliverables:**
- 30-language support
- Translation caching
- Language-aware UI

---

### Phase 5: Mobile API
**Duration:** 2 weeks
**Status:** Pending

**Tasks:**
- Design RESTful API endpoints
- Implement organization listing API
- Implement search API
- Add filtering and pagination
- Implement rate limiting
- Create API documentation (Swagger)
- Write API tests

**Deliverables:**
- RESTful API (v1)
- API documentation
- Rate limiting
- Automated tests

---

### Phase 6: Testing & QA
**Duration:** 2 weeks
**Status:** Pending

**Tasks:**
- Write unit tests (70% coverage target)
- Write integration tests
- Perform manual QA testing
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile device testing
- Accessibility audit (WCAG 2.1 AA)
- Performance testing
- Security audit

**Deliverables:**
- Test suite with 70%+ coverage
- QA report
- Accessibility compliance
- Performance benchmarks

---

### Phase 7: Deployment & Launch
**Duration:** 1 week
**Status:** Pending

**Tasks:**
- Deploy to staging environment
- Conduct user acceptance testing (UAT)
- Fix bugs from UAT
- Deploy to production
- Monitor system health
- Train admins
- Create user documentation

**Deliverables:**
- Production deployment
- Monitoring setup
- User documentation
- Admin training materials

---

**Total Estimated Timeline:** 16 weeks (~4 months)

---

## 10. Dependencies & Integrations

### 10.1 External Dependencies

1. **Google Cloud Translation API**
   - Purpose: AI-powered translation for 30 languages
   - Pricing: Pay-per-character
   - Rate limits: 1M characters/day (default)
   - Fallback: English if API fails

2. **AWS S3 / Cloudflare R2**
   - Purpose: File storage for documents and images
   - Pricing: Pay-per-GB storage + bandwidth
   - Bucket: Private (signed URLs for downloads)

3. **SendGrid / Resend**
   - Purpose: Transactional emails
   - Pricing: Pay-per-email or monthly plan
   - Volume: Estimated 5,000 emails/month initially

4. **PostgreSQL Database**
   - Purpose: Primary data store
   - Version: 15+
   - Hosting: Dedicated server (NaSaSakhiDB)

5. **MySQL Database (Legacy)**
   - Purpose: Read-only access for migration
   - Will be decommissioned after Phase 0

---

### 10.2 Future Integrations

- **SMS Gateway** (Twilio/MSG91): For OTP verification and SMS notifications
- **WhatsApp Business API**: Direct messaging to organizations
- **Google Maps API**: Map picker for branch locations
- **Analytics** (Google Analytics/Plausible): User behavior tracking

---

## 11. Risks & Mitigations

### 11.1 Technical Risks

**Risk 1: Data Migration Failures**
- **Probability:** Medium
- **Impact:** High
- **Mitigation:**
  - Comprehensive data audit before migration
  - Dry-run migrations in test environment
  - Keep MySQL as fallback
  - Manual verification of sample data

**Risk 2: Translation API Costs**
- **Probability:** Medium
- **Impact:** Medium
- **Mitigation:**
  - Cache all translations in database
  - Translate only on-demand
  - Set API budget limits and alerts
  - Fallback to English if budget exceeded

**Risk 3: File Upload Security**
- **Probability:** Low
- **Impact:** High
- **Mitigation:**
  - File type whitelist (PDF, JPEG, PNG only)
  - File size limits enforced
  - Malware scanning on upload
  - Store in private S3 bucket with signed URLs

**Risk 4: Performance at Scale**
- **Probability:** Medium
- **Impact:** Medium
- **Mitigation:**
  - Database indexing on frequently queried fields
  - API response caching
  - CDN for static assets
  - Load testing before launch

---

### 11.2 Business Risks

**Risk 5: Low Adoption by Organizations**
- **Probability:** Medium
- **Impact:** High
- **Mitigation:**
  - User-friendly registration process
  - Multilingual support
  - Training materials and videos
  - Dedicated helpdesk for support

**Risk 6: Data Quality Issues**
- **Probability:** Medium
- **Impact:** Medium
- **Mitigation:**
  - Robust form validation
  - Admin vetting workflow
  - Duplicate detection
  - Periodic data quality audits

---

### 11.3 Operational Risks

**Risk 7: Server Downtime**
- **Probability:** Low
- **Impact:** High
- **Mitigation:**
  - High-availability architecture
  - Daily database backups
  - Monitoring and alerts
  - Incident response plan

**Risk 8: Admin Bottleneck**
- **Probability:** Medium
- **Impact:** Medium
- **Mitigation:**
  - Efficient admin dashboard
  - Bulk actions support
  - Automated duplicate detection
  - Multiple admin accounts

---

## 12. Open Questions

1. **Authentication:** Should organizations have login accounts to edit their own data, or is it a one-time submission?
   - **Recommendation:** Provide login accounts for ongoing updates

2. **Verification Documents:** What specific documents are required for verification?
   - **Recommendation:** Registration certificate (mandatory), others optional

3. **Branch Approval:** Should each branch be approved separately, or approve organization with all branches together?
   - **Recommendation:** Approve organization-level (all branches together)

4. **Translation Budget:** What is the monthly budget for Google Translation API?
   - **Recommendation:** Start with $100/month, adjust based on usage

5. **Mobile App Timeline:** When will the mobile app be ready to consume the API?
   - **Recommendation:** Coordinate Phase 5 (Mobile API) with app team

6. **Content Moderation:** Should there be automated content moderation for inappropriate text?
   - **Recommendation:** Not in MVP; add in future iteration

7. **Analytics Tracking:** What user analytics should be tracked?
   - **Recommendation:** Page views, form completion rate, API usage

---

## 13. Out of Scope (Future Enhancements)

The following features are **not included** in the initial release but may be added later:

1. **Advanced Search:** Elasticsearch integration for fuzzy search, autocomplete
2. **Ratings & Reviews:** User-generated ratings for organizations
3. **SMS Notifications:** SMS alerts for submission status
4. **WhatsApp Integration:** Direct WhatsApp messaging to organizations
5. **Map View:** Interactive map showing organization locations
6. **Analytics Dashboard:** Admin-facing analytics on usage, submissions, trends
7. **Bulk Import:** CSV upload for bulk organization registration
8. **Mobile App (Web):** Progressive Web App (PWA) version
9. **Offline Support:** Offline mode for registration form
10. **Social Sharing:** Share organizations on social media
11. **Donation Integration:** Link to organization donation pages
12. **Volunteer Matching:** Connect volunteers with organizations

---

## 14. Appendix

### 14.1 Service Taxonomy

**14 Service Categories:**

**For Children (7):**
1. Education Support
2. Child Protection
3. Healthcare
4. Nutrition
5. Recreation
6. Skill Development
7. Legal Aid for Children

**For Women (7):**
1. Women's Healthcare
2. Legal Support for Women
3. Skill Training
4. Shelter/Safe Housing
5. Counseling Services
6. Economic Empowerment
7. Awareness Programs

**76 Service Resources:** (detailed breakdown available in database after migration)

---

### 14.2 Technology Versions

- Node.js: 18.x or higher
- Next.js: 15.x
- React: 19.x
- TypeScript: 5.x
- Prisma: 7.3.0
- PostgreSQL: 15+
- Tailwind CSS: 3.x
- NextAuth.js: 5.x

---

### 14.3 Environment Variables

See [ENV-VARS-REFERENCE.md](../deployment/ENV-VARS-REFERENCE.md) for complete list.

**Critical Variables:**
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Authentication secret
- `GOOGLE_TRANSLATE_API_KEY`: Translation API key
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`: S3 credentials
- `SENDGRID_API_KEY` or `RESEND_API_KEY`: Email service

---

### 14.4 References

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Google Cloud Translation API](https://cloud.google.com/translate/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 1, 2026 | Claude Sonnet 4.5 | Initial PRD created based on codebase exploration |

---

**Document Status:** Draft - Awaiting Review & Approval

**Next Steps:**
1. Review PRD with stakeholders
2. Clarify open questions
3. Finalize project timeline
4. Approve budget for external services
5. Begin Phase 1 implementation
