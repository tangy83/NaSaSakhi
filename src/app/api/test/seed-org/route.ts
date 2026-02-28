// Test-only endpoint: seed and clean up organizations for E2E tests
// ONLY active in non-production environments

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function getPrisma() {
  const m = await import('@/lib/prisma');
  return m.default;
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const prisma = await getPrisma();

  // Find first available reference data to build a valid org
  const [city, category, resource, language] = await Promise.all([
    prisma.city.findFirst({ select: { id: true, stateId: true } }),
    prisma.serviceCategory.findFirst({ select: { id: true } }),
    prisma.serviceResource.findFirst({ select: { id: true } }),
    prisma.language.findFirst({ where: { isActive: true }, select: { id: true } }),
  ]);

  if (!city || !category || !resource || !language) {
    return NextResponse.json(
      { error: 'Required reference data (city, category, resource, language) not found. Run seed first.' },
      { status: 500 }
    );
  }

  const timestamp = Date.now();
  const orgName = `E2E Test Org ${timestamp}`;
  const regNumber = `E2E-TEST-${timestamp}`;

  const org = await prisma.$transaction(async (tx) => {
    // 1. Create the organization
    const newOrg = await tx.organization.create({
      data: {
        name: orgName,
        registrationType: 'NGO',
        registrationNumber: regNumber,
        yearEstablished: 2020,
        status: 'PENDING',
      },
    });

    // 2. Primary contact
    await tx.contactInformation.create({
      data: {
        organizationId: newOrg.id,
        isPrimary: true,
        name: 'E2E Test Contact',
        isdCode: '+91',
        phone: '9876543210',
        email: `e2e-test-${timestamp}@test.naarisamata.internal`,
      },
    });

    // 3. Branch with all required relations
    const branch = await tx.organizationBranch.create({
      data: {
        organizationId: newOrg.id,
        addressLine1: '123 E2E Test Street',
        cityId: city.id,
        stateId: city.stateId,
        pinCode: '560001',
      },
    });

    // 4. Link category and resource to branch
    await tx.branchCategory.create({
      data: { branchId: branch.id, categoryId: category.id },
    });

    await tx.branchResource.create({
      data: { branchId: branch.id, resourceId: resource.id },
    });

    // 5. Branch timings (all closed — minimal valid record)
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    await tx.branchTimings.createMany({
      data: days.map((day) => ({
        branchId: branch.id,
        dayOfWeek: day as any,
        isClosed: true,
      })),
    });

    // 6. Language
    await tx.organizationLanguage.create({
      data: { organizationId: newOrg.id, languageId: language.id },
    });

    // 7. Registration certificate document (placeholder)
    await tx.document.create({
      data: {
        organizationId: newOrg.id,
        type: 'REGISTRATION_CERTIFICATE',
        fileUrl: '/test/placeholder.pdf',
        filename: 'placeholder.pdf',
        fileSize: 1,
        mimeType: 'application/pdf',
      },
    });

    return newOrg;
  });

  return NextResponse.json({ id: org.id, name: org.name });
}

export async function DELETE(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const orgId = req.nextUrl.searchParams.get('orgId');
  if (!orgId) {
    return NextResponse.json({ error: 'orgId is required' }, { status: 400 });
  }

  const prisma = await getPrisma();

  // Cascade deletes are set on all child models — single delete is sufficient
  await prisma.organization.deleteMany({ where: { id: orgId } });

  return NextResponse.json({ ok: true });
}
