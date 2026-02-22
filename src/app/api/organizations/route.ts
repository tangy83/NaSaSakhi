// GET /api/organizations
// Public endpoint: returns paginated list of APPROVED organizations
// Supports ?lang=<ISO code> for localized content
// Query params: state, city, category, resource, language, page, limit

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function getPrisma() {
  const m = await import('@/lib/prisma');
  return m.default;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const lang = searchParams.get('lang') || 'en';
  const stateId = searchParams.get('state') || undefined;
  const cityId = searchParams.get('city') || undefined;
  const categoryId = searchParams.get('category') || undefined;
  const resourceId = searchParams.get('resource') || undefined;
  const languageFilter = searchParams.get('language') || undefined;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const skip = (page - 1) * limit;

  const prisma = await getPrisma();

  // Build branch filter
  const branchWhere: Record<string, any> = {};
  if (stateId) branchWhere.stateId = stateId;
  if (cityId) branchWhere.cityId = cityId;
  if (categoryId) branchWhere.categories = { some: { categoryId } };
  if (resourceId) branchWhere.resources = { some: { resourceId } };

  const orgWhere: Record<string, any> = { status: 'APPROVED' };
  if (Object.keys(branchWhere).length > 0) {
    orgWhere.branches = { some: branchWhere };
  }
  if (languageFilter) {
    orgWhere.languages = { some: { language: { code: languageFilter } } };
  }

  // Fetch language record for the requested lang code
  const targetLanguage = lang !== 'en'
    ? await prisma.language.findFirst({ where: { code: lang } })
    : null;

  const [organizations, total] = await Promise.all([
    prisma.organization.findMany({
      where: orgWhere,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        registrationType: true,
        languages: { select: { language: { select: { name: true } } } },
        branches: {
          select: {
            id: true,
            addressLine1: true,
            city: { select: { name: true } },
            state: { select: { name: true } },
            pinCode: true,
          },
        },
        // Translations for the requested language
        organizationTranslations: targetLanguage
          ? { where: { languageId: targetLanguage.id, status: 'VOLUNTEER_REVIEWED' } }
          : false,
      },
    }),
    prisma.organization.count({ where: orgWhere }),
  ]);

  const items = organizations.map((org) => {
    // Apply translation if available
    const translationMap = new Map(
      (org.organizationTranslations as any[] || []).map((t: any) => [t.fieldName, t.translatedText])
    );

    return {
      id: org.id,
      name: (translationMap.get('name') as string) || org.name,
      registrationType: org.registrationType,
      categories: [], // categories are on branches — left as array for mobile compat
      branches: org.branches.map((b) => ({
        id: b.id,
        addressLine1: b.addressLine1,
        cityName: b.city.name,
        stateName: b.state.name,
        pinCode: b.pinCode,
      })),
      languages: org.languages.map((l) => l.language.name),
    };
  });

  return NextResponse.json({
    success: true,
    data: {
      organizations: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
}
