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
            className="w-full min-h-[48px] px-6 py-3 bg-primary-600 text-white rounded-lg font-ui font-semibold
                       shadow-md hover:shadow-lg hover:bg-primary-700 hover:-translate-y-0.5
                       active:bg-primary-800 active:translate-y-0 active:shadow-md
                       focus:outline-none focus:ring-4 focus:ring-primary-100 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                       transition-all duration-200"
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
              className="flex-1 min-h-[48px] px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-ui font-semibold
                         hover:bg-gray-50 hover:border-gray-400
                         active:bg-gray-100
                         focus:outline-none focus:ring-4 focus:ring-gray-100 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-150"
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
              className="flex-1 min-h-[48px] px-6 py-3 text-gray-700 border-2 border-gray-300 rounded-lg font-ui font-semibold
                         bg-white hover:bg-gray-50 hover:border-gray-400
                         focus:outline-none focus:ring-4 focus:ring-gray-100 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-150"
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
              className="min-h-[48px] px-6 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-ui font-semibold
                         hover:bg-gray-50 hover:border-gray-400
                         active:bg-gray-100
                         focus:outline-none focus:ring-4 focus:ring-gray-100 focus:ring-offset-2
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
              className="min-h-[48px] px-6 py-2.5 text-gray-700 hover:text-gray-900 font-ui font-semibold
                         border-2 border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-gray-400
                         focus:outline-none focus:ring-4 focus:ring-gray-100 focus:ring-offset-2
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
              className="min-h-[48px] px-8 py-2.5 bg-primary-600 text-white rounded-lg font-ui font-semibold
                         shadow-md hover:shadow-lg hover:bg-primary-700 hover:-translate-y-0.5
                         active:bg-primary-800 active:translate-y-0 active:shadow-md
                         focus:outline-none focus:ring-4 focus:ring-primary-100 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                         transition-all duration-200"
            >
              {isSubmitting ? 'Loading...' : isLastStep ? 'Submit' : `${nextLabel} →`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
