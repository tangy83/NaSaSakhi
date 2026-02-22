// GET /api/volunteer/organizations/[id]
// Returns full organization record for volunteer review

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuth();
  const allowed = await auth.isAdminOrVolunteer();

  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const prisma = await getPrisma();

  const org = await prisma.organization.findUnique({
    where: { id },
    include: {
      branches: {
        include: {
          city: true,
          state: true,
          timings: true,
          categories: { include: { category: true } },
          resources: { include: { resource: true } },
        },
      },
      contacts: true,
      languages: { include: { language: true } },
      documents: true,
      reviewNotes: {
        include: { reviewer: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!org) {
    return NextResponse.json({ success: false, error: 'Organization not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: org });
}
