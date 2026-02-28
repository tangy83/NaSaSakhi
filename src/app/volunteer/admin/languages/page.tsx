'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

interface Language {
  languageId: string;
  languageName: string;
  languageCode: string;
  scriptFamily: string;
  fontFamily: string;
  isRTL: boolean;
  isActive: boolean;
  coveragePercent: number;
}

export default function LanguagesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    code: '',
    scriptFamily: 'Devanagari',
    isRTL: false,
    fontFamily: 'Noto Sans Devanagari',
    googleFontName: 'Noto+Sans+Devanagari',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', scriptFamily: '', isRTL: false, fontFamily: '' });
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/volunteer/login');
    else if (status === 'authenticated' && !isAdmin) router.push('/volunteer/dashboard');
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (status !== 'authenticated' || !isAdmin) return;
    fetch(`${API_BASE}/admin/languages`, { credentials: 'include' })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
        setLanguages(j.data?.languages ?? []);
      })
      .catch((e) => setError(e.message || 'Failed to load languages'))
      .finally(() => setLoading(false));
  }, [status, isAdmin]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/languages`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          code: form.code.trim().toLowerCase(),
          scriptFamily: form.scriptFamily.trim(),
          isRTL: form.isRTL,
          fontFamily: form.fontFamily.trim(),
          googleFontName: form.googleFontName.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create');
      setLanguages((prev) => [
        ...prev,
        {
          languageId: json.data.id,
          languageName: json.data.name,
          languageCode: json.data.code,
          scriptFamily: json.data.scriptFamily,
          fontFamily: json.data.fontFamily,
          isRTL: json.data.isRTL,
          isActive: json.data.isActive,
          coveragePercent: 0,
        },
      ]);
      setForm({ name: '', code: '', scriptFamily: 'Devanagari', isRTL: false, fontFamily: 'Noto Sans Devanagari', googleFontName: 'Noto+Sans+Devanagari' });
      setSuccessMsg(`Language "${json.data.name}" added.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(lang: Language) {
    setEditingId(lang.languageId);
    setEditForm({ name: lang.languageName, scriptFamily: lang.scriptFamily, isRTL: lang.isRTL, fontFamily: lang.fontFamily });
    setConfirmDeleteId(null);
  }

  async function saveEdit(id: string) {
    if (!editForm.name.trim()) return;
    setSavingId(id);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/languages/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name.trim(),
          scriptFamily: editForm.scriptFamily.trim(),
          isRTL: editForm.isRTL,
          fontFamily: editForm.fontFamily.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update');
      setLanguages((prev) =>
        prev.map((l) =>
          l.languageId === id
            ? { ...l, languageName: json.data.name, scriptFamily: json.data.scriptFamily, isRTL: json.data.isRTL, fontFamily: json.data.fontFamily }
            : l
        )
      );
      setEditingId(null);
      setSuccessMsg('Language updated.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  async function deleteLanguage(id: string) {
    setDeletingId(id);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/languages/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete');
      setLanguages((prev) => prev.filter((l) => l.languageId !== id));
      setConfirmDeleteId(null);
      setSuccessMsg('Language deleted.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message);
      setConfirmDeleteId(null);
    } finally {
      setDeletingId(null);
    }
  }

  if (status === 'loading' || loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <button onClick={() => router.push('/volunteer/dashboard')} className="font-body text-sm text-gray-500 hover:text-primary-600 mb-2 flex items-center gap-1">
          ← Back to Dashboard
        </button>
        <h1 className="font-heading text-2xl text-gray-800 font-medium">Languages</h1>
        <p className="font-body text-sm text-gray-500 mt-1">Languages supported for organization data translation.</p>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-500 rounded-lg px-4 py-3">
          <p className="font-body text-sm text-error-600">{error}</p>
        </div>
      )}
      {successMsg && (
        <div className="bg-success-50 border border-success-500 rounded-lg px-4 py-3">
          <p className="font-body text-sm text-success-600">{successMsg}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
          <h2 className="font-body text-sm font-semibold text-gray-700">All Languages ({languages.length})</h2>
        </div>
        {languages.length === 0 ? (
          <p className="font-body text-sm text-gray-400 px-5 py-8 text-center">No languages yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3">Name</th>
                <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3">Code</th>
                <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3 hidden sm:table-cell">Script</th>
                <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3 hidden md:table-cell">Font</th>
                <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3">RTL</th>
                <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3 hidden lg:table-cell">Coverage</th>
                <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {languages.map((lang) => (
                <tr key={lang.languageId} className={editingId === lang.languageId ? 'bg-primary-50' : 'hover:bg-gray-50'}>
                  {editingId === lang.languageId ? (
                    <>
                      <td className="px-4 py-2">
                        <input type="text" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Escape') setEditingId(null); }} autoFocus className="w-full px-2 py-1 border border-primary-400 rounded font-body text-sm focus:outline-none" />
                      </td>
                      <td className="px-4 py-2 font-body text-sm text-gray-400 font-mono">{lang.languageCode}</td>
                      <td className="px-4 py-2 hidden sm:table-cell">
                        <input type="text" value={editForm.scriptFamily} onChange={(e) => setEditForm((f) => ({ ...f, scriptFamily: e.target.value }))} className="w-full px-2 py-1 border border-gray-300 rounded font-body text-sm focus:outline-none" />
                      </td>
                      <td className="px-4 py-2 hidden md:table-cell">
                        <input type="text" value={editForm.fontFamily} onChange={(e) => setEditForm((f) => ({ ...f, fontFamily: e.target.value }))} className="w-full px-2 py-1 border border-gray-300 rounded font-body text-sm focus:outline-none" />
                      </td>
                      <td className="px-4 py-2">
                        <input type="checkbox" checked={editForm.isRTL} onChange={(e) => setEditForm((f) => ({ ...f, isRTL: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-primary-600" />
                      </td>
                      <td className="px-4 py-2 font-body text-sm text-gray-500 hidden lg:table-cell">{lang.coveragePercent}%</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <button onClick={() => saveEdit(lang.languageId)} disabled={savingId === lang.languageId || !editForm.name.trim()} className="font-body text-xs px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50">
                            {savingId === lang.languageId ? 'Saving…' : 'Save'}
                          </button>
                          <button onClick={() => setEditingId(null)} className="font-body text-xs px-3 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50">Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : confirmDeleteId === lang.languageId ? (
                    <>
                      <td className="px-4 py-3 font-body text-sm text-gray-800">{lang.languageName}</td>
                      <td className="px-4 py-3 font-body text-sm text-gray-500 font-mono">{lang.languageCode}</td>
                      <td className="px-4 py-3 font-body text-sm text-gray-500 hidden sm:table-cell">{lang.scriptFamily}</td>
                      <td className="px-4 py-3 font-body text-sm text-gray-500 hidden md:table-cell">{lang.fontFamily}</td>
                      <td className="px-4 py-3"><span className={`font-body text-xs px-2 py-0.5 rounded-full ${lang.isRTL ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{lang.isRTL ? 'RTL' : 'LTR'}</span></td>
                      <td className="px-4 py-3 font-body text-sm text-gray-500 hidden lg:table-cell">{lang.coveragePercent}%</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-body text-xs text-error-600 font-medium">Delete?</span>
                          <button onClick={() => deleteLanguage(lang.languageId)} disabled={deletingId === lang.languageId} className="font-body text-xs px-3 py-1 bg-error-500 text-white rounded hover:bg-error-600 disabled:opacity-50">
                            {deletingId === lang.languageId ? 'Deleting…' : 'Yes'}
                          </button>
                          <button onClick={() => setConfirmDeleteId(null)} className="font-body text-xs px-3 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50">No</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-body text-sm text-gray-800">{lang.languageName}</td>
                      <td className="px-4 py-3 font-body text-sm text-gray-500 font-mono">{lang.languageCode}</td>
                      <td className="px-4 py-3 font-body text-sm text-gray-500 hidden sm:table-cell">{lang.scriptFamily}</td>
                      <td className="px-4 py-3 font-body text-sm text-gray-500 hidden md:table-cell">{lang.fontFamily}</td>
                      <td className="px-4 py-3"><span className={`font-body text-xs px-2 py-0.5 rounded-full ${lang.isRTL ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{lang.isRTL ? 'RTL' : 'LTR'}</span></td>
                      <td className="px-4 py-3 font-body text-sm text-gray-500 hidden lg:table-cell">{lang.coveragePercent}%</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEdit(lang)} title="Edit" className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => { setConfirmDeleteId(lang.languageId); setEditingId(null); }} title="Delete" className="p-1 text-gray-400 hover:text-error-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-heading text-lg text-gray-800 font-medium">Add Language</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Name *', key: 'name', placeholder: 'e.g. Tamil' },
            { label: 'Code *', key: 'code', placeholder: 'e.g. ta' },
            { label: 'Script Family', key: 'scriptFamily', placeholder: 'e.g. Tamil' },
            { label: 'Font Family', key: 'fontFamily', placeholder: 'e.g. Noto Sans Tamil' },
            { label: 'Google Font Name', key: 'googleFontName', placeholder: 'e.g. Noto+Sans+Tamil' },
          ].map(({ label, key, placeholder }) => (
            <div key={key} className="space-y-1">
              <label className="block font-body text-sm font-medium text-gray-700">{label}</label>
              <input
                type="text"
                value={(form as any)[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          ))}
          <div className="space-y-1 flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="isRTL"
              checked={form.isRTL}
              onChange={(e) => setForm((f) => ({ ...f, isRTL: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-400"
            />
            <label htmlFor="isRTL" className="font-body text-sm font-medium text-gray-700">Right-to-Left (RTL) script</label>
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !form.name.trim() || !form.code.trim()}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-body text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Adding...' : 'Add Language'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
