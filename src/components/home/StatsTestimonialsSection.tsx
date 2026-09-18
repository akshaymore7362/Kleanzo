'use client';

import React from 'react';
import { Star, FileText, MapPin, ThumbsUp } from 'lucide-react';

export function StatsTestimonialsSection() {
  return (
    <section className="py-12 bg-white border-t border-gray-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left 4 Stats Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center divide-x-0 sm:divide-x divide-gray-200">
            <div className="p-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#E8B619] border border-amber-200 mx-auto flex items-center justify-center mb-2">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-[#111111]">1,250+</div>
              <div className="text-xs text-gray-500 font-semibold mt-0.5">Projects Completed</div>
            </div>

            <div className="p-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#E8B619] border border-amber-200 mx-auto flex items-center justify-center mb-2">
                <Star className="w-5 h-5 fill-[#E8B619]" />
              </div>
              <div className="text-2xl font-black text-[#111111]">4.8/5</div>
              <div className="text-xs text-gray-500 font-semibold mt-0.5">Average Rating</div>
            </div>

            <div className="p-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#E8B619] border border-amber-200 mx-auto flex items-center justify-center mb-2">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-[#111111]">50+</div>
              <div className="text-xs text-gray-500 font-semibold mt-0.5">Cities / Areas</div>
            </div>

            <div className="p-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#E8B619] border border-amber-200 mx-auto flex items-center justify-center mb-2">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-[#111111]">98%</div>
              <div className="text-xs text-gray-500 font-semibold mt-0.5">Client Satisfaction</div>
            </div>
          </div>

          {/* Right Testimonials Quote Card */}
          <div className="lg:col-span-5 bg-[#F5F8FA] rounded-3xl p-6 border border-gray-200 shadow-sm flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80"
              alt="Priya Sharma"
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md shrink-0"
            />
            <div>
              <p className="text-xs text-gray-700 italic font-medium leading-relaxed">
                "Kleanzo made our interior handover so easy! The team was professional, on time and the results were amazing. Highly recommended for all designers."
              </p>
              <div className="mt-2 text-xs font-black text-[#111111]">
                — Priya Sharma <span className="text-gray-500 font-normal">• Interior Designer, Pune</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
