// Prisma Client Singleton for Prisma 7
// Prevents multiple instances in development hot-reload

import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  // During Next.js build phase, DATABASE_URL may not be available
  // Return a basic PrismaClient without adapter to allow build to complete
  // At runtime, DATABASE_URL will be available from environment variables
  if (!connectionString) {
    console.warn('DATABASE_URL not set - using basic Prisma Client (build mode)');
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }

  // Runtime: Create PostgreSQL connection pool with adapter
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
