'use client';

import { ReactNode, useRef, useEffect } from 'react';

export interface AccordionSectionProps {
  sectionNumber: number;
  title: string;
  isRequired: boolean;
  isOpen: boolean;
  isComplete: boolean;
  hasErrors: boolean;
  onToggle: () => void;
  onValidate?: () => Promise<boolean> | boolean;
  onSkip?: () => void;
  children: ReactNode;
  className?: string;
}

export function AccordionSection({
  sectionNumber,
  title,
  isRequired,
  isOpen,
  isComplete,
  hasErrors,
  onToggle,
  onValidate,
  onSkip,
  children,
  className = '',
}: AccordionSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionId = `section-${sectionNumber}`;
  const headerId = `${sectionId}-header`;
  const contentId = `${sectionId}-content`;

  // Auto-scroll to section when opened
  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Small delay to allow animation to start
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [isOpen]);

  // Determine border color based on state
  const getBorderColor = () => {
    if (hasErrors) return 'border-error-500';
    if (isComplete) return 'border-success-500';
    return 'border-gray-300';
  };

  // Determine background color based on state
  const getBackgroundColor = () => {
    if (hasErrors) return 'bg-error-50';
    if (isComplete) return 'bg-success-50';
    return 'bg-gray-50';
  };

  // Handle validate and continue
  const handleValidateAndContinue = async () => {
    if (onValidate) {
      const isValid = await onValidate();
      if (isValid) {
        // Section is valid, close this and open next
        onToggle();
      }
      // If invalid, stay open and show errors
    } else {
      // No validation function, just close
      onToggle();
    }
  };

  // Handle skip
  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
    onToggle();
  };

  return (
    <div
      ref={contentRef}
      className={`border-2 ${getBorderColor()} rounded-lg overflow-hidden transition-all duration-200 ${className}`}
      role="region"
      aria-labelledby={headerId}
    >
      {/* Header */}
      <button
        id={headerId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className={`w-full px-4 sm:px-6 py-4 flex items-center justify-between gap-4
                   ${getBackgroundColor()} hover:opacity-90 transition-opacity duration-150
                   focus:outline-none focus:ring-4 focus:ring-primary-100 focus:ring-offset-2`}
      >
        {/* Left side: Number/Icon + Title */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Number badge or checkmark */}
          <div
            className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                       font-semibold text-sm sm:text-base
                       ${
                         hasErrors
                           ? 'bg-error-500 text-white'
                           : isComplete
                           ? 'bg-success-500 text-white'
                           : 'bg-primary-500 text-white'
                       }`}
            aria-hidden="true"
          >
            {isComplete ? (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : hasErrors ? (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              sectionNumber
            )}
          </div>

          {/* Title */}
          <div className="text-left min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              {isRequired ? 'Required' : 'Optional'}
              {isComplete && <span className="ml-2 text-success-600 font-medium">✓ Complete</span>}
              {hasErrors && <span className="ml-2 text-error-600 font-medium">⚠ Has errors</span>}
            </p>
          </div>
        </div>

        {/* Right side: Expand/collapse icon */}
        <div className="flex-shrink-0">
          <svg
            className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={headerId}
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 sm:px-6 py-6 bg-white border-t-2 border-gray-200">
          {/* Section content */}
          {children}

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 border-t border-gray-200">
            {/* Validate & Continue button */}
            <button
              type="button"
              onClick={handleValidateAndContinue}
              className="flex-1 sm:flex-none min-h-[44px] px-6 py-3 bg-primary-600 text-white
                       rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4
                       focus:ring-primary-100 focus:ring-offset-2 transition-colors duration-150
                       font-semibold text-sm sm:text-base flex items-center justify-center gap-2"
              aria-label={`Validate and continue from ${title}`}
            >
              Validate &amp; Continue
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Skip button for optional sections */}
            {!isRequired && onSkip && (
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 sm:flex-none min-h-[44px] px-6 py-3 border-2 border-gray-300
                         text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4
                         focus:ring-gray-100 focus:ring-offset-2 transition-colors duration-150
                         font-medium text-sm sm:text-base"
                aria-label={`Skip ${title} section`}
              >
                Skip this section
              </button>
            )}

            {/* Collapse button */}
            <button
              type="button"
              onClick={onToggle}
              className="flex-1 sm:flex-none min-h-[44px] px-6 py-3 border-2 border-primary-300
                       text-primary-600 rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-4
                       focus:ring-primary-100 focus:ring-offset-2 transition-colors duration-150
                       font-medium text-sm sm:text-base"
              aria-label={`Collapse ${title} section`}
            >
              Collapse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
