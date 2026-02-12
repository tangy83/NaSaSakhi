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

  // 4. Seed Service Categories (14 categories)
  const categories = [
    // For Children (7)
    { name: 'Education Support', targetGroup: TargetGroup.CHILDREN, displayOrder: 1 },
    { name: 'Child Protection', targetGroup: TargetGroup.CHILDREN, displayOrder: 2 },
    { name: 'Healthcare', targetGroup: TargetGroup.CHILDREN, displayOrder: 3 },
    { name: 'Nutrition', targetGroup: TargetGroup.CHILDREN, displayOrder: 4 },
    { name: 'Recreation', targetGroup: TargetGroup.CHILDREN, displayOrder: 5 },
    { name: 'Skill Development', targetGroup: TargetGroup.CHILDREN, displayOrder: 6 },
    { name: 'Legal Aid for Children', targetGroup: TargetGroup.CHILDREN, displayOrder: 7 },
    // For Women (7)
    { name: "Women's Healthcare", targetGroup: TargetGroup.WOMEN, displayOrder: 8 },
    { name: 'Legal Support for Women', targetGroup: TargetGroup.WOMEN, displayOrder: 9 },
    { name: 'Skill Training', targetGroup: TargetGroup.WOMEN, displayOrder: 10 },
    { name: 'Shelter/Safe Housing', targetGroup: TargetGroup.WOMEN, displayOrder: 11 },
    { name: 'Counseling Services', targetGroup: TargetGroup.WOMEN, displayOrder: 12 },
    { name: 'Economic Empowerment', targetGroup: TargetGroup.WOMEN, displayOrder: 13 },
    { name: 'Awareness Programs', targetGroup: TargetGroup.WOMEN, displayOrder: 14 },
  ];

  await prisma.serviceCategory.createMany({ data: categories, skipDuplicates: true });
  console.log('✅ Seeded 14 service categories');

  // 5. Seed Service Resources (76 resources)
  // Get all categories
  const allCategories = await prisma.serviceCategory.findMany();
  const categoryMap = new Map(allCategories.map(cat => [cat.name, cat]));

  const educationSupport = categoryMap.get('Education Support');
  const childProtection = categoryMap.get('Child Protection');
  const healthcare = categoryMap.get('Healthcare');
  const nutrition = categoryMap.get('Nutrition');
  const recreation = categoryMap.get('Recreation');
  const skillDevelopment = categoryMap.get('Skill Development');
  const legalAidChildren = categoryMap.get('Legal Aid for Children');
  const womensHealthcare = categoryMap.get("Women's Healthcare");
  const legalSupportWomen = categoryMap.get('Legal Support for Women');
  const skillTraining = categoryMap.get('Skill Training');
  const shelter = categoryMap.get('Shelter/Safe Housing');
  const counseling = categoryMap.get('Counseling Services');
  const economicEmpowerment = categoryMap.get('Economic Empowerment');
  const awarenessPrograms = categoryMap.get('Awareness Programs');

  if (!educationSupport || !childProtection || !healthcare || !nutrition || !recreation || 
      !skillDevelopment || !legalAidChildren || !womensHealthcare || !legalSupportWomen || 
      !skillTraining || !shelter || !counseling || !economicEmpowerment || !awarenessPrograms) {
    throw new Error('Required categories not found. Please seed categories first.');
  }

  const resources = [
    // Education Support (5+ resources)
    { name: 'After-school tutoring', categoryId: educationSupport.id },
    { name: 'Scholarship programs', categoryId: educationSupport.id },
    { name: 'School supplies distribution', categoryId: educationSupport.id },
    { name: 'Digital literacy programs', categoryId: educationSupport.id },
    { name: 'Career counseling', categoryId: educationSupport.id },
    { name: 'Educational workshops', categoryId: educationSupport.id },
    { name: 'Library access', categoryId: educationSupport.id },
    { name: 'Study groups', categoryId: educationSupport.id },
    
    // Child Protection (5+ resources)
    { name: 'Child helpline support', categoryId: childProtection.id },
    { name: 'Safe spaces for children', categoryId: childProtection.id },
    { name: 'Child abuse prevention programs', categoryId: childProtection.id },
    { name: 'Foster care services', categoryId: childProtection.id },
    { name: 'Child rights awareness', categoryId: childProtection.id },
    { name: 'Emergency shelter for children', categoryId: childProtection.id },
    
    // Healthcare (5+ resources)
    { name: 'Pediatric health checkups', categoryId: healthcare.id },
    { name: 'Vaccination programs', categoryId: healthcare.id },
    { name: 'Nutritional supplements', categoryId: healthcare.id },
    { name: 'Mental health support for children', categoryId: healthcare.id },
    { name: 'Dental care for children', categoryId: healthcare.id },
    { name: 'Vision and hearing tests', categoryId: healthcare.id },
    
    // Nutrition (5+ resources)
    { name: 'Mid-day meal programs', categoryId: nutrition.id },
    { name: 'Nutrition education', categoryId: nutrition.id },
    { name: 'Food distribution', categoryId: nutrition.id },
    { name: 'Growth monitoring', categoryId: nutrition.id },
    { name: 'Supplemental nutrition programs', categoryId: nutrition.id },
    
    // Recreation (5+ resources)
    { name: 'Sports activities', categoryId: recreation.id },
    { name: 'Arts and crafts programs', categoryId: recreation.id },
    { name: 'Music and dance classes', categoryId: recreation.id },
    { name: 'Playground facilities', categoryId: recreation.id },
    { name: 'Summer camps', categoryId: recreation.id },
    { name: 'Cultural programs', categoryId: recreation.id },
    
    // Skill Development (5+ resources)
    { name: 'Vocational training', categoryId: skillDevelopment.id },
    { name: 'Computer skills training', categoryId: skillDevelopment.id },
    { name: 'Life skills workshops', categoryId: skillDevelopment.id },
    { name: 'Entrepreneurship training', categoryId: skillDevelopment.id },
    { name: 'Job placement assistance', categoryId: skillDevelopment.id },
    { name: 'Apprenticeship programs', categoryId: skillDevelopment.id },
    
    // Legal Aid for Children (5+ resources)
    { name: 'Legal counseling for children', categoryId: legalAidChildren.id },
    { name: 'Child custody support', categoryId: legalAidChildren.id },
    { name: 'Education rights advocacy', categoryId: legalAidChildren.id },
    { name: 'Child labor prevention', categoryId: legalAidChildren.id },
    { name: 'Legal representation for minors', categoryId: legalAidChildren.id },
    
    // Women's Healthcare (5+ resources)
    { name: 'Gynecological services', categoryId: womensHealthcare.id },
    { name: 'Maternal health care', categoryId: womensHealthcare.id },
    { name: 'Reproductive health services', categoryId: womensHealthcare.id },
    { name: 'Breast cancer screening', categoryId: womensHealthcare.id },
    { name: 'Mental health counseling for women', categoryId: womensHealthcare.id },
    { name: 'Prenatal and postnatal care', categoryId: womensHealthcare.id },
    { name: 'Family planning services', categoryId: womensHealthcare.id },
    
    // Legal Support for Women (5+ resources)
    { name: 'Domestic violence legal aid', categoryId: legalSupportWomen.id },
    { name: 'Divorce and separation support', categoryId: legalSupportWomen.id },
    { name: 'Property rights advocacy', categoryId: legalSupportWomen.id },
    { name: 'Dowry-related legal support', categoryId: legalSupportWomen.id },
    { name: 'Legal counseling for women', categoryId: legalSupportWomen.id },
    { name: 'Court representation', categoryId: legalSupportWomen.id },
    
    // Skill Training (5+ resources)
    { name: 'Vocational training for women', categoryId: skillTraining.id },
    { name: 'Entrepreneurship programs', categoryId: skillTraining.id },
    { name: 'Computer literacy for women', categoryId: skillTraining.id },
    { name: 'Financial literacy workshops', categoryId: skillTraining.id },
    { name: 'Handicraft training', categoryId: skillTraining.id },
    { name: 'Beauty and wellness training', categoryId: skillTraining.id },
    
    // Shelter/Safe Housing (5+ resources)
    { name: 'Emergency shelter', categoryId: shelter.id },
    { name: 'Transitional housing', categoryId: shelter.id },
    { name: 'Safe homes for women', categoryId: shelter.id },
    { name: 'Crisis accommodation', categoryId: shelter.id },
    { name: 'Long-term housing support', categoryId: shelter.id },
    
    // Counseling Services (5+ resources)
    { name: 'Individual counseling', categoryId: counseling.id },
    { name: 'Group therapy sessions', categoryId: counseling.id },
    { name: 'Crisis counseling', categoryId: counseling.id },
    { name: 'Family counseling', categoryId: counseling.id },
    { name: 'Trauma counseling', categoryId: counseling.id },
    { name: 'Support groups', categoryId: counseling.id },
    
    // Economic Empowerment (5+ resources)
    { name: 'Microfinance programs', categoryId: economicEmpowerment.id },
    { name: 'Self-help groups', categoryId: economicEmpowerment.id },
    { name: 'Business development support', categoryId: economicEmpowerment.id },
    { name: 'Market linkage programs', categoryId: economicEmpowerment.id },
    { name: 'Savings and credit groups', categoryId: economicEmpowerment.id },
    { name: 'Income generation programs', categoryId: economicEmpowerment.id },
    
    // Awareness Programs (5+ resources)
    { name: 'Women\'s rights awareness', categoryId: awarenessPrograms.id },
    { name: 'Health awareness campaigns', categoryId: awarenessPrograms.id },
    { name: 'Legal rights education', categoryId: awarenessPrograms.id },
    { name: 'Gender equality programs', categoryId: awarenessPrograms.id },
    { name: 'Community awareness workshops', categoryId: awarenessPrograms.id },
    { name: 'Digital safety awareness', categoryId: awarenessPrograms.id },
  ];

  await prisma.serviceResource.createMany({ data: resources, skipDuplicates: true });
  console.log(`✅ Seeded ${resources.length} service resources`);

  // 6. Seed Faith options
  const faiths = [
    { name: 'Hindu' },
    { name: 'Muslim' },
    { name: 'Christian' },
    { name: 'Sikh' },
    { name: 'Buddhist' },
    { name: 'Jain' },
    { name: 'Other' },
    { name: 'Prefer not to say' },
  ];

  await prisma.faith.createMany({ data: faiths, skipDuplicates: true });
  console.log('✅ Seeded faith options');

  // 7. Seed Social Categories
  const socialCategories = [
    { name: 'General' },
    { name: 'Scheduled Caste (SC)' },
    { name: 'Scheduled Tribe (ST)' },
    { name: 'Other Backward Class (OBC)' },
    { name: 'Economically Weaker Section (EWS)' },
  ];

  await prisma.socialCategory.createMany({ data: socialCategories, skipDuplicates: true });
  console.log('✅ Seeded social categories');

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
