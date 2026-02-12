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
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          const prisma = await getPrisma();
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            throw new Error('Invalid email or password');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error('Invalid email or password');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
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
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          (session.user as any).id = token.id;
          (session.user as any).role = token.role;
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
export async function hasRole(role: 'ORGANIZATION' | 'ADMIN' | 'SUPER_ADMIN') {
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
