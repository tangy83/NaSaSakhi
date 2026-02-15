'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useFormState } from '@/lib/hooks/useFormState';
import { AccordionSection } from '@/components/register/AccordionSection';
import { ProgressSidebar, SectionStatus } from '@/components/register/ProgressSidebar';
import { OrganizationSection } from '@/components/register/sections/OrganizationSection';
import { PrimaryContactSection } from '@/components/register/sections/PrimaryContactSection';
import { SecondaryContactSection } from '@/components/register/sections/SecondaryContactSection';
import { OnlinePresenceSection } from '@/components/register/sections/OnlinePresenceSection';
import { ServicesSection } from '@/components/register/sections/ServicesSection';
import { BranchesSection } from '@/components/register/sections/BranchesSection';
import { LanguagesSection } from '@/components/register/sections/LanguagesSection';
import { DocumentsSection } from '@/components/register/sections/DocumentsSection';
import { organizationSchema } from '@/lib/validation/organizationSchema';
import { contactSchema } from '@/lib/validation/contactSchema';
import { servicesSchema } from '@/lib/validation/servicesSchema';
import { branchesSchema } from '@/lib/validation/branchesSchema';
import { languagesSchema } from '@/lib/validation/languagesSchema';
import { documentsSchema } from '@/lib/validation/documentsSchema';
import { submitRegistration } from '@/lib/api';
import { RegistrationFormData } from '@/types/api';
import { useApiError } from '@/hooks/useApiError';
import { useToast } from '@/contexts/ToastContext';

// Combined validation schema for all sections
const fullFormSchema = organizationSchema
  .merge(contactSchema)
  .merge(servicesSchema)
  .merge(branchesSchema)
  .merge(languagesSchema)
  .merge(documentsSchema);

type FullFormData = z.infer<typeof fullFormSchema>;

