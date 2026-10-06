'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wallet,
  DollarSign,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  FileText,
  CreditCard,
  Download
} from 'lucide-react';

interface PayoutRecord {
  id: string;
  payoutCode: string;
  bookingCount: number;
  grossAmount: number;
  commissionDeduction: number;
  penaltyDeduction: number;
  netPayoutAmount: number;
  status: 'PAID' | 'PENDING' | 'ON_HOLD' | 'DISPUTED';
  requestedDate: string;
  processedDate?: string;
  utrReference?: string;
}

export default function AgencyEarningsClientView() {
  const [notice, setNotice] = useState<string | null>(null);

  const [payouts, setPayouts] = useState<PayoutRecord[]>([
    {
      id: 'pay-1',
      payoutCode: 'PAY-2026-1001',
      bookingCount: 14,
      grossAmount: 48500,
      commissionDeduction: 7275,
      penaltyDeduction: 0,
      netPayoutAmount: 41225,
      status: 'PAID',
      requestedDate: '01 Oct 2026',
      processedDate: '03 Oct 2026',
      utrReference: 'UTR998822334411',
    },
    {
      id: 'pay-2',
      payoutCode: 'PAY-2026-1002',
      bookingCount: 8,
      grossAmount: 26400,
      commissionDeduction: 3960,
      penaltyDeduction: 500,
      netPayoutAmount: 21940,
      status: 'PENDING',
      requestedDate: '05 Oct 2026',
    },
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-6 sm:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-amber-600 tracking-wider uppercase mb-1">
            <Building className="w-4 h-4 text-amber-500" /> Agency Financial Center
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-[#E8B619]" /> Partner Earnings & Payout Ledger
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Transparent view of gross earnings, Kleanzo commission breakdowns, penalty deductions, and bank payout history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setNotice('Payout withdrawal request submitted to admin')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
          >
            <CreditCard className="w-4 h-4" /> Request Payout Withdrawal
          </button>
          <Link
            href="/agency/dashboard"
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

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-sm space-y-2">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Available For Payout</div>
          <div className="text-3xl font-black">₹21,940</div>
          <p className="text-[11px] text-slate-300">Ready for instant bank transfer</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending / In Review</div>
          <div className="text-2xl font-black text-slate-900">₹8,450</div>
          <p className="text-[11px] text-slate-500">From recently completed jobs awaiting customer review</p>
        </div>

        <div className="bg-white border border-emerald-200 p-6 rounded-3xl shadow-xs space-y-2">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total Disbursed</div>
          <div className="text-2xl font-black text-emerald-900">₹41,225</div>
          <p className="text-[11px] text-slate-500">Processed payouts to bank account</p>
        </div>

        <div className="bg-white border border-red-200 p-6 rounded-3xl shadow-xs space-y-2">
          <div className="text-xs font-bold text-red-600 uppercase tracking-wider">Penalties / Holds</div>
          <div className="text-2xl font-black text-red-600">₹500</div>
          <p className="text-[11px] text-slate-500">Deduction applied for late crew arrival SLA breach</p>
        </div>
      </div>

      {/* Payout History Ledger Table */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" /> Payout Disbursement History
          </h2>
          <span className="text-xs font-bold text-slate-500">Auto-calculated Kleanzo 15% Platform Commission</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3">Payout ID</th>
                <th className="p-3">Jobs Included</th>
                <th className="p-3">Gross Booking Value</th>
                <th className="p-3">Commission (15%)</th>
                <th className="p-3">Penalties</th>
                <th className="p-3">Net Payout</th>
                <th className="p-3">Status</th>
                <th className="p-3">UTR Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-slate-700">
              {payouts.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-black text-slate-900">{pay.payoutCode}</td>
                  <td className="p-3 font-bold text-slate-800">{pay.bookingCount} jobs</td>
                  <td className="p-3">₹{pay.grossAmount.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-red-600">-₹{pay.commissionDeduction.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-red-600">-₹{pay.penaltyDeduction.toLocaleString('en-IN')}</td>
                  <td className="p-3 font-black text-emerald-700 text-sm">₹{pay.netPayoutAmount.toLocaleString('en-IN')}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black ${
                      pay.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {pay.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-600">
                    {pay.utrReference || <span className="text-slate-400 font-sans italic">Processing...</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
