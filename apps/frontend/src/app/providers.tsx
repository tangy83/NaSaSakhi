'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Root providers component
 * Wraps the app with NextAuth SessionProvider for authentication
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider
      // Optional: Configure session refetch interval
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true} // Refetch when window regains focus
    >
      {children}
    </SessionProvider>
  );
}
