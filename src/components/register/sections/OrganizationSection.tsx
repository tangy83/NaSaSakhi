'use client';

import { useEffect, useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { TextInput } from '@/components/form/TextInput';
import { Dropdown } from '@/components/form/Dropdown';
import { Checkbox } from '@/components/form/Checkbox';
import { fetchFaiths, fetchSocialCategories } from '@/lib/api';
import { Faith, SocialCategory } from '@/types/api';
import { useApiError } from '@/hooks/useApiError';

interface OrganizationSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

const registrationTypeOptions = [
  { value: 'NGO', label: 'NGO' },
  { value: 'TRUST', label: 'Trust' },
  { value: 'GOVERNMENT', label: 'Government Organization' },
  { value: 'PRIVATE', label: 'Private Organization' },
  { value: 'OTHER', label: 'Other' },
];

export function OrganizationSection({ register, errors, setValue, watch }: OrganizationSectionProps) {
  const [faiths, setFaiths] = useState<Faith[]>([]);
  const [socialCategories, setSocialCategories] = useState<SocialCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleError } = useApiError();

  const watchedSocialCategoryIds = watch('socialCategoryIds') || [];

  // Load reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      setIsLoading(true);
      try {
        const [faithsRes, socialCategoriesRes] = await Promise.all([
          fetchFaiths(),
          fetchSocialCategories(),
        ]);

        if (faithsRes.success && faithsRes.data) {
          setFaiths(faithsRes.data);
        }
        if (socialCategoriesRes.success && socialCategoriesRes.data) {
          setSocialCategories(socialCategoriesRes.data);
        }
      } catch (error) {
        handleError(error, 'Failed to load reference data');
      } finally {
        setIsLoading(false);
      }
    };

    loadReferenceData();
  }, [handleError]);

  // Handle social category checkbox change
  const handleSocialCategoryChange = (categoryId: string, checked: boolean) => {
    const currentIds = watchedSocialCategoryIds;
    if (checked) {
      setValue('socialCategoryIds', [...currentIds, categoryId], { shouldValidate: true });
    } else {
      setValue('socialCategoryIds', currentIds.filter((id: string) => id !== categoryId), {
        shouldValidate: true,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading organization details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TextInput
        label="Organization Name"
        required
        placeholder="Enter your organization's full legal name"
        error={errors.organizationName?.message as string}
        helperText="Enter the name as it appears on your registration certificate"
        {...register('organizationName')}
      />

      <Dropdown
        label="Registration Type"
        required
        options={registrationTypeOptions}
        placeholder="Select registration type"
        error={errors.registrationType?.message as string}
        helperText="Select the type that best describes your organization"
        {...register('registrationType')}
      />

      <TextInput
        label="Registration Number"
        required
        placeholder="Enter your registration number"
        error={errors.registrationNumber?.message as string}
        helperText="Enter the official registration number from your certificate"
        {...register('registrationNumber')}
      />

      <TextInput
        label="Year Established"
        type="number"
        required
        placeholder={`e.g., ${new Date().getFullYear() - 10}`}
        error={errors.yearEstablished?.message as string}
        helperText={`Enter a year between 1800 and ${new Date().getFullYear()}`}
        {...register('yearEstablished', {
          valueAsNumber: true,
        })}
      />

      {/* Faith (Optional) */}
      {faiths.length > 0 && (
        <Dropdown
          label="Religious Affiliation"
          options={faiths.map((faith) => ({ value: faith.id, label: faith.name }))}
          placeholder="Select (optional)"
          error={errors.faithId?.message as string}
          helperText="Optional: Select if your organization has a religious affiliation"
          {...register('faithId')}
        />
      )}

      {/* Social Categories (Optional, Multi-select) */}
      {socialCategories.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Social Categories (Optional)
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Select all categories that apply to your organization
          </p>
          <div className="space-y-3 border border-gray-300 rounded-md p-4">
            {socialCategories.map((category) => (
              <Checkbox
                key={category.id}
                label={category.name}
                checked={watchedSocialCategoryIds.includes(category.id)}
                onChange={(e) => handleSocialCategoryChange(category.id, e.target.checked)}
              />
            ))}
          </div>
          {errors.socialCategoryIds && (
            <p className="text-sm text-error-500 flex items-center gap-1">
              <span>⚠️</span>
              {errors.socialCategoryIds.message as string}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
