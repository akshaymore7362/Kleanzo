'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Clock,
  Building,
  ShieldAlert,
  Zap,
  RefreshCw,
  XCircle,
  HelpCircle,
  ArrowRight,
  FileX
} from 'lucide-react';

interface SystemException {
  id: string;
  code: string;
  bookingCode: string;
  customerName: string;
  exceptionType: 'NO_AGENCY_AVAILABLE' | 'OFFER_EXPIRED' | 'CREW_NO_SHOW' | 'PROOF_REJECTED' | 'DISPUTE_OPENED' | 'SLA_BREACH';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  durationMinutes: number;
  description: string;
  recommendedAction: string;
}

export default function AdminExceptionsClientView() {
  const [notice, setNotice] = useState<string | null>(null);

  const [exceptions, setExceptions] = useState<SystemException[]>([
    {
      id: 'exc-1',
      code: 'EXC-101',
      bookingCode: 'KZ-10231',
      customerName: 'Rahul Jaykar',
      exceptionType: 'NO_AGENCY_AVAILABLE',
      severity: 'CRITICAL',
      durationMinutes: 18,
      description: 'System completed 2 broadcast rounds in pincode 411045, but no agency accepted within 15 mins.',
      recommendedAction: 'Manually assign to Preferred Partner CleanPro or contact operations team.',
    },
    {
      id: 'exc-2',
      code: 'EXC-102',
      bookingCode: 'KZ-10235',
      customerName: 'Neha Mehta',
      exceptionType: 'DISPUTE_OPENED',
      severity: 'HIGH',
      durationMinutes: 120,
      description: 'Customer raised complaint regarding missed balcony grout cleaning after job completion.',
      recommendedAction: 'Trigger Rework Job Dispatch or approve partial refund of ₹1,200.',
    },
    {
      id: 'exc-3',
      code: 'EXC-103',
      bookingCode: 'KZ-10239',
      customerName: 'Karan Malhotra',
      exceptionType: 'SLA_BREACH',
      severity: 'HIGH',
      durationMinutes: 35,
      description: 'Crew marked "On The Way" but has not marked "Arrived" 30 minutes past scheduled slot time.',
      recommendedAction: 'Call Agency Supervisor (CleanPro) or reassign emergency crew.',
    },
  ]);

  const handleResolve = (id: string, actionName: string) => {
    setNotice(`Resolving exception ${id} via action: ${actionName}...`);
    setTimeout(() => {
      setExceptions(prev => prev.filter(e => e.id !== id));
      setNotice(`Exception ${id} resolved successfully.`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-6 sm:p-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-red-600 tracking-wider uppercase mb-1">
            <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" /> Emergency Operations Inbox
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" /> Admin Exceptions & SLA Breach Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Centralized workspace for abnormal execution conditions: failed agency broadcasts, crew no-shows, SLA breaches, and proof rejections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/dispatch"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
          >
            <Building className="w-4 h-4" /> Open Master Dispatch Center
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
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-emerald-700 font-black">Dismiss</button>
        </div>
      )}

      {/* Exception Cards */}
      <div className="space-y-4">
        {exceptions.map((exc) => (
          <div key={exc.id} className="bg-white border border-red-200 rounded-3xl p-6 shadow-xs hover:shadow-md transition space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-xl">
                  {exc.code}
                </span>
                <span className="text-sm font-black text-slate-900">Booking: {exc.bookingCode}</span>
                <span className="text-xs text-slate-500 font-bold">({exc.customerName})</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2.5 py-1 rounded-full font-black text-[10px] ${
                  exc.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-500 text-slate-900'
                }`}>
                  {exc.severity} SEVERITY
                </span>
                <span className="text-slate-500 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Active {exc.durationMinutes}m
                </span>
              </div>
            </div>

            <div className="text-xs space-y-2">
              <div className="text-slate-800 font-bold">
                <strong>Exception Breakdown: </strong> {exc.description}
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-amber-900 font-bold flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] uppercase text-amber-700 font-black">Recommended Admin Action:</div>
                  <div>{exc.recommendedAction}</div>
                </div>
              </div>
            </div>

            {/* Quick Resolution Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => handleResolve(exc.id, 'FORCE_DISPATCH')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-xs"
              >
                <Zap className="w-3.5 h-3.5" /> Execute Force Dispatch Override
              </button>
              <button
                onClick={() => handleResolve(exc.id, 'APPROVE_REWORK')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Dispatch Rework Crew
              </button>
            </div>

          </div>
        ))}

        {exceptions.length === 0 && (
          <div className="bg-white border border-gray-200 p-12 rounded-3xl text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">Zero Active System Exceptions!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All bookings, dispatches, crew assignments, and QC proof verifications are running smoothly within SLA boundaries.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
