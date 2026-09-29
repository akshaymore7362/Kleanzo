import React from 'react';
import Link from 'next/link';
import { PhoneCall, Mail, Zap, Heart, Sparkles, MapPin } from 'lucide-react';

export default function AgencyFooter() {
  return (
    <footer className="bg-white text-slate-800 text-xs font-medium mt-16 pt-12 pb-6 border-t-2 border-[#FACC15]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-gray-200">
        {/* Left Column - Brand Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FACC15] text-black font-black text-lg flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-black fill-black" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1 font-sans">
                Kleanzo <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
              </div>
              <div className="text-[9px] font-black text-amber-700 tracking-wider uppercase">DIRT GONE. SHINE ON.</div>
            </div>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed max-w-sm font-semibold">
            Reliable cleaning partner for architects, interior designers, contractors and homeowners. Clean spaces. Better spaces.
          </p>

          <div className="space-y-2 pt-2 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <PhoneCall className="w-3.5 h-3.5" />
              </span>
              <span>Partner Support: <strong className="text-slate-900">+91 98765 43210</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Mail className="w-3.5 h-3.5" />
              </span>
              <span>support@kleanzo.com</span>
            </div>
          </div>
        </div>

        {/* Column 1 - Popular Services */}
        <div>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">POPULAR SERVICES</h4>
          <ul className="space-y-2 text-slate-600 text-xs font-semibold">
            <li className="hover:text-amber-700 cursor-pointer transition">1 BHK Deep Cleaning</li>
            <li className="hover:text-amber-700 cursor-pointer transition">2 BHK Deep Cleaning</li>
            <li className="hover:text-amber-700 cursor-pointer transition">3 BHK Deep Cleaning</li>
            <li className="hover:text-amber-700 cursor-pointer transition">4 BHK & Villa Cleaning</li>
            <li className="hover:text-amber-700 cursor-pointer transition">Kitchen Degreasing & Steam</li>
            <li className="hover:text-amber-700 cursor-pointer transition">Bathroom Disinfection</li>
            <li className="hover:text-amber-700 cursor-pointer transition">Sofa & Carpet Shampooing</li>
            <li className="hover:text-amber-700 cursor-pointer transition">Commercial Handover Clean</li>
          </ul>
        </div>

        {/* Column 2 - Pune Service Areas */}
        <div>
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">PUNE SERVICE AREAS</h4>
          <ul className="space-y-2 text-slate-600 text-xs font-semibold">
            <li className="flex items-center gap-1.5 hover:text-amber-700 cursor-pointer transition"><MapPin className="w-3 h-3 text-amber-600" /> Wakad Deep Cleaning</li>
            <li className="flex items-center gap-1.5 hover:text-amber-700 cursor-pointer transition"><MapPin className="w-3 h-3 text-amber-600" /> Baner Deep Cleaning</li>
            <li className="flex items-center gap-1.5 hover:text-amber-700 cursor-pointer transition"><MapPin className="w-3 h-3 text-amber-600" /> Hinjewadi IT Park</li>
            <li className="flex items-center gap-1.5 hover:text-amber-700 cursor-pointer transition"><MapPin className="w-3 h-3 text-amber-600" /> Kharadi & Viman Nagar</li>
            <li className="flex items-center gap-1.5 hover:text-amber-700 cursor-pointer transition"><MapPin className="w-3 h-3 text-amber-600" /> Kothrud & Karve Nagar</li>
            <li className="flex items-center gap-1.5 hover:text-amber-700 cursor-pointer transition"><MapPin className="w-3 h-3 text-amber-600" /> Aundh & Pimple Saudagar</li>
            <li className="flex items-center gap-1.5 hover:text-amber-700 cursor-pointer transition"><MapPin className="w-3 h-3 text-amber-600" /> Magarpatta & Hadapsar</li>
          </ul>
        </div>

        {/* Column 3 - System Portals */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">SYSTEM PORTALS</h4>
            <ul className="space-y-2 text-slate-600 text-xs font-bold">
              <li className="hover:text-amber-700 cursor-pointer transition flex items-center gap-1.5">
                <span>Customer Tracker Portal</span>
              </li>
              <li className="hover:text-amber-700 cursor-pointer transition flex items-center gap-1.5">
                <span className="text-amber-800 font-black">Partner Agency Portal</span>
              </li>
              <li className="hover:text-amber-700 cursor-pointer transition flex items-center gap-1.5">
                <span>Admin Operations Portal</span>
              </li>
              <li className="hover:text-amber-700 cursor-pointer transition flex items-center gap-1.5">
                <span>Instant Module Switcher</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#FEF08A] border border-[#FDE047] rounded-2xl p-3 flex items-center gap-2 text-[11px] text-amber-950 font-black shadow-xs">
            <Zap className="w-4 h-4 text-amber-700 shrink-0 fill-amber-700" />
            <span>1-Click Passwordless Access Enabled</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs font-bold">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#FACC15] text-black font-black text-[10px] flex items-center justify-center">
            K
          </div>
          <span>The Project Code Pvt Ltd. All rights reserved. Built with <Heart className="w-3 h-3 text-red-500 inline fill-red-500" /> in Pune.</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <Link href="/privacy" className="hover:text-slate-900 transition">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-slate-900 transition">Terms of Service</Link>
          <span>•</span>
          <Link href="/refund" className="hover:text-slate-900 transition">Refund & Re-clean Policy</Link>
        </div>
      </div>
    </footer>
  );
}

