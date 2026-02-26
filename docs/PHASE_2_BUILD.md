# Phase 2 Build — Requirements Document

**Project:** NaariSamata (NASA Sakhi) Organization Registration Portal
**Phase:** 2
**Status:** Partially Complete — see Implementation Status below
**Date:** February 2026
**Last Updated:** February 26, 2026

---

## Background

Phase 1 delivered the core organization registration portal — a multi-step form that allows NGOs, trusts, and government bodies across India to self-register, capture their service offerings, branch locations, languages supported, and upload required documents. Organizations submit their records and the data is stored pending review.

Phase 2 introduces the **Volunteer** — a new user persona who acts as a field-level quality guardian. Volunteers travel across cities and villages in India, ensuring that the data captured in the system is accurate, coherent, and ready for consumption by end users on the mobile app. They also oversee the multi-language translation of organization content so it can reach communities in their own languages.

---

## Implementation Status (as of February 26, 2026)

| Feature | What Was Built | Status |
|---------|----------------|--------|
| Feature 1: Volunteer Authentication | Login page, NextAuth session, VOLUNTEER role, 8-hr inactivity timeout | ✅ Complete |
| Feature 2: Record Integrity Validation | Dashboard, org detail review, 3-action approval (Approve / Request Clarification / Reject), review notes, status history | ✅ Complete |
| Feature 3: Translation Review Interface | UI page scaffold exists at `/volunteer/organizations/[id]/translate` (parked). Backend review APIs exist in `backend/`. Not linked from UI. | ⏸ Pending |
| Feature 4: Multi-Language Data Storage | `OrganizationTranslation`, `BranchTranslation` models complete. Public API reads `VOLUNTEER_REVIEWED` translations with English fallback. | ✅ Schema done · ⏸ Pipeline pending |
| Feature 5: Language Coverage Dashboard | Page scaffold at `/volunteer/languages` exists but parked. Dashboard tile missing. | ⏸ Pending |
| Feature 6: Automated Translation Pipeline | Bhashini worker exists at `backend/src/app/api/internal/translation-worker/route.ts` but parked — cron disabled, job creation on approval disabled, env vars missing. | ⏸ Pending |
| Feature 7: Language Lifecycle Management | Admin panel — activate/deactivate languages, auto-cancels PENDING jobs on deactivation. Complete. | ✅ Complete |
| Feature 8: Font & Typeface Management | Language model extended (scriptFamily, isRTL, fontFamily, googleFontName). Admin UI complete. | ✅ Complete |
| Additional: Admin Data Management Panels | 6 CRUD panels added beyond original scope: service-categories, service-resources, faiths, social-categories, regions, languages | ✅ Complete |

---

## Persona: The Volunteer

**Who they are:**
A charity field worker employed by or associated with NaariSamata, traveling across districts, states, and rural areas of India. They carry a mobile device or have occasional access to a shared laptop. They work on behalf of the platform to ensure that organizations listed in the directory are trustworthy, accurately represented, and accessible to local communities.

**Their environment:**
- Frequently low-connectivity (2G/3G rural areas)
- Shared or personal mobile devices; occasionally a laptop
- Moving between multiple locations — villages, district offices, urban NGO hubs
- Time-pressured; needs simple, focused interfaces with minimal cognitive load

**Their mental model:**
> "I'm here to make sure the information about this organization is correct before it goes live on the app. Women and children will rely on this data to find help. It needs to be right."

**Their responsibilities in Phase 2:**
1. Verify that a registered organization's submitted information is accurate and complete
2. Stamp approved records so they appear on the mobile app
3. Review machine-translated content for accuracy and cultural appropriateness
4. Ensure organizations are represented in as many local languages as possible

---

## Feature 1: Volunteer Authentication

### Context
Currently the system has an `ORGANIZATION` role for self-registering organizations and `ADMIN`/`SUPER_ADMIN` roles for platform management. Volunteers need their own identity in the system — a distinct login tied to their field worker identity rather than an organizational email address.

### Requirements

**FR1.1 — Volunteer Login Page**
- A dedicated login route, separate from the organization registration flow
- Login credentials: **Volunteer ID** (alphanumeric, assigned by the platform) + **Password**
- Does not require an email address — many field workers operate without corporate email
- Clear error states: incorrect credentials, account locked, account inactive

