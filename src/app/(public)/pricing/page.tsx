import React from 'react';
import Link from 'next/link';
import { CheckCircle2, PhoneCall, ShieldCheck, ArrowRight, Building2, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Official Pricing & Rate Specifications | Kleanzo',
  description: 'Standardized rate card for residential deep cleaning, commercial office handover, and specialist stain removal.',
};

export default function PricingPage() {
  const residentialPricing = [
    { type: '2 BHK Residential Deep Clean', price: '9,779', desc: 'Complete post-construction deep clean for 2 BHK apartment' },
    { type: '3 BHK Residential Deep Clean', price: '12,779', desc: 'Complete post-construction deep clean for 3 BHK apartment', popular: true },
    { type: '4 BHK Luxury Penthouse Clean', price: '14,779', desc: 'Deep detail handover clean for 4 BHK & duplex residences' },
    { type: 'Commercial Office Space', price: '15 / sq.ft', desc: 'Industrial HEPA dust extraction & glass facade detailing for commercial offices' },
  ];

  return (
    <div className="py-16 bg-[#F5F8FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#E8B619] bg-black px-3.5 py-1 rounded-full">
            TRANSPARENT RATE CARD
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#111111] mt-4 tracking-tight">
            Official Pricing & Rate Specifications
          </h1>
          <p className="text-gray-600 text-base mt-2">
            No hidden charges. Service exclusively available in Pune region & surrounding design hubs.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-extrabold text-black">
            <MapPin className="w-4 h-4 text-[#E8B619]" /> Coverage: Baner • Wakad • Hinjewadi • Aundh • Kothrud • Viman Nagar • Kharadi
          </div>
        </div>

        {/* Pricing Cards Grid matching Flyer Specification */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {residentialPricing.map((item) => (
            <div
              key={item.type}
              className={`bg-white rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl relative ${
                item.popular ? 'border-[#E8B619] ring-2 ring-[#E8B619]' : 'border-gray-200'
              }`}
            >
              {item.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E8B619] text-black text-[10px] font-black uppercase px-3 py-1 rounded-full">
                  MOST POPULAR DESIGNER CHOICE
                </span>
              )}

              <div>
                <h3 className="text-lg font-black text-[#111111]">{item.type}</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{item.desc}</p>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400 font-extrabold uppercase block">Fixed Charge</span>
                  <div className="text-3xl font-black text-black mt-1">
                    ₹{item.price} <span className="text-xs font-normal text-gray-500">/-</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-2 text-xs font-bold text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#E8B619]" /> Construction dust removal
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#E8B619]" /> Glue & Fevicol solvent wipe
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#E8B619]" /> Sanitaryware & tile sparkle
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#E8B619]" /> Mandatory before/after proof
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100">
                <Link
                  href={`/bookings/new?service=${encodeURIComponent(item.type)}`}
                  className="w-full bg-[#E8B619] hover:bg-[#D4A512] text-black font-extrabold text-xs py-3.5 rounded-xl text-center block transition-all shadow-md"
                >
                  BOOK SERVICE NOW
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Direct Contact Hotline Banner */}
        <div className="bg-[#111111] text-white rounded-3xl p-8 border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#E8B619] text-black rounded-2xl flex items-center justify-center font-black text-2xl">
              📞
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#E8B619] uppercase">Direct Booking Hotline</div>
              <div className="text-2xl font-black text-white">+91 72762 41791</div>
            </div>
          </div>
          <Link
            href="/pro"
            className="bg-white text-black hover:bg-gray-100 font-extrabold text-xs px-6 py-3.5 rounded-full transition-colors"
          >
            Studio & Architect Portal →
          </Link>
        </div>

      </div>
    </div>
  );
}
