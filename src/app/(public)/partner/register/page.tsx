'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Building2, User, Phone, Mail, Lock, MapPin, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { registerPartnerAgencyAction } from '@/actions/agency-onboarding-actions';

export default function PartnerRegisterPage() {
  const router = useRouter();
  const [agencyName, setAgencyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Pune');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const res = await registerPartnerAgencyAction({
        agencyName,
        ownerName,
        phone,
        email,
        password,
        city,
      });

      if (!res.success) {
        throw new Error(res.error || 'Registration failed. Please try again.');
      }

      router.push('/partner/onboarding');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        
        {/* TOP BRAND BANNER */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#FEF08A] text-amber-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-[#FDE047] shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-600" /> Kleanzo Fulfillment Partner Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Become a Kleanzo Partner
          </h1>
          <p className="text-sm text-slate-600 font-semibold max-w-xl mx-auto">
            Expand your cleaning business in Pune. Receive pre-paid, high-margin deep cleaning jobs with fixed payout guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: BENEFIT HIGHLIGHTS */}
          <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" /> Why Partner with Kleanzo?
            </h3>

            <div className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">Fixed Partner Payouts</h4>
                  <p className="text-slate-500 mt-0.5">Guaranteed payouts for every completed job without price negotiation hassles.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 font-black flex items-center justify-center shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">Pre-Qualified Local Leads</h4>
                  <p className="text-slate-500 mt-0.5">Get matched directly with nearby residential & commercial deep cleaning customers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 font-black flex items-center justify-center shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">Digital Operations Tools</h4>
                  <p className="text-slate-500 mt-0.5">Manage crews, photo uploads, QC checklists, and payouts through our dedicated Agency Portal.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">Verified Quality Badge</h4>
                  <p className="text-slate-500 mt-0.5">Build brand trust as a Kleanzo Certified Partner with performance-based tier upgrades.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-slate-500 font-medium">Already registered an application?</p>
              <Link href="/login" className="text-xs font-black text-amber-700 hover:text-slate-900 underline mt-1 inline-block">
                Sign In to Resume Onboarding →
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: REGISTRATION FORM */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-md space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">Create Partner Account</h3>
              <p className="text-xs text-slate-500 font-medium">Step 1 of 2: Create your login credentials to start onboarding.</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 border border-red-200 font-bold text-xs rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
                  Agency / Business Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="e.g. Apex Cleaning Services"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
                    Owner / Contact Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
                    Operating City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:border-transparent transition-all bg-white"
                    >
                      <option value="Pune">Pune, Maharashtra</option>
                      <option value="PCMC">PCMC, Pune</option>
                      <option value="Mumbai">Mumbai</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@agency.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
                  Create Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-[#FACC15] hover:bg-amber-400 text-black font-black text-xs py-3.5 rounded-xl shadow-md uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {busy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" /> Creating Partner Profile...
                    </>
                  ) : (
                    <>
                      Register & Continue Onboarding <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center font-medium">
                By registering, you agree to Kleanzo&apos;s fulfillment partner policies and operational terms.
              </p>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
