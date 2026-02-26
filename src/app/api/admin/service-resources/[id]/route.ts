// PATCH /api/admin/service-resources/[id] — update a resource
// DELETE /api/admin/service-resources/[id] — delete a resource

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
    const body = await req.json();
    const { name, description, categoryId } = body;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 });
    }

    const updated = await prisma.serviceResource.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        ...(categoryId && { categoryId }),
      },
      include: { category: { select: { id: true, name: true, targetGroup: true } } },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 });
    }
    console.error('[admin/service-resources PATCH]', error);
    return NextResponse.json({ success: false, error: 'Failed to update resource' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const allowed = await isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.serviceResource.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 });
    }
    console.error('[admin/service-resources DELETE]', error);
    return NextResponse.json({ success: false, error: 'Failed to delete resource' }, { status: 500 });
  }
}
