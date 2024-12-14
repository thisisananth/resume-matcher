import { apiClient } from './api';

export interface ApiResponse<T> {
  data: T;
}

export interface ResumeUploadResponse {
  id: string;
  status: string;
}

export interface PreferencesData {
  industry: string;
  role: string;
  startupStage: string;
}

export interface MatchResult {
  id: string;
  companyName: string;
  role: string;
  match: number;
}

export const resumeService = {
  // Stub for resume upload
  async uploadResume(file: File): Promise<ApiResponse<ResumeUploadResponse>> {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      // ... rest of the code
    }
  },

  // Stub for preferences submission
  async savePreferences(preferences: PreferencesData): Promise<ApiResponse<void>> {
    return apiClient.post('/preferences', preferences);
  },

  // Stub for getting matches
  async getMatches(): Promise<ApiResponse<MatchResult[]>> {
    // Mock data for development
    return {
      data: [
        {
          id: '1',
          companyName: 'TechStart',
          role: 'Frontend Developer',
          match: 85,
        },
        // Add more mock matches...
      ],
    };
  },
}; 