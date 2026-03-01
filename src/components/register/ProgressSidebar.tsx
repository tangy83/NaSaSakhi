'use client';

import Image from 'next/image';
import Link from 'next/link';

export interface SectionStatus {
  number: number;
  title: string;
  isRequired: boolean;
  isComplete: boolean;
  hasErrors: boolean;
}

export interface ProgressSidebarProps {
  sections: SectionStatus[];
  currentSection: number;
  onSectionClick: (sectionNumber: number) => void;
  onSaveDraft: () => void;
  isSaving?: boolean;
  className?: string;
}

export function ProgressSidebar({
  sections,
  currentSection,
  onSectionClick,
  onSaveDraft,
  isSaving = false,
  className = '',
}: ProgressSidebarProps) {
  // Calculate progress stats
  const completedCount = sections.filter((s) => s.isComplete).length;
  const totalCount = sections.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <aside
      className={`w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 ${className}`}
      aria-label="Registration progress"
    >
      {/* Logo + Home link */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <Image
            src="/assets/logo/coloured.png"
            alt="NaariSamata Saathi"
            width={48}
            height={48}
            className="flex-shrink-0"
          />
          <div>
            <h1 className="text-lg font-semibold text-gray-900 font-ui">NaariSamata Saathi</h1>
            <p className="text-xs text-gray-600">Registration</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Progress Stats */}
      <div className="p-6 border-b border-gray-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-semibold text-primary-600">
              {completedCount} of {totalCount}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div
              className="h-2 bg-gray-200 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${Math.round(progressPercentage)}% complete`}
            >
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-gray-600">
            {completedCount === totalCount
              ? 'All sections complete!'
              : `${totalCount - completedCount} section${totalCount - completedCount !== 1 ? 's' : ''} remaining`}
          </p>
        </div>
      </div>

      {/* Section List */}
      <nav
        className="flex-1 overflow-y-auto p-4"
        aria-label="Registration sections"
      >
        <ul className="space-y-2">
          {sections.map((section) => {
            const isCurrent = section.number === currentSection;

            return (
              <li key={section.number}>
                <button
                  type="button"
                  onClick={() => onSectionClick(section.number)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left
                             transition-colors duration-150
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                             ${
                               isCurrent
                                 ? 'bg-primary-100 border-2 border-primary-500'
                                 : section.hasErrors
                                 ? 'bg-error-50 hover:bg-error-100'
                                 : section.isComplete
                                 ? 'bg-success-50 hover:bg-success-100'
                                 : 'bg-gray-50 hover:bg-gray-100'
                             }`}
                  aria-label={`Section ${section.number}: ${section.title}${
                    section.isComplete ? ' (Complete)' : section.hasErrors ? ' (Has errors)' : ''
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {/* Status Icon */}
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                               text-xs font-semibold
                               ${
                                 section.hasErrors
                                   ? 'bg-error-500 text-white'
                                   : section.isComplete
                                   ? 'bg-success-500 text-white'
                                   : isCurrent
                                   ? 'bg-primary-600 text-white'
                                   : 'bg-gray-300 text-gray-700'
                               }`}
                    aria-hidden="true"
                  >
                    {section.isComplete ? (
                      <svg
                        className="w-4 h-4"
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
                    ) : section.hasErrors ? (
                      '!'
                    ) : (
                      section.number
                    )}
                  </div>

                  {/* Section Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm font-medium truncate
                                 ${isCurrent ? 'text-primary-900' : 'text-gray-900'}`}
                    >
                      {section.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {section.isRequired ? 'Required' : 'Optional'}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Save Draft Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSaving}
          className="w-full min-h-[44px] px-4 py-3 bg-gray-100 text-gray-700
                   rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2
                   focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-150
                   font-medium text-sm flex items-center justify-center gap-2
                   disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Save draft"
        >
          {isSaving ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              Save Draft
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
