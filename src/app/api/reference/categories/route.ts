import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/reference/categories
 * Returns all service categories
 */
export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        targetGroup: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching service categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch service categories',
      },
      { status: 500 }
    );
  }
}
