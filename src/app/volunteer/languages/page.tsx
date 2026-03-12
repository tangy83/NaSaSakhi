'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type LanguageRow = {
  languageId: string;
  languageName: string;
  nativeScriptName: string | null;
  languageCode: string;
  scriptFamily: string;
  isRTL: boolean;
  isActive: boolean;
  coveragePercent: number;
  volunteerReviewed: number;
  machineTranslated: number;
  pending: number;
  failed: number;
};

type Summary = {
  totalApproved: number;
  fullCoverage: number;
  partialCoverage: number;
};

type Filter = 'All' | 'Not Translated' | 'Machine Only' | 'Reviewed' | 'Inactive';

const FILTERS: Filter[] = ['All', 'Not Translated', 'Machine Only', 'Reviewed', 'Inactive'];

function applyFilter(rows: LanguageRow[], filter: Filter): LanguageRow[] {
  switch (filter) {
    case 'All':
      return rows.filter((r) => r.isActive);
    case 'Not Translated':
      return rows.filter((r) => r.isActive && r.coveragePercent === 0 && r.machineTranslated === 0);
    case 'Machine Only':
      return rows.filter((r) => r.isActive && r.machineTranslated > 0 && r.volunteerReviewed === 0);
    case 'Reviewed':
      return rows.filter((r) => r.isActive && r.volunteerReviewed > 0);
    case 'Inactive':
      return rows.filter((r) => !r.isActive);
    default:
      return rows;
  }
}

export default function LanguagesDashboardPage() {
  const router = useRouter();
  const { status } = useSession();
  const [languages, setLanguages] = useState<LanguageRow[]>([]);
  const [summary, setSummary] = useState<Summary>({ totalApproved: 0, fullCoverage: 0, partialCoverage: 0 });
  const [filter, setFilter] = useState<Filter>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/volunteer/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/volunteer/languages')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setLanguages(json.data.languages);
          setSummary(json.data.summary);
        } else {
          setError(json.error || 'Failed to load');
        }
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, [status]);

  const filtered = applyFilter(languages, filter);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => router.push('/volunteer/dashboard')}
        className="font-body text-sm text-gray-500 hover:text-primary-600 mb-6 flex items-center gap-1"
      >
        ← Back to Dashboard
      </button>

      <h1 className="font-heading text-2xl font-semibold text-gray-900 mb-2">Language Coverage</h1>
      <p className="font-body text-sm text-gray-500 mb-8">
        Translation coverage for all active languages across approved organisations.
      </p>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="font-body text-xs text-gray-500 uppercase tracking-wide mb-1">Approved Organizations</p>
          <p className="font-heading text-3xl font-bold text-gray-900">{summary.totalApproved}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="font-body text-xs text-gray-500 uppercase tracking-wide mb-1">Full Coverage</p>
          <p className="font-heading text-3xl font-bold text-green-600">{summary.fullCoverage}</p>
          <p className="font-body text-xs text-gray-400 mt-1">languages at 100%</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="font-body text-xs text-gray-500 uppercase tracking-wide mb-1">Partial Coverage</p>
          <p className="font-heading text-3xl font-bold text-amber-500">{summary.partialCoverage}</p>
          <p className="font-body text-xs text-gray-400 mt-1">languages in progress</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full font-body text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-16 text-gray-400 font-body">Loading…</div>
      )}
      {error && (
        <div className="text-center py-16 text-red-500 font-body">{error}</div>
      )}

      {!loading && !error && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-body font-semibold text-gray-600">Language</th>
                <th className="px-4 py-3 text-left font-body font-semibold text-gray-600">Script</th>
                <th className="px-4 py-3 text-left font-body font-semibold text-gray-600">Coverage</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-400 font-body">
                    No languages match this filter
                  </td>
                </tr>
              )}
              {filtered.map((lang) => (
                <tr key={lang.languageId} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-body font-medium text-gray-900">{lang.languageName}</span>
                      {lang.nativeScriptName && (
                        <span className="text-gray-400 font-body text-xs">{lang.nativeScriptName}</span>
                      )}
                      {lang.isRTL && (
                        <span className="bg-purple-100 text-purple-700 text-xs font-body font-semibold px-1.5 py-0.5 rounded">
                          RTL
                        </span>
                      )}
                      {!lang.isActive && (
                        <span className="bg-gray-100 text-gray-500 text-xs font-body px-1.5 py-0.5 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-body text-gray-600">{lang.scriptFamily}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-primary-500 rounded-full"
                          style={{ width: `${lang.coveragePercent}%` }}
                        />
                      </div>
                      <span className="font-body text-xs text-gray-500 w-8 text-right">
                        {lang.coveragePercent}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
