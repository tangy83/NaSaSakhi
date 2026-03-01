// Mock API Functions for Frontend Development
// Use these when backend APIs are not ready yet
// Easy to switch to real API by changing imports

import { ApiResponse } from './client';
import {
  ServiceCategory,
  ServiceResource,
  Language,
  City,
  State,
  Faith,
  SocialCategory,
  DraftSaveRequest,
  DraftSaveResponse,
  DraftLoadResponse,
  FileUploadResponse,
  RegistrationFormData,
} from '@/types/api';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// Mock Reference Data
// ============================================================================

// Mock Service Categories (19 total: 10 for children, 9 for women)
// IDs prefixed with SQL CategoryID where available (C001-C008 for Children, W001-W007 for Women)
const mockCategories: ServiceCategory[] = [
  // Children categories
  { id: 'C001', name: 'Health & Well-being', targetGroup: 'CHILDREN', displayOrder: 1 },
  { id: 'C002', name: 'Education & Skill Development', targetGroup: 'CHILDREN', displayOrder: 2 },
  { id: 'C003', name: 'Child Protection & Rights', targetGroup: 'CHILDREN', displayOrder: 3 },
  { id: 'C004', name: 'Shelter & Basic Needs', targetGroup: 'CHILDREN', displayOrder: 4 },
  { id: 'C005', name: 'Economic & Social Empowerment', targetGroup: 'CHILDREN', displayOrder: 5 },
  { id: 'C006', name: 'Gender & Inclusion', targetGroup: 'CHILDREN', displayOrder: 6 },
  { id: 'C007', name: 'Safety & Emergency Response', targetGroup: 'CHILDREN', displayOrder: 7 },
  { id: 'C008', name: 'Environment & Sustainability', targetGroup: 'CHILDREN', displayOrder: 8 },
  { id: 'C009', name: 'Recreation & Sports', targetGroup: 'CHILDREN', displayOrder: 9 },
  { id: 'C010', name: 'Mental Health Support', targetGroup: 'CHILDREN', displayOrder: 10 },
  // Women categories
  { id: 'W001', name: 'Health & Well-being', targetGroup: 'WOMEN', displayOrder: 11 },
  { id: 'W002', name: 'Education & Skills Development', targetGroup: 'WOMEN', displayOrder: 12 },
  { id: 'W003', name: 'Economic Empowerment', targetGroup: 'WOMEN', displayOrder: 13 },
  { id: 'W004', name: 'Legal & Human Rights', targetGroup: 'WOMEN', displayOrder: 14 },
  { id: 'W005', name: 'Safety & Shelter', targetGroup: 'WOMEN', displayOrder: 15 },
  { id: 'W006', name: 'Social Support & Community Building', targetGroup: 'WOMEN', displayOrder: 16 },
  { id: 'W007', name: 'Environmental & Rural Development', targetGroup: 'WOMEN', displayOrder: 17 },
  { id: 'W008', name: 'Financial Literacy', targetGroup: 'WOMEN', displayOrder: 18 },
  { id: 'W009', name: 'Mental Health & Counseling', targetGroup: 'WOMEN', displayOrder: 19 },
];

