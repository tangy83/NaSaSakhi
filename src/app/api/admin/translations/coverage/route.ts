// GET /api/admin/translations/coverage
// Returns Layer 2 reference data translation coverage matrix
// Rows = reference data items (service categories, resources, faiths, social categories)
// Columns = active languages

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const allowed = await isAdmin();
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const [
    languages,
    serviceCategories,
    serviceResources,
    faiths,
    socialCategories,
    categoryTranslations,
    resourceTranslations,
    faithTranslations,
    socialCategoryTranslations,
  ] = await Promise.all([
    prisma.language.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    prisma.serviceCategory.findMany({ orderBy: { name: 'asc' } }),
    prisma.serviceResource.findMany({ orderBy: { name: 'asc' } }),
    prisma.faith.findMany({ orderBy: { name: 'asc' } }),
    prisma.socialCategory.findMany({ orderBy: { name: 'asc' } }),
    prisma.serviceCategoryTranslation.findMany(),
    prisma.serviceResourceTranslation.findMany(),
    prisma.faithTranslation.findMany(),
    prisma.socialCategoryTranslation.findMany(),
  ]);

  // Build translation lookup maps
  const catTxMap = new Map(categoryTranslations.map((t) => [`${t.categoryId}:${t.languageId}`, t.translatedName]));
  const resTxMap = new Map(resourceTranslations.map((t) => [`${t.resourceId}:${t.languageId}`, t.translatedName]));
  const faithTxMap = new Map(faithTranslations.map((t) => [`${t.faithId}:${t.languageId}`, t.translatedName]));
  const socTxMap = new Map(socialCategoryTranslations.map((t) => [`${t.socialCategoryId}:${t.languageId}`, t.translatedName]));

  const buildRows = (
    items: Array<{ id: string; name: string }>,
    entityType: string,
    txMap: Map<string, string>
  ) =>
    items.map((item) => ({
      entityType,
      entityId: item.id,
      entityName: item.name,
      translations: languages.map((lang) => ({
        languageId: lang.id,
        languageCode: lang.code,
        translatedName: txMap.get(`${item.id}:${lang.id}`) ?? null,
      })),
    }));

  const rows = [
    ...buildRows(serviceCategories, 'service-category', catTxMap),
    ...buildRows(serviceResources, 'service-resource', resTxMap),
    ...buildRows(faiths, 'faith', faithTxMap),
    ...buildRows(socialCategories, 'social-category', socTxMap),
  ];

  // Coverage stats per language
  const totalItems = rows.length;
  const coverageByLang = languages.map((lang) => {
    const translated = rows.filter((r) => r.translations.find((t) => t.languageId === lang.id && t.translatedName)).length;
    return { languageId: lang.id, languageName: lang.name, languageCode: lang.code, translated, total: totalItems };
  });

  return NextResponse.json({ success: true, data: { languages, rows, coverageByLang } });
}
