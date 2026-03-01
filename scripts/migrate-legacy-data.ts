// @ts-nocheck
/**
 * Legacy Data Migration Script
 * Parses SQL dump files and migrates organizations to PostgreSQL
 *
 * Run: npx tsx scripts/migrate-legacy-data.ts
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

// Load environment variables FIRST - try .env.local, then .env
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Create Prisma client after environment is loaded
const prisma = new PrismaClient();

interface MigrationStats {
  totalOrganizations: number;
  successfulMigrations: number;
  failedMigrations: number;
  errors: Array<{ id: string; name: string; error: string }>;
}

/**
 * Parse SQL dump to extract organization data
 */
function parseOrganizationSQL(sqlContent: string): any[] {
  const organizations: any[] = [];

  // Find the REPLACE IGNORE INTO statement
  const replaceMatch = sqlContent.match(/REPLACE\s+IGNORE\s+INTO.*?VALUES\s+(.*?);/is);

  if (!replaceMatch) {
    console.log('❌ Could not find REPLACE INTO statement');
    return [];
  }

  const valuesSection = replaceMatch[1];

  // Split by '),(' to get individual records
  // Note: This is a simple parser - may need adjustment for complex data
  const records = valuesSection.split(/\),\s*\(/);

  records.forEach((record, index) => {
    // Clean up the record
    let cleanRecord = record.trim();
    if (cleanRecord.startsWith('(')) cleanRecord = cleanRecord.substring(1);
    if (cleanRecord.endsWith(')')) cleanRecord = cleanRecord.substring(0, cleanRecord.length - 1);

    // Parse fields - this is a simplified parser
    // Fields: OrganisationID, LanguageID, Organisation_Name, Organisation_Description,
    //         Organisation_Logo, Organisation_Type, Organisation_RegistrationID,
    //         Year_Established, Organisation_Doc1, Organisation_Doc2, Organisation_URL,
    //         Social_Media_link_1, Social_Media_link_2, Social_Media_link_3,
    //         Faith_Based, FaithID

    try {
      const parts = parseValueFields(cleanRecord);

      if (parts.length >= 16) {
        organizations.push({
          legacyId: cleanString(parts[0]),
          languageId: cleanString(parts[1]),
          name: cleanString(parts[2]),
          description: cleanString(parts[3]),
          // Skip logo binary (parts[4])
          type: cleanString(parts[5]),
          registrationNumber: cleanString(parts[6]),
          yearEstablished: parseYear(cleanString(parts[7])),
          // Skip doc1 binary (parts[8])
          // Skip doc2 binary (parts[9])
          websiteUrl: cleanString(parts[10]),
          socialMedia1: cleanString(parts[11]),
          socialMedia2: cleanString(parts[12]),
          socialMedia3: cleanString(parts[13]),
          faithBased: cleanString(parts[14]),
          faithId: cleanString(parts[15]),
        });
      }
    } catch (error) {
      console.log(`⚠️  Failed to parse record ${index + 1}:`, error.message);
    }
  });

  return organizations;
}

/**
 * Parse SQL value fields (handles quoted strings, NULLs, binary data)
 */
function parseValueFields(valueString: string): string[] {
  const fields: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let escapeNext = false;
  let inBinary = false;

  for (let i = 0; i < valueString.length; i++) {
    const char = valueString[i];

    if (escapeNext) {
      currentField += char;
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    // Handle _binary prefix
    if (!inQuotes && valueString.substring(i, i + 8) === '_binary ') {
      inBinary = true;
      i += 7; // Skip "_binary "
      continue;
    }

    if (char === "'" && !inBinary) {
      if (inQuotes) {
        // End of quoted string
        fields.push(currentField);
        currentField = '';
        inQuotes = false;
        // Skip until next comma
        while (i < valueString.length && valueString[i + 1] !== ',') i++;
      } else {
        // Start of quoted string
        inQuotes = true;
      }
      continue;
    }

    if (char === ',' && !inQuotes && !inBinary) {
      if (currentField.trim() === '' || currentField.trim() === 'NULL') {
        fields.push('NULL');
      } else if (!inQuotes) {
        fields.push(currentField.trim());
      }
      currentField = '';
      inBinary = false;
      continue;
    }

    if (inQuotes || (!inQuotes && char !== ' ' && char !== ',')) {
      currentField += char;
    }
  }

  // Add last field
  if (currentField.trim() && currentField.trim() !== ',') {
    fields.push(currentField.trim());
  }

  return fields;
}

/**
 * Clean string values (remove quotes, handle NULLs)
 */
function cleanString(value: string | undefined): string | null {
  if (!value || value === 'NULL' || value.trim() === '') return null;

  let cleaned = value.trim();

  // Remove surrounding quotes
  if ((cleaned.startsWith("'") && cleaned.endsWith("'")) ||
      (cleaned.startsWith('"') && cleaned.endsWith('"'))) {
    cleaned = cleaned.substring(1, cleaned.length - 1);
  }

  // Unescape quotes
  cleaned = cleaned.replace(/\\'/g, "'").replace(/\\"/g, '"');

  return cleaned || null;
}

/**
 * Parse year field
 */
function parseYear(value: string | null): number {
  if (!value || value === 'NULL') return 2000; // Default year

  const year = parseInt(value, 10);
  if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
    return 2000;
  }

  return year;
}

/**
 * Map legacy organization type to new enum
 */
