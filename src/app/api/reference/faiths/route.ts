import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/reference/faiths
 * Returns all faith options
 */
export async function GET() {
  try {
    const faiths = await prisma.faith.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: faiths,
    });
  } catch (error) {
    console.error('Error fetching faiths:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch faiths',
      },
      { status: 500 }
    );
  }
}
