// @ts-nocheck
/**
 * Verify DC Deploy Database Connection
 * Validates connection to DC Deploy PostgreSQL database
 * 
 * Run: npx tsx scripts/verify-dc-deploy-connection.ts
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function verifyDCDeployConnection() {
  console.log('🔍 Verifying DC Deploy Database Connection...\n');

  // Check DATABASE_URL from environment
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  console.log('📋 Database Connection Details:');
  console.log('='.repeat(60));
  
  // Parse DATABASE_URL
  try {
    const url = new URL(databaseUrl);
    const host = url.hostname;
    const port = url.port;
    const database = url.pathname.replace('/', '');
    const username = url.username;
    
    console.log(`Host: ${host}`);
    console.log(`Port: ${port}`);
    console.log(`Database: ${database}`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${'*'.repeat(url.password.length)}`);
    console.log('='.repeat(60) + '\n');

    // Check if it's DC Deploy database
    const isDCDeploy = 
      host.includes('dcdeploy.cloud') || 
      host.includes('saathidbstg') ||
      port === '30095' ||
      database.includes('saathidbstg');

    if (isDCDeploy) {
      console.log('✅ This appears to be a DC Deploy database connection');
      console.log('   (Host contains dcdeploy.cloud or saathidbstg)\n');
    } else {
      console.log('⚠️  This does not appear to be a DC Deploy database');
      console.log('   (Host does not match DC Deploy pattern)\n');
    }

  } catch (error) {
    console.error('❌ Error parsing DATABASE_URL:', error);
    process.exit(1);
  }

  // Test actual connection
  console.log('🔌 Testing database connection...\n');

  try {
    // Dynamic import to avoid loading Prisma during build phase
    const { default: prisma } = await import('../src/lib/prisma');

    // Test connection with a simple query
    const result = await prisma.$queryRaw<Array<{ version: string }>>`
      SELECT version()
    `;

    const version = result[0]?.version || 'Unknown';
    console.log('✅ Database connection successful!\n');
    console.log('📊 Database Information:');
    console.log('='.repeat(60));
    console.log(`PostgreSQL Version: ${version.split(',')[0]}`);
    
    // Get database name
    const dbNameResult = await prisma.$queryRaw<Array<{ current_database: string }>>`
      SELECT current_database()
    `;
    const dbName = dbNameResult[0]?.current_database || 'Unknown';
    console.log(`Database Name: ${dbName}`);

    // Get connection count
    const connResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT count(*) as count FROM pg_stat_activity WHERE datname = current_database()
    `;
    const connCount = connResult[0]?.count || 0;
    console.log(`Active Connections: ${connCount}`);

    // Check tables
    const tablesResult = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    console.log(`Tables in database: ${tablesResult.length}`);
    
    console.log('='.repeat(60) + '\n');

    // Verify it's the expected database
    if (dbName.includes('saathidbstg')) {
      console.log('✅ Confirmed: Connected to DC Deploy staging database');
      console.log(`   Database: ${dbName}\n`);
    } else {
      console.log('⚠️  Warning: Database name does not match expected DC Deploy pattern');
      console.log(`   Expected: saathidbstg-db`);
      console.log(`   Actual: ${dbName}\n`);
    }

    // Check for key tables
    const keyTables = ['organizations', 'organization_branches', 'contact_information', 'service_categories'];
    const existingTables = tablesResult.map(t => t.table_name);
    const missingTables = keyTables.filter(t => !existingTables.includes(t));

    if (missingTables.length === 0) {
      console.log('✅ All key tables are present');
    } else {
      console.log('⚠️  Missing tables:', missingTables.join(', '));
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Connection verification complete!');
    console.log('='.repeat(60) + '\n');

    await prisma.$disconnect();

  } catch (error: any) {
    console.error('\n❌ Database connection failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('Can\'t reach database server')) {
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Check if DATABASE_URL is correct');
      console.error('   2. Verify network connectivity to DC Deploy');
      console.error('   3. Check if database server is accessible');
      console.error('   4. Verify firewall/security group settings');
    }
    
    process.exit(1);
  }
}

// Run verification if this script is executed directly
if (require.main === module) {
  verifyDCDeployConnection()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Verification failed:', error);
      process.exit(1);
    });
}

export { verifyDCDeployConnection };
