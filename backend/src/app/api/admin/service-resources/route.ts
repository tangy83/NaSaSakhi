// GET  /api/admin/service-resources — list all resources with category
// POST /api/admin/service-resources — create a new resource (ADMIN only)

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

  const resources = await prisma.serviceResource.findMany({
    orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
    include: { category: { select: { id: true, name: true, targetGroup: true } } },
  });

  return NextResponse.json({ success: true, data: resources });
}

export async function POST(req: NextRequest) {
  const auth = await getAuth();
  const allowed = await auth.isAdmin();
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, categoryId } = body;

  if (!name || !categoryId) {
    return NextResponse.json(
      { success: false, error: 'name and categoryId are required' },
      { status: 400 }
    );
  }

  const prisma = await getPrisma();

  const resource = await prisma.serviceResource.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      categoryId,
    },
    include: { category: { select: { id: true, name: true, targetGroup: true } } },
  });

  return NextResponse.json({ success: true, data: resource }, { status: 201 });
}
