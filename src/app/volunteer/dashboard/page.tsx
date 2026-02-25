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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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
