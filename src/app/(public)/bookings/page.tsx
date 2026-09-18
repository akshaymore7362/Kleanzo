'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  Star,
  RefreshCw,
  Plus,
  Sparkles,
  MessageSquare,
  Building2,
  Check,
  CreditCard,
  LogOut,
  UserCheck,
  Camera,
  ThumbsUp,
  AlertCircle,
} from 'lucide-react';
import { updateBookingStatusAction } from '@/actions/booking-actions';

interface BookingRecord {
  id: string;
  realDbId?: string;
  bookingCode: string;
  customerName?: string;
  serviceName?: string;
  bookingStatus: string;
  scheduledDate: string;
  scheduledTime: string;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  advanceAmount: number;
  balanceAmount: number;
  paymentStatus: string;
  hasScope: boolean;
  inspectionCompleted: boolean;
  qcPassed: boolean;
  customerApproved: boolean;
  scopeDetails?: string;
  propertyAddress?: string;
}

export default function CustomerBookingsPage() {
  const [allBookings, setAllBookings] = useState<BookingRecord[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Default Demo Booking matching Image exact ID KZ-PNE001
  const defaultDemoBooking: BookingRecord = {
    id: 'KZ-PNE001',
    bookingCode: 'KZ-PNE001',
    customerName: 'Rahul Jaykar',
    serviceName: '3 BHK Deep Cleaning',
    bookingStatus: 'CLEANING_IN_PROGRESS',
    scheduledDate: '24 May 2025',
    scheduledTime: '10:00 AM - 12:00 PM',
    subtotal: 6099,
    gstAmount: 1134,
    totalAmount: 7233,
    advanceAmount: 2230,
    balanceAmount: 5003,
    paymentStatus: 'ADVANCE_PAID',
    hasScope: true,
    inspectionCompleted: true,
    qcPassed: false,
    customerApproved: false,
    scopeDetails: 'Full 3 BHK Systematic Deep Cleaning including Kitchen Deep Cleaning & Bathroom Deep Cleaning.',
    propertyAddress: 'Flat 101, Blue Ridge, Wakad, Pune 411057',
  };

  const loadBookings = () => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('kleanzo_real_bookings');
        if (stored) {
          const parsed: BookingRecord[] = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            setAllBookings(parsed);
            if (!selectedBookingId) {
              setSelectedBookingId(parsed[0].id);
            }
            setLoading(false);
            return;
          }
        }
      }
    } catch (e) {
      console.error('Error loading localStorage bookings:', e);
    }
    setAllBookings([defaultDemoBooking]);
    setSelectedBookingId(defaultDemoBooking.id);
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const activeBooking =
    allBookings.find((b) => b.id === selectedBookingId || b.bookingCode === selectedBookingId) ||
    allBookings[0] ||
    defaultDemoBooking;

  const showNotice = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  const handleUpdateStatus = async (newStatus: string, msg: string) => {
    showNotice(msg);
    if (activeBooking.realDbId) {
      await updateBookingStatusAction(activeBooking.realDbId, newStatus);
    }

    const updatedBookings = allBookings.map((b) => {
      if (b.id === activeBooking.id) {
        const isApproved = newStatus === 'CUSTOMER_APPROVED' || newStatus === 'PAYMENT_COMPLETED' || newStatus === 'CLOSED';
        const isQcPassed = newStatus === 'QC_PASSED' || isApproved;
        const isInspectionDone = newStatus === 'INSPECTION_COMPLETED' || newStatus === 'CLEANING_IN_PROGRESS' || isQcPassed;

        return {
          ...b,
          bookingStatus: newStatus,
          inspectionCompleted: isInspectionDone ? true : b.inspectionCompleted,
          qcPassed: isQcPassed ? true : b.qcPassed,
          customerApproved: isApproved ? true : b.customerApproved,
          paymentStatus: newStatus === 'PAYMENT_COMPLETED' || newStatus === 'CLOSED' ? 'PAID' : b.paymentStatus,
        };
      }
      return b;
    });

    setAllBookings(updatedBookings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kleanzo_real_bookings', JSON.stringify(updatedBookings));
    }
  };

  // Exact 8-Step Timeline matching Reference Image (Bottom Right)
  const timelineSteps = [
    { title: 'Booking Confirmed', date: '24 May 2025', time: '09:30 AM', status: 'COMPLETED' },
    { title: 'Team Assigned', date: '24 May 2025', time: '11:00 AM', status: 'COMPLETED' },
    { title: 'Site Inspection', date: '24 May 2025', time: '09:45 AM', status: activeBooking.inspectionCompleted ? 'COMPLETED' : 'PENDING' },
    {
      title: 'Cleaning in Progress',
      date: '24 May 2025',
      time: '10:00 AM',
      status: activeBooking.bookingStatus === 'CLEANING_IN_PROGRESS' ? 'IN_PROGRESS' : activeBooking.qcPassed ? 'COMPLETED' : 'PENDING',
    },
    { title: 'Quality Check', date: 'Pending', time: '', status: activeBooking.qcPassed ? 'COMPLETED' : 'PENDING' },
    { title: 'Your Approval', date: 'Pending', time: '', status: activeBooking.customerApproved ? 'COMPLETED' : 'PENDING' },
    { title: 'Payment Due', date: 'Pending', time: '', status: activeBooking.paymentStatus === 'PAID' ? 'COMPLETED' : 'PENDING' },
    { title: 'Completed', date: 'Pending', time: '', status: activeBooking.bookingStatus === 'CLOSED' ? 'COMPLETED' : 'PENDING' },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-block bg-[#FEF3C7] text-[#92400E] px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-2 border border-[#FDE68A]">
              CUSTOMER PORTAL • LIVE TRACKING
            </div>
            <h1 className="text-3xl font-black text-[#111111]">
              Track Your Booking – <span className="text-[#E8B619]">{activeBooking.bookingCode}</span>
            </h1>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Service: <span className="text-black font-bold">{activeBooking.serviceName}</span> | Date: {activeBooking.scheduledDate} ({activeBooking.scheduledTime})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {allBookings.length > 1 && (
              <select
                value={activeBooking.id}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="bg-white border border-gray-300 font-extrabold text-xs px-3.5 py-2.5 rounded-full shadow-xs focus:outline-none focus:border-[#E8B619] cursor-pointer"
              >
                {allBookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bookingCode} - {b.serviceName}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={loadBookings}
              className="bg-gray-100 hover:bg-gray-200 text-black font-bold text-xs px-3.5 py-2.5 rounded-full border border-gray-300 transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gray-600" /> Refresh
            </button>

            <Link
              href="/bookings/new"
              className="bg-[#E8B619] hover:bg-[#D4A512] text-black font-extrabold text-xs px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> New Booking
            </Link>
          </div>
        </div>

        {/* Notice Banner */}
        {noticeMessage && (
          <div className="bg-[#E8B619] text-black px-6 py-3 rounded-2xl font-black text-xs flex items-center justify-between shadow-md animate-fade-in">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> {noticeMessage}
            </span>
            <button onClick={() => setNoticeMessage(null)} className="text-sm font-black">✕</button>
          </div>
        )}

        {/* 8-STEP TIMELINE STEPPER CARD (Matching Reference Image) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="text-lg font-black text-[#111111]">
              Track Your Booking – {activeBooking.bookingCode}
            </h2>
            <span className="text-xs font-black bg-amber-100 text-[#92400E] px-3.5 py-1 rounded-full uppercase border border-[#FDE68A]">
              Stage: {activeBooking.bookingStatus.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 relative">
            {timelineSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-center flex flex-col justify-between transition-all ${
                  step.status === 'COMPLETED'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : step.status === 'IN_PROGRESS'
                    ? 'bg-amber-50 border-[#E8B619] text-black ring-2 ring-[#E8B619]'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
              >
                <div>
                  <div className="w-7 h-7 rounded-full bg-white mx-auto flex items-center justify-center font-black text-xs mb-2 border border-gray-200 shadow-xs">
                    {step.status === 'COMPLETED' ? (
                      <span className="text-emerald-600">✓</span>
                    ) : step.status === 'IN_PROGRESS' ? (
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-extrabold block leading-tight">{step.title}</span>
                </div>
                <div className="text-[9px] font-bold text-gray-500 mt-2">
                  <div>{step.date}</div>
                  <div>{step.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3-COLUMN CONTENT GRID: LIVE UPDATE + BEFORE/AFTER PHOTOS + NEED HELP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Live Update Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#92400E] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full border border-[#FDE68A]">
                LIVE UPDATE
              </span>
              <h3 className="text-sm font-black text-[#111111] mt-3">Cleaning Status</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1">
                Our team is currently cleaning your home. We will update you once cleaning is complete.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-3 border-t border-gray-100">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#92400E] flex items-center justify-center font-black text-xs shrink-0">
                🧹
              </div>
              <div className="text-[11px] font-bold text-gray-700">
                Cleaners On Site • Baner/Wakad Crew
              </div>
            </div>
          </div>

          {/* Before & After Cleaning Photos Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md space-y-3">
            <h3 className="text-sm font-black text-[#111111]">Before & After Photos</h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-gray-400 block mb-1">Before Cleaning</span>
                <div className="h-24 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80"
                    alt="Before cleaning"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 block mb-1">After Cleaning</span>
                <div className="h-24 bg-amber-50 rounded-2xl border border-dashed border-[#E8B619] flex items-center justify-center text-[10px] font-bold text-gray-500 text-center p-2">
                  Will be updated soon
                </div>
              </div>
            </div>
          </div>

          {/* Need Help WhatsApp Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-[#111111]">Need Help?</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
                Chat with our support team directly on WhatsApp for any site questions.
              </p>
            </div>

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Chat Now
            </a>
          </div>

        </div>

        {/* Customer Inspection & QC Approval Actions */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md space-y-4">
          <h3 className="text-base font-black text-[#111111]">Quality Check & Balance Payment Actions</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {!activeBooking.qcPassed ? (
              <button
                onClick={() => handleUpdateStatus('QC_PASSED', 'Quality Check (QC) passed!')}
                className="p-4 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-2xl text-left transition-all cursor-pointer"
              >
                <span className="font-extrabold text-xs text-[#92400E] block">1. Confirm QC Inspection</span>
                <span className="text-[11px] text-gray-600 block mt-0.5">Mark Quality Check as Passed</span>
              </button>
            ) : (
              <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs font-black text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Quality Check Passed ✓</span>
              </div>
            )}

            {!activeBooking.customerApproved ? (
              <button
                onClick={() => handleUpdateStatus('CUSTOMER_APPROVED', 'Customer approval confirmed!')}
                className="p-4 bg-amber-50 hover:bg-amber-100 border border-[#E8B619] rounded-2xl text-left transition-all cursor-pointer"
              >
                <span className="font-black text-xs text-black block">2. Customer Approval</span>
                <span className="text-[11px] text-gray-600 block mt-0.5">Approve site handover</span>
              </button>
            ) : (
              <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs font-black text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Customer Approved ✓</span>
              </div>
            )}

            {activeBooking.paymentStatus === 'PAID' ? (
              <button
                onClick={() => alert(`Downloading Invoice for ${activeBooking.bookingCode}...`)}
                className="p-4 bg-[#E8B619] text-black rounded-2xl text-left font-black text-xs flex items-center justify-between cursor-pointer"
              >
                <span>Download Invoice</span>
                <Download className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => handleUpdateStatus('PAYMENT_COMPLETED', 'Balance payment completed!')}
                className="p-4 bg-[#111111] hover:bg-black text-[#E8B619] rounded-2xl text-left transition-all cursor-pointer"
              >
                <span className="font-black text-xs block">3. Pay Balance ₹{activeBooking.balanceAmount.toLocaleString()}</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">Complete final payment</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
