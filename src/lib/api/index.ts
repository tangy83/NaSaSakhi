// Unified API Integration Layer
// Switches between mock and real API based on environment variable
// This allows easy testing with mocks while backend is being developed

// Check if we should use real API
const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === 'true';

// Import API functions
import * as clientApi from './client';
import * as mockApi from './mock';

// Re-export ApiResponse type
export type { ApiResponse } from './client';

// ============================================================================
// Reference Data APIs
// ============================================================================

export const fetchCategories = USE_REAL_API
  ? clientApi.fetchCategories
  : mockApi.fetchCategoriesMock;

export const fetchResources = USE_REAL_API
  ? clientApi.fetchResources
  : mockApi.fetchResourcesMock;

export const fetchLanguages = USE_REAL_API
  ? clientApi.fetchLanguages
  : mockApi.fetchLanguagesMock;

export const fetchCities = USE_REAL_API
  ? clientApi.fetchCities
  : mockApi.fetchCitiesMock;

export const fetchStates = USE_REAL_API
  ? clientApi.fetchStates
  : mockApi.fetchStatesMock;

export const fetchFaiths = USE_REAL_API
  ? clientApi.fetchFaiths
  : mockApi.fetchFaithsMock;

export const fetchSocialCategories = USE_REAL_API
  ? clientApi.fetchSocialCategories
  : mockApi.fetchSocialCategoriesMock;

// ============================================================================
// Draft Management APIs
// ============================================================================

export const saveDraft = USE_REAL_API
  ? clientApi.saveDraft
  : mockApi.saveDraftMock;

export const loadDraft = USE_REAL_API
  ? clientApi.loadDraft
  : mockApi.loadDraftMock;

export const deleteDraft = USE_REAL_API
  ? clientApi.deleteDraft
  : mockApi.deleteDraftMock;

// ============================================================================
// File Upload APIs
// ============================================================================

export const uploadDocument = USE_REAL_API
  ? clientApi.uploadDocument
  : mockApi.uploadDocumentMock;

export const uploadLogo = USE_REAL_API
  ? clientApi.uploadLogo
  : mockApi.uploadLogoMock;

// ============================================================================
// Registration APIs
// ============================================================================

export const submitRegistration = USE_REAL_API
  ? clientApi.submitRegistration
  : mockApi.submitRegistrationMock;

export const getRegistration = USE_REAL_API
  ? clientApi.getRegistration
  : () => {
      throw new Error('getRegistration not implemented in mocks');
    };

// ============================================================================
// Utility APIs
// ============================================================================

export const checkHealth = USE_REAL_API
  ? clientApi.checkHealth
  : async () => {
      return { success: true, data: { status: 'ok' }, timestamp: new Date().toISOString() };
    };

export const testDatabase = USE_REAL_API
  ? clientApi.testDatabase
  : async () => {
      return { success: true, data: { connected: true }, timestamp: new Date().toISOString() };
    };
