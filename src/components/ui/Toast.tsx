'use client';

import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  timestamp?: Date;
}

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
  duration?: number; // Auto-dismiss duration in milliseconds
}

export function ToastComponent({ toast, onDismiss, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(toast.id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, duration, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-success-50 border-success-500/30 text-success-600';
      case 'error':
        return 'bg-error-50 border-error-500/30 text-error-600';
      case 'warning':
        return 'bg-yellow-50 border-yellow-500/30 text-yellow-800';
      case 'info':
        return 'bg-primary-50 border-primary-500/30 text-primary-600';
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-md border shadow-lg
        w-full sm:min-w-[300px] sm:max-w-md
        ${getStyles()}
      `}
      style={{
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5" aria-hidden="true">{getIcon()}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{toast.message}</p>
        {toast.timestamp && (
          <p className="text-xs opacity-75 mt-1">
            {formatTimestamp(toast.timestamp)}
          </p>
        )}
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
        aria-label={`Dismiss ${toast.type} notification: ${toast.message}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
