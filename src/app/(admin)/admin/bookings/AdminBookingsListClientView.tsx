'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Building,
  RefreshCw
} from 'lucide-react';

interface AdminBookingsListClientViewProps {
  bookings: any[];
  stats: any;
}

export default function AdminBookingsListClientView({ bookings, stats }: AdminBookingsListClientViewProps) {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = [
    { key: 'ALL', label: 'All Bookings', count: bookings.length },
    { key: 'AGENCY_REQUIRED', label: 'Agency Required ⚠️', count: bookings.filter(b => b.bookingStatusRaw === 'AGENCY_REQUIRED').length },
    { key: 'PARTNER_PENDING_ACCEPTANCE', label: 'Offer Sent', count: bookings.filter(b => b.bookingStatusRaw === 'PARTNER_PENDING_ACCEPTANCE').length },
    { key: 'ASSIGNED', label: 'Assigned / Accepted', count: bookings.filter(b => ['PARTNER_ACCEPTED', 'TEAM_ASSIGNED'].includes(b.bookingStatusRaw)).length },
    { key: 'CLEANING_IN_PROGRESS', label: 'In Progress', count: bookings.filter(b => b.bookingStatusRaw === 'CLEANING_IN_PROGRESS').length },
    { key: 'VERIFICATION_PENDING', label: 'Verification Pending', count: bookings.filter(b => ['VERIFICATION_PENDING', 'QC_PENDING'].includes(b.bookingStatusRaw)).length },
    { key: 'COMPLETED', label: 'Completed', count: bookings.filter(b => ['COMPLETED', 'CLOSED', 'VERIFIED'].includes(b.bookingStatusRaw)).length },
  ];

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.property.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'ALL') return true;
    if (activeTab === 'AGENCY_REQUIRED') return b.bookingStatusRaw === 'AGENCY_REQUIRED';
    if (activeTab === 'PARTNER_PENDING_ACCEPTANCE') return b.bookingStatusRaw === 'PARTNER_PENDING_ACCEPTANCE';
    if (activeTab === 'ASSIGNED') return ['PARTNER_ACCEPTED', 'TEAM_ASSIGNED'].includes(b.bookingStatusRaw);
    if (activeTab === 'CLEANING_IN_PROGRESS') return b.bookingStatusRaw === 'CLEANING_IN_PROGRESS';
    if (activeTab === 'VERIFICATION_PENDING') return ['VERIFICATION_PENDING', 'QC_PENDING'].includes(b.bookingStatusRaw);
    if (activeTab === 'COMPLETED') return ['COMPLETED', 'CLOSED', 'VERIFIED'].includes(b.bookingStatusRaw);

    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-6 sm:p-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-3xl shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building className="w-6 h-6 text-[#E8B619]" /> Admin Booking Operations & Matching Control
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time management of customer bookings, agency matching engine, job progress, and admin verification.
          </p>
        </div>

        <Link
          href="/admin/dashboard"
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-gray-200 rounded-2xl text-xs font-bold transition"
        >
          Return to Overview
        </Link>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-bold text-slate-500">Total Bookings</div>
          <div className="text-xl font-black text-slate-900 mt-1">{bookings.length}</div>
        </div>
        <div className="bg-white border border-red-200 p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-bold text-red-600">Agency Required</div>
          <div className="text-xl font-black text-red-600 mt-1">{stats.unassignedCount || 0}</div>
        </div>
        <div className="bg-white border border-amber-200 p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-bold text-amber-700">Offer Pending</div>
          <div className="text-xl font-black text-amber-800 mt-1">{bookings.filter(b => b.bookingStatusRaw === 'PARTNER_PENDING_ACCEPTANCE').length}</div>
        </div>
        <div className="bg-white border border-purple-200 p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-bold text-purple-700">In Progress</div>
          <div className="text-xl font-black text-purple-900 mt-1">{stats.cleaningInProgressCount || 0}</div>
        </div>
        <div className="bg-white border border-cyan-200 p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-bold text-cyan-700">Verification Pending</div>
          <div className="text-xl font-black text-cyan-900 mt-1">{stats.qcPendingCount || 0}</div>
        </div>
        <div className="bg-white border border-emerald-200 p-4 rounded-2xl shadow-xs">
          <div className="text-xs font-bold text-emerald-700">Completed</div>
          <div className="text-xl font-black text-emerald-900 mt-1">{bookings.filter(b => ['COMPLETED', 'CLOSED'].includes(b.bookingStatusRaw)).length}</div>
        </div>
      </div>

      {/* Controls Bar: Search & Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Code, Customer, Agency..."
              className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-4 py-2 text-xs text-slate-900 font-medium focus:border-[#E8B619] focus:outline-none shadow-xs"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredBookings.length}</strong> of {bookings.length} bookings
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-[#FACC15] text-black shadow-md'
                  : 'bg-white text-slate-600 border border-gray-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.key ? 'bg-black/10 text-black' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Booking Code</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Service & Property</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Assigned Partner</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Financials</th>
                <th className="py-3.5 px-4 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs font-medium">
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.realDbId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                      #{b.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{b.customer}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{b.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{b.service}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{b.property}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {b.datetime}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${b.partner === 'Unassigned' ? 'text-red-600' : 'text-[#E8B619]'}`}>
                        {b.partner}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${b.statusColor}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-black text-slate-900">₹{b.totalAmount}</div>
                      <div className="text-[11px] text-emerald-600 font-bold">Advance: ₹{b.advanceAmount}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/bookings/${b.realDbId}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FACC15] hover:bg-[#EAB308] text-black font-black rounded-xl text-xs transition shadow-xs cursor-pointer"
                      >
                        Manage & Match <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
