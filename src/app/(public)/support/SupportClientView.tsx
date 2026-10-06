'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  MessageSquare,
  Plus,
  CheckCircle2,
  Clock,
  Building,
  User,
  Send,
  AlertTriangle
} from 'lucide-react';

interface SupportTicket {
  id: string;
  ticketCode: string;
  category: 'BOOKING' | 'PAYMENT' | 'QUALITY' | 'CREW' | 'AGENCY_DISPUTE' | 'OTHER';
  subject: string;
  createdByRole: 'CUSTOMER' | 'AGENCY';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_USER' | 'RESOLVED';
  createdAt: string;
}

export default function SupportClientView() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'tick-1',
      ticketCode: 'TICK-901',
      category: 'QUALITY',
      subject: 'Balcony grout stains missed during deep clean',
      createdByRole: 'CUSTOMER',
      status: 'IN_PROGRESS',
      createdAt: '09 Oct 2026',
    },
    {
      id: 'tick-2',
      ticketCode: 'TICK-902',
      category: 'PAYMENT',
      subject: 'Inquiry regarding payout withdrawal processing timeline',
      createdByRole: 'AGENCY',
      status: 'OPEN',
      createdAt: '10 Oct 2026',
    }
  ]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice('Support ticket created successfully! Admin operations team notified.');
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-6 sm:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-amber-600 tracking-wider uppercase mb-1">
            <HelpCircle className="w-4 h-4 text-amber-500" /> Customer & Partner Support
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Multi-Tenant Support & Resolution Workspace
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Submit service inquiries, report execution issues, resolve payment questions, and track resolution tickets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Create Support Ticket
          </button>
        </div>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-emerald-700 font-black">Dismiss</button>
        </div>
      )}

      {/* Ticket List */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-500" /> Active Support Tickets
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-3">Ticket ID</th>
                <th className="p-3">Category</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-slate-700">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-black text-slate-900">{ticket.ticketCode}</td>
                  <td className="p-3">
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                      {ticket.category}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-800">{ticket.subject}</td>
                  <td className="p-3 font-bold text-indigo-700">{ticket.createdByRole}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black ${
                      ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-800' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {ticket.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{ticket.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Mock */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-gray-200 shadow-xl">
            <h3 className="text-base font-black text-slate-900">Create New Support Ticket</h3>
            
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Issue Category</label>
                <select className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 font-semibold">
                  <option value="BOOKING">Booking & Scheduling</option>
                  <option value="QUALITY">Service Quality Concern</option>
                  <option value="PAYMENT">Payment or Refund Inquiry</option>
                  <option value="CREW">Crew / Field Staff Issue</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Short description of your issue..."
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Explanation</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide complete details..."
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-900 rounded-xl font-bold flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
