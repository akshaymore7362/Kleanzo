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
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center px-4 font-sans">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-black text-slate-900">Set a new password</h1>
        <p className="text-sm font-medium text-slate-500">Choose a password with at least 6 characters.</p>
        {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
        {message && <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800">{message}</p>}
        <label className="block text-sm font-bold text-slate-700">
          New password
          <input className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 p-3 text-slate-900 font-medium focus:border-[#E8B619] focus:bg-white focus:outline-none" type="password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <label className="block text-sm font-bold text-slate-700">
          Confirm password
          <input className="mt-2 w-full rounded-2xl border border-gray-200 bg-slate-50 p-3 text-slate-900 font-medium focus:border-[#E8B619] focus:bg-white focus:outline-none" type="password" minLength={6} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
        </label>
        <button className="w-full rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] p-3 font-black text-black uppercase tracking-wider text-xs shadow-md transition disabled:opacity-50 cursor-pointer" disabled={loading || !token} type="submit">
          {loading ? 'Updating...' : 'Update password'}
        </button>
        <Link className="block text-center text-xs font-bold text-slate-500 hover:text-slate-900" href="/login">Return to login</Link>
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#F8FAFC]" />}><ResetPasswordForm /></Suspense>;
}
