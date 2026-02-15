'use client';

import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FileUpload } from '@/components/form/FileUpload';

interface DocumentsSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

export function DocumentsSection({ register, errors, setValue, watch }: DocumentsSectionProps) {
  const registrationCertificateUrl = watch('documents.registrationCertificateUrl', '');
  const logoUrl = watch('documents.logoUrl', '');
  const additionalCertificateUrls = watch('documents.additionalCertificateUrls', []) as string[];

  // Register fields
  register('documents.registrationCertificateUrl');
  register('documents.logoUrl');
  register('documents.additionalCertificateUrls');

  // Handle registration certificate upload
  const handleRegistrationCertificateChange = (fileUrl: string) => {
    setValue('documents.registrationCertificateUrl', fileUrl, { shouldValidate: true });
  };

  const handleRegistrationCertificateRemove = () => {
    setValue('documents.registrationCertificateUrl', '', { shouldValidate: true });
  };

  // Handle logo upload
  const handleLogoChange = (fileUrl: string) => {
    setValue('documents.logoUrl', fileUrl, { shouldValidate: true });
  };

  const handleLogoRemove = () => {
    setValue('documents.logoUrl', '', { shouldValidate: true });
  };

  // Handle additional certificates
  const handleAddAdditionalCertificate = () => {
    if (additionalCertificateUrls.length < 3) {
      const newUrls = [...additionalCertificateUrls, ''];
      setValue('documents.additionalCertificateUrls', newUrls, { shouldValidate: true });
    }
  };

  const handleAdditionalCertificateChange = (index: number, fileUrl: string) => {
    const newUrls = [...additionalCertificateUrls];
    newUrls[index] = fileUrl;
    setValue('documents.additionalCertificateUrls', newUrls, { shouldValidate: true });
  };

  const handleAdditionalCertificateRemove = (index: number) => {
    const newUrls = additionalCertificateUrls.filter((_, i) => i !== index);
    setValue('documents.additionalCertificateUrls', newUrls, { shouldValidate: true });
  };

  return (
    <div className="space-y-8">
      {/* Registration Certificate (Required) */}
      <div className="space-y-2">
        <FileUpload
          label="Registration Certificate"
          required
          uploadType="document"
          value={registrationCertificateUrl}
          onChange={handleRegistrationCertificateChange}
          onRemove={handleRegistrationCertificateRemove}
          error={errors.registrationCertificateUrl?.message as string}
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
          error={errors.logoUrl?.message as string}
          helperText="Upload your organization's logo (JPEG, PNG, or SVG, max 2MB). This will be displayed on your profile."
        />
      </div>

      {/* Additional Certificates (Optional, Max 3) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Additional Certificates{' '}
              <span className="text-gray-500 text-sm font-normal">(Optional)</span>
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
            {errors.additionalCertificateUrls.message as string}
          </p>
        )}

        {/* Empty State */}
        {additionalCertificateUrls.length === 0 && (
          <div className="p-6 text-center border border-gray-200 rounded-md bg-gray-50">
            <p className="text-gray-600 mb-3">No additional certificates added yet.</p>
            <button
              type="button"
              onClick={handleAddAdditionalCertificate}
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
        <h3 className="text-sm font-medium text-gray-700 mb-2">Upload Summary</h3>
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
            Additional Certificates (
            {additionalCertificateUrls.filter((url) => url.trim().length > 0).length} uploaded, max
            3)
          </li>
        </ul>
      </div>
    </div>
  );
}
