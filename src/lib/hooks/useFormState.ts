'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { RegistrationFormData, DraftSaveRequest } from '@/types/api';
import { organizationSchema } from '@/lib/validation/organizationSchema';
import { contactSchema } from '@/lib/validation/contactSchema';
import { servicesSchema } from '@/lib/validation/servicesSchema';
import { branchesSchema } from '@/lib/validation/branchesSchema';
import { languagesSchema } from '@/lib/validation/languagesSchema';
import { documentsSchema } from '@/lib/validation/documentsSchema';
import { saveDraft as saveDraftApi } from '@/lib/api';

// LocalStorage key for draft data
const DRAFT_STORAGE_KEY = 'nasa_sakhi_registration_draft';

// Initial empty form data
const initialFormData: Partial<RegistrationFormData> = {
  // Step 1: Organization Details
  organizationName: '',
  registrationType: undefined,
  registrationNumber: '',
  yearEstablished: undefined,
  faithId: undefined,
  socialCategoryIds: [],

  // Step 2: Contact Information
  primaryContact: {
    name: '',
    phone: '',
    email: '',
  },
  secondaryContact: undefined,
  websiteUrl: undefined,
  facebookUrl: undefined,
  instagramHandle: undefined,
  twitterHandle: undefined,

  // Step 3: Service Categories & Resources
  categoryIds: [],
  resourceIds: [],

  // Step 4: Branch Locations
  branches: [],

  // Step 5: Language Preferences
  languageIds: [],

  // Step 6: Document Uploads
  documents: {
    registrationCertificateUrl: '',
    logoUrl: undefined,
    additionalCertificateUrls: [],
  },
};

