'use client';

import { useState, useCallback } from 'react';
import { useApiError } from './useApiError';
import { useToast } from '@/contexts/ToastContext';

/**
 * Custom hook for making API calls with loading states and error handling
 */
export function useApiCall<T = any>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleError, retry } = useApiError();
  const { showSuccess } = useToast();

  /**
   * Execute API call with loading state and error handling
   */
  const execute = useCallback(
    async (
      apiCall: () => Promise<T>,
      options?: {
        showSuccess?: boolean;
        successMessage?: string;
        onSuccess?: (data: T) => void;
        onError?: (error: string) => void;
        retry?: boolean;
        retryCount?: number;
      }
    ): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const fn = options?.retry
          ? () => retry(apiCall, options.retryCount || 3)
          : apiCall;

        const data = await fn();

        // Show success message if requested
        if (options?.showSuccess && options.successMessage) {
          showSuccess(options.successMessage, 3000);
        }

        // Call success callback
        if (options?.onSuccess) {
          options.onSuccess(data);
        }

        return data;
      } catch (err) {
        const errorMessage = handleError(err);
        setError(errorMessage);

        // Call error callback
        if (options?.onError) {
          options.onError(errorMessage);
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, retry, showSuccess]
  );

  return {
    execute,
    isLoading,
    error,
  };
}
