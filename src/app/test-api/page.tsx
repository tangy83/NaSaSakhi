'use client';

import { useState } from 'react';
import {
  fetchCategoriesMock,
  fetchResourcesMock,
  fetchLanguagesMock,
  fetchCitiesMock,
  fetchStatesMock,
  fetchFaithsMock,
  fetchSocialCategoriesMock,
  saveDraftMock,
  loadDraftMock,
  deleteDraftMock,
  uploadDocumentMock,
  uploadLogoMock,
} from '@/lib/api/mock';
import { DraftSaveRequest } from '@/types/api';

export default function TestApiPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});
  const [draftToken, setDraftToken] = useState<string>('');
  const [resumeUrl, setResumeUrl] = useState<string>('');

  // Test reference data functions
  const testCategories = async () => {
    setLoading('categories');
    try {
      const response = await fetchCategoriesMock();
      setResults((prev) => ({ ...prev, categories: response }));
    } catch (error) {
      setResults((prev) => ({ ...prev, categories: { error: String(error) } }));
    } finally {
      setLoading(null);
    }
  };

  const testResources = async (categoryId?: string) => {
    setLoading('resources');
    try {
      const response = await fetchResourcesMock(categoryId);
      setResults((prev) => ({ ...prev, resources: response }));
    } catch (error) {
      setResults((prev) => ({ ...prev, resources: { error: String(error) } }));
    } finally {
      setLoading(null);
    }
  };

  const testLanguages = async () => {
    setLoading('languages');
    try {
      const response = await fetchLanguagesMock();
      setResults((prev) => ({ ...prev, languages: response }));
    } catch (error) {
      setResults((prev) => ({ ...prev, languages: { error: String(error) } }));
    } finally {
      setLoading(null);
    }
  };

  const testCities = async (search?: string) => {
    setLoading('cities');
    try {
      const response = await fetchCitiesMock(search);
      setResults((prev) => ({ ...prev, cities: response }));
    } catch (error) {
      setResults((prev) => ({ ...prev, cities: { error: String(error) } }));
    } finally {
      setLoading(null);
    }
  };

  const testStates = async () => {
    setLoading('states');
    try {
      const response = await fetchStatesMock();
      setResults((prev) => ({ ...prev, states: response }));
    } catch (error) {
      setResults((prev) => ({ ...prev, states: { error: String(error) } }));
    } finally {
      setLoading(null);
    }
  };

  const testFaiths = async () => {
    setLoading('faiths');
    try {
      const response = await fetchFaithsMock();
      setResults((prev) => ({ ...prev, faiths: response }));
    } catch (error) {
      setResults((prev) => ({ ...prev, faiths: { error: String(error) } }));
    } finally {
      setLoading(null);
    }
  };

  const testSocialCategories = async () => {
    setLoading('socialCategories');
    try {
      const response = await fetchSocialCategoriesMock();
      setResults((prev) => ({ ...prev, socialCategories: response }));
    } catch (error) {
      setResults((prev) => ({ ...prev, socialCategories: { error: String(error) } }));
    } finally {
      setLoading(null);
    }
  };

  // Test draft functions
  const testSaveDraft = async () => {
    setLoading('saveDraft');
    try {
      const draftData: DraftSaveRequest = {
        email: 'test@example.com',
        draftData: {
          organizationName: 'Test Organization',
          registrationType: 'NGO',
          registrationNumber: 'TEST123',
          yearEstablished: 2020,
          primaryContact: {
            name: 'John Doe',
            phone: '9876543210',
            email: 'john@example.com',
          },
        },
      };
      const response = await saveDraftMock(draftData);
      if (response.success && response.data) {
        setDraftToken(response.data.token);
      }
      setResults((prev) => ({ ...prev, saveDraft: response }));
    } catch (error) {
      setResults((prev) => ({ ...prev, saveDraft: { error: String(error) } }));
    } finally {
      setLoading(null);
    }
  };

  const testLoadDraft = async () => {
    if (!draftToken) {
      alert('Please save a draft first to get a token');
      return;
    }
    setLoading('loadDraft');
    try {
      const response = await loadDraftMock(draftToken);
      setResults((prev) => ({ ...prev, loadDraft: response }));
    } catch (error) {
      setResults((prev) => ({ ...prev, loadDraft: { error: String(error) } }));
    } finally {
      setLoading(null);
    }
  };

  const testDeleteDraft = async () => {
    if (!draftToken) {
      alert('Please save a draft first to get a token');
      return;
    }
    setLoading('deleteDraft');
    try {
      const response = await deleteDraftMock(draftToken);
      setResults((prev) => ({ ...prev, deleteDraft: response }));
      if (response.success) {
        setDraftToken('');
      }
    } catch (error) {
      setResults((prev) => ({ ...prev, deleteDraft: { error: String(error) } }));
    } finally {
      setLoading(null);
    }
  };

  // Test file upload functions
  const testUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading('uploadDocument');
    try {
      const response = await uploadDocumentMock(file);
      setResults((prev) => ({ ...prev, uploadDocument: response }));
    } catch (error) {
      setResults((prev) => ({ ...prev, uploadDocument: { error: String(error) } }));
    } finally {
      setLoading(null);
      e.target.value = ''; // Reset input
    }
  };

  const testUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading('uploadLogo');
    try {
      const response = await uploadLogoMock(file);
      setResults((prev) => ({ ...prev, uploadLogo: response }));
    } catch (error) {
      setResults((prev) => ({ ...prev, uploadLogo: { error: String(error) } }));
    } finally {
      setLoading(null);
      e.target.value = ''; // Reset input
    }
  };

  const renderResult = (key: string) => {
    const result = results[key];
    if (!result) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 border border-gray-300 rounded-md">
        <h4 className="font-semibold text-gray-900 mb-2">{key}</h4>
        <pre className="text-xs overflow-auto max-h-96 bg-white p-3 rounded border">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="text-primary-500 hover:text-primary-600 underline mb-4 block">
            ← Back to Homepage
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock API Test Page</h1>
          <p className="text-gray-600">
            Test all mock API functions to verify they work correctly before using in forms
          </p>
        </div>

        {/* Reference Data Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reference Data APIs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={testCategories}
              disabled={loading === 'categories'}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {loading === 'categories' ? 'Loading...' : 'Test Categories'}
            </button>

            <button
              onClick={() => testResources()}
              disabled={loading === 'resources'}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {loading === 'resources' ? 'Loading...' : 'Test Resources (All)'}
            </button>

            <button
              onClick={() => testResources('cat-1')}
              disabled={loading === 'resources'}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {loading === 'resources' ? 'Loading...' : 'Test Resources (Cat-1)'}
            </button>

            <button
              onClick={testLanguages}
              disabled={loading === 'languages'}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {loading === 'languages' ? 'Loading...' : 'Test Languages'}
            </button>

            <button
              onClick={() => testCities()}
              disabled={loading === 'cities'}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {loading === 'cities' ? 'Loading...' : 'Test Cities (All)'}
            </button>

            <button
              onClick={() => testCities('Mumbai')}
              disabled={loading === 'cities'}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {loading === 'cities' ? 'Loading...' : 'Test Cities (Search)'}
            </button>

            <button
              onClick={testStates}
              disabled={loading === 'states'}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {loading === 'states' ? 'Loading...' : 'Test States'}
            </button>

            <button
              onClick={testFaiths}
              disabled={loading === 'faiths'}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {loading === 'faiths' ? 'Loading...' : 'Test Faiths'}
            </button>

            <button
              onClick={testSocialCategories}
              disabled={loading === 'socialCategories'}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {loading === 'socialCategories' ? 'Loading...' : 'Test Social Categories'}
            </button>
          </div>

          {/* Results */}
          {renderResult('categories')}
          {renderResult('resources')}
          {renderResult('languages')}
          {renderResult('cities')}
          {renderResult('states')}
          {renderResult('faiths')}
          {renderResult('socialCategories')}
        </div>

        {/* Draft Management Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Draft Management APIs</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={testSaveDraft}
                disabled={loading === 'saveDraft'}
                className="px-4 py-2 bg-success-500 text-white rounded-md hover:bg-success-600 disabled:opacity-50 transition-colors"
              >
                {loading === 'saveDraft' ? 'Saving...' : 'Test Save Draft'}
              </button>

              <button
                onClick={testLoadDraft}
                disabled={loading === 'loadDraft' || !draftToken}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors"
              >
                {loading === 'loadDraft' ? 'Loading...' : 'Test Load Draft'}
              </button>

              <button
                onClick={testDeleteDraft}
                disabled={loading === 'deleteDraft' || !draftToken}
                className="px-4 py-2 bg-error-500 text-white rounded-md hover:bg-error-600 disabled:opacity-50 transition-colors"
              >
                {loading === 'deleteDraft' ? 'Deleting...' : 'Test Delete Draft'}
              </button>
            </div>

            {draftToken && (
              <div className="p-3 bg-info-50 border border-info-500 rounded-md space-y-2">
                <p className="text-sm text-info-800">
                  <strong>Draft Token:</strong> {draftToken}
                </p>
                {resumeUrl && (
                  <div>
                    <p className="text-sm text-info-800 mb-2">
                      <strong>Resume Link:</strong>
                    </p>
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 underline break-all"
                    >
                      {resumeUrl}
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(resumeUrl);
                        alert('Resume link copied to clipboard!');
                      }}
                      className="ml-2 px-2 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() => {
                        window.open(resumeUrl, '_blank');
                      }}
                      className="ml-2 px-2 py-1 text-xs bg-success-500 text-white rounded hover:bg-success-600"
                    >
                      Open Resume Page
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Quick Test Resume Button */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-500 rounded-md">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>Quick Test:</strong> Save a draft and immediately test the resume page
              </p>
              <button
                onClick={async () => {
                  // Save a test draft first
                  const draftData: DraftSaveRequest = {
                    email: 'test@example.com',
                    draftData: {
                      organizationName: 'Test Organization',
                      registrationType: 'NGO',
                      registrationNumber: 'TEST123',
                      yearEstablished: 2020,
                      primaryContact: {
                        name: 'John Doe',
                        phone: '9876543210',
                        email: 'john@example.com',
                      },
                      categoryIds: ['cat-1', 'cat-2'],
                      resourceIds: ['res-1', 'res-2'],
                      branches: [
                        {
                          address: '123 Test Street',
                          city: 'Mumbai',
                          state: 'Maharashtra',
                          pinCode: '400001',
                        },
                      ],
                      languageIds: ['lang-1', 'lang-2'],
                    },
                  };
                  
                  try {
                    setLoading('saveDraft');
                    const response = await saveDraftMock(draftData);
                    if (response.success && response.data) {
                      const token = response.data.token;
                      const url = `${window.location.origin}/register/resume?token=${token}`;
                      // Open resume page in same tab
                      window.location.href = url;
                    } else {
                      alert('Failed to save draft. Please try again.');
                    }
                  } catch (error) {
                    alert('Error: ' + (error instanceof Error ? error.message : String(error)));
                  } finally {
                    setLoading(null);
                  }
                }}
                disabled={loading === 'saveDraft'}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 transition-colors"
              >
                {loading === 'saveDraft' ? 'Saving...' : 'Save & Test Resume Page'}
              </button>
            </div>

            {renderResult('saveDraft')}
            {renderResult('loadDraft')}
            {renderResult('deleteDraft')}
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">File Upload APIs</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Document Upload
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={testUploadDocument}
                disabled={loading === 'uploadDocument'}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Logo Upload
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.svg"
                onChange={testUploadLogo}
                disabled={loading === 'uploadLogo'}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50"
              />
            </div>

            {renderResult('uploadDocument')}
            {renderResult('uploadLogo')}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-info-50 border border-info-500 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-info-900 mb-2">How to Use</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-info-800">
            <li>Click any button to test the corresponding mock API function</li>
            <li>Results will appear below each section in JSON format</li>
            <li>All functions simulate network delay (200-1000ms)</li>
            <li>Draft functions: Save first to get a token, then test Load/Delete</li>
            <li>File uploads: Select a file to test upload functionality</li>
            <li>These mocks match the real API response format exactly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
