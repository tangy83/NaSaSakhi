// PATCH /api/volunteer/organizations/[id]/status
// Two-stage approval:
//   Stage 1 (PENDING → VOLUNTEER_APPROVED): Volunteers, Admins
//   Stage 2 (VOLUNTEER_APPROVED → APPROVED): Translators, Admins
//   Terminal transitions (→ REJECTED | CLARIFICATION_REQUESTED | ARCHIVED): role-gated by current status

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

type AllowedStatus = 'VOLUNTEER_APPROVED' | 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED' | 'ARCHIVED';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuth();
  const user = await auth.getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const allowed = await auth.isAdminOrVolunteerOrTranslator();
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, note } = body as { status: AllowedStatus; note?: string };

  const validStatuses: AllowedStatus[] = ['VOLUNTEER_APPROVED', 'APPROVED', 'REJECTED', 'CLARIFICATION_REQUESTED', 'ARCHIVED'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
  }

  // Note is mandatory for REJECTED, CLARIFICATION_REQUESTED, and ARCHIVED
  if (['REJECTED', 'CLARIFICATION_REQUESTED', 'ARCHIVED'].includes(status) && !note?.trim()) {
    return NextResponse.json(
      { success: false, error: 'A note is required when rejecting, requesting clarification, or archiving' },
      { status: 400 }
    );
  }

  const prisma = await getPrisma();

  const org = await prisma.organization.findUnique({ where: { id } });
  if (!org) {
    return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 });
  }

  const role = (user as any).role as string;
  const isAdminRole = role === 'ADMIN' || role === 'SUPER_ADMIN';

  // ── Role-based transition enforcement ──
  if (status === 'VOLUNTEER_APPROVED') {
    if (!isAdminRole && role !== 'VOLUNTEER') {
      return NextResponse.json({ success: false, error: 'Only volunteers or admins can approve to Stage 2 queue' }, { status: 403 });
    }
    if (org.status !== 'PENDING' && !isAdminRole) {
      return NextResponse.json({ success: false, error: 'Organisation must be PENDING for Stage 1 approval' }, { status: 400 });
    }
  } else if (status === 'APPROVED') {
    if (!isAdminRole && role !== 'TRANSLATOR') {
      return NextResponse.json({ success: false, error: 'Only translators or admins can give final approval' }, { status: 403 });
    }
    if (org.status !== 'VOLUNTEER_APPROVED' && !isAdminRole) {
      return NextResponse.json({ success: false, error: 'Organisation must be VOLUNTEER_APPROVED for Stage 2 approval' }, { status: 400 });
    }
  } else {
    // Terminal transitions: role determines which queue they can act on
    if (!isAdminRole) {
      if (role === 'VOLUNTEER' && org.status !== 'PENDING') {
        return NextResponse.json({ success: false, error: 'Volunteers can only act on PENDING organisations' }, { status: 403 });
      }
      if (role === 'TRANSLATOR' && org.status !== 'VOLUNTEER_APPROVED') {
        return NextResponse.json({ success: false, error: 'Translators can only act on VOLUNTEER_APPROVED organisations' }, { status: 403 });
      }
    }
  }

  const reviewerId = (user as any).id as string;

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.organization.update({
      where: { id },
      data: { status },
    });

    await tx.reviewNote.create({
      data: {
        organizationId: id,
        reviewerId,
        note: note?.trim() || '',
        statusBefore: org.status,
        statusAfter: status,
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: reviewerId,
        actorRole: role as any,
        action: `ORG_${status}`,
        entityType: 'Organization',
        entityId: id,
        metadata: { note: note?.trim() || null, previousStatus: org.status },
      },
    });

    // When org reaches VOLUNTEER_APPROVED, queue translation jobs for all active languages
    if (status === 'VOLUNTEER_APPROVED') {
      const activeLanguages = await tx.language.findMany({
        where: { isActive: true },
        select: { id: true },
      });
      if (activeLanguages.length > 0) {
        await tx.translationJob.createMany({
          data: activeLanguages.map((lang) => ({
            organizationId: id,
            languageId: lang.id,
            status: 'PENDING_TRANSLATION',
          })),
          skipDuplicates: true,
        });
      }
    }

    return updated;
  });

  return NextResponse.json({ success: true, data: result });
}
