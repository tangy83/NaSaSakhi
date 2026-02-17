import { PrismaClient, TargetGroup } from '@prisma/client';
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

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Seed Languages (30 Indian languages)
  const languages = [
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
    { name: 'Meitei', code: 'mei' },
    { name: 'Tulu', code: 'tcy' },
    { name: 'Bhojpuri', code: 'bho' },
    { name: 'Magahi', code: 'mag' },
    { name: 'Haryanvi', code: 'bgc' },
    { name: 'Rajasthani', code: 'raj' },
    { name: 'Chhattisgarhi', code: 'hne' },
  ];

  await prisma.language.createMany({ data: languages, skipDuplicates: true });
  console.log('✅ Seeded 30 languages');

  // 2. Seed Indian States
  const states = [
    { name: 'Andhra Pradesh', code: 'AP' },
    { name: 'Arunachal Pradesh', code: 'AR' },
    { name: 'Assam', code: 'AS' },
    { name: 'Bihar', code: 'BR' },
    { name: 'Chhattisgarh', code: 'CG' },
    { name: 'Goa', code: 'GA' },
    { name: 'Gujarat', code: 'GJ' },
    { name: 'Haryana', code: 'HR' },
    { name: 'Himachal Pradesh', code: 'HP' },
    { name: 'Jharkhand', code: 'JH' },
    { name: 'Karnataka', code: 'KA' },
    { name: 'Kerala', code: 'KL' },
    { name: 'Madhya Pradesh', code: 'MP' },
    { name: 'Maharashtra', code: 'MH' },
    { name: 'Manipur', code: 'MN' },
    { name: 'Meghalaya', code: 'ML' },
    { name: 'Mizoram', code: 'MZ' },
    { name: 'Nagaland', code: 'NL' },
    { name: 'Odisha', code: 'OD' },
    { name: 'Punjab', code: 'PB' },
    { name: 'Rajasthan', code: 'RJ' },
    { name: 'Sikkim', code: 'SK' },
    { name: 'Tamil Nadu', code: 'TN' },
    { name: 'Telangana', code: 'TG' },
    { name: 'Tripura', code: 'TR' },
    { name: 'Uttar Pradesh', code: 'UP' },
    { name: 'Uttarakhand', code: 'UK' },
    { name: 'West Bengal', code: 'WB' },
    // Union Territories
    { name: 'Andaman and Nicobar Islands', code: 'AN' },
    { name: 'Chandigarh', code: 'CH' },
    { name: 'Dadra and Nagar Haveli and Daman and Diu', code: 'DH' },
    { name: 'Delhi', code: 'DL' },
    { name: 'Jammu and Kashmir', code: 'JK' },
    { name: 'Ladakh', code: 'LA' },
    { name: 'Lakshadweep', code: 'LD' },
    { name: 'Puducherry', code: 'PY' },
  ];

  await prisma.state.createMany({ data: states, skipDuplicates: true });
  console.log('✅ Seeded 36 states/UTs');

  // 3. Seed Major Cities (comprehensive list)
  // Fetch all states
  const andhraPradesh = await prisma.state.findUnique({ where: { code: 'AP' } });
  const arunachalPradesh = await prisma.state.findUnique({ where: { code: 'AR' } });
  const assam = await prisma.state.findUnique({ where: { code: 'AS' } });
  const bihar = await prisma.state.findUnique({ where: { code: 'BR' } });
  const chhattisgarh = await prisma.state.findUnique({ where: { code: 'CG' } });
  const goa = await prisma.state.findUnique({ where: { code: 'GA' } });
  const gujarat = await prisma.state.findUnique({ where: { code: 'GJ' } });
  const haryana = await prisma.state.findUnique({ where: { code: 'HR' } });
  const himachalPradesh = await prisma.state.findUnique({ where: { code: 'HP' } });
  const jharkhand = await prisma.state.findUnique({ where: { code: 'JH' } });
  const karnataka = await prisma.state.findUnique({ where: { code: 'KA' } });
  const kerala = await prisma.state.findUnique({ where: { code: 'KL' } });
  const madhyaPradesh = await prisma.state.findUnique({ where: { code: 'MP' } });
  const maharashtra = await prisma.state.findUnique({ where: { code: 'MH' } });
  const manipur = await prisma.state.findUnique({ where: { code: 'MN' } });
  const meghalaya = await prisma.state.findUnique({ where: { code: 'ML' } });
  const mizoram = await prisma.state.findUnique({ where: { code: 'MZ' } });
  const nagaland = await prisma.state.findUnique({ where: { code: 'NL' } });
  const odisha = await prisma.state.findUnique({ where: { code: 'OD' } });
  const punjab = await prisma.state.findUnique({ where: { code: 'PB' } });
  const rajasthan = await prisma.state.findUnique({ where: { code: 'RJ' } });
  const sikkim = await prisma.state.findUnique({ where: { code: 'SK' } });
  const tamilNadu = await prisma.state.findUnique({ where: { code: 'TN' } });
  const telangana = await prisma.state.findUnique({ where: { code: 'TG' } });
  const tripura = await prisma.state.findUnique({ where: { code: 'TR' } });
  const uttarPradesh = await prisma.state.findUnique({ where: { code: 'UP' } });
  const uttarakhand = await prisma.state.findUnique({ where: { code: 'UK' } });
  const westBengal = await prisma.state.findUnique({ where: { code: 'WB' } });
  // Union Territories
  const delhi = await prisma.state.findUnique({ where: { code: 'DL' } });
  const andamanNicobar = await prisma.state.findUnique({ where: { code: 'AN' } });
  const chandigarh = await prisma.state.findUnique({ where: { code: 'CH' } });
  const dadraNagarHaveli = await prisma.state.findUnique({ where: { code: 'DH' } });
  const jammuKashmir = await prisma.state.findUnique({ where: { code: 'JK' } });
  const ladakh = await prisma.state.findUnique({ where: { code: 'LA' } });
  const lakshadweep = await prisma.state.findUnique({ where: { code: 'LD' } });
  const puducherry = await prisma.state.findUnique({ where: { code: 'PY' } });

  if (!andhraPradesh || !karnataka || !maharashtra || !delhi || !tamilNadu || !westBengal) {
    throw new Error('Required states not found. Please seed states first.');
  }

  const cities = [
    // -------------------- STATES --------------------

    // Andhra Pradesh
    { name: 'Visakhapatnam', stateId: andhraPradesh!.id },
    { name: 'Vijayawada', stateId: andhraPradesh!.id },
    { name: 'Guntur', stateId: andhraPradesh!.id },
    { name: 'Tirupati', stateId: andhraPradesh!.id },
    { name: 'Nellore', stateId: andhraPradesh!.id },

    // Arunachal Pradesh
    ...(arunachalPradesh ? [
      { name: 'Itanagar', stateId: arunachalPradesh.id },
      { name: 'Naharlagun', stateId: arunachalPradesh.id },
    ] : []),

    // Assam
    ...(assam ? [
      { name: 'Guwahati', stateId: assam.id },
      { name: 'Silchar', stateId: assam.id },
      { name: 'Dibrugarh', stateId: assam.id },
      { name: 'Jorhat', stateId: assam.id },
    ] : []),

    // Bihar
    ...(bihar ? [
      { name: 'Patna', stateId: bihar.id },
      { name: 'Gaya', stateId: bihar.id },
      { name: 'Bhagalpur', stateId: bihar.id },
      { name: 'Muzaffarpur', stateId: bihar.id },
    ] : []),

    // Chhattisgarh
    ...(chhattisgarh ? [
      { name: 'Raipur', stateId: chhattisgarh.id },
      { name: 'Bilaspur', stateId: chhattisgarh.id },
      { name: 'Durg', stateId: chhattisgarh.id },
    ] : []),

    // Goa
    ...(goa ? [
      { name: 'Panaji', stateId: goa.id },
      { name: 'Margao', stateId: goa.id },
      { name: 'Vasco da Gama', stateId: goa.id },
    ] : []),

    // Gujarat
    ...(gujarat ? [
      { name: 'Ahmedabad', stateId: gujarat.id },
      { name: 'Surat', stateId: gujarat.id },
      { name: 'Vadodara', stateId: gujarat.id },
      { name: 'Rajkot', stateId: gujarat.id },
    ] : []),

    // Haryana
    ...(haryana ? [
      { name: 'Gurgaon', stateId: haryana.id },
      { name: 'Faridabad', stateId: haryana.id },
      { name: 'Panipat', stateId: haryana.id },
      { name: 'Ambala', stateId: haryana.id },
    ] : []),

    // Himachal Pradesh
    ...(himachalPradesh ? [
      { name: 'Shimla', stateId: himachalPradesh.id },
      { name: 'Manali', stateId: himachalPradesh.id },
      { name: 'Dharamshala', stateId: himachalPradesh.id },
    ] : []),

    // Jharkhand
    ...(jharkhand ? [
      { name: 'Ranchi', stateId: jharkhand.id },
      { name: 'Jamshedpur', stateId: jharkhand.id },
      { name: 'Dhanbad', stateId: jharkhand.id },
    ] : []),

    // Karnataka
    { name: 'Bangalore', stateId: karnataka.id },
    { name: 'Mysore', stateId: karnataka.id },
    { name: 'Mangalore', stateId: karnataka.id },
    { name: 'Hubli', stateId: karnataka.id },
    { name: 'Belgaum', stateId: karnataka.id },

    // Kerala
    ...(kerala ? [
      { name: 'Thiruvananthapuram', stateId: kerala.id },
      { name: 'Kochi', stateId: kerala.id },
      { name: 'Kozhikode', stateId: kerala.id },
      { name: 'Thrissur', stateId: kerala.id },
    ] : []),

    // Madhya Pradesh
    ...(madhyaPradesh ? [
      { name: 'Bhopal', stateId: madhyaPradesh.id },
      { name: 'Indore', stateId: madhyaPradesh.id },
      { name: 'Gwalior', stateId: madhyaPradesh.id },
      { name: 'Jabalpur', stateId: madhyaPradesh.id },
    ] : []),

    // Maharashtra
    { name: 'Mumbai', stateId: maharashtra.id },
    { name: 'Pune', stateId: maharashtra.id },
    { name: 'Nagpur', stateId: maharashtra.id },
    { name: 'Nashik', stateId: maharashtra.id },
    { name: 'Aurangabad', stateId: maharashtra.id },

    // Manipur
    ...(manipur ? [
      { name: 'Imphal', stateId: manipur.id },
    ] : []),

    // Meghalaya
    ...(meghalaya ? [
      { name: 'Shillong', stateId: meghalaya.id },
      { name: 'Tura', stateId: meghalaya.id },
    ] : []),

    // Mizoram
    ...(mizoram ? [
      { name: 'Aizawl', stateId: mizoram.id },
    ] : []),

    // Nagaland
    ...(nagaland ? [
      { name: 'Kohima', stateId: nagaland.id },
      { name: 'Dimapur', stateId: nagaland.id },
    ] : []),

    // Odisha
    ...(odisha ? [
      { name: 'Bhubaneswar', stateId: odisha.id },
      { name: 'Cuttack', stateId: odisha.id },
      { name: 'Rourkela', stateId: odisha.id },
    ] : []),

    // Punjab
    ...(punjab ? [
      { name: 'Chandigarh', stateId: punjab.id },
      { name: 'Ludhiana', stateId: punjab.id },
      { name: 'Amritsar', stateId: punjab.id },
      { name: 'Jalandhar', stateId: punjab.id },
    ] : []),

    // Rajasthan
    ...(rajasthan ? [
      { name: 'Jaipur', stateId: rajasthan.id },
      { name: 'Jodhpur', stateId: rajasthan.id },
      { name: 'Udaipur', stateId: rajasthan.id },
      { name: 'Kota', stateId: rajasthan.id },
    ] : []),

    // Sikkim
    ...(sikkim ? [
      { name: 'Gangtok', stateId: sikkim.id },
    ] : []),

    // Tamil Nadu
    { name: 'Chennai', stateId: tamilNadu.id },
    { name: 'Coimbatore', stateId: tamilNadu.id },
    { name: 'Madurai', stateId: tamilNadu.id },
    { name: 'Trichy', stateId: tamilNadu.id },

    // Telangana
    ...(telangana ? [
      { name: 'Hyderabad', stateId: telangana.id },
      { name: 'Warangal', stateId: telangana.id },
      { name: 'Nizamabad', stateId: telangana.id },
    ] : []),

    // Tripura
    ...(tripura ? [
      { name: 'Agartala', stateId: tripura.id },
    ] : []),

    // Uttar Pradesh
    ...(uttarPradesh ? [
      { name: 'Lucknow', stateId: uttarPradesh.id },
      { name: 'Kanpur', stateId: uttarPradesh.id },
      { name: 'Noida', stateId: uttarPradesh.id },
      { name: 'Ghaziabad', stateId: uttarPradesh.id },
      { name: 'Varanasi', stateId: uttarPradesh.id },
    ] : []),

    // Uttarakhand
    ...(uttarakhand ? [
      { name: 'Dehradun', stateId: uttarakhand.id },
      { name: 'Haridwar', stateId: uttarakhand.id },
      { name: 'Rishikesh', stateId: uttarakhand.id },
    ] : []),

    // West Bengal
    { name: 'Kolkata', stateId: westBengal.id },
    { name: 'Howrah', stateId: westBengal.id },
    { name: 'Durgapur', stateId: westBengal.id },
    { name: 'Siliguri', stateId: westBengal.id },

    // -------------------- UNION TERRITORIES --------------------

    // Delhi
    { name: 'New Delhi', stateId: delhi.id },
    { name: 'Delhi', stateId: delhi.id },

    // Andaman & Nicobar Islands
    ...(andamanNicobar ? [
      { name: 'Port Blair', stateId: andamanNicobar.id },
    ] : []),

    // Chandigarh
    ...(chandigarh ? [
      { name: 'Chandigarh', stateId: chandigarh.id },
    ] : []),

    // Dadra & Nagar Haveli and Daman & Diu
    ...(dadraNagarHaveli ? [
      { name: 'Daman', stateId: dadraNagarHaveli.id },
      { name: 'Silvassa', stateId: dadraNagarHaveli.id },
    ] : []),

    // Jammu & Kashmir
    ...(jammuKashmir ? [
      { name: 'Srinagar', stateId: jammuKashmir.id },
      { name: 'Jammu', stateId: jammuKashmir.id },
    ] : []),

    // Ladakh
    ...(ladakh ? [
      { name: 'Leh', stateId: ladakh.id },
      { name: 'Kargil', stateId: ladakh.id },
    ] : []),

    // Lakshadweep
    ...(lakshadweep ? [
      { name: 'Kavaratti', stateId: lakshadweep.id },
    ] : []),

    // Puducherry
    ...(puducherry ? [
      { name: 'Puducherry', stateId: puducherry.id },
      { name: 'Karaikal', stateId: puducherry.id },
    ] : []),
  ];

  await prisma.city.createMany({ data: cities, skipDuplicates: true });
  console.log('✅ Seeded major cities');

  // 4. Seed Service Categories (19 total — aligned with SQL sakhi_new_service_category.sql)
  const categories = [
    // For Children (10)
    { name: 'Health & Well-being', targetGroup: TargetGroup.CHILDREN, displayOrder: 1 },
    { name: 'Education & Skill Development', targetGroup: TargetGroup.CHILDREN, displayOrder: 2 },
    { name: 'Child Protection & Rights', targetGroup: TargetGroup.CHILDREN, displayOrder: 3 },
    { name: 'Shelter & Basic Needs', targetGroup: TargetGroup.CHILDREN, displayOrder: 4 },
    { name: 'Economic & Social Empowerment', targetGroup: TargetGroup.CHILDREN, displayOrder: 5 },
    { name: 'Gender & Inclusion', targetGroup: TargetGroup.CHILDREN, displayOrder: 6 },
    { name: 'Safety & Emergency Response', targetGroup: TargetGroup.CHILDREN, displayOrder: 7 },
    { name: 'Environment & Sustainability', targetGroup: TargetGroup.CHILDREN, displayOrder: 8 },
    { name: 'Recreation & Sports', targetGroup: TargetGroup.CHILDREN, displayOrder: 9 },
    { name: 'Mental Health Support', targetGroup: TargetGroup.CHILDREN, displayOrder: 10 },
    // For Women (9)
    { name: 'Health & Well-being', targetGroup: TargetGroup.WOMEN, displayOrder: 11 },
    { name: 'Education & Skills Development', targetGroup: TargetGroup.WOMEN, displayOrder: 12 },
    { name: 'Economic Empowerment', targetGroup: TargetGroup.WOMEN, displayOrder: 13 },
    { name: 'Legal & Human Rights', targetGroup: TargetGroup.WOMEN, displayOrder: 14 },
    { name: 'Safety & Shelter', targetGroup: TargetGroup.WOMEN, displayOrder: 15 },
    { name: 'Social Support & Community Building', targetGroup: TargetGroup.WOMEN, displayOrder: 16 },
    { name: 'Environmental & Rural Development', targetGroup: TargetGroup.WOMEN, displayOrder: 17 },
    { name: 'Financial Literacy', targetGroup: TargetGroup.WOMEN, displayOrder: 18 },
    { name: 'Mental Health & Counseling', targetGroup: TargetGroup.WOMEN, displayOrder: 19 },
  ];

  await prisma.serviceCategory.createMany({ data: categories, skipDuplicates: true });
  console.log('✅ Seeded 19 service categories');

  // 5. Seed Service Resources — sourced from SQL sakhi_new_service_resource.sql
  const allCategories = await prisma.serviceCategory.findMany();
  // Build map keyed by "name|targetGroup" to disambiguate identically-named categories across groups
  const categoryMap = new Map(allCategories.map(cat => [`${cat.name}|${cat.targetGroup}`, cat]));

  const healthChildren    = categoryMap.get('Health & Well-being|CHILDREN');
  const eduChildren       = categoryMap.get('Education & Skill Development|CHILDREN');
  const protectionC       = categoryMap.get('Child Protection & Rights|CHILDREN');
  const shelterC          = categoryMap.get('Shelter & Basic Needs|CHILDREN');
  const empowermentC      = categoryMap.get('Economic & Social Empowerment|CHILDREN');
  const genderC           = categoryMap.get('Gender & Inclusion|CHILDREN');
  const safetyC           = categoryMap.get('Safety & Emergency Response|CHILDREN');
  const envC              = categoryMap.get('Environment & Sustainability|CHILDREN');
  const recreationC       = categoryMap.get('Recreation & Sports|CHILDREN');
  const mentalHealthC     = categoryMap.get('Mental Health Support|CHILDREN');
  const healthWomen       = categoryMap.get('Health & Well-being|WOMEN');
  const eduWomen          = categoryMap.get('Education & Skills Development|WOMEN');
  const economicW         = categoryMap.get('Economic Empowerment|WOMEN');
  const legalW            = categoryMap.get('Legal & Human Rights|WOMEN');
  const safetyW           = categoryMap.get('Safety & Shelter|WOMEN');
  const socialW           = categoryMap.get('Social Support & Community Building|WOMEN');
  const envW              = categoryMap.get('Environmental & Rural Development|WOMEN');
  const finLitW           = categoryMap.get('Financial Literacy|WOMEN');
  const mentalHealthW     = categoryMap.get('Mental Health & Counseling|WOMEN');

  if (!healthChildren || !eduChildren || !protectionC || !shelterC || !empowermentC ||
      !genderC || !safetyC || !envC || !recreationC || !mentalHealthC ||
      !healthWomen || !eduWomen || !economicW || !legalW || !safetyW ||
      !socialW || !envW || !finLitW || !mentalHealthW) {
    throw new Error('Required categories not found. Please seed categories first.');
  }

  const resources = [
    // Health & Well-being (Children)
    { name: 'Mental Health & Emotional Support', description: 'Counseling, trauma therapy, play therapy', categoryId: healthChildren.id },
    { name: 'Disease Prevention & Treatment', description: 'Vaccination drives, hygiene awareness', categoryId: healthChildren.id },
    { name: 'Substance Abuse Prevention', description: 'Anti-drug programs, peer support groups', categoryId: healthChildren.id },
    { name: 'Maternal & Infant Health', description: 'Newborn care, breastfeeding support, immunizations', categoryId: healthChildren.id },
    { name: 'Nutrition & Malnutrition Prevention', description: 'Feeding programs, vitamin supplements', categoryId: healthChildren.id },
    // Education & Skill Development (Children)
    { name: 'Early Childhood Education', description: 'Preschool programs, daycare centers', categoryId: eduChildren.id },
    { name: 'Primary & Secondary Education', description: 'School enrollment drives, scholarships', categoryId: eduChildren.id },
    { name: 'Vocational Training for Youth', description: 'Carpentry, tailoring, agriculture, mechanics', categoryId: eduChildren.id },
    { name: 'STEM & Digital Literacy', description: 'Coding, robotics, internet safety', categoryId: eduChildren.id },
    { name: 'Workplace Readiness Programs', description: 'Internships, career coaching', categoryId: eduChildren.id },
    { name: 'Disability & Special Needs Support', description: 'Inclusive education, therapy, assistive devices', categoryId: eduChildren.id },
    { name: 'Library & Learning Resource Centers', description: 'Books, reading programs, homework help', categoryId: eduChildren.id },
    { name: "Girls' Education & Empowerment", description: 'STEM training, leadership workshops', categoryId: eduChildren.id },
    // Child Protection & Rights (Children)
    { name: 'Child Abuse Prevention & Response', description: 'Helplines, legal aid, safe spaces', categoryId: protectionC.id },
    { name: 'Anti-Trafficking & Exploitation Programs', description: 'Awareness, rescue operations', categoryId: protectionC.id },
    { name: 'Juvenile Justice & Legal Aid', description: 'Rehabilitation, reintegration programs', categoryId: protectionC.id },
    { name: 'Child-friendly Legal Support', description: 'Advocacy for birth registration, legal rights', categoryId: protectionC.id },
    // Shelter & Basic Needs (Children)
    { name: 'Orphan & Foster Care Support', description: 'Adoption services, alternative care models', categoryId: shelterC.id },
    { name: 'Street Outreach & Reintegration', description: 'Counseling, education, family reunification', categoryId: shelterC.id },
    { name: 'Food & Clothing Distribution', description: 'School meal programs, warm clothing drives', categoryId: shelterC.id },
    // Economic & Social Empowerment (Children)
    { name: 'Financial & Life Skills Training', description: 'Budgeting, leadership, communication skills', categoryId: empowermentC.id },
    { name: 'Street Children & Homelessness Assistance', description: 'Shelters, rehabilitation programs', categoryId: empowermentC.id },
    { name: 'Prevention of Child Labor', description: 'Advocacy, education support, skill training', categoryId: empowermentC.id },
    { name: 'Microfinance for Young Entrepreneurs', description: 'Financial aid, savings programs', categoryId: empowermentC.id },
    { name: 'Support for Working Children & Families', description: 'After-school programs, skill development', categoryId: empowermentC.id },
    { name: 'Rural & Indigenous Child Support', description: 'Language preservation, cultural education', categoryId: empowermentC.id },
    { name: 'Youth Entrepreneurship & Job Training', description: 'Mentorship, startup grants', categoryId: empowermentC.id },
    // Gender & Inclusion (Children)
    { name: 'Support for LGBTQ+ Youth', description: 'Safe spaces, mental health support', categoryId: genderC.id },
    // Safety & Emergency Response (Children)
    { name: 'Disaster Preparedness & Relief for Children', description: 'Safe zones, trauma care', categoryId: safetyC.id },
    { name: 'Refugee & Displaced Children Support', description: 'Education, mental health services', categoryId: safetyC.id },
    { name: 'Conflict-Affected Children Programs', description: 'Rehabilitation, reintegration support', categoryId: safetyC.id },
    { name: 'Emergency Shelters for Abandoned or At-Risk Children', description: 'Temporary homes, foster homes', categoryId: safetyC.id },
    // Environment & Sustainability (Children)
    { name: 'Safe Spaces for Play & Recreation', description: 'Playgrounds, sports clubs, art centers', categoryId: envC.id },
    { name: 'Eco-Schools & Green Learning Spaces', description: 'Gardening, recycling programs', categoryId: envC.id },
    { name: 'Climate Change Awareness for Kids', description: 'Interactive workshops, action projects', categoryId: envC.id },
    { name: 'Clean Water & Sanitation Programs', description: 'Hygiene kits, access to safe drinking water', categoryId: envC.id },
    // Recreation & Sports (Children)
    { name: 'Sports & Athletics Programs', description: 'Team sports, athletics, fitness activities', categoryId: recreationC.id },
    { name: 'Arts & Cultural Activities', description: 'Music, dance, visual arts programs', categoryId: recreationC.id },
    { name: 'Community Play Spaces', description: 'Safe play areas and recreational facilities', categoryId: recreationC.id },
    // Mental Health Support (Children)
    { name: 'Child & Adolescent Counseling', description: 'Individual and group therapy sessions', categoryId: mentalHealthC.id },
    { name: 'School Mental Health Programs', description: 'In-school psychological support', categoryId: mentalHealthC.id },
    { name: 'Trauma Recovery Services', description: 'Specialized care for trauma and abuse survivors', categoryId: mentalHealthC.id },
    // Health & Well-being (Women)
    { name: 'Maternal Health', description: 'Prenatal & postnatal care, breastfeeding support', categoryId: healthWomen.id },
    { name: 'Mental Health', description: 'Counseling, trauma support, depression & anxiety resources', categoryId: healthWomen.id },
    { name: 'Nutrition & Wellness', description: 'Healthy eating, fitness programs, disease prevention', categoryId: healthWomen.id },
    { name: 'Reproductive Health', description: 'Family planning, menstrual health, contraception', categoryId: healthWomen.id },
    { name: 'Substance Abuse Support', description: 'Addiction recovery programs, rehabilitation centers', categoryId: healthWomen.id },
    // Education & Skills Development (Women)
    { name: 'Literacy Programs', description: 'Basic reading & writing skills', categoryId: eduWomen.id },
    { name: 'STEM Education', description: 'Scholarships, coding & tech training', categoryId: eduWomen.id },
    { name: 'Vocational Training', description: 'Tailoring, beauty services, agriculture, handicrafts', categoryId: eduWomen.id },
    { name: 'Digital Literacy', description: 'Computer skills, online safety, social media training', categoryId: eduWomen.id },
    // Economic Empowerment (Women)
    { name: 'Entrepreneurship Support', description: 'Business training, startup grants, mentorship', categoryId: economicW.id },
    { name: 'Microfinance & Loans', description: 'Small business funding, cooperative banking', categoryId: economicW.id },
    { name: 'Financial Literacy Training', description: 'Budgeting, banking, investment skills', categoryId: economicW.id },
    { name: 'Home-based & Remote Work Opportunities', description: 'Freelancing, online work training', categoryId: economicW.id },
    { name: 'Job Placement & Career Guidance', description: 'Resume building, interview prep, job matching', categoryId: economicW.id },
    { name: 'Leadership & Empowerment', description: 'Public speaking, confidence-building workshops', categoryId: economicW.id },
    // Legal & Human Rights (Women)
    { name: "Fair Wages & Workers' Rights", description: 'Awareness, legal assistance, advocacy', categoryId: legalW.id },
    { name: 'Legal Aid & Representation', description: 'Domestic abuse, divorce, child custody', categoryId: legalW.id },
    { name: 'Land & Property Rights', description: 'Inheritance rights, land ownership support', categoryId: legalW.id },
    { name: 'Sexual Harassment & Workplace Safety', description: 'Policy advocacy, case reporting', categoryId: legalW.id },
    { name: 'Child & Forced Marriage Prevention', description: 'Legal action, awareness campaigns', categoryId: legalW.id },
    { name: 'Citizenship & Documentation Support', description: 'ID cards, birth certificates, legal status', categoryId: legalW.id },
    { name: "LGBTQ+ Women's Resources", description: 'Safe spaces, mental health support, legal aid', categoryId: legalW.id },
    { name: 'Refugee & Migrant Women Support', description: 'Language classes, resettlement help', categoryId: legalW.id },
    // Safety & Shelter (Women)
    { name: 'Sexual & Domestic Violence Support', description: 'Crisis helplines, safe spaces, legal aid', categoryId: safetyW.id },
    { name: 'Domestic Violence Shelters', description: 'Safe houses, emergency housing', categoryId: safetyW.id },
    { name: 'Transitional Housing', description: 'Long-term support for homeless or abused women', categoryId: safetyW.id },
    { name: 'Self-defense Training', description: 'Martial arts, situational awareness', categoryId: safetyW.id },
    { name: 'Crisis Helplines', description: '24/7 support for violence victims', categoryId: safetyW.id },
    { name: 'Community Watch Programs', description: 'Women-led safety initiatives', categoryId: safetyW.id },
    // Social Support & Community Building (Women)
    { name: "Women's Support Groups", description: 'Peer-to-peer counseling, discussion forums', categoryId: socialW.id },
    { name: "Single Mothers' Support", description: 'Daycare, legal aid, financial aid', categoryId: socialW.id },
    { name: 'Elderly Women Support', description: 'Healthcare, social engagement programs', categoryId: socialW.id },
    // Environmental & Rural Development (Women)
    { name: 'Sustainable Farming Programs', description: 'Organic agriculture, eco-friendly practices', categoryId: envW.id },
    { name: 'Clean Water & Sanitation', description: 'Hygiene awareness, access to safe drinking water', categoryId: envW.id },
    { name: "Climate Change & Women's Rights", description: 'Eco-activism, climate resilience training', categoryId: envW.id },
    { name: 'Renewable Energy Access', description: 'Solar projects, energy-efficient cooking methods', categoryId: envW.id },
    // Financial Literacy (Women)
    { name: 'Personal Finance Management', description: 'Savings, budgeting and debt management', categoryId: finLitW.id },
    { name: 'Banking & Credit Access', description: 'Bank account opening, credit score guidance', categoryId: finLitW.id },
    { name: 'Investment Awareness', description: 'SIPs, government schemes, insurance basics', categoryId: finLitW.id },
    // Mental Health & Counseling (Women)
    { name: 'Individual Counseling', description: 'One-on-one therapy sessions', categoryId: mentalHealthW.id },
    { name: 'Group Therapy & Support Circles', description: 'Peer support in safe group settings', categoryId: mentalHealthW.id },
    { name: 'Trauma-informed Care', description: 'Specialized therapy for abuse and trauma survivors', categoryId: mentalHealthW.id },
  ];

  await prisma.serviceResource.createMany({ data: resources, skipDuplicates: true });
  console.log(`✅ Seeded ${resources.length} service resources`);

  // 6. Seed Faith options — aligned with SQL sakhi_faith.sql naming
  const faiths = [
    { name: 'Hinduism' },
    { name: 'Islam' },
    { name: 'Christianity' },
    { name: 'Sikhism' },
    { name: 'Buddhism' },
    { name: 'Jainism' },
    { name: 'Other' },
    { name: 'No Preference' },
  ];

  await prisma.faith.createMany({ data: faiths, skipDuplicates: true });
  console.log('✅ Seeded faith options');

  // 7. Seed Social Categories — aligned with SQL sakhi_social_category.sql
  const socialCategories = [
    { name: 'Scheduled Caste (SC)' },
    { name: 'Scheduled Tribe (ST)' },
    { name: 'Other Backward Class (OBC)' },
    { name: 'Backward Class (BC)' },
    { name: 'Economically Weaker Section (EWS)' },
    { name: 'General Class (GC)' },
  ];

  await prisma.socialCategory.createMany({ data: socialCategories, skipDuplicates: true });
  console.log('✅ Seeded 6 social categories');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
