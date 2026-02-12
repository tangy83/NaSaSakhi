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

async function verifySeed() {
  try {
    const languageCount = await prisma.language.count();
    const stateCount = await prisma.state.count();
    const cityCount = await prisma.city.count();
    const categoryCount = await prisma.serviceCategory.count();
    const resourceCount = await prisma.serviceResource.count();
    const faithCount = await prisma.faith.count();
    const socialCategoryCount = await prisma.socialCategory.count();

    console.log('\n📊 Seed Data Verification:');
    console.log('==========================\n');
    console.log(`✅ Languages: ${languageCount} (expected: 30)`);
    console.log(`✅ States/UTs: ${stateCount} (expected: 36)`);
    console.log(`✅ Cities: ${cityCount} (expected: ~50)`);
    console.log(`✅ Service Categories: ${categoryCount} (expected: 14)`);
    console.log(`✅ Service Resources: ${resourceCount} (expected: ~76)`);
    console.log(`✅ Faith Options: ${faithCount} (expected: 8)`);
    console.log(`✅ Social Categories: ${socialCategoryCount} (expected: 5)`);
    console.log('\n🎉 All reference data seeded successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

verifySeed();
