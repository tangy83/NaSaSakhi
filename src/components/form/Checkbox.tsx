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
              w-5 h-5 rounded border-gray-300
              text-primary-600 focus:ring-2 focus:ring-primary-500
              cursor-pointer
              ${className}
            `}
            {...props}
          />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <label 
            htmlFor={checkboxId}
            className="block text-sm font-medium text-gray-700 cursor-pointer"
          >
            {label}
          </label>
          {description && (
            <p 
              id={descriptionId}
              className="text-sm text-gray-500 mt-0.5"
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
