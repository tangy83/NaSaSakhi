import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

/**
 * POST /api/registration/draft
 * Save or update a registration draft
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, data } = body;

    // Generate new token if not provided
    const draftToken = token || randomUUID();

    // Upsert the draft
    const draft = await prisma.registrationDraft.upsert({
      where: { token: draftToken },
      create: {
        token: draftToken,
        data: data,
      },
      update: {
        data: data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        token: draft.token,
        createdAt: draft.createdAt,
        updatedAt: draft.updatedAt,
      },
      message: 'Draft saved successfully',
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save draft',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/registration/draft?token=<token>
 * Load a registration draft by token
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token is required',
        },
        { status: 400 }
      );
    }

    const draft = await prisma.registrationDraft.findUnique({
      where: { token },
      select: {
        token: true,
        data: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!draft) {
      return NextResponse.json(
        {
          success: false,
          error: 'Draft not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: draft,
    });
  } catch (error) {
    console.error('Error loading draft:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load draft',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/registration/draft?token=<token>
 * Delete a registration draft
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token is required',
        },
        { status: 400 }
      );
    }

    await prisma.registrationDraft.delete({
      where: { token },
    });

    return NextResponse.json({
      success: true,
      message: 'Draft deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting draft:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete draft',
      },
      { status: 500 }
    );
  }
}
