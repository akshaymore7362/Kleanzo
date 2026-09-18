'use client';

import React, { useState } from 'react';
import {
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  Camera,
  Layers,
  Sparkles,
  CreditCard,
  Building2,
  AlertTriangle,
  XCircle,
  MapPin,
  Check,
  LogOut,
} from 'lucide-react';
import { logoutAction } from '@/actions/auth-actions';

export default function PartnerExecutionDashboard() {
  const handleLogout = async () => {
    await logoutAction();
    window.location.href = '/login?switch=true';
  };

  const [activeTab, setActiveTab] = useState<'requests' | 'active_jobs' | 'payouts' | 'crew'>('requests');
  const [jobOfferStatus, setJobOfferStatus] = useState<'OFFERED' | 'ACCEPTED' | 'REJECTED'>('OFFERED');
  
  const [jobExecution, setJobExecution] = useState({
    jobCode: 'KLZ-JOB-9021',
    bookingCode: 'KLZ-BK-9021',
    customerNameMasked: 'Rahul J.',
    phoneMasked: '••••••••10',
    areaLocality: 'Baner area / locality',
    customerNameFull: 'Rahul Jaykar',
    phoneFull: '9876543210',
    fullAddress: 'Flat 402, Sunshine Heights, Baner Road, Pune',
    serviceName: '3 BHK Deep Cleaning Package',
    scope: 'Bedrooms, Living room, Kitchen degreasing, Bathrooms, Window tracks, Marble floor buffing.',
    scheduledDate: '18 Sep 2026',
    scheduledTime: '10:00 AM',
    requiredCleaners: 4,
    partnerPayout: 11000, // Partner Payout ONLY
    inspectionCompleted: false,
    beforePhotosCount: 0,
    cleaningProgress: {
      bedrooms: false,
      living: false,
      kitchen: false,
      bathrooms: false,
      windows: false,
      floors: false,
      addons: false,
    },
    cleaningCompleted: false,
    qcPassed: false,
    afterPhotosCount: 0,
    reworkRequired: false,
  });

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleAcceptJob = () => {
    setJobOfferStatus('ACCEPTED');
    showNotice('Job Offer Accepted! Complete customer property address & phone unlocked.');
  };

  const handleRejectJob = () => {
    setJobOfferStatus('REJECTED');
    showNotice('Job Offer Rejected. Request returned to Kleanzo Operations for reassignment.');
  };

  const handleUploadBeforePhotos = () => {
    setJobExecution(prev => ({ ...prev, beforePhotosCount: 3, inspectionCompleted: true }));
    showNotice('Site inspection completed with 3 Before Photos! Cleaning stage is now UNLOCKED.');
  };

  const toggleRoomChecklist = (roomKey: keyof typeof jobExecution.cleaningProgress) => {
    if (!jobExecution.inspectionCompleted) {
      showNotice('GOLDEN RULE 2 VIOLATION: NO INSPECTION = NO CLEANING! Complete site inspection first.');
      return;
    }
    setJobExecution(prev => {
      const updated = { ...prev.cleaningProgress, [roomKey]: !prev.cleaningProgress[roomKey] };
      const allDone = Object.values(updated).every(v => v);
      return { ...prev, cleaningProgress: updated, cleaningCompleted: allDone };
    });
  };

  const handlePassQC = () => {
    if (!jobExecution.cleaningCompleted) {
      showNotice('Complete cleaning of all rooms before supervisor QC!');
      return;
    }
    setJobExecution(prev => ({ ...prev, qcPassed: true, afterPhotosCount: 3 }));
    showNotice('Supervisor QC Passed with 3 After Photos! Sent for customer inspection.');
  };

  return (
    <div className="bg-[#F5F8FA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Partner Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-block bg-[#111111] text-[#E8B619] px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-2">
              KLEANZO CERTIFIED FULFILLMENT PARTNER PORTAL
            </div>
            <h1 className="text-3xl font-black text-[#111111]">Partner Operational Execution</h1>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Apex Cleaning Services • Pune Service Zone
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 text-xs font-extrabold">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase">Partner Status</span>
                <span className="text-emerald-700">ACTIVE ✓</span>
              </div>
              <div className="border-l border-gray-200 pl-4">
                <span className="text-gray-400 block text-[10px] uppercase">Quality Score</span>
                <span className="text-black">4.9 / 5.0 ⭐</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout / Switch Role
            </button>
          </div>
        </div>

        {notificationMsg && (
          <div className="mb-6 p-4 bg-amber-500 text-black font-black text-xs rounded-2xl shadow-lg animate-bounce flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" /> {notificationMsg}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-3xl p-2 border border-gray-200 shadow-md mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all ${
              activeTab === 'requests' ? 'bg-[#E8B619] text-black shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            New Job Requests ({jobOfferStatus === 'OFFERED' ? 1 : 0})
          </button>
          <button
            onClick={() => setActiveTab('active_jobs')}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all ${
              activeTab === 'active_jobs' ? 'bg-[#E8B619] text-black shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Active Job Execution ({jobOfferStatus === 'ACCEPTED' ? 1 : 0})
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all ${
              activeTab === 'payouts' ? 'bg-[#E8B619] text-black shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Partner Payouts
          </button>
          <button
            onClick={() => setActiveTab('crew')}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all ${
              activeTab === 'crew' ? 'bg-[#E8B619] text-black shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Cleaning Crew (4)
          </button>
        </div>

        {/* Tab 1: New Job Requests (Section 19: Job Card + Accept/Reject) */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {jobOfferStatus === 'OFFERED' ? (
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md max-w-3xl">
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                  <div>
                    <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full uppercase">
                      JOB REQUEST #{jobExecution.jobCode}
                    </span>
                    <h2 className="text-xl font-black text-[#111111] mt-2">{jobExecution.serviceName}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">Agreed Partner Payout</span>
                    <span className="text-2xl font-black text-black">₹{jobExecution.partnerPayout.toLocaleString()}</span>
                  </div>
                </div>

                {/* Job Card Operational Details (Section 21) */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-xs space-y-3 mb-6">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-500">Scheduled Date & Time:</span>
                    <span className="text-black">{jobExecution.scheduledDate} at {jobExecution.scheduledTime}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-500">Customer Name (PII Masked):</span>
                    <span className="text-black">{jobExecution.customerNameMasked} ({jobExecution.phoneMasked})</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-500">Service Location:</span>
                    <span className="text-black">{jobExecution.areaLocality}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-500">Required Cleaners:</span>
                    <span className="text-black">{jobExecution.requiredCleaners} Cleaners + 1 Supervisor</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 font-medium text-gray-700">
                    <span className="font-bold text-black block mb-1">Execution Scope of Work:</span>
                    {jobExecution.scope}
                  </div>
                </div>

                {/* Accept / Reject Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleAcceptJob}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> ACCEPT JOB REQUEST
                  </button>
                  <button
                    onClick={handleRejectJob}
                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-extrabold text-xs py-3.5 px-6 rounded-xl transition-all flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> REJECT
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-gray-200 text-center text-gray-500 text-xs">
                No new job requests pending acceptance.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Active Job Execution (Inspection, Cleaning Checklist, QC) */}
        {activeTab === 'active_jobs' && (
          <div className="space-y-6">
            {jobOfferStatus === 'ACCEPTED' ? (
              <div className="space-y-6">
                
                {/* Unlocked PII Customer Banner */}
                <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                      ✓ UNLOCKED FULL CUSTOMER PII (JOB #{jobExecution.jobCode})
                    </span>
                    <h2 className="text-xl font-black text-white">{jobExecution.customerNameFull} ({jobExecution.phoneFull})</h2>
                    <p className="text-xs text-emerald-200 mt-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#E8B619]" /> {jobExecution.fullAddress}
                    </p>
                  </div>
                  <div className="bg-emerald-800/80 px-4 py-2 rounded-2xl border border-emerald-700 text-right">
                    <span className="text-[10px] text-emerald-300 block">Partner Payout</span>
                    <span className="text-lg font-black text-[#E8B619]">₹{jobExecution.partnerPayout.toLocaleString()}</span>
                  </div>
                </div>

                {/* Sub-Panel 1: Site Inspection (Golden Rule 2) */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md">
                  <h3 className="text-base font-black text-[#111111] mb-2 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#E8B619]" /> Step 6: Site Inspection & Before Photos (Golden Rule 2)
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Supervisor must inspect property condition and upload before photos before deep cleaning can start.
                  </p>
                  
                  <button
                    onClick={handleUploadBeforePhotos}
                    disabled={jobExecution.inspectionCompleted}
                    className={`px-6 py-3 rounded-xl text-xs font-extrabold transition-all ${
                      jobExecution.inspectionCompleted
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-[#E8B619] hover:bg-[#D4A512] text-black shadow-md'
                    }`}
                  >
                    {jobExecution.inspectionCompleted ? '✓ Site Inspection Completed (3 Before Photos)' : '+ Record Inspection & Upload 3 Before Photos'}
                  </button>
                </div>

                {/* Sub-Panel 2: Systematic Cleaning Checklist */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md">
                  <h3 className="text-base font-black text-[#111111] mb-2 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#E8B619]" /> Step 7: Systematic Deep Cleaning Checklist
                  </h3>

                  {!jobExecution.inspectionCompleted && (
                    <div className="mb-4 p-3 bg-red-100 text-red-900 text-xs font-extrabold rounded-xl border border-red-300">
                      ⚠️ GOLDEN RULE 2 VIOLATION: NO INSPECTION = NO CLEANING. Complete Site Inspection first.
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { key: 'bedrooms', label: '1. Bedrooms' },
                      { key: 'living', label: '2. Living / Dining' },
                      { key: 'kitchen', label: '3. Kitchen Degreasing' },
                      { key: 'bathrooms', label: '4. Bathrooms' },
                      { key: 'windows', label: '5. Window Tracks' },
                      { key: 'floors', label: '6. Floor Buffing' },
                      { key: 'addons', label: '7. Stain Add-ons' },
                    ].map(room => (
                      <button
                        key={room.key}
                        onClick={() => toggleRoomChecklist(room.key as any)}
                        className={`p-3.5 rounded-xl border text-xs font-extrabold text-left transition-all ${
                          jobExecution.cleaningProgress[room.key as keyof typeof jobExecution.cleaningProgress]
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-[#E8B619]'
                        }`}
                      >
                        {room.label} {jobExecution.cleaningProgress[room.key as keyof typeof jobExecution.cleaningProgress] ? '✓' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Panel 3: Supervisor Quality Check (Golden Rule 3) */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md">
                  <h3 className="text-base font-black text-[#111111] mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#E8B619]" /> Step 8: Supervisor Quality Check (QC) (Golden Rule 3)
                  </h3>
                  <button
                    onClick={handlePassQC}
                    disabled={jobExecution.qcPassed}
                    className={`px-6 py-3 rounded-xl text-xs font-extrabold transition-all ${
                      jobExecution.qcPassed
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-[#E8B619] hover:bg-[#D4A512] text-black shadow-md'
                    }`}
                  >
                    {jobExecution.qcPassed ? '✓ Supervisor QC Passed (3 After Photos Uploaded)' : 'Pass Supervisor QC & Upload After Photos'}
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-gray-200 text-center text-gray-500 text-xs">
                No active jobs currently in execution. Accept a job request to begin.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Partner Payouts (Section 36 & 48) */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md">
            <h2 className="text-xl font-black text-[#111111] mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#E8B619]" /> Partner Payout Records
            </h2>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-xs space-y-3 max-w-xl">
              <div className="flex justify-between font-bold">
                <span>Payout ID:</span>
                <span className="text-black font-mono">PO-9021</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Job Reference:</span>
                <span className="text-black">KLZ-JOB-9021</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Assigned Partner Payout:</span>
                <span className="text-emerald-700 font-extrabold text-sm">₹11,000</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-200 pt-2">
                <span>Payout Status:</span>
                <span className="text-amber-800 font-extrabold uppercase">PENDING CUSTOMER APPROVAL</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Cleaning Crew (Section 18) */}
        {activeTab === 'crew' && (
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md">
            <h2 className="text-xl font-black text-[#111111] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#E8B619]" /> Assigned Cleaning Crew Staff
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'Amit Sharma', role: 'SUPERVISOR & TEAM LEADER', phone: '9822110011' },
                { name: 'Rahul Shinde', role: 'SENIOR CLEANER (DEEP CLEANING)', phone: '9822110022' },
                { name: 'Suresh Patil', role: 'FLOOR POLISH SPECIALIST', phone: '9822110033' },
                { name: 'Vijay Thorat', role: 'WINDOW & STAIN SPECIALIST', phone: '9822110044' },
              ].map((member, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-extrabold text-black block text-sm">{member.name}</span>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block mt-1">
                      {member.role}
                    </span>
                  </div>
                  <span className="text-gray-500 font-mono text-[11px]">{member.phone}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