**FR1.2 — User Role Extension**
- Add `VOLUNTEER` to the `UserRole` enum in the database
- Volunteer accounts are created and managed by an ADMIN — volunteers cannot self-register
- Volunteer sessions expire after 8 hours of inactivity (shorter than org sessions given shared device risk)

**FR1.3 — Session Management**
- Secure session with logout button prominently accessible
- Inactivity warning at 7 hours, auto-logout at 8 hours
- Clear "logged in as [Volunteer Name]" indicator on all volunteer screens

**FR1.4 — Access Control**
- Volunteers can only access the volunteer dashboard and its sub-pages
- Volunteers cannot access organization registration pages
- Volunteers cannot access admin configuration pages
- Unauthorized access attempts redirect to the volunteer login page

---

## Feature 2: Record Integrity Validation (Stamp of Approval)

### Context
When an organization completes registration, their record enters `PENDING` status. Before this record becomes visible on the mobile app, a volunteer must review it for accuracy and integrity. This is the volunteer's primary field activity — the equivalent of a physical site visit cross-referenced with the digital record.

### Requirements

**FR2.1 — Volunteer Dashboard**
- Landing page after login showing a summary of work items
- Counts visible at a glance:
  - Records awaiting review (PENDING)
  - Records the volunteer has approved (APPROVED, by this volunteer)
  - Records sent back for clarification (CLARIFICATION_REQUESTED)
- List of pending organizations sorted by submission date (oldest first)
- Each list item shows: organization name, registration type, district/state, date submitted

**FR2.2 — Organization Detail Review View**
- Volunteer can open a full read-only view of all submitted organization data
- Organized into sections mirroring the registration form:
  1. Organization Identity (name, type, registration number, year established, faith, social category)
  2. Contact Information (primary and secondary contacts, phone numbers, email)
  3. Online Presence (website, social media handles)
  4. Services Offered (selected categories and resources)
  5. Branch Locations (addresses, operating hours, GPS coordinates if provided)
  6. Languages Supported (which of the 30 Indian languages they serve)
  7. Documents (viewable registration certificate, logo, additional certificates)

**FR2.3 — Review Checklist**
- Each section in FR2.2 has a checklist the volunteer works through:
  - "Organization name matches registration document" ✓/✗
  - "Registration number format is valid" ✓/✗
  - "Contact phone number is reachable" ✓/✗
  - "Branch address is recognizable/valid" ✓/✗
  - "Uploaded documents are legible" ✓/✗
  - (Additional checklist items configurable by ADMIN)
- Volunteer cannot submit a review decision without completing the checklist

**FR2.4 — Review Actions**
Three actions are available, aligning with the existing `OrganizationStatus` enum:

| Action | Status Set | Description |
|---|---|---|
| **Approve** | `APPROVED` | Record is verified; organization will appear on mobile app |
| **Request Clarification** | `CLARIFICATION_REQUESTED` | Volunteer has specific questions; org is notified to update their submission |
| **Reject** | `REJECTED` | Record cannot be approved; org is notified with reason |

**FR2.5 — Review Notes**
- Every review action requires a notes field (mandatory for Clarification and Rejection; optional for Approval)
- Notes are stored against the organization record with volunteer identity and timestamp
- Notes are visible to ADMIN users; a summary is sent to the organization when relevant

**FR2.6 — Stamp of Approval**
- Approved organizations display a "NaariSamata Verified" indicator within the volunteer and admin interfaces
- The approval timestamp and volunteer name are recorded for audit purposes
- Approvals are not reversible by the volunteer — only ADMIN can change status of an approved record

**FR2.7 — Audit Trail**
- Every status change on an organization record is logged: who changed it, from what status, to what status, when, and any associated notes
- Audit log visible to ADMIN users

---

## Feature 3: Translation Review Interface

### Context
The mobile app will serve women and children across India who communicate in many languages. Organization information — submitted in English or a regional language — must be available in the local language of the end user. The system uses Google Cloud Translation API (already configured) to generate machine translations. Volunteers then review these translations for accuracy, cultural appropriateness, and readability before they are surfaced to mobile app users.

### Requirements

**FR3.1 — Translation Trigger**
- When a volunteer approves an organization (FR2.4), translation is automatically queued for all 30 Indian languages
- Volunteer can also manually trigger re-translation for a specific language if the source data changes
- Translation status per language is tracked (see Feature 4)

