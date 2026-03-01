import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { put } from '@vercel/blob';

/**
 * POST /api/upload/logo
 * Upload an organization logo (JPEG, PNG, SVG)
 * Max size: 2MB
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided',
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Only JPEG, PNG, and SVG are allowed.',
        },
        { status: 400 }
      );
    }

    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: 'File size exceeds 2MB limit',
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `logos/${timestamp}-${originalName}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      data: {
        fileUrl: blob.url,
        filename: blob.pathname,
        size: file.size,
        type: file.type,
      },
      message: 'Logo uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload logo',
      },
      { status: 500 }
    );
  }
}
