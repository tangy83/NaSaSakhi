'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface Category {
  id: string;
  name: string;
  targetGroup: string;
}

interface Resource {
  id: string;
  name: string;
  description?: string;
  category: Category;
}

export default function ServiceResourcesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', categoryId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', categoryId: '' });
  const [savingId, setSavingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/volunteer/login');
    else if (status === 'authenticated' && !isAdmin) router.push('/volunteer/dashboard');
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (status !== 'authenticated' || !isAdmin) return;
    Promise.all([
      fetch(`${API_BASE}/admin/service-resources`, { credentials: 'include' }).then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
        return j;
      }),
      fetch(`${API_BASE}/admin/service-categories`, { credentials: 'include' }).then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
        return j;
      }),
    ])
      .then(([resJson, catJson]) => {
        setResources(resJson.data ?? []);
        setCategories(catJson.data ?? []);
        if ((catJson.data ?? []).length > 0) {
          setForm((f) => ({ ...f, categoryId: catJson.data[0].id }));
        }
      })
      .catch((e) => setError(e.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, [status, isAdmin]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.categoryId) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/service-resources`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          categoryId: form.categoryId,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create');
      setResources((prev) => [...prev, json.data]);
      setForm((f) => ({ ...f, name: '', description: '' }));
      setSuccessMsg(`Resource "${json.data.name}" created.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(r: Resource) {
    setEditingId(r.id);
    setEditForm({ name: r.name, description: r.description || '', categoryId: r.category.id });
    setConfirmDeleteId(null);
  }

  async function saveEdit(id: string) {
    if (!editForm.name.trim()) return;
    setSavingId(id);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/service-resources/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name.trim(),
          description: editForm.description.trim() || null,
          categoryId: editForm.categoryId,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update');
      setResources((prev) => prev.map((r) => (r.id === id ? json.data : r)));
      setEditingId(null);
      setSuccessMsg('Resource updated.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  async function deleteResource(id: string) {
    setDeletingId(id);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/service-resources/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete');
      setResources((prev) => prev.filter((r) => r.id !== id));
      setConfirmDeleteId(null);
      setSuccessMsg('Resource deleted.');
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
        <h1 className="font-heading text-2xl text-gray-800 font-medium">Service Resources</h1>
        <p className="font-body text-sm text-gray-500 mt-1">Resources are specific services within a category that organizations can offer.</p>
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
          <h2 className="font-body text-sm font-semibold text-gray-700">All Resources ({resources.length})</h2>
        </div>
        {resources.length === 0 ? (
          <p className="font-body text-sm text-gray-400 px-5 py-8 text-center">No resources yet.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3">Name</th>
                <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3">Category</th>
                <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3 hidden md:table-cell">Description</th>
                <th className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {resources.map((r) => (
                <tr key={r.id} className={editingId === r.id ? 'bg-primary-50' : 'hover:bg-gray-50'}>
                  {editingId === r.id ? (
                    <>
                      <td className="px-4 py-2">
                        <input type="text" value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Escape') setEditingId(null); }} autoFocus className="w-full px-2 py-1 border border-primary-400 rounded font-body text-sm focus:outline-none" />
                      </td>
                      <td className="px-4 py-2">
                        <select value={editForm.categoryId} onChange={(e) => setEditForm((f) => ({ ...f, categoryId: e.target.value }))} className="w-full px-2 py-1 border border-gray-300 rounded font-body text-sm focus:outline-none">
                          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-2 hidden md:table-cell">
                        <input type="text" value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} placeholder="Optional" className="w-full px-2 py-1 border border-gray-300 rounded font-body text-sm focus:outline-none" />
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <button onClick={() => saveEdit(r.id)} disabled={savingId === r.id || !editForm.name.trim()} className="font-body text-xs px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50">
                            {savingId === r.id ? 'Saving…' : 'Save'}
                          </button>
                          <button onClick={() => setEditingId(null)} className="font-body text-xs px-3 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50">Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : confirmDeleteId === r.id ? (
                    <>
                      <td className="px-4 py-3 font-body text-sm text-gray-800">{r.name}</td>
                      <td className="px-4 py-3"><span className="font-body text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{r.category.name}</span></td>
                      <td className="px-4 py-3 font-body text-sm text-gray-500 hidden md:table-cell">{r.description || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-body text-xs text-error-600 font-medium">Delete?</span>
                          <button onClick={() => deleteResource(r.id)} disabled={deletingId === r.id} className="font-body text-xs px-3 py-1 bg-error-500 text-white rounded hover:bg-error-600 disabled:opacity-50">
                            {deletingId === r.id ? 'Deleting…' : 'Yes'}
                          </button>
                          <button onClick={() => setConfirmDeleteId(null)} className="font-body text-xs px-3 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50">No</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-body text-sm text-gray-800">{r.name}</td>
                      <td className="px-4 py-3"><span className="font-body text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{r.category.name}</span></td>
                      <td className="px-4 py-3 font-body text-sm text-gray-500 hidden md:table-cell">{r.description || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEdit(r)} title="Edit" className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button onClick={() => { setConfirmDeleteId(r.id); setEditingId(null); }} title="Delete" className="p-1 text-gray-400 hover:text-error-600 transition-colors">
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
        <h2 className="font-heading text-lg text-gray-800 font-medium">Add Resource</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="space-y-1">
            <label className="block font-body text-sm font-medium text-gray-700">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Legal Counselling" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" required />
          </div>
          <div className="space-y-1">
            <label className="block font-body text-sm font-medium text-gray-700">Category *</label>
            <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.targetGroup})</option>)}
            </select>
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="block font-body text-sm font-medium text-gray-700">Description (optional)</label>
            <input type="text" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief description of this resource" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" disabled={submitting || !form.name.trim() || !form.categoryId} className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-body text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Creating...' : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
