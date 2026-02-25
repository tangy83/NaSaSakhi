'use client';

// PARKED: Language Coverage Dashboard
// This page is part of the translation workflow (Bhashini integration).
// Translation feature is deferred. This route is intentionally unreachable from the UI.
// Do not link to this page until the translation feature is re-enabled.

import { useRouter } from 'next/navigation';

export default function LanguagesDashboardPage() {
  const router = useRouter();
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-center">
      <p className="font-heading text-2xl text-gray-700 font-medium mb-2">
        Feature Unavailable
      </p>
      <p className="font-body text-gray-500 mb-6">
        The language coverage dashboard is not available in this version.
      </p>
      <button
        onClick={() => router.push('/volunteer/dashboard')}
        className="font-body text-sm text-primary-600 hover:text-primary-700 underline"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
