/**
 * NASA Sakhi - API Contract & Type Definitions
 *
 * This file defines the TypeScript interfaces shared between frontend and backend.
 * Both Sunitha (frontend) and Shashi (backend) MUST follow these exact types.
 *
 * DO NOT modify these types without coordinating with both frontend and backend developers.
 */

// ============================================================================
// API Response Wrapper
// ============================================================================

/**
 * Standard API response format for all endpoints
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================================================
// Registration Form Data (Complete Multi-Step Form)
// ============================================================================

/**
 * Complete registration form data structure
 * This is what the frontend sends to POST /api/registration/submit
 */
export interface RegistrationFormData {
  // Step 1: Organization Details
  organizationName: string;
  registrationType: RegistrationType;
  registrationNumber: string;
  yearEstablished: number;
  faithId?: string;
  socialCategoryIds?: string[];

  // Step 2: Contact Information
  primaryContact: ContactInfo;
  secondaryContact?: ContactInfo;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramHandle?: string;
  twitterHandle?: string;

  // Step 3: Service Categories & Resources
  categoryIds: string[];
  resourceIds: string[];

  // Step 4: Branch Locations
  branches: BranchInfo[];

  // Step 5: Language Preferences
  languageIds: string[];

  // Step 6: Document Uploads
  documents: DocumentInfo;
}

export type RegistrationType = 'NGO' | 'TRUST' | 'GOVERNMENT' | 'PRIVATE' | 'OTHER';

export interface ContactInfo {
  name: string;
  phone: string; // 10 digits, no formatting
  email: string;
}

export interface BranchInfo {
  addressLine1: string;
  addressLine2?: string;
  cityId: string;
  stateId: string;
  pinCode: string; // 6 digits
  latitude?: number;
  longitude?: number;
  timings?: BranchTiming[];
}

export interface BranchTiming {
  dayOfWeek: DayOfWeek;
  openTime?: string; // Format: "HH:MM" (24-hour)
  closeTime?: string; // Format: "HH:MM" (24-hour)
  isClosed: boolean;
}

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface DocumentInfo {
  registrationCertificateUrl: string;
  logoUrl?: string;
  additionalCertificateUrls?: string[];
}

// ============================================================================
// Reference Data Types (Dropdowns, Lists)
// ============================================================================

/**
 * Service Category (14 total: 7 for children, 7 for women)
 * GET /api/reference/categories
 */
export interface ServiceCategory {
  id: string;
  name: string;
  targetGroup: TargetGroup;
  displayOrder: number;
}

export type TargetGroup = 'CHILDREN' | 'WOMEN';

/**
 * Service Resource (76 total across all categories)
 * GET /api/reference/resources?categoryId=<id>
 */
export interface ServiceResource {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
}

/**
 * Language (30 Indian languages)
 * GET /api/reference/languages
 */
export interface Language {
  id: string;
  name: string;
  code: string; // ISO 639 language code (e.g., "hi", "en", "bn")
  isActive: boolean;
}

/**
 * City with state information
 * GET /api/reference/cities?search=<query>
 */
export interface City {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
}

/**
 * Indian State or Union Territory
 * GET /api/reference/states
 */
export interface State {
  id: string;
  name: string;
  code: string; // State code (e.g., "KA", "MH", "DL")
}

/**
 * Faith/Religious Affiliation (optional field)
 */
export interface Faith {
  id: string;
  name: string;
}

/**
 * Social Category (optional field)
 */
export interface SocialCategory {
  id: string;
  name: string;
}

// ============================================================================
// Draft Management
// ============================================================================

/**
 * Draft save request
 * POST /api/registration/draft
 */
export interface DraftSaveRequest {
  email?: string;
  draftData: Partial<RegistrationFormData>; // Can be incomplete
}

/**
 * Draft save response
 * POST /api/registration/draft
 */
export interface DraftSaveResponse {
  token: string;
  expiresAt: string; // ISO date string
}

/**
 * Draft load response
 * GET /api/registration/draft/:token
 */
