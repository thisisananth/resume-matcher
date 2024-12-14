// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

// API response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Generic API client
export const apiClient = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: {} as T, error: 'An error occurred' };
    }
  },

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return { data };
    } catch (error) {
      return { data: {} as T, error: 'An error occurred' };
    }
  },
}; 