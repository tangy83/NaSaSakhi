// GET  /api/admin/regions — list all states with their cities
// POST /api/admin/regions — add a new city to a state (ADMIN only)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allowed = await isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const states = await prisma.state.findMany({
      orderBy: { name: 'asc' },
      include: { cities: { orderBy: { name: 'asc' } } },
    });

    return NextResponse.json({ success: true, data: states });
  } catch (error) {
    console.error('[admin/regions GET]', error);
    return NextResponse.json({ success: false, error: 'Failed to load regional data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const allowed = await isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, stateId } = body;

    if (!name || !stateId) {
      return NextResponse.json({ success: false, error: 'name and stateId are required' }, { status: 400 });
    }

    const city = await prisma.city.create({
      data: { name: name.trim(), stateId },
    });

    return NextResponse.json({ success: true, data: city }, { status: 201 });
  } catch (error) {
    console.error('[admin/regions POST]', error);
    return NextResponse.json({ success: false, error: 'Failed to create city' }, { status: 500 });
  }
}
