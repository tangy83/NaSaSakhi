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
        <h1 className="font-heading text-2xl text-gray-800 font-medium">Service Resources</h1>
        <p className="font-body text-sm text-gray-500 mt-1">
          Resources are specific services within a category that organizations can offer.
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
          <h2 className="font-body text-sm font-semibold text-gray-700">
            All Resources ({resources.length})
          </h2>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {resources.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-body text-sm text-gray-800">{r.name}</td>
                  <td className="px-4 py-3">
                    <span className="font-body text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {r.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-gray-500 hidden md:table-cell">
                    {r.description || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-heading text-lg text-gray-800 font-medium">Add Resource</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div className="space-y-1">
            <label className="block font-body text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Legal Counselling"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block font-body text-sm font-medium text-gray-700">Category *</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.targetGroup})</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="block font-body text-sm font-medium text-gray-700">Description (optional)</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of this resource"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !form.name.trim() || !form.categoryId}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-body text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
