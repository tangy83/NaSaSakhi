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

  const allowed = await auth.isAdminOrVolunteerOrTranslator();
  if (!allowed) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const prisma = await getPrisma();

  const [pending, volunteerApproved, clarificationRequested, totalApproved] = await Promise.all([
    prisma.organization.count({ where: { status: 'PENDING' } }),
    prisma.organization.count({ where: { status: 'VOLUNTEER_APPROVED' } }),
    prisma.organization.count({ where: { status: 'CLARIFICATION_REQUESTED' } }),
    prisma.organization.count({ where: { status: 'APPROVED' } }),
  ]);

  return NextResponse.json({
    success: true,
    data: { pending, volunteerApproved, approvedByMe: 0, clarificationRequested, totalApproved },
  });
}
