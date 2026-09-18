import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { CheckCircle2, Clock, ShieldCheck, Camera, AlertTriangle, Building2, MapPin, ArrowRight } from 'lucide-react';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { OR: [{ id }, { projectCode: id }] },
    include: {
      bookings: {
        include: {
          agency: true,
          beforeAfterMedia: true,
          quote: true,
        },
      },
      customerProfile: true,
    },
  });

  if (!project) {
    notFound();
  }

  const activeBooking = project.bookings[0];

  const timelineSteps = [
    { label: 'Request Submitted', done: true },
    { label: 'Kleanzo Service Confirmed', done: true },
    { label: 'Quote Approved & Paid', done: true },
    { label: 'Cleaning Scheduled', done: true },
    { label: 'In Progress', active: activeBooking?.status === 'IN_PROGRESS' },
    { label: 'Handover Proof Verification', active: activeBooking?.status === 'QUALITY_REVIEW' },
    { label: 'Completed', done: activeBooking?.status === 'COMPLETED' },
  ];

  return (
    <div className="py-10 bg-[#F5F8FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-black text-[#E8B619] text-xs font-black px-3 py-1 rounded-full">
                  {project.projectCode}
                </span>
                <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full">
                  STATUS: {activeBooking?.status || 'IN_PROGRESS'}
                </span>
              </div>
              <h1 className="text-3xl font-black text-[#111111] mt-3">{project.title}</h1>
              <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E8B619]" /> {project.locationAddress}, {project.city}
              </p>
            </div>

            {/* Handover Approval Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> APPROVE HANDOVER COMPLETION
              </button>
              <button
                type="button"
                className="bg-white hover:bg-gray-100 text-rose-700 border border-rose-200 font-extrabold text-xs px-5 py-3.5 rounded-xl transition-colors"
              >
                REQUEST REWORK
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Status Pipeline */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-8">
          <h3 className="font-extrabold text-base text-black mb-6">Live Handover Project Timeline</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {timelineSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-center text-xs font-bold flex flex-col items-center justify-center space-y-2 ${
                  step.done
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : step.active
                    ? 'bg-amber-50 border-[#E8B619] text-black shadow-sm ring-2 ring-[#E8B619]'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                    step.done
                      ? 'bg-emerald-600 text-white'
                      : step.active
                      ? 'bg-[#E8B619] text-black'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {idx + 1}
                </div>
                <span>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Before / After Media Verification Grid */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-lg text-black flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#E8B619]" /> Kleanzo Handover Photo Verification Proof
            </h3>
            <span className="text-xs text-gray-500 font-semibold">Verified by Kleanzo Quality Crew</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBooking?.beforeAfterMedia.map((media) => (
              <div key={media.id} className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                <div className="relative h-64 w-full">
                  <img src={media.imageUrl} alt={media.stage} className="w-full h-full object-cover" />
                  <span
                    className={`absolute top-3 left-3 text-xs font-black px-3 py-1 rounded-full ${
                      media.stage === 'BEFORE' ? 'bg-black text-white' : 'bg-[#E8B619] text-black'
                    }`}
                  >
                    {media.stage} CLEANING PROOF
                  </span>
                </div>
                <div className="p-4 text-xs font-semibold text-gray-700">{media.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
