import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * POST /api/upload/document
 * Upload a registration document (PDF, JPEG, PNG)
 * Max size: 5MB
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
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Only PDF, JPEG, and PNG are allowed.',
        },
        { status: 400 }
      );
    }

    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: 'File size exceeds 5MB limit',
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${originalName}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads/documents
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'documents');
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return URL path (relative to public)
    const url = `/uploads/documents/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        fileUrl: url,
        filename,
        size: file.size,
        type: file.type,
      },
      message: 'Document uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload document',
      },
      { status: 500 }
    );
  }
}
