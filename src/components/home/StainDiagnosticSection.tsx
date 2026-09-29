'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';

export function StainDiagnosticSection() {
  const [selectedStain, setSelectedStain] = useState('Glue / Fevicol');
  const [selectedSurface, setSelectedSurface] = useState('Italian Marble');

  const stainOptions = [
    { name: 'Glue / Fevicol', icon: '🧪', risk: 'High synthetic polymer bond strength' },
    { name: 'Paint & Emulsion', icon: '🎨', risk: 'Requires non-scratch micro solvents' },
    { name: 'Cement & Grout', icon: '🏗️', risk: 'Must avoid acid etching on stone' },
    { name: 'Colour Stains', icon: '🪣', risk: 'Deep substrate penetration risk' },
    { name: 'Silicone & Caulk', icon: '🔫', risk: 'Requires mechanical stripping' },
    { name: 'Putty & Plaster', icon: '🧱', risk: 'Fine dust extraction needed' },
  ];

  const surfaceOptions = ['Italian Marble', 'Vitrified Tile', 'Wood / Veneer', 'Glass', 'Laminate', 'Metal'];

  return (
    <section className="py-20 bg-[#F5F8FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-amber-950 bg-[#FEF08A] border border-[#FDE047] px-3.5 py-1 rounded-full shadow-xs">
            SMART STAIN REMEDIATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#111111] mt-4 tracking-tight">
            WHAT DO YOU NEED CLEANED?
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mt-3">
            No technical chemistry knowledge needed. Select what stain is on your project site and what surface it's on to match with specialized removal agencies.
          </p>
        </div>

        {/* Diagnostic Wizard Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Step 1: Select Stain */}
            <div>
              <label className="text-xs font-extrabold uppercase text-gray-500 tracking-wider block mb-3">
                1. Select Stain Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stainOptions.map((stain) => (
                  <button
                    key={stain.name}
                    type="button"
                    onClick={() => setSelectedStain(stain.name)}
                    className={`p-3.5 rounded-2xl border text-left font-bold text-sm transition-all flex flex-col justify-between h-24 ${
                      selectedStain === stain.name
                        ? 'border-[#E8B619] bg-[#E8B619]/10 text-black shadow-sm ring-2 ring-[#E8B619]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/50'
                    }`}
                  >
                    <span className="text-2xl">{stain.icon}</span>
                    <span className="truncate">{stain.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Surface */}
            <div>
              <label className="text-xs font-extrabold uppercase text-gray-500 tracking-wider block mb-3">
                2. Select Surface Substrate
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {surfaceOptions.map((surface) => (
                  <button
                    key={surface}
                    type="button"
                    onClick={() => setSelectedSurface(surface)}
                    className={`p-3.5 rounded-2xl border text-center font-bold text-sm transition-all py-6 ${
                      selectedSurface === surface
                        ? 'border-[#FACC15] bg-[#FACC15] text-black font-black shadow-md ring-2 ring-[#FACC15]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/50'
                    }`}
                  >
                    {surface}
                  </button>
                ))}
              </div>

              {/* Dynamic Assessment Box */}
              <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <span className="font-extrabold">Safety Notice:</span> Treatment of <span className="underline font-bold">{selectedStain}</span> on <span className="underline font-bold">{selectedSurface}</span> requires custom pH-balanced solvents. Final treatment suitability depends on stain age and surface condition.
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#E8B619]" />
              Selected Requirement: <span className="font-bold text-black">{selectedStain} on {selectedSurface}</span>
            </div>
            <Link
              href={`/bookings/new?stain=${encodeURIComponent(selectedStain)}&surface=${encodeURIComponent(selectedSurface)}`}
              className="w-full sm:w-auto bg-[#E8B619] hover:bg-[#D4A512] text-black font-extrabold px-8 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
            >
              PROCEED TO BOOKING FORM (₹499 ADVANCE) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
