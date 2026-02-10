import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

/**
 * API Client for browser-side requests
 * Uses NEXT_PUBLIC_API_URL environment variable
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
      timeout: 30000,
      withCredentials: true, // Send cookies for authentication
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add any custom headers
    this.client.interceptors.request.use(
      (config) => {
        // You can add auth tokens or other headers here
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            console.warn('Unauthorized - redirecting to login');
            window.location.href = '/auth/signin';
          }
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
          console.error('Forbidden - insufficient permissions');
        }

        // Handle 500 Server Error
        if (error.response?.status === 500) {
          console.error('Server error:', error.response.data);
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

/**
 * Typed API functions for common endpoints
 */
export const api = {
  // Authentication
  auth: {
    signIn: (credentials: { email: string; password: string }) =>
      apiClient.post('/auth/signin', credentials),
    signOut: () => apiClient.post('/auth/signout'),
    getSession: () => apiClient.get('/auth/session'),
  },

  // Organizations
  organizations: {
    list: (params?: { page?: number; limit?: number; status?: string }) =>
      apiClient.get('/organizations', { params }),
    get: (id: string) => apiClient.get(`/organizations/${id}`),
    create: (data: any) => apiClient.post('/organizations', data),
    update: (id: string, data: any) => apiClient.put(`/organizations/${id}`, data),
    delete: (id: string) => apiClient.delete(`/organizations/${id}`),
  },

  // Health check
  health: () => apiClient.get('/health'),
};
