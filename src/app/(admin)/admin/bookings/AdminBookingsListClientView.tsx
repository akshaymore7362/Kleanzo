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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-6 sm:p-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building className="w-6 h-6 text-yellow-500" /> Admin Booking Operations & Matching Control
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time management of customer bookings, agency matching engine, job progress, and admin verification.
          </p>
        </div>

        <Link
          href="/admin/dashboard"
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-yellow-400 border border-yellow-500/30 rounded-xl text-xs font-semibold transition"
        >
          Return to Overview
        </Link>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl">
          <div className="text-xs text-neutral-400">Total Bookings</div>
          <div className="text-xl font-bold text-white mt-1">{bookings.length}</div>
        </div>
        <div className="bg-neutral-900 border border-red-500/30 p-4 rounded-xl">
          <div className="text-xs text-red-400">Agency Required</div>
          <div className="text-xl font-bold text-red-400 mt-1">{stats.unassignedCount || 0}</div>
        </div>
        <div className="bg-neutral-900 border border-yellow-500/30 p-4 rounded-xl">
          <div className="text-xs text-yellow-400">Offer Pending</div>
          <div className="text-xl font-bold text-yellow-400 mt-1">{bookings.filter(b => b.bookingStatusRaw === 'PARTNER_PENDING_ACCEPTANCE').length}</div>
        </div>
        <div className="bg-neutral-900 border border-purple-500/30 p-4 rounded-xl">
          <div className="text-xs text-purple-400">In Progress</div>
          <div className="text-xl font-bold text-purple-400 mt-1">{stats.cleaningInProgressCount || 0}</div>
        </div>
        <div className="bg-neutral-900 border border-cyan-500/30 p-4 rounded-xl">
          <div className="text-xs text-cyan-400">Verification Pending</div>
          <div className="text-xl font-bold text-cyan-400 mt-1">{stats.qcPendingCount || 0}</div>
        </div>
        <div className="bg-neutral-900 border border-emerald-500/30 p-4 rounded-xl">
          <div className="text-xs text-emerald-400">Completed</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{bookings.filter(b => ['COMPLETED', 'CLOSED'].includes(b.bookingStatusRaw)).length}</div>
        </div>
      </div>

      {/* Controls Bar: Search & Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Code, Customer, Agency..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:border-yellow-500 focus:outline-none"
            />
          </div>

          <div className="text-xs text-neutral-400">
            Showing <strong className="text-white">{filteredBookings.length}</strong> of {bookings.length} bookings
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.key ? 'bg-black/20 text-black' : 'bg-neutral-800 text-neutral-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-950/80 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider">
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
            <tbody className="divide-y divide-neutral-800/60">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500 text-xs">
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.realDbId} className="hover:bg-neutral-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-yellow-400">
                      #{b.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{b.customer}</div>
                      <div className="text-[11px] text-neutral-500">{b.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-neutral-200">{b.service}</div>
                      <div className="text-[11px] text-neutral-500">{b.property}</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">
                      {b.datetime}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-semibold ${b.partner === 'Unassigned' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {b.partner}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${b.statusColor}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">₹{b.totalAmount}</div>
                      <div className="text-[11px] text-emerald-400">Advance: ₹{b.advanceAmount}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/bookings/${b.realDbId}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/30 rounded-lg text-xs font-semibold transition"
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
