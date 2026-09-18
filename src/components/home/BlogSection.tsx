'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Tag, User, Sparkles, Eye, X, Share2, ThumbsUp, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: 'Marble Care' | 'Post-Construction' | 'Kitchen & Bath' | 'Commercial';
  author: string;
  authorRole: string;
  readTime: string;
  date: string;
  image: string;
  views: string;
  likes: number;
  featured?: boolean;
  sections: {
    heading: string;
    body: string;
    keyTakeaway?: string;
  }[];
}

export function BlogSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeFullPost, setActiveFullPost] = useState<BlogPost | null>(null);

  const posts: BlogPost[] = [
    {
      id: 'blog-1',
      title: '5 Costly Mistakes to Avoid When Cleaning Italian Marble Floors',
      subtitle: 'Why standard floor cleaners damage luxury stone and how pH-neutral chemistry preserves 100% mirror polish.',
      excerpt: 'Using acidic toilet cleaners or harsh floor scrubbers can etch expensive Italian marble permanently. Learn how neutral pH solvents preserve polish.',
      category: 'Marble Care',
      author: 'Vikram Mehta',
      authorRole: 'Master Stone Care Specialist',
      readTime: '5 min read',
      date: 'May 18, 2025',
      views: '3.4k',
      likes: 284,
      featured: true,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      sections: [
        {
          heading: '1. The Acid Reactivity Trap (Vinegar, Lemon & Acidic Cleaners)',
          body: 'Italian marble, Botticino, and Travertine are calcitic stones containing over 90% calcium carbonate. When acidic cleaners (even natural acids like vinegar or lemon juice) contact the stone, a chemical reaction occurs that dissolves the calcium crystals, leaving dull white acid-etch marks that require expensive re-diamond polishing.',
          keyTakeaway: 'Rule #1: Never use acidic toilet cleaners or vinegar solutions on natural stone.',
        },
        {
          heading: '2. Using Abrasive Metal Scouring Pads for Post-Civil Paint Splatters',
          body: 'After home renovation, paint splatters and Fevicol glue drips are common on marble floors. Scrubbing them with wire mesh or green abrasive pads creates microscopic scratches that permanently destroy the mirror finish.',
          keyTakeaway: 'Rule #2: Use plastic putty blades with micro-emulsifying solvent sprays.',
        },
        {
          heading: '3. Ignoring Stone Sealing & Hydrophobic Protection',
          body: 'Marble is naturally porous. Without a penetrating fluorochemical sealer, spilled coffee, wine, or oil absorbs deep into the stone matrix within 15 minutes, causing permanent yellow discolouration.',
          keyTakeaway: 'Rule #3: Apply a breathable impregnating sealer every 12 to 18 months.',
        },
        {
          heading: '4. Kleanzo Recommended Marble Maintenance Routine',
          body: 'For daily maintenance, use a damp microfiber mop with warm water and a neutral pH stone cleaner (pH 7.0). For deep cleaning, book Kleanzo single-disc polishing with non-scratch diamond pads.',
        },
      ],
    },
    {
      id: 'blog-2',
      title: 'Ultimate Post-Construction Cleaning Checklist Before Interior Handover',
      excerpt: 'A comprehensive step-by-step guide for architects, interior designers, and homeowners before moving into a newly renovated flat.',
      subtitle: 'How professional teams extract fine gypsum dust, grout haze, and silicone caulking before client walkthroughs.',
      category: 'Post-Construction',
      author: 'Ananya Roy',
      authorRole: 'Lead Interior Handover Auditor',
      readTime: '7 min read',
      date: 'May 12, 2025',
      views: '4.1k',
      likes: 340,
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      sections: [
        {
          heading: 'Phase 1: Dry Dust Extraction & High-Reach Cleaning',
          body: 'Civil construction generates ultra-fine silica and plaster dust that settles in AC ducts, ceiling cornices, and modular cabinet drawers. Before applying any liquid cleaner, HEPA vacuum extraction must be performed on all high surfaces to prevent mud formation.',
        },
        {
          heading: 'Phase 2: Paint, Glue & Grout Spot Stripping',
          body: 'Windows, sliding glass doors, and bathroom mirrors often have hardened masking tape residue, silicone caulk, and cement grout splatters. Specialized solvent degreasers are applied to loosen the polymer bonds without scratching glass or powder-coated aluminum tracks.',
        },
        {
          heading: 'Phase 3: Mechanized Single-Disc Scrubbing & Wet Extraction',
          body: 'Floors are scrubbed using single-disc rotary machines fitted with soft nylon brushes to lift ground-in dirt from tile grout lines. Wet industrial vacuums instantly suck up slurry, leaving surfaces dry and spotless.',
        },
      ],
    },
    {
      id: 'blog-3',
      title: 'How to Degrease Heavy Oil Stains from Kitchen Chimney & Tiles',
      excerpt: 'Tough grease buildup requires specialized alkaline foam emulsifiers. Discover our professional deep cleaning techniques.',
      subtitle: 'Eliminate carbonized grease and oil film using food-safe alkaline foam and high-pressure steam.',
      category: 'Kitchen & Bath',
      author: 'Suresh Patil',
      authorRole: 'Senior Hygiene Technician',
      readTime: '4 min read',
      date: 'Apr 28, 2025',
      views: '2.9k',
      likes: 198,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80',
      sections: [
        {
          heading: 'Why Regular Soap Water Fails on Kitchen Chimney Baffle Filters',
          body: 'Cooking oils undergo thermal polymerization when exposed to high heat over months. This creates a sticky, rubberized oil film on chimney filters, kitchen tile grout, and gas stoves that standard dish soap cannot dissolve.',
        },
        {
          heading: 'The 2-Step Alkaline Foam & Steam Extraction Process',
          body: 'Step 1: Apply heavy-duty food-grade alkaline foam emulsifier and allow 15 minutes dwelling time to break down oil bonds. Step 2: Rinse with 90°C high-pressure steam to flush out trapped grease from interior baffle channels.',
        },
      ],
    },
    {
      id: 'blog-4',
      title: 'Commercial Office Hygiene: Why Deep Cleaning Improves Productivity',
      excerpt: 'Deep sanitizing office carpets, workstation desks, and air vents reduces sick leaves and enhances workplace aesthetics.',
      subtitle: 'Create a healthier, dust-free corporate environment with hot-water carpet extraction and HVAC duct sanitization.',
      category: 'Commercial',
      author: 'Priya Sharma',
      authorRole: 'Corporate Workplace Auditor',
      readTime: '6 min read',
      date: 'Apr 15, 2025',
      views: '5.2k',
      likes: 412,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      sections: [
        {
          heading: 'The Hidden Dirt Traps in Corporate Offices',
          body: 'Fabric ergonomic chairs, carpet tiles, and air conditioning returns harbor high concentrations of dust mites and allergens. Regular daily sweeping only redistributes fine dust into the indoor air column.',
        },
        {
          heading: 'Hot-Water Extraction Cleaning for Workstation Carpets & Chairs',
          body: 'Hot-water extraction injects heated eco-friendly detergent deep into carpet fibers and immediately vacuums up suspended dirt and bacteria, drying within 3 hours.',
        },
      ],
    },
  ];

  const categories = ['All', 'Marble Care', 'Post-Construction', 'Kitchen & Bath', 'Commercial'];

  const filteredPosts = selectedCategory === 'All' ? posts : posts.filter((p) => p.category === selectedCategory);

  return (
    <section className="py-20 bg-white border-t border-gray-150 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-black bg-[#E8B619] px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-sm">
              <BookOpen className="w-4 h-4 text-black" /> EXPERT CLEANING GUIDES & BLOG
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#111111] mt-3 tracking-tight">
              Cleaning Tips & Case Studies
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl">
              Discover professional surface care guides, stain removal chemistry secrets, and post-construction handover advice from Kleanzo specialists.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#E8B619] text-black shadow-md ring-2 ring-[#E8B619]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* BORDERLESS SLEEK UNIQUE BLOG CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setActiveFullPost(post)}
              className="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1.5"
            >
              <div>
                {/* Borderless Image Container with Gradient Fade */}
                <div className="relative h-60 w-full overflow-hidden rounded-3xl">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-[#E8B619] text-[10px] font-black px-3 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-md">
                    <Tag className="w-3 h-3" /> {post.category}
                  </span>

                  {post.featured && (
                    <span className="absolute top-4 right-4 bg-[#E8B619] text-black text-[10px] font-black px-3 py-1 rounded-full shadow-md animate-pulse">
                      FEATURED GUIDE
                    </span>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white text-[11px] font-bold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#E8B619]" /> {post.readTime}
                    </span>
                    <span className="flex items-center gap-1 bg-black/50 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                      <Eye className="w-3 h-3 text-amber-300" /> {post.views} views
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="py-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-extrabold">
                    <User className="w-3.5 h-3.5 text-[#E8B619]" />
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="text-lg font-black text-[#111111] group-hover:text-[#92400E] transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 font-medium">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#92400E] group-hover:translate-x-1.5 transition-transform flex items-center gap-1.5">
                  Read Full Article <ArrowRight className="w-4 h-4 text-[#E8B619]" />
                </span>
                <span className="text-gray-400 font-bold flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5 text-amber-500" /> {post.likes}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ================= FULL PAGE ARTICLE READER OVERLAY (NO BORDER, NO CUTOFF) ================= */}
        {activeFullPost && (
          <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-fade-in font-sans text-gray-800">
            
            {/* Top Sticky Navigation Bar */}
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-xs">
              <button
                onClick={() => setActiveFullPost(null)}
                className="flex items-center gap-2 text-xs font-black text-black hover:text-[#92400E] bg-gray-100 px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Guides
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert('Thanks for liking this article!')}
                  className="bg-amber-100 hover:bg-amber-200 text-[#92400E] font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-4 h-4" /> Like ({activeFullPost.likes})
                </button>
                <Link
                  href="/bookings/new"
                  onClick={() => setActiveFullPost(null)}
                  className="bg-[#E8B619] hover:bg-[#D4A512] text-black font-black text-xs px-6 py-2 rounded-xl shadow-md uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  Book Service <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setActiveFullPost(null)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-black flex items-center justify-center font-bold transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* FULL ARTICLE BODY */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
              
              {/* Category & Title */}
              <div className="space-y-4 text-center sm:text-left">
                <span className="bg-[#E8B619] text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
                  {activeFullPost.category}
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight leading-tight">
                  {activeFullPost.title}
                </h1>
                <p className="text-base sm:text-lg font-semibold text-gray-600 leading-relaxed">
                  {activeFullPost.subtitle}
                </p>

                {/* Author Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-b border-gray-100 py-3 text-xs text-gray-500 font-bold">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8B619] text-black font-black flex items-center justify-center text-sm">
                      {activeFullPost.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-extrabold text-black text-sm">{activeFullPost.author}</p>
                      <p className="text-[11px] text-[#92400E]">{activeFullPost.authorRole}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-400">
                    <span>Published: <strong className="text-black">{activeFullPost.date}</strong></span>
                    <span>•</span>
                    <span><Clock className="w-3.5 h-3.5 inline text-[#E8B619]" /> {activeFullPost.readTime}</span>
                    <span>•</span>
                    <span><Eye className="w-3.5 h-3.5 inline text-amber-500" /> {activeFullPost.views} views</span>
                  </div>
                </div>
              </div>

              {/* FULL SEAMLESS HERO IMAGE (NO BOX, NO BORDER) */}
              <div className="relative h-80 sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={activeFullPost.image}
                  alt={activeFullPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* ARTICLE SECTIONS CONTENT */}
              <div className="space-y-8 text-base text-gray-700 leading-relaxed font-normal">
                {activeFullPost.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-black text-[#111111]">
                      {sec.heading}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {sec.body}
                    </p>
                    {sec.keyTakeaway && (
                      <div className="p-4 bg-[#FAF7ED] rounded-2xl border-l-4 border-[#E8B619] text-xs font-black text-[#92400E] flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#E8B619] shrink-0" />
                        <span>{sec.keyTakeaway}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* FOOTER CTA BANNER */}
              <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-2xl relative overflow-hidden">
                <div className="max-w-xl mx-auto space-y-3">
                  <span className="text-xs font-black uppercase text-[#E8B619] tracking-widest bg-white/10 px-3 py-1 rounded-full">
                    KLEANZO PROFESSIONAL FULFILLMENT
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black">
                    Need Professional Deep Cleaning for Your Home?
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Book our background-verified teams equipped with neutral stone care chemicals & high-pressure steam washers.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/bookings/new"
                      onClick={() => setActiveFullPost(null)}
                      className="inline-flex items-center gap-2 bg-[#E8B619] hover:bg-[#D4A512] text-black font-black text-xs px-8 py-4 rounded-xl shadow-lg transition-all uppercase tracking-wider cursor-pointer"
                    >
                      Book Your Cleaning Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
