'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send, CheckCircle2, Shield } from 'lucide-react';
import { forgotPasswordAction } from '@/actions/auth-actions';

export default function ForgotPasswordPage() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await forgotPasswordAction(emailOrPhone);
      setLoading(false);

      if (!res.success) {
        setError(res.error || 'Failed to process request');
        return;
      }

      setSubmitted(true);
      if (res.success && 'message' in res) {
        setMessage(res.resetUrl ? `${res.message} ${res.resetUrl}` : res.message || 'Reset instructions sent');
      }
    } catch (err: any) {
      setError(err.message || 'Server error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E8B619]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E8B619] to-amber-300 flex items-center justify-center text-black font-black text-2xl shadow-lg shadow-[#E8B619]/20 group-hover:scale-105 transition-transform">
            K
          </div>
          <span className="font-extrabold text-3xl tracking-tight text-white group-hover:text-[#E8B619] transition-colors">
            KLEANZO
          </span>
        </Link>

        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Reset Your Password
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Enter your registered email or phone to receive security verification link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E8B619] to-transparent" />

          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Reset Request Sent</h3>
              <p className="text-sm text-neutral-300">{message}</p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8B619] text-black font-bold rounded-2xl hover:bg-amber-400 transition-colors text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800/60 text-red-200 text-sm flex items-start gap-3">
                  <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Registered Email or Phone
                </label>
                <div className="relative rounded-2xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="name@domain.com or 9876543210"
                    className="block w-full pl-11 pr-4 py-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#E8B619] focus:ring-1 focus:ring-[#E8B619] transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#E8B619] to-amber-400 hover:from-amber-400 hover:to-[#E8B619] text-black font-extrabold text-base rounded-2xl transition-all duration-300 shadow-xl shadow-[#E8B619]/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Password Reset Link
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="text-xs text-neutral-400 hover:text-[#E8B619] font-medium flex items-center justify-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
