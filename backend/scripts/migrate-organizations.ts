// @ts-nocheck
/**
 * Organization Migration Script
 * Migrates organizations from MySQL to PostgreSQL
 *
 * Run: npm run db:migrate-organizations
 * Or: npx tsx scripts/migrate-organizations.ts
 */

import { connectToMySQL } from '../../scripts/db-connect';
import * as dotenv from 'dotenv';

dotenv.config();

// Legacy MySQL Organization Interface
// Adjust these fields based on your actual MySQL schema
interface LegacyOrganization {
  id: number;
  name: string;
  type?: string;
  registration_number?: string;
  registrationNumber?: string;
  year_established?: number;
  yearEstablished?: number;
  website_url?: string;
  websiteUrl?: string;
  faith_id?: string;
  faithId?: string;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  // Contact fields (if stored in same table)
  email?: string;
  phone?: string;
  contact_name?: string;
  // Address fields (if stored in same table)
  address?: string;
  city_id?: string;
  state_id?: string;
  pin_code?: string;
  pinCode?: string;
}

interface MigrationStats {
  total: number;
  success: number;
  errors: number;
  skipped: number;
  errorDetails: Array<{ name: string; error: string }>;
}

/**
 * Maps MySQL registration type to PostgreSQL enum
 */
function mapRegistrationType(type: string | null | undefined): string {
  if (!type) return 'OTHER';

  const normalizedType = type.trim().toUpperCase();
  const mapping: Record<string, string> = {
    'NGO': 'NGO',
    'TRUST': 'TRUST',
    'GOVERNMENT': 'GOVERNMENT',
    'GOVT': 'GOVERNMENT',
    'PRIVATE': 'PRIVATE',
    'OTHER': 'OTHER',
  };

  return mapping[normalizedType] || 'OTHER';
}

/**
 * Maps MySQL status to PostgreSQL enum
 */
function mapOrganizationStatus(status: string | null | undefined): string {
  if (!status) return 'APPROVED'; // Existing orgs are pre-approved

  const normalizedStatus = status.trim().toUpperCase();
  const mapping: Record<string, string> = {
    'APPROVED': 'APPROVED',
    'PENDING': 'PENDING',
    'REJECTED': 'REJECTED',
    'CLARIFICATION_REQUESTED': 'CLARIFICATION_REQUESTED',
  };

  return mapping[normalizedStatus] || 'APPROVED';
}

/**
 * Normalizes phone number to 10 digits
 */
function normalizePhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Extract last 10 digits (in case of country code)
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  
  return digits.length === 10 ? digits : null;
}

/**
 * Normalizes PIN code to 6 digits
 */
function normalizePinCode(pinCode: string | null | undefined): string | null {
  if (!pinCode) return null;
  
  const digits = pinCode.toString().replace(/\D/g, '');
  return digits.length === 6 ? digits : null;
}

/**
 * Main migration function
 */