**FR3.2 — Translation Review Entry Point**
- From the volunteer dashboard or organization detail view, a "Review Translations" button is visible for approved organizations
- The volunteer selects a language to review from a list showing translation status per language:
  - "Not yet translated" — machine translation not yet generated
  - "Machine translated" — available for volunteer review
  - "Volunteer reviewed" — already reviewed and approved

**FR3.3 — Side-by-Side Translation Review Interface**
- Screen layout: original English content on the left, translated content on the right
- Fields presented for review (one at a time or scrollable):
  - Organization name
  - Organization description (if captured)
  - Branch descriptions / notes
  - Service category descriptions (as they appear on the mobile app)
  - Contact notes (e.g., preferred contact times)
- For each field, the volunteer can:
  - **Accept** the machine translation as-is
  - **Edit** the translation inline and save
  - **Flag** a field for further review (if unsure about accuracy)

**FR3.4 — Translation Completeness Indicator**
- A progress bar shows how many fields have been reviewed vs total fields for that language
- Volunteer can save partial progress and return later
- Once all fields are reviewed, the language is marked as `VOLUNTEER_REVIEWED`

**FR3.5 — Cultural & Linguistic Notes**
- Volunteers can attach a free-text note to any translated field (e.g., "This term doesn't exist in this dialect, used equivalent")
- Notes are stored for future reference and quality monitoring

---

## Feature 4: Multi-Language Organization Data Storage

### Context
Currently the database stores organization data once, in the language the organization used when filling the form. To power a multilingual mobile app and support volunteer translation review, organization content must be storable in multiple languages with associated status tracking.

### Requirements

**FR4.1 — OrganizationTranslation Table**
New database table to store translated organization-level content:
- Organization reference
- Language reference (to existing Language table)
- Translated fields: name, description, contact notes
- Translation source: `MACHINE` or `VOLUNTEER`
- Translation status: `PENDING_TRANSLATION` / `MACHINE_TRANSLATED` / `VOLUNTEER_REVIEWED`
- Timestamps: created, last updated
- Volunteer reference (who reviewed it)

**FR4.2 — BranchTranslation Table**
New database table to store translated branch-level content:
- Branch reference (to OrganizationBranch)
- Language reference
- Translated fields: branch description, address notes
- Same status tracking as FR4.1

**FR4.3 — Translation Status Lifecycle**
```
[Organization Approved]
        ↓
PENDING_TRANSLATION (translation job queued)
        ↓
MACHINE_TRANSLATED (Google Cloud Translation API called, result stored)
        ↓
VOLUNTEER_REVIEWED (volunteer has reviewed and accepted/edited)
```

**FR4.4 — API Endpoints for Mobile App**
New read-only endpoints for the future mobile app:
- `GET /api/organizations?lang=<langCode>` — list of approved organizations with content in specified language
- `GET /api/organizations/:id?lang=<langCode>` — full organization detail in specified language
- Falls back to English if translation not yet available for the requested language

**FR4.5 — Re-translation on Source Change**
- If an organization updates their record (post-approval by ADMIN), affected translations are reset to `PENDING_TRANSLATION` for re-processing

---

## Feature 5: Language Coverage Dashboard

### Context
Platform administrators and volunteer coordinators need visibility into how much of the organization directory is available in each of India's 30 languages. This helps prioritize volunteer translation review work and measure platform readiness for regional mobile app rollouts.

### Requirements

**FR5.1 — Dashboard Overview**
Accessible to both VOLUNTEER and ADMIN roles. Shows:
- Total approved organizations in the directory
- Number of organizations with at least one language fully volunteer-reviewed
- Number of languages with full or partial coverage

**FR5.2 — Per-Language Breakdown Table**
A table with one row per language:

| Language | Organizations Available | Machine Translated | Volunteer Reviewed | Coverage % |
|---|---|---|---|---|
| Hindi | 45 | 38 | 30 | 67% |
| Bengali | 45 | 20 | 15 | 33% |
| ... | | | | |

**FR5.3 — Per-Organization Language View**
Clicking into an organization from the dashboard shows which languages it has content in, with translation status per language — the volunteer can jump directly into the review interface for any language from here.

**FR5.4 — Quick Filters**
- "Not yet translated" — organizations with no translations initiated
- "Machine translated only" — organizations awaiting volunteer review
- "Volunteer reviewed" — fully reviewed organizations
- Filter by language
- Filter by state/region