export function useFormState() {
  const router = useRouter();
  const pathname = usePathname();
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>(initialFormData);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [lastSaveTimestamp, setLastSaveTimestamp] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Refs to track auto-save state
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>(''); // Store stringified formData to detect changes
  const onSaveSuccessRef = useRef<((timestamp: Date) => void) | null>(null);
  const onSaveErrorRef = useRef<((error: string) => void) | null>(null);
  
  // Derive currentStep from URL to avoid state sync issues
  const getCurrentStepFromUrl = useCallback(() => {
    const match = pathname.match(/\/step(\d+)$/);
    return match ? parseInt(match[1], 10) : 1;
  }, [pathname]);
  
  const currentStep = getCurrentStepFromUrl();

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData(parsed);
        setIsDraftSaved(true);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Auto-save to localStorage whenever formData changes (immediate backup)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
    }, 2000); // Debounce: save 2 seconds after last change

    return () => clearTimeout(timeoutId);
  }, [formData]);

  // Internal function to save draft to backend
  const saveDraftToBackend = useCallback(async (data: Partial<RegistrationFormData>, silent = false) => {
    // Don't save if form is empty (no meaningful data)
    const hasData = Object.values(data).some((value) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some((v) => v !== '' && v !== undefined && v !== null);
      }
      return value !== '' && value !== undefined && value !== null;
    });

    if (!hasData) {
      return; // Skip saving empty forms
    }

    // Check if data has actually changed
    const currentDataString = JSON.stringify(data);
    if (currentDataString === lastSavedDataRef.current && !silent) {
      return; // No changes, skip save
    }

    setIsSaving(true);
    console.log('💾 Starting draft save to backend...', { hasData, silent });
    try {
      const request: DraftSaveRequest = {
        draftData: data,
        // email is optional - can be added later if user authentication is implemented
      };

      console.log('📤 Sending draft save request to API...');
      const response = await saveDraftApi(request);
      console.log('📥 Received response:', response);
      
      if (response.success && response.data) {
        const timestamp = new Date();
        setLastSaveTimestamp(timestamp);
        setIsDraftSaved(true);
        lastSavedDataRef.current = currentDataString;
        
        console.log('✅ Draft saved successfully to backend at', timestamp);
        console.log('📞 Checking if success callback exists:', !!onSaveSuccessRef.current);
        
        // Call success callback if provided
        if (onSaveSuccessRef.current) {
          console.log('📢 Calling success callback with timestamp:', timestamp);
          onSaveSuccessRef.current(timestamp);
        } else {
          console.warn('⚠️ Success callback not set - toast notification will not appear');
        }
      } else {
        throw new Error(response.error || 'Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft to backend:', error);
      
      // Call error callback if provided
      if (onSaveErrorRef.current) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to save draft';
        onSaveErrorRef.current(errorMessage);
      }
      
      // Still save to localStorage as backup
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Auto-save to backend every 2 minutes
  useEffect(() => {
    // Clear any existing interval
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
    }

    // Set up interval to save every 2 minutes (120000 ms)
    autoSaveIntervalRef.current = setInterval(() => {
      saveDraftToBackend(formData, false);
    }, 120000); // 2 minutes

    // Cleanup on unmount
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
        autoSaveIntervalRef.current = null;
      }
    };
  }, [formData, saveDraftToBackend]);

  // Update form data for a specific step
  const updateStepData = useCallback((step: number, data: Partial<RegistrationFormData>) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        ...data,
      };
      // Mark as unsaved when data changes
      setIsDraftSaved(false);
      return updated;
    });
  }, []);

  // Validate a specific step
  const validateStep = useCallback((step: number, dataToValidate?: Partial<RegistrationFormData>): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    // Use provided data or fall back to formData
    const data = dataToValidate ? { ...formData, ...dataToValidate } : formData;

    try {
      switch (step) {
        case 1: {
          // Extract only the fields needed for organization validation
          const orgData = {
            organizationName: data.organizationName || '',
            registrationType: data.registrationType,
            registrationNumber: data.registrationNumber || '',
            yearEstablished: data.yearEstablished,
            faithId: data.faithId,
            socialCategoryIds: data.socialCategoryIds || [],
          };
          const result = organizationSchema.safeParse(orgData);
          if (!result.success) {
            result.error.issues.forEach((issue) => {
              if (issue.path.length > 0) {
                errors[issue.path[0].toString()] = issue.message;
              }
            });
            return { isValid: false, errors };
          }
          break;
        }
        case 2: {
          // Extract only the fields needed for contact validation
          const contactData = {
            primaryContact: data.primaryContact,
            secondaryContact: data.secondaryContact,
            websiteUrl: data.websiteUrl,
            facebookUrl: data.facebookUrl,
            instagramHandle: data.instagramHandle,
            twitterHandle: data.twitterHandle,
          };
          const result = contactSchema.safeParse(contactData);
          if (!result.success) {
            result.error.issues.forEach((issue) => {
              if (issue.path.length > 0) {
                errors[issue.path[0].toString()] = issue.message;
              }
            });
            return { isValid: false, errors };
          }
          break;
        }
        case 3: {
          // Extract only the fields needed for services validation
          const servicesData = {
            categoryIds: data.categoryIds || [],
            resourceIds: data.resourceIds || [],
          };
          const result = servicesSchema.safeParse(servicesData);
          if (!result.success) {
            result.error.issues.forEach((issue) => {
              if (issue.path.length > 0) {
                errors[issue.path[0].toString()] = issue.message;
              }
            });
            return { isValid: false, errors };
          }
          break;
        }
        case 4: {
          const result = branchesSchema.safeParse({ branches: data.branches || [] });
          if (!result.success) {
            result.error.issues.forEach((issue) => {
              if (issue.path.length > 0) {
                errors[issue.path[0].toString()] = issue.message;
              }
            });
            return { isValid: false, errors };
          }
          break;
        }
        case 5: {
          // Extract only the fields needed for languages validation
          const languagesData = {
            languageIds: data.languageIds || [],
          };
          const result = languagesSchema.safeParse(languagesData);
          if (!result.success) {
            result.error.issues.forEach((issue) => {
              if (issue.path.length > 0) {
                errors[issue.path[0].toString()] = issue.message;
              }
            });
            return { isValid: false, errors };
          }
          break;
        }
        case 6: {
          // Extract documents data - handle both { documents: {...} } and direct documents object
          const documentsData = data.documents || {};
          
          // Ensure registrationCertificateUrl is valid (required field)
          if (!documentsData.registrationCertificateUrl || documentsData.registrationCertificateUrl.trim() === '') {
            errors.registrationCertificateUrl = 'Registration certificate is required';
            return { isValid: false, errors };
          }
          
          // Ensure logoUrl is handled correctly - keep empty string or undefined as-is
          const cleanedDocuments = {
            registrationCertificateUrl: documentsData.registrationCertificateUrl,
            // Keep empty string if present, otherwise undefined (schema accepts both)
            logoUrl: documentsData.logoUrl === '' ? '' : (documentsData.logoUrl || undefined),
            additionalCertificateUrls: documentsData.additionalCertificateUrls || [],
          };
          
          console.log('Step 6 validation - cleanedDocuments:', cleanedDocuments);
          console.log('Step 6 validation - registrationCertificateUrl:', cleanedDocuments.registrationCertificateUrl);
          console.log('Step 6 validation - URL starts with /?', cleanedDocuments.registrationCertificateUrl.startsWith('/'));
          
          const result = documentsSchema.safeParse(cleanedDocuments);
          if (!result.success) {
            console.error('Step 6 validation failed:', result.error.issues);
            console.error('Step 6 validation - Full error details:', JSON.stringify(result.error.issues, null, 2));
            result.error.issues.forEach((issue) => {
              const fieldPath = issue.path.length > 0 ? issue.path[0].toString() : '_form';
              errors[fieldPath] = issue.message;
            });
            return { isValid: false, errors };
          }
          console.log('Step 6 validation passed');
          break;
        }
        default:
          return { isValid: true, errors: {} };
      }

      return { isValid: true, errors: {} };
    } catch (error) {
      console.error('Validation error:', error);
      return { isValid: false, errors: { _form: 'Validation failed' } };
    }
  }, [formData]);

  // Navigate to next step (with validation)
  // Optional dataToValidate parameter allows validating data before it's merged into state
  const goToNextStep = useCallback((dataToValidate?: Partial<RegistrationFormData>): boolean => {
    const step = getCurrentStepFromUrl();
    const validation = validateStep(step, dataToValidate);
    if (!validation.isValid) {
      console.warn(`Step ${step} validation failed:`, validation.errors);
      return false; // Stay on current step if validation fails
    }

    if (step < 7) {
      const nextStep = step + 1;
      console.log(`Navigating from step ${step} to step ${nextStep}`);
      router.push(`/register/step${nextStep}`);
      return true;
    }
    return false;
  }, [getCurrentStepFromUrl, validateStep, router]);

  // Navigate to previous step
  const goToPreviousStep = useCallback(() => {
    const step = getCurrentStepFromUrl();
    if (step > 1) {
      const prevStep = step - 1;
      router.push(`/register/step${prevStep}`);
    }
  }, [getCurrentStepFromUrl, router]);

  // Navigate to specific step
  // If skipNavigation is true, only update state (used when URL already matches)
  // Note: Since we derive step from URL, skipNavigation is mostly ignored now
  const goToStep = useCallback((step: number, skipNavigation = false) => {
    if (step >= 1 && step <= 7) {
      if (!skipNavigation) {
        router.push(`/register/step${step}`);
      }
      // State will update automatically when URL changes
    }
  }, [router]);

  // Save draft manually (triggers immediate save to backend)
  const saveDraft = useCallback(async () => {
    // Save to localStorage immediately
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
    
    // Also save to backend
    await saveDraftToBackend(formData, false);
  }, [formData, saveDraftToBackend]);

  // Set callbacks for toast notifications (called from parent component)
  const setSaveCallbacks = useCallback(
    (onSuccess?: (timestamp: Date) => void, onError?: (error: string) => void) => {
      onSaveSuccessRef.current = onSuccess || null;
      onSaveErrorRef.current = onError || null;
    },
    []
  );

  // Load draft from backend (used by resume page)
  const loadDraftFromBackend = useCallback(async (draftData: Partial<RegistrationFormData>) => {
    console.log('📥 Loading draft data into form state...', draftData);
    
    // Update form data
    setFormData(draftData);
    
    // Save to localStorage as backup
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
    
    // Mark as saved
    setIsDraftSaved(true);
    setLastSaveTimestamp(new Date());
    
    console.log('✅ Draft data loaded successfully');
  }, []);

  // Clear draft (optionally navigate)
  const clearDraft = useCallback((navigate = true) => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setFormData(initialFormData);
    setIsDraftSaved(false);
    setLastSaveTimestamp(null);
    lastSavedDataRef.current = '';
    if (navigate) {
      router.push('/register/step1');
    }
  }, [router]);

  // Get current step data
  const getCurrentStepData = useCallback(() => {
    switch (currentStep) {
      case 1:
        return {
          organizationName: formData.organizationName || '',
          registrationType: formData.registrationType,
          registrationNumber: formData.registrationNumber || '',
          yearEstablished: formData.yearEstablished,
          faithId: formData.faithId,
          socialCategoryIds: formData.socialCategoryIds || [],
        };
      case 2:
        return {
          primaryContact: formData.primaryContact || initialFormData.primaryContact!,
          secondaryContact: formData.secondaryContact,
          websiteUrl: formData.websiteUrl,
          facebookUrl: formData.facebookUrl,
          instagramHandle: formData.instagramHandle,
          twitterHandle: formData.twitterHandle,
        };
      case 3:
        return {
          categoryIds: formData.categoryIds || [],
          resourceIds: formData.resourceIds || [],
        };
      case 4:
        return {
          branches: formData.branches || [],
        };
      case 5:
        return {
          languageIds: formData.languageIds || [],
        };
      case 6:
        return {
          documents: formData.documents || initialFormData.documents!,
        };
      default:
        return {};
    }
  }, [currentStep, formData]);

  return {
    // State
    formData,
    currentStep,
    isDraftSaved,
    lastSaveTimestamp,
    isSaving,

    // Actions
    updateStepData,
    validateStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    saveDraft,
    clearDraft,
    getCurrentStepData,
    setSaveCallbacks,
    loadDraftFromBackend,

    // Helpers
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === 7,
  };
}
