'use client';

// Translation Review Interface
// Side-by-side: English original (left) / Translated text (right, editable)
// Supports RTL layout and dynamic font loading per language

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface LanguageStatus {
  languageId: string;
  languageName: string;
  languageCode: string;
  fontFamily: string;
  isRTL: boolean;
  jobStatus: string;
  reviewedFieldCount: number;
  totalFieldCount: number;
}

interface TranslationField {
  fieldName: string;
  fieldLabel: string;
  sourceText: string;
  translatedText: string;
  status: string;
  translatorNote: string | null;
}

interface LanguageData {
  id: string;
  name: string;
  code: string;
  fontFamily: string;
  isRTL: boolean;
}

const STATUS_COLOR: Record<string, string> = {
  PENDING_TRANSLATION: 'bg-gray-100 text-gray-500',
  MACHINE_TRANSLATED: 'bg-warning-50 text-warning-600',
  VOLUNTEER_REVIEWED: 'bg-success-50 text-success-600',
  TRANSLATION_FAILED: 'bg-error-50 text-error-600',
  CANCELLED: 'bg-gray-100 text-gray-400',
};

export default function TranslateOrgPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: orgId } = use(params);
  const router = useRouter();
  const { status } = useSession();

  const [languages, setLanguages] = useState<LanguageStatus[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>('');
  const [langData, setLangData] = useState<LanguageData | null>(null);
  const [fields, setFields] = useState<TranslationField[]>([]);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [savedFields, setSavedFields] = useState<Record<string, boolean>>({});
  const [loadingLangs, setLoadingLangs] = useState(true);
  const [loadingFields, setLoadingFields] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/volunteer/login');
  }, [status, router]);

  // Load language list and their translation statuses
  useEffect(() => {
    if (status !== 'authenticated') return;

    fetch(`${API_BASE}/volunteer/organizations/${orgId}/translations`, { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        setLanguages(json.data);
        // Auto-select first language with machine-translated content
        const first =
          json.data.find((l: LanguageStatus) => l.jobStatus === 'MACHINE_TRANSLATED') ||
          json.data[0];
        if (first) setSelectedLang(first.languageCode);
      })
      .catch(() => setError('Failed to load languages'))
      .finally(() => setLoadingLangs(false));
  }, [status, orgId]);

  // Load fields when selected language changes
  useEffect(() => {
    if (!selectedLang || status !== 'authenticated') return;

    setLoadingFields(true);
    setFields([]);
    setEditedValues({});
    setSavedFields({});

    fetch(`${API_BASE}/volunteer/organizations/${orgId}/translations/${selectedLang}`, {
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((json) => {
        setLangData(json.data.language);
        const f: TranslationField[] = json.data.fields;
        setFields(f);
        setEditedValues(Object.fromEntries(f.map((fi) => [fi.fieldName, fi.translatedText])));
        // Mark already-reviewed fields
        setSavedFields(
          Object.fromEntries(
            f
              .filter((fi) => fi.status === 'VOLUNTEER_REVIEWED')
              .map((fi) => [fi.fieldName, true])
          )
        );
      })
      .catch(() => setError('Failed to load translations for this language'))
      .finally(() => setLoadingFields(false));
  }, [selectedLang, status, orgId]);

  async function saveField(fieldName: string) {
    if (!selectedLang || !langData) return;
    setSaving((s) => ({ ...s, [fieldName]: true }));

    try {
      const res = await fetch(
        `${API_BASE}/volunteer/organizations/${orgId}/translations/${selectedLang}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fieldName,
            translatedText: editedValues[fieldName] ?? '',
          }),
        }
      );

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || `HTTP ${res.status}`);
      }

      setSavedFields((s) => ({ ...s, [fieldName]: true }));
      // Update the field status in local state
      setFields((prev) =>
        prev.map((f) =>
          f.fieldName === fieldName ? { ...f, status: 'VOLUNTEER_REVIEWED' } : f
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to save translation');
    } finally {
      setSaving((s) => ({ ...s, [fieldName]: false }));
    }
  }

  const reviewedCount = fields.filter((f) => savedFields[f.fieldName]).length;
  const totalCount = fields.length;
  const progressPercent = totalCount > 0 ? Math.round((reviewedCount / totalCount) * 100) : 0;

  if (status === 'loading' || loadingLangs) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => router.push(`/volunteer/organizations/${orgId}/review`)}
          className="font-body text-sm text-gray-500 hover:text-primary-600 mb-2"
        >
          ← Back to Review
        </button>
        <h1 className="font-heading text-2xl text-gray-800 font-medium">
          Translation Review
        </h1>
      </div>

      {error && (
        <div className="bg-error-50 border border-error-500 rounded-lg px-4 py-3">
          <p className="font-body text-sm text-error-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Language sidebar */}
        <aside className="lg:col-span-1 space-y-2">
          <h2 className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Languages
          </h2>
          {languages.map((lang) => (
            <button
              key={lang.languageCode}
              onClick={() => setSelectedLang(lang.languageCode)}
              className={`
                w-full text-left px-4 py-3 rounded-xl border transition-colors
                ${selectedLang === lang.languageCode
                  ? 'bg-primary-50 border-primary-300'
                  : 'bg-white border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-body text-sm font-medium text-gray-800">
                  {lang.languageName}
                </span>
                <span
                  className={`
                    font-body text-xs rounded-full px-2 py-0.5 whitespace-nowrap
                    ${STATUS_COLOR[lang.jobStatus] || 'bg-gray-100 text-gray-500'}
                  `}
                >
                  {lang.jobStatus.replace(/_/g, ' ')}
                </span>
              </div>
              {lang.totalFieldCount > 0 && (
                <p className="font-body text-xs text-gray-400 mt-1">
                  {lang.reviewedFieldCount}/{lang.totalFieldCount} reviewed
                </p>
              )}
            </button>
          ))}
        </aside>

        {/* Translation editor */}
        <div className="lg:col-span-3 space-y-5">
          {langData && (
            <>
              {/* Progress bar */}
              <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body text-sm font-medium text-gray-700">
                    Progress — {langData.name}
                    {langData.isRTL && (
                      <span className="ml-2 font-body text-xs text-info-600 bg-info-50 px-2 py-0.5 rounded-full">
                        RTL
                      </span>
                    )}
                  </span>
                  <span className="font-body text-sm text-gray-500">
                    {reviewedCount} of {totalCount} fields
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
                  English (Source)
                </div>
                <div className="font-body text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
                  {langData.name} (Translation)
                </div>
              </div>
            </>
          )}

          {loadingFields ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            fields.map((field) => (
              <div
                key={field.fieldName}
                className={`
                  bg-white border rounded-xl overflow-hidden
                  ${savedFields[field.fieldName]
                    ? 'border-success-300'
                    : 'border-gray-200'
                  }
                `}
              >
                {/* Field label bar */}
                <div className="bg-gray-50 border-b border-gray-100 px-5 py-2 flex items-center justify-between">
                  <span className="font-body text-xs font-semibold text-gray-600">
                    {field.fieldLabel}
                  </span>
                  {savedFields[field.fieldName] && (
                    <span className="font-body text-xs text-success-600 font-medium">
                      Reviewed
                    </span>
                  )}
                </div>

                {/* Side-by-side content */}
                <div className="grid grid-cols-2 gap-0 divide-x divide-gray-100">
                  {/* English source — read-only */}
                  <div className="px-5 py-4">
                    <p className="font-body text-sm text-gray-700 leading-relaxed">
                      {field.sourceText || '—'}
                    </p>
                  </div>

                  {/* Target language — editable, with RTL and custom font */}
                  <div className="px-5 py-4">
                    <textarea
                      value={editedValues[field.fieldName] ?? ''}
                      onChange={(e) =>
                        setEditedValues((prev) => ({
                          ...prev,
                          [field.fieldName]: e.target.value,
                        }))
                      }
                      dir={langData?.isRTL ? 'rtl' : 'ltr'}
                      style={{ fontFamily: langData?.fontFamily || 'inherit' }}
                      rows={3}
                      className="
                        w-full text-sm text-gray-700 leading-relaxed bg-transparent resize-none
                        border-0 outline-none focus:ring-0 p-0
                      "
                      placeholder="Enter translation..."
                    />

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => saveField(field.fieldName)}
                        disabled={saving[field.fieldName]}
                        className={`
                          font-body text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors
                          ${savedFields[field.fieldName]
                            ? 'bg-success-500 text-white hover:bg-success-600'
                            : 'bg-primary-500 text-white hover:bg-primary-600'
                          }
                          disabled:opacity-60 disabled:cursor-not-allowed
                        `}
                      >
                        {saving[field.fieldName]
                          ? 'Saving...'
                          : savedFields[field.fieldName]
                          ? 'Accepted'
                          : 'Accept'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