**FR5.5 — Export**
- Dashboard data exportable as CSV for offline reporting and coordination meetings in the field
- Export includes: organization name, state, district, languages available, translation status per language

---

## Feature 6: Automated Translation Pipeline

### Context
Every time a new organization is approved, its content must be automatically translated into all languages that are currently active in the system. This should happen without any manual triggering — the volunteer stamps an approval, and the translation machinery starts running in the background. Volunteer coordinators and the language coverage dashboard should reflect the real-time status of this pipeline.

### Requirements

**FR6.1 — Auto-Trigger on Approval**
- When a volunteer sets an organization to `APPROVED` status (FR2.4), the system immediately enqueues a translation job covering all currently `isActive = true` languages
- The triggering is transactional — if the approval transaction fails, no translation jobs are queued
- Translation jobs are created as individual database records (one per language) with status `PENDING_TRANSLATION`

**FR6.2 — Background Translation Worker**
- A background job processes the `PENDING_TRANSLATION` queue
- For each pending entry, it calls the Google Cloud Translation API with the source content and target language code
- On success: stores the translated text and updates status to `MACHINE_TRANSLATED`
- On failure: increments a retry counter; retries up to 3 times with exponential backoff; after 3 failures, marks as `TRANSLATION_FAILED` for admin review
- Worker runs on a scheduled interval (e.g., every 5 minutes) or can be triggered on-demand by ADMIN

**FR6.3 — Translatable Fields**
The following content fields are passed to the translation API:
- Organization name
- Organization description / about text
- Service category descriptions (as shown to mobile app users)
- Branch descriptions / operating notes
- Contact notes

Static data (registration numbers, phone numbers, postal codes, URLs) is never passed for translation.

**FR6.4 — Translation Job Status Visibility**
- ADMIN and VOLUNTEER can see the current state of the translation queue for any organization
- Statuses surfaced: `PENDING_TRANSLATION`, `MACHINE_TRANSLATED`, `VOLUNTEER_REVIEWED`, `TRANSLATION_FAILED`
- Failed translations are highlighted in the language coverage dashboard with a retry action

**FR6.5 — Re-trigger on Source Content Change**
- If an approved organization's source content changes (e.g., ADMIN edits name or description), all translations for affected fields are reset to `PENDING_TRANSLATION`
- Volunteer-reviewed translations for unchanged fields are preserved

---

## Feature 7: Language Lifecycle Management

### Context
The set of 30 Indian languages is not permanently fixed. New languages may be added as the platform expands into new regions; languages that are no longer relevant may be deactivated. When this happens, the system must respond coherently — ensuring historical data is preserved, existing translations are not orphaned, and new translation jobs are queued or cancelled appropriately.

### Requirements

**FR7.1 — Adding a New Language**
When an ADMIN adds a new language to the system:
1. A new `Language` record is created with `isActive = true`, including name, ISO code, script family, writing direction, and associated font family (see Feature 8)
2. The system automatically queues `PENDING_TRANSLATION` jobs for every currently `APPROVED` organization, for this new language
3. The new language immediately appears in the volunteer translation review interface and the language coverage dashboard
4. The organization registration form's language selection list is updated to include the new language

The `Language` record must contain the following fields before activation:
- `name` — Display name (e.g., "Bodo")
- `code` — ISO 639 code (e.g., "brx")
- `scriptFamily` — Writing script (e.g., "Devanagari")
- `isRTL` — Boolean, true for right-to-left languages (Urdu, Sindhi, Kashmiri)
- `fontFamily` — CSS font-family name to use in the frontend (e.g., "Noto Sans Devanagari")
- `googleFontName` — Google Fonts identifier for dynamic loading
- `isActive` — Defaults to true

**FR7.2 — Deactivating a Language**
When an ADMIN deactivates a language:
1. The `Language` record is soft-deleted: `isActive` is set to `false` — hard deletion is never performed to preserve audit history
2. Any pending translation jobs for this language are cancelled (status set to `CANCELLED`)
3. Existing completed translations (`MACHINE_TRANSLATED` or `VOLUNTEER_REVIEWED`) are retained in the database but are no longer served via the mobile app API
4. The language disappears from the volunteer translation review interface and the language selection in the registration form
5. The language coverage dashboard marks the language as "Inactive" with a record count of its historical translations

