'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signInAction } from '@/app/actions/auth';
import { cn } from '@/lib/utils';

export default function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const result = await signInAction(formData);

      if (result?.error) {
        setError(result.error);
      }
      // On success, signInAction redirects automatically
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <Image
            src="/img/logo2.png"
            alt="Dompetku"
            width={310}
            height={91}
            className="mx-auto h-auto w-56"
            priority
          />
          <p className="text-gray-600 dark:text-gray-400 text-sm">Kelola uangmu tanpa ribet.</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 sm:p-7">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 text-center">Masuk</h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className={cn(
                  'w-full px-4 py-3 border rounded-xl',
                  'bg-white dark:bg-gray-800',
                  'border-gray-300 dark:border-gray-700',
                  'text-gray-900 dark:text-white',
                  'placeholder-gray-500 dark:placeholder-gray-400',
                  'focus:ring-2 focus:ring-primary focus:border-primary',
                  'transition-all duration-200'
                )}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={cn(
                  'w-full px-4 py-3 border rounded-xl',
                  'bg-white dark:bg-gray-800',
                  'border-gray-300 dark:border-gray-700',
                  'text-gray-900 dark:text-white',
                  'placeholder-gray-500 dark:placeholder-gray-400',
                  'focus:ring-2 focus:ring-primary focus:border-primary',
                  'transition-all duration-200'
                )}
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-violet-700"
              >
                Lupa kata sandi?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full py-3 px-4 rounded-xl font-medium text-white',
                'brand-gradient brand-gradient-hover shadow-sm shadow-violet-500/20',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors duration-200',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? 'Sedang masuk...' : 'Masuk'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Belum punya akun?{' '}
              <Link href="/register" className="text-primary hover:text-violet-700 font-medium">
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
