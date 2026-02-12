/**
 * Verify Migrated Organizations
 * Checks if organizations are already in the PostgreSQL database
 * 
 * Run: npx tsx scripts/verify-migrated-organizations.ts
 */

import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

async function verifyOrganizations() {
  console.log('🔍 Verifying migrated organizations in PostgreSQL...\n');

  // Dynamic import to avoid loading Prisma during build phase
  const { default: prisma } = await import('../src/lib/prisma');

  try {
    // Count organizations
    const orgCount = await prisma.organization.count();
    console.log(`📊 Total Organizations: ${orgCount}`);

    if (orgCount === 0) {
      console.log('\n⚠️  No organizations found in database.');
      console.log('   The migration may not have been completed yet.');
      return;
    }

    // Get sample organizations
    const sampleOrgs = await prisma.organization.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        registrationType: true,
        registrationNumber: true,
        status: true,
        yearEstablished: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('\n📋 Sample Organizations (latest 5):');
    sampleOrgs.forEach((org, index) => {
      console.log(`\n${index + 1}. ${org.name}`);
      console.log(`   ID: ${org.id}`);
      console.log(`   Type: ${org.registrationType}`);
      console.log(`   Registration: ${org.registrationNumber}`);
      console.log(`   Status: ${org.status}`);
      console.log(`   Year: ${org.yearEstablished}`);
    });

    // Count related data
    const branchCount = await prisma.organizationBranch.count();
    const contactCount = await prisma.contactInformation.count();

    console.log('\n📊 Related Data:');
    console.log(`   Branches: ${branchCount}`);
    console.log(`   Contacts: ${contactCount}`);

    // Check status distribution
    const statusCounts = await prisma.organization.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    console.log('\n📊 Status Distribution:');
    statusCounts.forEach((stat) => {
      console.log(`   ${stat.status}: ${stat._count.id}`);
    });

    console.log('\n✅ Organizations are present in the database!');
    console.log('   Stage 11 (Data Migration) appears to be complete.\n');

  } catch (error: any) {
    console.error('❌ Error verifying organizations:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run verification if this script is executed directly
if (require.main === module) {
  verifyOrganizations()
    .then(() => {
      console.log('✅ Verification complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Verification failed:', error);
      process.exit(1);
    });
}

export { verifyOrganizations };
