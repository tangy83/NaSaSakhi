// GET  /api/admin/faiths — list all faiths
// POST /api/admin/faiths — create a new faith (ADMIN only)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allowed = await isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const faiths = await prisma.faith.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json({ success: true, data: faiths });
  } catch (error) {
    console.error('[admin/faiths GET]', error);
    return NextResponse.json({ success: false, error: 'Failed to load faiths' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const allowed = await isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 });
    }

    const faith = await prisma.faith.create({ data: { name: name.trim() } });
    return NextResponse.json({ success: true, data: faith }, { status: 201 });
  } catch (error) {
    console.error('[admin/faiths POST]', error);
    return NextResponse.json({ success: false, error: 'Failed to create faith' }, { status: 500 });
  }
}
