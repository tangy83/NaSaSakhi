// Resources Endpoint
// Test: GET http://localhost:3000/api/reference/resources
// Test: GET http://localhost:3000/api/reference/resources?categoryId=<uuid>

import { NextRequest, NextResponse } from 'next/server';

// Prevent static generation - this route must be dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Dynamic import to avoid loading Prisma during build phase
    const prismaModule = await import('@/lib/prisma');
    const prisma = prismaModule.default || prismaModule.prisma;
    
    if (!prisma) {
      throw new Error('Prisma client not found in module');
    }
    
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');

    const where = categoryId ? { categoryId } : {};

    const resources = await prisma.serviceResource.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: resources,
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch resources',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
