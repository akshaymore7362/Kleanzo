'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Sparkles, Check, Clock } from 'lucide-react';

export function ServicesGridSection() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'RESIDENTIAL' | 'SPECIALIZED' | 'COMMERCIAL'>('ALL');

  const allServices = [
    {
      id: 'srv-1bhk',
      title: '1 BHK Deep Cleaning',
      subtitle: 'Complete deep cleaning for 1 BHK apartment, living, kitchen & bath',
      price: 2499,
      originalPrice: 3499,
      rating: '4.8',
      reviews: '1,450',
      duration: '3 - 4 Hours',
      category: 'RESIDENTIAL',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      highlights: ['Living room & bedroom scrubbing', 'Kitchen & bath deep clean', 'Window glass polish'],
      badge: 'POPULAR',
    },
    {
      id: 'srv-2bhk',
      title: '2 BHK Deep Cleaning',
      subtitle: 'Thorough deep clean for 2 BHK home with mechanized floor scrubbing',
      price: 3499,
      originalPrice: 4499,
      rating: '4.9',
      reviews: '2,120',
      duration: '4 - 5 Hours',
      category: 'RESIDENTIAL',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      highlights: ['Deep floor single-disc scrubbing', 'Cabinet & wardrobe dusting', 'Balcony & tile wash'],
      badge: 'BESTSELLER',
    },
    {
      id: 'srv-3bhk',
      title: '3 BHK Deep Cleaning',
      subtitle: 'Full home intense deep cleaning with non-acidic chemical care',
      price: 4499,
      originalPrice: 5999,
      rating: '4.9',
      reviews: '2,840',
      duration: '5 - 6 Hours',
      category: 'RESIDENTIAL',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
      highlights: ['Intense floor & grout scrubbing', 'Sanitization of all doors & windows', 'Hard stain extraction'],
      badge: 'TOP CHOICE',
    },
    {
      id: 'srv-4bhk',
      title: '4 BHK / Villa Cleaning',
      subtitle: 'Heavy duty cleaning for multi-floor luxury homes & large villas',
      price: 7999,
      originalPrice: 9999,
      rating: '5.0',
      reviews: '860',
      duration: '7 - 8 Hours',
      category: 'RESIDENTIAL',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      highlights: ['Dedicated supervisor team', 'Italian marble pH polishing', 'Multi-balcony deep wash'],
      badge: 'PREMIUM VILLA',
    },
    {
      id: 'srv-kitchen',
      title: 'Kitchen Deep Cleaning',
      subtitle: 'Grease removal, tile degreasing & chimney filter steam clean',
      price: 999,
      originalPrice: 1499,
      rating: '4.8',
      reviews: '1,950',
      duration: '2 - 3 Hours',
      category: 'SPECIALIZED',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      highlights: ['Heavy food-grade degreaser chemical', 'Appliance exterior & stove clean', 'Grout line stain extraction'],
      badge: 'MUST HAVE',
    },
    {
      id: 'srv-bathroom',
      title: 'Bathroom Deep Cleaning',
      subtitle: 'Limescale removal from fittings, glass shower partition & tile buffing',
      price: 799,
      originalPrice: 1199,
      rating: '4.9',
      reviews: '1,420',
      duration: '1.5 - 2 Hours',
      category: 'SPECIALIZED',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      highlights: ['Hard water stain removal', 'Acid-free tile scrubbing', 'WC & washbasin sanitization'],
      badge: 'HYGIENE SHIELD',
    },
    {
      id: 'srv-sofa',
      title: 'Sofa Cleaning',
      subtitle: 'Hot-water extraction shampooing for fabric & leather sofas',
      price: 1199,
      originalPrice: 1699,
      rating: '4.9',
      reviews: '1,120',
      duration: '2 Hours',
      category: 'SPECIALIZED',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      highlights: ['Deep fabric foam extraction', 'Allergen & stain removal', 'Fast drying tech'],
      badge: 'SPARKLING',
    },
    {
      id: 'srv-carpet',
      title: 'Carpet Cleaning',
      subtitle: 'Deep rug & carpet shampooing with dust extraction',
      price: 899,
      originalPrice: 1299,
      rating: '4.8',
      reviews: '740',
      duration: '1.5 Hours',
      category: 'SPECIALIZED',
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80',
      highlights: ['High-suction vacuuming', 'Stain lifting chemical wash', 'Odor neutralization'],
      badge: 'FRESHNESS',
    },
    {
      id: 'srv-post-const',
      title: 'Post-Construction Cleaning',
      subtitle: 'Debris, cement marks, paint spots & fine dust removal for new builds',
      price: 6999,
      originalPrice: 8999,
      rating: '4.9',
      reviews: '920',
      duration: '6 - 8 Hours',
      category: 'COMMERCIAL',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      highlights: ['Paint & glue spot scraping', 'Heavy dust extraction', 'Full handover prep'],
      badge: 'CONSTRUCTION',
    },
    {
      id: 'srv-comm-handover',
      title: 'Commercial Handover Cleaning',
      subtitle: 'Office, showroom & retail space post-fitout deep clean',
      price: 7499,
      originalPrice: 9999,
      rating: '5.0',
      reviews: '610',
      duration: '6 - 8 Hours',
      category: 'COMMERCIAL',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      highlights: ['Glass panel streak-free polish', 'Office floor buffing', 'Ready-to-occupy certificate'],
      badge: 'COMMERCIAL',
    },
  ];

  const filteredServices = activeTab === 'ALL' ? allServices : allServices.filter((s) => s.category === activeTab);

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header + Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-black bg-[#FACC15] px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 fill-black" /> OUR POPULAR SERVICES
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#111111] mt-3 tracking-tight">
              Kleanzo Certified Cleaning Packages
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl font-medium">
              Executed by background-verified partner agencies using non-acidic chemicals, single-disc scrubbers, and supervisor quality control.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-1 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'ALL' ? 'bg-[#FACC15] text-black shadow-sm' : 'text-gray-600 hover:text-black'
              }`}
            >
              All 10 Packages
            </button>
            <button
              onClick={() => setActiveTab('RESIDENTIAL')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'RESIDENTIAL' ? 'bg-[#FACC15] text-black shadow-sm' : 'text-gray-600 hover:text-black'
              }`}
            >
              Residential
            </button>
            <button
              onClick={() => setActiveTab('SPECIALIZED')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'SPECIALIZED' ? 'bg-[#FACC15] text-black shadow-sm' : 'text-gray-600 hover:text-black'
              }`}
            >
              Specialized
            </button>
            <button
              onClick={() => setActiveTab('COMMERCIAL')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'COMMERCIAL' ? 'bg-[#FACC15] text-black shadow-sm' : 'text-gray-600 hover:text-black'
              }`}
            >
              Commercial
            </button>
          </div>
        </div>

        {/* Service Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-200 hover:border-[#FACC15] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Box */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badge */}
                  <span className="absolute top-4 left-4 bg-[#FACC15] text-black text-[10px] font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {service.badge}
                  </span>

                  {/* Rating Pill */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-full border border-gray-700 flex items-center gap-1 shadow-md">
                    <Star className="w-3.5 h-3.5 text-[#FACC15] fill-[#FACC15]" />
                    <span>{service.rating}</span>
                    <span className="text-gray-400 font-normal text-[10px]">({service.reviews})</span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                    <div>
                      <span className="text-[10px] text-amber-300 font-extrabold block uppercase tracking-wider">Kleanzo Price</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white">₹{service.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-300 line-through">₹{service.originalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-white">
                      <Clock className="w-3 h-3 text-[#FACC15]" /> {service.duration}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-[#111111] group-hover:text-amber-800 transition-colors">
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
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
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
                  className="w-full bg-[#FACC15] hover:bg-[#EAB308] text-black font-black text-xs py-3.5 rounded-xl shadow-sm transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  Book This Package <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
