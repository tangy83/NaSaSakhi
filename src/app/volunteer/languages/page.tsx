'use client';

// Language Coverage Dashboard — parked, pending Phase 2 pipeline work
// Un-park when translation pipeline is live (Phase 2, Task B4)

import { useRouter } from 'next/navigation';

export default function LanguagesDashboardPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => router.push('/volunteer/dashboard')}
        className="font-body text-sm text-gray-500 hover:text-primary-600 mb-6 flex items-center gap-1"
      >
        ← Back to Dashboard
      </button>
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-8 py-16 text-center">
        <p className="font-heading text-xl text-gray-600 font-medium">Feature Unavailable</p>
        <p className="font-body text-sm text-gray-400 mt-2">
          Language coverage tracking will be available in a future update.
        </p>
      </div>
    </div>
  );
}
