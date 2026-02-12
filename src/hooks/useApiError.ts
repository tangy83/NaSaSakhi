'use client';

import { useCallback } from 'react';
import { useToast } from '@/contexts/ToastContext';

/**
 * Custom hook for handling API errors consistently
 * Provides error detection, user-friendly messages, and retry logic
 */
export function useApiError() {
  const { showError, showWarning } = useToast();

  /**
   * Check if error is a network error
   */
  const isNetworkError = useCallback((error: unknown): boolean => {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return true;
    }
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes('network') ||
        message.includes('fetch') ||
        message.includes('connection') ||
        message.includes('timeout')
      );
    }
    return false;
  }, []);

  /**
   * Get user-friendly error message
   */
  const getErrorMessage = useCallback((error: unknown): string => {
    if (isNetworkError(error)) {
      return 'Connection lost. Please check your internet connection and try again.';
    }

    if (error instanceof Error) {
      // Check for specific error patterns
      const message = error.message.toLowerCase();
      
      if (message.includes('timeout')) {
        return 'Request timed out. Please try again.';
      }
      
      if (message.includes('500') || message.includes('server error')) {
        return 'Server error. Please try again in a moment.';
      }
      
      if (message.includes('404') || message.includes('not found')) {
        return 'Resource not found. Please refresh the page.';
      }
      
      if (message.includes('403') || message.includes('forbidden')) {
        return 'Access denied. Please check your permissions.';
      }
      
      if (message.includes('401') || message.includes('unauthorized')) {
        return 'Session expired. Please refresh the page.';
      }

      // Return the error message if it's user-friendly
      if (error.message.length < 100) {
        return error.message;
      }
    }

    return 'Something went wrong. Please try again.';
  }, [isNetworkError]);

  /**
   * Handle API error with toast notification
   */
  const handleError = useCallback(
    (error: unknown, customMessage?: string) => {
      const message = customMessage || getErrorMessage(error);
      const isNetwork = isNetworkError(error);

      // Log error for debugging
      console.error('API Error:', error);

      // Show error toast
      if (isNetwork) {
        showWarning(message, 5000);
      } else {
        showError(message, 5000);
      }

      return message;
    },
    [getErrorMessage, isNetworkError, showError, showWarning]
  );

  /**
   * Retry function with exponential backoff
   */
  const retry = useCallback(
    async <T>(
      fn: () => Promise<T>,
      maxRetries = 3,
      delay = 1000
    ): Promise<T> => {
      let lastError: unknown;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          return await fn();
        } catch (error) {
          lastError = error;

          // Don't retry on certain errors
          if (error instanceof Error) {
            const message = error.message.toLowerCase();
            if (message.includes('400') || message.includes('bad request')) {
              throw error; // Don't retry validation errors
            }
            if (message.includes('404') || message.includes('not found')) {
              throw error; // Don't retry not found errors
            }
          }

          // Wait before retrying (exponential backoff)
          if (attempt < maxRetries - 1) {
            const waitTime = delay * Math.pow(2, attempt);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            console.log(`Retry attempt ${attempt + 1}/${maxRetries}...`);
          }
        }
      }

      throw lastError;
    },
    []
  );

  return {
    handleError,
    isNetworkError,
    getErrorMessage,
    retry,
  };
}
