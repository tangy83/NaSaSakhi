'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface SocialCategory {
  id: string;
  name: string;
}

export default function SocialCategoriesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  const [categories, setCategories] = useState<SocialCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/volunteer/login');
    else if (status === 'authenticated' && !isAdmin) router.push('/volunteer/dashboard');
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (status !== 'authenticated' || !isAdmin) return;
    fetch(`${API_BASE}/admin/social-categories`, { credentials: 'include' })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
        setCategories(j.data ?? []);
      })
      .catch((e) => setError(e.message || 'Failed to load social categories'))
      .finally(() => setLoading(false));
  }, [status, isAdmin]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/social-categories`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create');
      setCategories((prev) => [...prev, json.data].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
      setSuccessMsg(`Social category "${json.data.name}" added.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return;
    setSavingId(id);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/social-categories/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update');
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? json.data : c)).sort((a, b) => a.name.localeCompare(b.name))
      );
      setEditingId(null);
      setSuccessMsg(`Renamed to "${json.data.name}".`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  async function deleteCategory(id: string) {
    setDeletingId(id);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/social-categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete');
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setConfirmDeleteId(null);
      setSuccessMsg('Social category deleted.');
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <button
          onClick={() => router.push('/volunteer/dashboard')}
          className="font-body text-sm text-gray-500 hover:text-primary-600 mb-2 flex items-center gap-1"
        >
          ← Back to Dashboard
        </button>
        <h1 className="font-heading text-2xl text-gray-800 font-medium">Social Categories</h1>
        <p className="font-body text-sm text-gray-500 mt-1">
          Social groups that organizations serve (e.g. SC, ST, OBC, Minority).
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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
          <h2 className="font-body text-sm font-semibold text-gray-700">All Social Categories ({categories.length})</h2>
        </div>
        {categories.length === 0 ? (
          <p className="font-body text-sm text-gray-400 px-5 py-8 text-center">No social categories yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {categories.map((c) => (
              <li key={c.id} className="px-5 py-2.5 flex items-center gap-2 min-h-[44px]">
                {editingId === c.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(c.id); if (e.key === 'Escape') setEditingId(null); }}
                      autoFocus
                      className="flex-1 px-2 py-1 border border-primary-400 rounded font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                    />
                    <button onClick={() => saveEdit(c.id)} disabled={savingId === c.id || !editName.trim()} className="font-body text-xs px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50">
                      {savingId === c.id ? 'Saving…' : 'Save'}
                    </button>
                    <button onClick={() => setEditingId(null)} className="font-body text-xs px-3 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50">Cancel</button>
                  </>
                ) : confirmDeleteId === c.id ? (
                  <>
                    <span className="flex-1 font-body text-sm text-gray-800">{c.name}</span>
                    <span className="font-body text-xs text-error-600 font-medium">Delete?</span>
                    <button onClick={() => deleteCategory(c.id)} disabled={deletingId === c.id} className="font-body text-xs px-3 py-1 bg-error-500 text-white rounded hover:bg-error-600 disabled:opacity-50">
                      {deletingId === c.id ? 'Deleting…' : 'Yes, delete'}
                    </button>
                    <button onClick={() => setConfirmDeleteId(null)} className="font-body text-xs px-3 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50">Cancel</button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 font-body text-sm text-gray-800">{c.name}</span>
                    <button onClick={() => { setEditingId(c.id); setEditName(c.name); setConfirmDeleteId(null); }} title="Edit" className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => { setConfirmDeleteId(c.id); setEditingId(null); }} title="Delete" className="p-1 text-gray-400 hover:text-error-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-heading text-lg text-gray-800 font-medium">Add Social Category</h2>
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-1 space-y-1">
            <label className="block font-body text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Scheduled Caste"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-body text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>
    </div>
  );
}
