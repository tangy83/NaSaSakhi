'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from '@/lib/hooks/useFormState';
import { documentsSchema, DocumentsFormData } from '@/lib/validation/documentsSchema';
import { FormHeader } from '@/components/layout/FormHeader';
import { FormNavigation } from '@/components/layout/FormNavigation';
import { FileUpload } from '@/components/form/FileUpload';
import { useApiError } from '@/hooks/useApiError';
import { useToast } from '@/contexts/ToastContext';
import { useFocusManagement } from '@/hooks/useFocusManagement';

export default function Step6Page() {
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

  // Initialize form with existing data
  const currentData = getCurrentStepData();
  const documentsData = (currentData.documents || {}) as Partial<DocumentsFormData>;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DocumentsFormData>({
    resolver: zodResolver(documentsSchema) as any, // Type assertion needed due to optional array in schema
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      registrationCertificateUrl: documentsData.registrationCertificateUrl || '',
      logoUrl: documentsData.logoUrl || '',
      additionalCertificateUrls: documentsData.additionalCertificateUrls || [],
    },
    // Don't validate optional fields when they're empty
    shouldUnregister: false,
  });

  // Watch form values
  const registrationCertificateUrl = watch('registrationCertificateUrl', '');
  const logoUrl = watch('logoUrl', '');
  const additionalCertificateUrls = watch('additionalCertificateUrls', []) as string[];

  // Handle registration certificate upload
  const handleRegistrationCertificateChange = (fileUrl: string) => {
    console.log('Registration certificate uploaded, URL:', fileUrl);
    setValue('registrationCertificateUrl', fileUrl, { shouldValidate: true });
    // Clear any previous errors
    if (errors.registrationCertificateUrl) {
      setValue('registrationCertificateUrl', fileUrl, { shouldValidate: false });
      setValue('registrationCertificateUrl', fileUrl, { shouldValidate: true });
    }
  };

  const handleRegistrationCertificateRemove = () => {
    setValue('registrationCertificateUrl', '', { shouldValidate: true });
  };

  // Handle logo upload
  const handleLogoChange = (fileUrl: string) => {
    setValue('logoUrl', fileUrl, { shouldValidate: true });
  };

  const handleLogoRemove = () => {
    setValue('logoUrl', '', { shouldValidate: true });
  };

  // Handle additional certificates
  const handleAddAdditionalCertificate = () => {
    if (additionalCertificateUrls.length < 3) {
      const newUrls = [...additionalCertificateUrls, ''];
      setValue('additionalCertificateUrls', newUrls, { shouldValidate: true });
    }
  };

  const handleAdditionalCertificateChange = (index: number, fileUrl: string) => {
    const newUrls = [...additionalCertificateUrls];
    newUrls[index] = fileUrl;
    setValue('additionalCertificateUrls', newUrls, { shouldValidate: true });
  };

  const handleAdditionalCertificateRemove = (index: number) => {
    const newUrls = additionalCertificateUrls.filter((_, i) => i !== index);
    setValue('additionalCertificateUrls', newUrls, { shouldValidate: true });
  };

  // Handle form submission
  const onSubmit = (data: any) => {
    const formData: DocumentsFormData = data as DocumentsFormData;
    console.log('Step 6 onSubmit called with data:', data);
    
    // Clean the data: keep empty string for logoUrl (schema accepts it), filter empty additional certificates
    const cleanedData = {
      registrationCertificateUrl: formData.registrationCertificateUrl || '',
      // Keep empty string for logoUrl - schema accepts '', undefined, or valid URL
      logoUrl: formData.logoUrl && formData.logoUrl.trim().length > 0 ? formData.logoUrl : (formData.logoUrl === '' ? '' : undefined),
      additionalCertificateUrls: formData.additionalCertificateUrls?.filter((url: string) => url.trim().length > 0) || [],
    };
    
    console.log('Step 6 cleanedData:', cleanedData);
    
    // Update form data
    updateStepData(6, { documents: cleanedData });
    
    // Pass documents data to validate before state is updated (fixes race condition)
    // The validation expects { documents: {...} } structure
    const success = goToNextStep({ documents: cleanedData });
    console.log('goToNextStep returned:', success);
    
    if (!success) {
      // Validation failed - form will show errors
      console.error('Step 6 validation failed - check console for details');
    }
  };

  // Handle navigation
  const handleNext = () => {
    console.log('Step 6 handleNext called');
    console.log('Step 6 current form values:', {
      registrationCertificateUrl,
      logoUrl,
      additionalCertificateUrls,
    });
    console.log('Step 6 form errors:', errors);
    
    // Always try to proceed - use our custom validation in goToNextStep
    // React Hook Form validation might show errors for relative URLs, but our custom validation handles them
    const currentFormData: DocumentsFormData = {
      registrationCertificateUrl: registrationCertificateUrl || '',
      logoUrl: logoUrl || '',
      additionalCertificateUrls: additionalCertificateUrls || [],
    };
    
    // Call onSubmit directly - our custom validation in goToNextStep will handle it
    onSubmit(currentFormData);
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  const handleSaveDraft = async () => {
    handleSubmit(async (data: DocumentsFormData) => {
      const cleanedData: DocumentsFormData = {
        ...data,
        additionalCertificateUrls: data.additionalCertificateUrls?.filter((url: string) => url.trim().length > 0) || [],
      };
      updateStepData(6, { documents: cleanedData });
      try {
        await saveDraft();
        showSuccess('Draft saved successfully', 2000);
      } catch (error) {
        handleError(error, 'Failed to save draft. Please try again.');
      }
    })();
  };

  // Register fields
  register('registrationCertificateUrl');
  register('logoUrl');
  register('additionalCertificateUrls');

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
      <FormHeader
        title="Document Uploads"
        subtitle="Upload required and optional documents for your organization"
        helpText="Registration certificate is required. Logo and additional certificates are optional. Maximum 3 additional certificates allowed."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Registration Certificate (Required) */}
        <div className="space-y-2">
          <FileUpload
            label="Registration Certificate"
            required
            uploadType="document"
            value={registrationCertificateUrl}
            onChange={handleRegistrationCertificateChange}
            onRemove={handleRegistrationCertificateRemove}
            error={errors.registrationCertificateUrl?.message}
            helperText="Upload your organization's registration certificate (PDF, JPEG, or PNG, max 5MB)"
          />
        </div>

        {/* Organization Logo (Optional) */}
        <div className="space-y-2">
          <FileUpload
            label="Organization Logo"
            uploadType="logo"
            value={logoUrl}
            onChange={handleLogoChange}
            onRemove={handleLogoRemove}
            error={errors.logoUrl?.message}
            helperText="Upload your organization's logo (JPEG, PNG, or SVG, max 2MB). This will be displayed on your profile."
          />
        </div>

        {/* Additional Certificates (Optional, Max 3) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Additional Certificates <span className="text-gray-500 text-sm font-normal">(Optional)</span>
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Upload up to 3 additional certificates (awards, accreditations, etc.)
              </p>
            </div>
            {additionalCertificateUrls.length < 3 && (
              <button
                type="button"
                onClick={handleAddAdditionalCertificate}
                className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700
                           border border-primary-300 rounded-md hover:bg-primary-50
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                           transition-colors duration-150 font-medium"
              >
                + Add Certificate
              </button>
            )}
          </div>

          {/* Additional Certificates List */}
          {additionalCertificateUrls.length > 0 && (
            <div className="space-y-4">
              {additionalCertificateUrls.map((url, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      Additional Certificate {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleAdditionalCertificateRemove(index)}
                      className="px-3 py-1.5 text-sm text-error-600 hover:text-error-700
                                 border border-error-300 rounded-md hover:bg-error-50
                                 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2
                                 transition-colors duration-150"
                    >
                      Remove
                    </button>
                  </div>
                  <FileUpload
                    label=""
                    uploadType="document"
                    value={url}
                    onChange={(fileUrl) => handleAdditionalCertificateChange(index, fileUrl)}
                    onRemove={() => handleAdditionalCertificateRemove(index)}
                    helperText="PDF, JPEG, or PNG, max 5MB"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Max Certificates Message */}
          {additionalCertificateUrls.length >= 3 && (
            <div className="p-3 bg-info-50 border border-info-500 rounded-md">
              <p className="text-sm text-info-800">
                Maximum of 3 additional certificates reached. Remove one to add another.
              </p>
            </div>
          )}

          {/* Additional Certificates Error */}
          {errors.additionalCertificateUrls && (
            <p role="alert" className="text-sm text-error-500 flex items-center gap-1">
              <span>⚠️</span>
              {errors.additionalCertificateUrls.message}
            </p>
          )}

          {/* Empty State */}
          {additionalCertificateUrls.length === 0 && (
            <div className="p-6 text-center border border-gray-200 rounded-md bg-gray-50">
              <p className="text-gray-600 mb-3">
                No additional certificates added yet.
              </p>
              <button
                type="button"
                onClick={handleAddAdditionalCertificate}
                aria-label="Add first additional certificate"
                className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700
                           border border-primary-300 rounded-md hover:bg-primary-50
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                           transition-colors duration-150 font-medium min-h-[44px]"
              >
                + Add First Certificate
              </button>
            </div>
          )}
        </div>

        {/* Upload Summary */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Upload Summary
          </h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className={registrationCertificateUrl ? 'text-success-500' : 'text-error-500'}>
                {registrationCertificateUrl ? '✓' : '✗'}
              </span>
              Registration Certificate {registrationCertificateUrl ? '(Uploaded)' : '(Required)'}
            </li>
            <li className="flex items-center gap-2">
              <span className={logoUrl ? 'text-success-500' : 'text-gray-400'}>
                {logoUrl ? '✓' : '○'}
              </span>
              Organization Logo {logoUrl ? '(Uploaded)' : '(Optional)'}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-400">
                {additionalCertificateUrls.filter((url) => url.trim().length > 0).length}/3
              </span>
              Additional Certificates ({additionalCertificateUrls.filter((url) => url.trim().length > 0).length} uploaded, max 3)
            </li>
          </ul>
        </div>

        {/* Navigation */}
        <FormNavigation
          onBack={handleBack}
          onNext={handleNext}
          onSaveDraft={handleSaveDraft}
          isFirstStep={isFirstStep}
          nextLabel="Next: Review & Submit"
        />
      </form>
    </div>
  );
}
