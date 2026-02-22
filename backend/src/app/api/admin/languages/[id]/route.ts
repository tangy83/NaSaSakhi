// PATCH /api/admin/languages/[id] — activate or deactivate a language (ADMIN only)
// DELETE is not allowed — languages cannot be hard-deleted

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuth();
  const user = await auth.getCurrentUser();

  if (!user || !['ADMIN', 'SUPER_ADMIN'].includes((user as any).role)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { isActive } = await req.json();

  if (typeof isActive !== 'boolean') {
    return NextResponse.json(
      { success: false, error: 'isActive (boolean) is required' },
      { status: 400 }
    );
  }

  const prisma = await getPrisma();

  const language = await prisma.language.findUnique({ where: { id } });
  if (!language) {
    return NextResponse.json({ success: false, error: 'Language not found' }, { status: 404 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const lang = await tx.language.update({
      where: { id },
      data: { isActive },
    });

    // On deactivation: cancel any PENDING_TRANSLATION jobs for this language
    if (!isActive) {
      await tx.translationJob.updateMany({
        where: { languageId: id, status: 'PENDING_TRANSLATION' },
        data: { status: 'CANCELLED' },
      });
    }

    // Audit log
    await tx.auditLog.create({
      data: {
        actorId: (user as any).id,
        actorRole: (user as any).role,
        action: isActive ? 'LANGUAGE_ACTIVATED' : 'LANGUAGE_DEACTIVATED',
        entityType: 'Language',
        entityId: id,
        metadata: { previousState: language.isActive, newState: isActive },
      },
    });

    return lang;
  });

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Languages cannot be deleted. Use PATCH to deactivate.' },
    { status: 400 }
  );
}
