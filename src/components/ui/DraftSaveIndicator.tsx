'use client';

interface DraftSaveIndicatorProps {
  isDraftSaved: boolean;
  lastSaveTimestamp: Date | null;
  isSaving?: boolean;
}

export function DraftSaveIndicator({
  isDraftSaved,
  lastSaveTimestamp,
  isSaving = false,
}: DraftSaveIndicatorProps) {
  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
        <span>Saving draft...</span>
      </div>
    );
  }

  if (!isDraftSaved || !lastSaveTimestamp) {
    return null;
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex items-center gap-2 text-sm text-success-600">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      <span>Draft saved at {formatTime(lastSaveTimestamp)}</span>
    </div>
  );
}
