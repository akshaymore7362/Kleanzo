'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Check, ArrowRight } from 'lucide-react';

const STEPS = [
  { no: 1, title: 'Basic Details' },
  { no: 2, title: 'Mobile OTP' },
  { no: 3, title: 'KYC', sub: '(Aadhaar + PAN + Photo)' },
  { no: 4, title: 'Business & Operations' },
  { no: 5, title: 'Agreement & Activation' },
];

export default function OnboardingBanner({ agency }: any) {
  const currentStep = 1;

  const checklist = [
    // Column 1
    { label: 'Agency / Owner details', done: true },
    { label: 'Mobile number + OTP verification', done: true },
    { label: 'Aadhaar upload + verification', done: true },
    { label: 'PAN upload + verification', done: true },

    // Column 2
    { label: 'Profile / Owner photo upload', done: true },
    { label: 'Office address', done: false, optional: true },
    { label: 'Bank / payment details', done: true },
    { label: 'Service areas', done: true },

    // Column 3
    { label: 'Teams / workers', done: true },
    { label: 'Equipment', done: true },
    { label: 'Services offered', done: true },
    { label: 'Partner agreement', done: true },
  ];

  return (
    <div className="bg-[#FFFDF0] rounded-3xl p-6 border border-[#FDE047] shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#FEF08A]">
        {/* Left: Icon & Text & Progress */}
        <div className="flex items-start gap-4 max-w-md">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#FACC15] flex items-center justify-center text-black shadow-sm">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-black leading-tight">Complete Partner Onboarding</h2>
            <p className="text-xs text-gray-600 font-medium mt-1">
              Finish your onboarding to start receiving job requests and grow with Kleanzo.
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="h-2.5 w-48 bg-gray-200/80 rounded-full overflow-hidden">
                <div className="h-full bg-[#FACC15] rounded-full" style={{ width: `60%` }} />
              </div>
              <span className="text-xs font-black text-gray-700">60% Completed</span>
            </div>
          </div>
        </div>

        {/* Center: Steps 1 to 5 */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-2">
          {STEPS.map((s, idx) => {
            const isDone = s.no < currentStep;
            const isCurrent = s.no === currentStep;

            return (
              <React.Fragment key={s.no}>
                <div className="flex flex-col items-center text-center min-w-[75px]">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isCurrent
                        ? 'bg-[#FACC15] text-black shadow-sm ring-4 ring-[#FEF08A]'
                        : isDone
                        ? 'bg-[#059669] text-white'
                        : 'bg-white border-2 border-gray-300 text-gray-500'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : s.no}
                  </div>
                  <span className="text-[10px] font-bold text-gray-800 mt-1.5 leading-tight">{s.title}</span>
                  {s.sub && <span className="text-[8px] font-medium text-gray-500 leading-none mt-0.5">{s.sub}</span>}
                </div>

                {idx < STEPS.length - 1 && (
                  <div className="w-6 sm:w-10 h-0.5 bg-gray-200 shrink-0 self-start mt-4" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Buttons */}
        <div className="flex flex-row lg:flex-col gap-2 shrink-0">
          <Link
            href="/agency/onboarding"
            className="bg-[#FACC15] hover:bg-[#EAB308] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            Continue Onboarding <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-extrabold text-xs px-5 py-2.5 rounded-xl transition">
            Save & Continue Later
          </button>
        </div>
      </div>

      {/* Bottom Checklist */}
      <div className="pt-5">
        <h4 className="text-xs font-black text-black uppercase tracking-wider mb-3">Onboarding Requirements</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2.5">
          {checklist.map((c, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-bold">
              {c.done ? (
                <div className="w-4 h-4 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5" />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0 text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                </div>
              )}
              <span className={c.done ? 'text-gray-800' : 'text-gray-500'}>
                {c.label}
                {c.optional && (
                  <span className="ml-1.5 text-[10px] font-normal text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded-md">
                    Optional
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

