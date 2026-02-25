// User Signup Endpoint
// POST /api/auth/signup
// Creates a new user account with hashed password.
// Restricted to ADMIN and SUPER_ADMIN users only.

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';

// Prevent static generation - this route must be dynamic
export const dynamic = 'force-dynamic';

// Validation schema
const signupSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  role: z.enum(['ORGANIZATION', 'VOLUNTEER', 'ADMIN', 'SUPER_ADMIN']).optional().default('ORGANIZATION'),
  volunteerId: z.string().min(3, 'Volunteer ID must be at least 3 characters').optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Only ADMIN or SUPER_ADMIN can create accounts via this endpoint
    const { isAdmin } = await import('@/lib/auth');
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Only admins can create accounts.' },
        { status: 401 }
      );
    }

    // Dynamic import to avoid loading Prisma during build phase
    const { default: prisma } = await import('@/lib/prisma');

    const body = await request.json();

    // Validate input
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return NextResponse.json(
        {
          success: false,
          errors,
        },
        { status: 400 }
      );
    }

    const { email, password, name, role, volunteerId } = validationResult.data;

    // Volunteers log in by volunteerId, not email — require volunteerId for VOLUNTEER role
    if (role === 'VOLUNTEER' && !volunteerId) {
      return NextResponse.json(
        { success: false, error: 'volunteerId is required when creating a VOLUNTEER account' },
        { status: 400 }
      );
    }

    // Check for duplicate email (if provided)
    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'User with this email already exists' },
          { status: 409 }
        );
      }
    }

    // Check for duplicate volunteerId (if provided)
    if (volunteerId) {
      const existingVolunteer = await prisma.user.findUnique({ where: { volunteerId } });
      if (existingVolunteer) {
        return NextResponse.json(
          { success: false, error: 'A user with this Volunteer ID already exists' },
          { status: 409 }
        );
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email || null,
        password: hashedPassword,
        name: name || null,
        role,
        volunteerId: volunteerId || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        volunteerId: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            volunteerId: user.volunteerId,
          },
          message: 'User created successfully',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
