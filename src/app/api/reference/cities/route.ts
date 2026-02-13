import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/reference/cities
 * Returns cities, optionally filtered by stateId
 * Query params: ?stateId=<id>
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stateId = searchParams.get('stateId');

    const where = stateId
      ? { stateId: stateId }
      : {};

    const cities = await prisma.city.findMany({
      where,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        stateId: true,
        state: {
          select: {
            name: true,
            code: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cities',
      },
      { status: 500 }
    );
  }
}