// Mock Service Resources — sourced from SQL saathi_new_service_resource.sql
const mockResources: ServiceResource[] = [
  // C001: Health & Well-being (Children)
  { id: 'CR0011', categoryId: 'C001', name: 'Mental Health & Emotional Support', description: 'Counseling, trauma therapy, play therapy' },
  { id: 'CR0012', categoryId: 'C001', name: 'Disease Prevention & Treatment', description: 'Vaccination drives, hygiene awareness' },
  { id: 'CR0013', categoryId: 'C001', name: 'Substance Abuse Prevention', description: 'Anti-drug programs, peer support groups' },
  { id: 'CR0014', categoryId: 'C001', name: 'Maternal & Infant Health', description: 'Newborn care, breastfeeding support, immunizations' },
  { id: 'CR0015', categoryId: 'C001', name: 'Nutrition & Malnutrition Prevention', description: 'Feeding programs, vitamin supplements' },
  // C002: Education & Skill Development (Children)
  { id: 'CR0021', categoryId: 'C002', name: 'Early Childhood Education', description: 'Preschool programs, daycare centers' },
  { id: 'CR0022', categoryId: 'C002', name: 'Primary & Secondary Education', description: 'School enrollment drives, scholarships' },
  { id: 'CR0023', categoryId: 'C002', name: 'Vocational Training for Youth', description: 'Carpentry, tailoring, agriculture, mechanics' },
  { id: 'CR0024', categoryId: 'C002', name: 'STEM & Digital Literacy', description: 'Coding, robotics, internet safety' },
  { id: 'CR0025', categoryId: 'C002', name: 'Workplace Readiness Programs', description: 'Internships, career coaching' },
  { id: 'CR0026', categoryId: 'C002', name: 'Disability & Special Needs Support', description: 'Inclusive education, therapy, assistive devices' },
  { id: 'CR0027', categoryId: 'C002', name: 'Library & Learning Resource Centers', description: 'Books, reading programs, homework help' },
  { id: 'CR0028', categoryId: 'C002', name: "Girls' Education & Empowerment", description: 'STEM training, leadership workshops' },
  { id: 'CR0029', categoryId: 'C002', name: 'Programs for Disabled Children', description: 'Inclusive sports, special education services' },
  // C003: Child Protection & Rights (Children)
  { id: 'CR0031', categoryId: 'C003', name: 'Child Abuse Prevention & Response', description: 'Helplines, legal aid, safe spaces' },
  { id: 'CR0032', categoryId: 'C003', name: 'Anti-Trafficking & Exploitation Programs', description: 'Awareness, rescue operations' },
  { id: 'CR0033', categoryId: 'C003', name: 'Juvenile Justice & Legal Aid', description: 'Rehabilitation, reintegration programs' },
  { id: 'CR0034', categoryId: 'C003', name: 'Child-friendly Legal Support', description: 'Advocacy for birth registration, legal rights' },
  // C004: Shelter & Basic Needs (Children)
  { id: 'CR0041', categoryId: 'C004', name: 'Orphan & Foster Care Support', description: 'Adoption services, alternative care models' },
  { id: 'CR0042', categoryId: 'C004', name: 'Street Outreach & Reintegration', description: 'Counseling, education, family reunification' },
  { id: 'CR0043', categoryId: 'C004', name: 'Food & Clothing Distribution', description: 'School meal programs, warm clothing drives' },
  // C005: Economic & Social Empowerment (Children)
  { id: 'CR0051', categoryId: 'C005', name: 'Financial & Life Skills Training', description: 'Budgeting, leadership, communication skills' },
  { id: 'CR0052', categoryId: 'C005', name: 'Street Children & Homelessness Assistance', description: 'Shelters, rehabilitation programs' },
  { id: 'CR0053', categoryId: 'C005', name: 'Prevention of Child Labor', description: 'Advocacy, education support, skill training' },
  { id: 'CR0054', categoryId: 'C005', name: 'Microfinance for Young Entrepreneurs', description: 'Financial aid, savings programs' },
  { id: 'CR0055', categoryId: 'C005', name: 'Support for Working Children & Families', description: 'After-school programs, skill development' },
  { id: 'CR0056', categoryId: 'C005', name: 'Rural & Indigenous Child Support', description: 'Language preservation, cultural education' },
  { id: 'CR0057', categoryId: 'C005', name: 'Youth Entrepreneurship & Job Training', description: 'Mentorship, startup grants' },
  // C006: Gender & Inclusion (Children)
  { id: 'CR0061', categoryId: 'C006', name: 'Support for LGBTQ+ Youth', description: 'Safe spaces, mental health support' },
  // C007: Safety & Emergency Response (Children)
  { id: 'CR0071', categoryId: 'C007', name: 'Disaster Preparedness & Relief for Children', description: 'Safe zones, trauma care' },
  { id: 'CR0072', categoryId: 'C007', name: 'Refugee & Displaced Children Support', description: 'Education, mental health services' },
  { id: 'CR0073', categoryId: 'C007', name: 'Conflict-Affected Children Programs', description: 'Rehabilitation, reintegration support' },
  { id: 'CR0074', categoryId: 'C007', name: 'Emergency Shelters for Abandoned or At-Risk Children', description: 'Temporary homes, foster homes' },
  // C008: Environment & Sustainability (Children)
  { id: 'CR0081', categoryId: 'C008', name: 'Safe Spaces for Play & Recreation', description: 'Playgrounds, sports clubs, art centers' },
  { id: 'CR0082', categoryId: 'C008', name: 'Eco-Schools & Green Learning Spaces', description: 'Gardening, recycling programs' },
  { id: 'CR0083', categoryId: 'C008', name: 'Climate Change Awareness for Kids', description: 'Interactive workshops, action projects' },
  { id: 'CR0084', categoryId: 'C008', name: 'Clean Water & Sanitation Programs', description: 'Hygiene kits, access to safe drinking water' },
  // C009: Recreation & Sports (Children) — app-specific
  { id: 'CR0091', categoryId: 'C009', name: 'Sports & Athletics Programs', description: 'Team sports, athletics, fitness activities' },
  { id: 'CR0092', categoryId: 'C009', name: 'Arts & Cultural Activities', description: 'Music, dance, visual arts programs' },
  { id: 'CR0093', categoryId: 'C009', name: 'Community Play Spaces', description: 'Safe play areas and recreational facilities' },
  // C010: Mental Health Support (Children) — app-specific
  { id: 'CR0101', categoryId: 'C010', name: 'Child & Adolescent Counseling', description: 'Individual and group therapy sessions' },
  { id: 'CR0102', categoryId: 'C010', name: 'School Mental Health Programs', description: 'In-school psychological support' },
  { id: 'CR0103', categoryId: 'C010', name: 'Trauma Recovery Services', description: 'Specialized care for trauma and abuse survivors' },
  // W001: Health & Well-being (Women)
  { id: 'WR0011', categoryId: 'W001', name: 'Maternal Health', description: 'Prenatal & postnatal care, breastfeeding support' },
  { id: 'WR0012', categoryId: 'W001', name: 'Mental Health', description: 'Counseling, trauma support, depression & anxiety resources' },
  { id: 'WR0013', categoryId: 'W001', name: 'Nutrition & Wellness', description: 'Healthy eating, fitness programs, disease prevention' },
  { id: 'WR0014', categoryId: 'W001', name: 'Reproductive Health', description: 'Family planning, menstrual health, contraception' },
  { id: 'WR0015', categoryId: 'W001', name: 'Substance Abuse Support', description: 'Addiction recovery programs, rehabilitation centers' },
  // W002: Education & Skills Development (Women)
  { id: 'WR0021', categoryId: 'W002', name: 'Literacy Programs', description: 'Basic reading & writing skills' },
  { id: 'WR0022', categoryId: 'W002', name: 'STEM Education', description: 'Scholarships, coding & tech training' },
  { id: 'WR0023', categoryId: 'W002', name: 'Vocational Training', description: 'Tailoring, beauty services, agriculture, handicrafts' },
  { id: 'WR0024', categoryId: 'W002', name: 'Digital Literacy', description: 'Computer skills, online safety, social media training' },
  // W003: Economic Empowerment (Women)
  { id: 'WR0031', categoryId: 'W003', name: 'Entrepreneurship Support', description: 'Business training, startup grants, mentorship' },
  { id: 'WR0032', categoryId: 'W003', name: 'Microfinance & Loans', description: 'Small business funding, cooperative banking' },
  { id: 'WR0033', categoryId: 'W003', name: 'Financial Literacy', description: 'Budgeting, banking, investment skills' },
  { id: 'WR0034', categoryId: 'W003', name: 'Home-based & Remote Work Opportunities', description: 'Freelancing, online work training' },
  { id: 'WR0035', categoryId: 'W003', name: 'Job Placement & Career Guidance', description: 'Resume building, interview prep, job matching' },
  { id: 'WR0036', categoryId: 'W003', name: 'Leadership & Empowerment', description: 'Public speaking, confidence-building workshops' },
  // W004: Legal & Human Rights (Women)
  { id: 'WR0041', categoryId: 'W004', name: "Fair Wages & Workers' Rights", description: 'Awareness, legal assistance, advocacy' },
  { id: 'WR0042', categoryId: 'W004', name: 'Legal Aid & Representation', description: 'Domestic abuse, divorce, child custody' },
  { id: 'WR0043', categoryId: 'W004', name: 'Land & Property Rights', description: 'Inheritance rights, land ownership support' },
  { id: 'WR0044', categoryId: 'W004', name: 'Sexual Harassment & Workplace Safety', description: 'Policy advocacy, case reporting' },
  { id: 'WR0045', categoryId: 'W004', name: 'Child & Forced Marriage Prevention', description: 'Legal action, awareness campaigns' },
  { id: 'WR0046', categoryId: 'W004', name: 'Citizenship & Documentation Support', description: 'ID cards, birth certificates, legal status' },
  { id: 'WR0047', categoryId: 'W004', name: "LGBTQ+ Women's Resources", description: 'Safe spaces, mental health support, legal aid' },
  { id: 'WR0048', categoryId: 'W004', name: 'Refugee & Migrant Women Support', description: 'Language classes, resettlement help' },
  // W005: Safety & Shelter (Women)
  { id: 'WR0051', categoryId: 'W005', name: 'Sexual & Domestic Violence Support', description: 'Crisis helplines, safe spaces, legal aid' },
  { id: 'WR0052', categoryId: 'W005', name: 'Domestic Violence Shelters', description: 'Safe houses, emergency housing' },
  { id: 'WR0053', categoryId: 'W005', name: 'Transitional Housing', description: 'Long-term support for homeless or abused women' },
  { id: 'WR0054', categoryId: 'W005', name: 'Self-defense Training', description: 'Martial arts, situational awareness' },
  { id: 'WR0055', categoryId: 'W005', name: 'Crisis Helplines', description: '24/7 support for violence victims' },
  { id: 'WR0056', categoryId: 'W005', name: 'Community Watch Programs', description: 'Women-led safety initiatives' },
  // W006: Social Support & Community Building (Women)
  { id: 'WR0061', categoryId: 'W006', name: "Women's Support Groups", description: 'Peer-to-peer counseling, discussion forums' },
  { id: 'WR0062', categoryId: 'W006', name: "Single Mothers' Support", description: 'Daycare, legal aid, financial aid' },
  { id: 'WR0063', categoryId: 'W006', name: 'Elderly Women Support', description: 'Healthcare, social engagement programs' },
  // W007: Environmental & Rural Development (Women)
  { id: 'WR0071', categoryId: 'W007', name: 'Sustainable Farming Programs', description: 'Organic agriculture, eco-friendly practices' },
  { id: 'WR0072', categoryId: 'W007', name: 'Clean Water & Sanitation', description: 'Hygiene awareness, access to safe drinking water' },
  { id: 'WR0073', categoryId: 'W007', name: "Climate Change & Women's Rights", description: 'Eco-activism, climate resilience training' },
  { id: 'WR0074', categoryId: 'W007', name: 'Renewable Energy Access', description: 'Solar projects, energy-efficient cooking methods' },
  // W008: Financial Literacy (Women) — app-specific
  { id: 'WR0081', categoryId: 'W008', name: 'Personal Finance Management', description: 'Savings, budgeting and debt management' },
  { id: 'WR0082', categoryId: 'W008', name: 'Banking & Credit Access', description: 'Bank account opening, credit score guidance' },
  { id: 'WR0083', categoryId: 'W008', name: 'Investment Awareness', description: 'SIPs, government schemes, insurance basics' },
  // W009: Mental Health & Counseling (Women) — app-specific
  { id: 'WR0091', categoryId: 'W009', name: 'Individual Counseling', description: 'One-on-one therapy sessions' },
  { id: 'WR0092', categoryId: 'W009', name: 'Group Therapy & Support Circles', description: 'Peer support in safe group settings' },
  { id: 'WR0093', categoryId: 'W009', name: 'Trauma-informed Care', description: 'Specialized therapy for abuse and trauma survivors' },
];