**FR7.3 — Language Configuration Audit**
- All language additions and deactivations are recorded in the `AuditLog` with the acting ADMIN's identity and timestamp
- ADMIN can view a history of language lifecycle events

**FR7.4 — Database Constraint Integrity**
- Foreign keys from `OrganizationTranslation` and `BranchTranslation` to `Language` use `ON DELETE RESTRICT` — a language cannot be hard-deleted while translations reference it
- Deactivation (soft-delete) is the only permitted removal path

---

## Feature 8: Font & Typeface Management

### Context
India's 30 scheduled languages are written in 13 different scripts. The current frontend uses only Latin-alphabet fonts (Cormorant Garamond, Open Sans, Nunito, Roboto) and has no support for Devanagari, Tamil, Telugu, Kannada, or any other Indian script. When translated content is displayed in the volunteer review interface and ultimately on the mobile app, the correct typeface must render for each script — otherwise text appears as blank boxes or garbled characters.

### Requirements

**FR8.1 — Font Metadata on the Language Model**
Extend the `Language` database model with font-related fields:

| Field | Type | Description |
|---|---|---|
| `scriptFamily` | String | Writing script name (e.g., "Devanagari", "Tamil", "Arabic") |
| `isRTL` | Boolean | True if language is right-to-left (Urdu, Sindhi, Kashmiri) |
| `fontFamily` | String | CSS font-family to apply when rendering this language |
| `googleFontName` | String | Google Fonts identifier for dynamic loading |

**FR8.2 — Required Typefaces by Script**
The following fonts must be added to the project and loaded appropriately. All are from the Noto Sans family — designed specifically for cross-script coverage and widely used in Indian government and NGO platforms.

| Script | Languages | Font Required | Google Font Name |
|---|---|---|---|
| Devanagari | Hindi, Marathi, Sanskrit, Nepali, Maithili, Dogri, Konkani | Noto Sans Devanagari | `Noto+Sans+Devanagari` |
| Bengali | Bengali, Assamese | Noto Sans Bengali | `Noto+Sans+Bengali` |
| Tamil | Tamil | Noto Sans Tamil | `Noto+Sans+Tamil` |
| Telugu | Telugu | Noto Sans Telugu | `Noto+Sans+Telugu` |
| Kannada | Kannada | Noto Sans Kannada | `Noto+Sans+Kannada` |
| Malayalam | Malayalam | Noto Sans Malayalam | `Noto+Sans+Malayalam` |
| Gujarati | Gujarati | Noto Sans Gujarati | `Noto+Sans+Gujarati` |
| Gurmukhi | Punjabi | Noto Sans Gurmukhi | `Noto+Sans+Gurmukhi` |
| Odia | Odia | Noto Sans Oriya | `Noto+Sans+Oriya` |
| Arabic (Nastaliq) | Urdu, Sindhi, Kashmiri | Noto Nastaliq Urdu | `Noto+Nastaliq+Urdu` |
| Ol Chiki | Santali | Noto Sans Ol Chiki | `Noto+Sans+Ol+Chiki` |
| Meitei Mayek | Manipuri | Noto Sans Meitei Mayek | `Noto+Sans+Meitei+Mayek` |
| Latin | English | Existing fonts (Open Sans) | Already loaded |

**FR8.3 — Font Loading Strategy**
Fonts must be loaded in a way that does not penalise page performance for users who do not need all scripts:
- Use **Next.js dynamic font loading** (`next/font/google`) instead of the current CSS `@import` approach
- Load fonts for the **active languages only** — do not load all 13 scripts on every page
- The volunteer translation review interface loads only the font for the language being reviewed
- The language coverage dashboard may load all fonts lazily as the user scrolls
- Fonts are specified per page/component, not globally in `globals.css`

**FR8.4 — CSS Application of Script Fonts**
- When rendering translated content, the wrapping element must carry a `lang` attribute (HTML standard) and the corresponding `font-family` CSS class
- RTL languages (Urdu, Sindhi, Kashmiri) require `dir="rtl"` on their container elements, which flips the layout of the translation review interface for those languages
- Tailwind utility classes for font-family must be extended in `tailwind.config.ts` to include all Noto font families

**FR8.5 — Font Availability Validation**
- When an ADMIN adds a new language (FR7.1), the admin form must require the `googleFontName` to be filled in before the language can be activated
- The system validates that the provided `googleFontName` corresponds to a known Google Fonts identifier (or the font is bundled locally)
- Languages without a valid font configuration cannot be set to `isActive = true`

