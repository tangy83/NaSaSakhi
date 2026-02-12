// API Client for Frontend to Backend Communication
// This allows the frontend to call the backend API when deployed separately

// API Base URL - should include /api at the end (e.g., http://localhost:3000/api)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

/**
 * Generic API call function
 * @param endpoint - API endpoint path (e.g., '/health' - without /api prefix)
 * @param options - Fetch options (method, headers, body, etc.)
 * @returns Promise with parsed JSON response
 */
export async function apiCall<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Include cookies for CORS
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

/**
 * GET request helper
 */
export async function apiGet<T = any>(endpoint: string): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, { method: 'GET' });
}

/**
 * POST request helper
 */
export async function apiPost<T = any>(
  endpoint: string,
  body?: any
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT request helper
 */
export async function apiPut<T = any>(
  endpoint: string,
  body?: any
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, { method: 'DELETE' });
}

/**
 * PATCH request helper
 */
export async function apiPatch<T = any>(
  endpoint: string,
  body?: any
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}

// Specific API functions for NASA Sakhi

/**
 * Health check endpoint
 */
export async function checkHealth() {
  return apiGet('/health');
}

/**
 * Database test endpoint
 */
export async function testDatabase() {
  return apiGet('/db-test');
}

/**
 * Fetch service categories
 */
export async function fetchCategories() {
  return apiGet('/reference/categories');
}

/**
 * Fetch service resources by category
 */
export async function fetchResources(categoryId?: string) {
  const query = categoryId ? `?categoryId=${categoryId}` : '';
  return apiGet(`/reference/resources${query}`);
}

/**
 * Fetch languages
 */
export async function fetchLanguages() {
  return apiGet('/reference/languages');
}

/**
 * Fetch cities
 */
export async function fetchCities(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return apiGet(`/reference/cities${query}`);
}

/**
 * Fetch states
 */
export async function fetchStates() {
  return apiGet('/reference/states');
}

/**
 * Fetch faiths/religious affiliations
 */
export async function fetchFaiths() {
  return apiGet('/reference/faiths');
}

/**
 * Fetch social categories
 */
export async function fetchSocialCategories() {
  return apiGet('/reference/social-categories');
}

/**
 * Save registration draft
 */
export async function saveDraft(data: any) {
  return apiPost('/registration/draft', data);
}

/**
 * Load registration draft
 */
export async function loadDraft(token: string) {
  return apiGet(`/registration/draft/${token}`);
}

/**
 * Delete registration draft
 */
export async function deleteDraft(token: string) {
  return apiDelete(`/registration/draft/${token}`);
}

/**
 * Submit registration
 */
export async function submitRegistration(data: any) {
  return apiPost('/registration/submit', data);
}

/**
 * Get registration by ID
 */
export async function getRegistration(id: string) {
  return apiGet(`/registration/${id}`);
}

/**
 * Upload document
 */
export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload/document`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Upload failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Upload logo
 */
export async function uploadLogo(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload/logo`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Upload failed: ${response.statusText}`);
  }

  return response.json();
}
