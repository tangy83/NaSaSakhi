// PATCH /api/admin/faiths/[id] — rename a faith
// DELETE /api/admin/faiths/[id] — delete a faith

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

    const updated = await prisma.faith.update({ where: { id }, data: { name: name.trim() } });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Faith not found' }, { status: 404 });
    }
    console.error('[admin/faiths PATCH]', error);
    return NextResponse.json({ success: false, error: 'Failed to update faith' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const allowed = await isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.faith.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Faith not found' }, { status: 404 });
    }
    console.error('[admin/faiths DELETE]', error);
    return NextResponse.json({ success: false, error: 'Failed to delete faith' }, { status: 500 });
  }
}
