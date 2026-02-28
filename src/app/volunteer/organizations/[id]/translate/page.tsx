'use client';

// Translation Review Interface — parked, pending Phase 2 pipeline work
// Un-park when Bhashini integration is ready (Phase 2, Task B3)

import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function TranslateOrgPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => router.push(`/volunteer/organizations/${id}/review`)}
        className="font-body text-sm text-gray-500 hover:text-primary-600 mb-6 flex items-center gap-1"
      >
        ← Back to Review
      </button>
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-8 py-16 text-center">
        <p className="font-heading text-xl text-gray-600 font-medium">Feature Unavailable</p>
        <p className="font-body text-sm text-gray-400 mt-2">
          Translation review will be available in a future update.
        </p>
      </div>
    </div>
  );
}
