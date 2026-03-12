'use client';

// Volunteer Org Review Screen
// Shows full organization details with optional inline edit mode
// and Approve / Request Clarification / Reject actions

import { use, useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

interface Contact {
  id: string;
  isPrimary: boolean;
  name: string;
  isdCode: string;
  phone: string;
  email: string;
  facebookUrl?: string;
  instagramHandle?: string;
  twitterHandle?: string;
}

interface Branch {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: { name: string };
  state: { name: string };
  pinCode: string;
  timings: Array<{ dayOfWeek: string; openTime?: string; closeTime?: string; isClosed: boolean }>;
  categories: Array<{ category: { name: string } }>;
  resources: Array<{ resource: { name: string } }>;
}

interface OrgDetail {
  id: string;
  name: string;
  registrationType: string;
  registrationNumber: string;
  yearEstablished: number;
  description?: string;
  websiteUrl?: string;
  isBPLFriendly: boolean;
  status: string;
  faith?: { id: string; name: string } | null;
  contacts: Contact[];
  branches: Branch[];
  languages: Array<{ language: { name: string } }>;
  socialCategories: Array<{ socialCategory: { name: string } }>;
  documents: Array<{ type: string; fileUrl: string; filename: string }>;
  reviewNotes: Array<{
    id: string;
    note: string;
    statusBefore: string;
    statusAfter: string;
    createdAt: string;
    reviewer: { name?: string; email: string };
  }>;
  submittedByUser?: { name?: string; email: string; role: string } | null;
}

// Editable form state mirrors the subset of fields we allow editing
interface EditForm {
  name: string;
  registrationType: string;
  registrationNumber: string;
  yearEstablished: string;
  description: string;
  websiteUrl: string;
  contacts: Contact[];
}

const REGISTRATION_TYPES = ['NGO', 'TRUST', 'GOVERNMENT', 'PRIVATE', 'OTHER'];

export default function OrgReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const userRole = (session?.user as any)?.role;

  const [org, setOrg] = useState<OrgDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isTranslator = userRole === 'TRANSLATOR';
  const isAdminRole = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';
  const isVolunteer = userRole === 'VOLUNTEER';

  const [submitting, setSubmitting] = useState(false);
  const [actionStatus, setActionStatus] = useState<
    'VOLUNTEER_APPROVED' | 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED' | 'ARCHIVED' | ''
  >('');
  const [note, setNote] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/volunteer/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    fetch(`${API_BASE}/volunteer/organizations/${id}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => setOrg(json.data))
      .catch(() => setError('Failed to load organization details'))
      .finally(() => setLoading(false));
  }, [status, id]);

  function startEdit() {
    if (!org) return;
    setEditForm({
      name: org.name,
      registrationType: org.registrationType,
      registrationNumber: org.registrationNumber,
      yearEstablished: String(org.yearEstablished),
      description: org.description || '',
      websiteUrl: org.websiteUrl || '',
      contacts: org.contacts.map((c) => ({ ...c })),
    });
    setEditMode(true);
    setSaveError('');
  }

  function cancelEdit() {
    setEditMode(false);
    setEditForm(null);
    setSaveError('');
  }

  async function handleSave() {
    if (!editForm) return;
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch(`${API_BASE}/volunteer/organizations/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          registrationType: editForm.registrationType,
          registrationNumber: editForm.registrationNumber,
          yearEstablished: Number(editForm.yearEstablished),
          description: editForm.description,
          websiteUrl: editForm.websiteUrl,
          contacts: editForm.contacts,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setOrg(json.data);
      setEditMode(false);
      setEditForm(null);
      setSuccessMsg('Changes saved successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!actionStatus) { setError('Please select an action'); return; }
    if ((actionStatus === 'REJECTED' || actionStatus === 'CLARIFICATION_REQUESTED' || actionStatus === 'ARCHIVED') && !note.trim()) {
      setError('A note is required for this action');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/volunteer/organizations/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: actionStatus, note: note.trim() }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || `HTTP ${res.status}`);
      }
      setSuccessMsg(
        actionStatus === 'VOLUNTEER_APPROVED'
          ? 'Organisation passed to Stage 2 — awaiting Translator review.'
          : actionStatus === 'APPROVED'
          ? 'Organisation approved and now visible in the directory.'
          : actionStatus === 'REJECTED'
          ? 'Organisation rejected.'
          : actionStatus === 'ARCHIVED'
          ? 'Organisation archived and hidden from public directory.'
          : 'Clarification requested. Organisation will be notified.'
      );
      setTimeout(() => router.push('/volunteer/dashboard'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !org) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-error-50 border border-error-500 rounded-lg px-4 py-3">
          <p className="font-body text-sm text-error-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!org) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push('/volunteer/dashboard')}
            className="font-body text-sm text-gray-500 hover:text-primary-600 mb-2 flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
          <h1 className="font-heading text-2xl text-gray-800 font-medium">{org.name}</h1>
          <p className="font-body text-sm text-gray-500 mt-1">
            {org.registrationType} · Reg #{org.registrationNumber} · Est. {org.yearEstablished}
          </p>
          {org.submittedByUser && (
            <p className="font-body text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1 mt-2 inline-block">
              Field created by {org.submittedByUser.name || org.submittedByUser.email} ({org.submittedByUser.role.toLowerCase().replace('_', ' ')})
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={org.status} />
          {!editMode && (
            <button
              onClick={startEdit}
              className="font-body text-sm font-medium text-primary-600 hover:text-primary-700
                         border border-primary-200 hover:border-primary-400 px-3 py-1.5 rounded-lg
                         transition-colors mt-1"
            >
              Edit Record
            </button>
          )}
        </div>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="bg-success-50 border border-success-500 rounded-lg px-4 py-3">
          <p className="font-body text-sm text-success-600 font-medium">{successMsg}</p>
        </div>
      )}

      {/* ── EDIT MODE ── */}
      {editMode && editForm && (
        <div className="bg-white border-2 border-primary-300 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg text-gray-800 font-medium">Edit Record</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="font-body text-sm font-medium text-gray-600 border border-gray-300
                           hover:border-gray-400 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="font-body text-sm font-medium text-white bg-primary-500 hover:bg-primary-600
                           px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>

          {saveError && (
            <div className="bg-error-50 border border-error-500 rounded-lg px-4 py-3">
              <p className="font-body text-sm text-error-600">{saveError}</p>
            </div>
          )}

          {/* Core org fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EditField
              label="Organization Name"
              value={editForm.name}
              onChange={(v) => setEditForm({ ...editForm, name: v })}
            />
            <div className="space-y-1">
              <label className="block font-body text-xs text-gray-500">Registration Type</label>
              <select
                value={editForm.registrationType}
                onChange={(e) => setEditForm({ ...editForm, registrationType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm
                           text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400
                           focus:border-primary-500"
              >
                {REGISTRATION_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <EditField
              label="Registration Number"
              value={editForm.registrationNumber}
              onChange={(v) => setEditForm({ ...editForm, registrationNumber: v })}
            />
            <EditField
              label="Year Established"
              value={editForm.yearEstablished}
              type="number"
              onChange={(v) => setEditForm({ ...editForm, yearEstablished: v })}
            />
            <EditField
              label="Website URL"
              value={editForm.websiteUrl}
              className="sm:col-span-2"
              onChange={(v) => setEditForm({ ...editForm, websiteUrl: v })}
            />
            <div className="sm:col-span-2 space-y-1">
              <label className="block font-body text-xs text-gray-500">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm
                           text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400
                           focus:border-primary-500 resize-none"
              />
            </div>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h3 className="font-body text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">
              Contacts
            </h3>
            {editForm.contacts.map((c, i) => (
              <div key={c.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 border border-gray-100 rounded-lg bg-gray-50">
                <p className="sm:col-span-2 font-body text-xs font-semibold text-gray-500 uppercase">
                  {c.isPrimary ? 'Primary Contact' : 'Secondary Contact'}
                </p>
                <EditField
                  label="Name"
                  value={c.name}
                  onChange={(v) => {
                    const updated = [...editForm.contacts];
                    updated[i] = { ...updated[i], name: v };
                    setEditForm({ ...editForm, contacts: updated });
                  }}
                />
                <EditField
                  label="Email"
                  value={c.email}
                  type="email"
                  onChange={(v) => {
                    const updated = [...editForm.contacts];
                    updated[i] = { ...updated[i], email: v };
                    setEditForm({ ...editForm, contacts: updated });
                  }}
                />
                <EditField
                  label="ISD Code"
                  value={c.isdCode}
                  onChange={(v) => {
                    const updated = [...editForm.contacts];
                    updated[i] = { ...updated[i], isdCode: v };
                    setEditForm({ ...editForm, contacts: updated });
                  }}
                />
                <EditField
                  label="Phone"
                  value={c.phone}
                  onChange={(v) => {
                    const updated = [...editForm.contacts];
                    updated[i] = { ...updated[i], phone: v };
                    setEditForm({ ...editForm, contacts: updated });
                  }}
                />
                <EditField
                  label="Facebook URL"
                  value={c.facebookUrl || ''}
                  onChange={(v) => {
                    const updated = [...editForm.contacts];
                    updated[i] = { ...updated[i], facebookUrl: v };
                    setEditForm({ ...editForm, contacts: updated });
                  }}
                />
                <EditField
                  label="Instagram Handle"
                  value={c.instagramHandle || ''}
                  onChange={(v) => {
                    const updated = [...editForm.contacts];
                    updated[i] = { ...updated[i], instagramHandle: v };
                    setEditForm({ ...editForm, contacts: updated });
                  }}
                />
                <EditField
                  label="Twitter Handle"
                  value={c.twitterHandle || ''}
                  onChange={(v) => {
                    const updated = [...editForm.contacts];
                    updated[i] = { ...updated[i], twitterHandle: v };
                    setEditForm({ ...editForm, contacts: updated });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── READ-ONLY DETAILS ── */}
      {!editMode && (
        <div className="space-y-4">
          {org.description && (
            <Section title="Description">
              <p className="font-body text-sm text-gray-700 leading-relaxed">{org.description}</p>
            </Section>
          )}

          <Section title="Contact Information">
            {org.contacts.map((c, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 text-sm font-body">
                <Field label={c.isPrimary ? 'Primary Contact' : 'Secondary Contact'} value={c.name} />
                <Field label="Phone" value={`${c.isdCode} ${c.phone}`} />
                <Field label="Email" value={c.email} />
                {c.facebookUrl && <Field label="Facebook" value={c.facebookUrl} />}
                {c.instagramHandle && <Field label="Instagram" value={c.instagramHandle} />}
                {c.twitterHandle && <Field label="Twitter" value={c.twitterHandle} />}
              </div>
            ))}
            {org.websiteUrl && (
              <div className="text-sm font-body">
                <Field label="Website" value={org.websiteUrl} />
              </div>
            )}
          </Section>

          <Section title={`Branches (${org.branches.length})`}>
            {org.branches.map((branch, i) => (
              <div key={branch.id} className="border border-gray-100 rounded-lg p-4 space-y-2">
                <p className="font-body text-sm font-semibold text-gray-700">Branch {i + 1}</p>
                <div className="grid grid-cols-2 gap-3 text-sm font-body">
                  <Field label="Address" value={[branch.addressLine1, branch.addressLine2].filter(Boolean).join(', ')} />
                  <Field label="City / State" value={`${branch.city.name}, ${branch.state.name}`} />
                  <Field label="PIN Code" value={branch.pinCode} />
                  {branch.categories.length > 0 && (
                    <Field label="Categories" value={branch.categories.map((c) => c.category.name).join(', ')} />
                  )}
                  {branch.resources.length > 0 && (
                    <Field label="Resources" value={branch.resources.map((r) => r.resource.name).join(', ')} />
                  )}
                </div>
              </div>
            ))}
          </Section>

          <Section title="Languages">
            <p className="font-body text-sm text-gray-700">
              {org.languages.map((l) => l.language.name).join(', ') || '—'}
            </p>
          </Section>

          <Section title="Additional Details">
            <div className="grid grid-cols-2 gap-3 text-sm font-body">
              {org.faith && <Field label="Faith Affiliation" value={org.faith.name} />}
              {(org.socialCategories ?? []).length > 0 && (
                <Field
                  label="Social Categories"
                  value={org.socialCategories.map((s) => s.socialCategory.name).join(', ')}
                />
              )}
              <div>
                <p className="font-body text-xs text-gray-400 mb-0.5">BPL Friendly</p>
                {org.isBPLFriendly ? (
                  <span className="inline-flex items-center font-body text-xs font-semibold border rounded-full px-2.5 py-0.5 bg-teal-50 text-teal-700 border-teal-300">
                    Yes — BPL households eligible
                  </span>
                ) : (
                  <p className="font-body text-sm text-gray-800">No</p>
                )}
              </div>
            </div>
          </Section>

          <Section title="Documents">
            {org.documents.length === 0 ? (
              <p className="font-body text-sm text-gray-400">No documents uploaded.</p>
            ) : (
              org.documents.map((doc) => (
                <div key={doc.type} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-body text-sm font-medium text-gray-700">
                      {doc.type.replace(/_/g, ' ')}
                    </p>
                    <p className="font-body text-xs text-gray-400">{doc.filename}</p>
                  </div>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm text-primary-600 hover:text-primary-700 underline"
                  >
                    View
                  </a>
                </div>
              ))
            )}
          </Section>

          {org.reviewNotes.length > 0 && (
            <Section title="Review History">
              {org.reviewNotes.map((rn) => (
                <div key={rn.id} className="border-l-2 border-gray-200 pl-4 py-2 space-y-1">
                  <p className="font-body text-xs text-gray-400">
                    {new Date(rn.createdAt).toLocaleString('en-IN')} ·{' '}
                    {rn.reviewer.name || rn.reviewer.email}
                  </p>
                  <p className="font-body text-sm text-gray-700">
                    {rn.statusBefore} → <strong>{rn.statusAfter}</strong>
                  </p>
                  {rn.note && (
                    <p className="font-body text-sm text-gray-600 italic">{rn.note}</p>
                  )}
                </div>
              ))}
            </Section>
          )}
        </div>
      )}

      {/* Review action panel — role-based, only when not editing and status is actionable */}
      {!editMode && org.status !== 'ARCHIVED' && (() => {
        // Determine if this user can act on the current org status
        const canAct =
          isAdminRole ||
          (isVolunteer && org.status === 'PENDING') ||
          (isTranslator && org.status === 'VOLUNTEER_APPROVED');
        if (!canAct) return null;

        // Build action buttons based on role + current status
        type ActionBtn = { value: 'VOLUNTEER_APPROVED' | 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED' | 'ARCHIVED'; label: string; color: string };
        const stage1Actions: ActionBtn[] = [
          { value: 'VOLUNTEER_APPROVED', label: 'Pass to Stage 2', color: 'success' },
          { value: 'CLARIFICATION_REQUESTED', label: 'Request Clarification', color: 'warning' },
          { value: 'REJECTED', label: 'Reject', color: 'error' },
          { value: 'ARCHIVED', label: 'Archive', color: 'archive' },
        ];
        const stage2Actions: ActionBtn[] = [
          { value: 'APPROVED', label: 'Approve & Publish', color: 'success' },
          { value: 'CLARIFICATION_REQUESTED', label: 'Request Clarification', color: 'warning' },
          { value: 'REJECTED', label: 'Reject', color: 'error' },
          { value: 'ARCHIVED', label: 'Archive', color: 'archive' },
        ];
        const adminAllActions: ActionBtn[] = [
          { value: 'VOLUNTEER_APPROVED', label: 'Move to Stage 2', color: 'success' },
          { value: 'APPROVED', label: 'Approve & Publish', color: 'success' },
          { value: 'CLARIFICATION_REQUESTED', label: 'Request Clarification', color: 'warning' },
          { value: 'REJECTED', label: 'Reject', color: 'error' },
          { value: 'ARCHIVED', label: 'Archive', color: 'archive' },
        ];

        const actions = isAdminRole ? adminAllActions : (isTranslator ? stage2Actions : stage1Actions);
        const stageLabel = isTranslator ? 'Stage 2 Review — Translation Approval'
          : isVolunteer ? 'Stage 1 Review'
          : 'Admin Review';

        return (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg text-gray-800 font-medium">Review Action</h2>
            <span className="font-body text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">{stageLabel}</span>
          </div>

          {/* Stage indicator */}
          <div className="flex gap-3 items-center text-sm font-body text-gray-500">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${org.status === 'PENDING' ? 'bg-warning-100 text-warning-700' : 'bg-gray-100 text-gray-500'}`}>
              Stage 1: Volunteer Review
            </span>
            <span className="text-gray-300">→</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${org.status === 'VOLUNTEER_APPROVED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
              Stage 2: Translator Review
            </span>
            <span className="text-gray-300">→</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${org.status === 'APPROVED' ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-500'}`}>
              Approved
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {actions.map(({ value, label, color }) => (
              <button
                key={value}
                type="button"
                onClick={() => setActionStatus(value)}
                className={`
                  font-body text-sm font-medium px-4 py-2 rounded-lg border-2 transition-colors
                  ${actionStatus === value
                    ? color === 'success'
                      ? 'bg-success-500 border-success-500 text-white'
                      : color === 'warning'
                      ? 'bg-warning-500 border-warning-500 text-white'
                      : color === 'archive'
                      ? 'bg-gray-500 border-gray-500 text-white'
                      : 'bg-error-500 border-error-500 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <label className="block font-body text-sm font-medium text-gray-700">
              Note{actionStatus === 'REJECTED' || actionStatus === 'CLARIFICATION_REQUESTED' || actionStatus === 'ARCHIVED'
                ? ' (required)'
                : ' (optional)'}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Add a note about your decision..."
              className="
                w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-body text-sm text-gray-700
                focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500
                resize-none transition-colors
              "
            />
          </div>

          {error && (
            <div className="bg-error-50 border border-error-500 rounded-lg px-4 py-3">
              <p className="font-body text-sm text-error-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !actionStatus}
            className="
              min-h-[48px] px-8 bg-primary-500 hover:bg-primary-600 active:bg-primary-700
              text-white font-body font-semibold text-sm rounded-lg
              transition-colors disabled:opacity-60 disabled:cursor-not-allowed
              focus:outline-none focus:ring-4 focus:ring-primary-100
            "
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
        );
      })()}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
        <h3 className="font-body text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="px-5 py-4 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-body text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="font-body text-sm text-gray-800">{value || '—'}</p>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  type = 'text',
  className = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block font-body text-xs text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-body text-sm
                   text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-400
                   focus:border-primary-500 transition-colors"
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: 'bg-warning-50 text-warning-600 border-warning-500',
    VOLUNTEER_APPROVED: 'bg-blue-50 text-blue-700 border-blue-400',
    APPROVED: 'bg-success-50 text-success-600 border-success-500',
    REJECTED: 'bg-error-50 text-error-600 border-error-500',
    CLARIFICATION_REQUESTED: 'bg-info-50 text-info-600 border-info-500',
    ARCHIVED: 'bg-gray-100 text-gray-600 border-gray-400',
  };
  return (
    <span
      className={`
        inline-flex items-center font-body text-xs font-semibold
        border rounded-full px-3 py-1 ${map[status] || 'bg-gray-100 text-gray-600 border-gray-300'}
      `}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
