// Type definitions for NextAuth to extend default types

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: 'ORGANIZATION' | 'ADMIN' | 'SUPER_ADMIN';
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: 'ORGANIZATION' | 'ADMIN' | 'SUPER_ADMIN';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'ORGANIZATION' | 'ADMIN' | 'SUPER_ADMIN';
  }
}
