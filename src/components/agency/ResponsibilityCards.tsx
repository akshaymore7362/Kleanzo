'use client';

import React from 'react';
import { User, Check, Sparkles } from 'lucide-react';

const PARTNER_ITEMS = [
  { main: 'Cleaners', detail: '(trained & professional)' },
  { main: 'Equipment', detail: '(your own)' },
  { main: 'Transportation', detail: '(to site)' },
  { main: 'Site execution', detail: '(as per SOP)' },
  { main: 'Supervisor', detail: '(quality control)' },
  { main: 'Before/after photos' },
  { main: 'Rework', detail: '(if needed)' },
];

const KLEANZO_ITEMS = [
  { main: 'Marketing & lead generation' },
  { main: 'Customer enquiry & quotation' },
  { main: 'Booking & payment collection' },
  { main: 'Job allocation & coordination' },
  { main: 'Customer support' },
  { main: 'QC monitoring' },
  { main: 'Partner performance tracking' },
];

export default function ResponsibilityCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Box: Partner Responsibilities */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-[#FACC15] flex items-center justify-center text-black shadow-2xs">
            <User className="w-5 h-5" />
          </div>
          <h4 className="text-base font-black text-black">Partner Responsibilities</h4>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
          {PARTNER_ITEMS.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-800">
              <div className="w-4 h-4 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>
                {item.main} {item.detail && <span className="text-gray-500 font-normal">{item.detail}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Box: Kleanzo Responsibilities */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-black text-[#FACC15] font-black text-lg flex items-center justify-center shadow-2xs">
            K
          </div>
          <h4 className="text-base font-black text-black">Kleanzo Responsibilities</h4>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
          {KLEANZO_ITEMS.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-800">
              <div className="w-4 h-4 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>{item.main}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

