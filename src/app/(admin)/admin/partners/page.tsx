'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Search, Filter, Building2, User, Phone, CheckCircle2,
  AlertTriangle, Clock, XCircle, ArrowRight, Eye, RefreshCw, FileText, ChevronRight
} from 'lucide-react';
import { getAdminPartnerApplicationsAction } from '@/actions/admin-partner-actions';

export default function AdminPartnersPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [counts, setCounts] = useState({ total: 0, underReview: 0, actionRequired: 0, active: 0, suspended: 0, rejected: 0 });
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    const res = await getAdminPartnerApplicationsAction({ status: activeTab, search });
    setLoading(false);
    if (res.success && res.applications) {
      setApplications(res.applications);
      if (res.counts) setCounts(res.counts);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UNDER_REVIEW':
      case 'SUBMITTED':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1"><Clock className="w-3 h-3" /> Under Review</span>;
      case 'ACTION_REQUIRED':
        return <span className="bg-orange-100 text-orange-800 border border-orange-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Action Required</span>;
      case 'ACTIVE':
      case 'APPROVED':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Active Partner</span>;
      case 'SUSPENDED':
        return <span className="bg-red-100 text-red-800 border border-red-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1"><XCircle className="w-3 h-3" /> Suspended</span>;
      case 'REJECTED':
        return <span className="bg-gray-100 text-gray-700 border border-gray-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{status}</span>;
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-200 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Kleanzo Admin Operations
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Partner Agency Management</h1>
            <p className="text-xs text-slate-500 font-semibold">Verify onboarding applications, document KYC, control partner activation and job eligibility.</p>
          </div>

          <button onClick={fetchApplications} className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all">
            <RefreshCw className={`w-4 h-4 text-amber-600 ${loading ? 'animate-spin' : ''}`} /> Refresh Table
          </button>
        </div>

        {/* METRICS & TABS */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          <button onClick={() => setActiveTab('ALL')} className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${activeTab === 'ALL' ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-800 border-gray-200 hover:bg-gray-50'}`}>
            <p className="text-[10px] font-black uppercase tracking-wider opacity-70">All Applications</p>
            <p className="text-xl font-black mt-1">{counts.total}</p>
          </button>

          <button onClick={() => setActiveTab('UNDER_REVIEW')} className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${activeTab === 'UNDER_REVIEW' ? 'bg-amber-500 text-black border-amber-500 shadow-md' : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-50'}`}>
            <p className="text-[10px] font-black uppercase tracking-wider opacity-70">Under Review</p>
            <p className="text-xl font-black mt-1">{counts.underReview}</p>
          </button>

          <button onClick={() => setActiveTab('ACTION_REQUIRED')} className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${activeTab === 'ACTION_REQUIRED' ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-white text-orange-900 border-orange-200 hover:bg-orange-50'}`}>
            <p className="text-[10px] font-black uppercase tracking-wider opacity-70">Action Required</p>
            <p className="text-xl font-black mt-1">{counts.actionRequired}</p>
          </button>

          <button onClick={() => setActiveTab('ACTIVE')} className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${activeTab === 'ACTIVE' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-50'}`}>
            <p className="text-[10px] font-black uppercase tracking-wider opacity-70">Active Partners</p>
            <p className="text-xl font-black mt-1">{counts.active}</p>
          </button>

          <button onClick={() => setActiveTab('SUSPENDED')} className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${activeTab === 'SUSPENDED' ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white text-red-900 border-red-200 hover:bg-red-50'}`}>
            <p className="text-[10px] font-black uppercase tracking-wider opacity-70">Suspended</p>
            <p className="text-xl font-black mt-1">{counts.suspended}</p>
          </button>

          <button onClick={() => setActiveTab('REJECTED')} className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${activeTab === 'REJECTED' ? 'bg-gray-800 text-white border-gray-800 shadow-md' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}>
            <p className="text-[10px] font-black uppercase tracking-wider opacity-70">Rejected</p>
            <p className="text-xl font-black mt-1">{counts.rejected}</p>
          </button>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="w-full sm:w-96 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agency, owner name, mobile, application code..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FACC15]"
            />
          </form>

          <div className="text-xs font-bold text-slate-500">
            Showing <span className="text-slate-900 font-black">{applications.length}</span> agency application records
          </div>
        </div>

        {/* APPLICATIONS TABLE */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-200 text-slate-700 uppercase font-black tracking-wider">
                <tr>
                  <th className="px-6 py-4">Application Code</th>
                  <th className="px-6 py-4">Agency & Owner</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Service Area</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-slate-800">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No partner applications match the selected filter.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-amber-50/50 transition-colors">
                      <td className="px-6 py-4 font-black text-amber-800">
                        {app.applicationCode}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-extrabold text-slate-900">{app.agencyName}</div>
                        <div className="text-[11px] text-slate-500">Owner: {app.ownerName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{app.phone}</div>
                        <div className="text-[11px] text-slate-500">{app.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{app.city}</div>
                        <div className="text-[11px] text-slate-500">{app.serviceAreasCount} local zone(s)</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>{app.teamsCount} Team(s)</div>
                        <div className="text-[11px] text-slate-500">{app.cleanerCount} Cleaner(s)</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(app.partnerStatus)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/partners/${app.id}`}
                          className="inline-flex items-center gap-1 bg-slate-900 hover:bg-black text-white px-3.5 py-1.5 rounded-xl font-extrabold text-xs shadow-xs transition-all"
                        >
                          Review <ChevronRight className="w-3.5 h-3.5 text-[#FACC15]" />
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
    </div>
  );
}