// Mock Languages (30 Indian languages) — includes Phase 2 font metadata
const mockLanguages: Language[] = [
  { id: 'lang-1',  name: 'Hindi',     code: 'hi', isActive: true, scriptFamily: 'Devanagari', isRTL: false, fontFamily: 'Noto Sans Devanagari', googleFontName: 'Noto+Sans+Devanagari' },
  { id: 'lang-2',  name: 'English',   code: 'en', isActive: true, scriptFamily: 'Latin',      isRTL: false, fontFamily: 'Open Sans',             googleFontName: 'Open+Sans'             },
  { id: 'lang-3',  name: 'Bengali',   code: 'bn', isActive: true, scriptFamily: 'Bengali',    isRTL: false, fontFamily: 'Noto Sans Bengali',      googleFontName: 'Noto+Sans+Bengali'     },
  { id: 'lang-4',  name: 'Telugu',    code: 'te', isActive: true, scriptFamily: 'Telugu',     isRTL: false, fontFamily: 'Noto Sans Telugu',       googleFontName: 'Noto+Sans+Telugu'      },
  { id: 'lang-5',  name: 'Marathi',   code: 'mr', isActive: true, scriptFamily: 'Devanagari', isRTL: false, fontFamily: 'Noto Sans Devanagari',   googleFontName: 'Noto+Sans+Devanagari'  },
  { id: 'lang-6',  name: 'Tamil',     code: 'ta', isActive: true, scriptFamily: 'Tamil',      isRTL: false, fontFamily: 'Noto Sans Tamil',        googleFontName: 'Noto+Sans+Tamil'       },
  { id: 'lang-7',  name: 'Gujarati',  code: 'gu', isActive: true, scriptFamily: 'Gujarati',   isRTL: false, fontFamily: 'Noto Sans Gujarati',     googleFontName: 'Noto+Sans+Gujarati'    },
  { id: 'lang-8',  name: 'Kannada',   code: 'kn', isActive: true, scriptFamily: 'Kannada',    isRTL: false, fontFamily: 'Noto Sans Kannada',      googleFontName: 'Noto+Sans+Kannada'     },
  { id: 'lang-9',  name: 'Malayalam', code: 'ml', isActive: true, scriptFamily: 'Malayalam',  isRTL: false, fontFamily: 'Noto Sans Malayalam',    googleFontName: 'Noto+Sans+Malayalam'   },
  { id: 'lang-10', name: 'Odia',      code: 'or', isActive: true, scriptFamily: 'Odia',       isRTL: false, fontFamily: 'Noto Sans Oriya',        googleFontName: 'Noto+Sans+Oriya'       },
  { id: 'lang-11', name: 'Punjabi',   code: 'pa', isActive: true, scriptFamily: 'Gurmukhi',   isRTL: false, fontFamily: 'Noto Sans Gurmukhi',     googleFontName: 'Noto+Sans+Gurmukhi'    },
  { id: 'lang-12', name: 'Assamese',  code: 'as', isActive: true, scriptFamily: 'Bengali',    isRTL: false, fontFamily: 'Noto Sans Bengali',      googleFontName: 'Noto+Sans+Bengali'     },
  { id: 'lang-13', name: 'Urdu',      code: 'ur', isActive: true, scriptFamily: 'Arabic',     isRTL: true,  fontFamily: 'Noto Nastaliq Urdu',     googleFontName: 'Noto+Nastaliq+Urdu'    },
  { id: 'lang-14', name: 'Sanskrit',  code: 'sa', isActive: true, scriptFamily: 'Devanagari', isRTL: false, fontFamily: 'Noto Sans Devanagari',   googleFontName: 'Noto+Sans+Devanagari'  },
  { id: 'lang-15', name: 'Kashmiri',  code: 'ks', isActive: true, scriptFamily: 'Arabic',     isRTL: true,  fontFamily: 'Noto Nastaliq Urdu',     googleFontName: 'Noto+Nastaliq+Urdu'    },
];

