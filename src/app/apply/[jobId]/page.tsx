'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiCopy, FiMail } from 'react-icons/fi';

interface Contact {
  name: string;
  role: string;
  email: string;
}

interface OutreachResponse {
  success: boolean;
  outreach_package: {
    company_name: string;
    contacts: Contact[];
    cover_letter: string;
  }
}

export default function ApplyPage({ params }: { params: { jobId: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const fetchOutreachPackage = async () => {
      const sessionId = localStorage.getItem('session_id');
      if (!sessionId) {
        router.push('/');
        return;
      }

      try {
        const decodedCompanyName = decodeURIComponent(params.jobId);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/outreach`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
          body: JSON.stringify({
            session_id: sessionId,
            company_name: decodedCompanyName
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch outreach package');
        }

        const data: OutreachResponse = await response.json();
        
        if (data.success) {
          setCompanyName(data.outreach_package.company_name);
          setContacts(data.outreach_package.contacts);
          setCoverLetter(data.outreach_package.cover_letter);
        } else {
          throw new Error('Failed to generate outreach package');
        }
      } catch (error) {
        console.error('Failed to fetch outreach package:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch outreach package');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.jobId) {
      fetchOutreachPackage();
    }
  }, [params.jobId, router]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleEmail = (email: string) => {
    const subject = encodeURIComponent(`Application for position at ${companyName}`);
    const body = encodeURIComponent(coverLetter);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="animate-pulse">
          <h1 className="text-4xl font-bold mb-4">Generating Your Outreach Package</h1>
          <p className="text-xl text-gray-600">Customizing your application materials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-3">Connect & Apply</h1>
      <p className="text-gray-600 mb-6">
        Use this cover letter to reach out to key contacts at the company. 
        You can edit the letter, copy it, or directly connect via email.
      </p>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Cover Letter</h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiCopy className="w-4 h-4" />
                {copySuccess ? 'Copied!' : 'Copy Text'}
              </button>
            </div>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full h-96 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Key Contacts</h2>
            <div className="space-y-4">
              {contacts.map((contact, index) => (
                <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                  <h3 className="font-medium">{contact.name}</h3>
                  <p className="text-sm text-gray-600">{contact.role}</p>
                  <div className="mt-2 space-y-2">
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {contact.email}
                    </a>
                    <div>
                      <button
                        onClick={() => handleEmail(contact.email)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <FiMail className="w-4 h-4" />
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
} 