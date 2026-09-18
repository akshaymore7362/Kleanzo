'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DollarSign, ShieldCheck, Award, Smile, ArrowRight } from 'lucide-react';

export function WhyKleanzoSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Why Choose Kleanzo? */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl font-black text-[#111111] tracking-tight">
              Why Choose Kleanzo?
            </h2>

            <div className="space-y-5">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#E8B619] border border-amber-200 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <DollarSign className="w-5 h-5 text-[#E8B619]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#111111]">Transparent Pricing</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5 leading-relaxed">
                    No hidden charges. Know the price before you book.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#E8B619] border border-amber-200 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-[#E8B619]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#111111]">Verified Cleaning Partners</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5 leading-relaxed">
                    We work with experienced agencies, not random workers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#E8B619] border border-amber-200 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Award className="w-5 h-5 text-[#E8B619]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#111111]">Quality You Can Trust</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5 leading-relaxed">
                    Every service is quality checked before handover.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#E8B619] border border-amber-200 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Smile className="w-5 h-5 text-[#E8B619]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#111111]">Hassle-Free Experience</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5 leading-relaxed">
                    From booking to handover, we take care of everything.
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="bg-[#E8B619] hover:bg-[#D4A512] text-black font-extrabold text-xs px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-md transition-all uppercase tracking-wide"
              >
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: See The Kleanzo Difference (Before & After Slider) */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl font-black text-[#111111] tracking-tight">
              See The Kleanzo Difference
            </h2>

            <div
              className="relative w-full h-[320px] rounded-3xl overflow-hidden border-2 border-gray-200 shadow-xl select-none cursor-ew-resize"
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* After Image (Full background) */}
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                alt="After Kleanzo Deep Cleaning"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute bottom-4 right-4 bg-black/80 text-white font-extrabold text-xs px-3 py-1 rounded-full border border-white/20">
                After
              </span>

              {/* Before Image (Clipped overlay) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80"
                  alt="Before Kleanzo Deep Cleaning"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%' }}
                />
                <span className="absolute bottom-4 left-4 bg-black/80 text-white font-extrabold text-xs px-3 py-1 rounded-full border border-white/20">
                  Before
                </span>
              </div>

              {/* Draggable Divider Line & Knob */}
              <div
                className="absolute inset-y-0 w-1 bg-[#E8B619] shadow-2xl flex items-center justify-center pointer-events-none"
                style={{ left: `calc(${sliderPosition}% - 2px)` }}
              >
                <div className="w-8 h-8 rounded-full bg-[#E8B619] text-black font-black text-xs flex items-center justify-center shadow-lg border-2 border-white">
                  ↔
                </div>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 font-medium text-center">
              Drag slider left or right to compare before and after Kleanzo systematic deep cleaning.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