// Mock States (28 states + 8 UTs)
const mockStates: State[] = [
  { id: 'state-1', name: 'Andhra Pradesh', code: 'AP' },
  { id: 'state-2', name: 'Arunachal Pradesh', code: 'AR' },
  { id: 'state-3', name: 'Assam', code: 'AS' },
  { id: 'state-4', name: 'Bihar', code: 'BR' },
  { id: 'state-5', name: 'Chhattisgarh', code: 'CG' },
  { id: 'state-6', name: 'Goa', code: 'GA' },
  { id: 'state-7', name: 'Gujarat', code: 'GJ' },
  { id: 'state-8', name: 'Haryana', code: 'HR' },
  { id: 'state-9', name: 'Himachal Pradesh', code: 'HP' },
  { id: 'state-10', name: 'Jharkhand', code: 'JH' },
  { id: 'state-11', name: 'Karnataka', code: 'KA' },
  { id: 'state-12', name: 'Kerala', code: 'KL' },
  { id: 'state-13', name: 'Madhya Pradesh', code: 'MP' },
  { id: 'state-14', name: 'Maharashtra', code: 'MH' },
  { id: 'state-15', name: 'Manipur', code: 'MN' },
  { id: 'state-16', name: 'Meghalaya', code: 'ML' },
  { id: 'state-17', name: 'Mizoram', code: 'MZ' },
  { id: 'state-18', name: 'Nagaland', code: 'NL' },
  { id: 'state-19', name: 'Odisha', code: 'OD' },
  { id: 'state-20', name: 'Punjab', code: 'PB' },
  { id: 'state-21', name: 'Rajasthan', code: 'RJ' },
  { id: 'state-22', name: 'Sikkim', code: 'SK' },
  { id: 'state-23', name: 'Tamil Nadu', code: 'TN' },
  { id: 'state-24', name: 'Telangana', code: 'TG' },
  { id: 'state-25', name: 'Tripura', code: 'TR' },
  { id: 'state-26', name: 'Uttar Pradesh', code: 'UP' },
  { id: 'state-27', name: 'Uttarakhand', code: 'UK' },
  { id: 'state-28', name: 'West Bengal', code: 'WB' },
  // Union Territories
  { id: 'ut-1', name: 'Andaman and Nicobar Islands', code: 'AN' },
  { id: 'ut-2', name: 'Chandigarh', code: 'CH' },
  { id: 'ut-3', name: 'Dadra and Nagar Haveli and Daman and Diu', code: 'DH' },
  { id: 'ut-4', name: 'Delhi', code: 'DL' },
  { id: 'ut-5', name: 'Jammu and Kashmir', code: 'JK' },
  { id: 'ut-6', name: 'Ladakh', code: 'LA' },
  { id: 'ut-7', name: 'Lakshadweep', code: 'LD' },
  { id: 'ut-8', name: 'Puducherry', code: 'PY' },
];

