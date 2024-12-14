'use client';
import { useState, useEffect } from 'react';
import { FiBriefcase, FiMapPin, FiTrendingUp } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface MatchReason {
  experience_match: number;
  growth_match: number;
  industry_match: number;
  technical_match: number;
  reasoning: string;
}

interface JobMatch {
  company_name: string;
  company_description: string;
  final_score: number;
  match_reasons: MatchReason;
}

interface MatchesResponse {
  count: number;
  matches: {
    count: number;
    matches: JobMatch[];
  };
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const sessionId = localStorage.getItem('session_id');
        if (!sessionId) {
          router.push('/');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/matches?session_id=${sessionId}`, {
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch matches');
        }

        const data: MatchesResponse = await response.json();
        setMatches(data.matches.matches);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch matches');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [router]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <div className="animate-pulse">
          <h1 className="text-4xl font-bold mb-4">Finding Your Matches</h1>
          <p className="text-xl text-gray-600">Analyzing your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-xl text-gray-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Your Top Startup Matches
        </h1>
        <p className="text-xl text-gray-600">
          We've found {matches.length} matches based on your profile and preferences
        </p>
      </div>

      <div className="grid gap-6">
        {matches.map((match, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                <span className="text-xl font-bold text-blue-600">#{index + 1}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {match.company_name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Match Score</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {Math.round(match.final_score * 100)}%
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  {match.company_description}
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-medium mb-2">Why this matches you:</h3>
                  <p className="text-sm text-gray-600">{match.match_reasons.reasoning}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FiBriefcase className="text-blue-500" />
                    <span>Experience: {Math.round(match.match_reasons.experience_match * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiMapPin className="text-blue-500" />
                    <span>Technical: {Math.round(match.match_reasons.technical_match * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiTrendingUp className="text-blue-500" />
                    <span>Growth: {Math.round(match.match_reasons.growth_match * 100)}%</span>
                  </div>
                </div>

                <div className="mt-4">
                  <Link 
                    href={`/apply/${encodeURIComponent(match.company_name)}`}
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Connect & Apply
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button 
          onClick={() => router.push('/preferences')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Adjust Your Preferences
        </button>
      </div>
    </div>
  );
}