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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-6 sm:p-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
        <div>
          <Link href="/admin/dashboard" className="inline-flex items-center text-xs text-yellow-500 hover:text-yellow-400 mb-2 transition">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Admin Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Booking #{booking.bookingCode}
            </h1>
            <span className="px-3 py-1 text-xs font-semibold rounded-full uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              {booking.bookingStatus.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Customer: <strong className="text-white">{booking.customerName}</strong> ({booking.customerPhone}) • Service: {booking.serviceName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleFetchMatching}
            disabled={loadingMatching}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-yellow-400 border border-yellow-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <Sliders className="w-4 h-4" /> Fetch Eligible Agencies
          </button>

          <button
            onClick={handleRunAutoMatching}
            disabled={loadingMatching}
            className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-yellow-500/20 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loadingMatching ? 'animate-spin' : ''}`} /> Run Auto Matching
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 bg-neutral-900 border border-yellow-500/40 rounded-xl text-xs font-medium text-yellow-300">
          {actionMsg}
        </div>
      )}

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Customer & Location */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-yellow-500 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Customer Location
          </h2>
          <div className="text-xs text-neutral-300 space-y-1.5">
            <div><strong className="text-neutral-400">Address:</strong> {booking.address}</div>
            <div><strong className="text-neutral-400">City / Area:</strong> {booking.area}, {booking.city}</div>
            <div><strong className="text-neutral-400">Coordinates:</strong> {booking.lat}, {booking.lng}</div>
            <div><strong className="text-neutral-400">Scheduled:</strong> {booking.scheduledDate} ({booking.scheduledTime})</div>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-yellow-500 flex items-center gap-2">
            <FileCheck className="w-4 h-4" /> Financial Breakdown
          </h2>
          <div className="text-xs text-neutral-300 space-y-1.5">
            <div className="flex justify-between"><span>Customer Total:</span> <strong className="text-white">₹{booking.totalAmount}</strong></div>
            <div className="flex justify-between"><span>Advance Paid:</span> <strong className="text-emerald-400">₹{booking.advanceAmount} ✓</strong></div>
            <div className="flex justify-between"><span>Balance Due:</span> <strong className="text-white">₹{booking.balanceAmount}</strong></div>
            <div className="border-t border-neutral-800 pt-1.5 flex justify-between">
              <span>Agency Payout (Internal):</span> <strong className="text-yellow-400">₹{booking.partnerPayout}</strong>
            </div>
            <div className="flex justify-between">
              <span>Kleanzo Retained:</span> <strong className="text-purple-400">₹{booking.kleanzoRetained}</strong>
            </div>
          </div>
        </div>

        {/* Current Fulfillment Partner */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-yellow-500 flex items-center gap-2">
            <Building className="w-4 h-4" /> Assigned Agency
          </h2>
          <div className="text-xs text-neutral-300 space-y-1.5">
            <div><strong className="text-neutral-400">Agency Name:</strong> <span className="text-yellow-400 font-semibold">{booking.assignedAgencyName}</span></div>
            <div><strong className="text-neutral-400">Assignment Mode:</strong> {booking.assignmentMode}</div>
            <div><strong className="text-neutral-400">Verification Status:</strong> {booking.verificationStatus}</div>
            <div><strong className="text-neutral-400">Assigned Crew:</strong> {booking.crewMembers.length > 0 ? booking.crewMembers.map((c: any) => `${c.name} (${c.role})`).join(', ') : 'None assigned yet'}</div>
          </div>
        </div>

      </div>

      {/* SECTION 1: MATCHING ENGINE & ELIGIBLE AGENCIES */}
      <div className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-yellow-500" /> Nearby Eligible Agencies Matching Table
            </h2>
            <p className="text-xs text-neutral-400">
              Agencies filtered by active status, supported service, area radius, capacity, and distance calculation (Haversine Formula).
            </p>
          </div>

          <button
            onClick={handleFetchMatching}
            disabled={loadingMatching}
            className="px-4 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-xl text-xs font-semibold hover:bg-yellow-500/30 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingMatching ? 'animate-spin' : ''}`} /> Refresh Matching
          </button>
        </div>

        {matchingFetched && matchingAgencies.length === 0 ? (
          <div className="p-6 bg-neutral-950 rounded-xl border border-neutral-800 text-center text-xs text-neutral-400">
            No eligible agencies found matching criteria. Click "Run Auto Matching" to alert Admin.
          </div>
        ) : matchingAgencies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Agency Name</th>
                  <th className="py-3 px-4">Distance</th>
                  <th className="py-3 px-4">Match Score</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Eligibility</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {matchingAgencies.map((item: any) => (
                  <tr key={item.agency.id} className="hover:bg-neutral-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{item.agency.name}</div>
                      <div className="text-[11px] text-neutral-500">{item.agency.city} • Rating: {item.agency.rating}⭐</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-yellow-400">
                      {item.distanceKm} KM
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        {item.matchScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-300">
                      ✓ Supported
                    </td>
                    <td className="py-3 px-4">
                      {item.eligible ? (
                        <span className="text-emerald-400 font-semibold">Eligible</span>
                      ) : (
                        <span className="text-red-400 font-semibold">{item.eligibilityReasons[0] || 'Ineligible'}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.agency.id === booking.assignedAgencyId ? (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg text-[11px] font-semibold">
                          Currently Assigned
                        </span>
                      ) : (
                        <button
                          onClick={() => handleManualAssign(item.agency.id, item.agency.name)}
                          disabled={loadingMatching || !item.eligible}
                          className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-neutral-800 disabled:text-neutral-600 text-black font-bold rounded-lg text-xs transition"
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
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400">
            Click "Fetch Eligible Agencies" above to compute live Haversine distance and candidate scoring.
          </div>
        )}
      </div>

      {/* SECTION 2: COMPLETION PROOF VERIFICATION & APPROVAL */}
      {booking.completionProof && (
        <div className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Agency Completion Verification Panel
              </h2>
              <p className="text-xs text-neutral-400">
                Review photos and completion notes submitted by agency before approving payout.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCorrectionModal(true)}
                disabled={processingVerification}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition"
              >
                Request Correction
              </button>
              <button
                onClick={handleApproveCompletion}
                disabled={processingVerification}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve Completion & Payout
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-neutral-400 mb-1">Agency Completion Notes</div>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs text-neutral-200 leading-relaxed">
                {booking.completionNotes || 'No notes specified by agency.'}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-neutral-400 mb-2">Completion Proof Photos</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {completionPhotos.map((url: string, idx: number) => (
                  <div key={idx} className="relative aspect-video rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden group">
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
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
            <AlertCircle className="w-4 h-4 text-yellow-500" /> Additional Work Requests
          </h2>

          <div className="space-y-3">
            {booking.additionalWorkRequests.map((r: any) => (
              <div key={r.id} className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-semibold text-white">{r.reason} (₹{r.requestedAmount})</div>
                  <div className="text-neutral-400 mt-1">{r.description}</div>
                  <div className="text-[11px] text-yellow-500 mt-1">Requested by: {r.agencyName} • Status: {r.status}</div>
                </div>

                {r.status === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReviewAdditionalWork(r.id, 'REJECT')}
                      className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleReviewAdditionalWork(r.id, 'APPROVE')}
                      className="px-3 py-1.5 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition"
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
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-3">
          <Clock className="w-4 h-4 text-yellow-500" /> Assignment & Workflow Audit History
        </h2>

        <div className="space-y-3">
          {booking.statusHistory.map((h: any) => (
            <div key={h.id} className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80 text-xs flex justify-between items-start">
              <div>
                <span className="font-semibold text-yellow-400">{h.fromStatus} → {h.toStatus}</span>
                <p className="text-neutral-400 mt-0.5">{h.remarks}</p>
                <span className="text-[10px] text-neutral-500 mt-1 block">Actor: {h.changedBy} ({h.changedType})</span>
              </div>
              <span className="text-[11px] text-neutral-500 whitespace-nowrap">{new Date(h.createdAt).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Request Correction Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Request Correction from Agency</h3>
            <p className="text-xs text-neutral-400">
              Specify what work or photo evidence needs to be updated before handover approval.
            </p>

            <textarea
              value={correctionNote}
              onChange={(e) => setCorrectionNote(e.target.value)}
              placeholder="e.g. Kitchen tile stains still visible. Re-cleaning required in balcony..."
              rows={4}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:border-yellow-500 focus:outline-none"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="px-4 py-2 bg-neutral-800 text-neutral-300 text-xs font-semibold rounded-xl hover:bg-neutral-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestCorrection}
                disabled={processingVerification}
                className="px-4 py-2 bg-red-500 hover:bg-red-400 text-black text-xs font-bold rounded-xl transition"
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
