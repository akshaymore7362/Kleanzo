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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-6 sm:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building className="w-6 h-6 text-amber-600" /> Agency Fulfillment Jobs Portal
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Manage assigned Kleanzo jobs, team allocations, job day status, and completion proof submissions.
          </p>
        </div>

        <Link
          href="/agency/dashboard"
          className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-black transition-all shadow-xs"
        >
          Agency Dashboard
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === tab.key
                ? 'bg-[#FACC15] text-black shadow-md border border-amber-400'
                : 'bg-white text-slate-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              activeTab === tab.key ? 'bg-black/10 text-black font-extrabold' : 'bg-gray-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.length === 0 ? (
          <div className="col-span-full p-12 bg-white border border-gray-200 rounded-3xl text-center text-xs text-slate-400 font-medium">
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
                className={`bg-white border rounded-3xl p-6 flex flex-col justify-between space-y-4 transition-all shadow-sm ${
                  isOffer ? 'border-amber-400 shadow-md ring-2 ring-amber-200' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-amber-900 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full uppercase">
                      #{b.bookingCode}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isOffer ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse' : 'bg-gray-100 text-slate-700'
                    }`}>
                      {b.bookingStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 mt-3">{item?.serviceName || 'Deep Cleaning'}</h3>
                  <div className="text-xs text-slate-500 font-semibold mt-1 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" /> {b.propertyType}
                  </div>

                  <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-gray-200 space-y-1.5 text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" /> Locality: {address?.areaName || address?.city || 'Pune'}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" /> Date: {b.scheduledDate} ({b.scheduledTime})
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800 font-black pt-1 border-t border-gray-200">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Agency Payout: ₹{payoutAmt?.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/agency/jobs/${b.id}`}
                    className="w-full py-3 bg-[#FACC15] hover:bg-[#EAB308] text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    Manage Job <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
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
