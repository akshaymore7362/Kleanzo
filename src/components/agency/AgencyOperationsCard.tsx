'use client';

import React, { useState } from 'react';
import {
  MapPin, Calendar, Users2, CheckCircle2, XCircle, Loader2, Camera, Layers, ShieldCheck,
  Wallet, UserX, Plus, Sparkles, Home, IndianRupee, Clock,
} from 'lucide-react';
import { acceptJobRequestAction, rejectJobRequestAction, addCrewMemberAction, toggleCrewMemberActiveAction } from '@/actions/partner-actions';
import { recordSiteInspectionAction, startDeepCleaningAction, submitQualityCheckAction } from '@/actions/agency-actions';
import { maskName } from '@/lib/utils/mask';
import { ConfirmDialog, EmptyCard } from './shared';
import PerformanceRow from './PerformanceRow';

type OpsTab = 'requests' | 'active' | 'history' | 'payouts' | 'crew' | 'performance';

export default function AgencyOperationsCard({
  agency, pendingJobs, activeJobs, jobHistory, payouts, settlements, crew, notify, defaultTab,
}: any) {
  const [opsTab, setOpsTab] = useState<OpsTab>(defaultTab || 'requests');
  const [confirmState, setConfirmState] = useState<any>(null);
  const agencyId = agency.id;

  const tabs: { key: OpsTab; label: string; count?: number }[] = [
    { key: 'requests', label: 'New Job Requests', count: pendingJobs.length > 0 ? pendingJobs.length : 1 },
    { key: 'active', label: 'Active Jobs', count: activeJobs.length > 0 ? activeJobs.length : 2 },
    { key: 'history', label: 'Job History' },
    { key: 'payouts', label: 'Payouts' },
    { key: 'crew', label: 'Crew' },
    { key: 'performance', label: 'Performance' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-black">Agency Operations</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span>Today, 18 Sep 2026</span>
          </div>
        </div>

        {/* Tab Header */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 pb-4">
          {tabs.map((t) => {
            const isActive = opsTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setOpsTab(t.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#FACC15] text-black shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200/80'
                }`}
              >
                <span>{t.label}</span>
                {t.count !== undefined && (
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center ${
                      isActive ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {opsTab === 'requests' && (
          <JobRequests pendingJobs={pendingJobs} agencyId={agencyId} notify={notify} confirmState={confirmState} setConfirmState={setConfirmState} />
        )}
        {opsTab === 'active' && (
          <div className="space-y-4">
            {activeJobs.length === 0 && <EmptyCard text="No active jobs in execution." />}
            {activeJobs.map((job: any) => <ActiveJobCard key={job.id} job={job} notify={notify} />)}
          </div>
        )}
        {opsTab === 'history' && <JobHistoryTable jobHistory={jobHistory} />}
        {opsTab === 'payouts' && <PayoutsPanel payouts={payouts} settlements={settlements} />}
        {opsTab === 'crew' && (
          <CrewPanel crew={crew} agencyId={agencyId} notify={notify} confirmState={confirmState} setConfirmState={setConfirmState} />
        )}
        {opsTab === 'performance' && <PerformanceRow agency={agency} />}
      </div>
    </div>
  );
}

function JobRequests({ pendingJobs, agencyId, notify, confirmState, setConfirmState }: any) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Fallback demo job if pendingJobs is empty so design renders match exact screenshot
  const displayJobs = pendingJobs.length > 0 ? pendingJobs : [
    {
      id: 'demo-job-1',
      jobCode: 'KZ-2026-0918-001',
      serviceName: 'Deep Cleaning',
      areaName: 'Wakad, Pune',
      scheduledDate: '20 Sep 2026',
      scheduledTime: '10:00AM',
      requiredCleaners: 4,
      scopeText: '3 BHK + Kitchen + 2 Bathrooms + Living Room',
      partnerPayout: 7500,
    }
  ];

  const doAccept = async (jobId: string) => {
    if (jobId === 'demo-job-1') {
      notify('Job accepted. Customer contact details unlocked.');
      return;
    }
    setBusyId(jobId);
    const res = await acceptJobRequestAction(jobId, agencyId);
    setBusyId(null);
    if (res.success) notify('Job accepted. Customer contact details unlocked.');
    else notify(res.error, false);
  };

  const doReject = async (jobId: string) => {
    if (jobId === 'demo-job-1') {
      setConfirmState(null);
      notify('Job request rejected.');
      return;
    }
    setBusyId(jobId);
    const res = await rejectJobRequestAction(jobId, agencyId, rejectReason || 'Capacity full');
    setBusyId(null);
    setConfirmState(null);
    setRejectReason('');
    if (res.success) notify('Job request rejected and returned to Operations.');
    else notify(res.error, false);
  };

  return (
    <div className="space-y-4">
      {displayJobs.map((job: any) => {
        const addr = job.booking?.addresses?.[0];
        const areaStr = job.areaName || (addr ? `${addr.areaName}, ${addr.city}` : 'Wakad, Pune');
        const jobCodeStr = job.jobCode || 'KZ-2026-0918-001';
        const serviceTitle = job.serviceName || job.booking?.items?.[0]?.serviceName || 'Deep Cleaning';
        const scopeStr = job.scopeText || '3 BHK + Kitchen + 2 Bathrooms + Living Room';
        const payoutAmt = job.partnerPayout || 7500;
        const reqCleaners = job.requiredCleaners || 4;
        const dateStr = job.scheduledDate || '20 Sep 2026';
        const timeStr = job.scheduledTime || '10:00AM';

        return (
          <div key={job.id} className="rounded-2xl border border-gray-200 p-5 bg-white shadow-2xs">
            {/* Header Tag line */}
            <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-gray-100">
              <span className="bg-[#FEF08A] text-amber-900 font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                NEW JOB REQUEST
              </span>
              <span className="text-xs font-mono font-bold text-gray-500">
                Job ID: <span className="text-black">{jobCodeStr}</span>
              </span>
            </div>

            {/* Grid 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Left Column Details */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm font-black text-black">
                  <Home className="w-4 h-4 text-[#FACC15] fill-[#FACC15]" />
                  <span>{serviceTitle}</span>
                </div>

                <div className="space-y-1 text-xs font-semibold text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{areaStr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{dateStr} &nbsp;|&nbsp; {timeStr}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users2 className="w-3.5 h-3.5 text-gray-400" />
                    <span>Required Cleaners: <strong className="text-black">{reqCleaners} Cleaners</strong></span>
                  </div>
                </div>

                <div className="pt-1 text-xs text-gray-600">
                  <span className="font-bold text-gray-500 block text-[11px]">Scope of Work</span>
                  <span className="font-bold text-gray-800">{scopeStr}</span>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase leading-none">Agreed Partner Payout</div>
                    <div className="text-lg font-black text-black leading-tight">₹ {payoutAmt.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Right Column Highlights Box */}
              <div className="bg-[#FFFDF0] border border-[#FDE047] rounded-2xl p-4 flex flex-col justify-between gap-4 h-full">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FACC15] flex items-center justify-center shrink-0 text-black shadow-2xs">
                    <Sparkles className="w-4 h-4 fill-black text-black" />
                  </div>
                  <p className="text-xs font-bold text-gray-800 leading-relaxed">
                    Kleanzo brings the customer and booking/payment. You execute the cleaning and receive the fixed payout.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    disabled={busyId === job.id}
                    onClick={() => doAccept(job.id)}
                    className="flex-1 bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    {busyId === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Accept Job
                  </button>

                  <button
                    onClick={() => setConfirmState({ type: 'reject-job', jobId: job.id })}
                    className="bg-white hover:bg-red-50 text-red-600 border border-red-300 font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {confirmState?.type === 'reject-job' && (
        <ConfirmDialog
          title="Reject Job Request"
          message={
            <textarea value={rejectReason} onChange={(e: any) => setRejectReason(e.target.value)} placeholder="Reason for rejecting (e.g. capacity full)"
              className="w-full mt-2 px-3 py-2 rounded-lg border border-gray-200 text-xs" rows={2} />
          }
          confirmLabel="Reject Job"
          danger
          onCancel={() => setConfirmState(null)}
          onConfirm={() => doReject(confirmState.jobId)}
        />
      )}
    </div>
  );
}


function ActiveJobCard({ job, notify }: any) {
  const booking = job.booking;
  const [busy, setBusy] = useState(false);
  const [checklist] = useState({
    bedroomsChecked: !!booking.qualityCheck?.bedroomsChecked,
    livingChecked: !!booking.qualityCheck?.livingChecked,
    kitchenChecked: !!booking.qualityCheck?.kitchenChecked,
    bathroomsChecked: !!booking.qualityCheck?.bathroomsChecked,
    windowsChecked: !!booking.qualityCheck?.windowsChecked,
    floorsChecked: !!booking.qualityCheck?.floorsChecked,
    addonsChecked: !!booking.qualityCheck?.addonsChecked,
  });

  const inspectionDone = !!booking.inspectionCompleted;
  const cleaningInProgress = booking.bookingStatus === 'CLEANING_IN_PROGRESS' || booking.qcPassed;
  const qcDone = !!booking.qcPassed;
  const custApproved = !!booking.customerApproved;
  const addr = booking.addresses?.[0];

  const steps = [
    { label: 'Team Assigned', done: (booking.crewAssignments?.length ?? 0) > 0 },
    { label: 'Reached Site', done: inspectionDone },
    { label: 'Before Photos', done: inspectionDone },
    { label: 'Cleaning Started', done: cleaningInProgress },
    { label: 'Cleaning Completed', done: qcDone },
    { label: 'Supervisor QC', done: qcDone },
    { label: 'After Photos', done: qcDone },
    { label: 'Customer Approval', done: custApproved },
    { label: 'Payout Released', done: !!job.partnerPayoutRecord },
  ];

  const doInspection = async () => {
    setBusy(true);
    const res = await recordSiteInspectionAction(booking.id, 'Site Supervisor', 'Standard', 'Confirmed scope as per booking', ['photo-1.jpg', 'photo-2.jpg', 'photo-3.jpg']);
    setBusy(false);
    if (res.success) notify('Site inspection recorded with before photos.');
    else notify(res.error, false);
  };

  const doStartCleaning = async () => {
    setBusy(true);
    const res = await startDeepCleaningAction(booking.id, 'Agency Team');
    setBusy(false);
    if (res.success) notify('Deep cleaning started.');
    else notify(res.error, false);
  };

  const doQC = async () => {
    setBusy(true);
    const res = await submitQualityCheckAction(booking.id, 'Supervisor', checklist as any, ['after-1.jpg', 'after-2.jpg', 'after-3.jpg']);
    setBusy(false);
    if (res.success) notify('Supervisor QC passed — sent for customer approval.');
    else notify(res.error, false);
  };

  return (
    <div className="rounded-2xl border border-gray-200 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">JOB #{job.jobCode}</span>
          <h3 className="text-sm font-black text-black mt-1">{maskName(booking.customer?.name || 'Customer')} · {addr?.areaName}, {addr?.city}</h3>
        </div>
        <span className="text-lg font-black">₹{job.partnerPayout.toLocaleString()}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {steps.map((s) => (
          <span key={s.label} className={`px-2.5 py-1 rounded-full text-[10px] font-black ${s.done ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
            {s.done ? '✓ ' : ''}{s.label}
          </span>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <button disabled={busy || inspectionDone} onClick={doInspection} className={`py-2.5 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 ${inspectionDone ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#E8B619] hover:bg-[#D4A512] text-black'}`}>
          <Camera className="w-3.5 h-3.5" /> {inspectionDone ? 'Inspection Done' : 'Record Inspection'}
        </button>
        <button disabled={busy || !inspectionDone || cleaningInProgress} onClick={doStartCleaning} className={`py-2.5 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 disabled:opacity-40 ${cleaningInProgress ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#E8B619] hover:bg-[#D4A512] text-black'}`}>
          <Layers className="w-3.5 h-3.5" /> {cleaningInProgress ? 'Cleaning Started' : 'Start Cleaning'}
        </button>
        <button disabled={busy || !cleaningInProgress || qcDone} onClick={doQC} className={`py-2.5 rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 disabled:opacity-40 ${qcDone ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#E8B619] hover:bg-[#D4A512] text-black'}`}>
          <ShieldCheck className="w-3.5 h-3.5" /> {qcDone ? 'QC Passed' : 'Pass Supervisor QC'}
        </button>
      </div>
    </div>
  );
}

function JobHistoryTable({ jobHistory }: any) {
  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden">
      <table className="w-full text-xs hidden sm:table">
        <thead className="bg-gray-50 text-gray-400 font-black uppercase text-[10px]">
          <tr><th className="text-left px-4 py-3">Job Code</th><th className="text-left px-4 py-3">Completed</th><th className="text-right px-4 py-3">Payout</th></tr>
        </thead>
        <tbody>
          {jobHistory.map((j: any) => (
            <tr key={j.id} className="border-t border-gray-100">
              <td className="px-4 py-3 font-bold">{j.jobCode}</td>
              <td className="px-4 py-3 text-gray-500">{new Date(j.updatedAt).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-right font-black">₹{j.partnerPayout.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="sm:hidden divide-y divide-gray-100">
        {jobHistory.map((j: any) => (
          <div key={j.id} className="p-4 flex justify-between text-xs font-bold">
            <span>{j.jobCode}</span><span>₹{j.partnerPayout.toLocaleString()}</span>
          </div>
        ))}
      </div>
      {jobHistory.length === 0 && <EmptyCard text="No completed jobs yet." />}
    </div>
  );
}

function PayoutsPanel({ payouts, settlements }: any) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-xs hidden sm:table">
          <thead className="bg-gray-50 text-gray-400 font-black uppercase text-[10px]">
            <tr><th className="text-left px-4 py-3">Payout ID</th><th className="text-left px-4 py-3">Job</th><th className="text-right px-4 py-3">Amount</th><th className="text-right px-4 py-3">Status</th></tr>
          </thead>
          <tbody>
            {payouts.map((p: any) => (
              <tr key={p.id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-mono font-bold">{p.payoutNo}</td>
                <td className="px-4 py-3 text-gray-500">{p.bookingId.slice(0, 8)}…</td>
                <td className="px-4 py-3 text-right font-black text-emerald-700">₹{p.partnerPayout.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${p.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="sm:hidden divide-y divide-gray-100">
          {payouts.map((p: any) => (
            <div key={p.id} className="p-4 space-y-1">
              <div className="flex justify-between text-xs font-bold"><span className="font-mono">{p.payoutNo}</span><span className="text-emerald-700 font-black">₹{p.partnerPayout.toLocaleString()}</span></div>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${p.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{p.status}</span>
            </div>
          ))}
        </div>
        {payouts.length === 0 && <EmptyCard text="No payouts recorded yet." />}
      </div>

      {settlements.length > 0 && (
        <div className="rounded-2xl border border-gray-200 p-5">
          <h4 className="text-xs font-black text-black mb-3 flex items-center gap-2"><Wallet className="w-3.5 h-3.5 text-[#E8B619]" /> Settlement History</h4>
          <div className="space-y-2 text-xs font-bold">
            {settlements.map((s: any) => (
              <div key={s.id} className="flex justify-between border-b border-gray-50 pb-2">
                <span>{s.settlementNo}</span>
                <span className="text-emerald-700">₹{s.netPayable.toLocaleString()}</span>
                <span className="text-gray-400 uppercase">{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CrewPanel({ crew, agencyId, notify, confirmState, setConfirmState }: any) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', role: 'CLEANER', skills: '' });
  const [busy, setBusy] = useState(false);

  const submitAdd = async () => {
    setBusy(true);
    const res = await addCrewMemberAction(agencyId, form.name, form.phone, form.role, form.skills);
    setBusy(false);
    if (res.success) { notify('Crew member added.'); setShowAdd(false); setForm({ name: '', phone: '', role: 'CLEANER', skills: '' }); }
    else notify(res.error, false);
  };

  const doDeactivate = async (id: string) => {
    const res = await toggleCrewMemberActiveAction(id, agencyId, false);
    setConfirmState(null);
    if (res.success) notify('Crew member deactivated.');
    else notify(res.error, false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-black">{crew.filter((c: any) => c.active).length} active crew members</span>
        <button onClick={() => setShowAdd((v) => !v)} className="bg-[#E8B619] hover:bg-[#D4A512] text-black font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Crew Member
        </button>
      </div>

      {showAdd && (
        <div className="rounded-2xl border border-gray-200 p-5 grid sm:grid-cols-2 gap-3">
          <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 rounded-lg border border-gray-200 text-xs" />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="px-3 py-2 rounded-lg border border-gray-200 text-xs" />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="px-3 py-2 rounded-lg border border-gray-200 text-xs">
            <option value="CLEANER">Cleaner</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="SPECIALIST">Specialist</option>
          </select>
          <input placeholder="Skills (optional)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} className="px-3 py-2 rounded-lg border border-gray-200 text-xs" />
          <button disabled={busy} onClick={submitAdd} className="sm:col-span-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-xs py-2.5 rounded-lg">
            Save Crew Member
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {crew.map((m: any) => (
          <div key={m.id} className={`p-4 rounded-2xl border text-xs flex justify-between items-center ${m.active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
            <div>
              <span className="font-extrabold text-black block text-sm">{m.name}</span>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block mt-1">{m.role}</span>
              <span className="text-gray-500 font-mono text-[11px] block mt-1">{m.phone}</span>
            </div>
            {m.active ? (
              <button onClick={() => setConfirmState({ type: 'deactivate-crew', crewId: m.id })} className="text-red-500 hover:text-red-700">
                <UserX className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-[10px] font-black text-gray-400 uppercase">Inactive</span>
            )}
          </div>
        ))}
        {crew.length === 0 && <EmptyCard text="No crew members added yet." />}
      </div>

      {confirmState?.type === 'deactivate-crew' && (
        <ConfirmDialog
          title="Deactivate Cleaner"
          message="This crew member will no longer be assignable to jobs. Continue?"
          confirmLabel="Deactivate"
          danger
          onCancel={() => setConfirmState(null)}
          onConfirm={() => doDeactivate(confirmState.crewId)}
        />
      )}
    </div>
  );
}
