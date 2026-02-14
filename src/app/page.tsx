import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
            🌟 NASA Sakhi
          </h1>
          <p className="text-xl sm:text-2xl text-purple-100 mb-8">
            Organization Registration Portal
          </p>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Empowering women and vulnerable children across India
          </p>
        </div>

        {/* Main CTA Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Register Your Organization
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Join the NASA Sakhi network and make a difference in your community.
            Complete the simple 7-step registration process to get started.
          </p>

          {/* Main Registration Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register/step1"
              className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl text-center"
            >
              Start New Registration →
            </Link>
            <Link
              href="/register/resume?token="
              className="bg-gray-100 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-colors text-center"
            >
              Resume Saved Draft
            </Link>
          </div>
        </div>

        {/* Benefits/Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-xl font-semibold mb-2">Simple Process</h3>
            <p className="text-purple-100">
              Complete 7 easy steps to register your organization
            </p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="text-xl font-semibold mb-2">Save Progress</h3>
            <p className="text-purple-100">
              Save your draft and continue later at your convenience
            </p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="text-xl font-semibold mb-2">Quick Review</h3>
            <p className="text-purple-100">
              Your application will be reviewed within 48 hours
            </p>
          </div>
        </div>

        {/* Registration Steps Overview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Registration Steps
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h4 className="font-semibold text-gray-900">Organization Details</h4>
                <p className="text-sm text-gray-600">Basic information</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h4 className="font-semibold text-gray-900">Contact Info</h4>
                <p className="text-sm text-gray-600">Primary contact</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h4 className="font-semibold text-gray-900">Services</h4>
                <p className="text-sm text-gray-600">Categories & resources</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div>
                <h4 className="font-semibold text-gray-900">Branches</h4>
                <p className="text-sm text-gray-600">Locations & timings</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">5</div>
              <div>
                <h4 className="font-semibold text-gray-900">Languages</h4>
                <p className="text-sm text-gray-600">Supported languages</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">6</div>
              <div>
                <h4 className="font-semibold text-gray-900">Documents</h4>
                <p className="text-sm text-gray-600">Upload certificates</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">7</div>
              <div>
                <h4 className="font-semibold text-gray-900">Review</h4>
                <p className="text-sm text-gray-600">Submit application</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">✓</div>
              <div>
                <h4 className="font-semibold text-gray-900">Success</h4>
                <p className="text-sm text-gray-600">Get registration ID</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center text-white">
          <p className="text-purple-200 mb-2">
            Need help? Contact us at{' '}
            <a
              href="mailto:support@nasasakhi.org"
              className="text-white underline hover:text-purple-100"
            >
              support@nasasakhi.org
            </a>
          </p>
          <p className="text-sm text-purple-300">
            Your data is secure and will be reviewed by our team within 48 hours
          </p>
        </div>
      </div>

      {/* Footer with Test Links (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-black bg-opacity-20 border-t border-white border-opacity-20 py-4">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-purple-200 text-sm mb-2">Developer Tools:</p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <a href="/api/health" className="text-white hover:underline" target="_blank">
                API Health
              </a>
              <a href="/api/db-test" className="text-white hover:underline" target="_blank">
                Database Test
              </a>
              <a href="/diagnostic" className="text-white hover:underline">
                Diagnostic Page
              </a>
              <a href="/test-components" className="text-white hover:underline">
                Test Components
              </a>
              <a href="/test-api" className="text-white hover:underline">
                Test API
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
