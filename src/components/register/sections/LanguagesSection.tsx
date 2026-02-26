'use client';

import { useEffect, useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Checkbox } from '@/components/form/Checkbox';
import { fetchLanguages } from '@/lib/api';

interface Language {
  id: string;
  name: string;
  code: string;
}

interface LanguagesSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export function LanguagesSection({ register, errors, setValue, watch }: LanguagesSectionProps) {
  const selectedLanguageIds = watch('languageIds', []) as string[];
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Register field
  register('languageIds');

  useEffect(() => {
    fetchLanguages()
      .then((res) => {
        if (res.success && res.data) {
          setLanguages(res.data);
        } else {
          setFetchError('Failed to load languages');
        }
      })
      .catch(() => setFetchError('Failed to load languages'))
      .finally(() => setLoading(false));
  }, []);

  const handleLanguageChange = (languageId: string, isChecked: boolean) => {
    let newLanguageIds = selectedLanguageIds ? [...selectedLanguageIds] : [];

    if (isChecked) {
      if (!newLanguageIds.includes(languageId)) {
        newLanguageIds.push(languageId);
      }
    } else {
      newLanguageIds = newLanguageIds.filter((id) => id !== languageId);
    }

    setValue('languageIds', newLanguageIds, { shouldValidate: true });
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-gray-500">Loading languages...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-error-600">{fetchError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Languages Selection Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <h3 className="text-base font-semibold text-gray-900">
            Select Languages <span className="text-error-500">*</span>
          </h3>
          <p className="text-sm text-gray-500">{selectedLanguageIds.length} selected</p>
        </div>

        <p className="text-sm text-gray-600">
          Select all languages your organization can provide support in
        </p>

        {/* Languages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {languages.map((language) => (
            <div
              key={language.id}
              className="p-3 border border-gray-200 rounded-md hover:border-primary-300
                         hover:bg-primary-50/30 transition-colors duration-150"
            >
              <Checkbox
                label={language.name}
                checked={selectedLanguageIds?.includes(language.id)}
                onChange={(e) => handleLanguageChange(language.id, e.target.checked)}
              />
            </div>
          ))}
        </div>

        {/* Language Selection Error */}
        {errors.languageIds && (
          <p role="alert" className="text-sm text-error-500 flex items-center gap-1">
            <span>⚠️</span>
            {errors.languageIds.message as string}
          </p>
        )}

        {selectedLanguageIds.length === 0 && (
          <p className="text-sm text-gray-500">Please select at least one language to continue.</p>
        )}
      </div>

      {/* Selected Languages Summary */}
      {selectedLanguageIds.length > 0 && (
        <div className="p-4 bg-success-50 border border-success-500 rounded-md">
          <h4 className="text-sm font-medium text-success-800 mb-2">
            Selected Languages ({selectedLanguageIds.length}):
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedLanguageIds.map((langId) => {
              const language = languages.find((l) => l.id === langId);
              return language ? (
                <span
                  key={langId}
                  className="px-3 py-1 bg-white border border-success-300 rounded-md
                             text-sm text-success-700 font-medium"
                >
                  {language.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
