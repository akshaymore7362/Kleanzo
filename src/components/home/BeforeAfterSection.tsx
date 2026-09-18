'use client';

import React, { useState } from 'react';
import { Sparkles, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

export function BeforeAfterSection() {
  const [sliderPos, setSliderPos] = useState(50);

  const handleSliderMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <section className="py-20 bg-[#111111] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-black bg-[#E8B619] px-3.5 py-1 rounded-full">
            PROOF OF EXCELLENCE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">
            BEFORE & AFTER HANDOVER AUDIT
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mt-3">
            Drag the slider to see how Kleanzo verified agencies transform post-construction sites into client-ready luxury spaces.
          </p>
        </div>

        {/* Slider Box */}
        <div className="max-w-4xl mx-auto bg-gray-900 rounded-3xl p-4 sm:p-6 border border-gray-800 shadow-2xl">
          <div className="relative h-[320px] sm:h-[480px] w-full rounded-2xl overflow-hidden select-none">
            {/* After Image (Full background) */}
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
              alt="After Cleaning Handover Ready"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-[#E8B619] text-xs font-black px-3.5 py-1.5 rounded-full border border-[#E8B619]/40 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> HANDOVER READY (AFTER)
            </div>

            {/* Before Image (Clipped by slider position) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80"
                alt="Before Cleaning Construction Site"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%' }}
              />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-gray-300 text-xs font-black px-3.5 py-1.5 rounded-full border border-gray-700">
                POST-CIVIL MESS (BEFORE)
              </div>
            </div>

            {/* Vertical Divider Handle */}
            <div
              className="absolute inset-y-0 w-1 bg-[#E8B619] shadow-[0_0_12px_#E8B619] pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-[#E8B619] rounded-full flex items-center justify-center text-black shadow-lg">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            </div>

            {/* Range Input Overlay */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={handleSliderMove}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-400 font-semibold px-2">
            <span>◄ Drag Left for Before</span>
            <span className="text-[#E8B619]">Interactive Comparison Tool</span>
            <span>Drag Right for After ►</span>
          </div>
        </div>
      </div>
    </section>
  );
}
