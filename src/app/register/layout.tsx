'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from '@/lib/hooks/useFormState';
import { ProgressIndicator } from '@/components/layout/ProgressIndicator';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { DraftSaveIndicator } from '@/components/ui/DraftSaveIndicator';
import { SkipLink } from '@/components/ui/SkipLink';

// Define 7 steps
const steps = [
  { number: 1, title: 'Organization', path: '/register/step1' },
  { number: 2, title: 'Contact', path: '/register/step2' },
  { number: 3, title: 'Services', path: '/register/step3' },
  { number: 4, title: 'Branches', path: '/register/step4' },
  { number: 5, title: 'Languages', path: '/register/step5' },
  { number: 6, title: 'Documents', path: '/register/step6' },
  { number: 7, title: 'Review', path: '/register/step7' },
];

// Inner component that uses hooks
function RegisterLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setSaveCallbacks, lastSaveTimestamp, isDraftSaved, isSaving, saveDraft } = useFormState();
  const { showSuccess, showError, showInfo } = useToast();

  // Extract step number from URL path (e.g., /register/step2 -> 2)
  const getStepFromPath = (path: string): number => {
    const match = path.match(/\/step(\d+)$/);
    return match ? parseInt(match[1], 10) : 1;
  };

  // Use URL-based step for display (step is now derived from URL in useFormState)
  const displayStep = getStepFromPath(pathname);

  // Set up toast callbacks for auto-save notifications
  useEffect(() => {
    console.log('🔧 Setting up toast callbacks for auto-save...');
    setSaveCallbacks(
      (timestamp: Date) => {
        console.log('🎉 Success callback triggered! Showing toast...', timestamp);
        const timeStr = timestamp.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
        showSuccess(`Draft saved at ${timeStr}`, 3000);
        console.log('✅ Toast should be visible now');
      },
      (error: string) => {
        console.log('❌ Error callback triggered:', error);
        // Only show error if it's not a network error (to avoid interrupting user)
        if (!error.includes('network') && !error.includes('fetch')) {
          showError(`Failed to save draft: ${error}`, 5000);
        }
      }
    );
    console.log('✅ Toast callbacks set up');
  }, [setSaveCallbacks, showSuccess, showError]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip Link for Keyboard Navigation */}
      <SkipLink />
      
      {/* Toast Container */}
      <ToastContainer />
      
      {/* Progress Indicator */}
      <ProgressIndicator steps={steps} currentStep={displayStep} />
      
      {/* Draft Save Indicator */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <DraftSaveIndicator
          isDraftSaved={isDraftSaved}
          lastSaveTimestamp={lastSaveTimestamp}
          isSaving={isSaving}
        />
        {/* Test Button - Remove in production */}
        <button
          type="button"
          onClick={async () => {
            console.log('🧪 Test button clicked - manually triggering save...');
            showInfo('Manually saving draft...', 2000);
            await saveDraft();
          }}
          disabled={isSaving}
          className="px-3 py-1.5 text-xs bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed min-h-[32px]"
        >
          {isSaving ? 'Saving...' : 'Test Save'}
        </button>
      </div>
      
      {/* Page Content */}
      <main id="main-content" className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}

// Outer component with ToastProvider
export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <RegisterLayoutContent>{children}</RegisterLayoutContent>
    </ToastProvider>
  );
}
