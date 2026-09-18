'use client';

import React from 'react';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const reviews = [
    {
      name: 'Priya S.',
      location: 'Wakad, Pune',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      comment: 'Amazing service! The team was punctual, very professional and my home looks brand new.',
    },
    {
      name: 'Rahul M.',
      location: 'Baner, Pune',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      comment: 'Everything was handled so smoothly from booking to cleaning. Highly recommended!',
    },
    {
      name: 'Neha P.',
      location: 'Hinjewadi, Pune',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      comment: 'Great attention to detail and the quality check gives real confidence. Super happy with Kleanzo!',
    },
  ];

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Header */}
        <h2 className="text-3xl font-black text-[#111111] tracking-tight mb-10">
          What Our Customers Say
        </h2>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all text-left space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* 5 Yellow Stars */}
                <div className="flex text-[#E8B619] gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E8B619]" />
                  ))}
                </div>
                
                <p className="text-xs text-gray-700 font-medium leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Avatar & Info */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <img
                  src={rev.image}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h4 className="text-xs font-black text-[#111111]">{rev.name}</h4>
                  <p className="text-[10px] text-gray-500 font-bold">{rev.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
