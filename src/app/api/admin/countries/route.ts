// GET  /api/admin/countries — list all countries with language counts
// POST /api/admin/countries — add a new country (ADMIN+)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const allowed = await isAdmin();
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const countries = await prisma.country.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { languages: true, organizations: true } },
      languages: {
        include: {
          language: { select: { id: true, name: true, code: true, isActive: true } },
        },
      },
    },
  });

  return NextResponse.json({ success: true, data: countries });
}

export async function POST(req: NextRequest) {
  const allowed = await isAdmin();
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id, name } = await req.json();

  if (!id || !name) {
    return NextResponse.json(
      { success: false, error: 'id (ISO alpha-2) and name are required' },
      { status: 400 }
    );
  }

  const country = await prisma.country.create({ data: { id: id.toUpperCase(), name } });

  return NextResponse.json({ success: true, data: country }, { status: 201 });
}