// Mock Cities (sample cities with state information)
const mockCities: City[] = [
  { id: 'city-1', name: 'Mumbai', stateId: 'state-14', stateName: 'Maharashtra' },
  { id: 'city-2', name: 'Delhi', stateId: 'ut-4', stateName: 'Delhi' },
  { id: 'city-3', name: 'Bangalore', stateId: 'state-11', stateName: 'Karnataka' },
  { id: 'city-4', name: 'Hyderabad', stateId: 'state-24', stateName: 'Telangana' },
  { id: 'city-5', name: 'Chennai', stateId: 'state-23', stateName: 'Tamil Nadu' },
  { id: 'city-6', name: 'Kolkata', stateId: 'state-28', stateName: 'West Bengal' },
  { id: 'city-7', name: 'Pune', stateId: 'state-14', stateName: 'Maharashtra' },
  { id: 'city-8', name: 'Ahmedabad', stateId: 'state-7', stateName: 'Gujarat' },
  { id: 'city-9', name: 'Jaipur', stateId: 'state-21', stateName: 'Rajasthan' },
  { id: 'city-10', name: 'Lucknow', stateId: 'state-26', stateName: 'Uttar Pradesh' },
  // Add more cities...
];

// Mock Faith options — IDs aligned with SQL saathi_faith.sql (4-char codes)
const mockFaiths: Faith[] = [
  { id: 'hind', name: 'Hinduism' },
  { id: 'isla', name: 'Islam' },
  { id: 'chri', name: 'Christianity' },
  { id: 'sikh', name: 'Sikhism' },
  { id: 'budd', name: 'Buddhism' },
  { id: 'jain', name: 'Jainism' },
  { id: 'othr', name: 'Other' },
  { id: 'nopf', name: 'No Preference' },
];

