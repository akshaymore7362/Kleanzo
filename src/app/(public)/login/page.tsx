'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Building2, 
  User, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Mail, 
  LogOut, 
  Eye, 
  EyeOff, 
  KeyRound, 
  ChevronDown, 
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { loginAction, instantModuleLoginAction, logoutAction } from '@/actions/auth-actions';

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<'CREDENTIALS' | 'INSTANT_DEMO'>('CREDENTIALS');
  
  // Credentials Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Instant Demo State
  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'AGENCY_ADMIN' | 'ADMIN'>('CUSTOMER');

  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Handle standard credentials login
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!identifier.trim() || !password) {
      setError('Please enter your email/phone and password');
      return;
    }

    setLoading(true);

    try {
      const res = await loginAction({
        emailOrPhone: identifier.trim(),
        password,
      });

      if (!res.success) {
        setError(res.error || 'Invalid email/phone or password');
        setLoading(false);
        return;
      }

      setNotice('Login successful! Redirecting...');
      // Force Vercel-safe document navigation to ensure session cookie is processed
      window.location.assign(res.redirectUrl || '/bookings');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  // Handle instant module demo login
  const handleModuleLogin = async (roleToLogin?: 'CUSTOMER' | 'AGENCY_ADMIN' | 'ADMIN') => {
    const target = roleToLogin || selectedRole;
    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      const res = await instantModuleLoginAction(target);
      if (!res.success) {
        setError(res.error || 'Module access failed');
        setLoading(false);
        return;
      }

      setNotice('Access granted! Entering portal...');
      window.location.assign(res.redirectUrl || '/bookings');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  // Handle clearing active session
  const handleClearSession = async () => {
    setLoggingOut(true);
    setError(null);
    setNotice(null);
    try {
      await logoutAction();
      setNotice('Active session cleared successfully. You can now log into another account.');
    } catch {
      setError('Failed to clear session.');
    } finally {
      setLoggingOut(false);
    }
  };

  const modules = [
    {
      role: 'CUSTOMER' as const,
      title: 'Customer Portal',
      subtitle: 'Live 10-step progress tracking, property management & reviews',
      icon: User,
      badge: 'Customer Access',
      defaultEmail: 'rahul.sharma@example.com',
    },
    {
      role: 'AGENCY_ADMIN' as const,
      title: 'Partner Agency Portal',
      subtitle: 'Field crew dispatch, job acceptance & partner payout tracking',
      icon: Building2,
      badge: 'Partner Access',
      defaultEmail: 'pune.agency@kleanzo.com',
    },
    {
      role: 'ADMIN' as const,
      title: 'Admin Operations Portal',
      subtitle: 'Command center, booking dispatch lock & agency management',
      icon: Shield,
      badge: 'Admin Access',
      defaultEmail: 'admin@kleanzo.com',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E8B619]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center relative z-10 mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-[#FACC15] flex items-center justify-center text-black font-black text-2xl shadow-md group-hover:scale-105 transition-transform duration-300">
            K
          </div>
          <span className="font-black text-3xl tracking-tight text-slate-900 group-hover:text-[#E8B619] transition-colors">
            KLEANZO
          </span>
        </Link>

        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Account Login & Portal Access
        </h2>
        <p className="mt-2 text-xs font-medium text-slate-500 max-w-md mx-auto">
          Log in with your email/phone credentials or use instant module access to switch roles.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10 space-y-6">
        
        {/* Mode Selector Tabs */}
        <div className="bg-slate-200/80 p-1.5 rounded-2xl flex items-center gap-2 max-w-md mx-auto border border-gray-200">
          <button
            type="button"
            onClick={() => setAuthMode('CREDENTIALS')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authMode === 'CREDENTIALS'
                ? 'bg-white text-slate-900 shadow-md border border-gray-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4 text-[#E8B619]" /> Account Credentials
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('INSTANT_DEMO')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authMode === 'INSTANT_DEMO'
                ? 'bg-white text-slate-900 shadow-md border border-gray-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-500" /> 1-Click Module Demo
          </button>
        </div>

        {/* Notices & Error Messages */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-bold shadow-xs">
            {error}
          </div>
        )}

        {notice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-bold flex items-center justify-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* MODE 1: CREDENTIALS FORM */}
        {authMode === 'CREDENTIALS' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl space-y-5">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-base font-black text-slate-900">Sign in to your account</h3>
              <p className="text-xs text-slate-500 font-medium">Enter your registered email address or mobile number</p>
            </div>

            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. rahul.sharma@example.com or 9876543210"
                    className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 focus:bg-white focus:border-[#E8B619] focus:outline-none"
                    required
                  />
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-bold text-[#E8B619] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full bg-slate-50 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-11 text-sm font-medium text-slate-900 focus:bg-white focus:border-[#E8B619] focus:outline-none"
                    required
                  />
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#FACC15] hover:bg-[#EAB308] text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Log In to Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Don't have an account yet?</span>
              <Link href="/register" className="font-black text-[#E8B619] hover:underline">
                Create Customer Account
              </Link>
            </div>
          </div>
        )}

        {/* MODE 2: INSTANT MODULE DEMO */}
        {authMode === 'INSTANT_DEMO' && (
          <div className="space-y-4">
            {/* Module Selection Dropdown Box */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xl space-y-4">
              <label className="block text-xs font-black uppercase tracking-wider text-[#E8B619]">
                Select Target Portal Role:
              </label>
              
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="w-full bg-slate-50 border border-gray-200 text-slate-900 font-bold text-sm p-4 rounded-2xl appearance-none focus:outline-none focus:border-[#E8B619] focus:bg-white cursor-pointer"
                >
                  <option value="CUSTOMER">👤 Customer Portal (/bookings)</option>
                  <option value="AGENCY_ADMIN">🏢 Partner Agency Portal (/agency/dashboard)</option>
                  <option value="ADMIN">🛡️ Admin Operations Portal (/admin/dashboard)</option>
                </select>
                <ChevronDown className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                onClick={() => handleModuleLogin(selectedRole)}
                disabled={loading}
                className="w-full py-4 px-6 bg-[#FACC15] hover:bg-[#EAB308] text-black font-black text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Enter Selected Portal Now
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* 3 Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {modules.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.role}
                    onClick={() => handleModuleLogin(m.role)}
                    disabled={loading}
                    className="p-5 rounded-3xl border border-gray-200 bg-white text-left transition-all hover:scale-105 shadow-md flex flex-col justify-between space-y-3 cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2.5 rounded-xl bg-slate-100 border border-gray-200 text-slate-900">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-gray-200">
                          {m.badge}
                        </span>
                      </div>
                      <h3 className="font-black text-slate-900 text-sm group-hover:text-[#E8B619] transition-colors">
                        {m.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                        {m.subtitle}
                      </p>
                    </div>

                    <div className="w-full py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-between transition-all bg-[#FACC15] hover:bg-[#EAB308] text-black">
                      <span>Enter Module</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Clear Session / Switch Account Options */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
          <div className="text-slate-600 font-medium flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Need to switch accounts or clear active session cookies?</span>
          </div>

          <button
            type="button"
            onClick={handleClearSession}
            disabled={loggingOut}
            className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? 'Clearing...' : 'Clear Current Session'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
