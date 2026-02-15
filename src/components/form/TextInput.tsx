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
          className="block text-sm font-medium font-body text-gray-700"
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
            w-full min-h-[48px] px-4 py-3 border-2 rounded-lg text-base font-body
            text-gray-700 placeholder:text-gray-400
            focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
            transition-colors duration-150
            ${error ? 'border-error-500 bg-error-50 focus:border-error-500 focus:ring-error-100' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />

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

TextInput.displayName = 'TextInput';
