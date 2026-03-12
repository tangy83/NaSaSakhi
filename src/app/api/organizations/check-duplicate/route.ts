// GET /api/organizations/check-duplicate?q=<name>
// Volunteer/admin only — search by name to detect potential duplicates before registration
// Returns PENDING + VOLUNTEER_APPROVED + APPROVED orgs matching the query (max 10)

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

export async function GET(req: NextRequest) {
  const auth = await getAuth();
  const allowed = await auth.isAdminOrVolunteerOrTranslator();
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q')?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json(
      { success: false, error: 'Query must be at least 2 characters' },
      { status: 400 }
    );
  }

  const prisma = await getPrisma();

  const matches = await prisma.organization.findMany({
    where: {
      name: { contains: q, mode: 'insensitive' },
      status: { in: ['PENDING', 'VOLUNTEER_APPROVED', 'APPROVED'] },
    },
    select: {
      id: true,
      customId: true,
      name: true,
      status: true,
      createdAt: true,
      branches: {
        take: 1,
        select: {
          city: { select: { name: true } },
          state: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const data = matches.map((org) => ({
    id: org.id,
    customId: org.customId,
    name: org.name,
    status: org.status,
    city: org.branches[0]?.city?.name ?? null,
    state: org.branches[0]?.state?.name ?? null,
    submittedAt: org.createdAt.toISOString(),
  }));

  return NextResponse.json({ success: true, data });
}
