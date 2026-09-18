import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Building2, Plus, Calendar, CheckCircle2, Clock, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Studio & Architect Portal | Kleanzo',
  description: 'Multi-project handover management tool for interior design studios, architects, and site directors.',
};

export default async function StudioPortalPage() {
  const projects = await prisma.project.findMany({
    include: {
      bookings: {
        include: {
          agency: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="py-10 bg-[#F5F8FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <div>
            <span className="bg-[#E8B619] text-black text-[10px] font-black uppercase px-3 py-1 rounded-full">
              STUDIO MULTI-SITE DASHBOARD
            </span>
            <h1 className="text-3xl font-black text-[#111111] mt-2">Ar. Rajesh Sharma Studio</h1>
            <p className="text-gray-500 text-xs mt-1">Aura Architecture & Design Studio • Baner, Pune</p>
          </div>

          <Link
            href="/bookings/new"
            className="bg-[#E8B619] hover:bg-[#D4A512] text-black font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" /> Book New Handover Site
          </Link>
        </div>

        {/* Studio Active Sites Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-[#111111] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#E8B619]" /> Active Design Sites ({projects.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => {
              const activeBooking = proj.bookings[0];
              return (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#E8B619] shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-[#111111] bg-gray-100 px-3 py-1 rounded-md">
                        {proj.projectCode}
                      </span>
                      <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                        Stage: {proj.stage}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-[#111111]">{proj.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E8B619]" /> {proj.locationAddress}, {proj.city}
                    </p>

                    {activeBooking && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Assigned Team:</span>
                          <span className="font-bold text-black flex items-center gap-1">
                            Kleanzo Certified Professional Crew <ShieldCheck className="w-3.5 h-3.5 text-[#E8B619]" />
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Scheduled Date:</span>
                          <span className="font-bold text-black">{activeBooking.scheduledDate} ({activeBooking.scheduledTime})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Cleaning Status:</span>
                          <span className="font-black text-amber-600 uppercase">{activeBooking.status}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <Link
                      href={`/projects/${proj.id}`}
                      className="font-extrabold text-black hover:text-[#E8B619] flex items-center gap-1"
                    >
                      Track Project Timeline <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/bookings/new"
                      className="bg-gray-100 hover:bg-gray-200 text-black font-extrabold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Book Again
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
