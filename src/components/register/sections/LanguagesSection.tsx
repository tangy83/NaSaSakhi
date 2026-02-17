'use client';

import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Checkbox } from '@/components/form/Checkbox';

interface LanguagesSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

// Top 30 Indian languages
// IDs use 4-char codes aligned with SQL sakhi_language.sql where available:
// enuk=English, hini=Hindi, sant=Santali, tata=Tamil, tete=Telugu
const INDIAN_LANGUAGES = [
  { id: 'hini', name: 'Hindi' },
  { id: 'enuk', name: 'English' },
  { id: 'beng', name: 'Bengali' },
  { id: 'tete', name: 'Telugu' },
  { id: 'mara', name: 'Marathi' },
  { id: 'tata', name: 'Tamil' },
  { id: 'guja', name: 'Gujarati' },
  { id: 'urdu', name: 'Urdu' },
  { id: 'kann', name: 'Kannada' },
  { id: 'odia', name: 'Odia' },
  { id: 'mala', name: 'Malayalam' },
  { id: 'punj', name: 'Punjabi' },
  { id: 'assa', name: 'Assamese' },
  { id: 'mait', name: 'Maithili' },
  { id: 'sant', name: 'Santali' },
  { id: 'kash', name: 'Kashmiri' },
  { id: 'nepa', name: 'Nepali' },
  { id: 'sind', name: 'Sindhi' },
  { id: 'konk', name: 'Konkani' },
  { id: 'dogr', name: 'Dogri' },
  { id: 'mani', name: 'Manipuri (Meitei)' },
  { id: 'bodo', name: 'Bodo' },
  { id: 'sans', name: 'Sanskrit' },
  { id: 'bhoj', name: 'Bhojpuri' },
  { id: 'maga', name: 'Magahi' },
  { id: 'hary', name: 'Haryanvi' },
  { id: 'raja', name: 'Rajasthani' },
  { id: 'chha', name: 'Chhattisgarhi' },
  { id: 'awad', name: 'Awadhi' },
  { id: 'tulu', name: 'Tulu' },
];

export function LanguagesSection({ register, errors, setValue, watch }: LanguagesSectionProps) {
  const selectedLanguageIds = watch('languageIds', []) as string[];

  // Register field
  register('languageIds');

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
          {INDIAN_LANGUAGES.map((language) => (
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
              const language = INDIAN_LANGUAGES.find((l) => l.id === langId);
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
