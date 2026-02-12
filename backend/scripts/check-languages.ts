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

async function checkLanguages() {
  try {
    const languages = await prisma.language.findMany({
      orderBy: { name: 'asc' }
    });

    console.log('\n📋 Languages in Database:');
    console.log('========================\n');
    languages.forEach((lang, index) => {
      console.log(`${index + 1}. ${lang.name} (${lang.code})`);
    });
    console.log(`\nTotal: ${languages.length} languages\n`);

    // Check for potential duplicates in seed data
    const seedLanguages = [
      { name: 'Hindi', code: 'hi' },
      { name: 'English', code: 'en' },
      { name: 'Bengali', code: 'bn' },
      { name: 'Telugu', code: 'te' },
      { name: 'Marathi', code: 'mr' },
      { name: 'Tamil', code: 'ta' },
      { name: 'Gujarati', code: 'gu' },
      { name: 'Urdu', code: 'ur' },
      { name: 'Kannada', code: 'kn' },
      { name: 'Odia', code: 'or' },
      { name: 'Malayalam', code: 'ml' },
      { name: 'Punjabi', code: 'pa' },
      { name: 'Assamese', code: 'as' },
      { name: 'Maithili', code: 'mai' },
      { name: 'Sanskrit', code: 'sa' },
      { name: 'Konkani', code: 'kok' },
      { name: 'Nepali', code: 'ne' },
      { name: 'Sindhi', code: 'sd' },
      { name: 'Dogri', code: 'doi' },
      { name: 'Kashmiri', code: 'ks' },
      { name: 'Manipuri', code: 'mni' },
      { name: 'Bodo', code: 'brx' },
      { name: 'Santali', code: 'sat' },
      { name: 'Meitei', code: 'mni' },
      { name: 'Tulu', code: 'tcy' },
      { name: 'Bhojpuri', code: 'bho' },
      { name: 'Magahi', code: 'mag' },
      { name: 'Haryanvi', code: 'bgc' },
      { name: 'Rajasthani', code: 'raj' },
      { name: 'Chhattisgarhi', code: 'hne' },
    ];

    console.log('🔍 Checking for duplicates in seed data:\n');
    const codeMap = new Map();
    const nameMap = new Map();
    
    seedLanguages.forEach((lang, index) => {
      if (codeMap.has(lang.code)) {
        console.log(`⚠️  DUPLICATE CODE: "${lang.code}" used by:`);
        console.log(`   - ${codeMap.get(lang.code)} (line ${codeMap.get(lang.code + '_index')})`);
        console.log(`   - ${lang.name} (line ${index + 1})`);
      } else {
        codeMap.set(lang.code, lang.name);
        codeMap.set(lang.code + '_index', index + 1);
      }
      
      if (nameMap.has(lang.name)) {
        console.log(`⚠️  DUPLICATE NAME: "${lang.name}"`);
      } else {
        nameMap.set(lang.name, lang.code);
      }
    });

    // Find which language from seed is missing in DB
    const dbCodes = new Set(languages.map(l => l.code));
    const missing = seedLanguages.filter(l => !dbCodes.has(l.code));
    
    if (missing.length > 0) {
      console.log('\n❌ Languages in seed but NOT in database:');
      missing.forEach(lang => {
        console.log(`   - ${lang.name} (${lang.code})`);
      });
    } else {
      console.log('\n✅ All unique languages from seed are in database');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkLanguages();
