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
          className="block text-sm font-medium font-body text-gray-700"
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
            w-full min-h-[48px] px-4 py-3 border-2 rounded-lg text-base font-body
            text-gray-700 bg-white
            focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
            transition-colors duration-150
            ${error ? 'border-error-500 bg-error-50 focus:border-error-500 focus:ring-error-100' : 'border-gray-300'}
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
            className="text-sm text-error-500 font-body font-medium flex items-center gap-1"
          >
            <span aria-hidden="true">⚠️</span>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={helperId}
            className="text-sm text-gray-500 font-body"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';
