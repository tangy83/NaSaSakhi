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

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/volunteer/login');
    else if (status === 'authenticated' && !isAdmin) router.push('/volunteer/dashboard');
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (status !== 'authenticated' || !isAdmin) return;
    fetch(`${API_BASE}/admin/regions`, { credentials: 'include' })
      .then((r) => r.json())
      .then((j) => {
        setStates(j.data);
        if (j.data.length > 0) setForm((f) => ({ ...f, stateId: j.data[0].id }));
      })
      .catch(() => setError('Failed to load regions'))
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
      // Update city list in state
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

  if (status === 'loading' || loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <button
          onClick={() => router.push('/volunteer/dashboard')}
          className="font-body text-sm text-gray-500 hover:text-primary-600 mb-2 flex items-center gap-1"
        >
          ← Back to Dashboard
        </button>
        <h1 className="font-heading text-2xl text-gray-800 font-medium">Regional Data</h1>
        <p className="font-body text-sm text-gray-500 mt-1">
          States are fixed. Add new cities to any state here.
        </p>
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
            <select
              value={form.stateId}
              onChange={(e) => setForm((f) => ({ ...f, stateId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block font-body text-sm font-medium text-gray-700">City Name *</label>
            <input
              type="text"
              value={form.cityName}
              onChange={(e) => setForm((f) => ({ ...f, cityName: e.target.value }))}
              placeholder="e.g. Aurangabad"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !form.cityName.trim()}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-body text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
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
                    <div className="flex flex-wrap gap-2 pt-2">
                      {s.cities.map((c) => (
                        <span key={c.id} className="font-body text-xs bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600">
                          {c.name}
                        </span>
                      ))}
                    </div>
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
