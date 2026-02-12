# Authentication Setup Guide

## Overview

NextAuth.js is configured for email/password authentication using credentials provider with bcrypt password hashing.

## Configuration

### Environment Variables

Ensure these are set in `.env`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-min-32-characters
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Files Created

1. **`/src/app/api/auth/[...nextauth]/route.ts`** - NextAuth route handler
2. **`/src/app/api/auth/signup/route.ts`** - User signup endpoint
3. **`/src/lib/auth.ts`** - Authentication helper functions
4. **`/src/types/next-auth.d.ts`** - TypeScript type definitions

## API Endpoints

### Signup
**POST** `/api/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",  // Optional
  "role": "ORGANIZATION"  // Optional, defaults to ORGANIZATION
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "ORGANIZATION"
    },
    "message": "User created successfully"
  }
}
```

### Login (NextAuth)
**POST** `/api/auth/callback/credentials`

Login with email and password (NextAuth endpoint).

**Request Body (form-urlencoded):**
```
email=user@example.com&password=SecurePassword123!&redirect=false
```

**Response:** NextAuth session cookie

### Get Session
**GET** `/api/auth/session`

Get current user session.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ORGANIZATION"
  },
  "expires": "2026-03-11T16:29:04.294Z"
}
```

### Sign Out
**POST** `/api/auth/signout`

Sign out current user.

## Usage in Frontend

### Signup Example
```typescript
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePassword123!',
    name: 'John Doe',
  }),
});

const data = await response.json();
```

### Login Example (NextAuth)
```typescript
import { signIn } from 'next-auth/react';

await signIn('credentials', {
  email: 'user@example.com',
  password: 'SecurePassword123!',
  redirect: false,
});
```

### Get Session Example
```typescript
import { getSession } from 'next-auth/react';

const session = await getSession();
if (session?.user) {
  console.log('Logged in as:', session.user.email);
}
```

## Server-Side Usage

### Check Authentication
```typescript
import { getSession, isAuthenticated, hasRole } from '@/lib/auth';

// Get current session
const session = await getSession();

// Check if authenticated
if (await isAuthenticated()) {
  // User is logged in
}

// Check role
if (await hasRole('ADMIN')) {
  // User is admin
}
```

### Protect API Routes
```typescript
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // User is authenticated
  return NextResponse.json({ data: 'Protected data' });
}
```

## Password Requirements

- Minimum 8 characters
- Stored as bcrypt hash (10 salt rounds)
- Never stored in plain text

## User Roles

- `ORGANIZATION` - Default role for organization users
- `ADMIN` - Administrative access
- `SUPER_ADMIN` - Super administrative access

## Session Configuration

- Strategy: JWT (JSON Web Token)
- Max Age: 30 days
- Stored in HTTP-only cookie

## Testing

Run the test script:
```bash
npx tsx scripts/test-auth.ts
```

This will:
1. Test user signup
2. Test login
3. Test session retrieval

## Security Notes

1. **Password Hashing**: All passwords are hashed with bcrypt (10 salt rounds)
2. **JWT Tokens**: Sessions use JWT tokens, not database sessions
3. **HTTP-Only Cookies**: Session cookies are HTTP-only for security
4. **CSRF Protection**: NextAuth includes CSRF protection
5. **Password Validation**: Minimum 8 characters enforced

## Troubleshooting

### "NEXTAUTH_SECRET is not set"
- Add `NEXTAUTH_SECRET` to `.env`
- Generate a secure secret: `openssl rand -base64 32`

### "Invalid email or password"
- Check if user exists in database
- Verify password is correct
- Check if user has a password set (not OAuth-only account)

### Session not persisting
- Check `NEXTAUTH_URL` matches your app URL
- Verify cookies are enabled in browser
- Check CORS settings if frontend/backend are separate

## Next Steps

1. Create frontend signup/login pages
2. Add password reset functionality (optional)
3. Add email verification (optional)
4. Add OAuth providers (Google, GitHub, etc.) if needed
