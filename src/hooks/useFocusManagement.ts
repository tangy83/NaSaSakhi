'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook for managing focus after navigation or validation errors
 */
export function useFocusManagement() {
  const firstErrorRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  /**
   * Focus on the first error field
   */
  const focusFirstError = () => {
    // Find first field with aria-invalid="true"
    const firstError = document.querySelector<HTMLElement>(
      '[aria-invalid="true"], .border-error-500'
    );
    
    if (firstError) {
      firstErrorRef.current = firstError;
      // Try to focus the input/select directly, or the container
      const input = firstError.querySelector<HTMLElement>('input, select, textarea');
      if (input) {
        input.focus();
        // Scroll into view with smooth behavior
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  /**
   * Save current focus before navigation
   */
  const saveFocus = () => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  };

  /**
   * Restore focus after navigation
   */
  const restoreFocus = () => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  };

  /**
   * Focus on first form field in a container
   */
  const focusFirstField = (containerId?: string) => {
    const container = containerId 
      ? document.getElementById(containerId)
      : document.querySelector('form');
    
    if (container) {
      const firstField = container.querySelector<HTMLElement>(
        'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])'
      );
      if (firstField) {
        firstField.focus();
      }
    }
  };

  return {
    focusFirstError,
    saveFocus,
    restoreFocus,
    focusFirstField,
  };
}
