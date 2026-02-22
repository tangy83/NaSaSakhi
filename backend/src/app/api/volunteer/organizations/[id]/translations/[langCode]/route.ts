// GET  /api/volunteer/organizations/[id]/translations/[langCode]
// Returns all translatable fields for this org+language (for review UI)
//
// PATCH /api/volunteer/organizations/[id]/translations/[langCode]
// Updates a single field's translation (volunteer edits / acceptance)

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

// Human-readable labels for each translatable field
const FIELD_LABELS: Record<string, string> = {
  name: 'Organization Name',
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; langCode: string }> }
) {
  const auth = await getAuth();
  const allowed = await auth.isAdminOrVolunteer();
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id: organizationId, langCode } = await params;
  const prisma = await getPrisma();

  // Resolve language by code
  const language = await prisma.language.findFirst({ where: { code: langCode } });
  if (!language) {
    return NextResponse.json({ success: false, error: 'Language not found' }, { status: 404 });
  }

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { name: true },
  });
  if (!org) {
    return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 });
  }

  const existingTranslations = await prisma.organizationTranslation.findMany({
    where: { organizationId, languageId: language.id },
  });

  const translationMap = new Map(existingTranslations.map((t) => [t.fieldName, t]));

  // Build the field list — source text comes from the org record
  const fields = Object.entries(FIELD_LABELS).map(([fieldName, fieldLabel]) => {
    const sourceText = (org as any)[fieldName] ?? '';
    const existing = translationMap.get(fieldName);
    return {
      fieldName,
      fieldLabel,
      sourceText,
      translatedText: existing?.translatedText ?? '',
      status: existing?.status ?? 'PENDING_TRANSLATION',
      translatorNote: null,
    };
  });

  return NextResponse.json({
    success: true,
    data: {
      language: {
        id: language.id,
        name: language.name,
        code: language.code,
        fontFamily: language.fontFamily,
        isRTL: language.isRTL,
      },
      fields,
    },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; langCode: string }> }
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

  const { id: organizationId, langCode } = await params;
  const { fieldName, translatedText, translatorNote } = await req.json();

  if (!fieldName || typeof translatedText !== 'string') {
    return NextResponse.json(
      { success: false, error: 'fieldName and translatedText are required' },
      { status: 400 }
    );
  }

  const prisma = await getPrisma();

  const language = await prisma.language.findFirst({ where: { code: langCode } });
  if (!language) {
    return NextResponse.json({ success: false, error: 'Language not found' }, { status: 404 });
  }

  const updated = await prisma.organizationTranslation.upsert({
    where: {
      organizationId_languageId_fieldName: {
        organizationId,
        languageId: language.id,
        fieldName,
      },
    },
    create: {
      organizationId,
      languageId: language.id,
      fieldName,
      translatedText,
      status: 'VOLUNTEER_REVIEWED',
      translatedBy: (user as any).id,
    },
    update: {
      translatedText,
      status: 'VOLUNTEER_REVIEWED',
      translatedBy: (user as any).id,
    },
  });

  // Check if all fields for this org+language are now VOLUNTEER_REVIEWED
  const allFields = Object.keys(FIELD_LABELS);
  const reviewedCount = await prisma.organizationTranslation.count({
    where: {
      organizationId,
      languageId: language.id,
      status: 'VOLUNTEER_REVIEWED',
      fieldName: { in: allFields },
    },
  });

  if (reviewedCount >= allFields.length) {
    // Mark translation job as fully volunteer-reviewed
    await prisma.translationJob.updateMany({
      where: { organizationId, languageId: language.id },
      data: { status: 'VOLUNTEER_REVIEWED' },
    });
  }

  return NextResponse.json({ success: true, data: updated });
}
