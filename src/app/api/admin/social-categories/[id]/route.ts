// PATCH /api/admin/social-categories/[id] — rename a social category
// DELETE /api/admin/social-categories/[id] — delete a social category

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const allowed = await isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 });
    }

    const updated = await prisma.socialCategory.update({ where: { id }, data: { name: name.trim() } });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Social category not found' }, { status: 404 });
    }
    console.error('[admin/social-categories PATCH]', error);
    return NextResponse.json({ success: false, error: 'Failed to update social category' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const allowed = await isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.socialCategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Social category not found' }, { status: 404 });
    }
    console.error('[admin/social-categories DELETE]', error);
    return NextResponse.json({ success: false, error: 'Failed to delete social category' }, { status: 500 });
  }
}
