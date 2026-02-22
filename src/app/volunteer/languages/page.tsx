'use client';

// Language Coverage Dashboard
// Shows translation coverage per language and allows admins to add/toggle languages

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { TextInput } from '@/components/form/TextInput';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface LanguageCoverageRow {
  languageId: string;
  languageName: string;
  languageCode: string;
  scriptFamily: string;
  fontFamily: string;
  isRTL: boolean;
  isActive: boolean;
  totalOrganizations: number;
  machineTranslated: number;
  volunteerReviewed: number;
  failed: number;
  coveragePercent: number;
}

interface CoverageSummary {
  totalApprovedOrganizations: number;
  languagesWithFullCoverage: number;
  languagesWithPartialCoverage: number;
  languages: LanguageCoverageRow[];
}

type FilterType = 'ALL' | 'NOT_TRANSLATED' | 'MACHINE_ONLY' | 'VOLUNTEER_REVIEWED' | 'INACTIVE';

export default function LanguagesDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [summary, setSummary] = useState<CoverageSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [toggling, setToggling] = useState<string>('');

  // Add language form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    code: '',
    scriptFamily: '',
    isRTL: false,
    fontFamily: '',
    googleFontName: '',
  });
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);

  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/volunteer/login');
  }, [status, router]);

  function loadData() {
    if (status !== 'authenticated') return;
    setLoading(true);
    fetch(`${API_BASE}/admin/languages`, { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        setSummary(json.data);
        setError('');
      })
      .catch(() => setError('Failed to load language coverage data'))
      .finally(() => setLoading(false));
  }

  useEffect(loadData, [status]);

  async function toggleLanguage(languageId: string, currentlyActive: boolean) {
    setToggling(languageId);
    try {
      const res = await fetch(`${API_BASE}/admin/languages/${languageId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentlyActive }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update language');
    } finally {
      setToggling('');
    }
  }

  async function handleAddLanguage(e: React.FormEvent) {
    e.preventDefault();
    setAddError('');
    const { name, code, scriptFamily, fontFamily, googleFontName } = addForm;
    if (!name || !code || !scriptFamily || !fontFamily || !googleFontName) {
      setAddError('All fields are required');
      return;
    }

    setAdding(true);
    try {
      const res = await fetch(`${API_BASE}/admin/languages`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      setShowAddForm(false);
      setAddForm({ name: '', code: '', scriptFamily: '', isRTL: false, fontFamily: '', googleFontName: '' });
      loadData();
    } catch (err: any) {
      setAddError(err.message || 'Failed to add language');
    } finally {
      setAdding(false);
    }
  }

  const filteredLanguages = (summary?.languages ?? []).filter((lang) => {
    if (filter === 'NOT_TRANSLATED') return lang.machineTranslated === 0 && lang.volunteerReviewed === 0 && lang.isActive;
    if (filter === 'MACHINE_ONLY') return lang.machineTranslated > 0 && lang.volunteerReviewed === 0;
    if (filter === 'VOLUNTEER_REVIEWED') return lang.volunteerReviewed > 0;
    if (filter === 'INACTIVE') return !lang.isActive;
    return true;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-gray-800 font-medium">Language Coverage</h1>
          <p className="font-body text-gray-500 mt-1">
            Track translation completeness across all active languages
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="
              font-body text-sm font-medium bg-primary-500 hover:bg-primary-600
              text-white px-4 py-2 rounded-lg transition-colors
            "
          >
            {showAddForm ? 'Cancel' : '+ Add Language'}
          </button>
        )}
      </div>

      {/* Add language form */}
      {showAddForm && isAdmin && (
        <form
          onSubmit={handleAddLanguage}
          className="bg-white border border-primary-200 rounded-xl p-6 space-y-4"
        >
          <h2 className="font-heading text-lg text-gray-800 font-medium">Add New Language</h2>
          <div className="grid grid-cols-2 gap-4">
            <TextInput label="Language Name" value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} required />
            <TextInput label="ISO 639 Code" value={addForm.code} onChange={(e) => setAddForm((f) => ({ ...f, code: e.target.value }))} placeholder="e.g. hi, ta, ur" required />
            <TextInput label="Script Family" value={addForm.scriptFamily} onChange={(e) => setAddForm((f) => ({ ...f, scriptFamily: e.target.value }))} placeholder="e.g. Devanagari, Tamil" required />
            <TextInput label="CSS Font Family" value={addForm.fontFamily} onChange={(e) => setAddForm((f) => ({ ...f, fontFamily: e.target.value }))} placeholder="e.g. Noto Sans Devanagari" required />
            <TextInput label="Google Font Name" value={addForm.googleFontName} onChange={(e) => setAddForm((f) => ({ ...f, googleFontName: e.target.value }))} placeholder="e.g. Noto+Sans+Devanagari" required />
            <div className="flex items-center gap-3 mt-6">
              <input
                type="checkbox"
                id="isRTL"
                checked={addForm.isRTL}
                onChange={(e) => setAddForm((f) => ({ ...f, isRTL: e.target.checked }))}
                className="w-4 h-4 text-primary-500"
              />
              <label htmlFor="isRTL" className="font-body text-sm text-gray-700">
                Right-to-left (RTL)
              </label>
            </div>
          </div>
          {addError && (
            <p className="font-body text-sm text-error-600">{addError}</p>
          )}
          <button
            type="submit"
            disabled={adding}
            className="font-body text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            {adding ? 'Adding...' : 'Add Language'}
          </button>
        </form>
      )}

      {/* Summary stats */}
      {summary && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="font-body text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Approved Organizations
            </p>
            <p className="font-heading text-3xl text-gray-800 font-semibold">
              {summary.totalApprovedOrganizations}
            </p>
          </div>
          <div className="bg-success-50 border border-success-200 rounded-xl p-5">
            <p className="font-body text-xs font-medium text-success-600 uppercase tracking-wide mb-1">
              Full Coverage
            </p>
            <p className="font-heading text-3xl text-success-700 font-semibold">
              {summary.languagesWithFullCoverage}
            </p>
          </div>
          <div className="bg-warning-50 border border-warning-200 rounded-xl p-5">
            <p className="font-body text-xs font-medium text-warning-600 uppercase tracking-wide mb-1">
              Partial Coverage
            </p>
            <p className="font-heading text-3xl text-warning-700 font-semibold">
              {summary.languagesWithPartialCoverage}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-error-50 border border-error-500 rounded-lg px-4 py-3">
          <p className="font-body text-sm text-error-600">{error}</p>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(
          [
            { key: 'ALL', label: 'All' },
            { key: 'NOT_TRANSLATED', label: 'Not Translated' },
            { key: 'MACHINE_ONLY', label: 'Machine Only' },
            { key: 'VOLUNTEER_REVIEWED', label: 'Reviewed' },
            { key: 'INACTIVE', label: 'Inactive' },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`
              font-body text-xs font-medium px-3 py-1.5 rounded-md transition-colors
              ${filter === key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Language table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3">Language</th>
              <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3 hidden sm:table-cell">Script</th>
              <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-right px-4 py-3 hidden md:table-cell">Machine</th>
              <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-right px-4 py-3 hidden md:table-cell">Reviewed</th>
              <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3">Coverage</th>
              {isAdmin && (
                <th className="px-4 py-3" />
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLanguages.map((lang) => (
              <tr
                key={lang.languageId}
                className={`hover:bg-gray-50 transition-colors ${!lang.isActive ? 'opacity-50' : ''}`}
              >
                <td className="px-4 py-3">
                  <div>
                    <span className="font-body text-sm font-medium text-gray-800">{lang.languageName}</span>
                    <span className="font-body text-xs text-gray-400 ml-2">{lang.languageCode}</span>
                    {lang.isRTL && (
                      <span className="ml-1 font-body text-xs bg-info-50 text-info-600 px-1.5 py-0.5 rounded-full">RTL</span>
                    )}
                    {!lang.isActive && (
                      <span className="ml-1 font-body text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">Inactive</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="font-body text-sm text-gray-500">{lang.scriptFamily}</span>
                </td>
                <td className="px-4 py-3 text-right hidden md:table-cell">
                  <span className="font-body text-sm text-gray-500">{lang.machineTranslated}</span>
                </td>
                <td className="px-4 py-3 text-right hidden md:table-cell">
                  <span className="font-body text-sm text-gray-500">{lang.volunteerReviewed}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[120px]">
                      <div
                        className="h-full bg-success-500 rounded-full transition-all"
                        style={{ width: `${lang.coveragePercent}%` }}
                      />
                    </div>
                    <span className="font-body text-sm text-gray-500 w-10 text-right">
                      {lang.coveragePercent}%
                    </span>
                  </div>
                </td>
                {isAdmin && (
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleLanguage(lang.languageId, lang.isActive)}
                      disabled={toggling === lang.languageId}
                      className={`
                        font-body text-xs font-medium px-3 py-1 rounded-lg border transition-colors
                        ${lang.isActive
                          ? 'border-error-300 text-error-600 hover:bg-error-50'
                          : 'border-success-300 text-success-600 hover:bg-success-50'
                        }
                        disabled:opacity-60
                      `}
                    >
                      {toggling === lang.languageId
                        ? '...'
                        : lang.isActive
                        ? 'Deactivate'
                        : 'Activate'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLanguages.length === 0 && (
          <div className="text-center py-10">
            <p className="font-body text-gray-500">No languages match this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
