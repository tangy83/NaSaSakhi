// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verifyCounts() {
  try {
    console.log('\n📊 Verifying Seed Data Counts:');
    console.log('================================\n');

    // Verify Language count (should be 30)
    const languageCount = await prisma.language.count();
    console.log(`✅ Language: ${languageCount} (expected: 30) ${languageCount === 30 ? '✓' : '✗'}`);

    // Verify State count (should be 36)
    const stateCount = await prisma.state.count();
    console.log(`✅ State: ${stateCount} (expected: 36) ${stateCount === 36 ? '✓' : '✗'}`);

    // Verify ServiceCategory count (should be 14)
    const categoryCount = await prisma.serviceCategory.count();
    console.log(`✅ ServiceCategory: ${categoryCount} (expected: 14) ${categoryCount === 14 ? '✓' : '✗'}`);

    // Additional verifications
    const cityCount = await prisma.city.count();
    console.log(`✅ City: ${cityCount}`);

    const resourceCount = await prisma.serviceResource.count();
    console.log(`✅ ServiceResource: ${resourceCount}`);

    const faithCount = await prisma.faith.count();
    console.log(`✅ Faith: ${faithCount} (expected: 8) ${faithCount === 8 ? '✓' : '✗'}`);

    const socialCategoryCount = await prisma.socialCategory.count();
    console.log(`✅ SocialCategory: ${socialCategoryCount} (expected: 5) ${socialCategoryCount === 5 ? '✓' : '✗'}`);

    console.log('\n🎉 Verification completed!\n');

    // Summary
    const allCorrect = 
      languageCount === 30 &&
      stateCount === 36 &&
      categoryCount === 14 &&
      faithCount === 8 &&
      socialCategoryCount === 5;

    if (allCorrect) {
      console.log('✅ All seed data counts are correct!');
    } else {
      console.log('⚠️  Some counts do not match expected values.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

verifyCounts();
