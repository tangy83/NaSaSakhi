// NextAuth.js Configuration
// Handles authentication routes: /api/auth/signin, /api/auth/signout, /api/auth/session, etc.

import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

// Dynamic import to avoid loading Prisma during build phase
async function getPrisma() {
  const prismaModule = await import('@/lib/prisma');
  return prismaModule.default;
}

// Create auth options function to handle async Prisma initialization
async function getAuthOptions(): Promise<NextAuthOptions> {
  const prisma = await getPrisma();
  const { PrismaAdapter } = await import('@next-auth/prisma-adapter');
  
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
          
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error('Invalid email or password');
          }

          // Check if user has a password (credentials-based login)
          if (!user.password) {
            throw new Error('Account not set up for password login');
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error('Invalid email or password');
          }

          // Return user object (will be encoded in JWT)
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
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    pages: {
      signIn: '/auth/signin',
      signOut: '/auth/signout',
      error: '/auth/error',
    },

    callbacks: {
      async jwt({ token, user }) {
        // Initial sign in
        if (user) {
          token.id = user.id;
          token.role = (user as any).role;
        }
        return token;
      },
      async session({ session, token }) {
        // Add user ID and role to session
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

// Initialize NextAuth handler
// NextAuth v4 with App Router pattern
let authHandler: ReturnType<typeof NextAuth> | null = null;

async function getHandler() {
  if (!authHandler) {
    const options = await getAuthOptions();
    authHandler = NextAuth(options);
  }
  return authHandler;
}

export async function GET(req: Request, context: { params: Promise<{ nextauth: string[] }> }) {
  const handler = await getHandler();
  return handler(req, context);
}

export async function POST(req: Request, context: { params: Promise<{ nextauth: string[] }> }) {
  const handler = await getHandler();
  return handler(req, context);
}
