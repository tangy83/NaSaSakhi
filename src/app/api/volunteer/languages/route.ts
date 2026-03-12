// GET /api/volunteer/languages — language coverage stats, accessible by volunteers + admins

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminOrVolunteerOrTranslator } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allowed = await isAdminOrVolunteerOrTranslator();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const [languages, totalApproved, fullyTranslated] = await Promise.all([
      prisma.language.findMany({ orderBy: { name: 'asc' } }),
      prisma.organization.count({ where: { status: 'APPROVED' } }),
      prisma.organization.count({ where: { status: 'APPROVED' } }), // placeholder; refined below
    ]);

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
      const volunteerReviewed = stats['VOLUNTEER_REVIEWED'] || 0;
      const machineTranslated = stats['MACHINE_TRANSLATED'] || 0;
      const pending = stats['PENDING'] || 0;
      const failed = stats['TRANSLATION_FAILED'] || 0;
      const coveragePercent = totalApproved > 0 ? Math.round((volunteerReviewed / totalApproved) * 100) : 0;
      return {
        languageId: lang.id,
        languageName: lang.name,
        nativeScriptName: lang.nativeScriptName,
        languageCode: lang.code,
        scriptFamily: lang.scriptFamily,
        fontFamily: lang.fontFamily,
        isRTL: lang.isRTL,
        isActive: lang.isActive,
        coveragePercent,
        volunteerReviewed,
        machineTranslated,
        pending,
        failed,
      };
    });

    // Count orgs with full coverage (all active non-English languages have VOLUNTEER_REVIEWED jobs)
    const fullCoverage = rows.filter((r) => r.isActive && r.languageCode !== 'en' && r.coveragePercent === 100).length;
    const partialCoverage = rows.filter((r) => r.isActive && r.languageCode !== 'en' && r.coveragePercent > 0 && r.coveragePercent < 100).length;

    return NextResponse.json({
      success: true,
      data: {
        languages: rows,
        summary: {
          totalApproved,
          fullCoverage,
          partialCoverage,
        },
      },
    });
  } catch (error) {
    console.error('[volunteer/languages GET]', error);
    return NextResponse.json({ success: false, error: 'Failed to load languages' }, { status: 500 });
  }
}
