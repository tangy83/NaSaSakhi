// Authentication utilities
// Helper functions for authentication

import { getServerSession } from 'next-auth/next';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';

// Dynamic import to avoid loading Prisma during build phase
async function getPrisma() {
  const prismaModule = await import('@/lib/prisma');
  return prismaModule.default;
}

// Create auth options function (same as in route handler)
async function getAuthOptions(): Promise<NextAuthOptions> {
  const prisma = await getPrisma();
  
  return {
    adapter: PrismaAdapter(prisma) as any,
    
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
          volunteerId: { label: 'Volunteer ID', type: 'text' },
        },
        async authorize(credentials) {
          if (!credentials?.password) {
            throw new Error('Password is required');
          }

          const prisma = await getPrisma();
          let user;

          if (credentials.volunteerId) {
            user = await prisma.user.findUnique({
              where: { volunteerId: credentials.volunteerId },
            });

            if (!user) {
              throw new Error('Invalid Volunteer ID or password');
            }
          } else if (credentials.email) {
            user = await prisma.user.findUnique({
              where: { email: credentials.email },
            });

            if (!user) {
              throw new Error('Invalid email or password');
            }
          } else {
            throw new Error('Email or Volunteer ID is required');
          }

          if (!user.password) {
            throw new Error('Account not set up for password login');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          const errorMessage = credentials.volunteerId
            ? 'Invalid Volunteer ID or password'
            : 'Invalid email or password';

          if (!isPasswordValid) {
            throw new Error(errorMessage);
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            volunteerId: user.volunteerId ?? null,
          };
        },
      }),
    ],

    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60,
    },

    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.role = (user as any).role;
          token.volunteerId = (user as any).volunteerId ?? null;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          (session.user as any).id = token.id;
          (session.user as any).role = token.role;
          (session.user as any).volunteerId = token.volunteerId ?? null;
        }
        return session;
      },
    },

    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
  };
}

/**
 * Get the current session on the server side
 */
export async function getSession() {
  const authOptions = await getAuthOptions();
  return await getServerSession(authOptions);
}

/**
 * Get the current user from session
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session?.user;
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: 'ORGANIZATION' | 'ADMIN' | 'SUPER_ADMIN' | 'VOLUNTEER') {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Check if user is admin or super admin
 */
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
}

/**
 * Check if user is a volunteer
 */
export async function isVolunteer() {
  const user = await getCurrentUser();
  return user?.role === 'VOLUNTEER';
}

/**
 * Check if user is admin, super admin, or volunteer
 */
export async function isAdminOrVolunteer() {
  const user = await getCurrentUser();
  return (
    user?.role === 'ADMIN' ||
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'VOLUNTEER'
  );
}
