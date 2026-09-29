'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, CheckCircle2, AlertTriangle, XCircle, ArrowLeft,
  Building2, User, Phone, Mail, MapPin, CreditCard, FileText, Check, X,
  Clock, AlertCircle, Loader2, Eye, Shield, Lock, FileCheck, Rocket
} from 'lucide-react';
import {
  getAdminPartnerDetailAction,
  adminVerifyDocumentAction,
  adminApprovePartnerAction,
  adminRequestChangesAction,
  adminRejectPartnerAction,
  adminTogglePartnerSuspensionAction,
} from '@/actions/admin-partner-actions';

export default function AdminPartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const agencyId = resolvedParams.id;
  const router = useRouter();

  const [agency, setAgency] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Modal Inputs
  const [approveRemarks, setApproveRemarks] = useState('Approved by Kleanzo Operations');
  const [changesRemarks, setChangesRemarks] = useState('');
  const [selectedSections, setSelectedSections] = useState<string[]>(['kyc']);
  const [rejectionReason, setRejectionReason] = useState('');

  const loadDetail = async () => {
    setLoading(true);
    const res = await getAdminPartnerDetailAction(agencyId);
    setLoading(false);
    if (res.success && res.agency) {
      setAgency(res.agency);
      if (res.auditLogs) setAuditLogs(res.auditLogs);
    } else {
      setError(res.error || 'Failed to load agency details');
    }
  };

  useEffect(() => {
    loadDetail();
  }, [agencyId]);

  const handleVerifyDoc = async (docId: string, status: 'VERIFIED' | 'REJECTED' | 'REUPLOAD_REQUIRED') => {
    setBusy(true);
    const res = await adminVerifyDocumentAction(docId, status, undefined, 'Verified by Admin');
    setBusy(false);
    if (res.success) {
      loadDetail();
    } else {
      alert(res.error || 'Failed to update document status');
    }
  };

  const handleApprovePartner = async () => {
    setBusy(true);
    const res = await adminApprovePartnerAction(agencyId, approveRemarks);
    setBusy(false);
    setShowApproveModal(false);
    if (res.success) {
      loadDetail();
    } else {
      alert(res.error || 'Failed to approve partner');
    }
  };

  const handleRequestChanges = async () => {
    if (!changesRemarks.trim()) {
      alert('Please enter feedback comments for the agency.');
      return;
    }
    setBusy(true);
    const res = await adminRequestChangesAction(agencyId, selectedSections, changesRemarks);
    setBusy(false);
    setShowChangesModal(false);
    if (res.success) {
      loadDetail();
    } else {
      alert(res.error || 'Failed to request changes');
    }
  };

  const handleRejectPartner = async () => {
    if (!rejectionReason.trim()) {
      alert('Please enter a rejection reason.');
      return;
    }
    setBusy(true);
    const res = await adminRejectPartnerAction(agencyId, rejectionReason);
    setBusy(false);
    setShowRejectModal(false);
    if (res.success) {
      loadDetail();
    } else {
      alert(res.error || 'Failed to reject partner');
    }
  };

  const handleToggleSuspend = async () => {
    const isSuspended = agency.partnerStatus === 'SUSPENDED';
    if (!confirm(`Are you sure you want to ${isSuspended ? 'reactivate' : 'suspend'} this partner?`)) return;
    setBusy(true);
    const res = await adminTogglePartnerSuspensionAction(agencyId, !isSuspended);
    setBusy(false);
    if (res.success) {
      loadDetail();
    } else {
      alert(res.error || 'Failed to update partner status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-slate-600">
        <Loader2 className="w-6 h-6 animate-spin text-amber-600 mr-2" /> Loading Partner Details...
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 max-w-xl mx-auto text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-black text-slate-900">Partner Record Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'Unable to retrieve agency information.'}</p>
        <Link href="/admin/partners" className="inline-block bg-slate-900 text-white font-black text-xs px-6 py-2.5 rounded-xl">
          ← Back to Partner Management
        </Link>
      </div>
    );
  }

  const applicationCode = agency.applicationCode || `KZ-PARTNER-${agency.id.substring(0, 6).toUpperCase()}`;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* BACK NAV & TOP ACTIONS BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/admin/partners" className="inline-flex items-center gap-1.5 text-xs font-black text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" /> Back to Partner Applications
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {agency.partnerStatus !== 'ACTIVE' && (
              <button
                onClick={() => setShowApproveModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[3]" /> Approve Partner
              </button>
            )}

            <button
              onClick={() => setShowChangesModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-black font-black text-xs px-5 py-2.5 rounded-xl shadow-md uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" /> Request Changes
            </button>

            {agency.partnerStatus !== 'REJECTED' && (
              <button
                onClick={() => setShowRejectModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" /> Reject Application
              </button>
            )}

            <button
              onClick={handleToggleSuspend}
              className="bg-slate-900 hover:bg-black text-white font-black text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer"
            >
              {agency.partnerStatus === 'SUSPENDED' ? 'Reactivate Partner' : 'Suspend Partner'}
            </button>
          </div>
        </div>

        {/* APPLICATION SUMMARY HEADER */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-200 mb-1">
                Application Code: {applicationCode}
              </div>
              <h1 className="text-2xl font-black text-slate-900">{agency.name}</h1>
              <p className="text-xs text-slate-500 font-semibold">Owner: {agency.ownerName || 'N/A'} • Submitted on {new Date(agency.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Status</span>
              <span className="inline-block mt-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs px-3.5 py-1 rounded-full uppercase">
                {agency.partnerStatus}
              </span>
            </div>
          </div>

          {agency.adminRemarks && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900">
              Admin Remarks: {agency.adminRemarks}
            </div>
          )}
        </div>

        {/* 7 ONBOARDING SECTIONS DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. AGENCY & OWNER DETAILS */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Building2 className="w-4 h-4 text-amber-600" /> 1. Agency & Owner Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-slate-400 block font-bold">Agency Name</span><span className="font-extrabold text-slate-900">{agency.name}</span></div>
              <div><span className="text-slate-400 block font-bold">Owner Name</span><span className="font-extrabold text-slate-900">{agency.ownerName}</span></div>
              <div><span className="text-slate-400 block font-bold">Mobile Phone</span><span className="font-semibold">{agency.phone}</span></div>
              <div><span className="text-slate-400 block font-bold">Email Address</span><span className="font-semibold">{agency.email}</span></div>
              <div><span className="text-slate-400 block font-bold">Operating City</span><span className="font-semibold">{agency.city}</span></div>
              <div><span className="text-slate-400 block font-bold">Office Address</span><span className="font-semibold">{agency.officeAddress || 'N/A'}</span></div>
            </div>
          </div>

          {/* 2. MOBILE VERIFICATION */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Phone className="w-4 h-4 text-amber-600" /> 2. Mobile OTP Verification
            </h3>
            <div className="text-xs font-semibold space-y-2">
              <div className="flex justify-between items-center">
                <span>Primary Number: <strong className="text-slate-900">{agency.phone}</strong></span>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${agency.mobileVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {agency.mobileVerified ? 'Verified ✓' : 'Unverified'}
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">Server-side OTP verification completed during onboarding.</p>
            </div>
          </div>

          {/* 3. KYC DOCUMENTS & BUSINESS PROOF */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3 lg:col-span-2">
            <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" /> 3. KYC Documents & Verification Controls
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-gray-200">
                <span className="text-slate-400 font-bold block">Aadhaar Number</span>
                <span className="font-black text-slate-900">{agency.aadhaarNumber || 'Masked / Stored'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-gray-200">
                <span className="text-slate-400 font-bold block">PAN Number</span>
                <span className="font-black text-slate-900">{agency.panNumber || 'Stored'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-gray-200">
                <span className="text-slate-400 font-bold block">GST Number</span>
                <span className="font-black text-slate-900">{agency.gstNumber || 'N/A (Exempt)'}</span>
              </div>
            </div>

            {/* Document Verification Cards */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-black text-slate-900 block">Uploaded Documents ({agency.documents?.length || 0})</span>
              {agency.documents?.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No document records attached.</p>
              ) : (
                agency.documents.map((doc: any) => (
                  <div key={doc.id} className="p-3 bg-slate-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-black text-slate-900 uppercase">{doc.documentType}</span>
                      <span className="text-slate-500 block text-[11px]">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${doc.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : doc.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                        {doc.status}
                      </span>

                      {doc.status !== 'VERIFIED' && (
                        <button
                          onClick={() => handleVerifyDoc(doc.id, 'VERIFIED')}
                          className="bg-emerald-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-lg hover:bg-emerald-700"
                        >
                          Verify ✓
                        </button>
                      )}

                      {doc.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleVerifyDoc(doc.id, 'REJECTED')}
                          className="bg-red-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-lg hover:bg-red-700"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 4. SERVICES & COVERAGE */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <FileText className="w-4 h-4 text-amber-600" /> 4. Services & Coverage Zones
            </h3>
            <div className="text-xs space-y-2">
              <div>
                <span className="text-slate-400 font-bold block">Services Offered ({agency.services?.length || 0})</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {agency.services?.map((s: any) => (
                    <span key={s.id} className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-md">
                      {s.service?.name || s.serviceId}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold block">Service Areas ({agency.serviceAreas?.length || 0})</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {agency.serviceAreas?.map((sa: any) => (
                    <span key={sa.id} className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md">
                      📍 {sa.areaName}, {sa.city} ({sa.pinCode})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 5. TEAM & OPERATIONS */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Rocket className="w-4 h-4 text-amber-600" /> 5. Team & Operational Capacity
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-slate-400 font-bold block">Active Teams</span><span className="font-extrabold text-slate-900">{agency.teamsCount || 1} Team(s)</span></div>
              <div><span className="text-slate-400 font-bold block">Cleaners Count</span><span className="font-extrabold text-slate-900">{agency.cleanerCount || 4} Cleaner(s)</span></div>
              <div><span className="text-slate-400 font-bold block">Supervisors</span><span className="font-extrabold text-slate-900">{agency.supervisorCount || 1}</span></div>
              <div><span className="text-slate-400 font-bold block">Max Jobs/Day</span><span className="font-extrabold text-slate-900">{agency.maxJobsPerDay || 5}</span></div>
            </div>
          </div>

          {/* 6. BANK DETAILS */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <CreditCard className="w-4 h-4 text-amber-600" /> 6. Bank & Settlement Account
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-slate-400 font-bold block">Account Holder</span><span className="font-extrabold text-slate-900">{agency.bankAccountHolder || 'N/A'}</span></div>
              <div><span className="text-slate-400 font-bold block">Bank Name</span><span className="font-extrabold text-slate-900">{agency.bankName || 'N/A'}</span></div>
              <div><span className="text-slate-400 font-bold block">Account Number</span><span className="font-extrabold text-slate-900">{agency.bankAccountNumber || 'Stored/Masked'}</span></div>
              <div><span className="text-slate-400 font-bold block">IFSC Code</span><span className="font-extrabold text-slate-900">{agency.bankIfscCode || 'N/A'}</span></div>
            </div>
          </div>

          {/* 7. PARTNER AGREEMENT */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <FileCheck className="w-4 h-4 text-amber-600" /> 7. Partner Agreement & Declaration
            </h3>
            <div className="text-xs font-semibold space-y-1">
              <div className="flex items-center justify-between">
                <span>Agreement Accepted:</span>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${agency.agreementAccepted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {agency.agreementAccepted ? 'Accepted ✓' : 'Pending'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Version: {agency.agreementVersion || 'v1.2'}</p>
            </div>
          </div>

        </div>

      </div>

      {/* APPROVE MODAL */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xl max-w-md w-full space-y-4">
            <h3 className="text-base font-black text-slate-900">Approve Partner Agency?</h3>
            <p className="text-xs text-slate-600">
              This will activate <strong className="text-slate-900">{agency.name}</strong> as an active fulfillment partner and make them eligible to receive customer job offers.
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Admin Approval Remarks</label>
              <input
                type="text"
                value={approveRemarks}
                onChange={(e) => setApproveRemarks(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                disabled={busy}
                onClick={handleApprovePartner}
                className="flex-1 bg-emerald-600 text-white font-black text-xs py-2.5 rounded-xl uppercase"
              >
                Confirm Approval
              </button>
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 bg-gray-100 text-slate-700 font-bold text-xs py-2.5 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST CHANGES MODAL */}
      {showChangesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xl max-w-md w-full space-y-4">
            <h3 className="text-base font-black text-slate-900">Request Changes from Partner</h3>
            <p className="text-xs text-slate-600">Specify feedback remarks for <strong className="text-slate-900">{agency.name}</strong>. Their status will change to ACTION_REQUIRED.</p>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Admin Feedback Remarks *</label>
              <textarea
                required
                rows={3}
                value={changesRemarks}
                onChange={(e) => setChangesRemarks(e.target.value)}
                placeholder="e.g. Please re-upload a clearer PAN card image and clarify your bank account holder name."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                disabled={busy}
                onClick={handleRequestChanges}
                className="flex-1 bg-amber-500 text-black font-black text-xs py-2.5 rounded-xl uppercase"
              >
                Send Request
              </button>
              <button
                onClick={() => setShowChangesModal(false)}
                className="flex-1 bg-gray-100 text-slate-700 font-bold text-xs py-2.5 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xl max-w-md w-full space-y-4">
            <h3 className="text-base font-black text-slate-900">Reject Application?</h3>
            <p className="text-xs text-slate-600">Enter the rejection reason for <strong className="text-slate-900">{agency.name}</strong>.</p>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Rejection Reason *</label>
              <textarea
                required
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Incomplete business verification documents and invalid contact information."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                disabled={busy}
                onClick={handleRejectPartner}
                className="flex-1 bg-red-600 text-white font-black text-xs py-2.5 rounded-xl uppercase"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 bg-gray-100 text-slate-700 font-bold text-xs py-2.5 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
