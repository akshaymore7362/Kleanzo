'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Wrench,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  PlayCircle,
  XCircle,
  FileCheck,
  RefreshCw,
  Zap,
  MapPin,
  HelpCircle,
  Activity
} from 'lucide-react';

interface JobCardData {
  id: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  address: string;
  pinCode: string;
  date: string;
  timeSlot: string;
  amount: number;
  agencyName?: string;
  agencyStatus: 'UNASSIGNED' | 'MATCHING' | 'OFFER_SENT' | 'ACCEPTED' | 'DECLINED' | 'REJECTED';
  crewName?: string;
  crewCount: number;
  equipmentRequired: string[];
  equipmentAssigned: string[];
  status: string;
  slaMinutesRemaining: number;
  paymentStatus: 'PAID' | 'PENDING' | 'PARTIAL';
  proofStatus: 'NOT_SUBMITTED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  customerApprovalStatus: 'PENDING' | 'APPROVED' | 'REWORK_REQUESTED';
  disputeStatus?: 'NONE' | 'OPEN' | 'RESOLVED';
  stuckReason?: string;
  stuckWaitingFor?: string;
  stuckDurationMinutes?: number;
}

export default function AdminDispatchClientView() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const [jobs, setJobs] = useState<JobCardData[]>([
    {
      id: 'job-101',
      bookingCode: 'KZ-10231',
      customerName: 'Rahul Jaykar',
      customerPhone: '+91 98230 11223',
      serviceName: 'Full House Deep Cleaning (3 BHK)',
      address: 'Apt 402, Green Acres, Baner Road',
      pinCode: '411045',
      date: '10 Oct 2026',
      timeSlot: '10:00 AM - 02:00 PM',
      amount: 5309,
      agencyName: undefined,
      agencyStatus: 'UNASSIGNED',
      crewCount: 4,
      equipmentRequired: ['Single Disc Scrubber', 'Industrial Vacuum'],
      equipmentAssigned: [],
      status: 'NEW_UNASSIGNED',
      slaMinutesRemaining: 12,
      paymentStatus: 'PAID',
      proofStatus: 'NOT_SUBMITTED',
      customerApprovalStatus: 'PENDING',
      stuckReason: 'No agency assigned within initial 15-minute dispatch window',
      stuckWaitingFor: 'Admin to initiate manual broadcast or select Preferred Partner',
      stuckDurationMinutes: 18,
    },
    {
      id: 'job-102',
      bookingCode: 'KZ-10232',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98765 43210',
      serviceName: 'Bathroom Deep Cleaning (2 Units)',
      address: 'B-12, Seasons Society, Magarpatta',
      pinCode: '411028',
      date: '10 Oct 2026',
      timeSlot: '02:00 PM - 04:00 PM',
      amount: 1899,
      agencyName: 'CleanPro Agency Pune',
      agencyStatus: 'OFFER_SENT',
      crewCount: 2,
      equipmentRequired: ['High Pressure Washer'],
      equipmentAssigned: [],
      status: 'OFFERS_SENT',
      slaMinutesRemaining: 8,
      paymentStatus: 'PAID',
      proofStatus: 'NOT_SUBMITTED',
      customerApprovalStatus: 'PENDING',
      stuckReason: 'Offer broadcasting to 3 eligible agencies in 411028',
      stuckWaitingFor: 'First agency 1-click acceptance',
      stuckDurationMinutes: 7,
    },
    {
      id: 'job-103',
      bookingCode: 'KZ-10233',
      customerName: 'Amit Verma',
      customerPhone: '+91 91234 56789',
      serviceName: 'Sofa & Carpet Shampooing',
      address: 'Flat 701, Landmark Towers, Kothrud',
      pinCode: '411038',
      date: '10 Oct 2026',
      timeSlot: '11:00 AM - 01:00 PM',
      amount: 2499,
      agencyName: 'SparklePro Services',
      agencyStatus: 'ACCEPTED',
      crewCount: 3,
      equipmentRequired: ['Extraction Machine'],
      equipmentAssigned: [],
      status: 'CREW_PENDING',
      slaMinutesRemaining: 45,
      paymentStatus: 'PAID',
      proofStatus: 'NOT_SUBMITTED',
      customerApprovalStatus: 'PENDING',
      stuckReason: 'Agency accepted booking but has not assigned specific field crew members',
      stuckWaitingFor: 'SparklePro Agency to assign Supervisor & Cleaners',
      stuckDurationMinutes: 22,
    },
    {
      id: 'job-104',
      bookingCode: 'KZ-10234',
      customerName: 'Vikram Joshi',
      customerPhone: '+91 99887 76655',
      serviceName: 'Kitchen Degreasing & Deep Clean',
      address: 'Row House 4, Silver Birch, Viman Nagar',
      pinCode: '411014',
      date: '10 Oct 2026',
      timeSlot: '09:00 AM - 12:00 PM',
      amount: 3200,
      agencyName: 'CleanPro Agency Pune',
      agencyStatus: 'ACCEPTED',
      crewName: 'Team Alpha (Lead: Rajesh Shinde)',
      crewCount: 3,
      equipmentRequired: ['Steam Degreaser'],
      equipmentAssigned: ['Steam Degreaser SD-02'],
      status: 'PROOF_PENDING',
      slaMinutesRemaining: 0,
      paymentStatus: 'PAID',
      proofStatus: 'SUBMITTED',
      customerApprovalStatus: 'PENDING',
      stuckReason: 'Before & After photos submitted by Agency; awaiting Admin QC verification',
      stuckWaitingFor: 'Kleanzo Admin verification review',
      stuckDurationMinutes: 15,
    },
    {
      id: 'job-105',
      bookingCode: 'KZ-10235',
      customerName: 'Neha Mehta',
      customerPhone: '+91 98111 22334',
      serviceName: 'Post Construction Deep Clean (4 BHK)',
      address: 'Penthouse 1202, Royal Palms, Kharadi',
      pinCode: '411014',
      date: '09 Oct 2026',
      timeSlot: '10:00 AM - 05:00 PM',
      amount: 8900,
      agencyName: 'StarClean Facility Experts',
      agencyStatus: 'ACCEPTED',
      crewName: 'Team Delta (Lead: Mahesh K)',
      crewCount: 5,
      equipmentRequired: ['Heavy Scrubber', 'Industrial Vacuum'],
      equipmentAssigned: ['Heavy Scrubber HS-01', 'Vac IV-09'],
      status: 'DISPUTED',
      slaMinutesRemaining: 0,
      paymentStatus: 'PAID',
      proofStatus: 'APPROVED',
      customerApprovalStatus: 'REWORK_REQUESTED',
      disputeStatus: 'OPEN',
      stuckReason: 'Customer reported missed grout stains in master balcony',
      stuckWaitingFor: 'Admin to approve Rework Dispatch or issue partial refund',
      stuckDurationMinutes: 120,
    }
  ]);

  const lifecycleTabs = [
    { key: 'ALL', label: 'All Jobs', count: jobs.length },
    { key: 'NEW_UNASSIGNED', label: 'New / Unassigned', count: jobs.filter(j => j.status === 'NEW_UNASSIGNED').length },
    { key: 'OFFERS_SENT', label: 'Offers Sent', count: jobs.filter(j => j.status === 'OFFERS_SENT').length },
    { key: 'CREW_PENDING', label: 'Crew Pending', count: jobs.filter(j => j.status === 'CREW_PENDING').length },
    { key: 'SCHEDULED', label: 'Scheduled', count: jobs.filter(j => j.status === 'SCHEDULED').length },
    { key: 'ON_THE_WAY', label: 'On The Way', count: jobs.filter(j => j.status === 'ON_THE_WAY').length },
    { key: 'ARRIVED', label: 'Arrived', count: jobs.filter(j => j.status === 'ARRIVED').length },
    { key: 'CLEANING', label: 'Cleaning In Progress', count: jobs.filter(j => j.status === 'CLEANING').length },
    { key: 'PROOF_PENDING', label: 'Proof Pending Verification', count: jobs.filter(j => j.status === 'PROOF_PENDING').length },
    { key: 'COMPLETED', label: 'Completed', count: jobs.filter(j => j.status === 'COMPLETED').length },
    { key: 'DISPUTED', label: 'Disputed / Exception ⚠️', count: jobs.filter(j => j.status === 'DISPUTED').length },
  ];

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.pinCode.includes(searchQuery);

    if (!matchesSearch) return false;
    if (activeTab === 'ALL') return true;
    return j.status === activeTab;
  });

  const handleAction = (jobId: string, actionType: string) => {
    setNotice(`Executing ${actionType} on job ${jobId}...`);
    setTimeout(() => {
      setJobs(prev => prev.map(j => {
        if (j.id !== jobId) return j;
        if (actionType === 'FORCE_ASSIGN') {
          return { ...j, agencyName: 'CleanPro Agency Pune', agencyStatus: 'ACCEPTED', status: 'CREW_PENDING', stuckReason: undefined };
        }
        if (actionType === 'VERIFY_PROOF') {
          return { ...j, proofStatus: 'APPROVED', status: 'COMPLETED', stuckReason: undefined };
        }
        if (actionType === 'TRIGGER_REWORK') {
          return { ...j, status: 'CREW_PENDING', customerApprovalStatus: 'REWORK_REQUESTED', stuckReason: 'Rework dispatched to agency' };
        }
        return j;
      }));
      setNotice(`Action ${actionType} completed successfully.`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-6 sm:p-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-amber-600 tracking-wider uppercase mb-1">
            <Activity className="w-4 h-4 text-amber-500 animate-pulse" /> Central Dispatch Workspace
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building className="w-6 h-6 text-[#E8B619]" /> Admin Master Dispatch Center
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time multi-stage job pipeline, 2-level assignment monitor, SLA breach alerts, and exception management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/exceptions"
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-2xl text-xs font-bold transition flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-red-600" /> Exceptions Inbox ({jobs.filter(j => j.status === 'DISPUTED' || j.stuckReason).length})
          </Link>
          <Link
            href="/admin/dashboard"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-gray-200 rounded-2xl text-xs font-bold transition"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {notice && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-amber-700 font-black">Dismiss</button>
        </div>
      )}

      {/* Admin Action Required Center */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 rounded-3xl shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-wide">
            <ShieldAlert className="w-5 h-5 text-amber-400" /> Admin Action Required Center
          </div>
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-3 py-1 rounded-full">
            {jobs.filter(j => j.stuckReason).length} Urgent Bottlenecks Requiring Decision
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="text-amber-300 font-bold flex items-center gap-2">
              <Clock className="w-4 h-4" /> Unassigned Dispatches ({jobs.filter(j => j.status === 'NEW_UNASSIGNED').length})
            </div>
            <p className="text-slate-300 text-[11px]">Jobs waiting for initial agency broadcasting or manual admin override.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="text-cyan-300 font-bold flex items-center gap-2">
              <FileCheck className="w-4 h-4" /> Proof QC Awaiting Review ({jobs.filter(j => j.status === 'PROOF_PENDING').length})
            </div>
            <p className="text-slate-300 text-[11px]">Before/after evidence uploaded by agency; needs admin signoff to complete.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="text-red-300 font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Open Disputes ({jobs.filter(j => j.status === 'DISPUTED').length})
            </div>
            <p className="text-slate-300 text-[11px]">Customer complaints requiring rework trigger or partial refund resolution.</p>
          </div>
        </div>
      </div>

      {/* Lifecycle Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {lifecycleTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === tab.key ? 'bg-amber-400 text-slate-900' : 'bg-gray-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Booking ID, Customer, Pincode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-bold">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </div>
      </div>

      {/* Jobs Pipeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs hover:shadow-md transition space-y-4">
            
            {/* Job Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900">{job.bookingCode}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                    job.status === 'NEW_UNASSIGNED' ? 'bg-red-100 text-red-800' :
                    job.status === 'OFFERS_SENT' ? 'bg-amber-100 text-amber-800' :
                    job.status === 'CREW_PENDING' ? 'bg-indigo-100 text-indigo-800' :
                    job.status === 'PROOF_PENDING' ? 'bg-cyan-100 text-cyan-800' :
                    job.status === 'DISPUTED' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {job.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{job.serviceName}</h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.address} (Pincode: {job.pinCode})
                </p>
              </div>

              <div className="text-right">
                <div className="text-base font-black text-slate-900">₹{job.amount.toLocaleString('en-IN')}</div>
                <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                  {job.paymentStatus}
                </div>
              </div>
            </div>

            {/* Diagnostic: Why is this job stuck? */}
            {job.stuckReason && (
              <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-600" /> Diagnostic: Why is this job pending action?
                  </span>
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                    Waiting {job.stuckDurationMinutes}m
                  </span>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div><strong>Reason:</strong> {job.stuckReason}</div>
                  <div><strong>Waiting For:</strong> <span className="text-amber-900 font-bold">{job.stuckWaitingFor}</span></div>
                </div>
              </div>
            )}

            {/* 2-Level Assignment Status Box */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {/* Level 1: Agency */}
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-400" /> Level 1 — Agency
                </div>
                <div className="font-bold text-slate-900">
                  {job.agencyName || <span className="text-red-600">Unassigned</span>}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  Status: {job.agencyStatus}
                </div>
              </div>

              {/* Level 2: Crew */}
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3 text-slate-400" /> Level 2 — Crew
                </div>
                <div className="font-bold text-slate-900">
                  {job.crewName || <span className="text-amber-700 font-medium">Crew Pending ({job.crewCount} required)</span>}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                  <Wrench className="w-3 h-3" /> Equipment: {job.equipmentAssigned.length > 0 ? job.equipmentAssigned.join(', ') : 'Not Tagged'}
                </div>
              </div>
            </div>

            {/* Interactive Action Triggers */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                {job.status === 'NEW_UNASSIGNED' && (
                  <button
                    onClick={() => handleAction(job.id, 'FORCE_ASSIGN')}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5" /> Force Assign Agency
                  </button>
                )}

                {job.status === 'PROOF_PENDING' && (
                  <button
                    onClick={() => handleAction(job.id, 'VERIFY_PROOF')}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-xs"
                  >
                    <FileCheck className="w-3.5 h-3.5" /> Verify & Complete Proof
                  </button>
                )}

                {job.status === 'DISPUTED' && (
                  <button
                    onClick={() => handleAction(job.id, 'TRIGGER_REWORK')}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Approve Rework Request
                  </button>
                )}

                <Link
                  href={`/admin/bookings/${job.id}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1"
                >
                  Inspect Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> SLA: {job.slaMinutesRemaining}m remaining
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
