import { cookies } from 'next/headers';

/**
 * Server-side API client for use in Server Components and getServerSideProps
 * Uses BACKEND_URL environment variable (internal network)
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Fetch data from backend API on the server
 * Automatically forwards session cookies for authentication
 */
export async function serverFetch<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  // Get session cookie from request
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('next-auth.session-token') ||
                        cookieStore.get('__Secure-next-auth.session-token');

  // Build URL with query parameters
  let url = `${BACKEND_URL}${endpoint}`;
  if (options?.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  // Prepare headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  // Forward session cookie if it exists
  if (sessionCookie) {
    headers['Cookie'] = `${sessionCookie.name}=${sessionCookie.value}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
      cache: options?.cache || 'no-store', // Default to no caching for dynamic data
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API Error ${response.status}: ${errorText || response.statusText}`
      );
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error('Server API error:', error);
    throw error;
  }
}

/**
 * Typed server API functions
 */
export const serverApi = {
  // Organizations
  organizations: {
    list: async (params?: { page?: number; limit?: number; status?: string }) =>
      serverFetch('/api/organizations', { params }),
    get: async (id: string) => serverFetch(`/api/organizations/${id}`),
  },

  // Health check
  health: async () => serverFetch('/health'),
};
