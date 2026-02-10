'use client';

import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';

/**
 * Custom auth hook for client-side authentication
 * Wraps NextAuth's useSession with additional utility functions
 */
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    // User information
    user: session?.user,
    session,

    // Authentication state
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    isUnauthenticated: status === 'unauthenticated',

    // Auth functions
    signIn: nextAuthSignIn,
    signOut: nextAuthSignOut,
  };
}

/**
 * Get user role from session
 */
export function useUserRole(): string | null {
  const { user } = useAuth();
  return (user as any)?.role || null;
}

/**
 * Check if user has a specific role
 */
export function useHasRole(role: string): boolean {
  const userRole = useUserRole();
  return userRole === role;
}

/**
 * Check if user is admin or super admin
 */
export function useIsAdmin(): boolean {
  const userRole = useUserRole();
  return userRole === 'admin' || userRole === 'super_admin';
}
