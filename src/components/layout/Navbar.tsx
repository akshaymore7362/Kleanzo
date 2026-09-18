'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Menu, X, Sparkles, User, Shield, Building2, LogIn, UserPlus, LogOut, RefreshCw } from 'lucide-react';
import { logoutAction, instantModuleLoginAction } from '@/actions/auth-actions';

interface UserSessionInfo {
  name: string;
  email: string;
  role: string;
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [userSession, setUserSession] = useState<UserSessionInfo | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleInstantPortalClick = async (role: 'ADMIN' | 'AGENCY_ADMIN' | 'CUSTOMER') => {
    setAccountDropdownOpen(false);
    setMobileMenuOpen(false);
    const res = await instantModuleLoginAction(role);
    if (res.success && res.redirectUrl) {
      window.location.href = res.redirectUrl;
    }
  };

  useEffect(() => {
    // Parse kleanzo_session cookie client-side to detect logged-in user
    try {
      const cookieStr = document.cookie;
      const match = cookieStr.split('; ').find(row => row.startsWith('kleanzo_session='));
      if (match) {
        const token = match.split('=')[1];
        if (token && token.includes('.')) {
          const payloadBase64 = token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/');
          const jsonStr = atob(payloadBase64);
          const payload = JSON.parse(jsonStr);
          if (payload && payload.name && payload.role) {
            setUserSession({
              name: payload.name,
              email: payload.email,
              role: payload.role,
            });
          }
        }
      }
    } catch {
      setUserSession(null);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setAccountDropdownOpen(false);
    await logoutAction();
    window.location.href = '/login?switch=true';
  };

  const getRoleLabel = (role: string) => {
    if (['ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'FINANCE'].includes(role)) return { text: 'Admin', color: 'bg-amber-500 text-black', icon: Shield };
    if (['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO'].includes(role)) return { text: 'Partner Agency', color: 'bg-blue-600 text-white', icon: Building2 };
    return { text: 'Customer', color: 'bg-emerald-600 text-white', icon: User };
  };

  const getDashboardUrl = (role: string) => {
    if (['ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'FINANCE'].includes(role)) return '/admin/dashboard';
    if (['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO'].includes(role)) return '/agency/dashboard';
    return '/bookings';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex flex-col group transition-transform hover:scale-[1.02]">
          <span className="text-3xl font-black tracking-tight text-[#E8B619] leading-none group-hover:text-[#D4A512] transition-colors font-sans flex items-center gap-1">
            Kleanzo <Sparkles className="w-4 h-4 text-[#E8B619] animate-pulse-subtle" />
          </span>
          <span className="text-[9px] font-extrabold tracking-widest text-[#111111] uppercase mt-1 group-hover:tracking-wider transition-all">
            DIRT GONE. SHINE ON.
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-gray-700">
          <Link
            href="/"
            className="bg-[#FEF3C7] text-black font-extrabold px-3.5 py-1.5 rounded-full transition-all hover:bg-[#FDE68A] hover:scale-105 text-xs shadow-xs"
          >
            Home
          </Link>

          {/* Services Dropdown */}
          <div className="relative group cursor-pointer py-2">
            <Link href="/services" className="nav-link-item flex items-center gap-1 text-xs">
              Services <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#E8B619] transition-transform duration-300 group-hover:rotate-180" />
            </Link>
            <div className="absolute top-full left-0 hidden group-hover:block w-64 bg-white rounded-2xl shadow-xl border border-gray-150 p-2 space-y-1 z-50 animate-fade-in">
              <Link href="/services/deep-cleaning" className="block px-3 py-2.5 rounded-xl hover:bg-amber-50 hover:text-black font-extrabold text-xs text-[#E8B619] transition-all hover:translate-x-1">
                Deep Cleaning Service (₹9,779/-)
              </Link>
              <Link href="/services#interior-handover-cleaning" className="block px-3 py-2.5 rounded-xl hover:bg-gray-50 hover:text-black font-medium text-xs transition-all hover:translate-x-1">
                Interior Handover Cleaning
              </Link>
              <Link href="/services#post-construction-cleaning" className="block px-3 py-2.5 rounded-xl hover:bg-gray-50 hover:text-black font-medium text-xs transition-all hover:translate-x-1">
                Post Construction Cleaning
              </Link>
              <Link href="/stain-removal" className="block px-3 py-2.5 rounded-xl hover:bg-gray-50 hover:text-black font-medium text-xs transition-all hover:translate-x-1">
                Glue & Stain Removal
              </Link>
            </div>
          </div>

          <Link href="/stain-removal" className="nav-link-item text-xs">
            Stain Removal
          </Link>

          <Link href="/pro" className="nav-link-item text-xs">
            For Professionals
          </Link>

          <Link href="/pricing" className="nav-link-item text-xs">
            Pricing
          </Link>
          
          <Link href="/about" className="nav-link-item text-xs">
            About
          </Link>
        </nav>

        {/* Desktop Action Buttons with Smart Unified Dropdown */}
        <div className="hidden lg:flex items-center space-x-3">
          <Link
            href="/services"
            className="p-2 text-gray-600 hover:text-[#E8B619] hover:bg-amber-50 rounded-full transition-all hover:scale-110"
            title="Services Catalog"
          >
            <Search className="w-4.5 h-4.5" />
          </Link>

          {/* Smart Account Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
              type="button"
              className="flex items-center gap-2 text-xs font-bold text-[#111111] bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-[#E8B619] px-3.5 py-2 rounded-full transition-all hover:scale-105 shadow-xs cursor-pointer select-none"
            >
              <div className="w-6 h-6 rounded-full bg-[#E8B619] flex items-center justify-center text-black font-extrabold relative">
                <User className="w-3.5 h-3.5" />
                {userSession && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>
              
              <span>
                {userSession ? userSession.name.split(' ')[0] : 'Login / Account'}
              </span>

              {userSession && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${getRoleLabel(userSession.role).color}`}>
                  {getRoleLabel(userSession.role).text}
                </span>
              )}

              <ChevronDown className={`w-3.5 h-3.5 text-gray-600 transition-transform ${accountDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {accountDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 space-y-1 z-50 animate-fade-in">
                {userSession ? (
                  <>
                    <div className="px-3 py-3 border-b border-gray-100 bg-gray-50 rounded-xl mb-1">
                      <p className="text-xs font-black text-black">{userSession.name}</p>
                      <p className="text-[11px] text-gray-500 font-medium truncate">{userSession.email}</p>
                      <span className={`inline-block mt-1 text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${getRoleLabel(userSession.role).color}`}>
                        {getRoleLabel(userSession.role).text} Active Session
                      </span>
                    </div>

                    <Link
                      href={getDashboardUrl(userSession.role)}
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-amber-50 text-black font-extrabold text-xs transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-[#E8B619]" />
                      Go to Active Dashboard
                    </Link>

                    <Link
                      href="/login?switch=true"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 text-blue-500" />
                      Switch Account / Role
                    </Link>

                    <div className="pt-1 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        type="button"
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 font-bold text-xs transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Sign Out / Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Select Portal / Sign In</p>
                    </div>

                    <button
                      onClick={() => handleInstantPortalClick('CUSTOMER')}
                      type="button"
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-emerald-50 text-gray-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      Customer Portal (1-Click Login)
                    </button>

                    <button
                      onClick={() => handleInstantPortalClick('AGENCY_ADMIN')}
                      type="button"
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-blue-50 text-gray-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Building2 className="w-4 h-4 text-blue-600" />
                      Partner Agency Portal (1-Click Login)
                    </button>

                    <button
                      onClick={() => handleInstantPortalClick('ADMIN')}
                      type="button"
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-amber-50 text-gray-800 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-amber-600" />
                      Admin Operations Portal (1-Click Login)
                    </button>

                    <div className="pt-1 border-t border-gray-100">
                      <Link
                        href="/register"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-600 text-xs transition-colors"
                      >
                        <UserPlus className="w-4 h-4 text-gray-400" />
                        New Customer? Register
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <Link
            href="/bookings/new"
            className="bg-[#E8B619] hover:bg-[#D4A512] text-black font-extrabold text-xs px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 uppercase tracking-wide"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="p-2 text-gray-700 hover:text-black rounded-lg focus:outline-none transition-transform active:scale-90"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-lg border-b border-gray-200 px-6 py-6 space-y-4 shadow-xl animate-fade-in">
          <nav className="flex flex-col space-y-3 font-semibold text-gray-800">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-gray-100 font-bold text-[#E8B619]">
              Home
            </Link>
            <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-gray-100 hover:text-[#E8B619] transition-colors">
              Services Catalog
            </Link>
            <Link href="/stain-removal" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-gray-100 text-[#E8B619]">
              Stain Removal Diagnostics
            </Link>
            <Link href="/pro" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-gray-100 hover:text-[#E8B619] transition-colors">
              For Professionals & Studios
            </Link>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-gray-100 hover:text-[#E8B619] transition-colors">
              Pricing & Rate Specs
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-gray-100 hover:text-[#E8B619] transition-colors">
              About Kleanzo
            </Link>
          </nav>
          <div className="pt-2 flex flex-col space-y-2">
            {userSession ? (
              <>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
                  <p className="font-extrabold text-black">{userSession.name}</p>
                  <p className="text-gray-500 font-medium">{userSession.email}</p>
                  <span className={`inline-block mt-1 text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${getRoleLabel(userSession.role).color}`}>
                    {getRoleLabel(userSession.role).text}
                  </span>
                </div>
                <Link
                  href={getDashboardUrl(userSession.role)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 font-extrabold bg-[#E8B619] text-black rounded-full text-xs shadow-md"
                >
                  Go to Active Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2.5 font-bold border border-red-300 text-red-600 rounded-full text-xs"
                >
                  Sign Out / Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleInstantPortalClick('CUSTOMER')}
                  className="w-full text-center py-2.5 font-bold border border-emerald-300 bg-emerald-50 rounded-full text-emerald-900 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4 text-emerald-600" />
                  Customer Portal (1-Click Login)
                </button>
                <button
                  onClick={() => handleInstantPortalClick('AGENCY_ADMIN')}
                  className="w-full text-center py-2.5 font-bold border border-blue-300 bg-blue-50 rounded-full text-blue-900 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Partner Agency Portal (1-Click Login)
                </button>
                <button
                  onClick={() => handleInstantPortalClick('ADMIN')}
                  className="w-full text-center py-2.5 font-bold border border-amber-300 bg-amber-50 rounded-full text-amber-900 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-amber-600" />
                  Admin Operations Portal (1-Click Login)
                </button>
              </>
            )}

            <Link
              href="/bookings/new"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 font-bold bg-[#E8B619] hover:bg-[#D4A512] text-black rounded-full text-xs uppercase shadow-md transition-all active:scale-95 mt-2"
            >
              Book Now (6-Step Flow)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
