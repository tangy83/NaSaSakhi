'use client';

// Volunteer / Admin Login Page
// Toggle selects the login mode; each mode shows the correct credential field.

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TextInput } from '@/components/form/TextInput';

type Mode = 'volunteer' | 'admin';

export default function VolunteerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/volunteer/dashboard';

  const [mode, setMode] = useState<Mode>('volunteer');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleModeSwitch(next: Mode) {
    setMode(next);
    setIdentifier('');
    setError('');
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError(mode === 'volunteer' ? 'Volunteer ID is required' : 'Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);

    const credentials =
      mode === 'volunteer'
        ? { volunteerId: identifier.trim(), password }
        : { email: identifier.trim(), password };

    try {
      const result = await signIn('credentials', { ...credentials, redirect: false });

      if (result?.error) {
        setError(
          result.error === 'CredentialsSignin'
            ? mode === 'volunteer'
              ? 'Invalid Volunteer ID or password.'
              : 'Invalid email or password.'
            : result.error
        );
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl text-primary-700 font-semibold mb-1">
            NaariSamata
          </h1>
          <p className="font-body text-gray-600">Staff Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          {/* Mode toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            {(['volunteer', 'admin'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleModeSwitch(m)}
                className={`
                  flex-1 py-2 text-sm font-body font-medium rounded-md transition-colors
                  ${mode === m
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {m === 'volunteer' ? 'Volunteer' : 'Admin'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {mode === 'volunteer' ? (
              <TextInput
                key="volunteerId"
                label="Volunteer ID"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. VOL-2024-001"
                autoComplete="username"
                required
                disabled={isLoading}
              />
            ) : (
              <TextInput
                key="email"
                label="Email"
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. admin@naarisamata.org"
                autoComplete="email"
                required
                disabled={isLoading}
              />
            )}

            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={isLoading}
            />

            {error && (
              <div role="alert" className="bg-error-50 border border-error-500 rounded-lg px-4 py-3">
                <p className="font-body text-sm text-error-600 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full min-h-[48px] bg-primary-500 hover:bg-primary-600 active:bg-primary-700
                text-white font-body font-semibold text-base rounded-lg
                transition-colors duration-150
                disabled:opacity-60 disabled:cursor-not-allowed
                focus:outline-none focus:ring-4 focus:ring-primary-100
              "
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-sm text-gray-500 mt-6">
          Empowering women and children across India
        </p>
      </div>
    </div>
  );
}