export default function AccordionFormPage() {
  const router = useRouter();
  const { formData, updateStepData, saveDraft, clearDraft, loadDraftFromBackend } = useFormState();
  const { handleError } = useApiError();
  const { showSuccess, showError } = useToast();

  // Section state management
  const [openSection, setOpenSection] = useState(1);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [sectionErrors, setSectionErrors] = useState<Map<number, boolean>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Initialize form with existing data
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    trigger,
  } = useForm({
    resolver: zodResolver(fullFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      // Organization
      organizationName: formData.organizationName || '',
      registrationType: formData.registrationType,
      registrationNumber: formData.registrationNumber || '',
      yearEstablished: formData.yearEstablished,
      faithId: formData.faithId || '',
      socialCategoryIds: formData.socialCategoryIds || [],
      // Contact
      primaryContact: formData.primaryContact || { name: '', phone: '', email: '' },
      secondaryContact: formData.secondaryContact,
      websiteUrl: formData.websiteUrl || '',
      facebookUrl: formData.facebookUrl || '',
      instagramHandle: formData.instagramHandle || '',
      twitterHandle: formData.twitterHandle || '',
      // Services
      categoryIds: formData.categoryIds || [],
      resourceIds: formData.resourceIds || [],
      // Branches
      branches: formData.branches || [
        {
          addressLine1: '',
          addressLine2: '',
          cityId: '',
          stateId: '',
          pinCode: '',
          country: 'India',
          timings: [],
        },
      ],
      // Languages
      languageIds: formData.languageIds || [],
      // Documents
      registrationCertificateUrl: formData.documents?.registrationCertificateUrl || '',
      logoUrl: formData.documents?.logoUrl || '',
      additionalCertificateUrls: formData.documents?.additionalCertificateUrls || [],
    },
  });

  // Watch all form data for auto-save
  const watchedData = watch();

  // Section configuration
  const sections: Array<{
    number: number;
    title: string;
    isRequired: boolean;
    fields: string[];
  }> = [
    {
      number: 1,
      title: 'Organization Details',
      isRequired: true,
      fields: ['organizationName', 'registrationType', 'registrationNumber', 'yearEstablished'],
    },
    {
      number: 2,
      title: 'Primary Contact',
      isRequired: true,
      fields: ['primaryContact.name', 'primaryContact.phone', 'primaryContact.email'],
    },
    {
      number: 3,
      title: 'Secondary Contact',
      isRequired: false,
      fields: ['secondaryContact'],
    },
    {
      number: 4,
      title: 'Online Presence',
      isRequired: false,
      fields: ['websiteUrl', 'facebookUrl', 'instagramHandle', 'twitterHandle'],
    },
    {
      number: 5,
      title: 'Services & Programs',
      isRequired: true,
      fields: ['categoryIds', 'resourceIds'],
    },
    {
      number: 6,
      title: 'Branch Locations',
      isRequired: true,
      fields: ['branches'],
    },
    {
      number: 7,
      title: 'Language Support',
      isRequired: true,
      fields: ['languageIds'],
    },
    {
      number: 8,
      title: 'Document Uploads',
      isRequired: true,
      fields: ['documents.registrationCertificateUrl'],
    },
  ];

  // Validate a specific section
  const validateSection = async (sectionNumber: number): Promise<boolean> => {
    const section = sections.find((s) => s.number === sectionNumber);
    if (!section) return false;

    // Trigger validation for all fields in the section
    const result = await trigger(section.fields as any);

    // Check if any field in this section has errors
    const hasErrors = section.fields.some((field) => {
      const fieldParts = field.split('.');
      let errorObj: any = errors;
      for (const part of fieldParts) {
        if (errorObj?.[part]) {
          errorObj = errorObj[part];
        } else {
          return false;
        }
      }
      return !!errorObj;
    });

    // Update section error state
    const newErrors = new Map(sectionErrors);
    newErrors.set(sectionNumber, hasErrors);
    setSectionErrors(newErrors);

    // If valid, mark as complete
    if (result && !hasErrors) {
      const newCompleted = new Set(completedSections);
      newCompleted.add(sectionNumber);
      setCompletedSections(newCompleted);
      return true;
    }

    return false;
  };

  // Handle section toggle
  const handleSectionToggle = (sectionNumber: number) => {
    setOpenSection(openSection === sectionNumber ? 0 : sectionNumber);
  };

  // Handle section validation and continue
  const handleSectionValidate = async (sectionNumber: number): Promise<boolean> => {
    const isValid = await validateSection(sectionNumber);

    if (isValid) {
      // Move to next section if available
      if (sectionNumber < sections.length) {
        setOpenSection(sectionNumber + 1);
      } else {
        setOpenSection(0); // Close all if this is the last section
      }
    }

    return isValid;
  };

  // Handle skip optional section
  const handleSectionSkip = (sectionNumber: number) => {
    // Mark as complete even though skipped
    const newCompleted = new Set(completedSections);
    newCompleted.add(sectionNumber);
    setCompletedSections(newCompleted);

    // Move to next section
    if (sectionNumber < sections.length) {
      setOpenSection(sectionNumber + 1);
    } else {
      setOpenSection(0);
    }
  };

  // Navigate to specific section from sidebar
  const handleSectionClick = (sectionNumber: number) => {
    setOpenSection(sectionNumber);
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      // Update form state with current data
      updateStepData(1, watchedData);
      await saveDraft();
      showSuccess('Draft saved successfully', 2000);
    } catch (error) {
      handleError(error, 'Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Handle final form submission
  const onSubmit = async (data: FullFormData) => {
    setIsSubmitting(true);

    try {
      // Validate all sections
      const allValid = await Promise.all(sections.map((s) => validateSection(s.number)));
      const hasInvalidSection = allValid.some((valid) => !valid);

      if (hasInvalidSection) {
        showError('Please complete all required sections before submitting', 5000);
        setIsSubmitting(false);
        return;
      }

      // Prepare submission data
      const submissionData: RegistrationFormData = {
        // Organization
        organizationName: data.organizationName,
        registrationType: data.registrationType,
        registrationNumber: data.registrationNumber,
        yearEstablished: data.yearEstablished,
        faithId: data.faithId || undefined,
        socialCategoryIds: data.socialCategoryIds || [],
        // Contact
        primaryContact: data.primaryContact,
        secondaryContact: data.secondaryContact,
        websiteUrl: data.websiteUrl || undefined,
        facebookUrl: data.facebookUrl || undefined,
        instagramHandle: data.instagramHandle || undefined,
        twitterHandle: data.twitterHandle || undefined,
        // Services
        categoryIds: data.categoryIds,
        resourceIds: data.resourceIds,
        // Branches
        branches: data.branches,
        // Languages
        languageIds: data.languageIds,
        // Documents
        documents: {
          registrationCertificateUrl: data.registrationCertificateUrl,
          logoUrl: data.logoUrl || undefined,
          additionalCertificateUrls:
            data.additionalCertificateUrls?.filter((url) => url.trim().length > 0) || [],
        },
      };

      // Submit to backend
      const response = await submitRegistration(submissionData);

      if (response.success && response.data) {
        showSuccess('Registration submitted successfully!', 3000);

        // Store registration ID
        localStorage.setItem('last_registration_id', response.data.registrationId);

        // Clear draft
        clearDraft(false);

        // Redirect to success page
        setTimeout(() => {
          router.push(`/register/success?id=${response.data.registrationId}`);
        }, 1500);
      } else {
        throw new Error(response.error || 'Submission failed');
      }
    } catch (error) {
      handleError(error, 'Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build section status for sidebar
  const sectionStatuses: SectionStatus[] = sections.map((section) => ({
    number: section.number,
    title: section.title,
    isRequired: section.isRequired,
    isComplete: completedSections.has(section.number),
    hasErrors: sectionErrors.get(section.number) || false,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <ProgressSidebar
            sections={sectionStatuses}
            currentSection={openSection}
            onSectionClick={handleSectionClick}
            onSaveDraft={handleSaveDraft}
            isSaving={isSavingDraft}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-ui mb-2">
                Organization Registration
              </h1>
              <p className="text-gray-600">
                Complete all required sections to register your organization with NASA Sakhi
              </p>
            </div>

            {/* Mobile Progress Indicator */}
            <div className="lg:hidden mb-6 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-semibold text-primary-600">
                  {completedSections.size} of {sections.length}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${(completedSections.size / sections.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Section 1: Organization Details */}
              <AccordionSection
                sectionNumber={1}
                title="Organization Details"
                isRequired={true}
                isOpen={openSection === 1}
                isComplete={completedSections.has(1)}
                hasErrors={sectionErrors.get(1) || false}
                onToggle={() => handleSectionToggle(1)}
                onValidate={() => handleSectionValidate(1)}
              >
                <OrganizationSection
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                />
              </AccordionSection>

              {/* Section 2: Primary Contact */}
              <AccordionSection
                sectionNumber={2}
                title="Primary Contact"
                isRequired={true}
                isOpen={openSection === 2}
                isComplete={completedSections.has(2)}
                hasErrors={sectionErrors.get(2) || false}
                onToggle={() => handleSectionToggle(2)}
                onValidate={() => handleSectionValidate(2)}
              >
                <PrimaryContactSection register={register} errors={errors} />
              </AccordionSection>

              {/* Section 3: Secondary Contact */}
              <AccordionSection
                sectionNumber={3}
                title="Secondary Contact"
                isRequired={false}
                isOpen={openSection === 3}
                isComplete={completedSections.has(3)}
                hasErrors={sectionErrors.get(3) || false}
                onToggle={() => handleSectionToggle(3)}
                onValidate={() => handleSectionValidate(3)}
                onSkip={() => handleSectionSkip(3)}
              >
                <SecondaryContactSection
                  register={register}
                  errors={errors}
                  hasSecondaryContact={!!watchedData.secondaryContact}
                  onToggle={(show) => {
                    if (!show) {
                      setValue('secondaryContact', undefined);
                    }
                  }}
                />
              </AccordionSection>

              {/* Section 4: Online Presence */}
              <AccordionSection
                sectionNumber={4}
                title="Online Presence"
                isRequired={false}
                isOpen={openSection === 4}
                isComplete={completedSections.has(4)}
                hasErrors={sectionErrors.get(4) || false}
                onToggle={() => handleSectionToggle(4)}
                onValidate={() => handleSectionValidate(4)}
                onSkip={() => handleSectionSkip(4)}
              >
                <OnlinePresenceSection register={register} errors={errors} />
              </AccordionSection>

              {/* Section 5: Services & Programs */}
              <AccordionSection
                sectionNumber={5}
                title="Services & Programs"
                isRequired={true}
                isOpen={openSection === 5}
                isComplete={completedSections.has(5)}
                hasErrors={sectionErrors.get(5) || false}
                onToggle={() => handleSectionToggle(5)}
                onValidate={() => handleSectionValidate(5)}
              >
                <ServicesSection
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                />
              </AccordionSection>

              {/* Section 6: Branch Locations */}
              <AccordionSection
                sectionNumber={6}
                title="Branch Locations"
                isRequired={true}
                isOpen={openSection === 6}
                isComplete={completedSections.has(6)}
                hasErrors={sectionErrors.get(6) || false}
                onToggle={() => handleSectionToggle(6)}
                onValidate={() => handleSectionValidate(6)}
              >
                <BranchesSection
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                  control={control}
                />
              </AccordionSection>

              {/* Section 7: Language Support */}
              <AccordionSection
                sectionNumber={7}
                title="Language Support"
                isRequired={true}
                isOpen={openSection === 7}
                isComplete={completedSections.has(7)}
                hasErrors={sectionErrors.get(7) || false}
                onToggle={() => handleSectionToggle(7)}
                onValidate={() => handleSectionValidate(7)}
              >
                <LanguagesSection
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                />
              </AccordionSection>

              {/* Section 8: Document Uploads */}
              <AccordionSection
                sectionNumber={8}
                title="Document Uploads"
                isRequired={true}
                isOpen={openSection === 8}
                isComplete={completedSections.has(8)}
                hasErrors={sectionErrors.get(8) || false}
                onToggle={() => handleSectionToggle(8)}
                onValidate={() => handleSectionValidate(8)}
              >
                <DocumentsSection
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                />
              </AccordionSection>

              {/* Final Submit Section */}
              <div className="mt-8 p-6 bg-white border-2 border-primary-500 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Ready to Submit?</h2>

                {/* Requirements Check */}
                <div className="mb-6 space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Requirements:</h3>
                  {sections
                    .filter((s) => s.isRequired)
                    .map((section) => (
                      <div key={section.number} className="flex items-center gap-2 text-sm">
                        <span
                          className={
                            completedSections.has(section.number)
                              ? 'text-success-500'
                              : 'text-error-500'
                          }
                        >
                          {completedSections.has(section.number) ? '✓' : '✗'}
                        </span>
                        <span className="text-gray-700">{section.title}</span>
                        {!completedSections.has(section.number) && (
                          <button
                            type="button"
                            onClick={() => setOpenSection(section.number)}
                            className="ml-auto text-primary-600 hover:text-primary-700 text-xs underline"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      sections.filter((s) => s.isRequired).some((s) => !completedSections.has(s.number))
                    }
                    className="flex-1 min-h-[48px] px-6 py-3 bg-primary-600 text-white
                             rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4
                             focus:ring-primary-100 focus:ring-offset-2 transition-colors duration-150
                             font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Registration'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSavingDraft}
                    className="sm:flex-none min-h-[48px] px-6 py-3 border-2 border-gray-300
                             text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4
                             focus:ring-gray-100 focus:ring-offset-2 transition-colors duration-150
                             font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingDraft ? 'Saving...' : 'Save Draft'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
