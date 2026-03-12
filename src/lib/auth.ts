// Authentication utilities for the volunteer portal

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

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

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
}

export async function isAdminOrVolunteer() {
  const user = await getCurrentUser();
  return (
    user?.role === 'ADMIN' ||
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'VOLUNTEER'
  );
}

export async function isTranslator() {
  const user = await getCurrentUser();
  return user?.role === 'TRANSLATOR';
}

export async function isAdminOrVolunteerOrTranslator() {
  const user = await getCurrentUser();
  return (
    user?.role === 'ADMIN' ||
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'VOLUNTEER' ||
    user?.role === 'TRANSLATOR'
  );
}

// Stage 1: Volunteers move PENDING → VOLUNTEER_APPROVED | REJECTED | CLARIFICATION_REQUESTED | ARCHIVED
export async function canDoStage1Review() {
  const user = await getCurrentUser();
  return (
    user?.role === 'VOLUNTEER' ||
    user?.role === 'ADMIN' ||
    user?.role === 'SUPER_ADMIN'
  );
}

// Stage 2: Translators move VOLUNTEER_APPROVED → APPROVED | REJECTED | CLARIFICATION_REQUESTED | ARCHIVED
export async function canDoStage2Review() {
  const user = await getCurrentUser();
  return (
    user?.role === 'TRANSLATOR' ||
    user?.role === 'ADMIN' ||
    user?.role === 'SUPER_ADMIN'
  );
}
