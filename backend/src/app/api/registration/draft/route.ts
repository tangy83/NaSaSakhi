// Draft Save Endpoint
// Test: POST http://localhost:3000/api/registration/draft

import { NextRequest, NextResponse } from 'next/server';

// Prevent static generation - this route must be dynamic
export const dynamic = 'force-dynamic';

// POST - Save draft
export async function POST(request: NextRequest) {
  try {
    // Dynamic import to avoid loading Prisma during build phase
    const { default: prisma } = await import('@/lib/prisma');

    const body = await request.json();
    const { email, draftData } = body;

    // Validate required fields
    if (!draftData) {
      return NextResponse.json(
        {
          success: false,
          error: 'draftData is required',
        },
        { status: 400 }
      );
    }

    // Set expiry to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const draft = await prisma.registrationDraft.create({
      data: {
        email,
        draftData,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        token: draft.token,
        expiresAt: draft.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save draft',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
