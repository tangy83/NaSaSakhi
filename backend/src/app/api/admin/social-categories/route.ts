// GET  /api/admin/social-categories — list all social categories
// POST /api/admin/social-categories — create a new social category (ADMIN only)

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
    const categories = await prisma.socialCategory.findMany({ orderBy: { name: 'asc' } });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('[admin/social-categories GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load social categories' },
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
    const { name } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 });
    }

    const prisma = await getPrisma();
    const category = await prisma.socialCategory.create({ data: { name: name.trim() } });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error('[admin/social-categories POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create social category' },
      { status: 500 }
    );
  }
}
