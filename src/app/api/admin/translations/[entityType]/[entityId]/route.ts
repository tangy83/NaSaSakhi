// GET   /api/admin/translations/[entityType]/[entityId]
// PATCH /api/admin/translations/[entityType]/[entityId]
// Manage a single reference data item's translation for a specific language

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ entityType: string; entityId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const allowed = await isAdmin();
  if (!allowed) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { entityType, entityId } = await params;
  const languages = await prisma.language.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });

  let translations: Array<{ languageId: string; translatedName: string | null }> = [];

  if (entityType === 'service-category') {
    const rows = await prisma.serviceCategoryTranslation.findMany({ where: { categoryId: entityId } });
    translations = languages.map((l) => ({
      languageId: l.id,
      translatedName: rows.find((r) => r.languageId === l.id)?.translatedName ?? null,
    }));
  } else if (entityType === 'service-resource') {
    const rows = await prisma.serviceResourceTranslation.findMany({ where: { resourceId: entityId } });
    translations = languages.map((l) => ({
      languageId: l.id,
      translatedName: rows.find((r) => r.languageId === l.id)?.translatedName ?? null,
    }));
  } else if (entityType === 'faith') {
    const rows = await prisma.faithTranslation.findMany({ where: { faithId: entityId } });
    translations = languages.map((l) => ({
      languageId: l.id,
      translatedName: rows.find((r) => r.languageId === l.id)?.translatedName ?? null,
    }));
  } else if (entityType === 'social-category') {
    const rows = await prisma.socialCategoryTranslation.findMany({ where: { socialCategoryId: entityId } });
    translations = languages.map((l) => ({
      languageId: l.id,
      translatedName: rows.find((r) => r.languageId === l.id)?.translatedName ?? null,
    }));
  } else {
    return NextResponse.json({ success: false, error: 'Unknown entityType' }, { status: 400 });
  }

  return NextResponse.json({ success: true, data: translations });
}

// PATCH body: { languageId: string, translatedName: string }
export async function PATCH(req: NextRequest, { params }: Params) {
  const allowed = await isAdmin();
  if (!allowed) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { entityType, entityId } = await params;
  const { languageId, translatedName } = await req.json();

  if (!languageId || typeof translatedName !== 'string') {
    return NextResponse.json({ success: false, error: 'languageId and translatedName are required' }, { status: 400 });
  }

  if (entityType === 'service-category') {
    await prisma.serviceCategoryTranslation.upsert({
      where: { categoryId_languageId: { categoryId: entityId, languageId } },
      create: { categoryId: entityId, languageId, translatedName },
      update: { translatedName },
    });
  } else if (entityType === 'service-resource') {
    await prisma.serviceResourceTranslation.upsert({
      where: { resourceId_languageId: { resourceId: entityId, languageId } },
      create: { resourceId: entityId, languageId, translatedName },
      update: { translatedName },
    });
  } else if (entityType === 'faith') {
    await prisma.faithTranslation.upsert({
      where: { faithId_languageId: { faithId: entityId, languageId } },
      create: { faithId: entityId, languageId, translatedName },
      update: { translatedName },
    });
  } else if (entityType === 'social-category') {
    await prisma.socialCategoryTranslation.upsert({
      where: { socialCategoryId_languageId: { socialCategoryId: entityId, languageId } },
      create: { socialCategoryId: entityId, languageId, translatedName },
      update: { translatedName },
    });
  } else {
    return NextResponse.json({ success: false, error: 'Unknown entityType' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
