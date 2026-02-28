'use client';

// Volunteer Dashboard — main landing page after login
// Shows summary stats and the organization review queue

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface DashboardStats {
  pending: number;
  approvedByMe: number;
  clarificationRequested: number;
  totalApproved: number;
}

interface OrgQueueItem {
  id: string;
  name: string;
  registrationType: string;
  cityName: string | null;
  stateName: string | null;
  status: string;
  submittedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data as T;
}

export default function VolunteerDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orgs, setOrgs] = useState<OrgQueueItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/volunteer/login');
    }
  }, [status, router]);

  // Fetch dashboard stats
  useEffect(() => {
    if (status !== 'authenticated') return;

    fetchJSON<DashboardStats>(`${API_BASE}/volunteer/dashboard`)
      .then(setStats)
      .catch(() => setError('Failed to load dashboard stats'));
  }, [status]);

  // Fetch org queue
  useEffect(() => {
    if (status !== 'authenticated') return;
    setLoading(true);
    fetchJSON<{ organizations: OrgQueueItem[]; pagination: Pagination }>(
      `${API_BASE}/volunteer/organizations?status=${statusFilter}`
    )
      .then(({ organizations, pagination }) => {
        setOrgs(organizations);
        setPagination(pagination);
        setError('');
      })
      .catch(() => setError('Failed to load organizations'))
      .finally(() => setLoading(false));
  }, [status, statusFilter]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page title */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl text-gray-800 font-medium">Dashboard</h1>
          <p className="font-body text-gray-500 mt-1">
            Manage organization registrations and reviews
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => router.push('/volunteer/admin/create-user')}
            className="font-body text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-400 px-3 py-1.5 rounded-lg transition-colors"
          >
            + Create User
          </button>
        )}
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Awaiting Review" value={stats.pending} highlight />
          <StatCard label="Approved by Me" value={stats.approvedByMe} />
          <StatCard label="Needs Clarification" value={stats.clarificationRequested} />
          <StatCard label="Total Approved" value={stats.totalApproved} />
        </div>
      )}

      {/* Admin: Data Management */}
      {isAdmin && (
        <section>
          <h2 className="font-heading text-xl text-gray-800 font-medium mb-4">Data Management</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              {
                title: 'Service Categories',
                description: 'Manage categories for Women & Children services',
                href: '/volunteer/admin/service-categories',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                ),
              },
              {
                title: 'Service Resources',
                description: 'Specific services within each category',
                href: '/volunteer/admin/service-resources',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
              },
              {
                title: 'Faiths',
                description: 'Religious affiliations for organizations',
                href: '/volunteer/admin/faiths',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
              },
              {
                title: 'Social Categories',
                description: 'Social groups served (SC, ST, OBC, Minority)',
                href: '/volunteer/admin/social-categories',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
              {
                title: 'Regional Data',
                description: 'States & cities for branch locations',
                href: '/volunteer/admin/regions',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
              {
                title: 'Languages',
                description: 'Languages for multi-lingual data support',
                href: '/volunteer/admin/languages',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                ),
              },
            ].map((tile) => (
              <button
                key={tile.href}
                onClick={() => router.push(tile.href)}
                className="
                  bg-white border border-gray-200 rounded-xl p-5 text-left
                  hover:border-primary-300 hover:shadow-sm transition-all duration-150
                  focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
                "
              >
                <div className="text-primary-600 mb-3">{tile.icon}</div>
                <h3 className="font-body text-sm font-semibold text-gray-800 mb-1">{tile.title}</h3>
                <p className="font-body text-xs text-gray-500 leading-snug">{tile.description}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Coming Soon — Translation features */}
      <section>
        <h2 className="font-heading text-xl text-gray-800 font-medium mb-4">Coming Soon</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-left opacity-60 cursor-not-allowed">
            <div className="text-gray-400 mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-body text-sm font-semibold text-gray-500">Language Coverage</h3>
              <span className="font-body text-xs font-semibold text-gray-400 bg-gray-200 rounded-full px-2 py-0.5">
                Coming Soon
              </span>
            </div>
            <p className="font-body text-xs text-gray-400 leading-snug">
              Translation progress across all approved organizations and languages
            </p>
          </div>
        </div>
      </section>

      {/* Organization queue */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl text-gray-800 font-medium">Organizations</h2>

          {/* Status filter tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {['PENDING', 'CLARIFICATION_REQUESTED', 'APPROVED', 'REJECTED'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`
                  font-body text-xs font-medium px-3 py-1.5 rounded-md transition-colors
                  ${statusFilter === s
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-error-50 border border-error-500 rounded-lg px-4 py-3 mb-4">
            <p className="font-body text-sm text-error-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : orgs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <p className="font-body text-gray-500">
              No organizations with status <strong>{statusFilter.replace('_', ' ')}</strong>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3">
                    Organization
                  </th>
                  <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3 hidden sm:table-cell">
                    Type
                  </th>
                  <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3 hidden md:table-cell">
                    Location
                  </th>
                  <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3 hidden lg:table-cell">
                    Submitted
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orgs.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-body text-sm font-medium text-gray-800">
                        {org.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="font-body text-sm text-gray-500">
                        {org.registrationType}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="font-body text-sm text-gray-500">
                        {[org.cityName, org.stateName].filter(Boolean).join(', ') || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="font-body text-sm text-gray-400">
                        {new Date(org.submittedAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => router.push(`/volunteer/organizations/${org.id}/review`)}
                        className="
                          font-body text-sm font-medium text-primary-600 hover:text-primary-700
                          border border-primary-200 hover:border-primary-400
                          px-3 py-1.5 rounded-lg transition-colors
                        "
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination info */}
            {pagination && pagination.totalPages > 1 && (
              <div className="border-t border-gray-100 px-4 py-3">
                <p className="font-body text-sm text-gray-400">
                  Page {pagination.page} of {pagination.totalPages} — {pagination.total} organizations total
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`
        rounded-xl border p-5
        ${highlight
          ? 'bg-primary-50 border-primary-200'
          : 'bg-white border-gray-200'
        }
      `}
    >
      <p
        className={`
          font-body text-xs font-medium uppercase tracking-wide mb-1
          ${highlight ? 'text-primary-600' : 'text-gray-500'}
        `}
      >
        {label}
      </p>
      <p
        className={`
          font-heading text-3xl font-semibold
          ${highlight ? 'text-primary-700' : 'text-gray-800'}
        `}
      >
        {value}
      </p>
    </div>
  );
}
