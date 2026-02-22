// GET  /api/admin/languages — list all languages with translation coverage
// POST /api/admin/languages — add a new language (SUPER_ADMIN only)

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

export async function GET(req: NextRequest) {
  const auth = await getAuth();
  const allowed = await auth.isAdmin();
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const prisma = await getPrisma();

  const [languages, totalApproved] = await Promise.all([
    prisma.language.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.organization.count({ where: { status: 'APPROVED' } }),
  ]);

  // Get translation coverage counts per language
  const jobStats = await prisma.translationJob.groupBy({
    by: ['languageId', 'status'],
    _count: true,
  });

  const statsMap = new Map<string, Record<string, number>>();
  for (const row of jobStats) {
    const existing = statsMap.get(row.languageId) || {};
    existing[row.status] = row._count;
    statsMap.set(row.languageId, existing);
  }

  const rows = languages.map((lang) => {
    const stats = statsMap.get(lang.id) || {};
    const machineTranslated = stats['MACHINE_TRANSLATED'] || 0;
    const volunteerReviewed = stats['VOLUNTEER_REVIEWED'] || 0;
    const failed = stats['TRANSLATION_FAILED'] || 0;
    const coveragePercent =
      totalApproved > 0 ? Math.round((volunteerReviewed / totalApproved) * 100) : 0;

    return {
      languageId: lang.id,
      languageName: lang.name,
      languageCode: lang.code,
      scriptFamily: lang.scriptFamily,
      fontFamily: lang.fontFamily,
      googleFontName: lang.googleFontName,
      isRTL: lang.isRTL,
      isActive: lang.isActive,
      totalOrganizations: totalApproved,
      machineTranslated,
      volunteerReviewed,
      failed,
      coveragePercent,
    };
  });

  return NextResponse.json({
    success: true,
    data: {
      totalApprovedOrganizations: totalApproved,
      languagesWithFullCoverage: rows.filter((r) => r.coveragePercent === 100).length,
      languagesWithPartialCoverage: rows.filter(
        (r) => r.coveragePercent > 0 && r.coveragePercent < 100
      ).length,
      languages: rows,
    },
  });
}

export async function POST(req: NextRequest) {
  const auth = await getAuth();
  const user = await auth.getCurrentUser();

  if (!user || !['ADMIN', 'SUPER_ADMIN'].includes((user as any).role)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { name, code, scriptFamily, isRTL, fontFamily, googleFontName } = body;

  if (!name || !code || !scriptFamily || !fontFamily || !googleFontName) {
    return NextResponse.json(
      {
        success: false,
        error: 'name, code, scriptFamily, fontFamily, and googleFontName are required',
      },
      { status: 400 }
    );
  }

  const prisma = await getPrisma();

  // Create the new language
  const language = await prisma.language.create({
    data: {
      name,
      code,
      scriptFamily,
      isRTL: isRTL ?? false,
      fontFamily,
      googleFontName,
      isActive: true,
    },
  });

  // Queue translation jobs for all currently APPROVED organizations
  const approvedOrgs = await prisma.organization.findMany({
    where: { status: 'APPROVED' },
    select: { id: true },
  });

  if (approvedOrgs.length > 0) {
    await prisma.translationJob.createMany({
      data: approvedOrgs.map((org) => ({
        organizationId: org.id,
        languageId: language.id,
        status: 'PENDING_TRANSLATION',
      })),
      skipDuplicates: true,
    });
  }

  // Audit log
  await prisma.auditLog.create({
    data: {
      actorId: (user as any).id,
      actorRole: (user as any).role,
      action: 'LANGUAGE_ADDED',
      entityType: 'Language',
      entityId: language.id,
      metadata: {
        name,
        code,
        queuedTranslationJobs: approvedOrgs.length,
      },
    },
  });

  return NextResponse.json({ success: true, data: language }, { status: 201 });
}
