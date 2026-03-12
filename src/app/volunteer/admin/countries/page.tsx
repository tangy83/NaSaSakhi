'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Language {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

interface CountryLanguage {
  languageId: string;
  language: Language;
}

interface Country {
  id: string;
  name: string;
  _count: { languages: number; organizations: number };
  languages: CountryLanguage[];
}

export default function AdminCountriesPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [countries, setCountries] = useState<Country[]>([]);
  const [allLanguages, setAllLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const userRole = (session?.user as any)?.role;
  const isAdminUser = ['ADMIN', 'SUPER_ADMIN'].includes(userRole);

  useEffect(() => {
    if (session && !isAdminUser) router.replace('/volunteer/dashboard');
  }, [session, isAdminUser, router]);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/countries', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/reference/languages', { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([countriesRes, langsRes]) => {
        if (countriesRes.success) setCountries(countriesRes.data);
        if (langsRes.success) setAllLanguages(langsRes.data);
      })
      .catch(() => setErrorMsg('Failed to load data'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleToggleLanguage = async (country: Country, lang: Language, currentlyAssigned: boolean) => {
    setIsSaving(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/admin/countries/${country.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: currentlyAssigned ? 'remove-language' : 'add-language',
          languageId: lang.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh countries
        const refreshed = await fetch('/api/admin/countries', { credentials: 'include' }).then((r) => r.json());
        if (refreshed.success) {
          setCountries(refreshed.data);
          const updated = refreshed.data.find((c: Country) => c.id === country.id);
          if (updated) setSelectedCountry(updated);
        }
        setSuccessMsg(currentlyAssigned ? 'Language removed' : 'Language added');
        setTimeout(() => setSuccessMsg(null), 2000);
      } else {
        setErrorMsg(data.error || 'Failed to update language assignment');
      }
    } catch {
      setErrorMsg('Failed to update language assignment');
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center text-gray-400">Loading countries…</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-gray-900">Country Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage which languages are available per country for the registration form.</p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{errorMsg}</div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{successMsg}</div>
      )}

      <div className="flex gap-6">
        {/* Country list */}
        <div className="w-72 flex-shrink-0">
          <input
            type="text"
            placeholder="Search countries…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {filtered.map((country) => (
              <button
                key={country.id}
                onClick={() => setSelectedCountry(country)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  selectedCountry?.id === country.id
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>
                    <span className="font-mono text-xs text-gray-400 mr-2">{country.id}</span>
                    {country.name}
                  </span>
                  <span className="text-xs text-gray-400">{country._count.languages} langs</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Language assignment panel */}
        <div className="flex-1">
          {!selectedCountry ? (
            <div className="text-center py-20 text-gray-400 text-sm">Select a country to manage its languages</div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-heading text-lg font-medium text-gray-900">
                    {selectedCountry.name}
                    <span className="ml-2 text-xs font-mono text-gray-400">{selectedCountry.id}</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedCountry._count.organizations} organization(s) registered
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-3">
                Checked languages appear in the registration form language selector when this country is selected.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {allLanguages.map((lang) => {
                  const isAssigned = selectedCountry.languages.some((cl) => cl.languageId === lang.id);
                  return (
                    <label
                      key={lang.id}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                        isAssigned
                          ? 'border-primary-300 bg-primary-50'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isAssigned}
                        disabled={isSaving}
                        onChange={() => handleToggleLanguage(selectedCountry, lang, isAssigned)}
                        className="w-4 h-4 text-primary-600 rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{lang.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{lang.code}</p>
                      </div>
                      {!lang.isActive && (
                        <span className="ml-auto text-xs text-gray-400 italic">inactive</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
