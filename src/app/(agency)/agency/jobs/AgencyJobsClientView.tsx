'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building, 
  Clock, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Users,
  DollarSign
} from 'lucide-react';

interface AgencyJobsClientViewProps {
  bookings: any[];
}

export default function AgencyJobsClientView({ bookings }: AgencyJobsClientViewProps) {
  const [activeTab, setActiveTab] = useState('ALL');

  const filterTabs = [
    { key: 'ALL', label: 'All Assigned Jobs', count: bookings.length },
    { key: 'NEW', label: 'New Job Offers 🔔', count: bookings.filter(b => b.bookingStatus === 'PARTNER_PENDING_ACCEPTANCE').length },
    { key: 'ACCEPTED', label: 'Accepted / Scheduled', count: bookings.filter(b => ['PARTNER_ACCEPTED', 'TEAM_ASSIGNED'].includes(b.bookingStatus)).length },
    { key: 'IN_PROGRESS', label: 'In Progress', count: bookings.filter(b => ['ON_THE_WAY', 'ARRIVED', 'CLEANING_IN_PROGRESS'].includes(b.bookingStatus)).length },
    { key: 'COMPLETED', label: 'Completed', count: bookings.filter(b => ['VERIFICATION_PENDING', 'VERIFIED', 'COMPLETED', 'CLOSED'].includes(b.bookingStatus)).length },
  ];

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'NEW') return b.bookingStatus === 'PARTNER_PENDING_ACCEPTANCE';
    if (activeTab === 'ACCEPTED') return ['PARTNER_ACCEPTED', 'TEAM_ASSIGNED'].includes(b.bookingStatus);
    if (activeTab === 'IN_PROGRESS') return ['ON_THE_WAY', 'ARRIVED', 'CLEANING_IN_PROGRESS'].includes(b.bookingStatus);
    if (activeTab === 'COMPLETED') return ['VERIFICATION_PENDING', 'VERIFIED', 'COMPLETED', 'CLOSED'].includes(b.bookingStatus);
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-6 sm:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building className="w-6 h-6 text-yellow-500" /> Agency Fulfillment Jobs Portal
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage assigned Kleanzo jobs, team allocations, job day status, and completion proof submissions.
          </p>
        </div>

        <Link
          href="/agency/dashboard"
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-yellow-400 border border-yellow-500/30 rounded-xl text-xs font-semibold transition"
        >
          Agency Dashboard
        </Link>
      </div>

      {/* Tabs */}
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

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.length === 0 ? (
          <div className="col-span-full p-12 bg-neutral-900 border border-neutral-800 rounded-2xl text-center text-xs text-neutral-500">
            No jobs found matching active filter.
          </div>
        ) : (
          filteredBookings.map((b) => {
            const item = b.items[0];
            const address = b.addresses[0];
            const isOffer = b.bookingStatus === 'PARTNER_PENDING_ACCEPTANCE';
            const payoutAmt = b.partnerPayout || Math.round(b.totalAmount * 0.70);

            return (
              <div 
                key={b.id} 
                className={`bg-neutral-900 border rounded-2xl p-6 flex flex-col justify-between space-y-4 transition ${
                  isOffer ? 'border-yellow-500/60 shadow-lg shadow-yellow-500/10' : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-yellow-400">
                      #{b.bookingCode}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      isOffer ? 'bg-yellow-500/20 text-yellow-400 animate-pulse' : 'bg-neutral-800 text-neutral-300'
                    }`}>
                      {b.bookingStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-2">{item?.serviceName || 'Deep Cleaning'}</h3>
                  <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-neutral-500" /> {b.propertyType}
                  </div>

                  <div className="mt-4 p-3 bg-neutral-950 rounded-xl border border-neutral-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-300">
                      <MapPin className="w-3.5 h-3.5 text-yellow-500" /> Locality: {address?.areaName || address?.city || 'Pune'}
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-300">
                      <Calendar className="w-3.5 h-3.5 text-yellow-500" /> Date: {b.scheduledDate} ({b.scheduledTime})
                    </div>
                    <div className="flex items-center gap-1.5 text-yellow-400 font-semibold pt-1 border-t border-neutral-800">
                      <DollarSign className="w-3.5 h-3.5" /> Agency Payout: ₹{payoutAmt}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/agency/jobs/${b.id}`}
                    className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
                  >
                    Manage Job <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
