// Type definitions for NextAuth to extend default Session/User types

import 'next-auth';
import 'next-auth/jwt';

export type UserRole = 'ORGANIZATION' | 'ADMIN' | 'SUPER_ADMIN' | 'VOLUNTEER';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: UserRole;
      volunteerId?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: UserRole;
    volunteerId?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    volunteerId?: string | null;
  }
}
