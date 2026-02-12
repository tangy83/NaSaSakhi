'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from '@/lib/hooks/useFormState';
import { organizationSchema, OrganizationFormData } from '@/lib/validation/organizationSchema';
import { FormHeader } from '@/components/layout/FormHeader';
import { FormNavigation } from '@/components/layout/FormNavigation';
import { TextInput } from '@/components/form/TextInput';
import { Dropdown } from '@/components/form/Dropdown';
import { Checkbox } from '@/components/form/Checkbox';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { fetchFaiths, fetchSocialCategories } from '@/lib/api';
import { Faith, SocialCategory } from '@/types/api';
import { useApiError } from '@/hooks/useApiError';
import { useToast } from '@/contexts/ToastContext';
import { useFocusManagement } from '@/hooks/useFocusManagement';

export default function Step1Page() {
  const {
    formData,
    updateStepData,
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    getCurrentStepData,
    saveDraft,
  } = useFormState();

  const [faiths, setFaiths] = useState<Faith[]>([]);
  const [socialCategories, setSocialCategories] = useState<SocialCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { handleError } = useApiError();
  const { showSuccess } = useToast();
  const { focusFirstError } = useFocusManagement();
  const { showError } = useToast();

  // Load reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      setIsLoading(true);
      setLoadError(null);
      
      try {
        const [faithsRes, socialCategoriesRes] = await Promise.all([
          fetchFaiths(),
          fetchSocialCategories(),
        ]);

        if (faithsRes.success && faithsRes.data) {
          setFaiths(faithsRes.data);
        } else if (!faithsRes.success) {
          throw new Error(faithsRes.error || 'Failed to load faiths');
        }

        if (socialCategoriesRes.success && socialCategoriesRes.data) {
          setSocialCategories(socialCategoriesRes.data);
        } else if (!socialCategoriesRes.success) {
          throw new Error(socialCategoriesRes.error || 'Failed to load social categories');
        }
      } catch (error) {
        const errorMessage = handleError(error, 'Failed to load form data. Please refresh the page.');
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
    watch,
    setValue,
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      organizationName: currentData.organizationName || '',
      registrationType: currentData.registrationType,
      registrationNumber: currentData.registrationNumber || '',
      yearEstablished: currentData.yearEstablished,
      faithId: currentData.faithId || '',
      socialCategoryIds: currentData.socialCategoryIds || [],
    },
  });

  // Watch social category IDs for checkbox handling
  const watchedSocialCategoryIds = watch('socialCategoryIds') || [];

  // Handle social category checkbox change
  const handleSocialCategoryChange = (categoryId: string, checked: boolean) => {
    const currentIds = watchedSocialCategoryIds;
    if (checked) {
      setValue('socialCategoryIds', [...currentIds, categoryId], { shouldValidate: true });
    } else {
      setValue('socialCategoryIds', currentIds.filter((id) => id !== categoryId), { shouldValidate: true });
    }
  };

  // Handle form submission
  const onSubmit = (data: OrganizationFormData) => {
    updateStepData(1, data);
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
      updateStepData(1, data);
      try {
        await saveDraft();
        showSuccess('Draft saved successfully', 2000);
      } catch (error) {
        handleError(error, 'Failed to save draft. Please try again.');
      }
    })();
  };

  // Registration type options
  const registrationTypeOptions = [
    { value: 'NGO', label: 'NGO' },
    { value: 'TRUST', label: 'Trust' },
    { value: 'GOVERNMENT', label: 'Government Organization' },
    { value: 'PRIVATE', label: 'Private Organization' },
    { value: 'OTHER', label: 'Other' },
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
      <FormHeader
        title="Organization Details"
        subtitle="Please provide basic information about your organization"
        helpText="All fields marked with * are required. You can save your progress and continue later."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Organization Name */}
        <TextInput
          label="Organization Name"
          required
          placeholder="Enter your organization's full legal name"
          error={errors.organizationName?.message}
          helperText="Enter the name as it appears on your registration certificate"
          {...register('organizationName')}
        />

        {/* Registration Type */}
        <Dropdown
          label="Registration Type"
          required
          options={registrationTypeOptions}
          placeholder="Select registration type"
          error={errors.registrationType?.message}
          helperText="Select the type that best describes your organization"
          {...register('registrationType')}
        />

        {/* Registration Number */}
        <TextInput
          label="Registration Number"
          required
          placeholder="Enter your registration number"
          error={errors.registrationNumber?.message}
          helperText="Enter the official registration number from your certificate"
          {...register('registrationNumber')}
        />

        {/* Year Established */}
        <TextInput
          label="Year Established"
          type="number"
          required
          placeholder={`e.g., ${new Date().getFullYear() - 10}`}
          error={errors.yearEstablished?.message}
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
            error={errors.faithId?.message}
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
                {errors.socialCategoryIds.message}
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <FormNavigation
          onBack={handleBack}
          onNext={handleNext}
          onSaveDraft={handleSaveDraft}
          isFirstStep={isFirstStep}
          nextLabel="Next: Contact Information"
        />
      </form>
    </div>
  );
}
