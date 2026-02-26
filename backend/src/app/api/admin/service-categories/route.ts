// GET  /api/admin/service-categories — list all categories
// POST /api/admin/service-categories — create a new category (ADMIN only)

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function getPrisma() {
  const m = await import('@/lib/prisma');
  return m.default;
}

async function getAuth() {
  const m = await import('@/lib/auth');
  return m;
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuth();
    const allowed = await auth.isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = await getPrisma();

    const categories = await prisma.serviceCategory.findMany({
      orderBy: [{ targetGroup: 'asc' }, { displayOrder: 'asc' }],
    });

    // Count resources per category in a separate query to avoid _count complexity
    const resourceCounts = await prisma.serviceResource.groupBy({
      by: ['categoryId'],
      _count: { id: true },
    });

    const countMap = new Map(resourceCounts.map((r) => [r.categoryId, r._count.id]));

    const data = categories.map((c) => ({
      ...c,
      resourceCount: countMap.get(c.id) ?? 0,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[admin/service-categories GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load service categories' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuth();
    const allowed = await auth.isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, targetGroup, displayOrder } = body;

    if (!name || !targetGroup) {
      return NextResponse.json(
        { success: false, error: 'name and targetGroup are required' },
        { status: 400 }
      );
    }

    if (!['CHILDREN', 'WOMEN'].includes(targetGroup)) {
      return NextResponse.json(
        { success: false, error: 'targetGroup must be CHILDREN or WOMEN' },
        { status: 400 }
      );
    }

    const prisma = await getPrisma();

    const category = await prisma.serviceCategory.create({
      data: {
        name: name.trim(),
        targetGroup,
        displayOrder: displayOrder ?? 99,
      },
    });

    return NextResponse.json({ success: true, data: { ...category, resourceCount: 0 } }, { status: 201 });
  } catch (error) {
    console.error('[admin/service-categories POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service category' },
      { status: 500 }
    );
  }
}
