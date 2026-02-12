'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  useEffect(() => {
    // Try to get registration ID from URL params
    const id = searchParams.get('id');
    if (id) {
      setRegistrationId(id);
    } else {
      // Try to get from localStorage (if stored during submission)
      const storedId = localStorage.getItem('last_registration_id');
      if (storedId) {
        setRegistrationId(storedId);
        // Clear it after reading
        localStorage.removeItem('last_registration_id');
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Success Icon and Message */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-success-500 text-5xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Registration Submitted Successfully!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for registering your organization with NASA Sakhi
            </p>
          </div>

          {/* Success Details */}
          <div className="p-6 bg-success-50 border border-success-500 rounded-md mb-6">
            <div className="flex items-start gap-3">
              <span className="text-success-500 text-xl">✓</span>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-success-800 mb-2">
                  What happens next?
                </h3>
                <ul className="space-y-2 text-sm text-success-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>Your registration will be reviewed by our team within 48 hours.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>You will receive an email confirmation at your registered email address.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>Once approved, your organization will be visible in the NASA Sakhi directory.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>You can track your registration status using the registration ID below.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Registration ID */}
          {registrationId && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Registration ID
                  </p>
                  <p className="text-lg font-mono font-semibold text-gray-900">
                    {registrationId}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(registrationId);
                    // You could add a toast notification here
                  }}
                  className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700
                             border border-primary-300 rounded-md hover:bg-primary-50
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                             transition-colors duration-150"
                  title="Copy to clipboard"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Please save this ID for future reference
              </p>
            </div>
          )}

          {/* Important Information */}
          <div className="p-4 bg-info-50 border border-info-500 rounded-md mb-6">
            <div className="flex items-start gap-3">
              <span className="text-info-500 text-xl">ℹ️</span>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-info-800 mb-1">
                  Important Information
                </h3>
                <p className="text-sm text-info-700">
                  If you need to make changes to your registration or have any questions, 
                  please contact our support team with your registration ID.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-md
                         hover:bg-primary-600 active:bg-primary-700
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                         transition-colors duration-150 text-center font-medium"
            >
              Return to Homepage
            </Link>
            <button
              onClick={() => {
                // Clear form data and start new registration
                localStorage.removeItem('nasa_sakhi_registration_draft');
                window.location.href = '/register/step1';
              }}
              className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md
                         hover:bg-gray-50 active:bg-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                         transition-colors duration-150 font-medium"
            >
              Register Another Organization
            </button>
          </div>

          {/* Support Contact */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact us at{' '}
              <a
                href="mailto:support@nasasakhi.org"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                support@nasasakhi.org
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
