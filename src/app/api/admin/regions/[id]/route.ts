// PATCH /api/admin/regions/[id] — rename a city
// DELETE /api/admin/regions/[id] — delete a city

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

    const updated = await prisma.city.update({ where: { id }, data: { name: name.trim() } });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    }
    console.error('[admin/regions PATCH]', error);
    return NextResponse.json({ success: false, error: 'Failed to update city' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const allowed = await isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.city.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    }
    console.error('[admin/regions DELETE]', error);
    return NextResponse.json({ success: false, error: 'Failed to delete city' }, { status: 500 });
  }
}
