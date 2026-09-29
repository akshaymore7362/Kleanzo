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
    <footer className="bg-white text-slate-900 pt-16 pb-8 border-t-2 border-[#FACC15] relative overflow-hidden font-sans">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* TOP NEWSLETTER & INSTANT DISCOUNT BANNER */}
        <div className="bg-[#FEF08A]/80 rounded-3xl p-6 sm:p-8 border border-[#FDE047] shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-black uppercase text-amber-950 bg-white/80 px-3 py-0.5 rounded-full inline-flex items-center gap-1 border border-amber-200 shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-600" /> EXCLUSIVE OFFER
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-amber-950">
              Get ₹500 Off Your First Deep Cleaning
            </h3>
            <p className="text-xs text-amber-900 font-semibold">
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
              className="w-full sm:w-72 bg-white border border-amber-300 px-4 py-3 rounded-xl text-xs text-slate-900 font-bold placeholder-gray-400 focus:outline-none focus:border-amber-600 transition-all shadow-xs"
            />
            <button
              type="submit"
              className="bg-slate-900 hover:bg-black text-white font-black text-xs px-6 py-3 rounded-xl transition-all shadow-md uppercase tracking-wider shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              {subscribed ? 'Subscribed ✓' : 'Subscribe'} <Send className="w-3.5 h-3.5 text-[#FACC15]" />
            </button>
          </form>
        </div>

        {/* MAIN 4 COLUMNS FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-4">
          
          {/* COLUMN 1: BRAND & MISSION (2 COLUMNS SPAN) */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#FACC15] text-black font-black flex items-center justify-center text-2xl shadow-md">
                K
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 leading-none font-sans">
                  Kleanzo
                </span>
                <span className="text-[9px] font-black tracking-widest text-amber-700 uppercase mt-1">
                  DIRT GONE. SHINE ON.
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-600 font-semibold leading-relaxed max-w-sm">
              Pune's premier tech-enabled deep cleaning platform. Specializing in post-construction handover, Italian marble pH care, kitchen degreasing, and luxury home sanitization with 100% background-verified teams.
            </p>

            {/* Contact Quick Pills */}
            <div className="space-y-2 text-xs font-bold text-slate-700">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-emerald-700 hover:underline font-extrabold"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp Support: +91 98765 43210
              </a>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-amber-600" /> support@kleanzo.com
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-amber-600" /> Kleanzo HQ: Wakad-Hinjewadi Link Road, Pune - 411057
              </div>
            </div>
          </div>

          {/* COLUMN 2: POPULAR SERVICES */}
          <div className="space-y-3 text-xs">
            <h4 className="font-black text-sm uppercase tracking-wider text-slate-900 border-b border-gray-200 pb-2">
              Popular Services
            </h4>
            <ul className="space-y-2 font-semibold text-slate-600">
              <li><Link href="/bookings/new" className="hover:text-amber-700 transition-colors">1 BHK Deep Cleaning</Link></li>
              <li><Link href="/bookings/new" className="hover:text-amber-700 transition-colors">2 BHK Deep Cleaning</Link></li>
              <li><Link href="/bookings/new" className="hover:text-amber-700 transition-colors">3 BHK Deep Cleaning</Link></li>
              <li><Link href="/bookings/new" className="hover:text-amber-700 transition-colors">4 BHK & Villa Cleaning</Link></li>
              <li><Link href="/bookings/new" className="hover:text-amber-700 transition-colors">Kitchen Degreasing & Steam</Link></li>
              <li><Link href="/bookings/new" className="hover:text-amber-700 transition-colors">Bathroom Disinfection</Link></li>
              <li><Link href="/bookings/new" className="hover:text-amber-700 transition-colors">Sofa & Carpet Shampooing</Link></li>
              <li><Link href="/bookings/new" className="hover:text-amber-700 transition-colors">Commercial Handover Clean</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: SERVICE LOCALITIES IN PUNE */}
          <div className="space-y-3 text-xs">
            <h4 className="font-black text-sm uppercase tracking-wider text-slate-900 border-b border-gray-200 pb-2">
              Pune Service Areas
            </h4>
            <ul className="space-y-2 font-semibold text-slate-600">
              <li><Link href="/bookings/new" className="hover:text-amber-700 transition-colors">📍 Wakad Deep Cleaning</Link></li>
              <li><Link href="/bookings/new" className="hover:text-amber-700 transition-colors">📍 Baner Deep Cleaning</Link></li>
              <li><Link href="/bookings/new" className="hover:text-amber-700 transition-colors">📍 Hinjewadi IT Park</Link></li>
              <li><Link href="/bookings/new" className="hover:text-amber-700 transition-colors">📍 Kharadi & Viman Nagar</Link></li>
              <li><Link href="/bookings/new" className="hover:text-amber-700 transition-colors">📍 Kothrud & Karve Nagar</Link></li>
              <li><Link href="/bookings/new" className="hover:text-amber-700 transition-colors">📍 Aundh & Pimple Saudagar</Link></li>
              <li><Link href="/bookings/new" className="hover:text-amber-700 transition-colors">📍 Magarpatta & Hadapsar</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: QUICK PORTAL ACCESS */}
          <div className="space-y-3 text-xs">
            <h4 className="font-black text-sm uppercase tracking-wider text-slate-900 border-b border-gray-200 pb-2">
              System Portals
            </h4>
            <ul className="space-y-2 font-bold text-slate-700">
              <li>
                <Link href="/bookings" className="hover:text-amber-700 flex items-center gap-1.5 transition-colors">
                  <Users className="w-3.5 h-3.5 text-amber-600" /> Customer Tracker Portal
                </Link>
              </li>
              <li>
                <Link href="/agencies" className="hover:text-amber-700 flex items-center gap-1.5 transition-colors">
                  <Building2 className="w-3.5 h-3.5 text-amber-600" /> Partner Agency Portal
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-amber-700 flex items-center gap-1.5 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Admin Operations Portal
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  href="/partner/register"
                  className="bg-[#FACC15] hover:bg-amber-400 text-black font-black text-[11px] px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all uppercase tracking-wider text-center"
                >
                  Become a Kleanzo Partner →
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* TRUST BADGES & PAYMENT SECURITY BAR */}
        <div className="pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700 font-extrabold text-center">
          <div className="flex items-center justify-center gap-2 bg-slate-50 p-3 rounded-2xl border border-gray-200">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>100% Quality Audit & Free Re-clean Support</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-slate-50 p-3 rounded-2xl border border-gray-200">
            <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Non-Acidic Solvents for Italian Marble</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-slate-50 p-3 rounded-2xl border border-gray-200">
            <Lock className="w-5 h-5 text-cyan-600 shrink-0" />
            <span>256-Bit SSL Encrypted Secure Advance Payment</span>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & LEGAL LINKS */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-semibold gap-4">
          <div>
            &copy; 2025 The Project Code Pvt Ltd. All rights reserved. Built with ❤️ in Pune.
          </div>
          <div className="flex items-center space-x-4 font-bold">
            <Link href="/about" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-slate-900 transition-colors">Refund & Re-clean Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
