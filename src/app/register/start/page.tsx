'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface OrgSearchResult {
  id: string;
  name: string;
  customId: string | null;
}

export default function RegisterStartPage() {
  const router = useRouter();

  // Registration type selection
  const [registrationType, setRegistrationType] = useState<'organization' | 'branch' | null>(null);

  // Branch parent org search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<OrgSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedParentOrg, setSelectedParentOrg] = useState<OrgSearchResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (registrationType !== 'branch') return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/organizations/search?q=${encodeURIComponent(searchQuery)}`);
        const json = await res.json();
        if (json.success) {
          setSearchResults(json.data);
          setShowDropdown(true);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, registrationType]);

  function handleSelectOrg(org: OrgSearchResult) {
    setSelectedParentOrg(org);
    setSearchQuery(org.name);
    setShowDropdown(false);
  }

  function handleContinueAsBranch() {
    if (!selectedParentOrg) return;
    const params = new URLSearchParams({
      entityType: 'branch',
      parentOrgId: selectedParentOrg.id,
      parentOrgName: selectedParentOrg.name,
      ...(selectedParentOrg.customId ? { parentOrgCustomId: selectedParentOrg.customId } : {}),
    });
    router.push(`/register/form?${params.toString()}`);
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Home link */}
      <div className="pt-6 pb-2 px-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Welcome Hero */}
      <section className="text-center mb-12 sm:mb-16">
        <div className="mb-8">
          <Image
            src="/assets/logo/coloured.png"
            alt="NaariSamata Logo"
            width={180}
            height={72}
            className="mx-auto mb-6"
            priority
          />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
          Welcome to NaariSamata Sakhi Registration
        </h1>
        <p className="text-lg sm:text-xl font-body text-gray-700 max-w-2xl mx-auto">
          Join 500+ organizations empowering women and vulnerable children across India
        </p>
      </section>

      {/* Process Overview Timeline */}
      <section className="mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-gray-900 text-center mb-8">
          What to Expect
        </h2>

        {/* Desktop: 5-column grid */}
        <div className="hidden md:grid md:grid-cols-5 gap-4 mb-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-ui font-bold text-2xl mx-auto mb-3">
              1
            </div>
            <h3 className="text-base font-ui font-semibold text-gray-900 mb-1">
              Organization & Contact
            </h3>
            <p className="text-sm font-body text-gray-600">
              Basic info
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-ui font-bold text-2xl mx-auto mb-3">
              2
            </div>
            <h3 className="text-base font-ui font-semibold text-gray-900 mb-1">
              Services & Programs
            </h3>
            <p className="text-sm font-body text-gray-600">
              What you offer
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-ui font-bold text-2xl mx-auto mb-3">
              3
            </div>
            <h3 className="text-base font-ui font-semibold text-gray-900 mb-1">
              Locations & Languages
            </h3>
            <p className="text-sm font-body text-gray-600">
              Where you operate
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-ui font-bold text-2xl mx-auto mb-3">
              4
            </div>
            <h3 className="text-base font-ui font-semibold text-gray-900 mb-1">
              Documents
            </h3>
            <p className="text-sm font-body text-gray-600">
              Upload certificates
            </p>
          </div>

          {/* Step 5 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-success-100 text-success-600 rounded-full flex items-center justify-center font-ui font-bold text-xl mx-auto mb-3">
              ✓
            </div>
            <h3 className="text-base font-ui font-semibold text-gray-900 mb-1">
              Review & Submit
            </h3>
            <p className="text-sm font-body text-gray-600">
              Confirm & submit
            </p>
          </div>
        </div>

        {/* Mobile: Vertical list */}
        <div className="md:hidden space-y-4 mb-8">
          {[
            { number: '1', title: 'Organization & Contact', desc: 'Basic information about your organization' },
            { number: '2', title: 'Services & Programs', desc: 'Services and resources you provide' },
            { number: '3', title: 'Locations & Languages', desc: 'Branch locations and language support' },
            { number: '4', title: 'Documents', desc: 'Upload registration certificates' },
            { number: '✓', title: 'Review & Submit', desc: 'Review all details and submit', isLast: true },
          ].map((step, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
              <div className={`w-12 h-12 ${step.isLast ? 'bg-success-100 text-success-600' : 'bg-primary-100 text-primary-600'} rounded-full flex items-center justify-center font-ui font-bold text-lg flex-shrink-0`}>
                {step.number}
              </div>
              <div>
                <h3 className="text-base font-ui font-semibold text-gray-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm font-body text-gray-600">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Time & Auto-save Callouts */}
        <div className="bg-primary-50 rounded-xl p-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-body text-gray-700">
                <span className="font-semibold">~10-15 minutes</span> to complete
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-primary-200" />
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span className="font-body text-gray-700">
                Your progress is <span className="font-semibold">saved automatically</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Need Section */}
      <section className="mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-gray-900 text-center mb-8">
          What You&apos;ll Need
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Organization registration details (type, number, year established)',
            'Primary contact person information (name, phone, email)',
            'Service categories and resources your organization offers',
            'Branch addresses and operating hours',
            'Languages your organization supports',
            'Registration certificate (PDF or image file)',
            'Organization logo (optional, PNG/JPG)',
            'Additional certificates if available (optional)',
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
              <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-body text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-gray-900 text-center mb-8">
          Why Register with NaariSamata Sakhi?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Benefit 1 */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-ui font-semibold text-gray-900 mb-2">
              Access to Funding & Resources
            </h3>
            <p className="text-sm font-body text-gray-600">
              Connect with government programs, funding opportunities, and expert guidance
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-ui font-semibold text-gray-900 mb-2">
              Join 500+ Organizations
            </h3>
            <p className="text-sm font-body text-gray-600">
              Become part of a growing network dedicated to women and child empowerment
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-ui font-semibold text-gray-900 mb-2">
              48-Hour Review Process
            </h3>
            <p className="text-sm font-body text-gray-600">
              Quick application review - get started making impact within 2 business days
            </p>
          </div>
        </div>
      </section>

      {/* CTA — Registration Type Selection */}
      <section className="pb-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-gray-900 text-center mb-6">
          How would you like to register?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Card: New Organization */}
          <button
            onClick={() => { setRegistrationType('organization'); setSelectedParentOrg(null); setSearchQuery(''); }}
            className={`text-left p-6 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-100
              ${registrationType === 'organization'
                ? 'border-primary-600 bg-primary-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-sm'}`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${registrationType === 'organization' ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-600'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-ui font-semibold text-gray-900 mb-1">New Organization</h3>
                <p className="text-sm font-body text-gray-600">
                  Register your organization on NaariSamata Sakhi for the first time
                </p>
              </div>
            </div>
          </button>

          {/* Card: Branch of Existing Organization */}
          <button
            onClick={() => setRegistrationType('branch')}
            className={`text-left p-6 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-100
              ${registrationType === 'branch'
                ? 'border-primary-600 bg-primary-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-sm'}`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${registrationType === 'branch' ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-600'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-ui font-semibold text-gray-900 mb-1">Branch of Existing Organization</h3>
                <p className="text-sm font-body text-gray-600">
                  Register a branch of an organization already registered on Sakhi
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Branch: Parent org search */}
        {registrationType === 'branch' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
            <h3 className="text-base font-ui font-semibold text-gray-900 mb-1">
              Select Parent Organization
            </h3>
            <p className="text-sm font-body text-gray-500 mb-4">
              Search for the approved organization this branch belongs to
            </p>

            <div className="relative" ref={searchRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSelectedParentOrg(null); }}
                onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                placeholder="Type organization name to search…"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
              {isSearching && (
                <div className="absolute right-3 top-3.5">
                  <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {showDropdown && searchResults.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                  {searchResults.map((org) => (
                    <li key={org.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectOrg(org)}
                        className="w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors"
                      >
                        <span className="block text-sm font-ui font-medium text-gray-900">{org.name}</span>
                        {org.customId && (
                          <span className="block text-xs font-body text-gray-400 mt-0.5">{org.customId}</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {showDropdown && !isSearching && searchResults.length === 0 && searchQuery.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm font-body text-gray-500">
                  No approved organizations found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>

            {selectedParentOrg && (
              <div className="mt-3 flex items-center gap-2 text-sm font-body text-success-700 bg-success-50 border border-success-200 rounded-lg px-4 py-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Registering as a branch of: <span className="font-semibold">{selectedParentOrg.name}</span>
                {selectedParentOrg.customId && (
                  <span className="text-success-500">({selectedParentOrg.customId})</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          {registrationType === 'organization' && (
            <Link
              href="/register/form"
              className="inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-primary-600 text-white rounded-lg font-ui font-semibold text-lg
                         shadow-lg hover:shadow-xl hover:bg-primary-700 hover:-translate-y-0.5
                         active:bg-primary-800 active:translate-y-0 active:shadow-md
                         focus:outline-none focus:ring-4 focus:ring-primary-100 focus:ring-offset-2
                         transition-all duration-200"
            >
              Start Registration →
            </Link>
          )}

          {registrationType === 'branch' && (
            <button
              onClick={handleContinueAsBranch}
              disabled={!selectedParentOrg}
              className="inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-primary-600 text-white rounded-lg font-ui font-semibold text-lg
                         shadow-lg hover:shadow-xl hover:bg-primary-700 hover:-translate-y-0.5
                         active:bg-primary-800 active:translate-y-0 active:shadow-md
                         focus:outline-none focus:ring-4 focus:ring-primary-100 focus:ring-offset-2
                         transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:translate-y-0"
            >
              Continue as Branch →
            </button>
          )}

          {!registrationType && (
            <p className="text-sm font-body text-gray-500 text-center">
              Select a registration type above to continue
            </p>
          )}

          <Link
            href="/register/resume?token="
            className="inline-flex items-center justify-center min-h-[56px] px-8 py-4 bg-white border-2 border-primary-500 text-primary-600 rounded-lg font-ui font-semibold text-lg
                       hover:bg-primary-50 hover:border-primary-600
                       focus:outline-none focus:ring-4 focus:ring-primary-100 focus:ring-offset-2
                       transition-colors duration-150"
          >
            Resume Saved Draft
          </Link>
        </div>
        <p className="text-sm font-body text-gray-600 text-center">
          Already started your application? Resume where you left off
        </p>
      </section>
    </div>
  );
}
