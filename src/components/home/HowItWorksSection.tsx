'use client';

import React from 'react';
import { Home, FileText, Calendar, Users, Sparkles, ShieldCheck, ThumbsUp, CreditCard } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    { title: 'Tell Us About Your Home', icon: Home },
    { title: 'Get Your Quote', icon: FileText },
    { title: 'Book Your Date & Time', icon: Calendar },
    { title: 'Our Team Arrives', icon: Users },
    { title: 'Deep Cleaning', icon: Sparkles },
    { title: 'Quality Check', icon: ShieldCheck },
    { title: 'You Inspect & Approve', icon: ThumbsUp },
    { title: "Pay Balance & We're Done", icon: CreditCard },
  ];

  return (
    <section className="py-16 bg-[#F8FAFC] text-slate-900 border-t border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Header */}
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-12 font-sans">
          How Kleanzo Works
        </h2>

        {/* 8-Step Stepper Nodes with Dotted Connecting Line */}
        <div className="relative">
          {/* Horizontal Connecting Line behind icons */}
          <div className="hidden lg:block absolute top-6 left-12 right-12 h-0.5 border-t-2 border-dashed border-amber-400 z-0" />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="w-12 h-12 rounded-full bg-[#FACC15] text-black font-black flex items-center justify-center mb-3 shadow-md border-2 border-white group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-800 leading-snug">
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
