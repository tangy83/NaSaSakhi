'use client';

import { useEffect, useState } from 'react';
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
  Control,
  useFieldArray,
} from 'react-hook-form';
import { TextInput } from '@/components/form/TextInput';
import { Dropdown } from '@/components/form/Dropdown';
import { Checkbox } from '@/components/form/Checkbox';
import { fetchStates, fetchCities } from '@/lib/api';
import { State, City, DayOfWeek, BranchTiming } from '@/types/api';
import { useApiError } from '@/hooks/useApiError';

interface BranchesSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  control: Control<any>;
}

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: 'MONDAY', label: 'Monday' },
  { value: 'TUESDAY', label: 'Tuesday' },
  { value: 'WEDNESDAY', label: 'Wednesday' },
  { value: 'THURSDAY', label: 'Thursday' },
  { value: 'FRIDAY', label: 'Friday' },
  { value: 'SATURDAY', label: 'Saturday' },
  { value: 'SUNDAY', label: 'Sunday' },
];

export function BranchesSection({
  register,
  errors,
  setValue,
  watch,
  control,
}: BranchesSectionProps) {
  const [states, setStates] = useState<State[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTimings, setShowTimings] = useState<Record<number, boolean>>({});
  const { handleError } = useApiError();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'branches',
  });

  const watchedBranches = watch('branches');

  // Load reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      setIsLoading(true);
      try {
        const [statesRes, citiesRes] = await Promise.all([fetchStates(), fetchCities()]);

        if (statesRes.success && statesRes.data) {
          setStates(statesRes.data);
        }
        if (citiesRes.success && citiesRes.data) {
          setAllCities(citiesRes.data);
        }
      } catch (error) {
        handleError(error, 'Failed to load reference data');
      } finally {
        setIsLoading(false);
      }
    };
    loadReferenceData();
  }, [handleError]);

  // Get cities filtered by state for a specific branch
  const getCitiesForState = (stateId: string): City[] => {
    if (!stateId) return [];
    return allCities.filter((city) => city.stateId === stateId);
  };

  // Handle state change - clear city selection
  const handleStateChange = (branchIndex: number, stateId: string) => {
    setValue(`branches.${branchIndex}.stateId`, stateId);
    setValue(`branches.${branchIndex}.cityId`, '');
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
        isClosed: true,
        openTime: undefined,
        closeTime: undefined,
      }));
      setValue(`branches.${branchIndex}.timings`, defaultTimings, { shouldValidate: false });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading branch data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Branches List */}
      <div className="space-y-6">
        {fields.map((field, branchIndex) => {
          const branchErrors = errors.branches?.[branchIndex];
          const currentStateId = watchedBranches[branchIndex]?.stateId || '';
          const availableCities = getCitiesForState(currentStateId);

          return (
            <div key={field.id} className="p-6 border border-gray-200 rounded-md bg-gray-50">
              {/* Branch Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h4 className="text-base font-semibold text-gray-900">Branch {branchIndex + 1}</h4>
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
                <TextInput
                  label="Address Line 1"
                  required
                  placeholder="Enter street address, building name, etc."
                  error={branchErrors?.addressLine1?.message as string}
                  helperText="Minimum 10 characters required"
                  {...register(`branches.${branchIndex}.addressLine1`)}
                />

                <TextInput
                  label="Address Line 2"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  error={branchErrors?.addressLine2?.message as string}
                  {...register(`branches.${branchIndex}.addressLine2`)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Dropdown
                    label="State"
                    required
                    options={states.map((s) => ({ value: s.id, label: s.name }))}
                    placeholder="Select state"
                    error={branchErrors?.stateId?.message as string}
                    {...register(`branches.${branchIndex}.stateId`, {
                      onChange: (e) => handleStateChange(branchIndex, e.target.value),
                    })}
                  />

                  <Dropdown
                    label="City"
                    required
                    options={availableCities.map((c) => ({
                      value: c.id,
                      label: `${c.name}, ${c.stateName}`,
                    }))}
                    placeholder={currentStateId ? 'Select city' : 'Select state first'}
                    disabled={!currentStateId}
                    error={branchErrors?.cityId?.message as string}
                    helperText={!currentStateId ? 'Please select a state first' : undefined}
                    {...register(`branches.${branchIndex}.cityId`)}
                  />
                </div>

                <TextInput
                  label="PIN Code"
                  type="text"
                  required
                  placeholder="123456"
                  maxLength={6}
                  error={branchErrors?.pinCode?.message as string}
                  helperText="6-digit PIN code"
                  {...register(`branches.${branchIndex}.pinCode`, {
                    pattern: {
                      value: /^\d{6}$/,
                      message: 'PIN code must be exactly 6 digits',
                    },
                  })}
                />

                <input
                  type="hidden"
                  {...register(`branches.${branchIndex}.country`)}
                  value="India"
                />

                {/* Operating Hours (Optional) */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700">
                        Operating Hours{' '}
                        <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                      </h5>
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
                      className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700
                                 border border-primary-300 rounded-md hover:bg-primary-50
                                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                                 transition-colors duration-150 min-h-[44px]"
                    >
                      {showTimings[branchIndex] ? 'Hide Hours' : 'Add Hours'}
                    </button>
                  </div>

                  {showTimings[branchIndex] && (
                    <div className="mt-4 space-y-3 p-4 bg-white border border-gray-200 rounded-md">
                      {(() => {
                        const branchTimings = watchedBranches[branchIndex]?.timings || [];
                        return DAYS_OF_WEEK.map((day) => {
                          let timingIndex = branchTimings.findIndex(
                            (t: BranchTiming) => t?.dayOfWeek === day.value
                          );

                          if (timingIndex === -1) {
                            const newTiming: BranchTiming = {
                              dayOfWeek: day.value,
                              isClosed: true,
                              openTime: undefined,
                              closeTime: undefined,
                            };
                            const updatedTimings = [...branchTimings, newTiming];
                            timingIndex = updatedTimings.length - 1;
                            setValue(`branches.${branchIndex}.timings`, updatedTimings, {
                              shouldValidate: false,
                            });
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
                                    const updatedTimings = currentTimings.map((t: BranchTiming, idx: number) =>
                                      idx === timingIndex
                                        ? {
                                            dayOfWeek: day.value,
                                            isClosed: e.target.checked,
                                            openTime: undefined,
                                            closeTime: undefined,
                                          }
                                        : t
                                    );
                                    setValue(`branches.${branchIndex}.timings`, updatedTimings, {
                                      shouldValidate: true,
                                    });
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
                                        const updatedTimings = currentTimings.map((t: BranchTiming, idx: number) =>
                                          idx === timingIndex
                                            ? {
                                                dayOfWeek: day.value,
                                                isClosed: timing?.isClosed ?? false,
                                                openTime: e.target.value || undefined,
                                                closeTime: timing?.closeTime,
                                              }
                                            : t
                                        );
                                        setValue(`branches.${branchIndex}.timings`, updatedTimings, {
                                          shouldValidate: true,
                                        });
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
                                        const updatedTimings = currentTimings.map((t: BranchTiming, idx: number) =>
                                          idx === timingIndex
                                            ? {
                                                dayOfWeek: day.value,
                                                isClosed: timing?.isClosed ?? false,
                                                openTime: timing?.openTime,
                                                closeTime: e.target.value || undefined,
                                              }
                                            : t
                                        );
                                        setValue(`branches.${branchIndex}.timings`, updatedTimings, {
                                          shouldValidate: true,
                                        });
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
    </div>
  );
}
