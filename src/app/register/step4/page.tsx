'use client';

import { useEffect, useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from '@/lib/hooks/useFormState';
import { branchesSchema, BranchesFormData } from '@/lib/validation/branchesSchema';
import { FormHeader } from '@/components/layout/FormHeader';
import { FormNavigation } from '@/components/layout/FormNavigation';
import { TextInput } from '@/components/form/TextInput';
import { Dropdown } from '@/components/form/Dropdown';
import { Checkbox } from '@/components/form/Checkbox';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { fetchStates, fetchCities } from '@/lib/api';
import { State, City, DayOfWeek, BranchTiming } from '@/types/api';
import { useApiError } from '@/hooks/useApiError';
import { useToast } from '@/contexts/ToastContext';
import { useFocusManagement } from '@/hooks/useFocusManagement';

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: 'MONDAY', label: 'Monday' },
  { value: 'TUESDAY', label: 'Tuesday' },
  { value: 'WEDNESDAY', label: 'Wednesday' },
  { value: 'THURSDAY', label: 'Thursday' },
  { value: 'FRIDAY', label: 'Friday' },
  { value: 'SATURDAY', label: 'Saturday' },
  { value: 'SUNDAY', label: 'Sunday' },
];

export default function Step4Page() {
  const {
    formData,
    updateStepData,
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    getCurrentStepData,
    saveDraft,
  } = useFormState();

  const [states, setStates] = useState<State[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);
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
        const [statesRes, citiesRes] = await Promise.all([
          fetchStates(),
          fetchCities(), // Load all cities
        ]);

        if (statesRes.success && statesRes.data) {
          setStates(statesRes.data);
        }
        if (citiesRes.success && citiesRes.data) {
          setAllCities(citiesRes.data);
        }
      } catch (error) {
        console.error('Failed to load reference data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadReferenceData();
  }, []);

  // Initialize form with existing data
  const currentData = getCurrentStepData();
  const existingBranches = currentData.branches || [];
  
  // Ensure at least one branch exists
  const initialBranches = existingBranches.length > 0 
    ? existingBranches 
    : [{
        addressLine1: '',
        addressLine2: '',
        cityId: '',
        stateId: '',
        pinCode: '',
        country: 'India',
        timings: [],
      }];

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm<BranchesFormData>({
    resolver: zodResolver(branchesSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      branches: initialBranches,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'branches',
  });

  // Watch all branches to get state selections
  const watchedBranches = watch('branches');

  // Get cities filtered by state for a specific branch
  const getCitiesForState = (stateId: string): City[] => {
    if (!stateId) return [];
    return allCities.filter((city) => city.stateId === stateId);
  };

  // Handle state change - clear city selection
  const handleStateChange = (branchIndex: number, stateId: string) => {
    setValue(`branches.${branchIndex}.stateId`, stateId);
    setValue(`branches.${branchIndex}.cityId`, ''); // Clear city when state changes
  };

  // Add new branch
  const handleAddBranch = () => {
    append({
      addressLine1: '',
      addressLine2: '',
      cityId: '',
      stateId: '',
      pinCode: '',
      country: 'India',
      timings: [],
    });
  };

  // Remove branch
  const handleRemoveBranch = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Toggle operating hours section
  const [showTimings, setShowTimings] = useState<Record<number, boolean>>({});

  const toggleTimings = (branchIndex: number) => {
    setShowTimings((prev) => ({
      ...prev,
      [branchIndex]: !prev[branchIndex],
    }));
  };

  // Initialize timings for a branch
  const initializeTimings = (branchIndex: number) => {
    const branch = watchedBranches[branchIndex];
    if (!branch.timings || branch.timings.length === 0) {
      const defaultTimings: BranchTiming[] = DAYS_OF_WEEK.map((day) => ({
        dayOfWeek: day.value,
        isClosed: true, // Default to closed, user can change
        openTime: undefined,
        closeTime: undefined,
      }));
      setValue(`branches.${branchIndex}.timings`, defaultTimings, { shouldValidate: false });
    }
  };

  // Handle form submission
  const onSubmit = (data: BranchesFormData) => {
    updateStepData(4, data);
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
      updateStepData(4, data);
      try {
        await saveDraft();
        showSuccess('Draft saved successfully', 2000);
      } catch (error) {
        handleError(error, 'Failed to save draft. Please try again.');
      }
    })();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading branch locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
      <FormHeader
        title="Branch Locations"
        subtitle="Add the locations where your organization operates"
        helpText="Add at least one branch location. You can add multiple branches and specify operating hours for each."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Branches List */}
        <div className="space-y-6">
          {fields.map((field, branchIndex) => {
            const branchErrors = errors.branches?.[branchIndex];
            const currentStateId = watchedBranches[branchIndex]?.stateId || '';
            const availableCities = getCitiesForState(currentStateId);

            return (
              <div
                key={field.id}
                className="p-6 border border-gray-200 rounded-md bg-gray-50"
              >
                {/* Branch Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Branch {branchIndex + 1}
                  </h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBranch(branchIndex)}
                      className="px-4 py-2 text-sm text-error-600 hover:text-error-700
                                 border border-error-300 rounded-md hover:bg-error-50
                                 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2
                                 transition-colors duration-150"
                    >
                      Remove Branch
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Address Line 1 */}
                  <TextInput
                    label="Address Line 1"
                    required
                    placeholder="Enter street address, building name, etc."
                    error={branchErrors?.addressLine1?.message}
                    helperText="Minimum 10 characters required"
                    {...register(`branches.${branchIndex}.addressLine1`)}
                  />

                  {/* Address Line 2 */}
                  <TextInput
                    label="Address Line 2"
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    error={branchErrors?.addressLine2?.message}
                    {...register(`branches.${branchIndex}.addressLine2`)}
                  />

                  {/* State and City Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* State */}
                    <Dropdown
                      label="State"
                      required
                      options={states.map((s) => ({ value: s.id, label: s.name }))}
                      placeholder="Select state"
                      error={branchErrors?.stateId?.message}
                      {...register(`branches.${branchIndex}.stateId`, {
                        onChange: (e) => handleStateChange(branchIndex, e.target.value),
                      })}
                    />

                    {/* City */}
                    <Dropdown
                      label="City"
                      required
                      options={availableCities.map((c) => ({
                        value: c.id,
                        label: `${c.name}, ${c.stateName}`,
                      }))}
                      placeholder={currentStateId ? 'Select city' : 'Select state first'}
                      disabled={!currentStateId}
                      error={branchErrors?.cityId?.message}
                      helperText={!currentStateId ? 'Please select a state first' : undefined}
                      {...register(`branches.${branchIndex}.cityId`)}
                    />
                  </div>

                  {/* PIN Code */}
                  <TextInput
                    label="PIN Code"
                    type="text"
                    required
                    placeholder="123456"
                    maxLength={6}
                    error={branchErrors?.pinCode?.message}
                    helperText="6-digit PIN code"
                    {...register(`branches.${branchIndex}.pinCode`, {
                      pattern: {
                        value: /^\d{6}$/,
                        message: 'PIN code must be exactly 6 digits',
                      },
                    })}
                  />

                  {/* Country (defaults to India, hidden but included in form) */}
                  <input
                    type="hidden"
                    {...register(`branches.${branchIndex}.country`)}
                    value="India"
                  />

                  {/* Operating Hours (Optional) */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">
                          Operating Hours <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Specify operating hours for each day of the week
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!showTimings[branchIndex]) {
                            initializeTimings(branchIndex);
                          }
                          toggleTimings(branchIndex);
                        }}
                        aria-expanded={showTimings[branchIndex]}
                        aria-controls={`branch-${branchIndex}-timings`}
                        aria-label={showTimings[branchIndex] ? 'Hide operating hours' : 'Add operating hours'}
                        className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700
                                   border border-primary-300 rounded-md hover:bg-primary-50
                                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                                   transition-colors duration-150 min-h-[44px]"
                      >
                        {showTimings[branchIndex] ? 'Hide Hours' : 'Add Hours'}
                      </button>
                    </div>

                    {showTimings[branchIndex] && (
                      <div 
                        id={`branch-${branchIndex}-timings`}
                        role="region"
                        aria-labelledby={`branch-${branchIndex}-timings-label`}
                        className="mt-4 space-y-3 p-4 bg-white border border-gray-200 rounded-md"
                      >
                        {(() => {
                          const branchTimings = watchedBranches[branchIndex]?.timings || [];
                          return DAYS_OF_WEEK.map((day) => {
                            let timingIndex = branchTimings.findIndex(
                              (t) => t?.dayOfWeek === day.value
                            );
                            
                            // If timing doesn't exist for this day, create it
                            if (timingIndex === -1) {
                              const newTiming: BranchTiming = {
                                dayOfWeek: day.value,
                                isClosed: true,
                                openTime: undefined,
                                closeTime: undefined,
                              };
                              const updatedTimings = [...branchTimings, newTiming];
                              timingIndex = updatedTimings.length - 1;
                              setValue(`branches.${branchIndex}.timings`, updatedTimings, { shouldValidate: false });
                            }

                            const timing = branchTimings[timingIndex];
                            const isClosed = timing?.isClosed ?? true;

                            return (
                              <div
                                key={day.value}
                                className="flex items-center gap-4 p-3 bg-gray-50 rounded-md"
                              >
                                <div className="w-24 flex-shrink-0">
                                  <label className="text-sm font-medium text-gray-700">
                                    {day.label}
                                  </label>
                                </div>

                                <div className="w-32 flex-shrink-0">
                                  <Checkbox
                                    label="Closed"
                                    checked={isClosed}
                                    onChange={(e) => {
                                      const currentTimings = watchedBranches[branchIndex]?.timings || [];
                                      const updatedTimings = currentTimings.map((t, idx) =>
                                        idx === timingIndex
                                          ? { 
                                              dayOfWeek: day.value,
                                              isClosed: e.target.checked, 
                                              openTime: undefined, 
                                              closeTime: undefined 
                                            }
                                          : t
                                      );
                                      setValue(`branches.${branchIndex}.timings`, updatedTimings, { shouldValidate: true });
                                    }}
                                  />
                                </div>

                                {!isClosed && (
                                  <div className="flex-1 grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Open Time
                                      </label>
                                      <input
                                        type="time"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md
                                                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        defaultValue={timing?.openTime || ''}
                                        onChange={(e) => {
                                          const currentTimings = watchedBranches[branchIndex]?.timings || [];
                                          const updatedTimings = currentTimings.map((t, idx) =>
                                            idx === timingIndex
                                              ? { 
                                                  dayOfWeek: day.value,
                                                  isClosed: timing?.isClosed ?? false,
                                                  openTime: e.target.value || undefined,
                                                  closeTime: timing?.closeTime
                                                }
                                              : t
                                          );
                                          setValue(`branches.${branchIndex}.timings`, updatedTimings, { shouldValidate: true });
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Close Time
                                      </label>
                                      <input
                                        type="time"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md
                                                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        defaultValue={timing?.closeTime || ''}
                                        onChange={(e) => {
                                          const currentTimings = watchedBranches[branchIndex]?.timings || [];
                                          const updatedTimings = currentTimings.map((t, idx) =>
                                            idx === timingIndex
                                              ? { 
                                                  dayOfWeek: day.value,
                                                  isClosed: timing?.isClosed ?? false,
                                                  openTime: timing?.openTime,
                                                  closeTime: e.target.value || undefined
                                                }
                                              : t
                                          );
                                          setValue(`branches.${branchIndex}.timings`, updatedTimings, { shouldValidate: true });
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {isClosed && (
                                  <div className="flex-1 text-sm text-gray-500 italic">
                                    Closed on this day
                                  </div>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Branch Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleAddBranch}
            aria-label="Add another branch location"
            className="px-6 py-2 text-primary-600 hover:text-primary-700
                       border-2 border-dashed border-primary-300 rounded-md
                       hover:bg-primary-50 hover:border-primary-400
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                       transition-colors duration-150 font-medium min-h-[44px]"
          >
            + Add Another Branch
          </button>
        </div>

        {/* Branches Error */}
        {errors.branches && typeof errors.branches.message === 'string' && (
          <p role="alert" className="text-sm text-error-500 flex items-center gap-1">
            <span>⚠️</span>
            {errors.branches.message}
          </p>
        )}

        {/* Navigation */}
        <FormNavigation
          onBack={handleBack}
          onNext={handleNext}
          onSaveDraft={handleSaveDraft}
          isFirstStep={isFirstStep}
          nextLabel="Next: Language Preferences"
        />
      </form>
    </div>
  );
}
