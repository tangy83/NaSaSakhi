// PATCH /api/admin/languages/[id] — update a language
// DELETE /api/admin/languages/[id] — delete (blocked if translation jobs exist)

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
    const { name, scriptFamily, isRTL, fontFamily } = body;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 });
    }

    const updated = await prisma.language.update({
      where: { id },
      data: {
        name: name.trim(),
        ...(scriptFamily !== undefined && { scriptFamily: scriptFamily.trim() }),
        ...(isRTL !== undefined && { isRTL }),
        ...(fontFamily !== undefined && { fontFamily: fontFamily.trim() }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Language not found' }, { status: 404 });
    }
    console.error('[admin/languages PATCH]', error);
    return NextResponse.json({ success: false, error: 'Failed to update language' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const allowed = await isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const jobCount = await prisma.translationJob.count({ where: { languageId: id } });
    if (jobCount > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete: ${jobCount} translation job(s) reference this language.` },
        { status: 409 }
      );
    }

    await prisma.language.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Language not found' }, { status: 404 });
    }
    console.error('[admin/languages DELETE]', error);
    return NextResponse.json({ success: false, error: 'Failed to delete language' }, { status: 500 });
  }
}
