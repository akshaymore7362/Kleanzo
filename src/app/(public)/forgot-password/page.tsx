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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E8B619]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-[#FACC15] flex items-center justify-center text-black font-black text-2xl shadow-md group-hover:scale-105 transition-transform">
            K
          </div>
          <span className="font-black text-3xl tracking-tight text-slate-900 group-hover:text-[#E8B619] transition-colors">
            KLEANZO
          </span>
        </Link>

        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Reset Your Password
        </h2>
        <p className="mt-2 text-xs font-medium text-slate-500">
          Enter your registered email or phone to receive security verification link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#FACC15]" />

          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Reset Request Sent</h3>
              <p className="text-sm font-medium text-slate-600">{message}</p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FACC15] hover:bg-[#EAB308] text-black font-black rounded-2xl transition-colors text-sm shadow-md"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 shadow-xs">
                  <Shield className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-red-600">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Registered Email or Phone
                </label>
                <div className="relative rounded-2xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="name@domain.com or 9876543210"
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-gray-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#E8B619] focus:bg-white transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-[#FACC15] hover:bg-[#EAB308] text-black font-black text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
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
                <Link href="/login" className="text-xs text-slate-500 hover:text-slate-900 font-bold flex items-center justify-center gap-1">
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
