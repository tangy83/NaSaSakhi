// States Endpoint
// Test: GET http://localhost:3000/api/reference/states

import { NextResponse } from 'next/server';

// Prevent static generation - this route must be dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Dynamic import to avoid loading Prisma during build phase
    const prismaModule = await import('@/lib/prisma');
    const prisma = prismaModule.default || prismaModule.prisma;
    
    if (!prisma) {
      throw new Error('Prisma client not found in module');
    }
    
    const states = await prisma.state.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: states,
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch states',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
