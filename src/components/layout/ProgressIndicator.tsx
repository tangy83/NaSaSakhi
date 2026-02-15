'use client';

interface Step {
  number: number;
  title: string;
  path: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  const progressPercentage = Math.round((currentStep / steps.length) * 100);
  
  return (
    <nav 
      className="w-full py-4 sm:py-6 bg-white border-b"
      aria-label="Registration progress"
    >
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        {/* Mobile: Simplified progress bar */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-ui font-semibold text-gray-900" aria-live="polite">
              Step {currentStep} of {steps.length}
            </p>
            <p className="text-xs font-ui text-gray-600">
              {steps[currentStep - 1]?.title}
            </p>
          </div>
          <div
            className="w-full bg-gray-200 rounded-full h-1.5"
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-label={`Registration progress: Step ${currentStep} of ${steps.length}, ${progressPercentage}% complete`}
          >
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Desktop: Full progress indicator */}
        <ol className="hidden sm:flex items-center justify-between" role="list">
          {steps.map((step, index) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const stepStatus = isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming';
            
            return (
              <li 
                key={step.number} 
                className="flex items-center flex-1"
                aria-current={isCurrent ? 'step' : undefined}
              >
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      font-ui font-bold text-sm transition-all duration-200
                      ${
                        isCompleted
                          ? 'bg-success-500 text-white' // Completed
                          : isCurrent
                          ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white animate-pulse' // Active
                          : 'bg-gray-100 border-2 border-gray-300 text-gray-500' // Inactive
                      }
                    `}
                    aria-label={`Step ${step.number}: ${step.title} - ${stepStatus}`}
                  >
                    {isCompleted ? (
                      <span aria-hidden="true">✓</span>
                    ) : (
                      <span aria-hidden="true">{step.number}</span>
                    )}
                  </div>

                  <p className={`text-xs font-ui mt-2 text-center ${
                    isCompleted
                      ? 'text-gray-600 font-medium'
                      : isCurrent
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-500 font-medium'
                  }`}>
                    {step.title}
                  </p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 mx-2 transition-colors duration-300
                      ${isCompleted ? 'bg-success-500' : 'bg-gray-200'}
                    `}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>

        <div className="hidden sm:block mt-4 text-center">
          <p
            className="text-sm font-body text-gray-600"
            aria-live="polite"
            aria-atomic="true"
          >
            Step {currentStep} of {steps.length} ({progressPercentage}% complete)
          </p>
        </div>
      </div>
    </nav>
  );
}
