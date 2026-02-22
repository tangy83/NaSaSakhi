// Authentication utilities for the volunteer portal

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

export async function isVolunteer() {
  const user = await getCurrentUser();
  return user?.role === 'VOLUNTEER';
}

export async function isAdminOrVolunteer() {
  const user = await getCurrentUser();
  return (
    user?.role === 'ADMIN' ||
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'VOLUNTEER'
  );
}
