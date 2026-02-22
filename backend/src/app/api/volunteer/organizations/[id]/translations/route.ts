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
  const allowed = await auth.isAdminOrVolunteer();
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
