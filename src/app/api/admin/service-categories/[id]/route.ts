// PATCH /api/admin/service-categories/[id] — update a category
// DELETE /api/admin/service-categories/[id] — delete a category (blocked if has resources)

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
    const { name, targetGroup, displayOrder } = body;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 });
    }

    const updated = await prisma.serviceCategory.update({
      where: { id },
      data: {
        name: name.trim(),
        ...(targetGroup && { targetGroup }),
        ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
    console.error('[admin/service-categories PATCH]', error);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const allowed = await isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const resourceCount = await prisma.serviceResource.count({ where: { categoryId: id } });
    if (resourceCount > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete: ${resourceCount} resource(s) belong to this category. Delete them first.` },
        { status: 409 }
      );
    }

    await prisma.serviceCategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
    console.error('[admin/service-categories DELETE]', error);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}
