'use client';

// PARKED: Translation Review Interface
// This page is part of the Bhashini translation workflow.
// Translation feature is deferred. This route is intentionally unreachable from the UI.
// Do not link to this page until the translation feature is re-enabled.

import { use } from 'react';
import { useRouter } from 'next/navigation';

export default function TranslateOrgPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-center">
      <p className="font-heading text-2xl text-gray-700 font-medium mb-2">
        Feature Unavailable
      </p>
      <p className="font-body text-gray-500 mb-6">
        Translation review is not available in this version.
      </p>
      <button
        onClick={() => router.push(`/volunteer/organizations/${id}/review`)}
        className="font-body text-sm text-primary-600 hover:text-primary-700 underline"
      >
        Back to Review
      </button>
    </div>
  );
}
