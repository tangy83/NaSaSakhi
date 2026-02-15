'use client';

import { forwardRef, InputHTMLAttributes, useId } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const descriptionId = description ? `${checkboxId}-description` : undefined;
    
    return (
      <div className="flex items-start gap-3">
        <div
          className="flex items-center justify-center"
          style={{ minWidth: '44px', minHeight: '44px', padding: '12px' }}
        >
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            aria-describedby={descriptionId}
            className={`
              w-5 h-5 rounded border-2 border-gray-300
              text-primary-500 focus:ring-3 focus:ring-primary-100 focus:ring-offset-0
              cursor-pointer transition-colors duration-150
              checked:bg-primary-500 checked:border-primary-500
              hover:border-primary-300
              ${className}
            `}
            {...props}
          />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <label
            htmlFor={checkboxId}
            className="block text-sm font-medium font-body text-gray-700 cursor-pointer"
          >
            {label}
          </label>
          {description && (
            <p
              id={descriptionId}
              className="text-sm text-gray-500 font-body mt-0.5"
            >
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
