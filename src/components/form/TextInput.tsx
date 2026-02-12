'use client';

import { forwardRef, InputHTMLAttributes, useId } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const describedBy = error ? errorId : helperText ? helperId : undefined;

    return (
      <div className="space-y-1">
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {props.required && (
            <span className="text-error-500 ml-1" aria-label="required">*</span>
          )}
        </label>

        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          aria-required={props.required}
          className={`
            w-full min-h-[44px] px-4 py-3 border rounded-md text-base
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            placeholder:text-gray-400
            ${error ? 'border-error-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />

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

TextInput.displayName = 'TextInput';
