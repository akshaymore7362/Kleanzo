'use client';

import React from 'react';
import { User, FileText, Users, Briefcase, UserCheck, ShieldCheck, IndianRupee, ArrowRight, HelpCircle } from 'lucide-react';

const NODES = [
  { icon: User, label: 'Customer', desc: 'Searches & books through Kleanzo' },
  { icon: FileText, label: 'Kleanzo', desc: 'Booking & Payment (100% Kleanzo branded)' },
  { icon: Users, label: 'Kleanzo', desc: 'Assigns Job to Partner' },
  { icon: Briefcase, label: 'Partner', desc: 'Executes Cleaning (Your team & equipment)' },
  { icon: UserCheck, label: 'Supervisor QC', desc: 'Quality check & before/after photos' },
  { icon: ShieldCheck, label: 'Customer Approval', desc: 'Confirms completion in app' },
  { icon: IndianRupee, label: 'Partner Payment', desc: 'Fixed payout (same day)' },
];

export default function PartnerModelTimeline() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-black">Partner Model</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Simple process. More customers. Steady income.</p>
        </div>

        <button className="bg-[#FEF08A] hover:bg-[#FDE047] text-black font-extrabold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition self-start sm:self-auto border border-[#FDE047]">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>How It Works?</span>
        </button>
      </div>

      {/* Process Nodes Horizontal Flow */}
      <div className="flex items-center justify-between overflow-x-auto py-2">
        {NODES.map((n, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center text-center min-w-[110px] px-1">
              <div className="w-12 h-12 rounded-full bg-[#FACC15] flex items-center justify-center text-black mb-2 shadow-2xs">
                <n.icon className="w-5 h-5" />
              </div>
              <div className="text-xs font-black text-black">{n.label}</div>
              <div className="text-[10px] text-gray-500 font-bold leading-tight mt-1 max-w-[110px]">{n.desc}</div>
            </div>

            {i < NODES.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 mx-1 mb-4" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

