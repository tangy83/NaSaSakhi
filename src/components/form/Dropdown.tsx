'use client';

import { forwardRef, SelectHTMLAttributes, useId } from 'react';

interface Option {
  value: string;
  label: string;
}

interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  helperText?: string;
  placeholder?: string;
}

export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ label, options, error, helperText, placeholder, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;
    const describedBy = error ? errorId : helperText ? helperId : undefined;

    return (
      <div className="space-y-1">
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {props.required && (
            <span className="text-error-500 ml-1" aria-label="required">*</span>
          )}
        </label>

        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          aria-required={props.required}
          className={`
            w-full min-h-[44px] px-4 py-3 border rounded-md text-base
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-error-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p 
            id={errorId}
            role="alert"
            aria-live="polite"
            className="text-sm text-error-500 flex items-center gap-1"
          >
            <span aria-hidden="true">⚠️</span>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p 
            id={helperId}
            className="text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';
