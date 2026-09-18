'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Eye, EyeOff, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { registerCustomerAction } from '@/actions/auth-actions';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const res = await registerCustomerAction({
        name,
        email,
        phone,
        password,
      });

      if (!res.success) {
        setError(res.error || 'Registration failed');
        setLoading(false);
        return;
      }

      router.push(res.redirectUrl || '/bookings');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
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
          Create Customer Account
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Book deep cleaning services and track your project in real-time
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E8B619] to-transparent" />

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-950/80 border border-red-800/60 text-red-200 text-sm flex items-start gap-3">
              <Shield className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Registration Issue</p>
                <p className="text-xs text-red-300 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Full Name
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="block w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#E8B619] focus:ring-1 focus:ring-[#E8B619] transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="block w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#E8B619] focus:ring-1 focus:ring-[#E8B619] transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Mobile Phone Number
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="block w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#E8B619] focus:ring-1 focus:ring-[#E8B619] transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Password
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="block w-full pl-11 pr-12 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#E8B619] focus:ring-1 focus:ring-[#E8B619] transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Confirm Password
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="block w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-white placeholder-neutral-600 focus:outline-none focus:border-[#E8B619] focus:ring-1 focus:ring-[#E8B619] transition-all text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#E8B619] to-amber-400 hover:from-amber-400 hover:to-[#E8B619] text-black font-extrabold text-base rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#E8B619]/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Customer Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-neutral-400">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#E8B619] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
