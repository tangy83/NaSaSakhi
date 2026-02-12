'use client';

interface FormNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  onSaveDraft?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  nextLabel?: string;
}

export function FormNavigation({
  onBack,
  onNext,
  onSaveDraft,
  isFirstStep,
  isLastStep,
  isSubmitting,
  nextLabel = 'Next',
}: FormNavigationProps) {
  return (
    <div className="pt-6 border-t border-gray-200">
      {/* Mobile: Stack buttons vertically */}
      <div className="flex flex-col sm:hidden gap-3">
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
            aria-label={isLastStep ? 'Submit registration form' : `Continue to ${nextLabel}`}
            className="w-full min-h-[44px] px-6 py-3 bg-primary-500 text-white rounded-md
                       hover:bg-primary-600 active:bg-primary-700
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-150 font-medium"
          >
            {isSubmitting ? 'Loading...' : isLastStep ? 'Submit Registration' : `${nextLabel} →`}
          </button>
        )}
        
        <div className="flex gap-3">
          {!isFirstStep && onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              aria-label="Go back to previous step"
              className="flex-1 min-h-[44px] px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md
                         hover:bg-gray-50 active:bg-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-150 font-medium"
            >
              ← Back
            </button>
          )}
          
          {onSaveDraft && (
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isSubmitting}
              aria-label="Save current progress as draft"
              className="flex-1 min-h-[44px] px-6 py-3 text-gray-700 border border-gray-300 rounded-md
                         hover:bg-gray-50 hover:border-gray-400
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-150 font-medium"
            >
              Save Draft
            </button>
          )}
        </div>
      </div>

      {/* Desktop: Horizontal layout */}
      <div className="hidden sm:flex items-center justify-between">
        <div>
          {!isFirstStep && onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              aria-label="Go back to previous step"
              className="min-h-[44px] px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md
                         hover:bg-gray-50 active:bg-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-150"
            >
              ← Back
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {onSaveDraft && (
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isSubmitting}
              aria-label="Save current progress as draft"
              className="min-h-[44px] px-6 py-2 text-gray-700 hover:text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-150"
            >
              Save Draft
            </button>
          )}

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              disabled={isSubmitting}
              aria-label={isLastStep ? 'Submit registration form' : `Continue to ${nextLabel}`}
              className="min-h-[44px] px-8 py-2 bg-primary-500 text-white rounded-md
                         hover:bg-primary-600 active:bg-primary-700
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-150"
            >
              {isSubmitting ? 'Loading...' : isLastStep ? 'Submit' : `${nextLabel} →`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
