// Middleware for:
// 1. CORS (API routes)
// 2. Locale injection — reads ?lang= and sets x-locale header for next-intl

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'mr', 'bn', 'gu', 'pa', 'or', 'as', 'ur'];

export function middleware(request: NextRequest) {
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const origin = request.headers.get('origin');

  // Get allowed origins from environment variable
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
  const allowedOrigins = allowedOriginsEnv.split(',').filter(Boolean);

  // For development, allow localhost
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000', 'http://localhost:4000');
  }

  // Handle preflight requests (API only)
  if (isApiRoute && request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });

    if (origin && (allowedOrigins.includes(origin) || allowedOrigins.includes('*'))) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Max-Age', '86400');
    }

    return response;
  }

  const response = NextResponse.next();

  // CORS headers for API routes
  if (isApiRoute && origin && (allowedOrigins.includes(origin) || allowedOrigins.includes('*'))) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // Inject locale header for page routes
  if (!isApiRoute) {
    const langParam = request.nextUrl.searchParams.get('lang');
    const locale = langParam && SUPPORTED_LOCALES.includes(langParam) ? langParam : 'en';
    response.headers.set('x-locale', locale);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
