import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/reference/countries
 * Returns all countries with their active languages (for registration form dropdowns)
 */
export async function GET(_req: NextRequest) {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        languages: {
          select: {
            language: {
              select: {
                id: true,
                name: true,
                nativeScriptName: true,
                code: true,
                isActive: true,
              },
            },
          },
          where: {
            language: { isActive: true },
          },
        },
      },
    });

    const data = countries.map((country) => ({
      id: country.id,
      name: country.name,
      languages: country.languages.map((cl) => cl.language),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}
