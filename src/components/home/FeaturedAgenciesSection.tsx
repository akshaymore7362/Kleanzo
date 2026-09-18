'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export function FeaturedAgenciesSection() {
  const kleanzoStandards = [
    {
      id: 'std-1',
      title: 'Vetted & Trained Crews',
      desc: 'All execution professionals undergo background verification & specialized surface training for Italian marble & luxury finishes.',
      tag: 'Certified Standards',
    },
    {
      id: 'std-2',
      title: 'Specialized Chemical Solvents',
      desc: 'Formulated neutral solvents designed to extract Fevicol, paint drips, and cement haze without etching stone or veneer.',
      tag: 'Safe Solvents',
    },
    {
      id: 'std-3',
      title: 'Automated Internal Dispatch',
      desc: 'Our proprietary matching system routes your booking to nearby verified crews for immediate dispatch and guaranteed arrival.',
      tag: 'Fast Routing',
    },
    {
      id: 'std-4',
      title: 'Handover Quality Guarantee',
      desc: 'Digital photo verification report issued before handover so architects and designers can deliver spotless spaces to clients.',
      tag: 'Quality Audit',
    },
  ];

  return (
    <section className="py-16 bg-[#F5F8FA] border-t border-gray-150 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-black uppercase text-[#E8B619] bg-black px-3 py-1 rounded-full">
              KLEANZO FULFILLMENT ASSURANCE
            </span>
            <h2 className="text-3xl font-black text-[#111111] tracking-tight mt-2">
              Why Professionals Trust Kleanzo
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Guaranteed quality, standardized rates, and automated crew dispatch for every handover project.
            </p>
          </div>
          <Link
            href="/services"
            className="mt-3 sm:mt-0 text-xs font-extrabold text-[#111111] hover:text-[#E8B619] flex items-center gap-1 transition-colors"
          >
            Explore All Services <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Standard Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kleanzoStandards.map((std) => (
            <div
              key={std.id}
              className="bg-white rounded-3xl p-6 border border-gray-200 hover:border-[#E8B619] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-[#FAF7ED] text-amber-900 border border-amber-200 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    {std.tag}
                  </span>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>

                <h3 className="font-extrabold text-base text-[#111111] leading-snug mb-2">
                  {std.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed">
                  {std.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-gray-400">Kleanzo Verified</span>
                <Link
                  href="/bookings/new"
                  className="bg-[#E8B619] hover:bg-[#D4A512] text-black font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-sm uppercase"
                >
                  Book Service
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
