'use client';

import { useToast } from '@/contexts/ToastContext';
import { ToastComponent } from './Toast';

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  // Debug: Log toast state
  if (toasts.length > 0) {
    console.log('🔔 ToastContainer: Rendering', toasts.length, 'toast(s)');
  }

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-[calc(100vw-1rem)] sm:max-w-md"
      aria-live="assertive"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastComponent toast={toast} onDismiss={dismissToast} />
        </div>
      ))}
    </div>
  );
}
