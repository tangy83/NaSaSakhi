// NextAuth.js Configuration — Root Project
// Handles /api/auth/* for the volunteer portal UI

import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

async function getPrisma() {
  const prismaModule = await import('@/lib/prisma');
  return prismaModule.default;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        // Volunteer login — uses Volunteer ID instead of email
        volunteerId: { label: 'Volunteer ID', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.password) {
          throw new Error('Password is required');
        }

        const prisma = await getPrisma();
        let user;

        if (credentials.volunteerId) {
          // Volunteer login path
          user = await prisma.user.findUnique({
            where: { volunteerId: credentials.volunteerId },
          });

          if (!user) {
            throw new Error('Invalid Volunteer ID or password');
          }
        } else if (credentials.email) {
          // Standard email login path
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

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/volunteer/login',
    error: '/volunteer/login',
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
