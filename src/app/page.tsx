import Link from 'next/link';
import Image from 'next/image';
import { isDevelopment } from '@/lib/env';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Content */}
            <div className="order-2 lg:order-1">
              <Image
                src="/assets/logo/coloured.png"
                alt="NaariSamata Logo"
                width={180}
                height={72}
                className="mb-8"
                priority
              />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-6 leading-tight">
                Empowering Organizations to Transform Lives
              </h1>
              <p className="text-xl sm:text-2xl font-body text-gray-700 mb-8 leading-relaxed">
                Join 500+ organizations making a difference for women and vulnerable children across India
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register/start"
                  className="inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-primary-600 text-white rounded-lg font-ui font-semibold text-lg
                             shadow-lg hover:shadow-xl hover:bg-primary-700 hover:-translate-y-0.5
                             active:bg-primary-800 active:translate-y-0 active:shadow-md
                             focus:outline-none focus:ring-4 focus:ring-primary-100 focus:ring-offset-2
                             transition-all duration-200"
                >
                  Start Registration →
                </Link>
                <Link
                  href="/register/resume?token="
                  className="inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-white border-2 border-primary-500 text-primary-600 rounded-lg font-ui font-semibold text-lg
                             hover:bg-primary-50 hover:border-primary-600
                             focus:outline-none focus:ring-4 focus:ring-primary-100 focus:ring-offset-2
                             transition-colors duration-150"
                >
                  Resume Draft
                </Link>
              </div>
            </div>

            {/* Right Side - Hero Image */}
            <div className="order-1 lg:order-2">
              <Image
                src="/assets/images/community-circle.png"
                alt="Diverse group of women in traditional attire celebrating community unity"
                width={800}
                height={600}
                className="rounded-2xl shadow-2xl"
                style={{ boxShadow: '0 20px 60px rgba(205, 87, 83, 0.15)' }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Bar */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-ui font-bold text-white mb-2">500+</div>
              <div className="text-sm sm:text-base font-body text-primary-100 uppercase tracking-wide">Organizations Registered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-ui font-bold text-white mb-2">2M+</div>
              <div className="text-sm sm:text-base font-body text-primary-100 uppercase tracking-wide">Lives Touched</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-ui font-bold text-white mb-2">28</div>
              <div className="text-sm sm:text-base font-body text-primary-100 uppercase tracking-wide">States Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-ui font-bold text-white mb-2">15</div>
              <div className="text-sm sm:text-base font-body text-primary-100 uppercase tracking-wide">Languages Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Register Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-gray-900 text-center mb-12">
            Why Register with NaariSamata Sakhi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 border-4 border-primary-100">
                <Image
                  src="/assets/images/literacy-outreach.png"
                  alt="Women engaged in literacy and documentation work"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-ui font-semibold text-gray-900 mb-4 text-center">
                Comprehensive Resource Network
              </h3>
              <p className="text-base font-body text-gray-600 text-center leading-relaxed">
                Connect with government programs, funding opportunities, and expert guidance to maximize your impact
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 border-4 border-primary-100">
                <Image
                  src="/assets/images/community-circle.png"
                  alt="Community of women celebrating unity"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-ui font-semibold text-gray-900 mb-4 text-center">
                Join a Growing Community
              </h3>
              <p className="text-base font-body text-gray-600 text-center leading-relaxed">
                Collaborate with 500+ like-minded organizations working toward women and child empowerment
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 border-4 border-primary-100">
                <Image
                  src="/assets/images/empowered-woman.png"
                  alt="Portrait of empowered woman in traditional dress"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-ui font-semibold text-gray-900 mb-4 text-center">
                Scale Your Operations
              </h3>
              <p className="text-base font-body text-gray-600 text-center leading-relaxed">
                Access centralized support, training, and resources to expand your reach across India
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image */}
            <div>
              <Image
                src="/assets/images/family-education.png"
                alt="Mother and father teaching child with educational materials"
                width={800}
                height={600}
                className="rounded-2xl shadow-lg"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-gray-900 mb-4">
                Supporting Women & Vulnerable Children
              </h2>
              <p className="text-lg font-body text-gray-600 mb-8">
                Comprehensive services across 14 key focus areas
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Children Services */}
                <div>
                  <h3 className="text-xl font-ui font-semibold text-gray-900 mb-4">For Children</h3>
                  <ul className="space-y-3">
                    {['Education', 'Health', 'Protection', 'Nutrition', 'Shelter', 'Skill Development', 'Advocacy'].map((service) => (
                      <li key={service} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-base font-body text-gray-700">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Women Services */}
                <div>
                  <h3 className="text-xl font-ui font-semibold text-gray-900 mb-4">For Women</h3>
                  <ul className="space-y-3">
                    {['Education', 'Health', 'Protection', 'Economic Empowerment', 'Legal Aid', 'Counseling', 'Advocacy'].map((service) => (
                      <li key={service} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-base font-body text-gray-700">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-ui font-bold text-2xl mb-4">
                  1
                </div>
                <h3 className="text-xl font-ui font-semibold text-gray-900 mb-2">
                  Register Your Organization
                </h3>
                <p className="text-base font-body text-gray-600">
                  Complete our simple 7-step registration process
                </p>
              </div>
              {/* Connector line - hidden on mobile */}
              <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-primary-200" />
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-ui font-bold text-2xl mb-4">
                  2
                </div>
                <h3 className="text-xl font-ui font-semibold text-gray-900 mb-2">
                  Profile Review
                </h3>
                <p className="text-base font-body text-gray-600">
                  Our team reviews your application within 48 hours
                </p>
              </div>
              {/* Connector line - hidden on mobile */}
              <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-primary-200" />
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-ui font-bold text-2xl mb-4">
                  3
                </div>
                <h3 className="text-xl font-ui font-semibold text-gray-900 mb-2">
                  Make Impact
                </h3>
                <p className="text-base font-body text-gray-600">
                  Start transforming lives in your community
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Areas of Focus Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold text-gray-900 text-center mb-12">
            Areas of Focus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Economic Empowerment */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Image
                src="/assets/images/agriculture-women.png"
                alt="Rural women working in agricultural fields"
                width={1200}
                height={600}
                className="w-full h-80 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-heading font-semibold text-white mb-2">
                  Economic Empowerment
                </h3>
                <p className="text-base sm:text-lg font-body text-gray-100">
                  Supporting rural livelihoods and financial independence
                </p>
              </div>
            </div>

            {/* Education & Literacy */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Image
                src="/assets/images/literacy-outreach.png"
                alt="Women engaged in literacy and documentation work"
                width={1200}
                height={600}
                className="w-full h-80 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-heading font-semibold text-white mb-2">
                  Education & Literacy
                </h3>
                <p className="text-base sm:text-lg font-body text-gray-100">
                  Building skills and knowledge for a better future
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg sm:text-xl font-body text-gray-700 mb-8 max-w-2xl mx-auto">
            Join hundreds of organizations empowering communities across India. Registration is free, secure, and reviewed within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/register/start"
              className="inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-primary-600 text-white rounded-lg font-ui font-semibold text-lg
                         shadow-lg hover:shadow-xl hover:bg-primary-700 hover:-translate-y-0.5
                         active:bg-primary-800 active:translate-y-0 active:shadow-md
                         focus:outline-none focus:ring-4 focus:ring-primary-100 focus:ring-offset-2
                         transition-all duration-200"
            >
              Start Registration →
            </Link>
            <Link
              href="/register/resume?token="
              className="inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-white border-2 border-primary-500 text-primary-600 rounded-lg font-ui font-semibold text-lg
                         hover:bg-primary-50 hover:border-primary-600
                         focus:outline-none focus:ring-4 focus:ring-primary-100 focus:ring-offset-2
                         transition-colors duration-150"
            >
              Resume Draft
            </Link>
          </div>
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-body text-gray-700">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure Registration</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>48-Hour Review</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Free to Join</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <p className="text-gray-700 font-body mb-2">
              Need help? Contact us at{' '}
              <a
                href="mailto:support@naarisamata.org"
                className="text-primary-600 underline hover:text-primary-700 font-medium"
              >
                support@naarisamata.org
              </a>
            </p>
            <p className="text-sm text-gray-500">
              Built by{' '}
              <a
                href="https://www.contextfirstai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                Context First AI
              </a>
            </p>
          </div>

          {/* Developer Tools (only in development) */}
          {isDevelopment && (
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-600 font-body text-sm font-medium mb-3 text-center">Developer Tools:</p>
              <div className="flex flex-wrap gap-4 justify-center text-sm font-body">
                <a href="/api/health" className="text-primary-600 hover:text-primary-700 hover:underline" target="_blank" rel="noopener noreferrer">
                  API Health
                </a>
                <a href="/api/db-test" className="text-primary-600 hover:text-primary-700 hover:underline" target="_blank" rel="noopener noreferrer">
                  Database Test
                </a>
                <a href="/diagnostic" className="text-primary-600 hover:text-primary-700 hover:underline">
                  Diagnostic Page
                </a>
                <a href="/test-components" className="text-primary-600 hover:text-primary-700 hover:underline">
                  Test Components
                </a>
                <a href="/test-api" className="text-primary-600 hover:text-primary-700 hover:underline">
                  Test API
                </a>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
