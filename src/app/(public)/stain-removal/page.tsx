import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Sparkles, ShieldAlert, CheckCircle, UploadCloud, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Stain Removal & Remediation Diagnostic | Kleanzo',
  description: 'Specialized chemical solvent treatment for glue, fevicol, paint overspray, and cement slurry on marble & tile.',
};

export default async function StainRemovalPage() {
  const stainTypes = await prisma.stainType.findMany();

  return (
    <div className="py-12 bg-[#F5F8FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#E8B619] bg-black px-3.5 py-1 rounded-full">
            DEDICATED STAIN REMEDIATION
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#111111] mt-4 tracking-tight">
            COMPLEX STAIN REMOVAL SYSTEM
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mt-3">
            Synthetic adhesives, paint drips, and cement slurry require exact surface-solvent matching to avoid scratching expensive finishes.
          </p>
        </div>

        {/* Mandatory Safety Notice Banner */}
        <div className="mb-12 bg-amber-50 border border-amber-300 rounded-2xl p-6 flex items-start gap-4 shadow-sm max-w-4xl mx-auto">
          <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-extrabold text-sm text-amber-900 uppercase">Substrate & Stain Assessment Guarantee Notice</h3>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              Final treatment suitability depends on the surface, stain age, and previous chemical attempts. Our verified cleaning agencies inspect the site or analyze uploaded photos before applying specialized solvent treatments.
            </p>
          </div>
        </div>

        {/* Stain Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {stainTypes.map((stain) => {
            const surfaces: string[] = JSON.parse(stain.surfaceCompatibility || '[]');
            return (
              <div
                key={stain.id}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase bg-black text-[#E8B619] px-3 py-1 rounded-full">
                      {stain.category}
                    </span>
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        stain.difficultyLevel === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Difficulty: {stain.difficultyLevel}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-[#111111]">{stain.name}</h3>
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">{stain.description}</p>

                  <div className="mt-6">
                    <span className="text-[10px] font-extrabold uppercase text-gray-400 block mb-2">
                      Compatible Surfaces
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {surfaces.map((s, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-lg">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600">
                    <span className="font-bold text-black">Safety Notice:</span> {stain.safetyNotice}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100">
                  <Link
                    href={`/bookings/new?service=${stain.slug}`}
                    className="w-full bg-[#E8B619] hover:bg-[#D4A512] text-black font-extrabold text-xs py-3.5 rounded-xl text-center transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    REQUEST STAIN ASSESSMENT <ArrowRight className="w-4 h-4" />
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
