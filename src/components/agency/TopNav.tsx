'use client';

import React, { useState } from 'react';
import { Menu, X, Bell, ChevronDown, LogOut, User, Sparkles } from 'lucide-react';

export type Tab = 'dashboard' | 'jobs' | 'payouts' | 'team' | 'resources' | 'support';

const navItems: { key: Tab; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'jobs', label: 'Jobs' },
  { key: 'payouts', label: 'Payouts' },
  { key: 'team', label: 'Team' },
  { key: 'resources', label: 'Resources' },
  { key: 'support', label: 'Support' },
];

export default function TopNav({ currentUser, agency, tab, setTab, onLogout }: any) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [agencyOpen, setAgencyOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-6">
          <button
            className="lg:hidden text-gray-700 hover:text-black"
            aria-label="Toggle navigation"
            onClick={() => setMobileNavOpen((v) => !v)}
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setTab('dashboard')}>
            <div className="w-8 h-8 rounded-xl bg-[#FACC15] text-black font-black text-lg flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-black fill-black" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-black tracking-tight text-black flex items-center gap-1">
                Kleanzo <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
              </div>
              <div className="text-[9px] font-black text-gray-800 tracking-wider uppercase">DIRT GONE. SHINE ON.</div>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-gray-50/80 p-1 rounded-full border border-gray-100">
            {navItems.map((n) => {
              const active = tab === n.key;
              return (
                <button
                  key={n.key}
                  onClick={() => setTab(n.key)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    active
                      ? 'bg-[#FACC15] text-black shadow-sm'
                      : 'text-gray-700 hover:text-black hover:bg-gray-200/50'
                  }`}
                >
                  {n.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white">
              2
            </span>
          </button>

          {/* Partner Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAccountOpen((v) => !v)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200/80 px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 transition"
            >
              <div className="w-5 h-5 rounded-full bg-[#FACC15] flex items-center justify-center text-black">
                <User className="w-3 h-3" />
              </div>
              <span>Partner Account</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>
            {accountOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 text-xs font-bold text-gray-700 z-50">
                <div className="px-4 py-2 border-b border-gray-100 text-[11px] text-gray-400 truncate">
                  {currentUser?.email || agency?.email || 'partner@kleanzo.com'}
                </div>
                <div className="px-4 py-2 text-gray-600 border-b border-gray-100 text-[11px]">
                  Status: <span className="text-emerald-700 font-extrabold">{agency?.partnerStatus || 'ACTIVE'}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 flex items-center gap-2 transition"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout / Switch Role
                </button>
              </div>
            )}
          </div>

          {/* Kleanzo Partner Button */}
          <div className="bg-[#FACC15] hover:bg-[#EAB308] text-black px-4 py-1 rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-sm transition">
            <span className="text-xs font-black leading-tight">Kleanzo Partner</span>
            <span className="text-[9px] font-bold text-gray-700 leading-none">Agency</span>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileNavOpen && (
        <nav className="lg:hidden border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-1 shadow-lg">
          {navItems.map((n) => (
            <button
              key={n.key}
              onClick={() => {
                setTab(n.key);
                setMobileNavOpen(false);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold text-left transition ${
                tab === n.key ? 'bg-[#FACC15] text-black' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