**FR8.6 — Seed Data Update**
The language seed script (`backend/prisma/seed.ts`) must be updated to populate the new font-related fields for all 30 existing languages. No language should be seeded without a complete font configuration.

---

## Database Changes Summary

| Change | Type | Reason |
|---|---|---|
| Add `VOLUNTEER` to `UserRole` enum | Schema modification | New user persona |
| New `OrganizationTranslation` model | New table | Store multilingual org content |
| New `BranchTranslation` model | New table | Store multilingual branch content |
| New `ReviewNote` model | New table | Capture volunteer review observations |
| New `AuditLog` model | New table | Track all status changes and language lifecycle events |
| New `TranslationStatus` enum | New enum | Track translation lifecycle (`PENDING_TRANSLATION`, `MACHINE_TRANSLATED`, `VOLUNTEER_REVIEWED`, `TRANSLATION_FAILED`, `CANCELLED`) |
| New `TranslationJob` model | New table | Queue and track background translation jobs per org per language |
| Add `scriptFamily` to `Language` | Schema modification | Store writing script metadata |
| Add `isRTL` to `Language` | Schema modification | Flag right-to-left languages for UI direction |
| Add `fontFamily` to `Language` | Schema modification | CSS font-family for rendering |
| Add `googleFontName` to `Language` | Schema modification | Dynamic font loading identifier |

---

## Existing Infrastructure to Reuse

| Asset | Location | Usage in Phase 2 |
|---|---|---|
| `User` model with roles | `backend/prisma/schema.prisma` | Extend with VOLUNTEER role |
| `Organization.status` enum | `backend/prisma/schema.prisma` | Reuse APPROVED/REJECTED/CLARIFICATION_REQUESTED |
| `Language` table (30 languages) | `backend/prisma/schema.prisma` | Extend with font/script metadata fields |
| `OrganizationLanguage` junction | `backend/prisma/schema.prisma` | Existing link between orgs and languages |
| NextAuth credentials provider | `src/app/api/auth/` | Extend for volunteer login |
| Google Cloud Translation API | `.env` (key must be added) | Wire up for automated translation pipeline |
| Organization detail data models | `src/types/api.ts` | Reuse for volunteer review views |
| `globals.css` font imports | `src/app/globals.css` | Replace CSS `@import` with Next.js `next/font/google` |
| `tailwind.config.ts` font families | `tailwind.config.ts` | Extend with Noto Sans Indian script families |
| Language seed data | `backend/prisma/seed.ts` | Extend with font/script metadata for all 30 languages |

**Note:** The Google Cloud Translation API key is not currently present in `.env` or `.env.example` — this must be provisioned and configured as part of Phase 2 setup before the translation pipeline (Feature 6) can be built.

---

## Out of Scope for Phase 2

- Mobile app development (Phase 3)
- Volunteer account creation UI — ADMIN creates volunteers directly in Phase 2; a management interface is Phase 3
- Volunteer assignment to specific organizations or geographic territories — volunteers work from a shared queue in Phase 2
- Automated email notifications to organizations — ADMIN notifies manually in Phase 2
- Two-factor authentication for volunteers
- Self-hosted font serving (Google Fonts CDN is acceptable for Phase 2; self-hosting is a Phase 3 performance optimization)

---

## Open Questions

1. **Volunteer ID format:** Should Volunteer IDs follow a specific format (e.g., `VOL-2026-001`)? Who assigns them?
2. **Translation priority:** When there are many untranslated organizations, how should the translation queue be prioritized — by submission date, geography, organization size, or a manual priority flag?
3. **Languages for Phase 2 launch:** Should translation review launch with all 30 languages simultaneously, or phase in a subset (e.g., top 10 by population)? Phasing in reduces initial font loading overhead.
4. **Checklist configurability:** Should checklist items be hardcoded or configurable by ADMIN? If configurable, this adds complexity.
5. **Offline capability:** Should the volunteer interface support offline review with sync on reconnect, given low-connectivity environments?
6. **Translation job runner:** Should the background translation worker run as a Next.js API route called by a cron job, or as a standalone Node.js worker process? The latter is more robust but requires infrastructure changes.
7. **Font licensing:** Noto Sans fonts are open-source (SIL Open Font License) — no licensing concern. Confirm if any custom branded fonts are required for Indian scripts.
8. **ID code mismatch resolution:** The frontend currently uses 4-character language codes (e.g., `hini`, `tata`) while the database seeds ISO 639 codes (e.g., `hi`, `ta`). This must be resolved before any translation feature goes live — which code format should be the canonical one?

