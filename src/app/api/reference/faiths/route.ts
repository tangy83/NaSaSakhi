import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/reference/faiths
 * Returns faith options, optionally filtered by country.
 * ?countryId=IN  → returns faiths associated with India via CountryFaith table
 * (no param)     → returns all faiths (used by admin panel)
 */
export async function GET(request: NextRequest) {
  try {
    const countryId = request.nextUrl.searchParams.get('countryId');

    let faiths: { id: string; name: string }[];

    if (countryId) {
      const countryFaiths = await prisma.countryFaith.findMany({
        where: { countryId },
        include: { faith: { select: { id: true, name: true } } },
        orderBy: { faith: { name: 'asc' } },
      });
      faiths = countryFaiths.map((cf) => cf.faith);
    } else {
      faiths = await prisma.faith.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
      });
    }

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
