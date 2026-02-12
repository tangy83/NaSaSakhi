// @ts-nocheck
/**
 * Deep Check Organizations
 * Comprehensive check to find organizations under different conditions
 * 
 * Run: npx tsx scripts/deep-check-organizations.ts
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function deepCheckOrganizations() {
  console.log('🔍 Deep checking organizations in PostgreSQL...\n');

  // Dynamic import to avoid loading Prisma during build phase
  const { default: prisma } = await import('../src/lib/prisma');

  try {
    // 1. Check all organizations regardless of status
    const allOrgs = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        registrationType: true,
        registrationNumber: true,
        status: true,
        yearEstablished: true,
        createdAt: true,
      },
    });

    console.log(`📊 Total Organizations (all statuses): ${allOrgs.length}\n`);

    // 2. Check by status
    const byStatus = await prisma.organization.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    console.log('📊 Organizations by Status:');
    byStatus.forEach((stat) => {
      console.log(`   ${stat.status}: ${stat._count.id}`);
    });

    // 3. Check by registration type
    const byType = await prisma.organization.groupBy({
      by: ['registrationType'],
      _count: { id: true },
    });

    console.log('\n📊 Organizations by Registration Type:');
    byType.forEach((type) => {
      console.log(`   ${type.registrationType}: ${type._count.id}`);
    });

    // 4. Check date ranges
    const oldest = await prisma.organization.findFirst({
      orderBy: { createdAt: 'asc' },
      select: { name: true, createdAt: true },
    });

    const newest = await prisma.organization.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { name: true, createdAt: true },
    });

    console.log('\n📅 Date Range:');
    if (oldest) {
      console.log(`   Oldest: ${oldest.name} - ${oldest.createdAt}`);
    }
    if (newest) {
      console.log(`   Newest: ${newest.name} - ${newest.createdAt}`);
    }

    // 5. Check if there are organizations with different naming patterns
    const namePatterns = await prisma.$queryRaw<Array<{ pattern: string; count: number }>>`
      SELECT 
        CASE 
          WHEN name LIKE 'Test%' THEN 'Test Organizations'
          WHEN name LIKE '%NGO%' THEN 'NGO in Name'
          WHEN name LIKE '%Trust%' THEN 'Trust in Name'
          ELSE 'Other'
        END as pattern,
        COUNT(*)::int as count
      FROM organizations
      GROUP BY pattern
      ORDER BY count DESC
    `;

    console.log('\n📊 Organizations by Name Pattern:');
    namePatterns.forEach((p) => {
      console.log(`   ${p.pattern}: ${p.count}`);
    });

    // 6. Check branches count
    const branchCount = await prisma.organizationBranch.count();
    const orgsWithBranches = await prisma.organization.count({
      where: {
        branches: {
          some: {},
        },
      },
    });

    console.log('\n📊 Branch Information:');
    console.log(`   Total Branches: ${branchCount}`);
    console.log(`   Organizations with Branches: ${orgsWithBranches}`);

    // 7. Check contacts count
    const contactCount = await prisma.contactInformation.count();
    const orgsWithContacts = await prisma.organization.count({
      where: {
        contacts: {
          some: {},
        },
      },
    });

    console.log('\n📊 Contact Information:');
    console.log(`   Total Contacts: ${contactCount}`);
    console.log(`   Organizations with Contacts: ${orgsWithContacts}`);

    // 8. Check if there are any organizations with specific registration numbers
    const uniqueRegNumbers = await prisma.organization.groupBy({
      by: ['registrationNumber'],
      _count: { id: true },
    });

    const duplicateRegNumbers = uniqueRegNumbers.filter((r) => r._count.id > 1);
    if (duplicateRegNumbers.length > 0) {
      console.log('\n⚠️  Duplicate Registration Numbers:');
      duplicateRegNumbers.forEach((dup) => {
        console.log(`   ${dup.registrationNumber}: ${dup._count.id} organizations`);
      });
    }

    // 9. Check all tables that might contain organization data
    console.log('\n📋 Checking all related tables...');
    
    const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%organization%' OR table_name LIKE '%org%'
      ORDER BY table_name
    `;

    console.log('   Tables with "organization" or "org" in name:');
    tables.forEach((t) => {
      console.log(`     - ${t.table_name}`);
    });

    // 10. Final summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Organizations Found: ${allOrgs.length}`);
    console.log(`Expected: 121`);
    
    if (allOrgs.length < 121) {
      console.log(`\n⚠️  Missing: ${121 - allOrgs.length} organizations`);
      console.log('\nPossible reasons:');
      console.log('   1. Organizations are in MySQL database (need migration)');
      console.log('   2. Organizations are in a different database/schema');
      console.log('   3. Organizations were deleted or archived');
      console.log('   4. Organizations are in a different table structure');
    } else if (allOrgs.length >= 121) {
      console.log('\n✅ Found 121+ organizations!');
    }

    console.log('='.repeat(60) + '\n');

  } catch (error: any) {
    console.error('❌ Error during deep check:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run check if this script is executed directly
if (require.main === module) {
  deepCheckOrganizations()
    .then(() => {
      console.log('✅ Deep check complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Deep check failed:', error);
      process.exit(1);
    });
}

export { deepCheckOrganizations };
