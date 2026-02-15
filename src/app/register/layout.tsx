'use client';

import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { SkipLink } from '@/components/ui/SkipLink';

// Simplified register layout for single-page form
// Progress tracking and draft saving now handled within individual pages
export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Skip Link for Keyboard Navigation */}
        <SkipLink />

        {/* Toast Container */}
        <ToastContainer />

        {/* Page Content */}
        <main id="main-content" className="w-full">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
