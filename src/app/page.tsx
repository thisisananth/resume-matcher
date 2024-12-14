'use client';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud, FiCheck } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface UploadResponse {
  message: string;
  filename: string;
  resume_text: string;
  session_id: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleUpload = async (uploadFile: File) => {
    setUploadStatus('uploading');
    try {
      // Check for internet connection
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      const formData = new FormData();
      formData.append('resume', uploadFile, uploadFile.name);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploadResume`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      }).catch(error => {
        if (!navigator.onLine) {
          throw new Error('Lost internet connection during upload. Please try again.');
        }
        throw error;
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data: UploadResponse = await response.json();
      localStorage.setItem('session_id', data.session_id);
      setUploadStatus('success');
      
      setTimeout(() => {
        router.push('/preferences');
      }, 1500);
    } catch (error) {
      console.error('Upload failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed. Please try again.');
      setUploadStatus('error');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0]);
      handleUpload(acceptedFiles[0]);
    }
  }, [handleUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="max-w-3xl mx-auto">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        Find Your Perfect Startup Match
      </h1>
      <div className="space-y-4 text-gray-600">
        <p className="text-xl">
          Upload your resume and let our AI match you with exciting startup opportunities
        </p>
        <div className="flex justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <FiCheck className="text-blue-500" />
            <span>Instant AI Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiCheck className="text-blue-500" />
            <span>Personalized Matches</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiCheck className="text-blue-500" />
            <span>Tailored Cover Letters</span>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Stand Out with Personalized Outreach
      </h2>
      <p className="text-gray-600 mb-6">
        We'll analyze your experience and generate tailored cover letters to help you connect directly with startup decision-makers. No more applying into the void - make meaningful connections that get noticed.
      </p>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${uploadStatus === 'success' ? 'bg-green-50 border-green-300' : ''}
          ${uploadStatus === 'error' ? 'bg-red-50 border-red-300' : ''}`}
      >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            {uploadStatus === 'success' ? (
              <>
                <FiCheck className="w-12 h-12 text-green-500" />
                <div>
                  <p className="text-green-600 font-medium">{file?.name}</p>
                  <p className="text-sm text-gray-500">Upload complete! Click or drag to replace</p>
                </div>
              </>
            ) : uploadStatus === 'uploading' ? (
              <>
                <div className="w-12 h-12 flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-blue-600 font-medium">Uploading {file?.name}...</p>
                  <p className="text-sm text-gray-500">This may take a moment</p>
                </div>
              </>
            ) : (
              <>
                <FiUploadCloud className="w-12 h-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                  </p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                </div>
                <p className="text-xs text-gray-400">Supported formats: PDF, DOC, DOCX</p>
              </>
            )}
          </div>
        </div>
      </div>

      {uploadStatus === 'error' && (
        <div className="text-center text-red-600 mb-4">
          {errorMessage}
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">What's Next?</h3>
          <div className="space-y-4 text-gray-600">
            <p>Our AI is analyzing your resume to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Identify your key skills and experience</li>
              <li>Match you with startups looking for your profile</li>
              <li>Suggest roles that align with your career goals</li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">
              You&apos;ll be redirected to customize your preferences and view your matches shortly.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Your data is secure and will only be used for matching purposes.
          <br />
          Support: help@startupjobexplorer.com
        </p>
      </div>
    </div>
  );
}