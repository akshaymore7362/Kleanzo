'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Calculator,
  Users,
  Clock,
  Award,
  Check,
  Flame,
} from 'lucide-react';

export function FeatureComparisonSection() {
  // Live Instant Pricing Estimator State
  const [bhk, setBhk] = useState<'1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | 'Commercial'>('3 BHK');
  const [condition, setCondition] = useState<'Light' | 'Medium' | 'Heavy'>('Medium');
  const [activeComparisonTab, setActiveComparisonTab] = useState<'ALL' | 'QUALITY' | 'SAFETY'>('ALL');

  const basePrices: Record<string, number> = {
    '1 BHK': 2499,
    '2 BHK': 3499,
    '3 BHK': 4499,
    '4 BHK': 5499,
    'Commercial': 5999,
  };

  const conditionMultiplier: Record<string, number> = {
    Light: 1.0,
    Medium: 1.15,
    Heavy: 1.3,
  };

  const calculatedPrice = Math.round(basePrices[bhk] * conditionMultiplier[condition]);
  const originalPrice = Math.round(calculatedPrice * 1.25);
  const estimatedTime = bhk === '1 BHK' ? '3 - 4 Hours' : bhk === '2 BHK' ? '4 - 5 Hours' : bhk === '3 BHK' ? '5 - 6 Hours' : '6 - 8 Hours';
  const crewCount = bhk === '1 BHK' || bhk === '2 BHK' ? '2 Certified Cleaners' : bhk === '3 BHK' ? '3 Certified Cleaners' : '4+ Certified Cleaners';

  const comparisonFeatures = [
    {
      feature: 'Single-Disc Floor Scrubbing & Buffer',
      kleanzo: true,
      local: false,
      note: 'Deep stain extraction from stone & tile pores',
      category: 'QUALITY',
    },
    {
      feature: 'Non-Acidic Solvents for Italian Marble',
      kleanzo: true,
      local: false,
      note: 'Zero acid etching guarantee on natural stone',
      category: 'SAFETY',
    },
    {
      feature: '100% Background-Verified Staff',
      kleanzo: true,
      local: false,
      note: 'Police verification & ID verification badge',
      category: 'SAFETY',
    },
    {
      feature: 'Digital Photo Proof & Quality Audit',
      kleanzo: true,
      local: false,
      note: 'Supervisor sign-off before balance payment',
      category: 'QUALITY',
    },
    {
      feature: 'Fixed Rate Card with Zero Bargaining',
      kleanzo: true,
      local: false,
      note: '100% transparent pricing without hidden charges',
      category: 'QUALITY',
    },
    {
      feature: 'Free Re-clean Satisfaction Guarantee',
      kleanzo: true,
      local: false,
      note: 'Free re-clean within 24h if not satisfied',
      category: 'QUALITY',
    },
  ];

  const filteredComparison = activeComparisonTab === 'ALL'
    ? comparisonFeatures
    : comparisonFeatures.filter((f) => f.category === activeComparisonTab);

  return (
    <section className="py-20 bg-gradient-to-b from-white via-[#FAF7ED]/50 to-white border-t border-gray-150 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* ================= SECTION 1: ANIMATED INSTANT COST ESTIMATOR ================= */}
        <div className="relative">
          {/* Subtle Background Glow */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E8B619]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
            <span className="text-xs font-black uppercase tracking-widest text-black bg-[#E8B619] px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-md animate-bounce">
              <Calculator className="w-4 h-4 text-black" /> INSTANT COST CALCULATOR
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#111111] mt-4 tracking-tight">
              Get an Instant Price Estimate
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Select your property type and dirt condition below to calculate exact pricing with zero hidden fees.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#E8B619]/30 shadow-2xl relative z-10 hover:border-[#E8B619] transition-colors duration-500 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Controls (7 Columns) */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* 1. Property Type Selector */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-black uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#E8B619] text-black font-black flex items-center justify-center text-[10px]">1</span>
                      Select Property Size:
                    </label>
                    <span className="text-xs font-extrabold text-[#92400E] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Selected: {bhk}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {(['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Commercial'] as const).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setBhk(item)}
                        className={`py-3 px-2 rounded-2xl text-xs font-black transition-all transform active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          bhk === item
                            ? 'bg-[#E8B619] text-black shadow-lg ring-2 ring-[#E8B619] -translate-y-1'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 hover:-translate-y-0.5'
                        }`}
                      >
                        <span className="text-sm">{item.includes('Commercial') ? '🏢' : '🏠'}</span>
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Dirt & Stain Condition Selector */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-black uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-black text-white font-black flex items-center justify-center text-[10px]">2</span>
                      Property Condition & Stains:
                    </label>
                    <span className="text-xs font-extrabold text-gray-600">
                      {condition} Condition
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { type: 'Light' as const, label: 'Light Dust', desc: 'Regular maintenance clean', icon: '✨' },
                      { type: 'Medium' as const, label: 'Medium Stains', desc: 'Occupied deep clean', icon: '🧹' },
                      { type: 'Heavy' as const, label: 'Post-Civil Mess', desc: 'Paint, grout & debris', icon: '🔥' },
                    ].map((cond) => (
                      <button
                        key={cond.type}
                        type="button"
                        onClick={() => setCondition(cond.type)}
                        className={`p-3 rounded-2xl text-left border transition-all cursor-pointer transform active:scale-95 ${
                          condition === cond.type
                            ? 'bg-black text-white border-black shadow-xl ring-2 ring-black -translate-y-0.5'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg">{cond.icon}</span>
                          {condition === cond.type && <Check className="w-4 h-4 text-[#E8B619]" />}
                        </div>
                        <div className="font-extrabold text-xs mt-1.5">{cond.label}</div>
                        <div className={`text-[10px] font-medium mt-0.5 ${condition === cond.type ? 'text-gray-300' : 'text-gray-400'}`}>
                          {cond.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animated Live Metrics Badges */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/60 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#92400E] shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">Estimated Time</span>
                      <span className="text-xs font-black text-[#111111]">{estimatedTime}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/60 flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#92400E] shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">Crew Assigned</span>
                      <span className="text-xs font-black text-[#111111]">{crewCount}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/60 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">Equipments</span>
                      <span className="text-xs font-black text-emerald-700">100% Included</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Live Price Display Box (5 Columns) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#111111] via-gray-900 to-black rounded-3xl p-6 sm:p-8 text-white text-center space-y-6 shadow-2xl relative overflow-hidden border border-gray-800">
                
                {/* Glowing Ribbon */}
                <div className="absolute top-0 right-0 bg-[#E8B619] text-black text-[10px] font-black px-4 py-1 rounded-bl-2xl shadow-md uppercase tracking-wider">
                  INSTANT ESTIMATE
                </div>

                <div className="pt-2">
                  <span className="text-xs text-[#E8B619] font-extrabold uppercase tracking-widest block mb-1">
                    {bhk} • {condition} Dirt Package
                  </span>
                  
                  {/* Animated Big Price Number */}
                  <div className="flex items-center justify-center gap-3 my-2">
                    <span className="text-4xl sm:text-6xl font-black text-white tracking-tight animate-fade-in">
                      ₹{calculatedPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <span className="line-through text-gray-500">₹{originalPrice.toLocaleString()}</span>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-black text-[10px]">
                      25% SAVINGS
                    </span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-[11px] text-gray-300 font-semibold space-y-1">
                  <div className="flex justify-between">
                    <span>Package Price:</span>
                    <span className="text-white font-bold">₹{calculatedPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span className="text-white font-bold">₹{Math.round(calculatedPrice * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-1 text-emerald-400 font-extrabold">
                    <span>Advance Payable (20%):</span>
                    <span>₹{Math.round(calculatedPrice * 1.18 * 0.2).toLocaleString()}</span>
                  </div>
                </div>

                <Link
                  href="/bookings/new"
                  className="w-full bg-[#E8B619] hover:bg-[#D4A512] text-black font-black text-xs px-6 py-4 rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider transform hover:scale-102 cursor-pointer"
                >
                  Book Now With ₹{Math.round(calculatedPrice * 1.18 * 0.2).toLocaleString()} Advance <ArrowRight className="w-4 h-4" />
                </Link>

                <p className="text-[10px] text-gray-400 font-medium">
                  ✓ Instant Schedule Confirmation • Free Cancellation 24h Prior
                </p>

              </div>

            </div>
          </div>
        </div>

        {/* ================= SECTION 2: ANIMATED KLEANZO ADVANTAGE COMPARISON ================= */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-white bg-black px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-md">
              <Zap className="w-4 h-4 text-[#E8B619]" /> THE KLEANZO ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#111111] mt-4 tracking-tight">
              Why Kleanzo vs Traditional Maids?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              See why top homeowners, architects, and designers choose Kleanzo over unorganized local cleaners.
            </p>
          </div>

          {/* Attractive Animated Comparison Table Card */}
          <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-2xl overflow-hidden max-w-5xl mx-auto hover:border-[#E8B619] transition-colors duration-500">
            
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-[#111111] text-white p-5 text-xs font-black uppercase tracking-wider items-center">
              <div className="col-span-6 sm:col-span-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E8B619]" /> Key Cleaning Feature
              </div>
              <div className="col-span-3 sm:col-span-3 text-center text-[#E8B619] font-black flex items-center justify-center gap-1">
                <span>Kleanzo Standard</span>
              </div>
              <div className="col-span-3 sm:col-span-3 text-center text-gray-400 font-extrabold">
                Local Maids
              </div>
            </div>

            {/* Rows with Hover Animation */}
            <div className="divide-y divide-gray-150">
              {filteredComparison.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 p-4 sm:p-5 items-center text-xs hover:bg-[#FAF7ED] transition-all duration-300 group"
                >
                  <div className="col-span-6 sm:col-span-6 pr-3">
                    <span className="font-black text-[#111111] group-hover:text-[#92400E] text-xs sm:text-sm block transition-colors">
                      {item.feature}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
                      {item.note}
                    </span>
                  </div>

                  {/* Kleanzo (Yes) */}
                  <div className="col-span-3 sm:col-span-3 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-800 mt-1 hidden sm:inline">100% Guaranteed</span>
                  </div>

                  {/* Local Maids (No) */}
                  <div className="col-span-3 sm:col-span-3 flex flex-col items-center justify-center text-center opacity-60 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center shadow-xs">
                      <XCircle className="w-5 h-5 text-rose-500" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 mt-1 hidden sm:inline">Not Provided</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Guarantee Banner inside Table */}
            <div className="bg-[#FAF7ED] p-6 text-center border-t border-amber-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-2xl bg-[#E8B619] text-black font-black flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-black text-[#111111] block">100% Satisfaction & Re-Clean Support</span>
                  <span className="text-[11px] text-gray-600 font-medium">If any area is missed during quality audit, we reclean it for free.</span>
                </div>
              </div>

              <Link
                href="/bookings/new"
                className="w-full sm:w-auto bg-[#111111] hover:bg-[#E8B619] text-white hover:text-black font-extrabold text-xs px-8 py-3.5 rounded-xl shadow-md transition-all uppercase tracking-wider shrink-0 cursor-pointer"
              >
                Experience The Kleanzo Difference →
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
