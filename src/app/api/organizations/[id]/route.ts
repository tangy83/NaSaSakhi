// GET /api/organizations/[id]
// Public endpoint: returns full organization detail in requested language
// Query param: ?lang=<ISO code> (falls back to English if not translated)

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function getPrisma() {
  const m = await import('@/lib/prisma');
  return m.default;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lang = req.nextUrl.searchParams.get('lang') || 'en';

  const prisma = await getPrisma();

  const org = await prisma.organization.findUnique({
    where: { id, status: 'APPROVED' },
    include: {
      contacts: {
        select: {
          isPrimary: true,
          name: true,
          isdCode: true,
          phone: true,
          email: true,
          facebookUrl: true,
          instagramHandle: true,
          twitterHandle: true,
        },
      },
      branches: {
        include: {
          city: { select: { name: true } },
          state: { select: { name: true } },
          timings: true,
          categories: { include: { category: { select: { name: true } } } },
          resources: { include: { resource: { select: { name: true } } } },
        },
      },
      languages: { include: { language: { select: { name: true, code: true } } } },
      documents: {
        select: { type: true, fileUrl: true, filename: true },
      },
    },
  });

  if (!org) {
    return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 });
  }

  // Apply translations if a non-English language is requested
  let translations: Map<string, string> = new Map();
  if (lang !== 'en') {
    const targetLanguage = await prisma.language.findFirst({ where: { code: lang } });
    if (targetLanguage) {
      const records = await prisma.organizationTranslation.findMany({
        where: {
          organizationId: id,
          languageId: targetLanguage.id,
          status: 'VOLUNTEER_REVIEWED',
        },
      });
      translations = new Map(records.map((r) => [r.fieldName, r.translatedText]));
    }
  }

  const result = {
    id: org.id,
    name: translations.get('name') || org.name,
    registrationType: org.registrationType,
    registrationNumber: org.registrationNumber,
    yearEstablished: org.yearEstablished,
    websiteUrl: org.websiteUrl,
    status: org.status,
    contacts: org.contacts,
    branches: org.branches.map((b) => ({
      id: b.id,
      addressLine1: b.addressLine1,
      addressLine2: b.addressLine2,
      cityName: b.city.name,
      stateName: b.state.name,
      pinCode: b.pinCode,
      timings: b.timings,
      categories: b.categories.map((c) => c.category.name),
      resources: b.resources.map((r) => r.resource.name),
    })),
    languages: org.languages.map((l) => ({ name: l.language.name, code: l.language.code })),
    documents: org.documents,
  };

  return NextResponse.json({ success: true, data: result });
}
