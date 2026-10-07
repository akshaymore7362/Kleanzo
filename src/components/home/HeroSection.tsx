'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ThumbsUp,
  MapPin,
  Star,
  Zap,
  Users,
} from 'lucide-react';

export function HeroSection() {
  const [selectedCity, setSelectedCity] = useState('Wakad, Pune');
  const [selectedServiceQuick, setSelectedServiceQuick] = useState('3 BHK Deep Cleaning');
  const [showHelpMeChoose, setShowHelpMeChoose] = useState(false);
  
  // Help Me Choose Wizard State
  const [helpStep, setHelpStep] = useState(1);
  const [helpAnswers, setHelpAnswers] = useState({
    cleaningType: 'New Home',
    condition: 'Medium',
    issueType: 'Dust & Construction Residue',
    propertySize: '2 BHK (approx 1,100 sq.ft)',
  });

  const cityOptions = ['Wakad, Pune', 'Baner, Pune', 'Hinjewadi, Pune', 'Kharadi, Pune', 'Kothrud, Pune', 'Viman Nagar, Pune'];
  const quickServiceOptions = [
    { label: '3 BHK Deep Cleaning', price: '₹4,499' },
    { label: '2 BHK Deep Cleaning', price: '₹3,499' },
    { label: 'Kitchen Deep Cleaning', price: '₹999' },
    { label: 'Bathroom Deep Cleaning', price: '₹799' },
    { label: 'Commercial Handover Cleaning', price: '₹7,499' },
  ];

  return (
    <section className="relative bg-white text-slate-900 py-16 lg:py-24 overflow-hidden border-b border-gray-200">
      {/* Background Glow Overlay */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-200/30 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: HERO CONTENT & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FEF08A] border border-[#FDE047] px-4 py-1.5 rounded-full text-xs font-black text-amber-950 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>KLEANZO — DIRT GONE. SHINE ON.</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-slate-900 font-sans">
              Professional Cleaning Services, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700">
                Managed by Kleanzo.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 font-semibold leading-relaxed max-w-2xl">
              Professional deep cleaning for your home & commercial spaces. Transparent Kleanzo pricing, supervisor quality checks, and 100% managed service guarantee.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/bookings/new"
                className="bg-[#FACC15] hover:bg-[#EAB308] text-black font-black text-sm px-8 py-4 rounded-2xl shadow-xl transition-all uppercase tracking-wider flex items-center gap-2 transform hover:scale-102 cursor-pointer"
              >
                <span>BOOK A SERVICE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => { setHelpStep(1); setShowHelpMeChoose(true); }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-black text-sm px-7 py-4 rounded-2xl shadow-lg transition-all uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>HELP ME CHOOSE</span>
              </button>

              <Link
                href="/services"
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-extrabold text-sm px-6 py-4 rounded-2xl transition-all uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <span>EXPLORE SERVICES</span>
              </Link>
            </div>

            {/* QUICK BOOKING BAR */}
            <div className="bg-slate-50/90 rounded-3xl p-5 border border-gray-200/90 shadow-lg space-y-4 max-w-xl mt-6">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
                <span className="flex items-center gap-1.5 text-amber-800 font-black">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Quick Partner Dispatch
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full font-black">
                  LIVE PARTNER SEARCH
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Area Dropdown */}
                <div className="bg-white rounded-2xl p-3 border border-gray-300 shadow-xs">
                  <label className="text-[10px] text-gray-500 font-extrabold uppercase block mb-1">Service Area:</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-transparent font-black text-slate-900 focus:outline-none cursor-pointer"
                  >
                    {cityOptions.map((c) => (
                      <option key={c} value={c} className="bg-white text-slate-900 font-bold">
                        📍 {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Dropdown */}
                <div className="bg-white rounded-2xl p-3 border border-gray-300 shadow-xs">
                  <label className="text-[10px] text-gray-500 font-extrabold uppercase block mb-1">Select Service:</label>
                  <select
                    value={selectedServiceQuick}
                    onChange={(e) => setSelectedServiceQuick(e.target.value)}
                    className="w-full bg-transparent font-black text-amber-800 focus:outline-none cursor-pointer"
                  >
                    {quickServiceOptions.map((s) => (
                      <option key={s.label} value={s.label} className="bg-white text-slate-900 font-bold">
                        {s.label} — {s.price}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Link
                href="/bookings/new"
                className="w-full bg-slate-900 hover:bg-black text-white font-black text-xs py-3.5 rounded-2xl shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book {selectedServiceQuick} for {selectedCity}</span>
                <ArrowRight className="w-4 h-4 text-[#FACC15]" />
              </Link>
            </div>

            {/* TRUST BADGES */}
            <div className="pt-4 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-extrabold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Verified Partners</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Supervisor QC</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>On-Time Arrival</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Kleanzo Guarantee</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: HERO IMAGE */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-lg">
              {/* Glow Halo */}
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-300/30 to-amber-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 overflow-hidden rounded-3xl border border-gray-200 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="Kleanzo Deep Cleaned Luxury Home"
                  className="w-full h-[450px] lg:h-[520px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              </div>

              {/* Rating Badge */}
              <div className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-slate-900 text-xs font-black flex items-center gap-2 shadow-xl border border-gray-200">
                <Star className="w-4 h-4 text-[#E8B619] fill-[#E8B619]" />
                <span>4.9 / 5.0 Rating</span>
                <span className="text-slate-500 font-semibold text-[11px]">• 2,840+ Pune Homes</span>
              </div>

              {/* Partner Active Pill */}
              <div className="absolute bottom-8 left-6 right-6 z-20 bg-white/95 backdrop-blur-xl p-4 rounded-2xl text-slate-900 flex items-center justify-between shadow-2xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FACC15] text-black font-black flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-950 bg-[#FEF08A] px-2 py-0.5 rounded-full border border-[#FDE047]">
                      KLEANZO MANAGED TEAMS
                    </span>
                    <p className="text-xs font-black text-slate-900 mt-1">📍 Active Service in {selectedCity}</p>
                  </div>
                </div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping shrink-0" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* HELP ME CHOOSE MODAL (Phase 4 Prompt) */}
      {showHelpMeChoose && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-200 shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-900 bg-[#FEF08A] px-2.5 py-1 rounded-full">
                  Kleanzo Service Advisor • Step {helpStep} of 4
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Help Me Choose The Right Service</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpMeChoose(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-slate-600 font-black text-sm flex items-center justify-center hover:bg-gray-200 transition"
              >
                ✕
              </button>
            </div>

            {/* Step 1: Cleaning Requirement */}
            {helpStep === 1 && (
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  1. What do you need cleaned?
                </label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {['New Home / Move-In', 'Renovation / Interior', 'Office / Commercial', 'Furniture / Sofa', 'Bathroom / Kitchen', 'Other Heavy Stain'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setHelpAnswers({ ...helpAnswers, cleaningType: option });
                        setHelpStep(2);
                      }}
                      className={`p-3.5 rounded-2xl border text-left font-bold transition flex items-center justify-between ${
                        helpAnswers.cleaningType === option
                          ? 'bg-[#FEF08A] text-amber-950 border-[#FACC15] ring-2 ring-[#FACC15]'
                          : 'bg-gray-50 text-slate-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <span>{option}</span>
                      {helpAnswers.cleaningType === option && <span>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Property Condition */}
            {helpStep === 2 && (
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  2. What is the current condition of the area?
                </label>
                <div className="space-y-3 text-xs">
                  {[
                    { label: 'Light', desc: 'Regular dust, light surface maintenance' },
                    { label: 'Medium', desc: 'Occupied home, stains on kitchen/bathroom surfaces' },
                    { label: 'Heavy / Post-Construction', desc: 'Cement residue, paint spots, glue, heavy debris' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setHelpAnswers({ ...helpAnswers, condition: item.label });
                        setHelpStep(3);
                      }}
                      className="w-full p-4 rounded-2xl border text-left bg-gray-50 border-gray-200 hover:bg-amber-50 hover:border-[#FACC15] transition"
                    >
                      <div className="font-black text-slate-900">{item.label}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Specific Issue / Stain Type */}
            {helpStep === 3 && (
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  3. What specific issues or stains are present?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Dust & Dirt', 'Paint Residue', 'Glue / Fevicol', 'Cement Stains', 'Hard Water Stains', 'Grout Residue'].map((stain) => (
                    <button
                      key={stain}
                      type="button"
                      onClick={() => {
                        setHelpAnswers({ ...helpAnswers, issueType: stain });
                        setHelpStep(4);
                      }}
                      className="p-3 rounded-xl border border-gray-200 bg-gray-50 font-bold text-slate-800 hover:bg-[#FEF08A] hover:border-[#FACC15] transition"
                    >
                      {stain}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Recommendation Result */}
            {helpStep === 4 && (
              <div className="space-y-4 text-xs">
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-2">
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Recommended Kleanzo Service
                  </span>
                  <h4 className="text-base font-black text-slate-900">
                    {helpAnswers.cleaningType.includes('Renovation') || helpAnswers.issueType.includes('Cement')
                      ? 'Post-Construction Deep Cleaning Package'
                      : helpAnswers.cleaningType.includes('Furniture')
                      ? 'Sofa & Upholstery Shampooing Package'
                      : 'Full House Systematic Deep Cleaning (3 BHK)'}
                  </h4>
                  <p className="text-slate-600 font-medium text-[11px]">
                    Includes mechanized floor scrubbing, stain treatment for {helpAnswers.issueType}, supervisor QC inspection, and 100% Kleanzo satisfaction guarantee.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setHelpStep(1)}
                    className="px-4 py-2 bg-gray-100 text-slate-600 rounded-xl font-bold"
                  >
                    Start Over
                  </button>
                  <Link
                    href={`/bookings/new?category=Deep Cleaning&recommendation=${encodeURIComponent(helpAnswers.cleaningType)}`}
                    onClick={() => setShowHelpMeChoose(false)}
                    className="px-6 py-3 bg-[#FACC15] hover:bg-[#EAB308] text-slate-950 font-black rounded-xl uppercase tracking-wider shadow-md"
                  >
                    Book Recommended Service →
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}


