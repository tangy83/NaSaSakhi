// GET  /api/admin/social-categories — list all social categories
// POST /api/admin/social-categories — create a new social category (ADMIN only)

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

    const categories = await prisma.socialCategory.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('[admin/social-categories GET]', error);
    return NextResponse.json({ success: false, error: 'Failed to load social categories' }, { status: 500 });
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

    const category = await prisma.socialCategory.create({ data: { name: name.trim() } });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error('[admin/social-categories POST]', error);
    return NextResponse.json({ success: false, error: 'Failed to create social category' }, { status: 500 });
  }
}
