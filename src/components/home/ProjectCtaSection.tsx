'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function ProjectCtaSection() {
  return (
    <section className="py-12 bg-[#0F172A] text-white relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-[#E8B619]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-slate-900 to-black p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl">
          
          <div className="text-left space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1 text-[#E8B619] font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> KLEANZO GUARANTEE
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Ready for a Cleaner Home?
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm font-medium">
              Book your deep cleaning today and enjoy a stress-free home.
            </p>
          </div>

          <Link
            href="/bookings/new"
            className="bg-[#E8B619] hover:bg-[#D4A512] text-black font-black text-sm px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-all uppercase tracking-wide flex items-center gap-2 shrink-0 cursor-pointer"
          >
            Get My Quote <ArrowRight className="w-4 h-4" />
          </Link>

        </div>
      </div>
    </section>
  );
}