async function migrateOrganizations() {
  console.log('🚀 Starting organization migration from MySQL to PostgreSQL...\n');

  const mysql = await connectToMySQL();
  
  // Dynamic import to avoid loading Prisma during build phase
  const { default: prisma } = await import('../src/lib/prisma');

  const stats: MigrationStats = {
    total: 0,
    success: 0,
    errors: 0,
    skipped: 0,
    errorDetails: [],
  };

  try {
    // Fetch all organizations from MySQL
    // Adjust table name based on your actual MySQL schema
    // Common table names: 'organizations', 'New_organisation', 'new_organisation'
    const tableName = process.env.MYSQL_ORG_TABLE || 'New_organisation';
    
    console.log(`📋 Fetching organizations from MySQL table: ${tableName}`);
    
    const [rows] = await mysql.query<LegacyOrganization[]>(
      `SELECT * FROM ${tableName}`
    );

    stats.total = Array.isArray(rows) ? rows.length : 0;
    console.log(`✅ Found ${stats.total} organizations to migrate\n`);

    if (stats.total === 0) {
      console.log('⚠️  No organizations found. Please check:');
      console.log('   1. MySQL connection settings in .env');
      console.log('   2. Table name (set MYSQL_ORG_TABLE if different)');
      console.log('   3. Database contains data');
      return;
    }

    // Process each organization
    for (let i = 0; i < stats.total; i++) {
      const legacyOrg = rows[i];
      const orgName = legacyOrg.name || `Organization #${legacyOrg.id}`;
      
      console.log(`\n[${i + 1}/${stats.total}] Processing: ${orgName}`);

      try {
        // Check if organization already exists (by name + registration number)
        const registrationNumber = legacyOrg.registration_number || legacyOrg.registrationNumber || '';
        
        if (registrationNumber) {
          const existing = await prisma.organization.findFirst({
            where: {
              registrationNumber: registrationNumber,
            },
          });

          if (existing) {
            console.log(`   ⏭️  Skipped: Organization with registration number ${registrationNumber} already exists`);
            stats.skipped++;
            continue;
          }
        }

        // Prepare organization data
        const registrationType = mapRegistrationType(legacyOrg.type);
        const status = mapOrganizationStatus(legacyOrg.status);
        const yearEstablished = legacyOrg.year_established || legacyOrg.yearEstablished || new Date().getFullYear();
        const websiteUrl = legacyOrg.website_url || legacyOrg.websiteUrl || null;
        const faithId = legacyOrg.faith_id || legacyOrg.faithId || null;

        // Validate required fields
        if (!legacyOrg.name || legacyOrg.name.trim().length < 3) {
          throw new Error('Organization name is missing or too short (min 3 characters)');
        }

        if (!registrationNumber || registrationNumber.trim().length === 0) {
          throw new Error('Registration number is required');
        }

        // Create organization with transaction to handle related data
        const organization = await prisma.$transaction(async (tx) => {
          // Create organization
          const org = await tx.organization.create({
            data: {
              name: legacyOrg.name.trim(),
              registrationType: registrationType as any,
              registrationNumber: registrationNumber.trim(),
              yearEstablished: yearEstablished,
              faithId: faithId,
              status: status as any,
              websiteUrl: websiteUrl,
            },
          });

          // Create primary contact if email/phone exists
          if (legacyOrg.email || legacyOrg.phone) {
            const normalizedPhone = normalizePhone(legacyOrg.phone);
            const contactName = legacyOrg.contact_name || legacyOrg.name || 'Primary Contact';

            if (legacyOrg.email || normalizedPhone) {
              await tx.contactInformation.create({
                data: {
                  organizationId: org.id,
                  isPrimary: true,
                  name: contactName,
                  phone: normalizedPhone || '0000000000', // Default if missing
                  email: legacyOrg.email || `contact${org.id}@example.com`, // Default if missing
                },
              });
            }
          }

          // Create branch if address data exists
          if (legacyOrg.address || legacyOrg.city_id || legacyOrg.state_id) {
            const cityId = legacyOrg.city_id;
            const stateId = legacyOrg.state_id;
            const pinCode = normalizePinCode(legacyOrg.pin_code || legacyOrg.pinCode);

            // Validate city and state exist
            if (cityId && stateId) {
              const city = await tx.city.findUnique({ where: { id: cityId } });
              const state = await tx.state.findUnique({ where: { id: stateId } });

              if (!city || !state) {
                console.log(`   ⚠️  Warning: City or State not found, skipping branch creation`);
              } else {
                await tx.organizationBranch.create({
                  data: {
                    organizationId: org.id,
                    addressLine1: legacyOrg.address || 'Address not provided',
                    addressLine2: null,
                    cityId: cityId,
                    stateId: stateId,
                    pinCode: pinCode || '000000', // Default if missing
                  },
                });
              }
            }
          }

          return org;
        });

        stats.success++;
        console.log(`   ✅ Migrated successfully! New ID: ${organization.id}`);

      } catch (error: any) {
        stats.errors++;
        const errorMsg = error.message || String(error);
        stats.errorDetails.push({
          name: orgName,
          error: errorMsg,
        });
        console.error(`   ❌ Failed: ${errorMsg}`);
      }
    }

    // Generate migration report
    console.log('\n' + '='.repeat(80));
    console.log('📊 MIGRATION REPORT');
    console.log('='.repeat(80));
    console.log(`Total Organizations: ${stats.total}`);
    console.log(`✅ Successfully Migrated: ${stats.success}`);
    console.log(`⏭️  Skipped (duplicates): ${stats.skipped}`);
    console.log(`❌ Errors: ${stats.errors}`);

    if (stats.errorDetails.length > 0) {
      console.log('\n❌ Error Details:');
      stats.errorDetails.forEach((detail, index) => {
        console.log(`\n${index + 1}. ${detail.name}`);
        console.log(`   Error: ${detail.error}`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log(`✅ Migration completed!`);
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await mysql.end();
    await prisma.$disconnect();
    console.log('✅ Database connections closed');
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateOrganizations()
    .then(() => {
      console.log('✅ Migration script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateOrganizations };
