'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  MessageSquare,
  Building2,
  Users,
  Award,
  Send,
} from 'lucide-react';

export function Footer() {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#0F172A] text-white pt-16 pb-8 border-t-2 border-[#E8B619] relative overflow-hidden font-sans">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#E8B619]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* TOP NEWSLETTER & INSTANT DISCOUNT BANNER */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-6 sm:p-8 border border-[#E8B619]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-black uppercase text-black bg-[#E8B619] px-3 py-0.5 rounded-full inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-black" /> EXCLUSIVE OFFER
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Get ₹500 Off Your First Deep Cleaning
            </h3>
            <p className="text-xs text-gray-400 font-medium">
              Subscribe to get seasonal cleaning checklists, marble care guides, and instant discount vouchers.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center gap-2">
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full sm:w-72 bg-white/10 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#E8B619] transition-all"
            />
            <button
              type="submit"
              className="bg-[#E8B619] hover:bg-[#D4A512] text-black font-black text-xs px-6 py-3 rounded-xl transition-all shadow-md uppercase tracking-wider shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              {subscribed ? 'Subscribed ✓' : 'Subscribe'} <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* MAIN 4 COLUMNS FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-4">
          
          {/* COLUMN 1: BRAND & MISSION (2 COLUMNS SPAN) */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#E8B619] text-black font-black flex items-center justify-center text-2xl shadow-md">
                K
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white leading-none">
                  Kleanzo
                </span>
                <span className="text-[9px] font-black tracking-widest text-[#E8B619] uppercase mt-1">
                  DIRT GONE. SHINE ON.
                </span>
              </div>
            </Link>

            <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-sm">
              Pune's premier tech-enabled deep cleaning platform. Specializing in post-construction handover, Italian marble pH care, kitchen degreasing, and luxury home sanitization with 100% background-verified teams.
            </p>

            {/* Contact Quick Pills */}
            <div className="space-y-2 text-xs font-bold text-gray-300">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#E8B619] hover:underline"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" /> WhatsApp Support: +91 98765 43210
              </a>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4 text-[#E8B619]" /> support@kleanzo.com
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-[#E8B619]" /> Kleanzo HQ: Wakad-Hinjewadi Link Road, Pune - 411057
              </div>
            </div>
          </div>

          {/* COLUMN 2: POPULAR SERVICES */}
          <div className="space-y-3 text-xs">
            <h4 className="font-black text-sm uppercase tracking-wider text-[#E8B619] border-b border-gray-800 pb-2">
              Popular Services
            </h4>
            <ul className="space-y-2 font-medium text-gray-400">
              <li><Link href="/bookings/new" className="hover:text-white transition-colors">1 BHK Deep Cleaning</Link></li>
              <li><Link href="/bookings/new" className="hover:text-white transition-colors">2 BHK Deep Cleaning</Link></li>
              <li><Link href="/bookings/new" className="hover:text-white transition-colors">3 BHK Deep Cleaning</Link></li>
              <li><Link href="/bookings/new" className="hover:text-white transition-colors">4 BHK & Villa Cleaning</Link></li>
              <li><Link href="/bookings/new" className="hover:text-white transition-colors">Kitchen Degreasing & Steam</Link></li>
              <li><Link href="/bookings/new" className="hover:text-white transition-colors">Bathroom Disinfection</Link></li>
              <li><Link href="/bookings/new" className="hover:text-white transition-colors">Sofa & Carpet Shampooing</Link></li>
              <li><Link href="/bookings/new" className="hover:text-white transition-colors">Commercial Handover Clean</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: SERVICE LOCALITIES IN PUNE */}
          <div className="space-y-3 text-xs">
            <h4 className="font-black text-sm uppercase tracking-wider text-[#E8B619] border-b border-gray-800 pb-2">
              Pune Service Areas
            </h4>
            <ul className="space-y-2 font-medium text-gray-400">
              <li><Link href="/bookings/new" className="hover:text-white transition-colors">📍 Wakad Deep Cleaning</Link></li>
              <li><Link href="/bookings/new" className="hover:text-white transition-colors">📍 Baner Deep Cleaning</Link></li>
              <li><Link href="/bookings/new" className="hover:text-white transition-colors">📍 Hinjewadi IT Park</Link></li>
              <li><Link href="/bookings/new" className="hover:text-white transition-colors">📍 Kharadi & Viman Nagar</Link></li>
              <li><Link href="/bookings/new" className="hover:text-white transition-colors">📍 Kothrud & Karve Nagar</Link></li>
              <li><Link href="/bookings/new" className="hover:text-white transition-colors">📍 Aundh & Pimple Saudagar</Link></li>
              <li><Link href="/bookings/new" className="hover:text-white transition-colors">📍 Magarpatta & Hadapsar</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: QUICK PORTAL ACCESS */}
          <div className="space-y-3 text-xs">
            <h4 className="font-black text-sm uppercase tracking-wider text-[#E8B619] border-b border-gray-800 pb-2">
              System Portals
            </h4>
            <ul className="space-y-2 font-bold text-gray-300">
              <li>
                <Link href="/bookings" className="hover:text-[#E8B619] flex items-center gap-1.5 transition-colors">
                  <Users className="w-3.5 h-3.5 text-[#E8B619]" /> Customer Tracker Portal
                </Link>
              </li>
              <li>
                <Link href="/agencies" className="hover:text-[#E8B619] flex items-center gap-1.5 transition-colors">
                  <Building2 className="w-3.5 h-3.5 text-[#E8B619]" /> Partner Agency Portal
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-[#E8B619] flex items-center gap-1.5 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E8B619]" /> Admin Operations Portal
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#E8B619] flex items-center gap-1.5 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-[#E8B619]" /> Instant Module Switcher
                </Link>
              </li>
              <li className="pt-2">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-black px-2.5 py-1 rounded-full block text-center">
                  ⚡ 1-Click Passwordless Access Enabled
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* TRUST BADGES & PAYMENT SECURITY BAR */}
        <div className="pt-8 border-t border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-400 font-semibold text-center">
          <div className="flex items-center justify-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>100% Quality Audit & Free Re-clean Support</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
            <CheckCircle2 className="w-5 h-5 text-[#E8B619] shrink-0" />
            <span>Non-Acidic Solvents for Italian Marble</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
            <Lock className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>256-Bit SSL Encrypted Secure Advance Payment</span>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & LEGAL LINKS */}
        <div className="pt-6 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-4">
          <div>
            &copy; 2025 Kleanzo Technologies Pvt. Ltd. All rights reserved. Built with ❤️ in Pune.
          </div>
          <div className="flex items-center space-x-4 font-medium">
            <Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-white transition-colors">Refund & Re-clean Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
