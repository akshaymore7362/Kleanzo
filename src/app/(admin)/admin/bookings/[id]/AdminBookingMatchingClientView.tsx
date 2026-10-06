'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  UserCheck, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  FileCheck,
  Building,
  Users,
  Eye,
  Sliders
} from 'lucide-react';
import { 
  findMatchingAgenciesAction, 
  runAutomaticAssignmentAction, 
  adminManualAssignAgencyAction 
} from '@/actions/assignment-actions';
import { 
  verifyBookingCompletionAdminAction, 
  reviewAdditionalWorkRequestAdminAction 
} from '@/actions/admin-actions';

interface AdminBookingMatchingClientViewProps {
  booking: any;
}

export default function AdminBookingMatchingClientView({ booking }: AdminBookingMatchingClientViewProps) {
  const [loadingMatching, setLoadingMatching] = useState(false);
  const [matchingAgencies, setMatchingAgencies] = useState<any[]>([]);
  const [matchingFetched, setMatchingFetched] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [correctionNote, setCorrectionNote] = useState('');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [processingVerification, setProcessingVerification] = useState(false);

  const handleFetchMatching = async () => {
    setLoadingMatching(true);
    setActionMsg('');
    try {
      const res = await findMatchingAgenciesAction(booking.id);
      if (res.success && res.rankedAgencies) {
        setMatchingAgencies(res.rankedAgencies);
        setMatchingFetched(true);
      } else {
        setActionMsg(res.error || 'Failed to fetch matching agencies');
      }
    } catch (err: any) {
      setActionMsg(err.message || 'Error executing matching engine');
    } finally {
      setLoadingMatching(false);
    }
  };

  const handleRunAutoMatching = async () => {
    setLoadingMatching(true);
    setActionMsg('');
    try {
      const res = await runAutomaticAssignmentAction(booking.id);
      if (res.success) {
        setActionMsg(`Automatic matching result: ${res.message || res.status}`);
        window.location.reload();
      } else {
        setActionMsg(res.error || 'Automatic matching failed');
      }
    } catch (err: any) {
      setActionMsg(err.message || 'Error triggering automatic assignment');
    } finally {
      setLoadingMatching(false);
    }
  };

  const handleManualAssign = async (agencyId: string, agencyName: string) => {
    setLoadingMatching(true);
    setActionMsg('');
    try {
      const res = await adminManualAssignAgencyAction(booking.id, agencyId, `Manually assigned by Admin to ${agencyName}`);
      if (res.success) {
        setActionMsg(`Successfully assigned job to ${agencyName}!`);
        window.location.reload();
      } else {
        setActionMsg(res.error || 'Manual assignment failed');
      }
    } catch (err: any) {
      setActionMsg(err.message || 'Error assigning agency');
    } finally {
      setLoadingMatching(false);
    }
  };

  const handleApproveCompletion = async () => {
    setProcessingVerification(true);
    setActionMsg('');
    try {
      const res = await verifyBookingCompletionAdminAction(booking.id, 'APPROVE');
      if (res.success) {
        setActionMsg('Completion approved! Booking marked COMPLETED and Agency Payout is ELIGIBLE.');
        window.location.reload();
      } else {
        setActionMsg(res.error || 'Verification approval failed');
      }
    } catch (err: any) {
      setActionMsg(err.message || 'Error approving completion');
    } finally {
      setProcessingVerification(false);
    }
  };

  const handleRequestCorrection = async () => {
    if (!correctionNote.trim()) {
      setActionMsg('Please provide a correction note for the agency.');
      return;
    }
    setProcessingVerification(true);
    setActionMsg('');
    try {
      const res = await verifyBookingCompletionAdminAction(booking.id, 'REQUEST_CORRECTION', correctionNote);
      if (res.success) {
        setActionMsg('Correction note sent back to agency.');
        setShowCorrectionModal(false);
        window.location.reload();
      } else {
        setActionMsg(res.error || 'Request correction failed');
      }
    } catch (err: any) {
      setActionMsg(err.message || 'Error sending correction request');
    } finally {
      setProcessingVerification(false);
    }
  };

  const handleReviewAdditionalWork = async (requestId: string, decision: 'APPROVE' | 'REJECT') => {
    try {
      const res = await reviewAdditionalWorkRequestAdminAction(requestId, decision);
      if (res.success) {
        setActionMsg(`Additional work request ${decision.toLowerCase()}d successfully.`);
        window.location.reload();
      } else {
        setActionMsg(res.error || 'Failed to review request');
      }
    } catch (err: any) {
      setActionMsg(err.message || 'Error reviewing request');
    }
  };

  const completionPhotos: string[] = booking.completionProof 
    ? (typeof booking.completionProof === 'string' && booking.completionProof.startsWith('[') ? JSON.parse(booking.completionProof) : [booking.completionProof])
    : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-6 sm:p-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-3xl shadow-xs">
        <div>
          <Link href="/admin/dashboard" className="inline-flex items-center text-xs font-bold text-[#E8B619] hover:underline mb-2 transition">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Admin Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Booking #{booking.bookingCode}
            </h1>
            <span className="px-3 py-1 text-xs font-black rounded-full uppercase bg-amber-100 text-amber-900 border border-amber-200">
              {booking.bookingStatus.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Customer: <strong className="text-slate-900">{booking.customerName}</strong> ({booking.customerPhone}) • Service: {booking.serviceName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleFetchMatching}
            disabled={loadingMatching}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-gray-200 rounded-2xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-[#E8B619]" /> Fetch Eligible Agencies
          </button>

          <button
            onClick={handleRunAutoMatching}
            disabled={loadingMatching}
            className="px-5 py-2.5 bg-[#FACC15] hover:bg-[#EAB308] text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loadingMatching ? 'animate-spin' : ''}`} /> Run Auto Matching
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-900 shadow-xs">
          {actionMsg}
        </div>
      )}

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Customer & Location */}
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-xs space-y-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider text-[#E8B619] flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Customer Location
          </h2>
          <div className="text-xs text-slate-600 font-medium space-y-1.5">
            <div><strong className="text-slate-900">Address:</strong> {booking.address}</div>
            <div><strong className="text-slate-900">City / Area:</strong> {booking.area}, {booking.city}</div>
            <div><strong className="text-slate-900">Coordinates:</strong> {booking.lat}, {booking.lng}</div>
            <div><strong className="text-slate-900">Scheduled:</strong> {booking.scheduledDate} ({booking.scheduledTime})</div>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-xs space-y-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider text-[#E8B619] flex items-center gap-2">
            <FileCheck className="w-4 h-4" /> Financial Breakdown
          </h2>
          <div className="text-xs text-slate-600 font-medium space-y-1.5">
            <div className="flex justify-between"><span>Customer Total:</span> <strong className="text-slate-900">₹{booking.totalAmount}</strong></div>
            <div className="flex justify-between"><span>Advance Paid:</span> <strong className="text-emerald-600 font-bold">₹{booking.advanceAmount} ✓</strong></div>
            <div className="flex justify-between"><span>Balance Due:</span> <strong className="text-slate-900">₹{booking.balanceAmount}</strong></div>
            <div className="border-t border-gray-100 pt-1.5 flex justify-between">
              <span>Agency Payout (Internal):</span> <strong className="text-[#E8B619]">₹{booking.partnerPayout}</strong>
            </div>
            <div className="flex justify-between">
              <span>Kleanzo Retained:</span> <strong className="text-purple-700">₹{booking.kleanzoRetained}</strong>
            </div>
          </div>
        </div>

        {/* Current Fulfillment Partner */}
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-xs space-y-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider text-[#E8B619] flex items-center gap-2">
            <Building className="w-4 h-4" /> Assigned Agency
          </h2>
          <div className="text-xs text-slate-600 font-medium space-y-1.5">
            <div><strong className="text-slate-900">Agency Name:</strong> <span className="text-[#E8B619] font-black">{booking.assignedAgencyName}</span></div>
            <div><strong className="text-slate-900">Assignment Mode:</strong> {booking.assignmentMode}</div>
            <div><strong className="text-slate-900">Verification Status:</strong> {booking.verificationStatus}</div>
            <div><strong className="text-slate-900">Assigned Crew:</strong> {booking.crewMembers.length > 0 ? booking.crewMembers.map((c: any) => `${c.name} (${c.role})`).join(', ') : 'None assigned yet'}</div>
          </div>
        </div>

      </div>

      {/* SECTION 1: MATCHING ENGINE & ELIGIBLE AGENCIES */}
      <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#E8B619]" /> Nearby Eligible Agencies Matching Table
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Agencies filtered by active status, supported service, area radius, capacity, and distance calculation (Haversine Formula).
            </p>
          </div>

          <button
            onClick={handleFetchMatching}
            disabled={loadingMatching}
            className="px-4 py-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl text-xs font-bold hover:bg-amber-100 transition flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingMatching ? 'animate-spin' : ''}`} /> Refresh Matching
          </button>
        </div>

        {matchingFetched && matchingAgencies.length === 0 ? (
          <div className="p-6 bg-slate-50 rounded-2xl border border-gray-200 text-center text-xs text-slate-500 font-medium">
            No eligible agencies found matching criteria. Click "Run Auto Matching" to alert Admin.
          </div>
        ) : matchingAgencies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Agency Name</th>
                  <th className="py-3 px-4">Distance</th>
                  <th className="py-3 px-4">Match Score</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Eligibility</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {matchingAgencies.map((item: any) => (
                  <tr key={item.agency.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.agency.name}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{item.agency.city} • Rating: {item.agency.rating}⭐</div>
                    </td>
                    <td className="py-3 px-4 font-black text-[#E8B619]">
                      {item.distanceKm} KM
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black">
                        {item.matchScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      ✓ Supported
                    </td>
                    <td className="py-3 px-4">
                      {item.eligible ? (
                        <span className="text-emerald-600 font-black">Eligible</span>
                      ) : (
                        <span className="text-red-600 font-bold">{item.eligibilityReasons[0] || 'Ineligible'}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.agency.id === booking.assignedAgencyId ? (
                        <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-[11px] font-black">
                          Currently Assigned
                        </span>
                      ) : (
                        <button
                          onClick={() => handleManualAssign(item.agency.id, item.agency.name)}
                          disabled={loadingMatching || !item.eligible}
                          className="px-3 py-1.5 bg-[#FACC15] hover:bg-[#EAB308] disabled:bg-slate-100 disabled:text-slate-400 text-black font-black rounded-xl text-xs transition shadow-xs cursor-pointer"
                        >
                          Assign Agency
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 text-xs text-slate-500 font-medium">
            Click "Fetch Eligible Agencies" above to compute live Haversine distance and candidate scoring.
          </div>
        )}
      </div>

      {/* SECTION 2: COMPLETION PROOF VERIFICATION & APPROVAL */}
      {booking.completionProof && (
        <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Agency Completion Verification Panel
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Review photos and completion notes submitted by agency before approving payout.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCorrectionModal(true)}
                disabled={processingVerification}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-2xl text-xs font-bold transition cursor-pointer"
              >
                Request Correction
              </button>
              <button
                onClick={handleApproveCompletion}
                disabled={processingVerification}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve Completion & Payout
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-700 mb-1">Agency Completion Notes</div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 text-xs text-slate-800 font-medium leading-relaxed">
                {booking.completionNotes || 'No notes specified by agency.'}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700 mb-2">Completion Proof Photos</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {completionPhotos.map((url: string, idx: number) => (
                  <div key={idx} className="relative aspect-video rounded-2xl bg-slate-100 border border-gray-200 overflow-hidden group shadow-xs">
                    <img src={url} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: ADDITIONAL WORK REQUESTS */}
      {booking.additionalWorkRequests.length > 0 && (
        <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-xs space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <AlertCircle className="w-4 h-4 text-[#E8B619]" /> Additional Work Requests
          </h2>

          <div className="space-y-3">
            {booking.additionalWorkRequests.map((r: any) => (
              <div key={r.id} className="p-4 bg-slate-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-medium">
                <div>
                  <div className="font-bold text-slate-900">{r.reason} (₹{r.requestedAmount})</div>
                  <div className="text-slate-500 mt-1">{r.description}</div>
                  <div className="text-[11px] text-amber-800 font-bold mt-1">Requested by: {r.agencyName} • Status: {r.status}</div>
                </div>

                {r.status === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReviewAdditionalWork(r.id, 'REJECT')}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold transition cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleReviewAdditionalWork(r.id, 'APPROVE')}
                      className="px-3 py-1.5 bg-[#FACC15] hover:bg-[#EAB308] text-black font-black rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Approve & Add Charge
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: ASSIGNMENT & STATUS HISTORY TIMELINE */}
      <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-xs space-y-4">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Clock className="w-4 h-4 text-[#E8B619]" /> Assignment & Workflow Audit History
        </h2>

        <div className="space-y-3">
          {booking.statusHistory.map((h: any) => (
            <div key={h.id} className="p-3 bg-slate-50 rounded-2xl border border-gray-200 text-xs flex justify-between items-start font-medium">
              <div>
                <span className="font-bold text-[#E8B619]">{h.fromStatus} → {h.toStatus}</span>
                <p className="text-slate-600 mt-0.5">{h.remarks}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">Actor: {h.changedBy} ({h.changedType})</span>
              </div>
              <span className="text-[11px] text-slate-400 whitespace-nowrap">{new Date(h.createdAt).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Request Correction Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-black text-slate-900">Request Correction from Agency</h3>
            <p className="text-xs text-slate-500 font-medium">
              Specify what work or photo evidence needs to be updated before handover approval.
            </p>

            <textarea
              value={correctionNote}
              onChange={(e) => setCorrectionNote(e.target.value)}
              placeholder="e.g. Kitchen tile stains still visible. Re-cleaning required in balcony..."
              rows={4}
              className="w-full bg-slate-50 border border-gray-200 rounded-2xl p-3 text-xs text-slate-900 font-medium focus:border-[#E8B619] focus:bg-white focus:outline-none"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl hover:bg-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestCorrection}
                disabled={processingVerification}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-2xl transition cursor-pointer"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
