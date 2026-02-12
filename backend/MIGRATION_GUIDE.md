# Organization Migration Guide

## Overview

This guide explains how to migrate organizations from the legacy MySQL database to PostgreSQL.

## Prerequisites

1. **MySQL Connection**: Ensure MySQL connection details are configured in `.env`:
   ```env
   MYSQL_HOST=your-mysql-host
   MYSQL_PORT=3306
   MYSQL_DATABASE=sakhi
   MYSQL_USER=your-username
   MYSQL_PASSWORD=your-password
   MYSQL_ORG_TABLE=New_organisation  # Optional: specify table name
   ```

2. **PostgreSQL Connection**: Ensure PostgreSQL connection is configured in `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

3. **Reference Data**: Ensure all reference data is seeded:
   - States
   - Cities
   - Languages
   - Service Categories
   - Service Resources
   - Faiths (if applicable)

## Running the Migration

### Option 1: Using npm script
```bash
cd backend
npm run db:migrate-organizations
```

### Option 2: Using tsx directly
```bash
cd backend
npx tsx scripts/migrate-organizations.ts
```

## Migration Process

The migration script will:

1. **Connect to MySQL** and fetch all organizations from the specified table
2. **Validate** each organization's data
3. **Check for duplicates** (by registration number)
4. **Create organization** in PostgreSQL with:
   - Basic organization data
   - Primary contact (if email/phone exists)
   - Branch (if address data exists)
5. **Generate a detailed report** with success/error counts

## Field Mapping

### Organization Fields

| MySQL Field | PostgreSQL Field | Notes |
|------------|------------------|-------|
| `name` | `name` | Required, min 3 characters |
| `type` | `registrationType` | Mapped to enum (NGO, TRUST, GOVERNMENT, PRIVATE, OTHER) |
| `registration_number` | `registrationNumber` | Required |
| `year_established` | `yearEstablished` | Defaults to current year if missing |
| `website_url` | `websiteUrl` | Optional |
| `faith_id` | `faithId` | Optional, must exist in faiths table |
| `status` | `status` | Mapped to enum (APPROVED, PENDING, etc.) |

### Contact Fields

If contact information exists in the organization table:
- `email` → Primary contact email
- `phone` → Primary contact phone (normalized to 10 digits)
- `contact_name` → Contact name

### Branch Fields

If address information exists in the organization table:
- `address` → `addressLine1`
- `city_id` → `cityId` (must exist in cities table)
- `state_id` → `stateId` (must exist in states table)
- `pin_code` → `pinCode` (normalized to 6 digits)

## Customization

### Adjusting Field Names

If your MySQL schema uses different field names, update the `LegacyOrganization` interface in `scripts/migrate-organizations.ts`:

```typescript
interface LegacyOrganization {
  id: number;
  name: string;
  // Add your actual MySQL field names here
  your_field_name?: string;
  // ...
}
```

### Handling Related Data

The script currently handles:
- ✅ Primary contact creation
- ✅ Single branch creation
- ⚠️ Categories, resources, languages (not migrated - add manually if needed)
- ⚠️ Multiple branches (only first branch migrated - add others manually)

To migrate additional related data, extend the transaction in the migration script.

## Troubleshooting

### Common Issues

1. **"Table not found"**
   - Check `MYSQL_ORG_TABLE` in `.env`
   - Verify MySQL connection settings

2. **"City or State not found"**
   - Ensure cities and states are seeded in PostgreSQL
   - Check that `city_id` and `state_id` in MySQL match PostgreSQL IDs

3. **"Duplicate organization"**
   - Organizations with existing registration numbers are skipped
   - Check the skipped count in the report

4. **"Phone number invalid"**
   - Phone numbers are normalized to 10 digits
   - If normalization fails, a default value is used

5. **"Registration type not recognized"**
   - Unknown types default to `OTHER`
   - Update `mapRegistrationType()` function if needed

## Post-Migration

After migration:

1. **Review the migration report** for errors
2. **Verify data** in Prisma Studio:
   ```bash
   npm run prisma:studio
   ```
3. **Add missing relationships** manually:
   - Categories
   - Resources
   - Languages
   - Additional branches
   - Additional contacts
4. **Update organization status** if needed (defaults to APPROVED)

## Expected Results

For 121 organizations:
- ✅ ~100-115 successful migrations (depending on data quality)
- ⏭️ ~5-10 skipped (duplicates)
- ❌ ~5-10 errors (data quality issues)

## Support

If you encounter issues:
1. Check the error details in the migration report
2. Verify MySQL and PostgreSQL connections
3. Ensure all reference data is seeded
4. Review the `LegacyOrganization` interface for field name mismatches
