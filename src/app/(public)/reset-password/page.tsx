'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { resetPasswordAction } from '@/actions/auth-actions';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (password !== confirmation) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const result = await resetPasswordAction(token, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Password reset failed');
      return;
    }
    setMessage('Password updated. You can now sign in.');
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 rounded-3xl border border-neutral-800 bg-neutral-900 p-8">
        <h1 className="text-2xl font-black">Set a new password</h1>
        <p className="text-sm text-neutral-400">Choose a password with at least 6 characters.</p>
        {error && <p className="rounded-xl border border-red-800 bg-red-950 p-3 text-sm text-red-200">{error}</p>}
        {message && <p className="rounded-xl border border-emerald-800 bg-emerald-950 p-3 text-sm text-emerald-200">{message}</p>}
        <label className="block text-sm font-semibold">
          New password
          <input className="mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-950 p-3" type="password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <label className="block text-sm font-semibold">
          Confirm password
          <input className="mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-950 p-3" type="password" minLength={6} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
        </label>
        <button className="w-full rounded-xl bg-[#E8B619] p-3 font-black text-black disabled:opacity-50" disabled={loading || !token} type="submit">
          {loading ? 'Updating...' : 'Update password'}
        </button>
        <Link className="block text-center text-sm text-neutral-400 hover:text-white" href="/login">Return to login</Link>
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<main className="min-h-screen bg-black" />}><ResetPasswordForm /></Suspense>;
}
