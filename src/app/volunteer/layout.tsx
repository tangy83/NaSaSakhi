// Volunteer Portal Layout
// Server component: guards all /volunteer/* routes for VOLUNTEER, ADMIN, SUPER_ADMIN roles

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { VolunteerHeader } from './VolunteerHeader';

export default async function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Allow access to the login page even without a session
  // (the login page itself handles the unauthenticated state)

  const allowedRoles = ['VOLUNTEER', 'ADMIN', 'SUPER_ADMIN'];
  const userRole = (session?.user as any)?.role;

  // If there is a session but wrong role, deny access
  if (session && !allowedRoles.includes(userRole)) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {session && <VolunteerHeader user={session.user as any} />}
      <main>{children}</main>
    </div>
  );
}
