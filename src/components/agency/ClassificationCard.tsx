'use client';

import React from 'react';
import { Star } from 'lucide-react';

export default function ClassificationCard({ agency }: any) {
  return (
    <div className="bg-[#FFFDF0] rounded-3xl p-6 border border-[#FDE047] shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#FACC15] flex items-center justify-center text-black shrink-0 shadow-2xs">
            <Star className="w-4 h-4 fill-black text-black" />
          </div>
          <span className="text-xs font-black text-black uppercase tracking-wider">Partner Classification</span>
        </div>

        <h4 className="text-lg font-black text-black">Preferred Partner</h4>
        <p className="text-xs text-gray-600 font-medium mt-1 leading-relaxed">
          Keep up the good work! You're on the way to High-volume.
        </p>
      </div>

      <div className="mt-6">
        <div className="h-2.5 w-full bg-gray-200/80 rounded-full overflow-hidden">
          <div className="h-full bg-[#FACC15] rounded-full" style={{ width: `75%` }} />
        </div>
      </div>
    </div>
  );
}

