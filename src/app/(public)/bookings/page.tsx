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
  X,
  HelpCircle,
} from 'lucide-react';
import { updateBookingStatusAction, submitCustomerRatingAction } from '@/actions/booking-actions';
import type { WorkflowStatus } from '@/lib/booking/workflow-engine';

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
  rating?: number;
  comments?: string;
}

export default function CustomerBookingsPage() {
  const [allBookings, setAllBookings] = useState<BookingRecord[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Tab Filtering
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ACTIVE');

  // Rating Modal State
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingScores, setRatingScores] = useState({
    quality: 5,
    punctuality: 5,
    behaviour: 5,
    overall: 5,
    comments: '',
  });

  // Issue Reporting Modal State
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');

  // Default Demo Booking matching Image exact ID KZ-PNE001
  const defaultDemoBooking: BookingRecord = {
    id: 'KZ-PNE001',
    bookingCode: 'KZ-PNE001',
    customerName: 'Rahul Jaykar',
    serviceName: '3 BHK Deep Cleaning',
    bookingStatus: 'CLEANING_IN_PROGRESS',
    scheduledDate: '24 Sep 2026',
    scheduledTime: '10:00 AM - 12:00 PM',
    subtotal: 6099,
    gstAmount: 1134,
    totalAmount: 7233,
    advanceAmount: 2000,
    balanceAmount: 5233,
    paymentStatus: 'ADVANCE_PAID',
    hasScope: true,
    inspectionCompleted: true,
    qcPassed: false,
    customerApproved: false,
    scopeDetails: 'Full 3 BHK Systematic Deep Cleaning including Kitchen Deep Cleaning & Bathroom Deep Cleaning.',
    propertyAddress: 'Flat 402, Rosewood Heights, Wakad, Pune 411057',
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

  const handleUpdateStatus = async (newStatus: WorkflowStatus, msg: string) => {
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

  const handleSubmitRating = async () => {
    showNotice('Thank you! Your 5-star Kleanzo rating & review has been submitted.');
    setShowRatingModal(false);
    
    await submitCustomerRatingAction({
      bookingId: activeBooking.realDbId || activeBooking.id || activeBooking.bookingCode,
      quality: ratingScores.quality,
      punctuality: ratingScores.punctuality,
      behaviour: ratingScores.behaviour,
      overall: ratingScores.overall,
      comments: ratingScores.comments,
    });

    const updatedBookings = allBookings.map((b) =>
      b.id === activeBooking.id ? { ...b, rating: ratingScores.overall, comments: ratingScores.comments } : b
    );
    setAllBookings(updatedBookings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kleanzo_real_bookings', JSON.stringify(updatedBookings));
    }
  };

  const handleSubmitIssue = () => {
    showNotice('Issue reported. Kleanzo Operations notified for quality rework.');
    setShowIssueModal(false);
    handleUpdateStatus('CORRECTION_REQUIRED', 'Rework request created.');
  };

  // Timeline matching Prompt (Phase 25)
  const timelineSteps = [
    { title: 'Booking Confirmed', date: '24 Sep 2026', time: '09:30 AM', status: 'COMPLETED' },
    { title: 'Kleanzo Confirmed', date: '24 Sep 2026', time: '09:45 AM', status: 'COMPLETED' },
    { title: 'Professional Assigned', date: '24 Sep 2026', time: '10:00 AM', status: 'COMPLETED' },
    { title: 'Professional En Route', date: '24 Sep 2026', time: '10:15 AM', status: 'COMPLETED' },
    {
      title: 'Cleaning In Progress',
      date: '24 Sep 2026',
      time: '10:30 AM',
      status: activeBooking.bookingStatus === 'CLEANING_IN_PROGRESS' ? 'IN_PROGRESS' : activeBooking.qcPassed ? 'COMPLETED' : 'PENDING',
    },
    { title: 'Quality Check', date: 'Pending', time: '', status: activeBooking.qcPassed ? 'COMPLETED' : 'PENDING' },
    { title: 'Customer Approval', date: 'Pending', time: '', status: activeBooking.customerApproved ? 'COMPLETED' : 'PENDING' },
    { title: 'Completed', date: 'Pending', time: '', status: activeBooking.bookingStatus === 'CLOSED' ? 'COMPLETED' : 'PENDING' },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & Tabs */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-block bg-[#FEF08A] text-amber-900 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-2 border border-[#FDE047]">
              CUSTOMER PORTAL • LIVE TRACKING
            </div>
            <h1 className="text-3xl font-black text-black">
              Track Your Booking – <span className="text-black underline">{activeBooking.bookingCode}</span>
            </h1>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Service: <span className="text-black font-bold">{activeBooking.serviceName}</span> | Date: {activeBooking.scheduledDate} ({activeBooking.scheduledTime})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadBookings}
              className="bg-gray-100 hover:bg-gray-200 text-black font-bold text-xs px-3.5 py-2 rounded-xl border border-gray-300 transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gray-600" /> Refresh
            </button>

            <Link
              href="/bookings/new"
              className="bg-[#FACC15] hover:bg-[#EAB308] text-black font-extrabold text-xs px-5 py-2 rounded-xl shadow-sm transition-all uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> New Booking
            </Link>
          </div>
        </div>

        {/* Tab Filters: Upcoming | Active | Completed | Cancelled */}
        <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-1 max-w-md">
          {['UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === tabKey ? 'bg-[#FACC15] text-black shadow-sm' : 'text-gray-600 hover:text-black'
              }`}
            >
              {tabKey}
            </button>
          ))}
        </div>

        {/* Notice Banner */}
        {noticeMessage && (
          <div className="bg-[#FACC15] text-black px-6 py-3 rounded-2xl font-black text-xs flex items-center justify-between shadow-md">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 fill-black" /> {noticeMessage}
            </span>
            <button onClick={() => setNoticeMessage(null)} className="text-sm font-black">✕</button>
          </div>
        )}

        {/* 8-STEP TIMELINE STEPPER CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="text-base font-black text-black">
              Booking Pipeline — {activeBooking.bookingCode}
            </h2>
            <span className="text-xs font-black bg-[#FEF08A] text-amber-900 px-3.5 py-1 rounded-full uppercase border border-[#FDE047]">
              Status: {activeBooking.bookingStatus.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {timelineSteps.map((stepItem, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-center flex flex-col justify-between transition-all ${
                  stepItem.status === 'COMPLETED'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : stepItem.status === 'IN_PROGRESS'
                    ? 'bg-[#FFFDF0] border-[#FACC15] text-black ring-2 ring-[#FACC15]'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
              >
                <div>
                  <div className="w-7 h-7 rounded-full bg-white mx-auto flex items-center justify-center font-black text-xs mb-2 border border-gray-200 shadow-xs">
                    {stepItem.status === 'COMPLETED' ? (
                      <span className="text-emerald-600">✓</span>
                    ) : stepItem.status === 'IN_PROGRESS' ? (
                      <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-extrabold block leading-tight">{stepItem.title}</span>
                </div>
                <div className="text-[9px] font-bold text-gray-500 mt-2">
                  <div>{stepItem.date}</div>
                  <div>{stepItem.time}</div>
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
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-[#FEF08A] px-2.5 py-0.5 rounded-full border border-[#FDE047]">
                LIVE UPDATE
              </span>
              <h3 className="text-sm font-black text-black mt-3">Cleaning Execution</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed mt-1">
                Apex Cleaning Services is currently cleaning your home. We will notify you once cleaning and supervisor QC are completed.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-3 border-t border-gray-100">
              <div className="w-10 h-10 rounded-2xl bg-[#FACC15] text-black flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                🧹
              </div>
              <div className="text-[11px] font-bold text-gray-700">
                4 Cleaners + 1 Supervisor On Site
              </div>
            </div>
          </div>

          {/* Before & After Cleaning Photos Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md space-y-3">
            <h3 className="text-sm font-black text-black">Before & After Photos</h3>

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
                <div className="h-24 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"
                    alt="After cleaning"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Support Box */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-black">Kleanzo Support</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
                Chat directly with Kleanzo Operations for any job or scope questions.
              </p>
            </div>

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Chat with Kleanzo
            </a>
          </div>
        </div>

        {/* Customer Inspection & Approval / Issue Reporting Actions */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md space-y-4">
          <h3 className="text-base font-black text-black">Handover Approval & Feedback</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {!activeBooking.customerApproved ? (
              <button
                type="button"
                onClick={() => handleUpdateStatus('CUSTOMER_APPROVED', 'Customer approval recorded! Thank you.')}
                className="p-4 bg-[#FACC15] hover:bg-[#EAB308] text-black rounded-2xl text-left transition cursor-pointer shadow-sm"
              >
                <span className="font-black text-xs block">APPROVE COMPLETION ✓</span>
                <span className="text-[11px] text-gray-800 block mt-0.5">Confirm job handover</span>
              </button>
            ) : (
              <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs font-black text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Job Approved ✓</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowIssueModal(true)}
              className="p-4 bg-white hover:bg-red-50 border border-red-300 rounded-2xl text-left transition cursor-pointer"
            >
              <span className="font-black text-xs text-red-600 block">REPORT AN ISSUE</span>
              <span className="text-[11px] text-gray-500 block mt-0.5">Trigger rework request</span>
            </button>

            <button
              type="button"
              onClick={() => setShowRatingModal(true)}
              className="p-4 bg-[#FEF08A] hover:bg-[#FDE047] border border-[#FDE047] text-amber-950 rounded-2xl text-left transition cursor-pointer flex items-center justify-between shadow-xs"
            >
              <div>
                <span className="font-black text-xs block text-amber-950">RATE EXPERIENCE</span>
                <span className="text-[11px] text-amber-900 font-semibold block mt-0.5">Submit 5-star rating</span>
              </div>
              <Star className="w-5 h-5 text-amber-600 fill-amber-500" />
            </button>
          </div>
        </div>
      </div>

      {/* RATING & REVIEW MODAL */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-black">Rate your Kleanzo experience</h3>
              <button type="button" onClick={() => setShowRatingModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-3 text-xs font-bold text-gray-700">
              <div>
                <label className="block mb-1">Overall Rating:</label>
                <div className="flex gap-1 text-lg">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingScores({ ...ratingScores, overall: star })}
                      className="cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${star <= ratingScores.overall ? 'text-[#FACC15] fill-[#FACC15]' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-1">Comments & Feedback:</label>
                <textarea
                  rows={3}
                  value={ratingScores.comments}
                  onChange={(e) => setRatingScores({ ...ratingScores, comments: e.target.value })}
                  placeholder="Tell us about your experience..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmitRating}
              className="w-full bg-[#FACC15] hover:bg-[#EAB308] text-black font-black text-xs py-3 rounded-xl uppercase tracking-wider"
            >
              SUBMIT REVIEW
            </button>
          </div>
        </div>
      )}

      {/* ISSUE REPORTING MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-black">Report an Issue</h3>
              <button type="button" onClick={() => setShowIssueModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <p className="text-xs text-gray-500 font-medium">
              Describe the issue below. Kleanzo Operations will arrange a re-cleaning session with the partner agency.
            </p>

            <textarea
              rows={4}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="e.g. Balcony glass left uncleaned, grout stains remaining..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none"
            />

            <button
              type="button"
              onClick={handleSubmitIssue}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs py-3 rounded-xl uppercase tracking-wider"
            >
              REQUEST REWORK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

