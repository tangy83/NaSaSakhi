'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from '@/lib/hooks/useFormState';
import { contactSchema, ContactFormData } from '@/lib/validation/contactSchema';
import { FormHeader } from '@/components/layout/FormHeader';
import { FormNavigation } from '@/components/layout/FormNavigation';
import { TextInput } from '@/components/form/TextInput';
import { useApiError } from '@/hooks/useApiError';
import { useToast } from '@/contexts/ToastContext';
import { useFocusManagement } from '@/hooks/useFocusManagement';

export default function Step2Page() {
  const {
    formData,
    updateStepData,
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    getCurrentStepData,
    saveDraft,
  } = useFormState();
  const { handleError } = useApiError();
  const { showSuccess } = useToast();
  const { focusFirstError } = useFocusManagement();

  const [showSecondaryContact, setShowSecondaryContact] = useState(
    !!formData.secondaryContact
  );

  // Initialize form with existing data
  const currentData = getCurrentStepData();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur', // Validate on blur, not immediately
    reValidateMode: 'onBlur', // Re-validate on blur
    defaultValues: {
      primaryContact: currentData.primaryContact || {
        name: '',
        phone: '',
        email: '',
      },
      secondaryContact: currentData.secondaryContact || undefined,
      websiteUrl: currentData.websiteUrl || '',
      facebookUrl: currentData.facebookUrl || '',
      instagramHandle: currentData.instagramHandle || '',
      twitterHandle: currentData.twitterHandle || '',
    },
  });

  // Watch secondary contact to show/hide fields
  const secondaryContact = watch('secondaryContact');

  // Handle form submission
  const onSubmit = (data: ContactFormData) => {
    // If secondary contact is not shown, remove it from data
    if (!showSecondaryContact) {
      data.secondaryContact = undefined;
    }
    
    updateStepData(2, data);
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
      if (!showSecondaryContact) {
        data.secondaryContact = undefined;
      }
      updateStepData(2, data);
      try {
        await saveDraft();
        showSuccess('Draft saved successfully', 2000);
      } catch (error) {
        handleError(error, 'Failed to save draft. Please try again.');
      }
    })();
  };

  // Helper function to format URL (add https:// if missing)
  const formatUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
      <FormHeader
        title="Contact Information"
        subtitle="Please provide contact details for your organization"
        helpText="Primary contact is required. Secondary contact and social media links are optional."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Primary Contact Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Primary Contact <span className="text-error-500">*</span>
          </h2>

          <TextInput
            label="Contact Name"
            required
            placeholder="Enter full name"
            error={errors.primaryContact?.name?.message}
            helperText="Name of the primary contact person"
            {...register('primaryContact.name')}
          />

          <TextInput
            label="Phone Number"
            type="tel"
            required
            placeholder="9876543210"
            maxLength={10}
            error={errors.primaryContact?.phone?.message}
            helperText="10-digit mobile number starting with 6, 7, 8, or 9"
            {...register('primaryContact.phone')}
          />

          <TextInput
            label="Email Address"
            type="email"
            required
            placeholder="contact@organization.org"
            error={errors.primaryContact?.email?.message}
            helperText="Primary email address for communications"
            {...register('primaryContact.email')}
          />
        </div>

        {/* Secondary Contact Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Secondary Contact <span className="text-gray-500 text-sm font-normal">(Optional)</span>
            </h2>
            <button
              type="button"
              onClick={() => setShowSecondaryContact(!showSecondaryContact)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {showSecondaryContact ? 'Remove Secondary Contact' : 'Add Secondary Contact'}
            </button>
          </div>

          {showSecondaryContact && (
            <div className="space-y-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
              <TextInput
                label="Contact Name"
                placeholder="Enter full name"
                error={errors.secondaryContact?.name?.message}
                {...register('secondaryContact.name')}
              />

              <TextInput
                label="Phone Number"
                type="tel"
                placeholder="9876543210"
                maxLength={10}
                error={errors.secondaryContact?.phone?.message}
                helperText="10-digit mobile number starting with 6, 7, 8, or 9"
                {...register('secondaryContact.phone')}
              />

              <TextInput
                label="Email Address"
                type="email"
                placeholder="contact2@organization.org"
                error={errors.secondaryContact?.email?.message}
                {...register('secondaryContact.email')}
              />
            </div>
          )}
        </div>

        {/* Website & Social Media Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Website & Social Media <span className="text-gray-500 text-sm font-normal">(Optional)</span>
          </h2>

          <TextInput
            label="Website URL"
            type="url"
            placeholder="https://www.organization.org"
            error={errors.websiteUrl?.message}
            helperText="Enter your organization's website URL"
            {...register('websiteUrl', {
              onChange: (e) => {
                // Auto-format URL
                const formatted = formatUrl(e.target.value);
                if (formatted !== e.target.value) {
                  e.target.value = formatted;
                }
              },
            })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <TextInput
                label="Facebook URL"
                type="url"
                placeholder="https://facebook.com/yourpage"
                error={errors.facebookUrl?.message}
                helperText="Must contain facebook.com"
                {...register('facebookUrl', {
                  onChange: (e) => {
                    const formatted = formatUrl(e.target.value);
                    if (formatted !== e.target.value) {
                      e.target.value = formatted;
                    }
                  },
                })}
              />
            </div>

            <div>
              <TextInput
                label="Instagram Handle"
                placeholder="your_handle"
                maxLength={30}
                error={errors.instagramHandle?.message}
                helperText="Username only (without @)"
                {...register('instagramHandle', {
                  pattern: {
                    value: /^[a-zA-Z0-9_]*$/,
                    message: 'Only letters, numbers, and underscores allowed',
                  },
                })}
              />
            </div>
          </div>

          <TextInput
            label="Twitter/X Handle"
            placeholder="your_handle"
            maxLength={15}
            error={errors.twitterHandle?.message}
            helperText="Username only (without @), max 15 characters"
            {...register('twitterHandle', {
              pattern: {
                value: /^[a-zA-Z0-9_]*$/,
                message: 'Only letters, numbers, and underscores allowed',
              },
            })}
          />
        </div>

        {/* Navigation */}
        <FormNavigation
          onBack={handleBack}
          onNext={handleNext}
          onSaveDraft={handleSaveDraft}
          isFirstStep={isFirstStep}
          nextLabel="Next: Services"
        />
      </form>
    </div>
  );
}
