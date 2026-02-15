'use client';

import { useEffect, useState, useMemo } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Checkbox } from '@/components/form/Checkbox';
import { fetchLanguages } from '@/lib/api';
import { Language } from '@/types/api';
import { useApiError } from '@/hooks/useApiError';

interface LanguagesSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export function LanguagesSection({ register, errors, setValue, watch }: LanguagesSectionProps) {
  const [allLanguages, setAllLanguages] = useState<Language[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useApiError();

  const selectedLanguageIds = watch('languageIds', []) as string[];

  // Register field
  register('languageIds');

  // Load reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      setIsLoading(true);
      try {
        const languagesRes = await fetchLanguages();

        if (languagesRes.success && languagesRes.data) {
          // Filter only active languages
          const activeLanguages = languagesRes.data.filter((lang: Language) => lang.isActive);
          setAllLanguages(activeLanguages);
        }
      } catch (error) {
        handleError(error, 'Failed to load languages');
      } finally {
        setIsLoading(false);
      }
    };
    loadReferenceData();
  }, [handleError]);

  // Filter languages based on search query
  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) {
      return allLanguages;
    }

    const query = searchQuery.toLowerCase().trim();
    return allLanguages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(query) || lang.code.toLowerCase().includes(query)
    );
  }, [allLanguages, searchQuery]);

  // Handle language selection change
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

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading languages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Languages</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to search languages (e.g., Hindi, English, Tamil)"
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                         placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600
                           focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md
                           transition-colors duration-150 p-1"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Search by language name or code</p>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="p-3 bg-info-50 border border-info-500 rounded-md">
            <p className="text-sm text-info-800">
              Found {filteredLanguages.length} language
              {filteredLanguages.length !== 1 ? 's' : ''} matching &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Languages Selection Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <h3 className="text-base font-semibold text-gray-900">
            Select Languages <span className="text-error-500">*</span>
          </h3>
          <p className="text-sm text-gray-500">{selectedLanguageIds.length} selected</p>
        </div>

        {/* Languages List */}
        {filteredLanguages.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {filteredLanguages.map((language) => (
              <div
                key={language.id}
                className="p-3 border border-gray-200 rounded-md hover:border-primary-300
                           hover:bg-primary-50/30 transition-colors duration-150"
              >
                <Checkbox
                  label={language.name}
                  description={`Language code: ${language.code.toUpperCase()}`}
                  checked={selectedLanguageIds?.includes(language.id)}
                  onChange={(e) => handleLanguageChange(language.id, e.target.checked)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center border border-gray-200 rounded-md bg-gray-50">
            <p className="text-gray-600">
              {searchQuery
                ? `No languages found matching "${searchQuery}"`
                : 'No languages available'}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="mt-3 text-sm text-primary-600 hover:text-primary-700
                           underline focus:outline-none focus:ring-2 focus:ring-primary-500
                           rounded-md transition-colors duration-150"
              >
                Clear search
              </button>
            )}
          </div>
        )}

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
              const language = allLanguages.find((l) => l.id === langId);
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
