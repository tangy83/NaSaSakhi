import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/reference/social-categories
 * Returns all social category options
 */
export async function GET() {
  try {
    const socialCategories = await prisma.socialCategory.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: socialCategories,
    });
  } catch (error) {
    console.error('Error fetching social categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch social categories',
      },
      { status: 500 }
    );
  }
}
