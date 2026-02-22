// Test-only endpoint: seed and clean up volunteer users for E2E tests
// ONLY active in non-production environments

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export const dynamic = 'force-dynamic';

async function getPrisma() {
  const m = await import('@/lib/prisma');
  return m.default;
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const { volunteerId, password, name } = await req.json();

  if (!volunteerId || !password) {
    return NextResponse.json({ error: 'volunteerId and password are required' }, { status: 400 });
  }

  const prisma = await getPrisma();
  const hashedPassword = await bcrypt.hash(password, 10);

  // Use a deterministic email for test users
  const email = `test-volunteer-${volunteerId}@test.naarisamata.internal`;

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: name || `Test Volunteer ${volunteerId}`,
      password: hashedPassword,
      role: 'VOLUNTEER',
      volunteerId,
    },
    update: {
      password: hashedPassword,
      name: name || `Test Volunteer ${volunteerId}`,
      volunteerId,
    },
  });

  return NextResponse.json({ id: user.id });
}

export async function DELETE(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const volunteerId = req.nextUrl.searchParams.get('volunteerId');
  if (!volunteerId) {
    return NextResponse.json({ error: 'volunteerId is required' }, { status: 400 });
  }

  const prisma = await getPrisma();
  const email = `test-volunteer-${volunteerId}@test.naarisamata.internal`;

  await prisma.user.deleteMany({ where: { email } });

  return NextResponse.json({ ok: true });
}
