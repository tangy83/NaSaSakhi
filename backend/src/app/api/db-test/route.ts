// Database Connection Test Endpoint
// Test: curl http://localhost:3000/api/db-test

import { NextResponse } from 'next/server';

// Prevent static generation - this route must be dynamic (requires database connection)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Dynamic import to avoid loading Prisma during build phase
    const { default: prisma } = await import('@/lib/prisma');

    // Test database connection by creating a health check record
    const healthCheck = await prisma.healthCheck.create({
      data: {
        status: 'ok',
        message: 'Database connection test successful',
      },
    });

    // Count total health check records
    const count = await prisma.healthCheck.count();

    // Get database version
    const result = await prisma.$queryRaw<Array<{ version: string }>>`SELECT version()`;
    const dbVersion = result[0]?.version || 'Unknown';

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      data: {
        testRecord: {
          id: healthCheck.id,
          status: healthCheck.status,
          timestamp: healthCheck.timestamp,
        },
        totalHealthChecks: count,
        database: {
          type: 'PostgreSQL',
          version: dbVersion,
          connected: true,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database connection error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          database: {
            connected: false,
            type: 'PostgreSQL',
          },
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Also support POST for testing
export async function POST() {
  return GET();
}