export interface DraftLoadResponse {
  draftData: Partial<RegistrationFormData>;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// ============================================================================
// Registration Submission
// ============================================================================

/**
 * Registration submission response
 * POST /api/registration/submit
 */
export interface RegistrationSubmitResponse {
  organizationId: string;
  status: OrganizationStatus;
  message: string;
}

export type OrganizationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED';

/**
 * Get submission status
 * GET /api/registration/:id
 */
export interface RegistrationStatusResponse {
  organizationId: string;
  organizationName: string;
  status: OrganizationStatus;
  submittedAt: string; // ISO date string
  reviewedAt?: string; // ISO date string
  reviewNotes?: string;
}

// ============================================================================
// File Upload
// ============================================================================

/**
 * File upload response (for both documents and logos)
 * POST /api/upload/document
 * POST /api/upload/logo
 */
export interface FileUploadResponse {
  filename: string;
  fileUrl: string;
  fileSize: number; // bytes
  mimeType: string;
}

// ============================================================================
// Organization Data (Full)
// ============================================================================

/**
 * Complete organization data (after approval)
 * Used by mobile app API
 */
export interface Organization {
  id: string;
  name: string;
  registrationType: RegistrationType;
  registrationNumber: string;
  yearEstablished: number;
  websiteUrl?: string;
  status: OrganizationStatus;

  // Relationships
  contacts: ContactInformation[];
  branches: OrganizationBranch[];
  categories: ServiceCategory[];
  resources: ServiceResource[];
  languages: Language[];
  documents: Document[];

  createdAt: string;
  updatedAt: string;
}

export interface ContactInformation {
  id: string;
  isPrimary: boolean;
  name: string;
  phone: string;
  email: string;
  facebookUrl?: string;
  instagramHandle?: string;
  twitterHandle?: string;
}

export interface OrganizationBranch {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: City;
  state: State;
  pinCode: string;
  latitude?: number;
  longitude?: number;
  timings: BranchTiming[];
}

export interface Document {
  id: string;
  type: DocumentType;
  filename: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export type DocumentType = 'REGISTRATION_CERTIFICATE' | 'LOGO' | 'ADDITIONAL_CERTIFICATE';

// ============================================================================
// Search & Filtering (Mobile App API)
// ============================================================================

/**
 * Organization search/filter parameters
 * GET /api/organizations?city=<cityId>&category=<categoryId>&...
 */
export interface OrganizationSearchParams {
  city?: string;
  state?: string;
  category?: string;
  resource?: string;
  language?: string;
  page?: number;
  limit?: number;
}

/**
 * Paginated organization list response
 * GET /api/organizations
 */
export interface OrganizationListResponse {
  organizations: OrganizationSummary[];
  pagination: PaginationInfo;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  registrationType: RegistrationType;
  categories: string[]; // Category names
  branches: BranchSummary[];
  languages: string[]; // Language names
}

export interface BranchSummary {
  id: string;
  addressLine1: string;
  cityName: string;
  stateName: string;
  pinCode: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================================================
// Health Check
// ============================================================================

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  database: 'connected' | 'disconnected';
}

// ============================================================================
// Type Guards (Utility)
// ============================================================================

export function isApiError(response: ApiResponse<any>): response is ApiResponse<never> & { success: false } {
  return response.success === false;
}

export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: true; data: T } {
  return response.success === true && response.data !== undefined;
}

// ============================================================================
// Constants
// ============================================================================

export const REGISTRATION_TYPES: RegistrationType[] = [
  'NGO',
  'TRUST',
  'GOVERNMENT',
  'PRIVATE',
  'OTHER',
];

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

export const TARGET_GROUPS: TargetGroup[] = ['CHILDREN', 'WOMEN'];

export const ORGANIZATION_STATUSES: OrganizationStatus[] = [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'CLARIFICATION_REQUESTED',
];

// ============================================================================
// Validation Constants (Reference)
// ============================================================================

export const VALIDATION_RULES = {
  organizationName: {
    minLength: 3,
    maxLength: 100,
  },
  registrationNumber: {
    maxLength: 50,
  },
  yearEstablished: {
    min: 1800,
    max: new Date().getFullYear(),
  },
  phone: {
    length: 10,
    pattern: /^[6-9]\d{9}$/,
  },
  email: {
    maxLength: 100,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  pinCode: {
    length: 6,
    pattern: /^\d{6}$/,
  },
  address: {
    minLength: 10,
    maxLength: 200,
  },
  fileUpload: {
    document: {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    },
    logo: {
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/svg+xml'],
    },
  },
} as const;
