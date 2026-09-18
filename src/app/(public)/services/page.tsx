import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Sparkles, Clock, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Cleaning Services Marketplace | Kleanzo',
  description: 'Handover-ready cleaning services engineered for interior designers, architects, and contractors.',
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { startingPrice: 'asc' },
  });

  return (
    <div className="py-12 bg-[#F5F8FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#E8B619] bg-black px-3.5 py-1 rounded-full">
            PROFESSIONAL MARKETPLACE
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#111111] mt-4 tracking-tight">
            HANDOVER CLEANING SERVICES
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mt-3">
            Compare services designed specifically for post-construction clearance, luxury property handover, and complex stain remediation.
          </p>
        </div>

        {/* Services Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc) => {
            const features: string[] = JSON.parse(svc.includedFeatures || '[]');
            return (
              <div
                key={svc.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#E8B619] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <img src={svc.image} alt={svc.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-black/80 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#E8B619]" /> {svc.estimatedDuration}
                    </div>
                    <div className="absolute top-3 left-3 bg-[#E8B619] text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                      {svc.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-extrabold text-[#111111]">{svc.name}</h2>
                    <p className="text-gray-600 text-xs mt-2 leading-relaxed">{svc.description}</p>

                    <div className="mt-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-extrabold uppercase text-gray-400 block">Suitable For</span>
                      <span className="text-xs font-bold text-gray-900">{svc.suitableFor}</span>
                    </div>

                    <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                      {features.map((feat, i) => (
                        <li key={i} className="text-xs text-gray-700 font-medium flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#E8B619] shrink-0" />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">Starting Price</span>
                      <span className="text-xl font-black text-black">₹{svc.startingPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 grid grid-cols-2 gap-2">
                  <Link
                    href={`/bookings/new?service=${svc.slug}`}
                    className="w-full bg-[#E8B619] hover:bg-[#D4A512] text-black font-extrabold text-xs py-3 rounded-xl text-center transition-colors shadow-sm"
                  >
                    Book Now
                  </Link>
                  <Link
                    href={`/stain-removal?service=${svc.slug}`}
                    className="w-full bg-white hover:bg-gray-100 text-black border border-gray-300 font-extrabold text-xs py-3 rounded-xl text-center transition-colors"
                  >
                    Request Quote
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
