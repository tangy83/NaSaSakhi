// GET /api/organizations/search?q=<name>
// Returns up to 20 APPROVED organizations matching the query, for branch parent selection.
// Response: { id, name, customId }[]

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function getPrisma() {
  const m = await import('@/lib/prisma');
  return m.default;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const q = searchParams.get('q')?.trim() || '';

    const prisma = await getPrisma();

    const organizations = await prisma.organization.findMany({
      where: {
        status: 'APPROVED',
        entityType: 'ORGANIZATION', // only top-level orgs can be parents
        ...(q
          ? {
              name: {
                contains: q,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        customId: true,
      },
      orderBy: { name: 'asc' },
      take: 20,
    });

    return NextResponse.json({ success: true, data: organizations });
  } catch (error) {
    console.error('Organization search error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search organizations' },
      { status: 500 }
    );
  }
}
