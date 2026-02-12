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

// Mock Service Categories (14 total: 7 for children, 7 for women)
const mockCategories: ServiceCategory[] = [
  // Children categories
  { id: 'cat-1', name: 'Education & Learning', targetGroup: 'CHILDREN', displayOrder: 1 },
  { id: 'cat-2', name: 'Healthcare & Nutrition', targetGroup: 'CHILDREN', displayOrder: 2 },
  { id: 'cat-3', name: 'Child Protection', targetGroup: 'CHILDREN', displayOrder: 3 },
  { id: 'cat-4', name: 'Recreation & Sports', targetGroup: 'CHILDREN', displayOrder: 4 },
  { id: 'cat-5', name: 'Skill Development', targetGroup: 'CHILDREN', displayOrder: 5 },
  { id: 'cat-6', name: 'Mental Health Support', targetGroup: 'CHILDREN', displayOrder: 6 },
  { id: 'cat-7', name: 'Emergency Shelter', targetGroup: 'CHILDREN', displayOrder: 7 },
  // Women categories
  { id: 'cat-8', name: 'Education & Literacy', targetGroup: 'WOMEN', displayOrder: 8 },
  { id: 'cat-9', name: 'Healthcare Services', targetGroup: 'WOMEN', displayOrder: 9 },
  { id: 'cat-10', name: 'Legal Aid & Support', targetGroup: 'WOMEN', displayOrder: 10 },
  { id: 'cat-11', name: 'Skill Training & Employment', targetGroup: 'WOMEN', displayOrder: 11 },
  { id: 'cat-12', name: 'Financial Literacy', targetGroup: 'WOMEN', displayOrder: 12 },
  { id: 'cat-13', name: 'Mental Health & Counseling', targetGroup: 'WOMEN', displayOrder: 13 },
  { id: 'cat-14', name: 'Domestic Violence Support', targetGroup: 'WOMEN', displayOrder: 14 },
];

// Mock Service Resources (76 total, organized by category)
const mockResources: ServiceResource[] = [
  // Category 1: Education & Learning (Children)
  { id: 'res-1', categoryId: 'cat-1', name: 'Primary Education', description: 'Basic schooling for children' },
  { id: 'res-2', categoryId: 'cat-1', name: 'After-school Tutoring', description: 'Academic support programs' },
  { id: 'res-3', categoryId: 'cat-1', name: 'Digital Literacy', description: 'Computer and internet skills' },
  { id: 'res-4', categoryId: 'cat-1', name: 'Library Services', description: 'Reading and learning resources' },
  { id: 'res-5', categoryId: 'cat-1', name: 'Scholarship Programs', description: 'Financial aid for education' },
  // Category 2: Healthcare & Nutrition (Children)
  { id: 'res-6', categoryId: 'cat-2', name: 'Vaccination Programs', description: 'Immunization services' },
  { id: 'res-7', categoryId: 'cat-2', name: 'Nutrition Programs', description: 'Food and nutrition support' },
  { id: 'res-8', categoryId: 'cat-2', name: 'Health Checkups', description: 'Regular medical examinations' },
  { id: 'res-9', categoryId: 'cat-2', name: 'Dental Care', description: 'Oral health services' },
  { id: 'res-10', categoryId: 'cat-2', name: 'Vision Care', description: 'Eye health services' },
  // Category 3: Child Protection
  { id: 'res-11', categoryId: 'cat-3', name: 'Child Helpline', description: '24/7 support hotline' },
  { id: 'res-12', categoryId: 'cat-3', name: 'Legal Aid for Children', description: 'Legal support services' },
  { id: 'res-13', categoryId: 'cat-3', name: 'Counseling Services', description: 'Mental health support' },
  // Category 8: Education & Literacy (Women)
  { id: 'res-14', categoryId: 'cat-8', name: 'Adult Literacy Programs', description: 'Basic reading and writing' },
  { id: 'res-15', categoryId: 'cat-8', name: 'Digital Skills Training', description: 'Computer literacy' },
  { id: 'res-16', categoryId: 'cat-8', name: 'English Language Classes', description: 'English proficiency training' },
  // Category 9: Healthcare Services (Women)
  { id: 'res-17', categoryId: 'cat-9', name: 'Reproductive Health', description: 'Women health services' },
  { id: 'res-18', categoryId: 'cat-9', name: 'Maternal Care', description: 'Pregnancy and childbirth support' },
  { id: 'res-19', categoryId: 'cat-9', name: 'Cancer Screening', description: 'Early detection programs' },
  // Category 10: Legal Aid & Support (Women)
  { id: 'res-20', categoryId: 'cat-10', name: 'Legal Counseling', description: 'Legal advice and guidance' },
  { id: 'res-21', categoryId: 'cat-10', name: 'Court Representation', description: 'Legal representation' },
  { id: 'res-22', categoryId: 'cat-10', name: 'Documentation Help', description: 'Assistance with legal documents' },
  // Add more resources as needed...
];

// Mock Languages (30 Indian languages)
const mockLanguages: Language[] = [
  { id: 'lang-1', name: 'Hindi', code: 'hi', isActive: true },
  { id: 'lang-2', name: 'English', code: 'en', isActive: true },
  { id: 'lang-3', name: 'Bengali', code: 'bn', isActive: true },
  { id: 'lang-4', name: 'Telugu', code: 'te', isActive: true },
  { id: 'lang-5', name: 'Marathi', code: 'mr', isActive: true },
  { id: 'lang-6', name: 'Tamil', code: 'ta', isActive: true },
  { id: 'lang-7', name: 'Gujarati', code: 'gu', isActive: true },
  { id: 'lang-8', name: 'Kannada', code: 'kn', isActive: true },
  { id: 'lang-9', name: 'Malayalam', code: 'ml', isActive: true },
  { id: 'lang-10', name: 'Odia', code: 'or', isActive: true },
  { id: 'lang-11', name: 'Punjabi', code: 'pa', isActive: true },
  { id: 'lang-12', name: 'Assamese', code: 'as', isActive: true },
  { id: 'lang-13', name: 'Urdu', code: 'ur', isActive: true },
  { id: 'lang-14', name: 'Sanskrit', code: 'sa', isActive: true },
  { id: 'lang-15', name: 'Kashmiri', code: 'ks', isActive: true },
  // Add more languages...
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

// Mock Faith options
const mockFaiths: Faith[] = [
  { id: 'faith-1', name: 'Hinduism' },
  { id: 'faith-2', name: 'Islam' },
  { id: 'faith-3', name: 'Christianity' },
  { id: 'faith-4', name: 'Sikhism' },
  { id: 'faith-5', name: 'Buddhism' },
  { id: 'faith-6', name: 'Jainism' },
  { id: 'faith-7', name: 'Other' },
  { id: 'faith-8', name: 'No Preference' },
];

// Mock Social Categories
const mockSocialCategories: SocialCategory[] = [
  { id: 'social-1', name: 'Scheduled Caste (SC)' },
  { id: 'social-2', name: 'Scheduled Tribe (ST)' },
  { id: 'social-3', name: 'Other Backward Class (OBC)' },
  { id: 'social-4', name: 'General' },
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
const MOCK_DRAFT_STORAGE_KEY = 'nasa_sakhi_mock_drafts';

// Initialize mock storage from localStorage if available
function getMockDraftStorage(): Map<string, { data: any; createdAt: string; updatedAt: string }> {
  const storage = new Map<string, { data: any; createdAt: string; updatedAt: string }>();
  
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
