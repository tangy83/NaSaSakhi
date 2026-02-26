// GET  /api/admin/regions — list all states with their cities
// POST /api/admin/regions — add a new city to a state (ADMIN only)

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
  try {
    const auth = await getAuth();
    const allowed = await auth.isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = await getPrisma();

    const states = await prisma.state.findMany({
      orderBy: { name: 'asc' },
      include: {
        cities: { orderBy: { name: 'asc' } },
      },
    });

    return NextResponse.json({ success: true, data: states });
  } catch (error) {
    console.error('[admin/regions GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load regional data' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuth();
    const allowed = await auth.isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, stateId } = body;

    if (!name || !stateId) {
      return NextResponse.json(
        { success: false, error: 'name and stateId are required' },
        { status: 400 }
      );
    }

    const prisma = await getPrisma();

    const city = await prisma.city.create({
      data: { name: name.trim(), stateId },
      include: { state: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ success: true, data: city }, { status: 201 });
  } catch (error) {
    console.error('[admin/regions POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create city' },
      { status: 500 }
    );
  }
}
