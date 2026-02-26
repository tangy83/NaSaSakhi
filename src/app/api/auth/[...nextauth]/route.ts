// NextAuth.js Route Handler — Root Project
// Handles /api/auth/* for the volunteer portal UI
// authOptions lives in src/lib/authOptions.ts to avoid the Next.js route
// named-export restriction (only GET/POST/etc. are valid route exports).

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
