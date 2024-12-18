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
    } catch (err) {
      console.error('API error:', err);
      throw err;
    }
  },

  async post<T, B = Record<string, unknown>>(endpoint: string, body: B): Promise<ApiResponse<T>> {
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
    } catch (err) {
      console.error('API error:', err);
      throw err;
    }
  },
}; 