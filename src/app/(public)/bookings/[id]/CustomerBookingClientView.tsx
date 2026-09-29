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
    { title: 'Partner Assigned', desc: 'Kleanzo verified crew assigned', icon: UserCheck },
    { title: 'Team Scheduled', desc: 'Equipment & team ready', icon: Calendar },
    { title: 'On The Way / Arrived', desc: 'Team arriving at site', icon: Truck },
    { title: 'Cleaning In Progress', desc: 'Deep cleaning & scrubbing', icon: Sparkles },
    { title: 'Kleanzo Verification', desc: 'Supervisor & Admin QC check', icon: ShieldCheck },
    { title: 'Job Completed', desc: 'Handover & satisfaction guaranteed', icon: Star },
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-16">
      {/* Header */}
      <div className="bg-neutral-900 border-b border-neutral-800 py-6 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/bookings" className="inline-flex items-center text-xs text-yellow-500 hover:text-yellow-400 mb-2 transition">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to My Bookings
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Booking #{booking.bookingCode}
              </h1>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                currentStep === 7 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                {booking.bookingStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Booked on {new Date(booking.createdAt).toLocaleDateString()} • {booking.serviceName}
            </p>
          </div>

          <div className="bg-neutral-800/80 p-4 rounded-xl border border-neutral-700/60 flex items-center gap-4">
            <div>
              <div className="text-xs text-neutral-400">Total Price</div>
              <div className="text-lg font-bold text-yellow-400">₹{booking.totalAmount.toLocaleString()}</div>
            </div>
            <div className="h-8 w-px bg-neutral-700" />
            <div>
              <div className="text-xs text-neutral-400">Advance Paid</div>
              <div className="text-sm font-semibold text-emerald-400">₹{booking.advanceAmount.toLocaleString()} ✓</div>
            </div>
            <div className="h-8 w-px bg-neutral-700" />
            <div>
              <div className="text-xs text-neutral-400">Balance Due</div>
              <div className="text-sm font-semibold text-white">₹{booking.balanceAmount.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
        
        {/* Additional Work Requests Notice if any */}
        {booking.additionalWorkRequests.length > 0 && (
          <div className="bg-yellow-950/40 border border-yellow-500/40 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-base font-semibold text-yellow-300">Authorized Additional Work</h3>
                {booking.additionalWorkRequests.map(r => (
                  <div key={r.id} className="mt-2 text-sm text-neutral-300 bg-neutral-900/60 p-3 rounded-xl border border-yellow-500/20">
                    <div className="font-medium text-white">{r.reason}</div>
                    <div className="text-xs text-neutral-400 mt-1">{r.description}</div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-yellow-400 font-bold">+ ₹{r.requestedAmount}</span>
                      <span className="text-emerald-400 uppercase font-semibold">{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stepper Timeline */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" /> Service Fulfillment Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 relative">
            {steps.map((step, idx) => {
              const stepNum = idx + 1;
              const isCompleted = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;

              return (
                <div key={idx} className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-2 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 flex-shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-yellow-500 text-black ring-4 ring-yellow-500/20 animate-pulse'
                      : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                  </div>
                  <div>
                    <div className={`text-xs font-semibold ${isCurrent ? 'text-yellow-400' : isCompleted ? 'text-white' : 'text-neutral-500'}`}>
                      {step.title}
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5 hidden sm:block">
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
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
              <Building className="w-4 h-4 text-yellow-500" /> Property & Schedule
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Customer Name</span>
                <span className="font-semibold text-white">{booking.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Property Type</span>
                <span className="font-semibold text-white">{booking.propertyType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Scheduled Date</span>
                <span className="font-semibold text-white flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-yellow-500" /> {booking.scheduledDate}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Preferred Slot</span>
                <span className="font-semibold text-white flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-yellow-500" /> {booking.scheduledTime}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Assigned Service Partner</span>
                <span className="font-semibold text-yellow-400">{booking.assignedAgencyName}</span>
              </div>
            </div>
          </div>

          {/* Location & Address */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
              <MapPin className="w-4 h-4 text-yellow-500" /> Site Address
            </h3>

            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-sm text-neutral-300 leading-relaxed">
              {booking.address}
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-yellow-200/90 leading-normal">
                Kleanzo Guarantee: Our internal supervisor conducts quality checks before handover. You pay the remaining balance only after inspection approval!
              </div>
            </div>
          </div>

        </div>

        {/* Customer Rating Section if Completed */}
        {currentStep === 7 && (
          <div className="bg-neutral-900/90 border border-yellow-500/30 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Rate Your Kleanzo Experience
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Your feedback helps Kleanzo maintain strict quality control standards across all service teams.
            </p>

            {ratingSubmitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-sm font-semibold">
                ✓ Thank you for rating! Rating: {rating} / 5 Stars.
                {comments && <div className="text-xs text-neutral-300 font-normal mt-1">"{comments}"</div>}
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-2">Overall Quality Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-lg border transition ${
                          rating >= star
                            ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                            : 'bg-neutral-800 border-neutral-700 text-neutral-500'
                        }`}
                      >
                        <Star className={`w-6 h-6 ${rating >= star ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">Feedback Comments</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Tell us about the cleaning quality, punctuality, and staff behavior..."
                    rows={3}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-sm text-white focus:border-yellow-500 focus:outline-none"
                  />
                </div>

                {feedbackMsg && (
                  <div className={`text-xs ${feedbackMsg.includes('Failed') || feedbackMsg.includes('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
                    {feedbackMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingRating}
                  className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-yellow-500/20"
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
