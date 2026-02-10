import { NextRequest, NextResponse } from 'next/server';

/**
 * NextAuth Proxy Route
 *
 * This route proxies all authentication requests to the backend server.
 * The backend handles the actual NextAuth logic and returns responses.
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

async function handleAuthRequest(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Extract the NextAuth path (everything after /api/auth/)
  const authPath = pathname.replace('/api/auth', '');

  // Build backend URL
  const backendUrl = `${BACKEND_URL}/api/auth${authPath}${
    searchParams.toString() ? `?${searchParams.toString()}` : ''
  }`;

  console.log(`[Auth Proxy] ${request.method} ${pathname} → ${backendUrl}`);

  try {
    // Get request body if present
    let body: string | undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const contentType = request.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const jsonBody = await request.json();
        body = JSON.stringify(jsonBody);
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        body = new URLSearchParams(formData as any).toString();
      } else {
        body = await request.text();
      }
    }

    // Forward request to backend
    const backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
        'Cookie': request.headers.get('cookie') || '',
        'User-Agent': request.headers.get('user-agent') || '',
      },
      body,
      credentials: 'include',
    });

    // Get response body
    const responseText = await backendResponse.text();

    // Create response with same status and headers
    const response = new NextResponse(responseText, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
    });

    // Forward important headers from backend
    const headersToForward = [
      'content-type',
      'set-cookie',
      'cache-control',
      'location',
    ];

    headersToForward.forEach((header) => {
      const value = backendResponse.headers.get(header);
      if (value) {
        if (header === 'set-cookie') {
          // Handle multiple Set-Cookie headers
          const cookies = backendResponse.headers.getSetCookie();
          cookies.forEach((cookie) => {
            response.headers.append('set-cookie', cookie);
          });
        } else {
          response.headers.set(header, value);
        }
      }
    });

    return response;
  } catch (error) {
    console.error('[Auth Proxy] Error:', error);
    return NextResponse.json(
      {
        error: 'Authentication proxy error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Export handlers for all HTTP methods
export async function GET(request: NextRequest) {
  return handleAuthRequest(request);
}

export async function POST(request: NextRequest) {
  return handleAuthRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleAuthRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleAuthRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleAuthRequest(request);
}
