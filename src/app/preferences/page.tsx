'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PreferencesResponse {
  message: string;
  session_id: string;
  preferences: {
    desired_roles: string[];
    industries: string[];
    work_locations: string[];
    company_stages: string[];
  }
}

type CompanyStage = 'seed' | 'seriesA' | 'seriesB' | 'seriesC' | 'public';
type Location = 'remote' | 'hybrid' | 'onsite';

type Preferences = {
  roles: string[];
  industries: string[];
  locations: Location[];
  companyStages: CompanyStage[];
};

export default function PreferencesPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get session_id from localStorage
  useEffect(() => {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      router.push('/'); // Redirect to upload page if no session
    }
  }, [router]);

  const [preferences, setPreferences] = useState<Preferences>({
    roles: [],
    industries: [],
    locations: [],
    companyStages: [],
  });

  const roles = ['Software Engineer', 'Product Manager', 'Data Scientist', 'Designer', 'Marketing', 'Sales', 'Operations'];
  const industries = ['Fintech', 'Healthcare', 'E-commerce', 'AI/ML', 'Enterprise', 'Consumer', 'Education'];
  const locations: { value: Location; label: string }[] = [
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'onsite', label: 'On-site' },
  ];
  const companyStages: { value: CompanyStage; label: string }[] = [
    { value: 'seed', label: 'Seed' },
    { value: 'seriesA', label: 'Series A' },
    { value: 'seriesB', label: 'Series B' },
    { value: 'seriesC', label: 'Series C+' },
    { value: 'public', label: 'Public' },
  ];

  const toggleSelection = <T extends keyof Preferences>(
    category: T,
    item: Preferences[T][number]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter(i => i !== item)
        : [...prev[category], item]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const sessionId = localStorage.getItem('session_id');
      if (!sessionId) {
        throw new Error('No session found. Please upload your resume first.');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/submitPreferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          session_id: sessionId,
          desired_roles: preferences.roles,
          industries: preferences.industries,
          work_locations: preferences.locations,
          company_stages: preferences.companyStages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit preferences');
      }

      const data: PreferencesResponse = await response.json();
      localStorage.setItem('preferences', JSON.stringify(data.preferences));
      
      // Navigate to matches page after successful submission
      router.push('/matches');
    } catch (error) {
      console.error('Submission failed:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit preferences');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Customize Your Job Preferences
        </h1>
        <p className="text-xl text-gray-600">
          Help us find the perfect startup opportunities for you
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Desired Roles</h2>
          <div className="flex flex-wrap gap-3">
            {roles.map(role => (
              <button
                key={role}
                onClick={() => toggleSelection('roles', role)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${preferences.roles.includes(role)
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Industries</h2>
          <div className="flex flex-wrap gap-3">
            {industries.map(industry => (
              <button
                key={industry}
                onClick={() => toggleSelection('industries', industry)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${preferences.industries.includes(industry)
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Work Location</h2>
          <div className="flex flex-wrap gap-3">
            {locations.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => toggleSelection('locations', value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${preferences.locations.includes(value)
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Company Stage</h2>
          <div className="flex flex-wrap gap-3">
            {companyStages.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => toggleSelection('companyStages', value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${preferences.companyStages.includes(value)
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium 
            ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'} 
            transition-colors`}
        >
          {isSubmitting ? 'Finding Matches...' : 'Find My Matches'}
        </button>

        {submitError && (
          <div className="mt-4 text-center text-red-600">
            {submitError}
          </div>
        )}
      </div>
    </div>
  );
}
