'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Building,
  Tag,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface EquipmentItem {
  id: string;
  code: string;
  name: string;
  category: string;
  status: 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE' | 'DAMAGED';
  assignedJobCode?: string;
  lastServicedDate: string;
}

export default function AgencyEquipmentClientView() {
  const [notice, setNotice] = useState<string | null>(null);
  const [items, setItems] = useState<EquipmentItem[]>([
    { id: 'eq-1', code: 'SD-001', name: 'Single Disc Floor Scrubber (17")', category: 'Floor Care', status: 'ASSIGNED', assignedJobCode: 'KZ-10231', lastServicedDate: '15 Sep 2026' },
    { id: 'eq-2', code: 'SD-002', name: 'Single Disc Floor Scrubber (17")', category: 'Floor Care', status: 'AVAILABLE', lastServicedDate: '20 Sep 2026' },
    { id: 'eq-3', code: 'IV-009', name: 'Industrial Wet & Dry Vacuum (80L)', category: 'Extraction', status: 'AVAILABLE', lastServicedDate: '01 Oct 2026' },
    { id: 'eq-4', code: 'SD-003', name: 'Steam Degreasing Machine', category: 'Kitchen Care', status: 'ASSIGNED', assignedJobCode: 'KZ-10234', lastServicedDate: '28 Sep 2026' },
    { id: 'eq-5', code: 'HP-004', name: 'High Pressure Water Jet (150 Bar)', category: 'Balcony/Facade', status: 'MAINTENANCE', lastServicedDate: '05 Oct 2026' },
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-6 sm:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-amber-600 tracking-wider uppercase mb-1">
            <Building className="w-4 h-4 text-amber-500" /> Agency Fulfillment Assets
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-[#E8B619]" /> Equipment Inventory & Job Tagging Hub
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Register heavy cleaning machinery, track operational availability, tag machines to active job assignments, and log maintenance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setNotice('Add new equipment modal opened')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Equipment
          </button>
          <Link
            href="/agency/dashboard"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-gray-200 rounded-2xl text-xs font-bold transition"
          >
            Agency Dashboard
          </Link>
        </div>
      </div>

      {notice && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-amber-700 font-black">Dismiss</button>
        </div>
      )}

      {/* Equipment Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-xs">
          <div className="text-slate-500 font-bold">Total Machinery</div>
          <div className="text-xl font-black text-slate-900 mt-1">{items.length}</div>
        </div>
        <div className="bg-white border border-emerald-200 p-4 rounded-2xl shadow-xs">
          <div className="text-emerald-700 font-bold">Available Now</div>
          <div className="text-xl font-black text-emerald-800 mt-1">{items.filter(i => i.status === 'AVAILABLE').length}</div>
        </div>
        <div className="bg-white border border-indigo-200 p-4 rounded-2xl shadow-xs">
          <div className="text-indigo-700 font-bold font-bold">Assigned to Jobs</div>
          <div className="text-xl font-black text-indigo-900 mt-1">{items.filter(i => i.status === 'ASSIGNED').length}</div>
        </div>
        <div className="bg-white border border-amber-200 p-4 rounded-2xl shadow-xs">
          <div className="text-amber-700 font-bold">In Maintenance</div>
          <div className="text-xl font-black text-amber-900 mt-1">{items.filter(i => i.status === 'MAINTENANCE').length}</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Tag className="w-5 h-5 text-amber-500" /> Equipment Inventory & Dispatch Tagging List
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3">Asset Code</th>
                <th className="p-3">Equipment Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Tagged Booking</th>
                <th className="p-3">Last Service</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-slate-700">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-black text-slate-900">{item.code}</td>
                  <td className="p-3 font-bold text-slate-800">{item.name}</td>
                  <td className="p-3 text-slate-500">{item.category}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black ${
                      item.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'ASSIGNED' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 font-extrabold text-indigo-700">
                    {item.assignedJobCode || <span className="text-slate-400 font-normal">—</span>}
                  </td>
                  <td className="p-3 text-slate-500">{item.lastServicedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
