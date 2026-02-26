// GET  /api/admin/languages — list all languages with translation coverage
// POST /api/admin/languages — add a new language (ADMIN only)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allowed = await isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const [languages, totalApproved] = await Promise.all([
      prisma.language.findMany({ orderBy: { name: 'asc' } }),
      prisma.organization.count({ where: { status: 'APPROVED' } }),
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
      const coveragePercent = totalApproved > 0 ? Math.round((volunteerReviewed / totalApproved) * 100) : 0;
      return {
        languageId: lang.id,
        languageName: lang.name,
        languageCode: lang.code,
        scriptFamily: lang.scriptFamily,
        fontFamily: lang.fontFamily,
        isRTL: lang.isRTL,
        isActive: lang.isActive,
        coveragePercent,
      };
    });

    return NextResponse.json({
      success: true,
      data: { languages: rows },
    });
  } catch (error) {
    console.error('[admin/languages GET]', error);
    return NextResponse.json({ success: false, error: 'Failed to load languages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const allowed = await isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, code, scriptFamily, isRTL, fontFamily, googleFontName } = body;

    if (!name || !code || !scriptFamily || !fontFamily || !googleFontName) {
      return NextResponse.json(
        { success: false, error: 'name, code, scriptFamily, fontFamily, and googleFontName are required' },
        { status: 400 }
      );
    }

    const language = await prisma.language.create({
      data: { name, code, scriptFamily, isRTL: isRTL ?? false, fontFamily, googleFontName, isActive: true },
    });

    return NextResponse.json({ success: true, data: language }, { status: 201 });
  } catch (error) {
    console.error('[admin/languages POST]', error);
    return NextResponse.json({ success: false, error: 'Failed to create language' }, { status: 500 });
  }
}