function mapRegistrationType(type: string | null): string {
  if (!type) return 'OTHER';

  const normalized = type.trim().toUpperCase();
  const mapping: Record<string, string> = {
    'NGO': 'NGO',
    'TRUST': 'TRUST',
    'GOVERNMENT': 'GOVERNMENT',
    'GOVT': 'GOVERNMENT',
    'PRIVATE': 'PRIVATE',
  };

  return mapping[normalized] || 'OTHER';
}

/**
 * Extract social media URLs
 */
function extractSocialMedia(url: string | null): {
  facebookUrl: string | null;
  instagramHandle: string | null;
  twitterHandle: string | null;
} {
  if (!url) return { facebookUrl: null, instagramHandle: null, twitterHandle: null };

  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com')) {
    return { facebookUrl: url, instagramHandle: null, twitterHandle: null };
  }

  if (lowerUrl.includes('instagram.com') || lowerUrl.startsWith('@')) {
    const handle = url.startsWith('@') ? url : url.split('/').pop() || url;
    return { facebookUrl: null, instagramHandle: handle, twitterHandle: null };
  }

  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    const handle = url.startsWith('@') ? url : '@' + (url.split('/').pop() || url);
    return { facebookUrl: null, instagramHandle: null, twitterHandle: handle };
  }

  return { facebookUrl: null, instagramHandle: null, twitterHandle: null };
}

/**
 * Migrate a single organization
 */
async function migrateOrganization(legacyOrg: any, stats: MigrationStats) {
  try {
    // Check if organization already exists (by legacy registration number)
    if (legacyOrg.registrationNumber) {
      const existing = await prisma.organization.findFirst({
        where: { registrationNumber: legacyOrg.registrationNumber },
      });

      if (existing) {
        console.log(`⏭️  Skipping ${legacyOrg.name} (already exists)`);
        return;
      }
    }

    // Extract social media
    const social1 = extractSocialMedia(legacyOrg.socialMedia1);
    const social2 = extractSocialMedia(legacyOrg.socialMedia2);
    const social3 = extractSocialMedia(legacyOrg.socialMedia3);

    const facebookUrl = social1.facebookUrl || social2.facebookUrl || social3.facebookUrl;
    const instagramHandle = social1.instagramHandle || social2.instagramHandle || social3.instagramHandle;
    const twitterHandle = social1.twitterHandle || social2.twitterHandle || social3.twitterHandle;

    // Create organization in a transaction
    await prisma.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: legacyOrg.name || 'Unknown Organization',
          registrationType: mapRegistrationType(legacyOrg.type),
          registrationNumber: legacyOrg.registrationNumber || `LEGACY-${legacyOrg.legacyId}`,
          yearEstablished: legacyOrg.yearEstablished,
          faithId: legacyOrg.faithId,
          websiteUrl: legacyOrg.websiteUrl,
          status: 'APPROVED', // Legacy orgs are pre-approved
        },
      });

      // Create primary contact (using organization name as contact name)
      await tx.contactInformation.create({
        data: {
          organizationId: organization.id,
          isPrimary: true,
          name: legacyOrg.name || 'Primary Contact',
          email: 'legacy@example.com', // Default email (no email in legacy data)
          phone: '0000000000', // Default phone (no phone in legacy data)
          facebookUrl,
          instagramHandle,
          twitterHandle,
        },
      });

      console.log(`✅ Migrated: ${legacyOrg.name} (${organization.id})`);
    });

    stats.successfulMigrations++;
  } catch (error) {
    stats.failedMigrations++;
    stats.errors.push({
      id: legacyOrg.legacyId,
      name: legacyOrg.name || 'Unknown',
      error: error.message,
    });
    console.log(`❌ Failed to migrate ${legacyOrg.name}:`, error.message);
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  console.log('\n' + '='.repeat(70));
  console.log('Saathi - LEGACY DATA MIGRATION');
  console.log('='.repeat(70) + '\n');

  const stats: MigrationStats = {
    totalOrganizations: 0,
    successfulMigrations: 0,
    failedMigrations: 0,
    errors: [],
  };

  try {
    // Read SQL dump file
    const sqlPath = path.join(process.cwd(), 'Sqls', 'sakhi_organisation.sql');
    console.log(`📂 Reading SQL dump: ${sqlPath}\n`);

    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

    // Parse organizations
    console.log('🔍 Parsing SQL dump...\n');
    const organizations = parseOrganizationSQL(sqlContent);

    stats.totalOrganizations = organizations.length;
    console.log(`✅ Found ${organizations.length} organizations\n`);
    console.log('-'.repeat(70) + '\n');

    // Migrate each organization
    for (let i = 0; i < organizations.length; i++) {
      const org = organizations[i];
      console.log(`[${i + 1}/${organizations.length}] Processing: ${org.name}`);
      await migrateOrganization(org, stats);
    }

    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('MIGRATION SUMMARY');
    console.log('='.repeat(70) + '\n');
    console.log(`Total Organizations:     ${stats.totalOrganizations}`);
    console.log(`✅ Successful Migrations: ${stats.successfulMigrations}`);
    console.log(`❌ Failed Migrations:     ${stats.failedMigrations}`);
    console.log(`Success Rate:            ${((stats.successfulMigrations / stats.totalOrganizations) * 100).toFixed(1)}%`);

    if (stats.errors.length > 0) {
      console.log('\n' + '-'.repeat(70));
      console.log('ERRORS:');
      console.log('-'.repeat(70) + '\n');
      stats.errors.forEach((error) => {
        console.log(`❌ ${error.name} (${error.id}): ${error.error}`);
      });
    }

    console.log('\n' + '='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
runMigration();
