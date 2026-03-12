// GET /api/volunteer/organizations/[id]/translations
// Returns per-language translation status for a given organization

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuth();
  const allowed = await auth.isAdminOrVolunteerOrTranslator();
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id: organizationId } = await params;
  const prisma = await getPrisma();

  const [jobs, languages] = await Promise.all([
    prisma.translationJob.findMany({
      where: { organizationId },
      include: {
        language: {
          select: { id: true, name: true, code: true, fontFamily: true, isRTL: true },
        },
      },
    }),
    prisma.language.findMany({
      where: { isActive: true },
      select: { id: true, name: true, code: true, fontFamily: true, isRTL: true },
    }),
  ]);

  // Count reviewed fields per job
  const translationCounts = await prisma.organizationTranslation.groupBy({
    by: ['languageId', 'status'],
    where: { organizationId },
    _count: true,
  });

  const countMap = new Map<string, { reviewed: number; total: number }>();
  for (const row of translationCounts) {
    const existing = countMap.get(row.languageId) || { reviewed: 0, total: 0 };
    existing.total += row._count;
    if (row.status === 'VOLUNTEER_REVIEWED') {
      existing.reviewed += row._count;
    }
    countMap.set(row.languageId, existing);
  }

  const jobMap = new Map(jobs.map((j) => [j.languageId, j]));

  const result = languages.map((lang) => {
    const job = jobMap.get(lang.id);
    const counts = countMap.get(lang.id) || { reviewed: 0, total: 0 };
    return {
      languageId: lang.id,
      languageName: lang.name,
      languageCode: lang.code,
      fontFamily: lang.fontFamily,
      isRTL: lang.isRTL,
      jobStatus: job?.status ?? 'PENDING_TRANSLATION',
      reviewedFieldCount: counts.reviewed,
      totalFieldCount: counts.total,
    };
  });

  return NextResponse.json({ success: true, data: result });
}

// POST /api/volunteer/organizations/[id]/translations
// Approve all translations for this org (Translator Stage 2 sign-off)
// Marks all MACHINE_TRANSLATED fields → VOLUNTEER_REVIEWED and transitions org → APPROVED
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuth();
  const user = await auth.getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const canApprove = await auth.canDoStage2Review();
  if (!canApprove) {
    return NextResponse.json({ success: false, error: 'Only Translators or Admins can approve translations' }, { status: 403 });
  }

  const { id: organizationId } = await params;
  const prisma = await getPrisma();

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true, status: true },
  });

  if (!org) {
    return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 });
  }

  if (org.status !== 'VOLUNTEER_APPROVED') {
    return NextResponse.json(
      { success: false, error: 'Organization must be in VOLUNTEER_APPROVED status to approve translations' },
      { status: 400 }
    );
  }

  await prisma.$transaction(async (tx) => {
    // Mark all MACHINE_TRANSLATED fields as VOLUNTEER_REVIEWED
    await tx.organizationTranslation.updateMany({
      where: { organizationId, status: 'MACHINE_TRANSLATED' },
      data: { status: 'VOLUNTEER_REVIEWED', translatedBy: (user as any).id },
    });

    // Mark all translation jobs as VOLUNTEER_REVIEWED
    await tx.translationJob.updateMany({
      where: { organizationId },
      data: { status: 'VOLUNTEER_REVIEWED' },
    });

    // Transition org to APPROVED
    await tx.organization.update({
      where: { id: organizationId },
      data: { status: 'APPROVED' },
    });

    // Audit log
    await tx.auditLog.create({
      data: {
        actorId: (user as any).id,
        actorRole: (user as any).role as any,
        action: 'STATUS_CHANGED',
        entityType: 'Organization',
        entityId: organizationId,
        metadata: { statusBefore: 'VOLUNTEER_APPROVED', statusAfter: 'APPROVED', approvedTranslations: true },
      },
    });
  });

  return NextResponse.json({ success: true, data: { status: 'APPROVED' } });
}
