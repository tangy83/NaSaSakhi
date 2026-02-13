'use client';

import { useEffect, useState } from 'react';

export default function DiagnosticPage() {
  const [apiTests, setApiTests] = useState({
    health: 'pending',
    categories: 'pending',
    languages: 'pending',
  });

  useEffect(() => {
    // Test health endpoint
    fetch('/api/health')
      .then(res => res.json())
      .then(() => setApiTests(prev => ({ ...prev, health: 'success' })))
      .catch(() => setApiTests(prev => ({ ...prev, health: 'failed' })));

    // Test categories endpoint
    fetch('/api/reference/categories')
      .then(res => res.json())
      .then(() => setApiTests(prev => ({ ...prev, categories: 'success' })))
      .catch(() => setApiTests(prev => ({ ...prev, categories: 'failed' })));

    // Test languages endpoint
    fetch('/api/reference/languages')
      .then(res => res.json())
      .then(() => setApiTests(prev => ({ ...prev, languages: 'success' })))
      .catch(() => setApiTests(prev => ({ ...prev, languages: 'failed' })));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Diagnostic Page</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment</h2>
          <p><strong>Mode:</strong> {process.env.NODE_ENV}</p>
          <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not set'}</p>
          <p><strong>App URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">API Endpoint Tests</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Health Check:</span>
              <span className={`px-3 py-1 rounded ${
                apiTests.health === 'success' ? 'bg-green-100 text-green-800' :
                apiTests.health === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {apiTests.health}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Categories API:</span>
              <span className={`px-3 py-1 rounded ${
                apiTests.categories === 'success' ? 'bg-green-100 text-green-800' :
                apiTests.categories === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {apiTests.categories}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Languages API:</span>
              <span className={`px-3 py-1 rounded ${
                apiTests.languages === 'success' ? 'bg-green-100 text-green-800' :
                apiTests.languages === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {apiTests.languages}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <a
            href="/register/step1"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Registration Step 1
          </a>
        </div>
      </div>
    </div>
  );
}
