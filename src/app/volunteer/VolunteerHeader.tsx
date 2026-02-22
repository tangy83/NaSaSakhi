'use client';

// Volunteer portal top navigation header
// Rendered inside the server layout once session is confirmed

import { signOut } from 'next-auth/react';

interface VolunteerHeaderProps {
  user: {
    name?: string | null;
    email: string;
    role: string;
    volunteerId?: string | null;
  };
}

export function VolunteerHeader({ user }: VolunteerHeaderProps) {
  const displayName = user.name || user.volunteerId || user.email;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="font-heading text-xl text-primary-600 font-semibold">
              NaariSamata
            </span>
            <span className="text-gray-300">|</span>
            <span className="font-body text-sm text-gray-600">Volunteer Portal</span>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-body text-sm font-medium text-gray-800">{displayName}</p>
              <p className="font-body text-xs text-gray-500 capitalize">
                {user.role.replace('_', ' ').toLowerCase()}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/volunteer/login' })}
              className="
                font-body text-sm font-medium text-gray-600 hover:text-primary-600
                border border-gray-300 hover:border-primary-400
                px-4 py-2 rounded-lg transition-colors duration-150
              "
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
