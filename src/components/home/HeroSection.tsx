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
  const [selectedServiceQuick, setSelectedServiceQuick] = useState('3 BHK Deep Clean');

  const cityOptions = ['Wakad, Pune', 'Baner, Pune', 'Hinjewadi, Pune', 'Kharadi, Pune', 'Kothrud, Pune', 'Viman Nagar, Pune'];
  const quickServiceOptions = [
    { label: '3 BHK Deep Clean', price: '₹4,499' },
    { label: 'Kitchen Deep Clean', price: '₹999' },
    { label: 'Bathroom Deep Clean', price: '₹799' },
    { label: 'Office Deep Clean', price: '₹5,999' },
  ];

  return (
    <section className="relative bg-[#0F172A] text-white py-16 lg:py-24 overflow-hidden">
      
      {/* Background Glow Overlay */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#E8B619]/15 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: HERO CONTENT & BOOKING BAR */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-[#E8B619]/40 px-4 py-1.5 rounded-full text-xs font-black text-[#E8B619] shadow-lg">
              <Zap className="w-3.5 h-3.5 fill-[#E8B619]" />
              <span>PUNE'S #1 RATED HANDOVER & DEEP CLEANING SERVICE</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white font-sans">
              Deep Cleaning. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8B619] via-[#FBBF24] to-[#E8B619]">
                Zero Stress.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-gray-300 font-medium leading-relaxed max-w-2xl">
              Professional home & commercial deep cleaning handled by background-verified teams. Transparent pricing, non-acidic stone care, and guaranteed quality.
            </p>

            {/* BORDERLESS QUICK BOOKING BAR */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/15 shadow-2xl space-y-4 max-w-xl">
              <div className="flex items-center justify-between text-xs font-extrabold text-gray-300">
                <span className="flex items-center gap-1.5 text-[#E8B619]">
                  <Sparkles className="w-4 h-4" /> Instant Booking Bar
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-black">
                  LIVE CREW DISPATCH
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Area Dropdown */}
                <div className="bg-black/40 rounded-2xl p-3 border border-white/10">
                  <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Your Location in Pune:</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-transparent font-black text-white focus:outline-none cursor-pointer"
                  >
                    {cityOptions.map((c) => (
                      <option key={c} value={c} className="bg-gray-900 text-white font-bold">
                        📍 {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Dropdown */}
                <div className="bg-black/40 rounded-2xl p-3 border border-white/10">
                  <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Select Service Package:</label>
                  <select
                    value={selectedServiceQuick}
                    onChange={(e) => setSelectedServiceQuick(e.target.value)}
                    className="w-full bg-transparent font-black text-[#E8B619] focus:outline-none cursor-pointer"
                  >
                    {quickServiceOptions.map((s) => (
                      <option key={s.label} value={s.label} className="bg-gray-900 text-white font-bold">
                        {s.label} — {s.price}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Link
                href="/bookings/new"
                className="w-full bg-[#E8B619] hover:bg-[#D4A512] text-black font-black text-xs py-4 rounded-2xl shadow-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transform hover:scale-101"
              >
                Book {selectedServiceQuick} for {selectedCity} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* GUARANTEES */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-extrabold text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8B619] shrink-0" />
                <span>Verified Crews</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E8B619] shrink-0" />
                <span>Quality Audit</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E8B619] shrink-0" />
                <span>On-Time Arrival</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-[#E8B619] shrink-0" />
                <span>Free Re-clean</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: BORDERLESS & CARDLESS SEAMLESS FLOATING IMAGE */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* SEAMLESS FULL-BLEED IMAGE WITHOUT CARD OR BORDER */}
            <div className="relative w-full max-w-lg">
              
              {/* Soft Ambient Gold Halo Behind Image */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#E8B619]/20 to-amber-500/20 rounded-full blur-2xl pointer-events-none" />

              {/* Clean Image with Edge Gradient Mask (NO CARD, NO BORDER) */}
              <div className="relative z-10 overflow-hidden rounded-3xl">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="Spotless Luxury Deep Cleaned Home"
                  className="w-full h-[450px] lg:h-[520px] object-cover shadow-2xl transition-transform duration-700 hover:scale-105"
                />

                {/* Soft Bottom-Edge Fade into dark background */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80" />
              </div>

              {/* Floating Rating Pill (No heavy border) */}
              <div className="absolute top-6 left-6 z-20 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-black flex items-center gap-2 shadow-xl border border-white/10">
                <Star className="w-4 h-4 text-[#E8B619] fill-[#E8B619]" />
                <span>4.9 / 5.0</span>
                <span className="text-gray-300 font-normal text-[11px]">• 2,840+ Pune Homes Cleaned</span>
              </div>

              {/* Floating Dispatch Status (Seamless glass pill) */}
              <div className="absolute bottom-8 left-6 right-6 z-20 bg-black/80 backdrop-blur-xl p-4 rounded-2xl text-white flex items-center justify-between shadow-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E8B619] text-black font-black flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#E8B619] bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                      KLEANZO PRO CREW ACTIVE
                    </span>
                    <p className="text-xs font-black text-white mt-1">📍 Crew Active in {selectedCity}</p>
                  </div>
                </div>
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