---

## Phase 2 Remaining Backlog — Translation & Per-Language Approval

**Owner:** Akarsha (Backend Lead)

Features 3, 4 (pipeline portion), 5, and 6 remain to be enabled. The infrastructure (DB schema, Bhashini worker, backend APIs) is already built — the remaining work is wiring it together, mirroring backend APIs into the root (Vercel) app, and un-parking the frontend.

### Per-Org Per-Language Approval Flow

```
Org APPROVED by volunteer
    ↓
TranslationJob created per active language (PENDING_TRANSLATION)
    ↓
Bhashini worker runs → OrganizationTranslation rows created (MACHINE_TRANSLATED)
    ↓
Volunteer opens /translate page → reviews each field in each language → Accept / Edit
    ↓  (when all fields done for a language)
TranslationJob → VOLUNTEER_REVIEWED
    ↓
Public API serves this language's translation to mobile app
(GET /api/orgs?lang=hi — only VOLUNTEER_REVIEWED content is returned)
```

### Task B1 — Re-enable Bhashini Pipeline
- Configure env vars: `BHASHINI_USER_ID`, `BHASHINI_API_KEY`, `INTERNAL_API_KEY`
- Restore `translationJob.createMany()` in org approval route when status → APPROVED
- Re-add cron entry in `vercel.json` (`/api/internal/translation-worker`, every 5 mins)
- Mirror worker from `backend/src/app/api/internal/translation-worker/route.ts` into the root app
- Verify: approval → jobs created → worker runs → MACHINE_TRANSLATED

### Task B2 — Add Translation Review APIs to Root App
The volunteer translation review routes live in `backend/src/app/api/volunteer/organizations/[id]/translations/`. Mirror them in `src/app/api/volunteer/organizations/[id]/translations/` so the Vercel-deployed frontend can call them.

- `GET /api/volunteer/organizations/[id]/translations` — per-language status (jobStatus, reviewedFieldCount, totalFieldCount)
- `GET /api/volunteer/organizations/[id]/translations/[langCode]` — source + translated fields for review UI
- `PATCH /api/volunteer/organizations/[id]/translations/[langCode]` — volunteer accepts/edits one field; auto-marks job VOLUNTEER_REVIEWED when all fields done

### Task B3 — Un-park Translation Review Frontend
- Remove "Feature Unavailable" placeholder from `src/app/volunteer/organizations/[id]/translate/page.tsx`
- Wire to B2 APIs; side-by-side layout (English source left, translation right)
- Per-field Accept / Edit inline actions; language sidebar with per-language completion %
- RTL support (`dir="rtl"`) for Urdu, Sindhi, Kashmiri
- Surface from review page: "Review Translations" link when org is APPROVED

### Task B4 — Un-park Language Coverage Dashboard
- Remove "Feature Unavailable" from `src/app/volunteer/languages/page.tsx`
- Wire to existing `GET /api/admin/languages` (already returns `coveragePercent`)
- Add "Language Coverage" tile to volunteer dashboard (visible to VOLUNTEER+, not just ADMIN)

### Task B5 — Translation Status Panel on Review Page
- After org is APPROVED, show collapsible "Translation Status" section on the review page
- Calls `GET /api/volunteer/organizations/[id]/translations`
- Per-language badge + link to translate page for each language

### Dependency Order

```
B1 (pipeline) → B2 (APIs) → B3 (review UI) and B5 (status panel)
                            B4 (coverage dashboard) is mostly independent
```

### Definition of Done

- [ ] Approving an org creates `TranslationJob` rows for all active non-English languages
- [ ] Bhashini worker processes the queue; jobs → `MACHINE_TRANSLATED`; `OrganizationTranslation` rows created
- [ ] Volunteer opens translate page, reviews fields, marks as `VOLUNTEER_REVIEWED`
- [ ] When all fields reviewed for a language, `TranslationJob.status → VOLUNTEER_REVIEWED`
- [ ] `GET /api/orgs?lang=hi` returns Hindi name for fully reviewed org; falls back to English otherwise
- [ ] Language coverage dashboard shows accurate counts
- [ ] RTL languages render correctly in the translation review UI
