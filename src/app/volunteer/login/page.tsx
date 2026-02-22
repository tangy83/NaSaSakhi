'use client';

// Volunteer Login Page
// Uses Volunteer ID + password for authentication (not email)

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TextInput } from '@/components/form/TextInput';

export default function VolunteerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/volunteer/dashboard';

  const [volunteerId, setVolunteerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!volunteerId.trim()) {
      setError('Volunteer ID is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        volunteerId: volunteerId.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        // NextAuth surfaces the thrown error message here
        setError(result.error === 'CredentialsSignin'
          ? 'Invalid Volunteer ID or password'
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
              label="Volunteer ID"
              type="text"
              value={volunteerId}
              onChange={(e) => setVolunteerId(e.target.value)}
              placeholder="e.g. VOL-2024-001"
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
