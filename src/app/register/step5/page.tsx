'use client';

import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from '@/lib/hooks/useFormState';
import { languagesSchema, LanguagesFormData } from '@/lib/validation/languagesSchema';
import { FormHeader } from '@/components/layout/FormHeader';
import { FormNavigation } from '@/components/layout/FormNavigation';
import { Checkbox } from '@/components/form/Checkbox';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { fetchLanguages } from '@/lib/api';
import { Language } from '@/types/api';
import { useApiError } from '@/hooks/useApiError';
import { useToast } from '@/contexts/ToastContext';
import { useFocusManagement } from '@/hooks/useFocusManagement';

export default function Step5Page() {
  const {
    formData,
    updateStepData,
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    getCurrentStepData,
    saveDraft,
  } = useFormState();

  const [allLanguages, setAllLanguages] = useState<Language[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { handleError } = useApiError();
  const { showSuccess } = useToast();
  const { focusFirstError } = useFocusManagement();

  // Load reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      setIsLoading(true);
      setLoadError(null);
      
      try {
        const languagesRes = await fetchLanguages();

        if (languagesRes.success && languagesRes.data) {
          // Filter only active languages
          const activeLanguages = languagesRes.data.filter((lang: Language) => lang.isActive);
          setAllLanguages(activeLanguages);
        } else if (!languagesRes.success) {
          throw new Error(languagesRes.error || 'Failed to load languages');
        }
      } catch (error) {
        const errorMessage = handleError(error, 'Failed to load languages. Please refresh the page.');
        setLoadError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    loadReferenceData();
  }, [handleError]);

  // Initialize form with existing data
  const currentData = getCurrentStepData();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LanguagesFormData>({
    resolver: zodResolver(languagesSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      languageIds: currentData.languageIds || [],
    },
  });

  // Register field
  register('languageIds');

  // Watch selected languages
  const selectedLanguageIds = watch('languageIds', []) as string[];

  // Filter languages based on search query
  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) {
      return allLanguages;
    }

    const query = searchQuery.toLowerCase().trim();
    return allLanguages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query)
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

  // Handle form submission
  const onSubmit = (data: LanguagesFormData) => {
    updateStepData(5, data);
    const success = goToNextStep();
    if (!success) {
      // Validation failed - focus on first error
      setTimeout(() => focusFirstError(), 100);
    }
  };

  // Handle navigation
  const handleNext = () => {
    handleSubmit(onSubmit)();
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  const handleSaveDraft = async () => {
    handleSubmit(async (data) => {
      updateStepData(5, data);
      try {
        await saveDraft();
        showSuccess('Draft saved successfully', 2000);
      } catch (error) {
        handleError(error, 'Failed to save draft. Please try again.');
      }
    })();
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading languages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
      <FormHeader
        title="Language Preferences"
        subtitle="Select the languages your organization can communicate in"
        helpText="Select at least one language. Use the search box to quickly find languages."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Languages
            </label>
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
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
            <p className="text-sm text-gray-500 mt-1">
              Search by language name or code
            </p>
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="p-3 bg-info-50 border border-info-500 rounded-md">
              <p className="text-sm text-info-800">
                Found {filteredLanguages.length} language{filteredLanguages.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>

        {/* Languages Selection Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Select Languages <span className="text-error-500">*</span>
            </h2>
            <p className="text-sm text-gray-500">
              {selectedLanguageIds.length} selected
            </p>
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
              {errors.languageIds.message}
            </p>
          )}

          {selectedLanguageIds.length === 0 && (
            <p className="text-sm text-gray-500">
              Please select at least one language to continue.
            </p>
          )}
        </div>

        {/* Selected Languages Summary */}
        {selectedLanguageIds.length > 0 && (
          <div className="p-4 bg-success-50 border border-success-500 rounded-md">
            <h3 className="text-sm font-medium text-success-800 mb-2">
              Selected Languages ({selectedLanguageIds.length}):
            </h3>
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

        {/* Navigation */}
        <FormNavigation
          onBack={handleBack}
          onNext={handleNext}
          onSaveDraft={handleSaveDraft}
          isFirstStep={isFirstStep}
          nextLabel="Next: Document Uploads"
        />
      </form>
    </div>
  );
}
