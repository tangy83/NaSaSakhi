/**
 * migrate-sathi-data.ts
 *
 * Migrates data from MySQL dump files into Saathi PostgreSQL via Prisma.
 * Source: Sqls/SQL review/Dump20260225/OneDrive_1_03-03-2026/
 *
 * Run: npx tsx scripts/migrate-sathi-data.ts
 * Or:  npm run db:migrate-sathi
 *
 * Idempotent — uses upsert/skipDuplicates throughout. Safe to run multiple times.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { PrismaClient, TargetGroup, RegistrationType } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SQL_DIR = path.resolve(
  __dirname,
  '../../Sqls/SQL review/Dump20260225/OneDrive_1_03-03-2026'
);

// ============================================================================
// SQL PARSER
// Reads MySQL dump files and extracts INSERT VALUES as arrays of string|null.
// Uses latin1 encoding to safely handle binary BLOB data.
// ============================================================================

function readSqlFile(filename: string): string {
  return fs.readFileSync(path.join(SQL_DIR, filename), 'latin1');
}

function parseSqlInsert(content: string): (string | null)[][] {
  const insertMatch = content.match(/INSERT INTO `[^`]+` VALUES /);
  if (!insertMatch || insertMatch.index === undefined) return [];

  let pos = insertMatch.index + insertMatch[0].length;
  const rows: (string | null)[][] = [];

  while (pos < content.length) {
    // Skip whitespace/commas between rows
    while (pos < content.length && ',\n\r '.includes(content[pos])) pos++;
    if (pos >= content.length || content[pos] === ';') break;
    if (content[pos] !== '(') { pos++; continue; }
    pos++; // skip '('

    const row: (string | null)[] = [];

    while (pos < content.length && content[pos] !== ')') {
      while (pos < content.length && content[pos] === ' ') pos++;
      if (pos >= content.length || content[pos] === ')') break;

      if (content.substring(pos, pos + 4) === 'NULL') {
        row.push(null);
        pos += 4;
      } else if (content.substring(pos, pos + 7) === '_binary') {
        // Skip _binary 'data' — binary blob we don't need
        pos += 7;
        while (pos < content.length && content[pos] === ' ') pos++;
        if (content[pos] === "'") {
          pos++; // opening quote
          while (pos < content.length) {
            if (content[pos] === '\\') { pos += 2; continue; }
            if (content[pos] === "'") { pos++; break; }
            pos++;
          }
        }
        row.push(null);
      } else if (content[pos] === "'") {
        pos++; // opening quote
        let str = '';
        while (pos < content.length) {
          if (content[pos] === '\\') {
            pos++;
            const ch = content[pos] ?? '';
            str += ch === 'n' ? '\n' : ch === 'r' ? '\r' : ch === 't' ? '\t' : ch === '0' ? '' : ch;
            pos++;
          } else if (content[pos] === "'" && content[pos + 1] === "'") {
            str += "'"; pos += 2;
          } else if (content[pos] === "'") {
            pos++; break;
          } else {
            str += content[pos++];
          }
        }
        row.push(str);
      } else {
        // Number or bare keyword
        let token = '';
        while (pos < content.length && content[pos] !== ',' && content[pos] !== ')') {
          token += content[pos++];
        }
        row.push(token.trim() || null);
      }

      if (pos < content.length && content[pos] === ',') pos++;
    }

    if (pos < content.length && content[pos] === ')') pos++;
    if (row.length > 0) rows.push(row);
  }

  return rows;
}

// ============================================================================
// MAPPING CONSTANTS
// ============================================================================

// SQL StateID → Prisma State code (Telangana uses 'TS' in SQL, 'TG' in Prisma)
const STATE_CODE_MAP: Record<string, string> = {
  GJ: 'GJ', JH: 'JH', TS: 'TG', KA: 'KA',
  AP: 'AP', MH: 'MH', TN: 'TN', TG: 'TG',
};

// SQL CityID → English city name
const CITY_ID_TO_NAME: Record<string, string> = {
  AMD001: 'Ahmedabad',    RAJ001: 'Rajkot',      STV001: 'Surat',
  VDD001: 'Vadodara',     BHJ001: 'Bhuj',         BHV001: 'Bhavnagar',
  JMN001: 'Jamnagar',     KND001: 'Kandla',
  RNC001: 'Ranchi',       JMS001: 'Jamshedpur',   DHN001: 'Dhanbad',
  HYD001: 'Hyderabad',    RRD001: 'Ranga Reddy District',
  SRD001: 'Sangareddy',   WGL001: 'Warangal',     NZB001: 'Nizamabad',
  HBX001: 'Hubli',        BLG001: 'Belgaum',      DRW001: 'Dharwad',
  BLR001: 'Bangaluru',    MNG001: 'Mangaluru',    MYQ001: 'Mysuru',
  BEL001: 'Bellary',      BDR001: 'Bidar',
  MUM001: 'Mumbai',       PUN001: 'Pune',         NGP001: 'Nagpur',
  VJW001: 'Vijayawada',   VZG001: 'Visakhapatnam', TPT001: 'Tirupati',
  CHN001: 'Chennai',      MDU001: 'Madurai',      CBE001: 'Coimbatore',
};

// SQL FaithID → Faith name in Prisma
const FAITH_ID_TO_NAME: Record<string, string> = {
  hind: 'Hinduism', isla: 'Islam', chri: 'Christianity',
};

function mapRegistrationType(type: string | null): RegistrationType {
  if (!type) return 'OTHER';
  const t = type.trim().toUpperCase();
  if (t === 'NGO') return 'NGO';
  if (t === 'TRUST') return 'TRUST';
  if (t === 'GOVERNMENT' || t === 'GOVT') return 'GOVERNMENT';
  if (t === 'PRIVATE') return 'PRIVATE';
  return 'OTHER';
}

function extractPinCode(address: string | null): string | null {
  if (!address) return null;
  const match = address.match(/\b[1-9]\d{5}\b/);
  return match ? match[0] : null;
}

function normalizePhone(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 10) return digits.slice(-10);
  return null;
}

function parseFirstEmail(raw: string | null): string | null {
  if (!raw) return null;
  const first = raw.split(/[,;]/)[0]?.trim() ?? '';
  return first.includes('@') ? first : null;
}

// ============================================================================
// MAIN MIGRATION
// ============================================================================

async function main() {
  console.log('🚀 Starting Sathi → Saathi data migration...\n');

  // =========================================================================
  // PHASE 1: Cities
  // Upsert cities from the SQL dump (English rows only).
  // Also creates per-state placeholder cities for branches with no CityID.
  // =========================================================================
  console.log('📍 Phase 1: Seeding cities from SQL dump...');

  const cityContent = readSqlFile('sathi_city.sql');
  const cityRows = parseSqlInsert(cityContent);
  // Columns: CountryID[0], StateID[1], CityID[2], LanguageID[3], City_Name[4]

  const allStates = await prisma.state.findMany({ select: { id: true, code: true } });
  const statesByCode = new Map(allStates.map(s => [s.code, s.id]));

  let citiesAdded = 0;
  for (const row of cityRows) {
    const [, sqlStateId, , langId, cityName] = row;
    if (langId !== 'enuk' || !cityName || !sqlStateId) continue;
    const prismaCode = STATE_CODE_MAP[sqlStateId] ?? sqlStateId;
    const stateId = statesByCode.get(prismaCode);
    if (!stateId) continue;
    await prisma.city.upsert({
      where: { name_stateId: { name: cityName, stateId } },
      update: {},
      create: { name: cityName, stateId },
    });
    citiesAdded++;
  }

  // Dharwad (DRW001 has NULL City_Name in SQL — add it explicitly)
  const kaId = statesByCode.get('KA');
  if (kaId) {
    await prisma.city.upsert({
      where: { name_stateId: { name: 'Dharwad', stateId: kaId } },
      update: {},
      create: { name: 'Dharwad', stateId: kaId },
    });
  }

  // Placeholder cities for branches with NULL CityID
  const placeholderStates: Array<[string, string]> = [
    ['GJ', 'Gujarat'], ['JH', 'Jharkhand'], ['TG', 'Telangana'], ['KA', 'Karnataka'],
  ];
  for (const [code, label] of placeholderStates) {
    const stateId = statesByCode.get(code);
    if (!stateId) continue;
    await prisma.city.upsert({
      where: { name_stateId: { name: `Other - ${label}`, stateId } },
      update: {},
      create: { name: `Other - ${label}`, stateId },
    });
  }

  console.log(`  ✅ Phase 1 done — ${citiesAdded} cities from dump + placeholder cities\n`);

  // Rebuild complete city lookup: "CityName::StateUUID" → city UUID
  const allCities = await prisma.city.findMany({ select: { id: true, name: true, stateId: true } });
  const citiesByNameState = new Map(allCities.map(c => [`${c.name}::${c.stateId}`, c.id]));

  function resolveCityId(sqlStateId: string | null, sqlCityId: string | null): string | null {
    const prismaCode = sqlStateId ? (STATE_CODE_MAP[sqlStateId] ?? sqlStateId) : null;
    const stateUuid = prismaCode ? statesByCode.get(prismaCode) : null;
    if (sqlCityId && stateUuid) {
      const name = CITY_ID_TO_NAME[sqlCityId];
      if (name) return citiesByNameState.get(`${name}::${stateUuid}`) ?? null;
    }
    // Fallback to placeholder
    if (stateUuid && prismaCode) {
      const label = { GJ: 'Gujarat', JH: 'Jharkhand', TG: 'Telangana', KA: 'Karnataka' }[prismaCode] ?? prismaCode;
      return citiesByNameState.get(`Other - ${label}::${stateUuid}`) ?? null;
    }
    return null;
  }

  // =========================================================================
  // PHASE 2: Service Categories
  // =========================================================================
  console.log('📂 Phase 2: Seeding service categories...');

  const catRows = parseSqlInsert(readSqlFile('sathi_new_service_category.sql'));
  // Columns: CategoryID[0], Service_Group[1], LanguageID[2], Category_Description[3]

  const categoryIdToUuid = new Map<string, string>();
  let displayOrderC = 100, displayOrderW = 100; // offset to avoid collision with seed

  for (const [sqlCatId, serviceGroup, langId, catName] of catRows) {
    if (langId !== 'enuk' || !catName || !sqlCatId) continue;
    const targetGroup: TargetGroup = serviceGroup === 'C' ? 'CHILDREN' : 'WOMEN';
    const displayOrder = targetGroup === 'CHILDREN' ? displayOrderC++ : displayOrderW++;
    const cat = await prisma.serviceCategory.upsert({
      where: { name_targetGroup: { name: catName, targetGroup } },
      update: {},
      create: { name: catName, targetGroup, displayOrder },
    });
    categoryIdToUuid.set(sqlCatId, cat.id);
  }

  console.log(`  ✅ Phase 2 done — ${categoryIdToUuid.size} service categories\n`);

  // =========================================================================
  // PHASE 3: Service Resources
  // =========================================================================
  console.log('🛠  Phase 3: Seeding service resources...');

  const resRows = parseSqlInsert(readSqlFile('sathi_new_service_resource.sql'));
  // Columns: CategoryID[0], ResourceID[1], Service_Group[2], LanguageID[3], Resource_Description[4]

  const resourceIdToUuid = new Map<string, string>();
  let resourcesAdded = 0;

  for (const [sqlCatId, sqlResId, , langId, resName] of resRows) {
    if (langId !== 'enuk' || !resName || !sqlCatId || !sqlResId) continue;
    const categoryId = categoryIdToUuid.get(sqlCatId);
    if (!categoryId) continue;
    const name = resName.trim();
    const res = await prisma.serviceResource.upsert({
      where: { categoryId_name: { categoryId, name } },
      update: {},
      create: { categoryId, name },
    });
    resourceIdToUuid.set(sqlResId, res.id);
    resourcesAdded++;
  }

  console.log(`  ✅ Phase 3 done — ${resourcesAdded} service resources\n`);

  // =========================================================================
  // PHASE 4: Organizations (121 orgs → APPROVED)
  // =========================================================================
  console.log('🏢 Phase 4: Migrating 121 organizations...');

  const orgRows = parseSqlInsert(readSqlFile('sathi_organisation.sql'));
  // Columns (16 total):
  //  [0] OrganisationID  [1] LanguageID  [2] Organisation_Name
  //  [3] Organisation_Description  [4] Organisation_Logo (binary→null)
  //  [5] Organisation_Type  [6] Organisation_RegistrationID
  //  [7] Year_Established  [8] Organisation_Doc1  [9] Organisation_Doc2
  //  [10] Organisation_URL  [11-13] Social_Media_link_1/2/3
  //  [14] Faith_Based  [15] FaithID

  const allFaiths = await prisma.faith.findMany({ select: { id: true, name: true } });
  const faithsByName = new Map(allFaiths.map(f => [f.name, f.id]));

  const orgCustomIdToUuid = new Map<string, string>();
  let orgsAdded = 0, orgsFailed = 0;

  for (const row of orgRows) {
    const sqlOrgId = row[0];
    const langId = row[1];
    const orgName = row[2];
    const description = row[3];
    // row[4] = binary logo → null (already null from parser)
    const orgType = row[5];
    const regNum = row[6];
    const yearEst = row[7];
    // row[8], row[9] = binary docs → null
    const websiteUrl = row[10];
    // row[11-13] = social media (skip)
    // row[14] = Faith_Based
    const faithId = row[15];

    if (langId !== 'enuk' || !sqlOrgId || !orgName) continue;

    const faithPrismaId = faithId ? (faithsByName.get(FAITH_ID_TO_NAME[faithId] ?? '') ?? null) : null;
    const registrationType = mapRegistrationType(orgType);
    const registrationNumber = (regNum && regNum.trim()) ? regNum.trim() : `LEGACY-IMPORT-${sqlOrgId}`;
    const yearEstablished = yearEst ? parseInt(yearEst) : 2000;

    try {
      const org = await prisma.organization.upsert({
        where: { customId: sqlOrgId },
        update: { name: orgName.trim(), status: 'APPROVED' },
        create: {
          customId: sqlOrgId,
          entityType: 'ORGANIZATION',
          name: orgName.trim(),
          description: description ?? undefined,
          registrationType,
          registrationNumber,
          yearEstablished,
          websiteUrl: websiteUrl ?? undefined,
          faithId: faithPrismaId ?? undefined,
          status: 'APPROVED',
        },
      });
      orgCustomIdToUuid.set(sqlOrgId, org.id);
      orgsAdded++;
    } catch (err: any) {
      console.warn(`  ⚠️  Org ${sqlOrgId} failed: ${err.message}`);
      orgsFailed++;
    }
  }

  console.log(`  ✅ Phase 4 done — ${orgsAdded} orgs upserted, ${orgsFailed} failed\n`);

  // =========================================================================
  // PHASE 5: Branches + Contacts
  // =========================================================================
  console.log('📌 Phase 5: Migrating branches and contacts...');

  const branchRows = parseSqlInsert(readSqlFile('sathi_new_organisation_branch.sql'));
  // Columns (15 total):
  //  [0] OrganisationID  [1] BranchID  [2] LanguageID  [3] CountryID
  //  [4] StateID  [5] CityID  [6] Postcode  [7] Address_1  [8] Address_2
  //  [9] Landline_1  [10] Landline_2  [11] Contact_Person
  //  [12] Contact_Mobile  [13] Contact_Email  [14] Generic_Email

  const orgIdToBranchUuid = new Map<string, string>();
  let branchesAdded = 0, branchesFailed = 0;

  for (const row of branchRows) {
    const sqlOrgId = row[0];
    const langId = row[2];
    const sqlStateId = row[4];
    const sqlCityId = row[5];
    const postcode = row[6];
    const address1 = row[7];
    const landline1 = row[9];
    const contactMobile = row[12];
    const contactEmail = row[13];

    if (langId !== 'enuk' || !sqlOrgId) continue;

    const orgUuid = orgCustomIdToUuid.get(sqlOrgId);
    if (!orgUuid) continue;

    const prismaCode = sqlStateId ? (STATE_CODE_MAP[sqlStateId] ?? sqlStateId) : null;
    const stateUuid = prismaCode ? statesByCode.get(prismaCode) : null;
    const cityUuid = resolveCityId(sqlStateId, sqlCityId);

    if (!stateUuid || !cityUuid) {
      console.warn(`  ⚠️  Branch skip ${sqlOrgId}: no state/city (state=${sqlStateId}, city=${sqlCityId})`);
      branchesFailed++;
      continue;
    }

    const pinCode = (postcode && /^[1-9]\d{5}$/.test(postcode.trim()))
      ? postcode.trim()
      : extractPinCode(address1) ?? undefined;

    try {
      const existing = await prisma.organizationBranch.findFirst({
        where: { organizationId: orgUuid },
        select: { id: true },
      });

      let branchUuid: string;
      if (existing) {
        branchUuid = existing.id;
      } else {
        const branch = await prisma.organizationBranch.create({
          data: {
            organizationId: orgUuid,
            addressLine1: (address1 ?? 'Address not provided').trim(),
            cityId: cityUuid,
            stateId: stateUuid,
            pinCode,
          },
        });
        branchUuid = branch.id;
        branchesAdded++;
      }
      orgIdToBranchUuid.set(sqlOrgId, branchUuid);

      // Create primary contact (if one doesn't already exist)
      const phone = normalizePhone(contactMobile ?? landline1);
      const email = parseFirstEmail(contactEmail);

      if (phone || email) {
        const existingContact = await prisma.contactInformation.findFirst({
          where: { organizationId: orgUuid, isPrimary: true },
        });
        if (!existingContact) {
          await prisma.contactInformation.create({
            data: {
              organizationId: orgUuid,
              isPrimary: true,
              name: 'Primary Contact',
              phone: phone ?? '0000000000',
              email: email ?? `contact-${sqlOrgId}@legacy.import`,
            },
          });
        }
      }
    } catch (err: any) {
      console.warn(`  ⚠️  Branch ${sqlOrgId} failed: ${err.message}`);
      branchesFailed++;
    }
  }

  console.log(`  ✅ Phase 5 done — ${branchesAdded} branches created, ${branchesFailed} issues\n`);

  // =========================================================================
  // PHASE 6: Branch Categories
  // =========================================================================
  console.log('📋 Phase 6: Migrating branch categories...');

  const bcRows = parseSqlInsert(readSqlFile('sathi_new_branch_category.sql'));
  // Columns (14 total):
  //  [0] OrganisationID  [1] BranchID  [2] CategoryID  [3] ResourceID (='check')
  //  [4] service_group  [5] LanguageID  [6] Resource_Description
  //  [7] BPL  [8] Social_CategoryID  [9] Contact_Person
  //  [10] Contact_Number  [11] Contact_email  [12] Emergency_Number
  //  [13] branch_category_key (int)

  const bcKeyToOrgId = new Map<string, string>(); // '1' → 'ORG00001'
  const branchCategoryPairs = new Map<string, { branchId: string; categoryId: string }>();

  for (const row of bcRows) {
    const sqlOrgId = row[0];
    const sqlCatId = row[2];
    const langId = row[5];
    const bcKey = row[13];

    if (langId !== 'enuk' || !sqlOrgId || !sqlCatId || !bcKey) continue;

    bcKeyToOrgId.set(bcKey, sqlOrgId);

    const branchUuid = orgIdToBranchUuid.get(sqlOrgId);
    const categoryUuid = categoryIdToUuid.get(sqlCatId);

    if (branchUuid && categoryUuid) {
      branchCategoryPairs.set(`${branchUuid}::${categoryUuid}`, { branchId: branchUuid, categoryId: categoryUuid });
    }
  }

  await prisma.branchCategory.createMany({
    data: Array.from(branchCategoryPairs.values()),
    skipDuplicates: true,
  });

  console.log(`  ✅ Phase 6 done — ${branchCategoryPairs.size} branch-category links\n`);

  // =========================================================================
  // PHASE 7: Branch Resources
  // =========================================================================
  console.log('🔧 Phase 7: Migrating branch resources...');

  const brResRows = parseSqlInsert(readSqlFile('sathi_new_branch_resource.sql'));
  // Columns: branch_category_key[0], CategoryID[1], resource_Description[2],
  //          resourceID[3], LanguageID[4], Service_type[5]

  const branchResourcePairs = new Map<string, { branchId: string; resourceId: string }>();

  for (const row of brResRows) {
    const bcKey = row[0];
    const sqlResId = row[3];
    const langId = row[4];

    if (langId !== 'enuk' || !bcKey || !sqlResId) continue;

    const sqlOrgId = bcKeyToOrgId.get(bcKey);
    if (!sqlOrgId) continue;

    const branchUuid = orgIdToBranchUuid.get(sqlOrgId);
    const resourceUuid = resourceIdToUuid.get(sqlResId);

    if (branchUuid && resourceUuid) {
      branchResourcePairs.set(`${branchUuid}::${resourceUuid}`, { branchId: branchUuid, resourceId: resourceUuid });
    }
  }

  await prisma.branchResource.createMany({
    data: Array.from(branchResourcePairs.values()),
    skipDuplicates: true,
  });

  console.log(`  ✅ Phase 7 done — ${branchResourcePairs.size} branch-resource links\n`);

  // =========================================================================
  // PHASE 8: OrgIdCounter
  // Sets nextOrgNum to 122 so the next new org gets ORG00122.
  // Only updates if the current value is lower (preserves higher values from testing).
  // =========================================================================
  console.log('🔢 Phase 8: Updating OrgIdCounter...');

  const currentCounter = await prisma.orgIdCounter.findFirst({ where: { id: 1 } });
  const newNextOrgNum = Math.max(122, currentCounter?.nextOrgNum ?? 1);
  await prisma.orgIdCounter.upsert({
    where: { id: 1 },
    update: { nextOrgNum: newNextOrgNum },
    create: { id: 1, nextOrgNum: newNextOrgNum },
  });

  console.log(`  ✅ Phase 8 done — nextOrgNum set to ${newNextOrgNum}\n`);

  // =========================================================================
  // Summary
  // =========================================================================
  console.log('='.repeat(60));
  console.log('🎉 Migration complete!');
  console.log('='.repeat(60));
  console.log(`  Organizations:     ${orgsAdded} upserted`);
  console.log(`  Branches:          ${branchesAdded} created`);
  console.log(`  Branch categories: ${branchCategoryPairs.size} links`);
  console.log(`  Branch resources:  ${branchResourcePairs.size} links`);
  console.log(`  OrgIdCounter:      nextOrgNum = ${newNextOrgNum}`);
  console.log('='.repeat(60));
}

main()
  .catch((err) => {
    console.error('\n❌ Migration failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
