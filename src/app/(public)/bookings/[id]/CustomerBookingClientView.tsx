'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  Star, 
  ArrowLeft,
  DollarSign,
  AlertCircle,
  Truck,
  Building
} from 'lucide-react';
import { submitCustomerRatingAction } from '@/actions/booking-actions';

interface CustomerBookingClientViewProps {
  booking: {
    id: string;
    bookingCode: string;
    customerName: string;
    customerPhone: string;
    serviceName: string;
    scheduledDate: string;
    scheduledTime: string;
    propertyType: string;
    address: string;
    city: string;
    bookingStatus: string;
    paymentStatus: string;
    subtotal: number;
    gstAmount: number;
    totalAmount: number;
    advanceAmount: number;
    balanceAmount: number;
    createdAt: string;
    assignedAgencyName: string;
    hasFeedback: boolean;
    existingRating?: number;
    existingComments?: string;
    additionalWorkRequests: {
      id: string;
      reason: string;
      description: string;
      requestedAmount: number;
      status: string;
    }[];
    statusHistory: {
      fromStatus: string;
      toStatus: string;
      remarks?: string;
      createdAt: string;
    }[];
  };
}

export default function CustomerBookingClientView({ booking }: CustomerBookingClientViewProps) {
  const [rating, setRating] = useState<number>(booking.existingRating || 5);
  const [quality, setQuality] = useState<number>(5);
  const [punctuality, setPunctuality] = useState<number>(5);
  const [comments, setComments] = useState<string>(booking.existingComments || '');
  const [submittingRating, setSubmittingRating] = useState<boolean>(false);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(booking.hasFeedback);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  // Map status to 7-Step Stepper Index (1 to 7)
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'ENQUIRY_RECEIVED':
      case 'BOOKING_PENDING_ADVANCE':
        return 1;
      case 'CONFIRMED':
      case 'ASSIGNMENT_PENDING':
      case 'AGENCY_REQUIRED':
        return 1;
      case 'PARTNER_PENDING_ACCEPTANCE':
      case 'PARTNER_ACCEPTED':
      case 'AGENCY_ASSIGNED':
      case 'AGENCY_ACCEPTED':
        return 2;
      case 'TEAM_ASSIGNED':
      case 'SCHEDULED':
        return 3;
      case 'ON_THE_WAY':
      case 'ARRIVED':
      case 'INSPECTION_PENDING':
      case 'INSPECTION_COMPLETED':
        return 4;
      case 'WORK_STARTED':
      case 'CLEANING_IN_PROGRESS':
        return 5;
      case 'WORK_COMPLETED':
      case 'QC_PENDING':
      case 'QC_PASSED':
      case 'VERIFICATION_PENDING':
        return 6;
      case 'VERIFIED':
      case 'COMPLETED':
      case 'CLOSED':
        return 7;
      default:
        return 1;
    }
  };

  const currentStep = getStepIndex(booking.bookingStatus);

  const steps = [
    { title: 'Booking Confirmed', desc: 'Advance payment received', icon: CheckCircle2 },
    { title: 'Professional Assigned', desc: 'Kleanzo verified professional assigned', icon: UserCheck },
    { title: 'Team Scheduled', desc: 'Equipment & team ready', icon: Calendar },
    { title: 'On The Way / Arrived', desc: 'Professional arriving at site', icon: Truck },
    { title: 'Service In Progress', desc: 'Deep cleaning & scrubbing', icon: Sparkles },
    { title: 'Kleanzo Verification', desc: 'Supervisor & Admin QC check', icon: ShieldCheck },
    { title: 'Service Completed', desc: 'Handover & satisfaction guaranteed', icon: Star },
  ];

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRating(true);
    setFeedbackMsg('');

    try {
      const res = await submitCustomerRatingAction({
        bookingId: booking.id,
        quality,
        punctuality,
        behaviour: 5,
        overall: rating,
        comments,
      });

      if (res.success) {
        setRatingSubmitted(true);
        setFeedbackMsg('Thank you for rating Kleanzo! Your feedback helps us maintain top quality.');
      } else {
        setFeedbackMsg(res.error || 'Failed to submit feedback');
      }
    } catch (err: any) {
      setFeedbackMsg(err.message || 'Error submitting rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6 px-4 sm:px-8 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/bookings" className="inline-flex items-center text-xs font-bold text-[#E8B619] hover:underline mb-2 transition">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to My Bookings
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Booking #{booking.bookingCode}
              </h1>
              <span className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-wider ${
                currentStep === 7 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-amber-100 text-amber-900 border border-amber-200'
              }`}>
                {booking.bookingStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Booked on {new Date(booking.createdAt).toLocaleDateString()} • {booking.serviceName}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 flex items-center gap-4">
            <div>
              <div className="text-xs text-slate-500 font-medium">Total Price</div>
              <div className="text-lg font-black text-slate-900">₹{booking.totalAmount.toLocaleString()}</div>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <div className="text-xs text-slate-500 font-medium">Advance Paid</div>
              <div className="text-sm font-black text-emerald-600">₹{booking.advanceAmount.toLocaleString()} ✓</div>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <div className="text-xs text-slate-500 font-medium">Balance Due</div>
              <div className="text-sm font-black text-slate-900">₹{booking.balanceAmount.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
        
        {/* Additional Work Requests Notice if any */}
        {booking.additionalWorkRequests.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-base font-black text-amber-900">Authorized Additional Work</h3>
                {booking.additionalWorkRequests.map(r => (
                  <div key={r.id} className="mt-2 text-sm text-slate-700 bg-white p-3 rounded-2xl border border-amber-200 shadow-xs">
                    <div className="font-black text-slate-900">{r.reason}</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">{r.description}</div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-amber-800 font-black">+ ₹{r.requestedAmount}</span>
                      <span className="text-emerald-700 uppercase font-black">{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stepper Timeline */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E8B619]" /> Service Fulfillment Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 relative">
            {steps.map((step, idx) => {
              const stepNum = idx + 1;
              const isCompleted = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;

              return (
                <div key={idx} className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-2 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 flex-shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-md'
                      : isCurrent
                      ? 'bg-[#FACC15] text-black ring-4 ring-[#FACC15]/30 animate-pulse font-black'
                      : 'bg-slate-100 text-slate-400 border border-gray-200'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isCurrent ? 'text-slate-900 font-black' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5 hidden sm:block">
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details & Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Service & Property Info */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Building className="w-4 h-4 text-[#E8B619]" /> Property & Schedule
            </h3>
            
            <div className="space-y-3 text-sm font-medium">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-slate-500">Customer Name</span>
                <span className="font-bold text-slate-900">{booking.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-slate-500">Property Type</span>
                <span className="font-bold text-slate-900">{booking.propertyType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-slate-500">Scheduled Date</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#E8B619]" /> {booking.scheduledDate}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-slate-500">Preferred Slot</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#E8B619]" /> {booking.scheduledTime}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Service Professional</span>
                <span className="font-bold text-emerald-600 font-black">
                  {booking.assignedAgencyName === 'Kleanzo Verified Fulfillment Partner' ? 'Kleanzo Professional' : booking.assignedAgencyName}
                </span>
              </div>
            </div>
          </div>

          {/* Location & Address */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <MapPin className="w-4 h-4 text-[#E8B619]" /> Site Address
            </h3>

            <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 text-sm text-slate-800 font-medium leading-relaxed">
              {booking.address}
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 font-medium leading-normal">
                Kleanzo Guarantee: Our internal supervisor conducts quality checks before handover. You pay the remaining balance only after inspection approval!
              </div>
            </div>
          </div>

        </div>

        {/* Customer Rating Section if Completed */}
        {currentStep === 7 && (
          <div className="bg-white border border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-[#E8B619] fill-[#E8B619]" /> Rate Your Kleanzo Experience
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-6">
              Your feedback helps Kleanzo maintain strict quality control standards across all service teams.
            </p>

            {ratingSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl text-sm font-bold shadow-xs">
                ✓ Thank you for rating! Rating: {rating} / 5 Stars.
                {comments && <div className="text-xs text-slate-600 font-medium mt-1">"{comments}"</div>}
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Overall Quality Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-xl border transition cursor-pointer ${
                          rating >= star
                            ? 'bg-amber-100 border-amber-300 text-amber-700'
                            : 'bg-slate-50 border-gray-200 text-slate-400'
                        }`}
                      >
                        <Star className={`w-6 h-6 ${rating >= star ? 'fill-[#E8B619] text-[#E8B619]' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Feedback Comments</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Tell us about the cleaning quality, punctuality, and staff behavior..."
                    rows={3}
                    className="w-full bg-slate-50 border border-gray-200 rounded-2xl p-3 text-sm text-slate-900 font-medium focus:border-[#E8B619] focus:bg-white focus:outline-none"
                  />
                </div>

                {feedbackMsg && (
                  <div className={`text-xs font-bold ${feedbackMsg.includes('Failed') || feedbackMsg.includes('Error') ? 'text-red-600' : 'text-emerald-600'}`}>
                    {feedbackMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingRating}
                  className="px-6 py-2.5 bg-[#FACC15] hover:bg-[#EAB308] text-black font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-md cursor-pointer"
                >
                  {submittingRating ? 'Submitting...' : 'Submit Kleanzo Feedback'}
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
