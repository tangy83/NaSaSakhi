// GET /api/volunteer/organizations
// Returns paginated list of organizations for volunteer review queue

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
  const allowed = await auth.isAdminOrVolunteer();

  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const status = (searchParams.get('status') || 'PENDING') as
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'CLARIFICATION_REQUESTED';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const skip = (page - 1) * limit;

  const prisma = await getPrisma();

  const [organizations, total] = await Promise.all([
    prisma.organization.findMany({
      where: { status },
      orderBy: { createdAt: 'asc' }, // oldest first — first-in-first-out review queue
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        registrationType: true,
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
    }),
    prisma.organization.count({ where: { status } }),
  ]);

  const items = organizations.map((org) => ({
    id: org.id,
    name: org.name,
    registrationType: org.registrationType,
    cityName: org.branches[0]?.city?.name ?? null,
    stateName: org.branches[0]?.state?.name ?? null,
    status: org.status,
    submittedAt: org.createdAt.toISOString(),
  }));

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
