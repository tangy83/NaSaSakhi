# Data Migration Guide

**Last Updated:** March 4, 2026

---

## Overview

This guide documents the data migration strategy for Saathi. Two separate migration paths exist:

1. **Sathi Legacy Data Migration** (completed March 2026) — imports 121 pre-vetted NGOs from MySQL dump files into PostgreSQL using a SQL-file parser. **This is the migration that was actually run.**
2. **Live MySQL Migration** (deprecated/reference only) — connects to a live MySQL instance and migrates from `New_organisation` table.

---

## Migration 1: Sathi Legacy Data (SQL Dump Files)

### What Was Migrated

| Source SQL File | → Prisma Model | Volume |
|---|---|---|
| `sathi_new_service_category.sql` | `ServiceCategory` | 15 categories (8 Children, 7 Women) |
| `sathi_new_service_resource.sql` | `ServiceResource` | 82 resources |
| `sathi_city.sql` (English rows only) | `City` | Cities + per-state placeholder cities |
| `sathi_organisation.sql` | `Organization` | 121 orgs, APPROVED |
| `sathi_new_organisation_branch.sql` | `OrganizationBranch` + `ContactInformation` | 121 branches with contacts |
| `sathi_new_branch_category.sql` | `BranchCategory` | 594 branch↔category links |
| `sathi_new_branch_resource.sql` | `BranchResource` | 402 branch↔resource links |
| `sathi_id_sequences.sql` | `OrgIdCounter` | Set `nextOrgNum = 122` |

**States covered:** Gujarat (GJ), Jharkhand (JH), Telangana (TG), Karnataka (KA)

### Actual Results

```
✅ Organizations:    121 / 121 imported (0 errors)
✅ Branches:         121 / 121 created
✅ Branch-Categories: 594 links
✅ Branch-Resources:  402 links
✅ OrgIdCounter:     nextOrgNum = 122
```

### Script

**File:** `backend/scripts/migrate-sathi-data.ts`

**Run command:**
```bash
cd backend
npm run db:migrate-sathi
# or directly:
npx tsx scripts/migrate-sathi-data.ts
```

**SQL files location:** `Sqls/SQL review/Dump20260225/OneDrive_1_03-03-2026/` (repo root)

### Script Phases

The script is idempotent — safe to re-run. It uses upserts and `skipDuplicates` throughout.

| Phase | What it does |
|---|---|
| 1 — Cities | Parses `sathi_city.sql` English rows; upserts cities; creates per-state placeholder cities for NULL CityID branches |
| 2 — Service Categories | Upserts 15 categories from `sathi_new_service_category.sql` |
| 3 — Service Resources | Upserts 82 resources; looks up category UUID from phase 2 |
| 4 — Organizations | Imports 121 orgs as APPROVED from `sathi_organisation.sql` (English rows only) |
| 5 — Branches + Contacts | Creates branch + contact per org; extracts PIN code from address text via regex |
| 6 — Branch Categories | Imports 594 branch↔category links from `sathi_new_branch_category.sql` |
| 7 — Branch Resources | Imports 402 branch↔resource links from `sathi_new_branch_resource.sql` |
| 8 — OrgIdCounter | Sets `nextOrgNum = max(122, current)` so new registrations start at ORG00122 |

### Key Mappings Applied

| Issue | Solution |
|---|---|
| State code `TS` (Telangana in SQL) | Mapped to `TG` (Prisma code) |
| `pinCode` was required in schema | Made nullable (`String?`) before migration; also regex-extracts 6-digit PINs from address text |
| NULL `CityID` on ~25 branches | Per-state placeholder cities created: "Other - Gujarat", "Other - Jharkhand", "Other - Telangana", "Other - Karnataka" |
| NULL `registrationNumber` | Defaulted to `LEGACY-IMPORT-{OrganisationID}` |
| Faith IDs in SQL (`hind`, `isla`, `chri`) | Looked up by name at runtime: `hind→Hinduism`, `isla→Islam`, `chri→Christianity` |
| `Organisation_Type` enum values | Mapped: `NGO`→NGO, `Trust`→TRUST, `Government`→GOVERNMENT, else→OTHER |

### Schema Change Required Before Migration

`pinCode` was made nullable in both schema files before running the migration:

```prisma
// prisma/schema.prisma and backend/prisma/schema.prisma
model OrganizationBranch {
  pinCode String? @db.VarChar(6)  // was: String @db.VarChar(6)
}
```

Applied via:
```bash
cd backend && npx prisma db push
npx prisma generate
```

---

## Migration 2: Live MySQL (Reference / Legacy)

> **Note:** This script was written as a general-purpose migration template. The actual Sathi migration used SQL dump files (Migration 1 above), not a live MySQL connection. This script is retained as a reference for future live-DB migrations.

### Script

**File:** `backend/scripts/migrate-organizations.ts`

**Run command:**
```bash
cd backend
npm run db:migrate-organizations
# or:
npx tsx scripts/migrate-organizations.ts
```

### Prerequisites

Configure MySQL connection in `.env`:
```env
MYSQL_HOST=your-mysql-host
MYSQL_PORT=3306
MYSQL_DATABASE=sakhi
MYSQL_USER=your-username
MYSQL_PASSWORD=your-password
MYSQL_ORG_TABLE=New_organisation  # Optional: override table name
```

PostgreSQL connection (always required):
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

### What It Does

1. Connects to MySQL and fetches all rows from the specified table
2. Validates each org (name ≥ 3 chars, registration number required)
3. Checks for duplicates by registration number (skips existing)
4. Creates `Organization` + optional `ContactInformation` + optional `OrganizationBranch` per row

### Field Mapping

| MySQL Field | PostgreSQL Field | Notes |
|---|---|---|
| `name` | `name` | Required, min 3 chars |
| `type` | `registrationType` | Mapped to enum; unknown → OTHER |
| `registration_number` | `registrationNumber` | Required |
| `year_established` | `yearEstablished` | Defaults to current year |
| `website_url` | `websiteUrl` | Optional |
| `faith_id` | `faithId` | Optional |
| `status` | `status` | Defaults to APPROVED |
| `email` / `phone` / `contact_name` | `ContactInformation` | If present, creates primary contact |
| `address` / `city_id` / `state_id` / `pin_code` | `OrganizationBranch` | If city+state valid, creates branch |

### Limitations

- Only migrates one branch per organization
- Does not migrate service categories, resources, or languages
- City/state IDs must match exactly between MySQL and PostgreSQL

---

## Post-Migration Verification

After running either migration:

1. **Check org count in Prisma Studio:**
   ```bash
   npm run prisma:studio
   ```

2. **Verify OrgIdCounter:**
   ```sql
   SELECT * FROM org_id_counter;
   -- Should show nextOrgNum = 122 (or higher)
   ```

3. **Register a new org** → should receive ID `ORG00122` (or next available)

4. **Spot-check** an org from each state (GJ, JH, TG, KA) in the admin panel

5. **Verify branch categories and resources** are populated on org detail pages

---

## Troubleshooting

| Error | Fix |
|---|---|
| `Argument 'pinCode' is missing` | Run `npx prisma generate` after schema change |
| `P2021: Table does not exist` | Ensure `prisma db push` was run after schema changes |
| City/state not found | Check state code mapping; verify placeholder cities were created in Phase 1 |
| `skipDuplicates` silently skips rows | Check Prisma client version — requires Prisma 4+ |
