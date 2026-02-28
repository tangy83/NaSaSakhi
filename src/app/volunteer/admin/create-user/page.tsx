'use client';

// Admin: Create New User
// Only accessible to ADMIN and SUPER_ADMIN roles.
// Creates volunteer or admin accounts via POST /api/auth/signup.

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { TextInput } from '@/components/form/TextInput';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function CreateUserPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  const [form, setForm] = useState({
    name: '',
    email: '',
    volunteerId: '',
    password: '',
    role: 'VOLUNTEER',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/volunteer/login');
    } else if (status === 'authenticated' && !isAdmin) {
      router.push('/volunteer/dashboard');
    }
  }, [status, isAdmin, router]);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
    setSuccessMsg('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    if (form.role === 'VOLUNTEER' && !form.volunteerId.trim()) {
      setError('Volunteer ID is required for volunteer accounts');
      return;
    }
    if (form.role !== 'VOLUNTEER' && !form.email.trim()) {
      setError('Email is required for admin accounts');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim() || undefined,
          volunteerId: form.volunteerId.trim() || undefined,
          password: form.password,
          role: form.role,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || `HTTP ${res.status}`);
      }

      const created = json.data?.user;
      const label = created?.volunteerId
        ? `Volunteer ID: ${created.volunteerId}`
        : `Email: ${created?.email}`;
      setSuccessMsg(`Account created. ${label}`);
      setForm({ name: '', email: '', volunteerId: '', password: '', role: 'VOLUNTEER' });
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div>
        <button
          onClick={() => router.push('/volunteer/dashboard')}
          className="font-body text-sm text-gray-500 hover:text-primary-600 mb-2 flex items-center gap-1"
        >
          ← Back to Dashboard
        </button>
        <h1 className="font-heading text-2xl text-gray-800 font-medium">Create User Account</h1>
        <p className="font-body text-sm text-gray-500 mt-1">
          Provision a new volunteer or admin account.
        </p>
      </div>

      {successMsg && (
        <div className="bg-success-50 border border-success-500 rounded-lg px-4 py-3">
          <p className="font-body text-sm text-success-600 font-medium">{successMsg}</p>
        </div>
      )}

      {error && (
        <div className="bg-error-50 border border-error-500 rounded-lg px-4 py-3">
          <p className="font-body text-sm text-error-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role selector */}
        <div className="space-y-1">
          <label className="block text-sm font-medium font-body text-gray-700">
            Role <span className="text-error-500 ml-1">*</span>
          </label>
          <select
            value={form.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className="w-full min-h-[48px] px-4 py-3 border-2 border-gray-300 rounded-lg text-base font-body text-gray-700 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500"
          >
            <option value="VOLUNTEER">Volunteer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <TextInput
          label="Full Name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g. Priya Sharma"
          required
        />

        {form.role === 'VOLUNTEER' && (
          <TextInput
            label="Volunteer ID"
            value={form.volunteerId}
            onChange={(e) => handleChange('volunteerId', e.target.value)}
            placeholder="e.g. VOL-2026-001"
            helperText="Unique ID used by the volunteer to log in. Assign a memorable format."
            required
          />
        )}

        {form.role !== 'VOLUNTEER' && (
          <TextInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="e.g. admin@naarisamata.org"
            required
          />
        )}

        <TextInput
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Minimum 8 characters"
          helperText="Share this securely with the user. They should change it on first login."
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="
            w-full min-h-[48px] px-6 py-3 rounded-lg font-body font-semibold text-base
            bg-primary-600 text-white hover:bg-primary-700
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          "
        >
          {submitting ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
