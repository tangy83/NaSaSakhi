// Cities Endpoint (with search)
// Test: GET http://localhost:3000/api/reference/cities
// Test: GET http://localhost:3000/api/reference/cities?search=Bang

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
    const search = searchParams.get('search');

    const where = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const cities = await prisma.city.findMany({
      where,
      take: 50, // Limit results for performance
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        stateId: true,
        state: {
          select: {
            name: true,
          },
        },
      },
    });

    // Transform to match API contract
    const transformedCities = cities.map((city) => ({
      id: city.id,
      name: city.name,
      stateId: city.stateId,
      stateName: city.state.name,
    }));

    return NextResponse.json({
      success: true,
      data: transformedCities,
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cities',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
