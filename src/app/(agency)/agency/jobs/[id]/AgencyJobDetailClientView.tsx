'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Building, 
  DollarSign, 
  Users, 
  Truck, 
  Sparkles, 
  Upload, 
  AlertCircle,
  Camera,
  ShieldCheck
} from 'lucide-react';
import { respondToAssignmentOfferAction } from '@/actions/assignment-actions';
import { 
  assignAgencyTeamAction, 
  updateJobDayStatusAction, 
  submitAgencyCompletionAction, 
  requestAdditionalWorkAction, 
  recordSiteInspectionAction 
} from '@/actions/agency-actions';

interface AgencyJobDetailClientViewProps {
  job: any;
  agencyId: string;
  teamMembers: any[];
}

export default function AgencyJobDetailClientView({ job, agencyId, teamMembers }: AgencyJobDetailClientViewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  
  // Rejection modal state
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('No Team Available');

  // Team assignment state
  const [selectedLeader, setSelectedLeader] = useState<string>(
    job.assignedCrew.find((c: any) => c.role === 'LEAD')?.id || (teamMembers[0]?.id || '')
  );
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>(
    job.assignedCrew.filter((c: any) => c.role === 'CLEANER').map((c: any) => c.id)
  );

  // Photos & completion state
  const [beforePhotos, setBeforePhotos] = useState<string[]>(
    job.siteInspection?.beforePhotos ? (typeof job.siteInspection.beforePhotos === 'string' && job.siteInspection.beforePhotos.startsWith('[') ? JSON.parse(job.siteInspection.beforePhotos) : [job.siteInspection.beforePhotos]) : ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80']
  );
  const [afterPhotos, setAfterPhotos] = useState<string[]>(
    job.qualityCheck?.afterPhotos ? (typeof job.qualityCheck.afterPhotos === 'string' && job.qualityCheck.afterPhotos.startsWith('[') ? JSON.parse(job.qualityCheck.afterPhotos) : [job.qualityCheck.afterPhotos]) : ['https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&q=80']
  );
  const [completionNotes, setCompletionNotes] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Additional work request state
  const [showAddWorkModal, setShowAddWorkModal] = useState(false);
  const [addWorkReason, setAddWorkReason] = useState('');
  const [addWorkDesc, setAddWorkDesc] = useState('');
  const [addWorkAmount, setAddWorkAmount] = useState(1500);

  const isOffer = job.bookingStatus === 'PARTNER_PENDING_ACCEPTANCE';
  const isAccepted = ['PARTNER_ACCEPTED', 'TEAM_ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'CLEANING_IN_PROGRESS', 'VERIFICATION_PENDING', 'VERIFIED', 'COMPLETED'].includes(job.bookingStatus);

  const handleAcceptJob = async () => {
    if (!job.offerId) {
      setMsg('Offer ID not found');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res = await respondToAssignmentOfferAction(job.offerId, agencyId, 'ACCEPTED');
      if (res.success) {
        setMsg('Job accepted successfully!');
        router.refresh();
      } else {
        setMsg(res.error || 'Failed to accept job');
      }
    } catch (err: any) {
      setMsg(err.message || 'Error accepting job');
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineJob = async () => {
    if (!job.offerId) {
      setMsg('Offer ID not found');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res = await respondToAssignmentOfferAction(job.offerId, agencyId, 'REJECTED', rejectionReason);
      if (res.success) {
        setMsg('Job offer declined. Next suitable agency is being assigned automatically.');
        setShowDeclineModal(false);
        router.push('/agency/jobs');
      } else {
        setMsg(res.error || 'Failed to decline job');
      }
    } catch (err: any) {
      setMsg(err.message || 'Error declining job');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTeam = async () => {
    if (!selectedLeader) {
      setMsg('Please select a Team Leader.');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res = await assignAgencyTeamAction(job.id, selectedLeader, selectedWorkers);
      if (res.success) {
        setMsg('Team assigned to job successfully!');
        router.refresh();
      } else {
        setMsg(res.error || 'Failed to assign team');
      }
    } catch (err: any) {
      setMsg(err.message || 'Error assigning team');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: 'ON_THE_WAY' | 'ARRIVED' | 'WORK_STARTED' | 'WORK_IN_PROGRESS') => {
    setLoading(true);
    setMsg('');
    try {
      const res = await updateJobDayStatusAction(job.id, status);
      if (res.success) {
        setMsg(`Status updated to ${status.replace(/_/g, ' ')}`);
        router.refresh();
      } else {
        setMsg(res.error || 'Failed to update status');
      }
    } catch (err: any) {
      setMsg(err.message || 'Error updating status');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBeforePhoto = () => {
    if (newPhotoUrl.trim()) {
      setBeforePhotos([...beforePhotos, newPhotoUrl.trim()]);
      setNewPhotoUrl('');
    }
  };

  const handleAddAfterPhoto = () => {
    if (newPhotoUrl.trim()) {
      setAfterPhotos([...afterPhotos, newPhotoUrl.trim()]);
      setNewPhotoUrl('');
    }
  };

  const handleSubmitCompletion = async () => {
    if (afterPhotos.length === 0) {
      setMsg('Completion photos are required.');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res = await submitAgencyCompletionAction(job.id, completionNotes || 'Cleaning completed per Kleanzo standards.', afterPhotos);
      if (res.success) {
        setMsg('Completion proof submitted! Awaiting Admin verification.');
        router.refresh();
      } else {
        setMsg(res.error || 'Failed to submit completion proof');
      }
    } catch (err: any) {
      setMsg(err.message || 'Error submitting completion');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAddWork = async () => {
    if (!addWorkReason || !addWorkDesc) {
      setMsg('Reason and description are required.');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      const res = await requestAdditionalWorkAction(job.id, addWorkReason, addWorkDesc, addWorkAmount);
      if (res.success) {
        setMsg('Additional work request submitted for Admin review.');
        setShowAddWorkModal(false);
        router.refresh();
      } else {
        setMsg(res.error || 'Failed to request additional work');
      }
    } catch (err: any) {
      setMsg(err.message || 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-6 sm:p-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-3xl shadow-xs">
        <div>
          <Link href="/agency/jobs" className="inline-flex items-center text-xs font-bold text-[#E8B619] hover:underline mb-2 transition">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Agency Jobs
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Job #{job.bookingCode}
            </h1>
            <span className="px-3 py-1 text-xs font-black rounded-full uppercase bg-amber-100 text-amber-900 border border-amber-200">
              {job.bookingStatus.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Service: <strong className="text-slate-900">{job.serviceName}</strong> • Property: {job.propertyType}
          </p>
        </div>

        {/* Accept / Decline Controls for New Job Offer */}
        {isOffer && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDeclineModal(true)}
              disabled={loading}
              className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-black text-xs uppercase tracking-wider rounded-2xl transition flex items-center gap-2 cursor-pointer"
            >
              <XCircle className="w-4 h-4" /> Decline Job
            </button>
            <button
              onClick={handleAcceptJob}
              disabled={loading}
              className="px-6 py-2.5 bg-[#FACC15] hover:bg-[#EAB308] text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Accept Job Offer
            </button>
          </div>
        )}
      </div>

      {msg && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-900 shadow-xs">
          {msg}
        </div>
      )}

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Customer & Locality */}
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-xs space-y-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider text-[#E8B619] flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Fulfillment Location
          </h2>
          <div className="text-xs text-slate-600 space-y-1.5 font-medium">
            <div><strong className="text-slate-900">Locality:</strong> {job.area}, {job.city}</div>
            <div><strong className="text-slate-900">Full Address:</strong> {job.address}</div>
            <div><strong className="text-slate-900">Customer Name:</strong> {job.customerName}</div>
            <div><strong className="text-slate-900">Customer Phone:</strong> {job.customerPhone}</div>
          </div>
        </div>

        {/* Schedule & Team */}
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-xs space-y-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider text-[#E8B619] flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Schedule & Team
          </h2>
          <div className="text-xs text-slate-600 space-y-1.5 font-medium">
            <div><strong className="text-slate-900">Scheduled Date:</strong> {job.scheduledDate}</div>
            <div><strong className="text-slate-900">Time Slot:</strong> {job.scheduledTime}</div>
            <div>
              <strong className="text-slate-900">Assigned Crew:</strong>{' '}
              {job.assignedCrew.length > 0
                ? job.assignedCrew.map((c: any) => `${c.name} (${c.role})`).join(', ')
                : 'Pending Team Selection'}
            </div>
          </div>
        </div>

        {/* Agency Financials */}
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-xs space-y-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider text-[#E8B619] flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Internal Agency Payout
          </h2>
          <div className="text-xs text-slate-600 space-y-2">
            <div className="text-2xl font-black text-slate-900">₹{job.partnerPayout}</div>
            <div className="text-[11px] text-slate-500 font-medium">
              Payout is eligible upon Admin verification after completion proof submission.
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 1: TEAM ASSIGNMENT PANEL */}
      {isAccepted && (
        <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Users className="w-5 h-5 text-[#E8B619]" /> Crew & Worker Assignment
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Select Team Leader</label>
              <select
                value={selectedLeader}
                onChange={(e) => setSelectedLeader(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-2xl p-3 text-slate-900 font-medium focus:border-[#E8B619] focus:bg-white focus:outline-none"
              >
                <option value="">-- Choose Team Leader --</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role}) - {m.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Select Cleaners / Helpers</label>
              <div className="bg-slate-50 border border-gray-200 rounded-2xl p-3 max-h-36 overflow-y-auto space-y-2">
                {teamMembers.filter(m => m.id !== selectedLeader).map((m) => (
                  <label key={m.id} className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={selectedWorkers.includes(m.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedWorkers([...selectedWorkers, m.id]);
                        else setSelectedWorkers(selectedWorkers.filter(id => id !== m.id));
                      }}
                      className="rounded border-gray-300 text-[#E8B619] focus:ring-[#E8B619]"
                    />
                    {m.name} ({m.phone})
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleAssignTeam}
            disabled={loading}
            className="px-6 py-2.5 bg-[#FACC15] hover:bg-[#EAB308] text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition cursor-pointer"
          >
            Assign Team to Job
          </button>
        </div>
      )}

      {/* SECTION 2: JOB DAY OPERATIONAL STATUS */}
      {isAccepted && (
        <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#E8B619]" /> Job Day Execution Controls
              </h2>
              <p className="text-xs text-slate-500 font-medium">Update live operational progress as team moves to site and executes service.</p>
            </div>

            <button
              onClick={() => setShowAddWorkModal(true)}
              className="px-4 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-2xl text-xs font-bold hover:bg-amber-100 transition flex items-center gap-2 cursor-pointer"
            >
              <AlertCircle className="w-4 h-4 text-amber-600" /> Request Additional Work
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleUpdateStatus('ON_THE_WAY')}
              disabled={loading}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-2xl border border-gray-200 transition cursor-pointer"
            >
              🚚 Team On The Way
            </button>

            <button
              onClick={() => handleUpdateStatus('ARRIVED')}
              disabled={loading}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-2xl border border-gray-200 transition cursor-pointer"
            >
              📍 Arrived at Site
            </button>

            <button
              onClick={() => handleUpdateStatus('WORK_STARTED')}
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-2xl shadow-md transition cursor-pointer"
            >
              ✨ Start Deep Cleaning
            </button>
          </div>
        </div>
      )}

      {/* SECTION 3: COMPLETION PROOF SUBMISSION */}
      {isAccepted && (
        <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Completion Proof & Photo Evidence Upload
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Add Image URL (Before / After Photos)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-slate-50 border border-gray-200 rounded-2xl p-3 text-slate-900 font-medium focus:border-[#E8B619] focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddAfterPhoto}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold cursor-pointer transition"
                >
                  Add Photo
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-600 mb-2">Uploaded Completion Photos ({afterPhotos.length})</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {afterPhotos.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-2xl bg-slate-100 border border-gray-200 overflow-hidden shadow-xs">
                    <img src={url} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Completion Notes</label>
              <textarea
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Details on scope completed, stains removed, chemical products used..."
                rows={3}
                className="w-full bg-slate-50 border border-gray-200 rounded-2xl p-3 text-slate-900 font-medium focus:border-[#E8B619] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              onClick={handleSubmitCompletion}
              disabled={loading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit Completion Proof to Admin
            </button>
          </div>
        </div>
      )}

      {/* Decline Job Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-black text-slate-900">Decline Job Offer</h3>
            <p className="text-xs text-slate-500 font-medium">
              Please select a mandatory reason for declining this booking offer.
            </p>

            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 rounded-2xl p-3 text-xs text-slate-900 font-medium focus:border-[#E8B619] focus:bg-white focus:outline-none"
            >
              <option value="No Team Available">No Team Available</option>
              <option value="Schedule Conflict">Schedule Conflict</option>
              <option value="Outside Service Area">Outside Service Area</option>
              <option value="Equipment Unavailable">Equipment Unavailable</option>
              <option value="Service Not Supported">Service Not Supported</option>
              <option value="Other">Other</option>
            </select>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl hover:bg-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclineJob}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-2xl transition cursor-pointer"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Additional Work Modal */}
      {showAddWorkModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-black text-slate-900">Request Additional Work Authorization</h3>

            <input
              type="text"
              value={addWorkReason}
              onChange={(e) => setAddWorkReason(e.target.value)}
              placeholder="Reason (e.g. Heavy Grout Stain Removal)"
              className="w-full bg-slate-50 border border-gray-200 rounded-2xl p-3 text-xs text-slate-900 font-medium focus:border-[#E8B619] focus:bg-white focus:outline-none"
            />

            <textarea
              value={addWorkDesc}
              onChange={(e) => setAddWorkDesc(e.target.value)}
              placeholder="Detailed description of extra work required..."
              rows={3}
              className="w-full bg-slate-50 border border-gray-200 rounded-2xl p-3 text-xs text-slate-900 font-medium focus:border-[#E8B619] focus:bg-white focus:outline-none"
            />

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Requested Amount (₹)</label>
              <input
                type="number"
                value={addWorkAmount}
                onChange={(e) => setAddWorkAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-gray-200 rounded-2xl p-3 text-xs text-slate-900 font-medium focus:border-[#E8B619] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAddWorkModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl hover:bg-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestAddWork}
                disabled={loading}
                className="px-4 py-2 bg-[#FACC15] hover:bg-[#EAB308] text-black text-xs font-black rounded-2xl transition cursor-pointer"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
