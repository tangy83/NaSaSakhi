// PATCH /api/volunteer/organizations/[id]/status
// Updates organization review status (approve / reject / request clarification)

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

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const allowed = await auth.isAdminOrVolunteer();
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, note } = body as {
    status: 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED';
    note?: string;
  };

  const validStatuses = ['APPROVED', 'REJECTED', 'CLARIFICATION_REQUESTED'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
  }

  // Note is mandatory for REJECTED and CLARIFICATION_REQUESTED
  if ((status === 'REJECTED' || status === 'CLARIFICATION_REQUESTED') && !note?.trim()) {
    return NextResponse.json(
      { success: false, error: 'A note is required when rejecting or requesting clarification' },
      { status: 400 }
    );
  }

  const prisma = await getPrisma();

  const org = await prisma.organization.findUnique({ where: { id } });
  if (!org) {
    return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 });
  }

  const reviewerId = (user as any).id as string;

  // All changes are atomic: status update + review note + audit log
  const result = await prisma.$transaction(async (tx) => {
    // 1. Update organization status
    const updated = await tx.organization.update({
      where: { id },
      data: { status },
    });

    // 2. Create review note
    await tx.reviewNote.create({
      data: {
        organizationId: id,
        reviewerId,
        note: note?.trim() || '',
        statusBefore: org.status,
        statusAfter: status,
      },
    });

    // 3. Audit log
    await tx.auditLog.create({
      data: {
        actorId: reviewerId,
        actorRole: (user as any).role,
        action: `ORG_${status}`,
        entityType: 'Organization',
        entityId: id,
        metadata: { note: note?.trim() || null, previousStatus: org.status },
      },
    });

    // 4. Translation job creation deferred — restore translationJob.createMany() here when re-enabling.

    return updated;
  });

  return NextResponse.json({ success: true, data: result });
}
