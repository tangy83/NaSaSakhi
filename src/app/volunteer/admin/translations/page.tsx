'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Language {
  id: string;
  name: string;
  code: string;
}

interface TranslationCell {
  languageId: string;
  languageCode: string;
  translatedName: string | null;
}

interface CoverageRow {
  entityType: string;
  entityId: string;
  entityName: string;
  translations: TranslationCell[];
}

interface CoverageStat {
  languageId: string;
  languageName: string;
  languageCode: string;
  translated: number;
  total: number;
}

interface EditState {
  entityType: string;
  entityId: string;
  languageId: string;
  value: string;
}

const ENTITY_TYPE_LABELS: Record<string, string> = {
  'service-category': 'Service Category',
  'service-resource': 'Service Resource',
  'faith': 'Faith',
  'social-category': 'Social Category',
};

export default function AdminTranslationsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [languages, setLanguages] = useState<Language[]>([]);
  const [rows, setRows] = useState<CoverageRow[]>([]);
  const [coverageByLang, setCoverageByLang] = useState<CoverageStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [editState, setEditState] = useState<EditState | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const userRole = (session?.user as any)?.role;
  const isAdminUser = ['ADMIN', 'SUPER_ADMIN'].includes(userRole);

  useEffect(() => {
    if (session && !isAdminUser) router.replace('/volunteer/dashboard');
  }, [session, isAdminUser, router]);

  const loadCoverage = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/translations/coverage', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setLanguages(data.data.languages);
        setRows(data.data.rows);
        setCoverageByLang(data.data.coverageByLang);
      } else {
        setErrorMsg(data.error);
      }
    } catch {
      setErrorMsg('Failed to load translation coverage');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoverage();
  }, [loadCoverage]);

  const handleSave = async () => {
    if (!editState) return;
    setIsSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch(
        `/api/admin/translations/${editState.entityType}/${editState.entityId}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ languageId: editState.languageId, translatedName: editState.value }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setEditState(null);
        await loadCoverage();
      } else {
        setErrorMsg(data.error || 'Failed to save');
      }
    } catch {
      setErrorMsg('Failed to save translation');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredRows = filterType === 'all' ? rows : rows.filter((r) => r.entityType === filterType);

  // Non-English languages for the table columns
  const displayLangs = languages.filter((l) => l.code !== 'en');

  if (isLoading) {
    return <div className="max-w-full mx-auto px-4 py-10 text-center text-gray-400">Loading coverage data…</div>;
  }

  return (
    <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-gray-900">Layer 2: Reference Data Translations</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage translated names for service categories, resources, faiths, and social categories.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{errorMsg}</div>
      )}

      {/* Coverage stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {coverageByLang.slice(0, 8).map((stat) => (
          <div key={stat.languageId} className="bg-white border border-gray-200 rounded-lg px-3 py-2">
            <p className="text-xs font-semibold text-gray-700">{stat.languageName}</p>
            <p className="text-lg font-bold text-primary-600 mt-0.5">
              {stat.total > 0 ? Math.round((stat.translated / stat.total) * 100) : 0}%
            </p>
            <p className="text-xs text-gray-400">{stat.translated}/{stat.total} items</p>
          </div>
        ))}
      </div>

      {/* Filter by type */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'service-category', 'service-resource', 'faith', 'social-category'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterType === type
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type === 'all' ? 'All' : ENTITY_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Translation matrix table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 sticky left-0 bg-gray-50 w-48">
                Item (English)
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 w-28">Type</th>
              {displayLangs.map((lang) => (
                <th key={lang.id} className="px-3 py-3 text-left text-xs font-semibold text-gray-600 min-w-[120px]">
                  {lang.name}
                  <span className="ml-1 font-mono text-gray-400 text-[10px]">{lang.code}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRows.map((row) => (
              <tr key={`${row.entityType}:${row.entityId}`} className="hover:bg-gray-50">
                <td className="px-4 py-2.5 text-gray-800 font-medium sticky left-0 bg-white">{row.entityName}</td>
                <td className="px-3 py-2.5 text-gray-400 text-xs">{ENTITY_TYPE_LABELS[row.entityType]}</td>
                {displayLangs.map((lang) => {
                  const cell = row.translations.find((t) => t.languageId === lang.id);
                  const isEditing =
                    editState?.entityId === row.entityId &&
                    editState?.entityType === row.entityType &&
                    editState?.languageId === lang.id;

                  if (isEditing) {
                    return (
                      <td key={lang.id} className="px-2 py-1.5">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            className="w-full px-2 py-1 text-xs border border-primary-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-400"
                            value={editState!.value}
                            onChange={(e) =>
                              setEditState((prev) => prev ? { ...prev, value: e.target.value } : null)
                            }
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave();
                              if (e.key === 'Escape') setEditState(null);
                            }}
                          />
                          <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-1.5 py-1 bg-primary-600 text-white text-xs rounded hover:bg-primary-700 disabled:opacity-50"
                          >
                            {isSaving ? '…' : '✓'}
                          </button>
                          <button
                            onClick={() => setEditState(null)}
                            className="px-1.5 py-1 bg-gray-200 text-gray-600 text-xs rounded hover:bg-gray-300"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td
                      key={lang.id}
                      className="px-3 py-2.5 cursor-pointer hover:bg-primary-50 transition-colors"
                      onClick={() =>
                        setEditState({
                          entityType: row.entityType,
                          entityId: row.entityId,
                          languageId: lang.id,
                          value: cell?.translatedName || '',
                        })
                      }
                    >
                      {cell?.translatedName ? (
                        <span className="text-gray-800">{cell.translatedName}</span>
                      ) : (
                        <span className="text-red-400 text-xs italic">Missing</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-400">Click any cell to edit. Press Enter to save, Escape to cancel.</p>
    </div>
  );
}
