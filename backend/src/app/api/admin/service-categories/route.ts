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
  const auth = await getAuth();
  const allowed = await auth.isAdmin();
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const prisma = await getPrisma();

  const categories = await prisma.serviceCategory.findMany({
    orderBy: [{ targetGroup: 'asc' }, { displayOrder: 'asc' }],
    include: { _count: { select: { resources: true } } },
  });

  return NextResponse.json({ success: true, data: categories });
}

export async function POST(req: NextRequest) {
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

  return NextResponse.json({ success: true, data: category }, { status: 201 });
}
