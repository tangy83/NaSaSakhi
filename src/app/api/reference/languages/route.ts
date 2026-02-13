import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/reference/languages
 * Returns all languages
 */
export async function GET() {
  try {
    const languages = await prisma.language.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: languages,
    });
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch languages',
      },
      { status: 500 }
    );
  }
}
