// GET  /api/admin/service-resources — list all resources with category
// POST /api/admin/service-resources — create a new resource (ADMIN only)

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

    const resources = await prisma.serviceResource.findMany({
      orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
      include: { category: { select: { id: true, name: true, targetGroup: true } } },
    });

    return NextResponse.json({ success: true, data: resources });
  } catch (error) {
    console.error('[admin/service-resources GET]', error);
    return NextResponse.json({ success: false, error: 'Failed to load service resources' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const allowed = await isAdmin();
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, categoryId } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ success: false, error: 'name and categoryId are required' }, { status: 400 });
    }

    const resource = await prisma.serviceResource.create({
      data: { name: name.trim(), description: description?.trim() || null, categoryId },
      include: { category: { select: { id: true, name: true, targetGroup: true } } },
    });

    return NextResponse.json({ success: true, data: resource }, { status: 201 });
  } catch (error) {
    console.error('[admin/service-resources POST]', error);
    return NextResponse.json({ success: false, error: 'Failed to create service resource' }, { status: 500 });
  }
}
