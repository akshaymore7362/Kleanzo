'use client';

import React from 'react';
import { Smartphone, ShieldCheck, FileText, UserCheck, Landmark, FileSignature, Check, AlertCircle } from 'lucide-react';
import { maskPhone, maskAadhaar, maskPan, maskAccountNumber } from '@/lib/utils/mask';

export default function ProfileVerificationCard({ agency }: any) {
  const rows = [
    {
      label: 'Mobile Verified',
      icon: Smartphone,
      done: true,
      value: agency?.phone ? maskPhone(agency.phone) : '+91 ********',
    },
    {
      label: 'Aadhaar Verified',
      icon: ShieldCheck,
      done: true,
      value: agency?.aadhaarNumber ? maskAadhaar(agency.aadhaarNumber) : '**** **** ****',
    },
    {
      label: 'PAN Verified',
      icon: FileText,
      done: true,
      value: agency?.panNumber ? maskPan(agency.panNumber) : '********',
    },
    {
      label: 'Photo Added',
      icon: UserCheck,
      done: true,
      value: 'Owner photo uploaded',
    },
    {
      label: 'Bank Details Added',
      icon: Landmark,
      done: true,
      value: 'Account details verified',
    },
    {
      label: 'Agreement',
      icon: FileSignature,
      done: false,
      value: 'Pending >',
      isPending: true,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base font-black text-black">Partner Profile & Verification</h3>
        <p className="text-xs text-gray-500 font-medium mt-0.5 mb-5">Your verification status at a glance</p>

        <div className="space-y-4">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 shrink-0">
                  <r.icon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-black">{r.label}</div>
                  <div className={`text-[11px] font-medium truncate ${r.isPending ? 'text-amber-600 font-bold' : 'text-gray-500'}`}>
                    {r.value}
                  </div>
                </div>
              </div>

              {r.done ? (
                <div className="w-5 h-5 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
              ) : (
                <div className="flex items-center gap-1 text-amber-600 font-bold text-xs shrink-0 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 cursor-pointer">
                  <span>Pending</span>
                  <AlertCircle className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

