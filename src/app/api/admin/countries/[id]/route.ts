// GET    /api/admin/countries/[id] — get country with language assignments
// PUT    /api/admin/countries/[id]/languages — assign language to country
// DELETE /api/admin/countries/[id]/languages/[langId] — remove assignment
//
// This route handles:
// DELETE /api/admin/countries/[id]?languageId=xxx — remove language from country
// POST   /api/admin/countries/[id]?action=add-language — add language to country

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const allowed = await isAdmin();
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const country = await prisma.country.findUnique({
    where: { id },
    include: {
      languages: {
        include: {
          language: { select: { id: true, name: true, code: true, isActive: true } },
        },
      },
      _count: { select: { organizations: true } },
    },
  });

  if (!country) {
    return NextResponse.json({ success: false, error: 'Country not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: country });
}

// POST body: { action: 'add-language', languageId: string }
//         or { action: 'remove-language', languageId: string }
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const allowed = await isAdmin();
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { action, languageId } = await req.json();

  if (!languageId) {
    return NextResponse.json({ success: false, error: 'languageId is required' }, { status: 400 });
  }

  if (action === 'add-language') {
    await prisma.countryLanguage.upsert({
      where: { countryId_languageId: { countryId: id, languageId } },
      create: { countryId: id, languageId },
      update: {},
    });
    return NextResponse.json({ success: true });
  }

  if (action === 'remove-language') {
    await prisma.countryLanguage.deleteMany({
      where: { countryId: id, languageId },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
}
