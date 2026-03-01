// GET /api/volunteer/organizations/[id]
// Returns full organization record for volunteer review
//
// PATCH /api/volunteer/organizations/[id]
// Edits core org fields + contacts (admin or volunteer only)

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await getAuth();
  const user = await auth.getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const allowed = await auth.isAdminOrVolunteer();
  if (!allowed) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const prisma = await getPrisma();

  const existing = await prisma.organization.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

  const body = await req.json();
  const { name, registrationType, registrationNumber, yearEstablished, description, websiteUrl, contacts } = body;

  await prisma.$transaction(async (tx) => {
    // Update core org fields (only include fields that were sent)
    await tx.organization.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(registrationType !== undefined && { registrationType }),
        ...(registrationNumber !== undefined && { registrationNumber }),
        ...(yearEstablished !== undefined && { yearEstablished: Number(yearEstablished) }),
        ...(description !== undefined && { description }),
        ...(websiteUrl !== undefined && { websiteUrl }),
      },
    });

    // Update contacts if provided
    if (Array.isArray(contacts)) {
      for (const c of contacts) {
        if (!c.id) continue;
        await tx.contactInformation.update({
          where: { id: c.id },
          data: {
            name: c.name,
            isdCode: c.isdCode,
            phone: c.phone,
            email: c.email,
            facebookUrl: c.facebookUrl || null,
            instagramHandle: c.instagramHandle || null,
            twitterHandle: c.twitterHandle || null,
          },
        });
      }
    }

    // Audit log
    await tx.auditLog.create({
      data: {
        actorId: (user as any).id,
        actorRole: (user as any).role,
        action: 'ORG_EDITED',
        entityType: 'Organization',
        entityId: id,
        metadata: { editedFields: Object.keys(body) },
      },
    });
  });

  const updated = await prisma.organization.findUnique({
    where: { id },
    include: {
      branches: { include: { city: true, state: true, timings: true, categories: { include: { category: true } }, resources: { include: { resource: true } } } },
      contacts: true,
      languages: { include: { language: true } },
      documents: true,
      reviewNotes: { include: { reviewer: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: 'desc' } },
    },
  });

  return NextResponse.json({ success: true, data: updated });
}
