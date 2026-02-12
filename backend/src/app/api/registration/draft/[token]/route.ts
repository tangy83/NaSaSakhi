// Draft Load/Delete Endpoint
// Test: GET http://localhost:3000/api/registration/draft/<token>
// Test: DELETE http://localhost:3000/api/registration/draft/<token>

import { NextRequest, NextResponse } from 'next/server';

// Prevent static generation - this route must be dynamic
export const dynamic = 'force-dynamic';

// GET - Load draft
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // Dynamic import to avoid loading Prisma during build phase
    const { default: prisma } = await import('@/lib/prisma');

    const { token } = await params;

    const draft = await prisma.registrationDraft.findUnique({
      where: { token },
    });

    if (!draft) {
      return NextResponse.json(
        {
          success: false,
          error: 'Draft not found or expired',
        },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date() > draft.expiresAt) {
      // Delete expired draft
      await prisma.registrationDraft.delete({ where: { token } });

      return NextResponse.json(
        {
          success: false,
          error: 'Draft has expired',
        },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      data: draft.draftData,
    });
  } catch (error) {
    console.error('Error loading draft:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load draft',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete draft
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // Dynamic import to avoid loading Prisma during build phase
    const { default: prisma } = await import('@/lib/prisma');

    const { token } = await params;

    await prisma.registrationDraft.delete({
      where: { token },
    });

    return NextResponse.json({
      success: true,
      message: 'Draft deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting draft:', error);
    
    // Handle case where draft doesn't exist
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Draft not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete draft',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
