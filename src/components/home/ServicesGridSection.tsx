'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Sparkles, Check, ShieldCheck, Clock } from 'lucide-react';

export function ServicesGridSection() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'HOME' | 'KITCHEN_BATH' | 'SPECIAL'>('ALL');

  const allServices = [
    {
      id: 'srv-1',
      title: 'Full Home Deep Cleaning',
      subtitle: 'Includes living, bedrooms, kitchen, bathrooms & balcony scrubbing',
      price: 4499,
      originalPrice: 5999,
      rating: '4.9',
      reviews: '2,840',
      duration: '5 - 6 Hours',
      category: 'HOME',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      highlights: ['Mechanized floor single-disc scrubbing', 'Sanitization of all doors & windows', 'Cabinet & wardrobe dusting'],
      badge: 'POPULAR CHOICE',
    },
    {
      id: 'srv-2',
      title: 'Kitchen Intense Deep Cleaning',
      subtitle: 'Complete grease removal, tile degreasing & chimney filter steam clean',
      price: 999,
      originalPrice: 1499,
      rating: '4.8',
      reviews: '1,950',
      duration: '2 - 3 Hours',
      category: 'KITCHEN_BATH',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      highlights: ['Heavy food-grade degreaser chemical', 'Appliance exterior & stove cleaning', 'Grout line stain extraction'],
      badge: 'BESTSELLER',
    },
    {
      id: 'srv-3',
      title: 'Bathroom Disinfection & Scale Removal',
      subtitle: 'Limescale removal from fittings, glass shower partition & tile buffing',
      price: 799,
      originalPrice: 1199,
      rating: '4.9',
      reviews: '1,420',
      duration: '1.5 - 2 Hours',
      category: 'KITCHEN_BATH',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      highlights: ['Hard water stain removal', 'Acid-free tile scrubbing', 'WC & washbasin deep sanitization'],
      badge: 'TOP RATED',
    },
    {
      id: 'srv-4',
      title: 'Window & Balcony Deep Cleaning',
      subtitle: 'High-access glass cleaning, frame dust extraction & track vacuuming',
      price: 699,
      originalPrice: 999,
      rating: '4.7',
      reviews: '890',
      duration: '1.5 Hours',
      category: 'SPECIAL',
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
      highlights: ['Streak-free glass squeegee polish', 'Sliding window track cleaning', 'Railing & grill wipe down'],
      badge: 'QUICK CLEAN',
    },
    {
      id: 'srv-5',
      title: 'Sofa & Carpet Upholstery Sanitization',
      subtitle: 'Hot-water extraction shampooing for fabric sofas, chairs & rugs',
      price: 1199,
      originalPrice: 1699,
      rating: '4.9',
      reviews: '1,120',
      duration: '2 Hours',
      category: 'SPECIAL',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      highlights: ['Deep fabric foam extraction', 'Allergen & pet hair removal', 'Fast drying technology'],
      badge: 'HYGIENE SHIELD',
    },
    {
      id: 'srv-6',
      title: 'Villa & Duplex Handover Cleaning',
      subtitle: 'Heavy duty post-civil renovation cleaning for multi-floor luxury homes',
      price: 7999,
      originalPrice: 10499,
      rating: '5.0',
      reviews: '460',
      duration: '8 - 10 Hours',
      category: 'HOME',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      highlights: ['Dedicated supervisor team', 'Paint & glue spot removal', 'Italian marble pH polishing'],
      badge: 'PREMIUM VILLA',
    },
  ];

  const filteredServices = activeTab === 'ALL' ? allServices : allServices.filter((s) => s.category === activeTab);

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header + Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-black bg-[#E8B619] px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> OUR POPULAR SERVICES
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#111111] mt-3 tracking-tight">
              Top Rated Cleaning Packages
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl">
              Handled by background-verified teams using specialized non-acidic chemicals and high-pressure machines.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-1 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'ALL' ? 'bg-[#E8B619] text-black shadow-md' : 'text-gray-600 hover:text-black'
              }`}
            >
              All Packages
            </button>
            <button
              onClick={() => setActiveTab('HOME')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'HOME' ? 'bg-[#E8B619] text-black shadow-md' : 'text-gray-600 hover:text-black'
              }`}
            >
              Full Home
            </button>
            <button
              onClick={() => setActiveTab('KITCHEN_BATH')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'KITCHEN_BATH' ? 'bg-[#E8B619] text-black shadow-md' : 'text-gray-600 hover:text-black'
              }`}
            >
              Kitchen & Bath
            </button>
            <button
              onClick={() => setActiveTab('SPECIAL')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'SPECIAL' ? 'bg-[#E8B619] text-black shadow-md' : 'text-gray-600 hover:text-black'
              }`}
            >
              Sofa & Glass
            </button>
          </div>
        </div>

        {/* Beautiful Service Cards Grid (3 Columns for Large Sharp Visual Impact) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-200 hover:border-[#E8B619] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                {/* Clear High-Definition Image Box */}
                <div className="relative h-60 w-full overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Badge */}
                  <span className="absolute top-4 left-4 bg-[#E8B619] text-black text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                    {service.badge}
                  </span>

                  {/* Rating Pill */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-full border border-gray-700 flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 text-[#E8B619] fill-[#E8B619]" />
                    <span>{service.rating}</span>
                    <span className="text-gray-400 font-normal text-[10px]">({service.reviews})</span>
                  </div>

                  {/* Price Tag Overlay on Image */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                    <div>
                      <span className="text-xs text-amber-300 font-bold block uppercase tracking-wider">Starting Price</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white">₹{service.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-300 line-through">₹{service.originalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#E8B619]" /> {service.duration}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-[#111111] group-hover:text-[#92400E] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">
                      {service.subtitle}
                    </p>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    {service.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-700 font-semibold">
                        <Check className="w-4 h-4 text-[#E8B619] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 pt-0">
                <Link
                  href="/bookings/new"
                  className="w-full bg-[#E8B619] hover:bg-[#D4A512] text-black font-black text-xs py-3.5 rounded-xl shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-lg"
                >
                  Book This Package <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA Footer */}
        <div className="text-center pt-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-black text-black hover:text-[#92400E] bg-white px-8 py-3.5 rounded-full border border-gray-300 hover:border-[#E8B619] shadow-sm transition-all uppercase tracking-wider"
          >
            Explore All 15+ Cleaning Services <ArrowRight className="w-4 h-4 text-[#E8B619]" />
          </Link>
        </div>

      </div>
    </section>
  );
}
