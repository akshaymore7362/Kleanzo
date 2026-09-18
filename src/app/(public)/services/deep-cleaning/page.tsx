'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, ArrowRight, CheckCircle2, ShieldCheck, Calendar, MapPin, User, X } from 'lucide-react';

export default function DeepCleaningServicePage() {
  const [selectedCategory, setSelectedCategory] = useState<'RESIDENTIAL' | 'OFFICE' | 'DEEP_CLEAN' | 'EVENT'>('RESIDENTIAL');
  const [selectedBhk, setSelectedBhk] = useState<'2BHK' | '3BHK' | '4BHK'>('3BHK');
  const [officeSqft, setOfficeSqft] = useState<number>(500);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [date, setDate] = useState('2026-09-15');
  const [time, setTime] = useState('10:00 AM');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('Baner, Pune');

  // Pricing calculation
  const getPrice = () => {
    if (selectedCategory === 'OFFICE') {
      return officeSqft * 15;
    }
    if (selectedBhk === '2BHK') return 9779;
    if (selectedBhk === '3BHK') return 12779;
    return 14779;
  };

  const getPackageTitle = () => {
    if (selectedCategory === 'OFFICE') return `Office Cleaning (${officeSqft} sq.ft × ₹15)`;
    if (selectedCategory === 'EVENT') return `Special Event Deep Cleaning`;
    return `Deep Cleaning Service - ${selectedBhk}`;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingSubmitted(false);
      setIsBookingModalOpen(false);
    }, 3000);
  };

  return (
    <div className="bg-[#F4F7F9] min-h-screen text-[#111111] font-sans pb-16">
      
      {/* Poster Style Top Banner / Header */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sm:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Tagline */}
          <Link href="/" className="flex flex-col">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-[#E8B619] leading-none">
              Kleanzo
            </span>
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest text-[#111111] uppercase mt-1">
              DIRT GONE. SHINE ON.
            </span>
          </Link>

          {/* Right Action & Phone */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-[#111111] hover:bg-black text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-md transition-all"
            >
              BOOK NOW <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-black">›</div>
            </button>

            <a
              href="tel:+917276241791"
              className="flex items-center gap-1.5 text-base sm:text-lg font-black text-[#111111] hover:text-[#E8B619] transition-colors"
            >
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8B619] shrink-0" />
              <span>+91 72762 41791</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Poster Section: Left Content + Right 4-Image Grid Collage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white rounded-3xl p-6 sm:p-12 shadow-xl border border-gray-150">
          
          {/* Left Column: Poster Title, Services & Charges */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Poster Headline */}
            <div>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[0.95] uppercase text-[#111111]">
                DEEP<br />
                CLEANING<br />
                SERVICE
              </h1>
            </div>

            {/* OUR SERVICE List */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-[#111111] tracking-tight">
                OUR SERVICE
              </h2>
              <ul className="space-y-2 text-sm sm:text-base font-bold text-gray-900">
                <li
                  onClick={() => setSelectedCategory('RESIDENTIAL')}
                  className={`flex items-center gap-2.5 cursor-pointer p-2 rounded-xl transition-all ${
                    selectedCategory === 'RESIDENTIAL' ? 'bg-amber-50 text-black border border-amber-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#111111] shrink-0"></span>
                  Residential Cleaning
                </li>
                <li
                  onClick={() => setSelectedCategory('OFFICE')}
                  className={`flex items-center gap-2.5 cursor-pointer p-2 rounded-xl transition-all ${
                    selectedCategory === 'OFFICE' ? 'bg-amber-50 text-black border border-amber-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#111111] shrink-0"></span>
                  Office Cleaning
                </li>
                <li
                  onClick={() => setSelectedCategory('DEEP_CLEAN')}
                  className={`flex items-center gap-2.5 cursor-pointer p-2 rounded-xl transition-all ${
                    selectedCategory === 'DEEP_CLEAN' ? 'bg-amber-50 text-black border border-amber-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#111111] shrink-0"></span>
                  Deep Cleaning
                </li>
                <li
                  onClick={() => setSelectedCategory('EVENT')}
                  className={`flex items-center gap-2.5 cursor-pointer p-2 rounded-xl transition-all ${
                    selectedCategory === 'EVENT' ? 'bg-amber-50 text-black border border-amber-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#111111] shrink-0"></span>
                  Special Event Cleaning
                </li>
              </ul>
            </div>

            {/* OUR CHARGES List */}
            <div className="space-y-3 pt-2 border-t border-gray-150">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-[#111111] tracking-tight">
                OUR CHARGES
              </h2>
              <ul className="space-y-3 text-lg sm:text-2xl font-black text-[#111111]">
                <li
                  onClick={() => { setSelectedCategory('RESIDENTIAL'); setSelectedBhk('2BHK'); }}
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded-xl transition-all ${
                    selectedBhk === '2BHK' && selectedCategory !== 'OFFICE' ? 'bg-[#FEF3C7] text-black border border-[#FDE68A]' : ''
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#111111] shrink-0"></span>
                  2 BHK - 9,779/-
                </li>
                <li
                  onClick={() => { setSelectedCategory('RESIDENTIAL'); setSelectedBhk('3BHK'); }}
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded-xl transition-all ${
                    selectedBhk === '3BHK' && selectedCategory !== 'OFFICE' ? 'bg-[#FEF3C7] text-black border border-[#FDE68A]' : ''
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#111111] shrink-0"></span>
                  3 BHK - 12,779/-
                </li>
                <li
                  onClick={() => { setSelectedCategory('RESIDENTIAL'); setSelectedBhk('4BHK'); }}
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded-xl transition-all ${
                    selectedBhk === '4BHK' && selectedCategory !== 'OFFICE' ? 'bg-[#FEF3C7] text-black border border-[#FDE68A]' : ''
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#111111] shrink-0"></span>
                  4 BHK - 14,779/-
                </li>
                <li
                  onClick={() => setSelectedCategory('OFFICE')}
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded-xl transition-all ${
                    selectedCategory === 'OFFICE' ? 'bg-[#FEF3C7] text-black border border-[#FDE68A]' : ''
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#111111] shrink-0"></span>
                  Office - 15/sqft
                </li>
              </ul>
            </div>

            {/* Quick Interactive Selection Widget */}
            <div className="bg-[#FAF7ED] p-6 rounded-2xl border border-amber-200/80 space-y-4">
              <div className="text-xs font-black uppercase text-amber-900 tracking-wider">
                INTERACTIVE RATE CALCULATOR & SELECTION
              </div>

              {selectedCategory === 'OFFICE' ? (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-700 block">Enter Office Area (in sq.ft):</label>
                  <input
                    type="number"
                    value={officeSqft}
                    onChange={(e) => setOfficeSqft(Math.max(100, Number(e.target.value)))}
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-base font-black text-black focus:outline-none focus:border-[#E8B619]"
                    placeholder="e.g. 500"
                  />
                  <div className="text-xs text-gray-500 font-semibold">Rate: ₹15 per sq.ft</div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory('RESIDENTIAL'); setSelectedBhk('2BHK'); }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black border transition-all ${
                      selectedBhk === '2BHK'
                        ? 'bg-[#E8B619] text-black border-[#E8B619]'
                        : 'bg-white text-gray-800 border-gray-200'
                    }`}
                  >
                    2 BHK (₹9,779/-)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory('RESIDENTIAL'); setSelectedBhk('3BHK'); }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black border transition-all ${
                      selectedBhk === '3BHK'
                        ? 'bg-[#E8B619] text-black border-[#E8B619]'
                        : 'bg-white text-gray-800 border-gray-200'
                    }`}
                  >
                    3 BHK (₹12,779/-)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory('RESIDENTIAL'); setSelectedBhk('4BHK'); }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black border transition-all ${
                      selectedBhk === '4BHK'
                        ? 'bg-[#E8B619] text-black border-[#E8B619]'
                        : 'bg-white text-gray-800 border-gray-200'
                    }`}
                  >
                    4 BHK (₹14,779/-)
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-amber-200 text-sm">
                <span className="font-bold text-gray-700">Calculated Charge:</span>
                <span className="text-2xl font-black text-black">₹{getPrice().toLocaleString()}/-</span>
              </div>

              <button
                type="button"
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full bg-[#111111] hover:bg-black text-white font-extrabold text-sm py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                PROCEED TO BOOK NOW <ArrowRight className="w-4 h-4 text-[#E8B619]" />
              </button>
            </div>

          </div>

          {/* Right Column: 4-Image Cleaning Collage (Exact Poster Composition) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            
            {/* Image 1: Window / Glass Cleaning with yellow gloves */}
            <div className="h-64 sm:h-72 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"
                alt="Window & Glass Cleaning"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Image 2: Surface & Mirror Wiping with yellow gloves */}
            <div className="h-64 sm:h-72 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
                alt="Surface & Mirror Wiping"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Image 3: Bathroom Sink Cleaning with yellow gloves */}
            <div className="h-64 sm:h-72 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"
                alt="Bathroom Sink Cleaning"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Image 4: Toilet Bowl Sanitation with yellow gloves */}
            <div className="h-64 sm:h-72 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80"
                alt="Toilet Bowl Sanitation"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

          </div>

        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
            
            {/* Close Button */}
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-2 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            {bookingSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-[#111111]">Booking Confirmed!</h3>
                <p className="text-xs text-gray-600">
                  Your request for <span className="font-bold text-black">{getPackageTitle()}</span> has been confirmed. Our team will contact you at <span className="font-bold text-black">{phone || '+91 72762 41791'}</span> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#E8B619] bg-black px-2.5 py-0.5 rounded">
                    CONFIRM BOOKING
                  </span>
                  <h3 className="text-2xl font-black text-[#111111] mt-1">{getPackageTitle()}</h3>
                  <div className="text-sm font-black text-emerald-700 mt-0.5">Total Amount: ₹{getPrice().toLocaleString()}/-</div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-extrabold text-gray-700 block mb-1">Your Full Name:</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ar. Rajesh Sharma"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-bold focus:outline-none focus:border-[#E8B619]"
                    />
                  </div>

                  <div>
                    <label className="font-extrabold text-gray-700 block mb-1">Phone Number:</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98230 11223"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-bold focus:outline-none focus:border-[#E8B619]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-extrabold text-gray-700 block mb-1">Date:</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-bold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-gray-700 block mb-1">Preferred Time:</label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-bold focus:outline-none"
                      >
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-extrabold text-gray-700 block mb-1">Property Address / City:</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Flat 402, Baner Road, Pune"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 font-bold focus:outline-none focus:border-[#E8B619]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#E8B619] hover:bg-[#D4A512] text-black font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all uppercase"
                  >
                    CONFIRM & SUBMIT BOOKING
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
