'use client';

import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from '@/lib/hooks/useFormState';
import { servicesSchema, ServicesFormData } from '@/lib/validation/servicesSchema';
import { FormHeader } from '@/components/layout/FormHeader';
import { FormNavigation } from '@/components/layout/FormNavigation';
import { Checkbox } from '@/components/form/Checkbox';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { fetchCategories, fetchResources } from '@/lib/api';
import { ServiceCategory, ServiceResource, TargetGroup } from '@/types/api';
import { useApiError } from '@/hooks/useApiError';
import { useToast } from '@/contexts/ToastContext';
import { useFocusManagement } from '@/hooks/useFocusManagement';

export default function Step3Page() {
  const {
    formData,
    updateStepData,
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    getCurrentStepData,
    saveDraft,
  } = useFormState();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [allResources, setAllResources] = useState<ServiceResource[]>([]);
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
        const [categoriesRes, resourcesRes] = await Promise.all([
          fetchCategories(),
          fetchResources(), // Load all resources
        ]);

        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        } else if (!categoriesRes.success) {
          throw new Error(categoriesRes.error || 'Failed to load categories');
        }

        if (resourcesRes.success && resourcesRes.data) {
          setAllResources(resourcesRes.data);
        } else if (!resourcesRes.success) {
          throw new Error(resourcesRes.error || 'Failed to load resources');
        }
      } catch (error) {
        const errorMessage = handleError(error, 'Failed to load services. Please refresh the page.');
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
    setValue,
    watch,
  } = useForm<ServicesFormData>({
    resolver: zodResolver(servicesSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      categoryIds: currentData.categoryIds || [],
      resourceIds: currentData.resourceIds || [],
    },
  });

  // Register fields with React Hook Form
  register('categoryIds');
  register('resourceIds');

  // Watch selected categories and resources
  const selectedCategoryIds = watch('categoryIds', []) as string[];
  const selectedResourceIds = watch('resourceIds', []) as string[];

  // Group categories by target group
  const categoriesByGroup = useMemo(() => {
    const grouped: Record<TargetGroup, ServiceCategory[]> = {
      CHILDREN: [],
      WOMEN: [],
    };
    categories.forEach((cat) => {
      grouped[cat.targetGroup].push(cat);
    });
    // Sort by displayOrder
    grouped.CHILDREN.sort((a, b) => a.displayOrder - b.displayOrder);
    grouped.WOMEN.sort((a, b) => a.displayOrder - b.displayOrder);
    return grouped;
  }, [categories]);

  // Filter resources based on selected categories
  const filteredResources = useMemo(() => {
    if (selectedCategoryIds.length === 0) {
      return [];
    }
    return allResources.filter((resource) =>
      selectedCategoryIds.includes(resource.categoryId)
    );
  }, [allResources, selectedCategoryIds]);

  // Group filtered resources by category
  const resourcesByCategory = useMemo(() => {
    const grouped: Record<string, ServiceResource[]> = {};
    filteredResources.forEach((resource) => {
      if (!grouped[resource.categoryId]) {
        grouped[resource.categoryId] = [];
      }
      grouped[resource.categoryId].push(resource);
    });
    return grouped;
  }, [filteredResources]);

  // Handle category selection change
  const handleCategoryChange = (categoryId: string, isChecked: boolean) => {
    let newCategoryIds = selectedCategoryIds ? [...selectedCategoryIds] : [];
    
    if (isChecked) {
      // Add category
      if (!newCategoryIds.includes(categoryId)) {
        newCategoryIds.push(categoryId);
      }
    } else {
      // Remove category
      newCategoryIds = newCategoryIds.filter((id) => id !== categoryId);
      
      // Remove all resources from this category
      const resourcesToRemove = allResources
        .filter((r) => r.categoryId === categoryId)
        .map((r) => r.id);
      
      let newResourceIds = selectedResourceIds ? [...selectedResourceIds] : [];
      newResourceIds = newResourceIds.filter(
        (id) => !resourcesToRemove.includes(id)
      );
      
      setValue('resourceIds', newResourceIds, { shouldValidate: true });
    }
    
    setValue('categoryIds', newCategoryIds, { shouldValidate: true });
  };

  // Handle resource selection change
  const handleResourceChange = (resourceId: string, isChecked: boolean) => {
    let newResourceIds = selectedResourceIds ? [...selectedResourceIds] : [];
    
    if (isChecked) {
      if (!newResourceIds.includes(resourceId)) {
        newResourceIds.push(resourceId);
      }
    } else {
      newResourceIds = newResourceIds.filter((id) => id !== resourceId);
    }
    
    setValue('resourceIds', newResourceIds, { shouldValidate: true });
  };

  // Handle form submission
  const onSubmit = (data: ServicesFormData) => {
    // Ensure data is valid before proceeding
    if (!data.categoryIds || data.categoryIds.length === 0) {
      console.error('No categories selected');
      return;
    }
    if (!data.resourceIds || data.resourceIds.length === 0) {
      console.error('No resources selected');
      return;
    }
    
    console.log('Step 3 onSubmit called with data:', data);
    
    // Update form data first
    updateStepData(3, data);
    
    // Pass data to validate before state is updated (fixes race condition)
    // The data structure matches what validateStep expects for step 3
    const success = goToNextStep(data);
    console.log('goToNextStep returned:', success);
    
    if (!success) {
      // Validation failed - focus on first error
      setTimeout(() => focusFirstError(), 100);
      console.error('Step 3 validation failed - check console for details');
    }
  };

  // Handle navigation
  const handleNext = () => {
    handleSubmit(onSubmit)();
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  const handleSaveDraft = () => {
    handleSubmit((data) => {
      updateStepData(3, data);
      saveDraft();
    })();
  };

  // Get category name by ID
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || categoryId;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
      <FormHeader
        title="Service Categories & Resources"
        subtitle="Select the service categories and specific resources your organization provides"
        helpText="Select at least one category and one resource. Resources are filtered based on your category selections."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
        {/* Service Categories Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-200 pb-2">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Service Categories <span className="text-error-500">*</span>
            </h2>
            <p className="text-sm text-gray-500">
              {selectedCategoryIds.length} selected
            </p>
          </div>

          {/* Children Categories */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-800">
              For Children
            </h3>
            <div className="space-y-3 pl-4 border-l-2 border-primary-200 bg-primary-50/30 p-4 rounded-md">
              {categoriesByGroup.CHILDREN.map((category) => (
                <Checkbox
                  key={category.id}
                  label={category.name}
                  checked={selectedCategoryIds?.includes(category.id)}
                  onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                />
              ))}
            </div>
          </div>

          {/* Women Categories */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-800">
              For Women
            </h3>
            <div className="space-y-3 pl-4 border-l-2 border-primary-200 bg-primary-50/30 p-4 rounded-md">
              {categoriesByGroup.WOMEN.map((category) => (
                <Checkbox
                  key={category.id}
                  label={category.name}
                  checked={selectedCategoryIds?.includes(category.id)}
                  onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                />
              ))}
            </div>
          </div>

          {/* Category Selection Error */}
          {errors.categoryIds && (
            <p role="alert" className="text-sm text-error-500 flex items-center gap-1">
              <span>⚠️</span>
              {errors.categoryIds.message}
            </p>
          )}

          {selectedCategoryIds.length === 0 && (
            <p className="text-sm text-gray-500">
              Please select at least one service category to continue.
            </p>
          )}
        </div>

        {/* Service Resources Section */}
        {selectedCategoryIds.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Service Resources <span className="text-error-500">*</span>
              </h2>
              <p className="text-sm text-gray-500">
                {selectedResourceIds.length} selected
              </p>
            </div>

            <p className="text-sm text-gray-600">
              Select the specific resources you provide. Resources are shown based on your selected categories.
            </p>

            {/* Resources grouped by category */}
            <div className="space-y-6">
              {Object.entries(resourcesByCategory).map(([categoryId, resources]) => (
                <div key={categoryId} className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                    {getCategoryName(categoryId)}
                  </h4>
                  <div className="pl-6 space-y-2 border-l-2 border-gray-200">
                    {resources.map((resource) => (
                      <Checkbox
                        key={resource.id}
                        label={resource.name}
                        description={resource.description}
                        checked={selectedResourceIds?.includes(resource.id)}
                        onChange={(e) => handleResourceChange(resource.id, e.target.checked)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Resource Selection Error */}
            {errors.resourceIds && (
              <p role="alert" className="text-sm text-error-500 flex items-center gap-1">
                <span>⚠️</span>
                {errors.resourceIds.message}
              </p>
            )}

            {selectedResourceIds.length === 0 && (
              <p className="text-sm text-gray-500">
                Please select at least one service resource to continue.
              </p>
            )}
          </div>
        )}

        {/* Message when no categories selected */}
        {selectedCategoryIds.length === 0 && (
          <div className="p-4 bg-info-50 border border-info-500 rounded-md">
            <p className="text-sm text-info-800">
              Select service categories above to see available resources.
            </p>
          </div>
        )}

        {/* Navigation */}
        <FormNavigation
          onBack={handleBack}
          onNext={handleNext}
          onSaveDraft={handleSaveDraft}
          isFirstStep={isFirstStep}
          nextLabel="Next: Branch Locations"
        />
      </form>
    </div>
  );
}
