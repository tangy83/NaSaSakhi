import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/reference/states
 * Returns all Indian states and union territories
 */
export async function GET() {
  try {
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
      },
      { status: 500 }
    );
  }
}
