import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/reference/resources
 * Returns all service resources, optionally filtered by categoryId
 * Query params: ?categoryId=<id>
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');

    const where = categoryId
      ? { categoryId: parseInt(categoryId, 10) }
      : {};

    const resources = await prisma.serviceResource.findMany({
      where,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        categoryId: true,
        category: {
          select: {
            name: true,
            targetGroup: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: resources,
    });
  } catch (error) {
    console.error('Error fetching service resources:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch service resources',
      },
      { status: 500 }
    );
  }
}
