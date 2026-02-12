'use client';

import { useState, useEffect } from 'react';
import { useFormState } from '@/lib/hooks/useFormState';
import { FormHeader } from '@/components/layout/FormHeader';
import { FormNavigation } from '@/components/layout/FormNavigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { submitRegistration, fetchCategories, fetchResources, fetchLanguages, fetchStates, fetchCities, fetchFaiths, fetchSocialCategories } from '@/lib/api';
import { RegistrationFormData } from '@/types/api';
import { useRouter } from 'next/navigation';
import { useApiError } from '@/hooks/useApiError';
import { useToast } from '@/contexts/ToastContext';

export default function Step7Page() {
  const router = useRouter();
  const { formData, goToStep, clearDraft } = useFormState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [isLoadingReferenceData, setIsLoadingReferenceData] = useState(true);
  const { handleError, retry } = useApiError();
  const { showSuccess, showError } = useToast();

  // Load reference data for display
  const [referenceData, setReferenceData] = useState<{
    categories: Map<string, string>;
    resources: Map<string, string>;
    languages: Map<string, string>;
    states: Map<string, string>;
    cities: Map<string, string>;
    faiths: Map<string, string>;
    socialCategories: Map<string, string>;
  }>({
    categories: new Map(),
    resources: new Map(),
    languages: new Map(),
    states: new Map(),
    cities: new Map(),
    faiths: new Map(),
    socialCategories: new Map(),
  });

  useEffect(() => {
    // Load reference data for display
    const loadReferenceData = async () => {
      setIsLoadingReferenceData(true);
      
      try {
        const [categoriesRes, resourcesRes, languagesRes, statesRes, citiesRes, faithsRes, socialCategoriesRes] =
          await Promise.all([
            fetchCategories(),
            fetchResources(),
            fetchLanguages(),
            fetchStates(),
            fetchCities(),
            fetchFaiths(),
            fetchSocialCategories(),
          ]);

        const categoriesMap = new Map<string, string>();
        if (categoriesRes.success && categoriesRes.data) {
          categoriesRes.data.forEach((cat: { id: string; name: string }) => categoriesMap.set(cat.id, cat.name));
        }

        const resourcesMap = new Map<string, string>();
        if (resourcesRes.success && resourcesRes.data) {
          resourcesRes.data.forEach((res: { id: string; name: string }) => resourcesMap.set(res.id, res.name));
        }

        const languagesMap = new Map<string, string>();
        if (languagesRes.success && languagesRes.data) {
          languagesRes.data.forEach((lang: { id: string; name: string }) => languagesMap.set(lang.id, lang.name));
        }

        const statesMap = new Map<string, string>();
        if (statesRes.success && statesRes.data) {
          statesRes.data.forEach((state: { id: string; name: string }) => statesMap.set(state.id, state.name));
        }

        const citiesMap = new Map<string, string>();
        if (citiesRes.success && citiesRes.data) {
          citiesRes.data.forEach((city: { id: string; name: string; stateName: string }) => citiesMap.set(city.id, `${city.name}, ${city.stateName}`));
        }

        const faithsMap = new Map<string, string>();
        if (faithsRes.success && faithsRes.data) {
          faithsRes.data.forEach((faith: { id: string; name: string }) => faithsMap.set(faith.id, faith.name));
        }

        const socialCategoriesMap = new Map<string, string>();
        if (socialCategoriesRes.success && socialCategoriesRes.data) {
          socialCategoriesRes.data.forEach((cat: { id: string; name: string }) => socialCategoriesMap.set(cat.id, cat.name));
        }

        setReferenceData({
          categories: categoriesMap,
          resources: resourcesMap,
          languages: languagesMap,
          states: statesMap,
          cities: citiesMap,
          faiths: faithsMap,
          socialCategories: socialCategoriesMap,
        });
      } catch (error) {
        handleError(error, 'Failed to load review data. Please refresh the page.');
      } finally {
        setIsLoadingReferenceData(false);
      }
    };

    loadReferenceData();
  }, [handleError]);

  // Handle edit step
  const handleEditStep = (step: number) => {
    goToStep(step);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Retry submission up to 3 times with exponential backoff
      const response = await retry(
        () => submitRegistration(formData as RegistrationFormData),
        3,
        1000
      );

      if (response.success && response.data) {
        setSubmitSuccess(true);
        setRegistrationId(response.data.registrationId);
        
        // Show success message
        showSuccess('Registration submitted successfully! Redirecting...', 3000);
        
        // Store registration ID in localStorage for success page
        localStorage.setItem('last_registration_id', response.data.registrationId);
        
        // Clear draft after successful submission
        clearDraft();
        
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          router.push(`/register/success?id=${response.data.registrationId}`);
        }, 2000);
      } else {
        const errorMessage = response.error || 'Submission failed. Please try again.';
        setSubmitError(errorMessage);
        showError(errorMessage, 5000);
      }
    } catch (error) {
      const errorMessage = handleError(error, 'Failed to submit registration. Please try again.');
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to format display values
  const getDisplayValue = (value: any, map?: Map<string, string>): string => {
    if (value === undefined || value === null || value === '') return 'Not provided';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'None selected';
      if (map) {
        return value.map((id) => map.get(id) || id).join(', ');
      }
      return value.join(', ');
    }
    if (map) {
      return map.get(value) || value;
    }
    return String(value);
  };

  // Success message
  if (submitSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="p-6 bg-success-50 border border-success-500 rounded-md">
          <div className="flex items-start gap-3">
            <span className="text-success-500 text-3xl">✓</span>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-success-800 mb-2">
                Registration Submitted Successfully!
              </h2>
              <p className="text-sm text-success-700 mb-4">
                Your registration has been submitted and will be reviewed within 48 hours.
              </p>
              {registrationId && (
                <div className="p-3 bg-white border border-success-300 rounded-md">
                  <p className="text-sm text-success-800">
                    <strong>Registration ID:</strong> {registrationId}
                  </p>
                </div>
              )}
              <p className="text-sm text-success-600 mt-4">
                Redirecting to success page...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
      <FormHeader
        title="Review & Submit"
        subtitle="Please review all your information before submitting"
        helpText="Verify all details are correct. You can edit any section by clicking the 'Edit' button."
      />

      <div className="space-y-8">
        {/* Step 1: Organization Details */}
        <div className="p-4 sm:p-6 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Step 1: Organization Details</h3>
            <button
              type="button"
              onClick={() => handleEditStep(1)}
              className="min-h-[44px] px-4 py-2 text-sm text-primary-600 hover:text-primary-700
                         border border-primary-300 rounded-md hover:bg-primary-50
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                         transition-colors duration-150"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Organization Name:</span>
              <p className="font-medium text-gray-900">{formData.organizationName || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-gray-600">Registration Type:</span>
              <p className="font-medium text-gray-900">{formData.registrationType || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-gray-600">Registration Number:</span>
              <p className="font-medium text-gray-900">{formData.registrationNumber || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-gray-600">Year Established:</span>
              <p className="font-medium text-gray-900">{formData.yearEstablished || 'Not provided'}</p>
            </div>
            {formData.faithId && (
              <div>
                <span className="text-gray-600">Religious Affiliation:</span>
                <p className="font-medium text-gray-900">
                  {getDisplayValue(formData.faithId, referenceData.faiths)}
                </p>
              </div>
            )}
            {formData.socialCategoryIds && formData.socialCategoryIds.length > 0 && (
              <div>
                <span className="text-gray-600">Social Categories:</span>
                <p className="font-medium text-gray-900">
                  {getDisplayValue(formData.socialCategoryIds, referenceData.socialCategories)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Contact Information */}
        <div className="p-4 sm:p-6 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Step 2: Contact Information</h3>
            <button
              type="button"
              onClick={() => handleEditStep(2)}
              className="min-h-[44px] px-4 py-2 text-sm text-primary-600 hover:text-primary-700
                         border border-primary-300 rounded-md hover:bg-primary-50
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                         transition-colors duration-150"
            >
              Edit
            </button>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Primary Contact</h4>
              <div className="pl-4 space-y-1">
                <p><span className="text-gray-600">Name:</span> <span className="font-medium text-gray-900">{formData.primaryContact?.name || 'Not provided'}</span></p>
                <p><span className="text-gray-600">Phone:</span> <span className="font-medium text-gray-900">{formData.primaryContact?.phone || 'Not provided'}</span></p>
                <p><span className="text-gray-600">Email:</span> <span className="font-medium text-gray-900">{formData.primaryContact?.email || 'Not provided'}</span></p>
              </div>
            </div>
            {formData.secondaryContact && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Secondary Contact</h4>
                <div className="pl-4 space-y-1">
                  <p><span className="text-gray-600">Name:</span> <span className="font-medium text-gray-900">{formData.secondaryContact.name}</span></p>
                  <p><span className="text-gray-600">Phone:</span> <span className="font-medium text-gray-900">{formData.secondaryContact.phone}</span></p>
                  <p><span className="text-gray-600">Email:</span> <span className="font-medium text-gray-900">{formData.secondaryContact.email}</span></p>
                </div>
              </div>
            )}
            {(formData.websiteUrl || formData.facebookUrl || formData.instagramHandle || formData.twitterHandle) && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Website & Social Media</h4>
                <div className="pl-4 space-y-1">
                  {formData.websiteUrl && <p><span className="text-gray-600">Website:</span> <span className="font-medium text-gray-900">{formData.websiteUrl}</span></p>}
                  {formData.facebookUrl && <p><span className="text-gray-600">Facebook:</span> <span className="font-medium text-gray-900">{formData.facebookUrl}</span></p>}
                  {formData.instagramHandle && <p><span className="text-gray-600">Instagram:</span> <span className="font-medium text-gray-900">@{formData.instagramHandle}</span></p>}
                  {formData.twitterHandle && <p><span className="text-gray-600">Twitter:</span> <span className="font-medium text-gray-900">@{formData.twitterHandle}</span></p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Services */}
        <div className="p-4 sm:p-6 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Step 3: Service Categories & Resources</h3>
            <button
              type="button"
              onClick={() => handleEditStep(3)}
              className="min-h-[44px] px-4 py-2 text-sm text-primary-600 hover:text-primary-700
                         border border-primary-300 rounded-md hover:bg-primary-50
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                         transition-colors duration-150"
            >
              Edit
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-600">Service Categories:</span>
              <p className="font-medium text-gray-900 mt-1">
                {getDisplayValue(formData.categoryIds, referenceData.categories)}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Service Resources:</span>
              <p className="font-medium text-gray-900 mt-1">
                {getDisplayValue(formData.resourceIds, referenceData.resources)}
              </p>
            </div>
          </div>
        </div>

        {/* Step 4: Branches */}
        <div className="p-4 sm:p-6 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Step 4: Branch Locations</h3>
            <button
              type="button"
              onClick={() => handleEditStep(4)}
              className="min-h-[44px] px-4 py-2 text-sm text-primary-600 hover:text-primary-700
                         border border-primary-300 rounded-md hover:bg-primary-50
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                         transition-colors duration-150"
            >
              Edit
            </button>
          </div>
          <div className="space-y-4">
            {formData.branches && formData.branches.length > 0 ? (
              formData.branches.map((branch, index) => (
                <div key={index} className="p-4 bg-white border border-gray-200 rounded-md">
                  <h4 className="font-medium text-gray-700 mb-2">Branch {index + 1}</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Address:</span> <span className="font-medium text-gray-900">{branch.addressLine1}</span></p>
                    {branch.addressLine2 && <p><span className="text-gray-600">Address Line 2:</span> <span className="font-medium text-gray-900">{branch.addressLine2}</span></p>}
                    <p><span className="text-gray-600">City:</span> <span className="font-medium text-gray-900">{getDisplayValue(branch.cityId, referenceData.cities)}</span></p>
                    <p><span className="text-gray-600">State:</span> <span className="font-medium text-gray-900">{getDisplayValue(branch.stateId, referenceData.states)}</span></p>
                    <p><span className="text-gray-600">PIN Code:</span> <span className="font-medium text-gray-900">{branch.pinCode}</span></p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No branches added</p>
            )}
          </div>
        </div>

        {/* Step 5: Languages */}
        <div className="p-4 sm:p-6 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Step 5: Language Preferences</h3>
            <button
              type="button"
              onClick={() => handleEditStep(5)}
              className="min-h-[44px] px-4 py-2 text-sm text-primary-600 hover:text-primary-700
                         border border-primary-300 rounded-md hover:bg-primary-50
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                         transition-colors duration-150"
            >
              Edit
            </button>
          </div>
          <div className="text-sm">
            <span className="text-gray-600">Languages:</span>
            <p className="font-medium text-gray-900 mt-1">
              {getDisplayValue(formData.languageIds, referenceData.languages)}
            </p>
          </div>
        </div>

        {/* Step 6: Documents */}
        <div className="p-4 sm:p-6 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Step 6: Document Uploads</h3>
            <button
              type="button"
              onClick={() => handleEditStep(6)}
              className="min-h-[44px] px-4 py-2 text-sm text-primary-600 hover:text-primary-700
                         border border-primary-300 rounded-md hover:bg-primary-50
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                         transition-colors duration-150"
            >
              Edit
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Registration Certificate:</span>
              {formData.documents?.registrationCertificateUrl ? (
                <a
                  href={formData.documents.registrationCertificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-primary-600 hover:text-primary-700 underline"
                >
                  View Document
                </a>
              ) : (
                <span className="ml-2 text-error-500">Not uploaded</span>
              )}
            </div>
            {formData.documents?.logoUrl && (
              <div>
                <span className="text-gray-600">Organization Logo:</span>
                <a
                  href={formData.documents.logoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-primary-600 hover:text-primary-700 underline"
                >
                  View Logo
                </a>
              </div>
            )}
            {formData.documents?.additionalCertificateUrls && formData.documents.additionalCertificateUrls.length > 0 && (
              <div>
                <span className="text-gray-600">Additional Certificates:</span>
                <ul className="ml-4 mt-1 list-disc space-y-1">
                  {formData.documents.additionalCertificateUrls.map((url, index) => (
                    <li key={index}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 underline"
                      >
                        Certificate {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="p-4 bg-error-50 border border-error-500 rounded-md">
            <div className="flex items-start gap-3">
              <span className="text-error-500 text-xl">⚠️</span>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-error-800">Submission Failed</h3>
                <p className="text-sm text-error-700 mt-1">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <FormNavigation
          onBack={() => goToStep(6)}
          onNext={handleSubmit}
          isFirstStep={false}
          isLastStep={true}
          isSubmitting={isSubmitting}
          nextLabel="Submit Registration"
        />
      </div>
    </div>
  );
}
