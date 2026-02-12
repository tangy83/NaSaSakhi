'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useFormState } from '@/lib/hooks/useFormState';
import { loadDraft } from '@/lib/api';
import { DraftLoadResponse } from '@/types/api';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/ui/ToastContainer';

// Helper function to determine last completed step from draft data
function getLastCompletedStep(draftData: Partial<any>): number {
  // Step 1: Organization Details
  if (
    draftData.organizationName &&
    draftData.registrationType &&
    draftData.registrationNumber &&
    draftData.yearEstablished
  ) {
    // Step 2: Contact Information
    if (
      draftData.primaryContact?.name &&
      draftData.primaryContact?.phone &&
      draftData.primaryContact?.email
    ) {
      // Step 3: Services
      if (draftData.categoryIds && draftData.categoryIds.length > 0 && draftData.resourceIds && draftData.resourceIds.length > 0) {
        // Step 4: Branches
        if (draftData.branches && draftData.branches.length > 0) {
          // Step 5: Languages
          if (draftData.languageIds && draftData.languageIds.length > 0) {
            // Step 6: Documents
            if (draftData.documents?.registrationCertificateUrl) {
              return 7; // All steps completed, go to review
            }
            return 6; // Documents step
          }
          return 5; // Languages step
        }
        return 4; // Branches step
      }
      return 3; // Services step
    }
    return 2; // Contact step
  }
  return 1; // Organization step
}

// Inner component that uses hooks
function ResumePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loadDraftFromBackend, clearDraft } = useFormState();
  const { showError, showSuccess } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [draftData, setDraftData] = useState<DraftLoadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isResuming, setIsResuming] = useState(false);

  const token = searchParams.get('token');

  // Load draft on mount
  useEffect(() => {
    if (!token) {
      setError('No token provided. Please use a valid draft resume link.');
      setIsLoading(false);
      return;
    }

    const fetchDraft = async () => {
      try {
        console.log('📥 Loading draft with token:', token);
        const response = await loadDraft(token);

        if (response.success && response.data) {
          console.log('✅ Draft loaded successfully:', response.data);
          setDraftData(response.data);
          setError(null);
        } else {
          const errorMessage = response.error || 'Draft not found or expired';
          console.error('❌ Failed to load draft:', errorMessage);
          setError(errorMessage);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load draft';
        console.error('❌ Error loading draft:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDraft();
  }, [token]);

  // Handle continue draft
  const handleContinueDraft = async () => {
    if (!draftData || !token) return;

    setIsResuming(true);
    try {
      console.log('🔄 Resuming draft...');
      
      // Load draft data into form state
      const lastStep = getLastCompletedStep(draftData.draftData);
      console.log('📍 Last completed step:', lastStep);
      
      await loadDraftFromBackend(draftData.draftData);
      
      // Navigate to the last completed step
      router.push(`/register/step${lastStep}`);
      
      showSuccess('Draft loaded successfully. You can continue from where you left off.', 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resume draft';
      console.error('❌ Error resuming draft:', err);
      showError(errorMessage, 5000);
    } finally {
      setIsResuming(false);
    }
  };

  // Handle start fresh
  const handleStartFresh = () => {
    // Clear draft without navigating (we'll navigate manually)
    clearDraft(false);
    router.push('/register/step1');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Loading your draft...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-error-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Draft Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={handleStartFresh}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Start New Registration
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Draft loaded successfully
  if (draftData) {
    const lastStep = getLastCompletedStep(draftData.draftData);
    const progress = Math.round((lastStep / 7) * 100);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-12">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Resume Your Registration</h1>
            <p className="text-sm sm:text-base text-gray-600">You have a saved draft. Continue from where you left off or start fresh.</p>
          </div>

          {/* Draft Preview Card */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Saved Draft</h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Created: {formatDate(draftData.createdAt)}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Last updated: {formatDate(draftData.updatedAt)}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xl sm:text-2xl font-bold text-primary-600">{progress}%</div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Completed up to Step {lastStep} of 7
              </p>
            </div>

            {/* Draft Summary */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Draft Summary:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                {draftData.draftData.organizationName && (
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Organization: {draftData.draftData.organizationName}
                  </li>
                )}
                {draftData.draftData.primaryContact?.name && (
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Contact: {draftData.draftData.primaryContact.name}
                  </li>
                )}
                {draftData.draftData.categoryIds && draftData.draftData.categoryIds.length > 0 && (
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Services: {draftData.draftData.categoryIds.length} categories selected
                  </li>
                )}
                {draftData.draftData.branches && draftData.draftData.branches.length > 0 && (
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Branches: {draftData.draftData.branches.length} location(s)
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleContinueDraft}
              disabled={isResuming}
              className="w-full min-h-[44px] px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isResuming ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Continue Draft (Step {lastStep})
                </>
              )}
            </button>
            <button
              onClick={handleStartFresh}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Start Fresh Registration
            </button>
          </div>

          {/* Info Note */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your draft will be saved automatically as you progress. You can return to this link anytime within 30 days.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Outer component with ToastProvider
export default function ResumePage() {
  return (
    <ToastProvider>
      <ToastContainer />
      <ResumePageContent />
    </ToastProvider>
  );
}
