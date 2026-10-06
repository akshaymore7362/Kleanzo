'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Building,
  User,
  ShieldCheck,
  Clock,
  Trash2,
  CheckCheck
} from 'lucide-react';

interface NotificationItem {
  id: string;
  roleTarget: 'CUSTOMER' | 'AGENCY' | 'ADMIN';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationsClientView() {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'ALL' | 'CUSTOMER' | 'AGENCY' | 'ADMIN'>('ALL');
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      roleTarget: 'CUSTOMER',
      title: 'Kleanzo Service Team Assigned',
      message: 'Your service partner and crew have been assigned for Booking #KZ-10231 scheduled for 10 Oct, 10:00 AM.',
      timestamp: '10 mins ago',
      read: false,
      actionUrl: '/bookings',
    },
    {
      id: 'notif-2',
      roleTarget: 'AGENCY',
      title: 'New High-Value Job Broadcast Offer',
      message: 'New job broadcast in Pincode 411045 (3 BHK Deep Cleaning, ₹5,309 payout). Expiration timer: 12 minutes.',
      timestamp: '15 mins ago',
      read: false,
      actionUrl: '/agency/jobs',
    },
    {
      id: 'notif-3',
      roleTarget: 'ADMIN',
      title: 'KYC Document Verification Required',
      message: 'SparklePro Services submitted GST certificate and Aadhaar documents for onboarding review.',
      timestamp: '1 hour ago',
      read: true,
      actionUrl: '/admin/partners',
    },
    {
      id: 'notif-4',
      roleTarget: 'CUSTOMER',
      title: 'Service Completed & Invoice Ready',
      message: 'Your 2 BHK Deep Cleaning service #KZ-10228 is complete! Click to view before/after proof and download tax invoice.',
      timestamp: 'Yesterday',
      read: true,
      actionUrl: '/bookings',
    }
  ]);

  const filtered = notifications.filter(n => {
    if (selectedRoleFilter === 'ALL') return true;
    return n.roleTarget === selectedRoleFilter;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-6 sm:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-amber-600 tracking-wider uppercase mb-1">
            <Bell className="w-4 h-4 text-amber-500" /> Platform Communication Hub
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Multi-Tenant Notification Center
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time operational alerts for Customer updates, Partner Agency job dispatches, and Admin KYC/SLA exceptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={markAllRead}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-gray-200 rounded-2xl text-xs font-bold transition flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4 text-slate-600" /> Mark All as Read
          </button>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
        {(['ALL', 'CUSTOMER', 'AGENCY', 'ADMIN'] as const).map(role => (
          <button
            key={role}
            onClick={() => setSelectedRoleFilter(role)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${
              selectedRoleFilter === role
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {role === 'ALL' ? 'All Roles' : `${role} Alerts`}
          </button>
        ))}
      </div>

      {/* Notification Items */}
      <div className="space-y-4">
        {filtered.map((n) => (
          <div
            key={n.id}
            className={`p-6 rounded-3xl border transition flex items-start justify-between gap-4 ${
              !n.read ? 'bg-amber-50/50 border-amber-300 shadow-xs' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl shrink-0 ${
                n.roleTarget === 'CUSTOMER' ? 'bg-indigo-100 text-indigo-700' :
                n.roleTarget === 'AGENCY' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-900'
              }`}>
                {n.roleTarget === 'CUSTOMER' ? <User className="w-5 h-5" /> :
                 n.roleTarget === 'AGENCY' ? <Building className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900">{n.title}</h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md uppercase bg-slate-100 text-slate-700">
                    {n.roleTarget}
                  </span>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-ping" />
                  )}
                </div>
                <p className="text-xs text-slate-600 font-medium">{n.message}</p>
                <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 pt-1">
                  <Clock className="w-3 h-3" /> {n.timestamp}
                </div>
              </div>
            </div>

            {n.actionUrl && (
              <Link
                href={n.actionUrl}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold whitespace-nowrap transition"
              >
                View Details
              </Link>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
