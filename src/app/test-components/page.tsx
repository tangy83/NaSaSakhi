// Component Test Page
// This page is for testing all UI components during development
// Access at: http://localhost:3000/test-components

'use client';

import { TextInput } from '@/components/form/TextInput';
import { Dropdown } from '@/components/form/Dropdown';
import { Checkbox } from '@/components/form/Checkbox';
import { ProgressIndicator } from '@/components/layout/ProgressIndicator';
import { FormNavigation } from '@/components/layout/FormNavigation';
import { FormHeader } from '@/components/layout/FormHeader';

export default function TestComponentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Component Test Page
          </h1>
          <p className="text-gray-600">
            Test all UI components here. This page is for development only.
          </p>
        </div>

        {/* Tailwind CSS Test */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tailwind CSS Test
          </h2>
          <div className="bg-primary-500 text-white p-4 rounded-md">
            Tailwind CSS is working! ✅
          </div>
        </div>

        {/* Form Components Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Form Components
          </h2>

          {/* TextInput Component Test */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              TextInput Component
            </h3>
            
            <div className="space-y-4">
              <TextInput
                label="Test Input"
                placeholder="Enter some text"
                helperText="This is a helper text"
              />

              <TextInput
                label="Input with Error"
                error="This field is required"
                required
              />

              <TextInput
                label="Disabled Input"
                placeholder="This input is disabled"
                disabled
                helperText="This input is disabled"
              />
            </div>
          </div>

          {/* Dropdown Component Test */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Dropdown Component
            </h3>
            
            <div className="space-y-4">
              <Dropdown
                label="Select Organization Type"
                placeholder="Choose an option"
                options={[
                  { value: 'NGO', label: 'NGO' },
                  { value: 'TRUST', label: 'Trust' },
                  { value: 'GOVERNMENT', label: 'Government' },
                ]}
                helperText="Select the type of your organization"
              />

              <Dropdown
                label="Select Status"
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                error="This field is required"
                required
              />

              <Dropdown
                label="Disabled Dropdown"
                options={[
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                ]}
                disabled
                helperText="This dropdown is disabled"
              />
            </div>
          </div>

          {/* Checkbox Component Test */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Checkbox Component
            </h3>
            
            <div className="space-y-4">
              <Checkbox
                label="Accept Terms and Conditions"
                description="You must agree to the terms to continue"
              />

              <Checkbox
                label="Subscribe to Newsletter"
                description="Receive updates about our services"
                defaultChecked
              />

              <Checkbox
                label="Required Checkbox"
                description="This checkbox is required"
                required
              />

              <Checkbox
                label="Disabled Checkbox"
                description="This checkbox is disabled"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Layout Components Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Layout Components
          </h2>

          {/* ProgressIndicator Component Test */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              ProgressIndicator Component
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Step 1 of 7 (First Step)</h4>
                <ProgressIndicator
                  steps={[
                    { number: 1, title: 'Organization', path: '/register/step1' },
                    { number: 2, title: 'Contact', path: '/register/step2' },
                    { number: 3, title: 'Services', path: '/register/step3' },
                    { number: 4, title: 'Branches', path: '/register/step4' },
                    { number: 5, title: 'Languages', path: '/register/step5' },
                    { number: 6, title: 'Documents', path: '/register/step6' },
                    { number: 7, title: 'Review', path: '/register/step7' },
                  ]}
                  currentStep={1}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Step 3 of 7 (Middle Step)</h4>
                <ProgressIndicator
                  steps={[
                    { number: 1, title: 'Organization', path: '/register/step1' },
                    { number: 2, title: 'Contact', path: '/register/step2' },
                    { number: 3, title: 'Services', path: '/register/step3' },
                    { number: 4, title: 'Branches', path: '/register/step4' },
                    { number: 5, title: 'Languages', path: '/register/step5' },
                    { number: 6, title: 'Documents', path: '/register/step6' },
                    { number: 7, title: 'Review', path: '/register/step7' },
                  ]}
                  currentStep={3}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Step 7 of 7 (Last Step)</h4>
                <ProgressIndicator
                  steps={[
                    { number: 1, title: 'Organization', path: '/register/step1' },
                    { number: 2, title: 'Contact', path: '/register/step2' },
                    { number: 3, title: 'Services', path: '/register/step3' },
                    { number: 4, title: 'Branches', path: '/register/step4' },
                    { number: 5, title: 'Languages', path: '/register/step5' },
                    { number: 6, title: 'Documents', path: '/register/step6' },
                    { number: 7, title: 'Review', path: '/register/step7' },
                  ]}
                  currentStep={7}
                />
              </div>
            </div>
          </div>

          {/* FormNavigation Component Test */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              FormNavigation Component
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">First Step (No Back Button)</h4>
                <FormNavigation
                  onNext={() => alert('Next clicked')}
                  onSaveDraft={() => alert('Save Draft clicked')}
                  isFirstStep={true}
                  isLastStep={false}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Middle Step (With Back Button)</h4>
                <FormNavigation
                  onBack={() => alert('Back clicked')}
                  onNext={() => alert('Next clicked')}
                  onSaveDraft={() => alert('Save Draft clicked')}
                  isFirstStep={false}
                  isLastStep={false}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Last Step (Submit Button)</h4>
                <FormNavigation
                  onBack={() => alert('Back clicked')}
                  onNext={() => alert('Submit clicked')}
                  onSaveDraft={() => alert('Save Draft clicked')}
                  isFirstStep={false}
                  isLastStep={true}
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Loading State (Disabled)</h4>
                <FormNavigation
                  onBack={() => alert('Back clicked')}
                  onNext={() => alert('Next clicked')}
                  onSaveDraft={() => alert('Save Draft clicked')}
                  isFirstStep={false}
                  isLastStep={false}
                  isSubmitting={true}
                />
              </div>
            </div>
          </div>

          {/* FormHeader Component Test */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              FormHeader Component
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Basic Header (Title Only)</h4>
                <FormHeader
                  title="Organization Details"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Header with Subtitle</h4>
                <FormHeader
                  title="Contact Information"
                  subtitle="Please provide your contact details so we can reach you"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Header with Help Text</h4>
                <FormHeader
                  title="Service Categories"
                  subtitle="Select the services your organization provides"
                  helpText="You can select multiple service categories. This helps users find your organization more easily."
                />
              </div>
            </div>
          </div>
        </div>

        {/* UI Components Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            UI Components
          </h2>

          {/* Placeholder for Button */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-2 border-dashed border-gray-300">
            <h3 className="text-xl font-semibold text-gray-500 mb-4">
              Button Component (Coming Soon)
            </h3>
            <p className="text-gray-400 text-sm">
              Button component tests will appear here once built.
            </p>
          </div>

          {/* Placeholder for Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-2 border-dashed border-gray-300">
            <h3 className="text-xl font-semibold text-gray-500 mb-4">
              Card Component (Coming Soon)
            </h3>
            <p className="text-gray-400 text-sm">
              Card component tests will appear here once built.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>This test page is for development purposes only.</p>
          <p className="mt-2">
            <a href="/" className="text-primary-500 hover:text-primary-600 underline">
              ← Back to Homepage
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
