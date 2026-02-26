// GET  /api/admin/faiths — list all faiths
// POST /api/admin/faiths — create a new faith (ADMIN only)

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

  const faiths = await prisma.faith.findMany({ orderBy: { name: 'asc' } });

  return NextResponse.json({ success: true, data: faiths });
}

export async function POST(req: NextRequest) {
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

  const faith = await prisma.faith.create({ data: { name: name.trim() } });

  return NextResponse.json({ success: true, data: faith }, { status: 201 });
}
