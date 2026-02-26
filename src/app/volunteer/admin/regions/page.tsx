'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface City {
  id: string;
  name: string;
}

interface State {
  id: string;
  name: string;
  code: string;
  cities: City[];
}

export default function RegionsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ stateId: '', cityName: '' });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [expandedState, setExpandedState] = useState<string | null>(null);

  const [editingCityId, setEditingCityId] = useState<string | null>(null);
  const [editCityName, setEditCityName] = useState('');
  const [savingCityId, setSavingCityId] = useState<string | null>(null);
  const [confirmDeleteCityId, setConfirmDeleteCityId] = useState<string | null>(null);
  const [deletingCityId, setDeletingCityId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/volunteer/login');
    else if (status === 'authenticated' && !isAdmin) router.push('/volunteer/dashboard');
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (status !== 'authenticated' || !isAdmin) return;
    fetch(`${API_BASE}/admin/regions`, { credentials: 'include' })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
        const data = j.data ?? [];
        setStates(data);
        if (data.length > 0) setForm((f) => ({ ...f, stateId: data[0].id }));
      })
      .catch((e) => setError(e.message || 'Failed to load regions'))
      .finally(() => setLoading(false));
  }, [status, isAdmin]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.cityName.trim() || !form.stateId) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/regions`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.cityName.trim(), stateId: form.stateId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create');
      setStates((prev) =>
        prev.map((s) =>
          s.id === form.stateId
            ? { ...s, cities: [...s.cities, json.data].sort((a, b) => a.name.localeCompare(b.name)) }
            : s
        )
      );
      setExpandedState(form.stateId);
      setForm((f) => ({ ...f, cityName: '' }));
      setSuccessMsg(`City "${json.data.name}" added.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function saveCityEdit(cityId: string, stateId: string) {
    if (!editCityName.trim()) return;
    setSavingCityId(cityId);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/regions/${cityId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editCityName.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update');
      setStates((prev) =>
        prev.map((s) =>
          s.id === stateId
            ? { ...s, cities: s.cities.map((c) => (c.id === cityId ? json.data : c)).sort((a, b) => a.name.localeCompare(b.name)) }
            : s
        )
      );
      setEditingCityId(null);
      setSuccessMsg(`City renamed to "${json.data.name}".`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingCityId(null);
    }
  }

  async function deleteCity(cityId: string, stateId: string) {
    setDeletingCityId(cityId);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/regions/${cityId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete');
      setStates((prev) =>
        prev.map((s) =>
          s.id === stateId ? { ...s, cities: s.cities.filter((c) => c.id !== cityId) } : s
        )
      );
      setConfirmDeleteCityId(null);
      setSuccessMsg('City deleted.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message);
      setConfirmDeleteCityId(null);
    } finally {
      setDeletingCityId(null);
    }
  }

  if (status === 'loading' || loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <button onClick={() => router.push('/volunteer/dashboard')} className="font-body text-sm text-gray-500 hover:text-primary-600 mb-2 flex items-center gap-1">
          ← Back to Dashboard
        </button>
        <h1 className="font-heading text-2xl text-gray-800 font-medium">Regional Data</h1>
        <p className="font-body text-sm text-gray-500 mt-1">States are fixed. Add, rename, or remove cities here.</p>
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

      {/* Add city form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-heading text-lg text-gray-800 font-medium">Add City</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-1">
            <label className="block font-body text-sm font-medium text-gray-700">State *</label>
            <select value={form.stateId} onChange={(e) => setForm((f) => ({ ...f, stateId: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
              {states.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block font-body text-sm font-medium text-gray-700">City Name *</label>
            <input type="text" value={form.cityName} onChange={(e) => setForm((f) => ({ ...f, cityName: e.target.value }))} placeholder="e.g. Aurangabad" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" required />
          </div>
          <button type="submit" disabled={submitting || !form.cityName.trim()} className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-body text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Adding...' : 'Add City'}
          </button>
        </form>
      </div>

      {/* States accordion */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
          <h2 className="font-body text-sm font-semibold text-gray-700">
            States ({states.length}) — click to expand cities
          </h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {states.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setExpandedState(expandedState === s.id ? null : s.id)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <span className="font-body text-sm text-gray-800">
                  {s.name} <span className="text-gray-400 text-xs">({s.code})</span>
                </span>
                <span className="font-body text-xs text-gray-400">
                  {s.cities.length} {s.cities.length === 1 ? 'city' : 'cities'}
                  {' '}{expandedState === s.id ? '▲' : '▼'}
                </span>
              </button>
              {expandedState === s.id && (
                <div className="px-5 pb-3 bg-gray-50 border-t border-gray-100">
                  {s.cities.length === 0 ? (
                    <p className="font-body text-xs text-gray-400 py-2">No cities yet.</p>
                  ) : (
                    <ul className="pt-2 space-y-1">
                      {s.cities.map((c) => (
                        <li key={c.id} className="flex items-center gap-2 py-1">
                          {editingCityId === c.id ? (
                            <>
                              <input
                                type="text"
                                value={editCityName}
                                onChange={(e) => setEditCityName(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') saveCityEdit(c.id, s.id); if (e.key === 'Escape') setEditingCityId(null); }}
                                autoFocus
                                className="flex-1 px-2 py-1 border border-primary-400 rounded font-body text-xs focus:outline-none"
                              />
                              <button onClick={() => saveCityEdit(c.id, s.id)} disabled={savingCityId === c.id || !editCityName.trim()} className="font-body text-xs px-2 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50">
                                {savingCityId === c.id ? '…' : 'Save'}
                              </button>
                              <button onClick={() => setEditingCityId(null)} className="font-body text-xs px-2 py-1 border border-gray-300 text-gray-600 rounded hover:bg-white">Cancel</button>
                            </>
                          ) : confirmDeleteCityId === c.id ? (
                            <>
                              <span className="flex-1 font-body text-xs text-gray-700">{c.name}</span>
                              <span className="font-body text-xs text-error-600 font-medium">Delete?</span>
                              <button onClick={() => deleteCity(c.id, s.id)} disabled={deletingCityId === c.id} className="font-body text-xs px-2 py-1 bg-error-500 text-white rounded hover:bg-error-600 disabled:opacity-50">
                                {deletingCityId === c.id ? '…' : 'Yes'}
                              </button>
                              <button onClick={() => setConfirmDeleteCityId(null)} className="font-body text-xs px-2 py-1 border border-gray-300 text-gray-600 rounded hover:bg-white">No</button>
                            </>
                          ) : (
                            <>
                              <span className="flex-1 font-body text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600">{c.name}</span>
                              <button onClick={() => { setEditingCityId(c.id); setEditCityName(c.name); setConfirmDeleteCityId(null); }} title="Edit" className="p-0.5 text-gray-400 hover:text-primary-600 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                              <button onClick={() => { setConfirmDeleteCityId(c.id); setEditingCityId(null); }} title="Delete" className="p-0.5 text-gray-400 hover:text-error-600 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
