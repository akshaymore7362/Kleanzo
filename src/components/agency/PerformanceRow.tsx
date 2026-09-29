'use client';

import React from 'react';
import { Star, Clock, Users, MessageSquare, ShieldCheck, RotateCcw } from 'lucide-react';

export default function PerformanceRow({ agency }: any) {
  const metrics = [
    { label: 'Cleaning Quality', value: '4.5 / 5', icon: Star, caption: 'Good' },
    { label: 'On-time Arrival', value: '92%', icon: Clock, caption: 'On time' },
    { label: 'Staff Behaviour', value: '96%', icon: Users, caption: 'Good' },
    { label: 'Customer Feedback', value: '4.6 / 5', icon: MessageSquare, caption: 'Positive' },
    { label: 'Complaint Rate', value: '2%', icon: ShieldCheck, caption: 'Low' },
    { label: 'Rework Rate', value: '1%', icon: RotateCcw, caption: 'Very Low' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-700 mb-2">
            <m.icon className="w-4 h-4 text-[#FACC15] fill-[#FACC15]" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-500">{m.label}</div>
            <div className="text-xl font-black text-black mt-0.5">{m.value}</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1">{m.caption}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

