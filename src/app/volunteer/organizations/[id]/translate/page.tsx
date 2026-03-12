'use client';

import { use, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

interface TranslationField {
  fieldName: string;
  fieldLabel: string;
  sourceText: string;
  translatedText: string;
  status: 'PENDING_TRANSLATION' | 'MACHINE_TRANSLATED' | 'VOLUNTEER_REVIEWED';
}

interface LanguageInfo {
  id: string;
  name: string;
  code: string;
  fontFamily: string;
  isRTL: boolean;
}

interface LanguageSummary {
  languageId: string;
  languageName: string;
  languageCode: string;
  fontFamily: string;
  isRTL: boolean;
  jobStatus: string;
  reviewedFieldCount: number;
  totalFieldCount: number;
}

export default function TranslateOrgPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();

  const [languages, setLanguages] = useState<LanguageSummary[]>([]);
  const [selectedLangCode, setSelectedLangCode] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageInfo | null>(null);
  const [fields, setFields] = useState<TranslationField[]>([]);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [savingField, setSavingField] = useState<string | null>(null);
  const [isLoadingLangs, setIsLoadingLangs] = useState(true);
  const [isLoadingFields, setIsLoadingFields] = useState(false);
  const [isApprovingAll, setIsApprovingAll] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const userRole = (session?.user as any)?.role;
  const isTranslatorOrAdmin = ['TRANSLATOR', 'ADMIN', 'SUPER_ADMIN'].includes(userRole);

  // Load language summary list
  useEffect(() => {
    fetch(`${API_BASE}/volunteer/organizations/${id}/translations`, { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setLanguages(res.data);
          // Default to first non-English language with pending/machine-translated work
          const firstActive = res.data.find(
            (l: LanguageSummary) => l.languageCode !== 'en' && l.jobStatus !== 'VOLUNTEER_REVIEWED'
          ) || res.data[0];
          if (firstActive) setSelectedLangCode(firstActive.languageCode);
        }
      })
      .catch(() => setErrorMsg('Failed to load translation languages'))
      .finally(() => setIsLoadingLangs(false));
  }, [id]);

  // Load fields when selected language changes
  const loadFields = useCallback(async (langCode: string) => {
    if (!langCode) return;
    setIsLoadingFields(true);
    setErrorMsg(null);
    try {
      const res = await fetch(
        `${API_BASE}/volunteer/organizations/${id}/translations/${langCode}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      if (data.success) {
        setCurrentLanguage(data.data.language);
        setFields(data.data.fields);
        const initValues: Record<string, string> = {};
        for (const f of data.data.fields) {
          initValues[f.fieldName] = f.translatedText;
        }
        setEditValues(initValues);
      } else {
        setErrorMsg(data.error || 'Failed to load fields');
      }
    } catch {
      setErrorMsg('Failed to load translation fields');
    } finally {
      setIsLoadingFields(false);
    }
  }, [id]);

  useEffect(() => {
    if (selectedLangCode) loadFields(selectedLangCode);
  }, [selectedLangCode, loadFields]);

  const handleSaveField = async (fieldName: string) => {
    setSavingField(fieldName);
    setErrorMsg(null);
    try {
      const res = await fetch(
        `${API_BASE}/volunteer/organizations/${id}/translations/${selectedLangCode}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fieldName, translatedText: editValues[fieldName] }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setFields((prev) =>
          prev.map((f) =>
            f.fieldName === fieldName
              ? { ...f, translatedText: editValues[fieldName], status: 'VOLUNTEER_REVIEWED' }
              : f
          )
        );
        // Refresh language summary counts
        const summaryRes = await fetch(
          `${API_BASE}/volunteer/organizations/${id}/translations`,
          { credentials: 'include' }
        );
        const summaryData = await summaryRes.json();
        if (summaryData.success) setLanguages(summaryData.data);
      } else {
        setErrorMsg(data.error || 'Failed to save translation');
      }
    } catch {
      setErrorMsg('Failed to save translation');
    } finally {
      setSavingField(null);
    }
  };

  const handleApproveAll = async () => {
    if (!confirm('Approve all translations and publish this organization? This will set the status to APPROVED.')) return;
    setIsApprovingAll(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE}/volunteer/organizations/${id}/translations`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Organization approved and published successfully!');
        setTimeout(() => router.push(`/volunteer/organizations/${id}/review`), 2000);
      } else {
        setErrorMsg(data.error || 'Failed to approve');
      }
    } catch {
      setErrorMsg('Failed to approve all translations');
    } finally {
      setIsApprovingAll(false);
    }
  };

  const statusBadge = (status: string) => {
    if (status === 'VOLUNTEER_REVIEWED') {
      return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Reviewed</span>;
    }
    if (status === 'MACHINE_TRANSLATED') {
      return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Machine</span>;
    }
    return <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Pending</span>;
  };

  const allReviewed = fields.length > 0 && fields.every((f) => f.status === 'VOLUNTEER_REVIEWED');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push(`/volunteer/organizations/${id}/review`)}
          className="font-body text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1"
        >
          ← Back to Review
        </button>
        <h1 className="font-heading text-2xl font-semibold text-gray-900">Translation Review</h1>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{errorMsg}</div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{successMsg}</div>
      )}

      <div className="flex gap-6">
        {/* Language sidebar */}
        <div className="w-52 flex-shrink-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Languages</p>
          {isLoadingLangs ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : (
            <div className="space-y-1">
              {languages
                .filter((l) => l.languageCode !== 'en')
                .map((lang) => {
                  const isSelected = lang.languageCode === selectedLangCode;
                  const allDone = lang.totalFieldCount > 0 && lang.reviewedFieldCount >= lang.totalFieldCount;
                  return (
                    <button
                      key={lang.languageId}
                      onClick={() => setSelectedLangCode(lang.languageCode)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        isSelected
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{lang.languageName}</span>
                        {allDone ? (
                          <span className="text-green-500 text-xs">✓</span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            {lang.reviewedFieldCount}/{lang.totalFieldCount}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1">
          {isLoadingFields ? (
            <div className="text-center py-16 text-gray-400">Loading fields…</div>
          ) : !selectedLangCode ? (
            <div className="text-center py-16 text-gray-400">Select a language to review</div>
          ) : (
            <>
              {currentLanguage && (
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-lg font-medium text-gray-800">
                    {currentLanguage.name} translations
                  </h2>
                  {isTranslatorOrAdmin && (
                    <button
                      onClick={handleApproveAll}
                      disabled={isApprovingAll || !!successMsg}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {isApprovingAll ? 'Approving…' : 'Approve All & Publish'}
                    </button>
                  )}
                </div>
              )}

              {allReviewed && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                  All fields reviewed for this language.
                </div>
              )}

              <div className="space-y-4">
                {fields.map((field) => (
                  <div key={field.fieldName} className="border border-gray-200 rounded-xl p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-700 text-sm">{field.fieldLabel}</span>
                      {statusBadge(field.status)}
                    </div>

                    {/* Source (English) */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">English (source)</p>
                      <p className="text-sm text-gray-800 bg-gray-50 rounded-lg px-3 py-2">
                        {field.sourceText || <span className="italic text-gray-400">—</span>}
                      </p>
                    </div>

                    {/* Translation */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Translation</p>
                      <textarea
                        rows={field.fieldName === 'description' ? 3 : 2}
                        dir={currentLanguage?.isRTL ? 'rtl' : 'ltr'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 resize-none"
                        style={{ fontFamily: currentLanguage?.fontFamily || 'inherit' }}
                        value={editValues[field.fieldName] ?? ''}
                        onChange={(e) =>
                          setEditValues((prev) => ({ ...prev, [field.fieldName]: e.target.value }))
                        }
                        disabled={!isTranslatorOrAdmin}
                      />
                    </div>

                    {isTranslatorOrAdmin && (
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => handleSaveField(field.fieldName)}
                          disabled={savingField === field.fieldName}
                          className="px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50"
                        >
                          {savingField === field.fieldName ? 'Saving…' : 'Save & Mark Reviewed'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