// Mock Social Categories — IDs aligned with SQL saathi_social_category.sql
const mockSocialCategories: SocialCategory[] = [
  { id: 'SC', name: 'Scheduled Caste (SC)' },
  { id: 'ST', name: 'Scheduled Tribe (ST)' },
  { id: 'OBC', name: 'Other Backward Class (OBC)' },
  { id: 'BC', name: 'Backward Class (BC)' },
  { id: 'EWS', name: 'Economically Weaker Section (EWS)' },
  { id: 'GC', name: 'General Class (GC)' },
];

// ============================================================================
// Mock API Functions
// ============================================================================

/**
 * Mock: Fetch service categories
 * GET /api/reference/categories
 */
export async function fetchCategoriesMock(): Promise<ApiResponse<ServiceCategory[]>> {
  await delay(300); // Simulate network delay
  return {
    success: true,
    data: mockCategories,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Mock: Fetch service resources by category
 * GET /api/reference/resources?categoryId=<id>
 */
export async function fetchResourcesMock(categoryId?: string): Promise<ApiResponse<ServiceResource[]>> {
  await delay(300);
  let resources = mockResources;
  
  if (categoryId) {
    resources = mockResources.filter((r) => r.categoryId === categoryId);
  }
  
  return {
    success: true,
    data: resources,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Mock: Fetch languages
 * GET /api/reference/languages
 */
export async function fetchLanguagesMock(): Promise<ApiResponse<Language[]>> {
  await delay(300);
  return {
    success: true,
    data: mockLanguages,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Mock: Fetch cities (with optional search)
 * GET /api/reference/cities?search=<query>
 */
export async function fetchCitiesMock(search?: string): Promise<ApiResponse<City[]>> {
  await delay(300);
  let cities = mockCities;
  
  if (search) {
    const searchLower = search.toLowerCase();
    cities = mockCities.filter(
      (city) =>
        city.name.toLowerCase().includes(searchLower) ||
        city.stateName.toLowerCase().includes(searchLower)
    );
  }
  
  return {
    success: true,
    data: cities,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Mock: Fetch states
 * GET /api/reference/states
 */
export async function fetchStatesMock(): Promise<ApiResponse<State[]>> {
  await delay(300);
  return {
    success: true,
    data: mockStates,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Mock: Fetch faiths
 * GET /api/reference/faiths
 */
export async function fetchFaithsMock(): Promise<ApiResponse<Faith[]>> {
  await delay(200);
  return {
    success: true,
    data: mockFaiths,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Mock: Fetch social categories
 * GET /api/reference/social-categories
 */
export async function fetchSocialCategoriesMock(): Promise<ApiResponse<SocialCategory[]>> {
  await delay(200);
  return {
    success: true,
    data: mockSocialCategories,
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// Mock Draft Management
// ============================================================================

// In-memory storage for drafts (in real app, this would be in database)
// Also persists to localStorage for testing purposes
const MOCK_DRAFT_STORAGE_KEY = 'saathi_mock_drafts';

// Initialize mock storage from localStorage if available
function getMockDraftStorage(): Map<string, { data: any; createdAt: string; updatedAt: string }> {
  const storage = new Map<string, { data: any; createdAt: string; updatedAt: string }>();

  // Check if we're in browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return storage;
  }

  try {
    const stored = localStorage.getItem(MOCK_DRAFT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.entries(parsed).forEach(([key, value]: [string, any]) => {
        storage.set(key, value);
      });
    }
  } catch (error) {
    console.warn('Failed to load mock drafts from localStorage:', error);
  }

  return storage;
}

// Save mock storage to localStorage
function saveMockDraftStorage(storage: Map<string, { data: any; createdAt: string; updatedAt: string }>) {
  try {
    const obj = Object.fromEntries(storage);
    localStorage.setItem(MOCK_DRAFT_STORAGE_KEY, JSON.stringify(obj));
  } catch (error) {
    console.warn('Failed to save mock drafts to localStorage:', error);
  }
}

// Get the mock draft storage (with persistence)
const mockDraftStorage = getMockDraftStorage();

/**
 * Mock: Save registration draft
 * POST /api/registration/draft
 */
export async function saveDraftMock(request: DraftSaveRequest): Promise<ApiResponse<DraftSaveResponse>> {
  await delay(500);
  
  // Generate a mock token
  const token = `draft_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const now = new Date().toISOString();
  
  // Store draft (in real app, this would be in database)
  mockDraftStorage.set(token, {
    data: request.draftData,
    createdAt: now,
    updatedAt: now,
  });
  
  // Persist to localStorage for testing
  saveMockDraftStorage(mockDraftStorage);
  
  // Set expiration to 30 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  return {
    success: true,
    data: {
      token,
      expiresAt: expiresAt.toISOString(),
    },
    timestamp: now,
  };
}

/**
 * Mock: Load registration draft
 * GET /api/registration/draft/:token
 */
export async function loadDraftMock(token: string): Promise<ApiResponse<DraftLoadResponse>> {
  await delay(300);
  
  // Reload from localStorage in case it was updated
  const storage = getMockDraftStorage();
  const draft = storage.get(token);
  
  if (!draft) {
    console.log('Draft not found in storage. Available tokens:', Array.from(storage.keys()));
    return {
      success: false,
      error: 'Draft not found or expired',
      timestamp: new Date().toISOString(),
    };
  }
  
  return {
    success: true,
    data: {
      draftData: draft.data,
      createdAt: draft.createdAt,
      updatedAt: draft.updatedAt,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Mock: Delete registration draft
 * DELETE /api/registration/draft/:token
 */
export async function deleteDraftMock(token: string): Promise<ApiResponse<void>> {
  await delay(200);
  
  const storage = getMockDraftStorage();
  const deleted = storage.delete(token);
  
  // Persist deletion to localStorage
  saveMockDraftStorage(storage);
  
  return {
    success: deleted,
    error: deleted ? undefined : 'Draft not found',
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// Mock File Upload
// ============================================================================

/**
 * Mock: Upload document
 * POST /api/upload/document
 */
export async function uploadDocumentMock(file: File): Promise<ApiResponse<FileUploadResponse>> {
  await delay(1000); // Simulate upload time
  
  // Generate mock file URL
  const filename = `doc_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const fileUrl = `/uploads/documents/${filename}`;
  
  return {
    success: true,
    data: {
      filename,
      fileUrl,
      fileSize: file.size,
      mimeType: file.type,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Mock: Upload logo
 * POST /api/upload/logo
 */
export async function uploadLogoMock(file: File): Promise<ApiResponse<FileUploadResponse>> {
  await delay(800); // Simulate upload time
  
  // Generate mock file URL
  const filename = `logo_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const fileUrl = `/uploads/logos/${filename}`;
  
  return {
    success: true,
    data: {
      filename,
      fileUrl,
      fileSize: file.size,
      mimeType: file.type,
    },
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// Mock Registration Submission
// ============================================================================

/**
 * Mock: Submit registration
 * POST /api/registration/submit
 */
export async function submitRegistrationMock(
  data: RegistrationFormData
): Promise<ApiResponse<{ registrationId: string; submittedAt: string }>> {
  await delay(1500); // Simulate submission time
  
  // Mock successful submission
  return {
    success: true,
    data: {
      registrationId: `REG-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  };
}
