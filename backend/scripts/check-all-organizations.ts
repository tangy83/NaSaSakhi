/**
 * Check All Organizations in Database
 * Comprehensive check to find all organizations
 * 
 * Run: npx tsx scripts/check-all-organizations.ts
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function checkAllOrganizations() {
  console.log('🔍 Checking all organizations in PostgreSQL database...\n');

  // Dynamic import to avoid loading Prisma during build phase
  const { default: prisma } = await import('../src/lib/prisma');

  try {
    // Count all organizations
    const totalCount = await prisma.organization.count();
    console.log(`📊 Total Organizations: ${totalCount}\n`);

    if (totalCount === 0) {
      console.log('⚠️  No organizations found in database.');
      console.log('   Migration may be needed.\n');
      return;
    }

    // Get all organizations with basic info
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📋 Found ${allOrgs.length} organizations:\n`);

    // Show first 10 and last 10
    if (allOrgs.length <= 20) {
      allOrgs.forEach((org, index) => {
        console.log(`${index + 1}. ${org.name}`);
        console.log(`   Registration: ${org.registrationNumber} | Type: ${org.registrationType} | Status: ${org.status}`);
      });
    } else {
      console.log('First 10 organizations:');
      allOrgs.slice(0, 10).forEach((org, index) => {
        console.log(`${index + 1}. ${org.name} (${org.registrationNumber})`);
      });
      console.log(`\n... (${allOrgs.length - 20} more organizations) ...\n`);
      console.log('Last 10 organizations:');
      allOrgs.slice(-10).forEach((org, index) => {
        const actualIndex = allOrgs.length - 10 + index + 1;
        console.log(`${actualIndex}. ${org.name} (${org.registrationNumber})`);
      });
    }

    // Count related data
    const branchCount = await prisma.organizationBranch.count();
    const contactCount = await prisma.contactInformation.count();

    console.log('\n📊 Related Data:');
    console.log(`   Branches: ${branchCount}`);
    console.log(`   Contacts: ${contactCount}`);

    // Status distribution
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

    // Registration type distribution
    const typeCounts = await prisma.organization.groupBy({
      by: ['registrationType'],
      _count: {
        id: true,
      },
    });

    console.log('\n📊 Registration Type Distribution:');
    typeCounts.forEach((type) => {
      console.log(`   ${type.registrationType}: ${type._count.id}`);
    });

    // Check if we have 121 organizations
    if (totalCount >= 121) {
      console.log('\n✅ Found 121+ organizations! Migration appears to be complete.');
    } else if (totalCount < 121) {
      console.log(`\n⚠️  Found only ${totalCount} organizations. Expected 121.`);
      console.log('   Migration may be needed or incomplete.');
    }

    console.log('\n' + '='.repeat(60));

  } catch (error: any) {
    console.error('❌ Error checking organizations:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run check if this script is executed directly
if (require.main === module) {
  checkAllOrganizations()
    .then(() => {
      console.log('✅ Check complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Check failed:', error);
      process.exit(1);
    });
}

export { checkAllOrganizations };
