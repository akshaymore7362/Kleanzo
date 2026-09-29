'use client';

import React from 'react';
import { Smartphone, ShieldCheck, FileText, UserCheck, MapPin, Landmark, FileSignature, Check, AlertCircle, HelpCircle } from 'lucide-react';

export default function VerificationCenterCard({ agency }: any) {
  const items = [
    { label: 'Mobile OTP', icon: Smartphone, status: 'VERIFIED', action: 'View' },
    { label: 'Aadhaar Upload', icon: ShieldCheck, status: 'VERIFIED', action: 'View' },
    { label: 'PAN Upload', icon: FileText, status: 'VERIFIED', action: 'View' },
    { label: 'Profile Photo', icon: UserCheck, status: 'VERIFIED', action: 'View' },
    { label: 'Office Address', icon: MapPin, status: 'OPTIONAL', action: 'Upload' },
    { label: 'Bank Details', icon: Landmark, status: 'VERIFIED', action: 'View' },
    { label: 'Partner Agreement', icon: FileSignature, status: 'PENDING', action: 'Upload' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base font-black text-black">Verification Center</h3>
        <p className="text-xs text-gray-500 font-medium mt-0.5 mb-5">Manage your documents & verification</p>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 shrink-0">
                  <item.icon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-black">{item.label}</div>
                  {item.status === 'VERIFIED' && (
                    <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified
                    </div>
                  )}
                  {item.status === 'OPTIONAL' && (
                    <div className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-gray-400" /> Optional
                    </div>
                  )}
                  {item.status === 'PENDING' && (
                    <div className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-500" /> Pending
                    </div>
                  )}
                </div>
              </div>

              <button className="text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl border border-gray-200 transition shrink-0">
                {item.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

