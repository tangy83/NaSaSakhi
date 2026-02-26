'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface Category {
  id: string;
  name: string;
  targetGroup: 'CHILDREN' | 'WOMEN';
  displayOrder: number;
  resourceCount: number;
}

export default function ServiceCategoriesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', targetGroup: 'WOMEN', displayOrder: '' });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', targetGroup: 'WOMEN', displayOrder: '' });
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/volunteer/login');
    else if (status === 'authenticated' && !isAdmin) router.push('/volunteer/dashboard');
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (status !== 'authenticated' || !isAdmin) return;
    fetch(`${API_BASE}/admin/service-categories`, { credentials: 'include' })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
        setCategories(j.data ?? []);
      })
      .catch((e) => setError(e.message || 'Failed to load categories'))
      .finally(() => setLoading(false));
  }, [status, isAdmin]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/service-categories`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          targetGroup: form.targetGroup,
          displayOrder: form.displayOrder ? parseInt(form.displayOrder) : 99,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create');
      setCategories((prev) => [...prev, json.data]);
      setForm({ name: '', targetGroup: 'WOMEN', displayOrder: '' });
      setSuccessMsg(`Category "${json.data.name}" created.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, targetGroup: cat.targetGroup, displayOrder: String(cat.displayOrder) });
    setConfirmDeleteId(null);
  }

  async function saveEdit(id: string) {
    if (!editForm.name.trim()) return;
    setSavingId(id);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/service-categories/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name.trim(),
          targetGroup: editForm.targetGroup,
          displayOrder: editForm.displayOrder ? parseInt(editForm.displayOrder) : 99,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update');
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...json.data, resourceCount: c.resourceCount } : c))
      );
      setEditingId(null);
      setSuccessMsg('Category updated.');
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
      const res = await fetch(`${API_BASE}/admin/service-categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete');
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setConfirmDeleteId(null);
      setSuccessMsg('Category deleted.');
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <button onClick={() => router.push('/volunteer/dashboard')} className="font-body text-sm text-gray-500 hover:text-primary-600 mb-2 flex items-center gap-1">
          ← Back to Dashboard
        </button>
        <h1 className="font-heading text-2xl text-gray-800 font-medium">Service Categories</h1>
        <p className="font-body text-sm text-gray-500 mt-1">Categories group the services offered to Women and Children.</p>
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
          <h2 className="font-body text-sm font-semibold text-gray-700">All Categories ({categories.length})</h2>
        </div>
        {categories.length === 0 ? (
          <p className="font-body text-sm text-gray-400 px-5 py-8 text-center">No categories yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3">Name</th>
                <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3">Target Group</th>
                <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3">Order</th>
                <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3">Resources</th>
                <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className={editingId === cat.id ? 'bg-primary-50' : 'hover:bg-gray-50'}>
                  {editingId === cat.id ? (
                    <>
                      <td className="px-4 py-2">
                        <input type="text" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(cat.id); if (e.key === 'Escape') setEditingId(null); }} autoFocus className="w-full px-2 py-1 border border-primary-400 rounded font-body text-sm focus:outline-none" />
                      </td>
                      <td className="px-4 py-2">
                        <select value={editForm.targetGroup} onChange={(e) => setEditForm((f) => ({ ...f, targetGroup: e.target.value }))} className="px-2 py-1 border border-gray-300 rounded font-body text-sm focus:outline-none">
                          <option value="WOMEN">Women</option>
                          <option value="CHILDREN">Children</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input type="number" value={editForm.displayOrder} onChange={(e) => setEditForm((f) => ({ ...f, displayOrder: e.target.value }))} className="w-16 px-2 py-1 border border-gray-300 rounded font-body text-sm focus:outline-none" />
                      </td>
                      <td className="px-4 py-2 font-body text-sm text-gray-500">{cat.resourceCount}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <button onClick={() => saveEdit(cat.id)} disabled={savingId === cat.id || !editForm.name.trim()} className="font-body text-xs px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50">
                            {savingId === cat.id ? 'Saving…' : 'Save'}
                          </button>
                          <button onClick={() => setEditingId(null)} className="font-body text-xs px-3 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50">Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : confirmDeleteId === cat.id ? (
                    <>
                      <td className="px-4 py-3 font-body text-sm text-gray-800">{cat.name}</td>
                      <td className="px-4 py-3"><span className={`font-body text-xs font-medium px-2 py-0.5 rounded-full ${cat.targetGroup === 'WOMEN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{cat.targetGroup}</span></td>
                      <td className="px-4 py-3 font-body text-sm text-gray-500">{cat.displayOrder}</td>
                      <td className="px-4 py-3 font-body text-sm text-gray-500">{cat.resourceCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-body text-xs text-error-600 font-medium">Delete?</span>
                          <button onClick={() => deleteCategory(cat.id)} disabled={deletingId === cat.id} className="font-body text-xs px-3 py-1 bg-error-500 text-white rounded hover:bg-error-600 disabled:opacity-50">
                            {deletingId === cat.id ? 'Deleting…' : 'Yes'}
                          </button>
                          <button onClick={() => setConfirmDeleteId(null)} className="font-body text-xs px-3 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50">No</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-body text-sm text-gray-800">{cat.name}</td>
                      <td className="px-4 py-3"><span className={`font-body text-xs font-medium px-2 py-0.5 rounded-full ${cat.targetGroup === 'WOMEN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{cat.targetGroup}</span></td>
                      <td className="px-4 py-3 font-body text-sm text-gray-500">{cat.displayOrder}</td>
                      <td className="px-4 py-3 font-body text-sm text-gray-500">{cat.resourceCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEdit(cat)} title="Edit" className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => { setConfirmDeleteId(cat.id); setEditingId(null); }} title="Delete" className="p-1 text-gray-400 hover:text-error-600 transition-colors">
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

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-heading text-lg text-gray-800 font-medium">Add Category</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-1">
            <label className="block font-body text-sm font-medium text-gray-700">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Legal Aid" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" required />
          </div>
          <div className="space-y-1">
            <label className="block font-body text-sm font-medium text-gray-700">Target Group *</label>
            <select value={form.targetGroup} onChange={(e) => setForm((f) => ({ ...f, targetGroup: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
              <option value="WOMEN">Women</option>
              <option value="CHILDREN">Children</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block font-body text-sm font-medium text-gray-700">Display Order</label>
            <input type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: e.target.value }))} placeholder="99" min={1} className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div className="sm:col-span-3 flex justify-end">
            <button type="submit" disabled={submitting || !form.name.trim()} className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-body text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
