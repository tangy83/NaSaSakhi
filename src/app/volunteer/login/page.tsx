'use client';

// Volunteer / Admin Login Page
// Accepts Volunteer ID (e.g. VOL-2024-001) or Email address.
// The auth backend auto-routes based on which field is provided.

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TextInput } from '@/components/form/TextInput';

export default function VolunteerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/volunteer/dashboard';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Volunteer ID or email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);

    // Route to the correct credential field based on input format
    const isEmail = identifier.includes('@');
    const credentials = isEmail
      ? { email: identifier.trim(), password }
      : { volunteerId: identifier.trim(), password };

    try {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error === 'CredentialsSignin'
          ? 'Invalid credentials. Check your Volunteer ID or email and password.'
          : result.error);
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
          <p className="font-body text-gray-600">Volunteer Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <h2 className="font-heading text-2xl text-gray-800 font-medium mb-6">
            Sign in
          </h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <TextInput
              label="Volunteer ID or Email"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. VOL-2024-001 or admin@example.org"
              autoComplete="username"
              required
              disabled={isLoading}
            />

            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={isLoading}
            />

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="bg-error-50 border border-error-500 rounded-lg px-4 py-3"
              >
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
