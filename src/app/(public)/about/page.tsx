import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Building2, MapPin, CheckCircle2, Award, PhoneCall } from 'lucide-react';
import { BlogSection } from '@/components/home/BlogSection';

export const metadata = {
  title: 'About Kleanzo | Professional Cleaning Infrastructure',
  description: 'Learn about Kleanzo, the professional handover cleaning marketplace built for architects, interior designers, and contractors.',
};

export default function AboutPage() {
  return (
    <div className="py-16 bg-[#F5F8FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#E8B619] bg-black px-3.5 py-1 rounded-full">
            ABOUT KLEANZO
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#111111] mt-4 tracking-tight">
            Handover-Ready Infrastructure
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mt-3">
            Connecting design studios, architects, and contractors with verified local agencies trained in post-construction handover detail.
          </p>
        </div>

        {/* Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#E8B619] font-black text-xl mb-4">
              🎯
            </div>
            <h3 className="text-xl font-black text-[#111111]">Our Mission</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              To eliminate handover delays and difficult stain friction for architects and interior designers through vetted agency infrastructure.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#E8B619] font-black text-xl mb-4">
              🛡️
            </div>
            <h3 className="text-xl font-black text-[#111111]">Strict Verification</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              100% of partner agencies undergo background checks, chemical safety training, equipment inspection, and mandatory before/after photo audits.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-3">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#E8B619] font-black text-xl mb-4">
              📍
            </div>
            <h3 className="text-xl font-black text-[#111111]">Pune Region Focus</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Operating across Baner, Wakad, Hinjewadi, Aundh, Kothrud, Viman Nagar, and Kharadi with dispatch under 60 minutes.
            </p>
          </div>
        </div>

      </div>

      {/* Expert Cleaning Guides & Blog Section */}
      <BlogSection />
    </div>
  );
}
