// GET /api/volunteer/dashboard
// Returns summary stats for the volunteer dashboard

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
  const user = await auth.getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const allowed = await auth.isAdminOrVolunteer();
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const prisma = await getPrisma();

  const [pending, approvedByMe, clarificationRequested, totalApproved] = await Promise.all([
    prisma.organization.count({ where: { status: 'PENDING' } }),
    prisma.reviewNote.count({
      where: {
        reviewerId: (user as any).id,
        statusAfter: 'APPROVED',
      },
    }),
    prisma.organization.count({ where: { status: 'CLARIFICATION_REQUESTED' } }),
    prisma.organization.count({ where: { status: 'APPROVED' } }),
  ]);

  return NextResponse.json({
    success: true,
    data: { pending, approvedByMe, clarificationRequested, totalApproved },
  });
}
