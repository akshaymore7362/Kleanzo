'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, Building2, User, Sparkles, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { instantModuleLoginAction } from '@/actions/auth-actions';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'AGENCY_ADMIN' | 'ADMIN'>('CUSTOMER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModuleLogin = async (roleToLogin?: 'CUSTOMER' | 'AGENCY_ADMIN' | 'ADMIN') => {
    const target = roleToLogin || selectedRole;
    setError(null);
    setLoading(true);

    try {
      const res = await instantModuleLoginAction(target);
      if (!res.success) {
        setError(res.error || 'Module access failed');
        setLoading(false);
        return;
      }

      window.location.href = res.redirectUrl || '/bookings';
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const modules = [
    {
      role: 'CUSTOMER' as const,
      title: 'Customer Portal',
      subtitle: 'Live 10-step cleaning progress tracker & service management',
      icon: User,
      color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      btnColor: 'bg-emerald-500 hover:bg-emerald-400 text-black',
      badge: 'Customer Access',
    },
    {
      role: 'AGENCY_ADMIN' as const,
      title: 'Partner Agency Portal',
      subtitle: 'Field crew management, job acceptance & payout tracking',
      icon: Building2,
      color: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      btnColor: 'bg-blue-500 hover:bg-blue-400 text-white',
      badge: 'Partner Access',
    },
    {
      role: 'ADMIN' as const,
      title: 'Admin Operations Portal',
      subtitle: 'Master operational pipeline, partner assignment & analytics',
      icon: Shield,
      color: 'bg-[#E8B619]/10 border-[#E8B619]/30 text-[#E8B619]',
      btnColor: 'bg-[#E8B619] hover:bg-amber-400 text-black',
      badge: 'Admin Access',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E8B619]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center relative z-10 mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E8B619] to-amber-300 flex items-center justify-center text-black font-black text-2xl shadow-lg shadow-[#E8B619]/20 group-hover:scale-105 transition-transform duration-300">
            K
          </div>
          <span className="font-extrabold text-3xl tracking-tight text-white group-hover:text-[#E8B619] transition-colors">
            KLEANZO
          </span>
        </Link>

        <div className="inline-block bg-[#FEF3C7]/10 text-[#E8B619] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3 border border-[#E8B619]/30">
          ⚡ 1-CLICK INSTANT MODULE LOGIN (NO PASSWORD REQUIRED)
        </div>

        <h2 className="text-3xl font-black tracking-tight text-white">
          Select Module to Enter
        </h2>
        <p className="mt-2 text-xs text-neutral-400 max-w-md mx-auto">
          Authentication bypass is enabled. Choose any module below to log in instantly.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10 space-y-6">
        
        {/* Module Selection Dropdown Box */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
          <label className="block text-xs font-black uppercase tracking-wider text-[#E8B619]">
            Select Module Portal Dropdown:
          </label>
          
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="w-full bg-neutral-950 border border-neutral-700 text-white font-extrabold text-sm p-4 rounded-2xl appearance-none focus:outline-none focus:border-[#E8B619] cursor-pointer"
            >
              <option value="CUSTOMER">👤 Customer Portal (/bookings)</option>
              <option value="AGENCY_ADMIN">🏢 Partner Agency Portal (/agency/dashboard)</option>
              <option value="ADMIN">🛡️ Admin Operations Portal (/admin/dashboard)</option>
            </select>
            <ChevronDown className="w-5 h-5 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => handleModuleLogin(selectedRole)}
            disabled={loading}
            className="w-full py-4 px-6 bg-[#E8B619] hover:bg-amber-400 text-black font-black text-sm rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Enter Selected Module Now
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
                className={`p-5 rounded-3xl border text-left transition-all hover:scale-105 backdrop-blur-xl flex flex-col justify-between space-y-3 cursor-pointer group ${m.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-current">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-black/50 border border-current">
                      {m.badge}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-white text-sm group-hover:text-[#E8B619] transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-medium mt-1 leading-relaxed">
                    {m.subtitle}
                  </p>
                </div>

                <div className={`w-full py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-between transition-all ${m.btnColor}`}>
                  <span>Enter Module</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-200 text-xs text-center font-bold">
            {error}
          </div>
        )}

      </div>
    </div>
  );
}
