'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Check, ShieldCheck, Building2, CreditCard, FileText, Rocket, Sparkles,
  Phone, Upload, Plus, X, Loader2, AlertTriangle, CheckCircle2,
  Edit3, ArrowRight, ArrowLeft, Lock, FileCheck, Eye, EyeOff
} from 'lucide-react';
import {
  saveBasicDetailsAction,
  sendMobileOtpAction,
  verifyMobileOtpAction,
  saveKycAction,
  saveBusinessOperationsAction,
  saveBankDetailsAction,
  acceptPartnerAgreementAction,
  submitOnboardingForReviewAction,
} from '@/actions/agency-onboarding-actions';

type AgencyState = any;

const STEPS = [
  { id: 1, label: 'Agency & Owner', icon: Building2 },
  { id: 2, label: 'Mobile OTP', icon: Phone },
  { id: 3, label: 'KYC & Business', icon: ShieldCheck },
  { id: 4, label: 'Services & Area', icon: FileText },
  { id: 5, label: 'Team & Ops', icon: Rocket },
  { id: 6, label: 'Bank Details', icon: CreditCard },
  { id: 7, label: 'Agreement', icon: FileText },
  { id: 8, label: 'Final Review', icon: FileCheck },
];

const EQUIPMENT_OPTIONS = [
  'Single Disc Scrubber', 'Vacuum Cleaner (Wet & Dry)', 'Pressure Washer',
  'Floor Buffing Machine', 'Glass Cleaning Kit', 'Ladder / Scaffolding',
  'Chemical Sprayers', 'Steam Cleaner',
];

function StepProgress({ current, onJump }: { current: number; onJump: (stepId: number) => void }) {
  const percent = Math.round((current / STEPS.length) * 100);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span className="flex items-center gap-1.5 font-black text-slate-900">
          <Sparkles className="w-4 h-4 text-amber-500" /> Onboarding Progress
        </span>
        <span className="bg-[#FEF08A] text-amber-950 px-3 py-0.5 rounded-full text-[11px] font-black border border-[#FDE047]">
          Step {current} of {STEPS.length} ({percent}%)
        </span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-[#FACC15] h-1.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="w-full overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center min-w-[720px] sm:min-w-0 justify-between">
          {STEPS.map((step, idx) => {
            const isDone = step.id < current;
            const isActive = step.id === current;
            const Icon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => { if (step.id <= current) onJump(step.id); }}
                  className={`flex flex-col items-center gap-1.5 shrink-0 cursor-pointer ${step.id <= current ? 'hover:scale-105' : 'cursor-not-allowed opacity-60'} transition-all`}
                >
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center border-2 font-black text-xs transition-all ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : isActive
                        ? 'bg-[#FACC15] border-[#FACC15] text-black shadow-md ring-4 ring-amber-200 scale-110'
                        : 'bg-gray-100 border-gray-200 text-gray-400'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] font-bold text-center w-20 ${isActive ? 'text-slate-900 font-black' : isDone ? 'text-emerald-700 font-extrabold' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 transition-all duration-500 ${step.id < current ? 'bg-emerald-600' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-xs font-black text-slate-900 mb-1.5">
      {children}
      {optional ? (
        <span className="ml-1.5 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">(Optional)</span>
      ) : (
        <span className="ml-1 text-red-500">*</span>
      )}
    </label>
  );
}

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:border-transparent transition-all bg-white';

export default function OnboardingWizard({ initialAgency, services }: { initialAgency: AgencyState; services: { slug: string; name: string }[] }) {
  const [agency, setAgency] = useState<AgencyState>(initialAgency);
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [step]);

  const notify = (msg: string | null, ok = false) => {
    if (ok) { setSuccess(msg); setError(null); } else { setError(msg); setSuccess(null); }
    setTimeout(() => { setSuccess(null); setError(null); }, 5000);
  };

  const applicationCode = agency.applicationCode || `KZ-PARTNER-${agency.id?.substring(0, 6).toUpperCase()}`;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* HEADER */}
        <div className="mb-6 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#FEF08A] text-amber-950 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border border-[#FDE047]">
            KLEANZO PARTNER ONBOARDING
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Become a Kleanzo Fulfillment Partner</h1>
          <p className="text-xs text-slate-500 font-semibold">
            Complete the 7 onboarding steps below to activate your partner account and start receiving jobs.
          </p>
          {applicationCode && (
            <div className="inline-block bg-slate-900 text-white text-[11px] font-black px-3 py-0.5 rounded-md">
              Application ID: <span className="text-[#FACC15]">{applicationCode}</span>
            </div>
          )}
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 mb-6">
          <StepProgress current={step} onJump={(s) => setStep(s)} />
        </div>

        {/* ALERTS */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 border border-red-200 font-bold text-xs rounded-2xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> {success}
          </div>
        )}

        {/* STEP CONTENT CONTAINER */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 sm:p-8">
          {step === 1 && (
            <BasicDetailsStep agency={agency} busy={busy} setBusy={setBusy} notify={notify}
              onDone={(a: any) => { setAgency(a); setStep(2); }} />
          )}
          {step === 2 && (
            <OtpStep agency={agency} busy={busy} setBusy={setBusy} notify={notify}
              onBack={() => setStep(1)} onDone={(a: any) => { setAgency(a); setStep(3); }} />
          )}
          {step === 3 && (
            <KycStep agency={agency} busy={busy} setBusy={setBusy} notify={notify}
              onBack={() => setStep(2)} onDone={(a: any) => { setAgency(a); setStep(4); }} />
          )}
          {step === 4 && (
            <BusinessOpsStep agency={agency} services={services} busy={busy} setBusy={setBusy} notify={notify}
              onBack={() => setStep(3)} onDone={(a: any) => { setAgency(a); setStep(5); }} />
          )}
          {step === 5 && (
            <TeamOpsStep agency={agency} busy={busy} setBusy={setBusy} notify={notify}
              onBack={() => setStep(4)} onDone={(a: any) => { setAgency(a); setStep(6); }} />
          )}
          {step === 6 && (
            <BankDetailsStep agency={agency} busy={busy} setBusy={setBusy} notify={notify}
              onBack={() => setStep(5)} onDone={(a: any) => { setAgency(a); setStep(7); }} />
          )}
          {step === 7 && (
            <AgreementStep agency={agency} busy={busy} setBusy={setBusy} notify={notify}
              onBack={() => setStep(6)} onDone={(a: any) => { setAgency(a); setStep(8); }} />
          )}
          {step === 8 && (
            <FinalReviewStep agency={agency} busy={busy} setBusy={setBusy} notify={notify}
              onJumpStep={(s: number) => setStep(s)} onSubmitted={(a: any) => setAgency(a)} />
          )}
        </div>

      </div>
    </div>
  );
}

// ---------------- STEP 1: AGENCY & OWNER DETAILS ----------------
function BasicDetailsStep({ agency, busy, setBusy, notify, onDone }: any) {
  const [agencyName, setAgencyName] = useState(agency.name || '');
  const [ownerName, setOwnerName] = useState(agency.ownerName || '');
  const [mobile, setMobile] = useState(agency.phone || '');
  const [whatsapp, setWhatsapp] = useState(agency.whatsappNumber || agency.phone || '');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [website, setWebsite] = useState(agency.website || '');
  const [officeAddress, setOfficeAddress] = useState(agency.officeAddress || '');
  const [description, setDescription] = useState(agency.description || '');
  const [ownerPhotoUrl, setOwnerPhotoUrl] = useState(agency.ownerPhotoUrl || '');
  const [areas, setAreas] = useState<{ city: string; areaName: string; pinCode: string }[]>(
    agency.serviceAreas?.length ? agency.serviceAreas.map((a: any) => ({ city: a.city, areaName: a.areaName, pinCode: a.pinCode })) : [{ city: 'Pune', areaName: 'Wakad', pinCode: '411057' }]
  );

  const addArea = () => setAreas((prev) => [...prev, { city: 'Pune', areaName: '', pinCode: '' }]);
  const removeArea = (i: number) => setAreas((prev) => prev.filter((_, idx) => idx !== i));
  const updateArea = (i: number, key: string, value: string) =>
    setAreas((prev) => prev.map((a, idx) => (idx === i ? { ...a, [key]: value } : a)));

  const handlePhotoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOwnerPhotoUrl(URL.createObjectURL(file));
  };

  const submit = async () => {
    setBusy(true);
    const res = await saveBasicDetailsAction({
      agencyName,
      ownerName,
      mobile,
      whatsappNumber: sameAsMobile ? mobile : whatsapp,
      ownerPhotoUrl,
      serviceAreas: areas.filter((a) => a.areaName && a.pinCode),
    });
    setBusy(false);
    if (res.success) { notify('Agency & owner details saved.', true); onDone(res.agency); }
    else notify(res.error);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-slate-900">Step 1 · Agency & Owner Details</h2>
        <p className="text-xs text-slate-500 font-medium">Provide your agency business name, owner contact info, and primary service area.</p>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-4">
        <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider">Agency Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Agency / Business Name</FieldLabel>
            <input className={inputCls} value={agencyName} onChange={(e) => setAgencyName(e.target.value)} placeholder="e.g. Apex Cleaning Services" />
          </div>
          <div>
            <FieldLabel optional>Business Website</FieldLabel>
            <input className={inputCls} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://youragency.com" />
          </div>
        </div>

        <div>
          <FieldLabel optional>Office Address (Optional)</FieldLabel>
          <input className={inputCls} value={officeAddress} onChange={(e) => setOfficeAddress(e.target.value)} placeholder="Office Address (Optional)" />
        </div>

        <div>
          <FieldLabel optional>Agency Description</FieldLabel>
          <textarea className={inputCls} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief summary of your agency experience and cleaning specialization..." />
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-4">
        <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider">Owner / Contact Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Owner Full Name</FieldLabel>
            <input className={inputCls} value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Full owner name" />
          </div>
          <div>
            <FieldLabel>Mobile Number</FieldLabel>
            <input className={inputCls} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 items-center">
          <div>
            <FieldLabel optional>WhatsApp Number</FieldLabel>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2 cursor-pointer">
              <input type="checkbox" checked={sameAsMobile} onChange={(e) => setSameAsMobile(e.target.checked)} /> Same as mobile number
            </label>
            {!sameAsMobile && (
              <input className={inputCls} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="WhatsApp number" />
            )}
          </div>

          <div>
            <FieldLabel optional>Owner Photo</FieldLabel>
            <div className="flex items-center gap-3">
              {ownerPhotoUrl ? (
                <img src={ownerPhotoUrl} alt="Owner" className="w-12 h-12 rounded-xl object-cover border border-gray-300" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400">
                  <Upload className="w-5 h-5" />
                </div>
              )}
              <label className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold cursor-pointer hover:border-amber-400 transition-all bg-white">
                Choose Photo
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoPick} />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
        <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider">Service Areas Covered</h3>
        <div className="space-y-2">
          {areas.map((a, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
              <input className={inputCls} value={a.city} onChange={(e) => updateArea(i, 'city', e.target.value)} placeholder="City" />
              <input className={inputCls} value={a.areaName} onChange={(e) => updateArea(i, 'areaName', e.target.value)} placeholder="Area / Locality" />
              <input className={inputCls} value={a.pinCode} onChange={(e) => updateArea(i, 'pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Pin Code" />
              <button type="button" onClick={() => removeArea(i)} disabled={areas.length === 1} className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addArea} className="text-xs font-extrabold text-amber-800 flex items-center gap-1 hover:text-slate-900">
          <Plus className="w-3.5 h-3.5" /> Add another service area
        </button>
      </div>

      <div className="flex justify-end pt-2">
        <button disabled={busy} onClick={submit} className="bg-[#FACC15] hover:bg-amber-400 disabled:opacity-60 text-black font-black text-xs px-8 py-3 rounded-xl shadow-md flex items-center gap-2 uppercase tracking-wider">
          {busy && <Loader2 className="w-4 h-4 animate-spin" />} Continue to Mobile OTP <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ---------------- STEP 2: MOBILE OTP ----------------
function OtpStep({ agency, busy, setBusy, notify, onBack, onDone }: any) {
  const [sent, setSent] = useState(false);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [devOtp, setDevOtp] = useState<string | undefined>(undefined);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const sendOtp = async () => {
    setBusy(true);
    const res = await sendMobileOtpAction(agency.phone);
    setBusy(false);
    if (res.success) {
      setSent(true);
      setTimer(30);
      setDevOtp(res.devOtp);
      notify('OTP sent to your registered mobile number.', true);
    } else notify(res.error);
  };

  const handleDigit = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const verify = async () => {
    const code = digits.join('');
    if (code.length !== 6) { notify('Enter the full 6-digit OTP'); return; }
    setBusy(true);
    const res = await verifyMobileOtpAction(agency.phone, code);
    setBusy(false);
    if (res.success) { notify('Mobile number verified successfully!', true); onDone(res.agency); }
    else notify(res.error);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-slate-900">Step 2 · Mobile OTP Verification</h2>
        <p className="text-xs text-slate-500 font-medium">Verify your primary contact number <strong className="text-slate-900">{agency.phone}</strong> via SMS OTP.</p>
      </div>

      {agency.mobileVerified ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Mobile number {agency.phone} is verified ✓</span>
          </div>
          <button onClick={() => onDone(agency)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black">
            Continue to KYC →
          </button>
        </div>
      ) : !sent ? (
        <div className="p-6 bg-slate-50 rounded-2xl border border-gray-200 text-center space-y-4">
          <Phone className="w-10 h-10 text-amber-600 mx-auto" />
          <p className="text-xs text-slate-600 font-semibold">Click below to send a 6-digit verification code to {agency.phone}</p>
          <button disabled={busy} onClick={sendOtp} className="bg-[#FACC15] hover:bg-amber-400 text-black font-black text-xs px-8 py-3 rounded-xl shadow-md uppercase tracking-wider">
            {busy ? 'Sending OTP...' : 'Send Verification OTP'}
          </button>
        </div>
      ) : (
        <div className="p-6 bg-slate-50 rounded-2xl border border-gray-200 space-y-4 text-center">
          {devOtp && (
            <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-xs font-black text-amber-900 flex items-center justify-between gap-3">
              <span>TEST OTP: <strong className="text-red-700 font-extrabold tracking-widest text-sm">{devOtp}</strong></span>
              <button
                type="button"
                onClick={() => {
                  const arr = (devOtp || '123456').split('').slice(0, 6);
                  setDigits(arr);
                }}
                className="bg-amber-800 hover:bg-amber-900 text-white text-[11px] font-black px-3 py-1.5 rounded-lg shadow-sm"
              >
                Auto-fill Code
              </button>
            </div>
          )}
          <p className="text-xs text-slate-600 font-semibold">Enter the 6-digit code sent to {agency.phone}</p>
          <div className="flex justify-center gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el; }}
                value={d}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Backspace' && !d && i > 0) refs.current[i - 1]?.focus(); }}
                maxLength={1}
                className="w-10 h-12 text-center text-lg font-black border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FACC15] bg-white"
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 text-xs">
            {timer > 0 ? (
              <span className="text-slate-400 font-bold">Resend OTP in {timer}s</span>
            ) : (
              <button onClick={sendOtp} disabled={busy} className="text-amber-800 font-black hover:underline">Resend OTP</button>
            )}
          </div>

          <div className="flex justify-between pt-2">
            <button onClick={onBack} className="px-6 py-3 rounded-xl border border-gray-200 text-xs font-bold text-slate-600">Back</button>
            <button disabled={busy} onClick={verify} className="bg-[#FACC15] hover:bg-amber-400 text-black font-black text-xs px-8 py-3 rounded-xl shadow-md uppercase tracking-wider">
              {busy ? 'Verifying...' : 'Verify OTP & Continue →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- STEP 3: KYC & BUSINESS VERIFICATION ----------------
function FileUploadBox({ label, url, onPick }: { label: string; url: string; onPick: (url: string) => void }) {
  return (
    <div>
      <span className="text-xs font-black text-slate-900 block mb-1">{label}</span>
      <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-xs font-bold cursor-pointer hover:border-amber-400 transition-all bg-white">
        <Upload className="w-4 h-4 text-gray-400" />
        {url ? 'Replace File' : 'Upload Document'}
        <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(URL.createObjectURL(f));
        }} />
      </label>
      {url && <span className="text-[10px] text-emerald-600 font-bold mt-1 block">✓ File attached</span>}
    </div>
  );
}

function KycStep({ agency, busy, setBusy, notify, onBack, onDone }: any) {
  const [aadhaar, setAadhaar] = useState('');
  const [aadhaarDoc, setAadhaarDoc] = useState('');
  const [pan, setPan] = useState(agency.panNumber || '');
  const [panDoc, setPanDoc] = useState('');
  const [hasGst, setHasGst] = useState(agency.hasGst || false);
  const [gstNumber, setGstNumber] = useState(agency.gstNumber || '');
  const [gstDoc, setGstDoc] = useState('');

  const submit = async () => {
    setBusy(true);
    const res = await saveKycAction({ aadhaarNumber: aadhaar, aadhaarDocUrl: aadhaarDoc, panNumber: pan, panDocUrl: panDoc });
    setBusy(false);
    if (res.success) { notify('KYC details saved.', true); onDone(res.agency); }
    else notify(res.error);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-slate-900">Step 3 · KYC & Business Verification</h2>
        <p className="text-xs text-slate-500 font-medium">Submit owner identity documents for verification. GST registration is conditional.</p>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-4">
        <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider">Owner KYC Documents</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Aadhaar Number (12 Digits)</FieldLabel>
            <input className={inputCls} value={aadhaar} onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="12-digit Aadhaar number" />
          </div>
          <FileUploadBox label="Aadhaar Card Upload *" url={aadhaarDoc} onPick={setAadhaarDoc} />

          <div>
            <FieldLabel>PAN Number</FieldLabel>
            <input className={inputCls} value={pan} onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))} placeholder="ABCDE1234F" />
          </div>
          <FileUploadBox label="PAN Card Upload *" url={panDoc} onPick={setPanDoc} />
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider">GST Registration (Conditional)</h3>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input type="checkbox" checked={hasGst} onChange={(e) => setHasGst(e.target.checked)} /> Agency has GST Registration
          </label>
        </div>

        {hasGst && (
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div>
              <FieldLabel optional>GSTIN Number</FieldLabel>
              <input className={inputCls} value={gstNumber} onChange={(e) => setGstNumber(e.target.value.toUpperCase())} placeholder="27AAAAA0000A1Z5" />
            </div>
            <FileUploadBox label="GST Certificate Upload" url={gstDoc} onPick={setGstDoc} />
          </div>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="px-6 py-3 rounded-xl border border-gray-200 text-xs font-bold text-slate-600">Back</button>
        <button disabled={busy} onClick={submit} className="bg-[#FACC15] hover:bg-amber-400 text-black font-black text-xs px-8 py-3 rounded-xl shadow-md uppercase tracking-wider">
          Save KYC & Continue →
        </button>
      </div>
    </div>
  );
}

// ---------------- STEP 4: SERVICES & SERVICE COVERAGE ----------------
function BusinessOpsStep({ agency, services, busy, setBusy, notify, onBack, onDone }: any) {
  const [selectedServices, setSelectedServices] = useState<string[]>(agency.services?.map((s: any) => s.service?.slug).filter(Boolean) || ['deep-cleaning']);
  const [areas, setAreas] = useState<{ city: string; areaName: string; pinCode: string }[]>(
    agency.serviceAreas?.length ? agency.serviceAreas.map((a: any) => ({ city: a.city, areaName: a.areaName, pinCode: a.pinCode })) : [{ city: 'Pune', areaName: 'Wakad', pinCode: '411057' }]
  );

  const toggle = (slug: string) =>
    setSelectedServices(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);

  const addArea = () => setAreas((prev) => [...prev, { city: 'Pune', areaName: '', pinCode: '' }]);
  const updateArea = (i: number, key: string, value: string) => setAreas((prev) => prev.map((a, idx) => (idx === i ? { ...a, [key]: value } : a)));
  const removeArea = (i: number) => setAreas((prev) => prev.filter((_, idx) => idx !== i));

  const submit = async () => {
    setBusy(true);
    const res = await saveBusinessOperationsAction({
      teamsCount: agency.teamsCount || 2,
      cleanerCount: agency.cleanerCount || 6,
      equipmentList: agency.equipmentList ? JSON.parse(agency.equipmentList) : ['Vacuum Cleaner', 'Pressure Washer'],
      serviceSlugs: selectedServices,
      serviceAreas: areas.filter((a) => a.areaName && a.pinCode),
    });
    setBusy(false);
    if (res.success) { notify('Services catalog selection saved.', true); onDone(res.agency); }
    else notify(res.error);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-slate-900">Step 4 · Services & Service Coverage</h2>
        <p className="text-xs text-slate-500 font-medium">Select the central Kleanzo cleaning services your agency is equipped to execute.</p>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
        <FieldLabel>Services Offered (Select all applicable)</FieldLabel>
        <div className="grid sm:grid-cols-2 gap-2">
          {services.map((s: any) => (
            <label key={s.slug} className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${selectedServices.includes(s.slug) ? 'bg-amber-100 border-[#FACC15] text-slate-900 shadow-xs' : 'bg-white border-gray-200 text-slate-600'}`}>
              <input type="checkbox" checked={selectedServices.includes(s.slug)} onChange={() => toggle(s.slug)} />
              {s.name}
            </label>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
        <FieldLabel>Fulfillment Zones & Locality Coverage</FieldLabel>
        <div className="space-y-2">
          {areas.map((a, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
              <input className={inputCls} value={a.city} onChange={(e) => updateArea(i, 'city', e.target.value)} placeholder="City" />
              <input className={inputCls} value={a.areaName} onChange={(e) => updateArea(i, 'areaName', e.target.value)} placeholder="Area / Locality" />
              <input className={inputCls} value={a.pinCode} onChange={(e) => updateArea(i, 'pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Pin code" />
              <button type="button" onClick={() => removeArea(i)} disabled={areas.length === 1} className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30"><X className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addArea} className="text-xs font-extrabold text-amber-800 flex items-center gap-1 hover:text-slate-900">
          <Plus className="w-3.5 h-3.5" /> Add local service area
        </button>
      </div>

      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="px-6 py-3 rounded-xl border border-gray-200 text-xs font-bold text-slate-600">Back</button>
        <button disabled={busy} onClick={submit} className="bg-[#FACC15] hover:bg-amber-400 text-black font-black text-xs px-8 py-3 rounded-xl shadow-md uppercase tracking-wider">
          Save Services & Continue →
        </button>
      </div>
    </div>
  );
}

// ---------------- STEP 5: TEAM & OPERATIONS ----------------
function TeamOpsStep({ agency, busy, setBusy, notify, onBack, onDone }: any) {
  const [teamsCount, setTeamsCount] = useState(agency.teamsCount || 2);
  const [cleanerCount, setCleanerCount] = useState(agency.cleanerCount || 6);
  const [supervisors, setSupervisors] = useState(agency.supervisorCount || 1);
  const [maxJobs, setMaxJobs] = useState(agency.maxJobsPerDay || 4);
  const [equipment, setEquipment] = useState<string[]>(agency.equipmentList ? JSON.parse(agency.equipmentList) : ['Vacuum Cleaner (Wet & Dry)', 'Pressure Washer']);
  const [otherEquipment, setOtherEquipment] = useState('');
  const [transport, setTransport] = useState(agency.transportationAvailable !== false);

  const toggleEq = (eq: string) =>
    setEquipment(prev => prev.includes(eq) ? prev.filter(e => e !== eq) : [...prev, eq]);

  const submit = async () => {
    setBusy(true);
    const finalEq = [...equipment];
    if (otherEquipment.trim()) finalEq.push(otherEquipment.trim());

    const res = await saveBusinessOperationsAction({
      teamsCount: Number(teamsCount),
      cleanerCount: Number(cleanerCount),
      equipmentList: finalEq,
      serviceSlugs: agency.services?.map((s: any) => s.service?.slug).filter(Boolean) || ['deep-cleaning'],
      serviceAreas: agency.serviceAreas?.map((a: any) => ({ city: a.city, areaName: a.areaName, pinCode: a.pinCode })) || [{ city: 'Pune', areaName: 'Wakad', pinCode: '411057' }],
    });
    setBusy(false);
    if (res.success) { notify('Operational capacity saved.', true); onDone(res.agency); }
    else notify(res.error);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-slate-900">Step 5 · Team & Operations Capacity</h2>
        <p className="text-xs text-slate-500 font-medium">Specify active cleaning teams, cleaner headcount, supervisors, and equipment inventory.</p>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-4">
        <h3 className="text-xs font-black uppercase text-amber-900 tracking-wider">Human Resources Capacity</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <FieldLabel>Active Teams</FieldLabel>
            <input type="number" min={1} className={inputCls} value={teamsCount} onChange={(e) => setTeamsCount(Number(e.target.value))} />
          </div>
          <div>
            <FieldLabel>Cleaners</FieldLabel>
            <input type="number" min={1} className={inputCls} value={cleanerCount} onChange={(e) => setCleanerCount(Number(e.target.value))} />
          </div>
          <div>
            <FieldLabel>Supervisors</FieldLabel>
            <input type="number" min={1} className={inputCls} value={supervisors} onChange={(e) => setSupervisors(Number(e.target.value))} />
          </div>
          <div>
            <FieldLabel>Max Jobs / Day</FieldLabel>
            <input type="number" min={1} className={inputCls} value={maxJobs} onChange={(e) => setMaxJobs(Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
        <FieldLabel>Available Cleaning Equipment</FieldLabel>
        <div className="grid sm:grid-cols-2 gap-2">
          {EQUIPMENT_OPTIONS.map((eq) => (
            <label key={eq} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${equipment.includes(eq) ? 'bg-amber-100 border-[#FACC15] text-slate-900' : 'bg-white border-gray-200 text-slate-600'}`}>
              <input type="checkbox" checked={equipment.includes(eq)} onChange={() => toggleEq(eq)} />
              {eq}
            </label>
          ))}
        </div>
        <div className="pt-2">
          <FieldLabel optional>Other Custom Equipment</FieldLabel>
          <input className={inputCls} value={otherEquipment} onChange={(e) => setOtherEquipment(e.target.value)} placeholder="e.g. Italian Marble Polishing Rig" />
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-black text-slate-900">Dedicated Transportation Available</h4>
          <p className="text-[11px] text-slate-500">Do teams have agency vehicles for equipment transport?</p>
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
          <input type="checkbox" checked={transport} onChange={(e) => setTransport(e.target.checked)} /> Yes, vehicle available
        </label>
      </div>

      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="px-6 py-3 rounded-xl border border-gray-200 text-xs font-bold text-slate-600">Back</button>
        <button disabled={busy} onClick={submit} className="bg-[#FACC15] hover:bg-amber-400 text-black font-black text-xs px-8 py-3 rounded-xl shadow-md uppercase tracking-wider">
          Save Operations & Continue →
        </button>
      </div>
    </div>
  );
}

// ---------------- STEP 6: BANK DETAILS ----------------
function BankDetailsStep({ agency, busy, setBusy, notify, onBack, onDone }: any) {
  const [accountHolder, setAccountHolder] = useState(agency.bankAccountHolder || agency.ownerName || '');
  const [bankName, setBankName] = useState(agency.bankName || '');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [chequeUrl, setChequeUrl] = useState('');

  const submit = async () => {
    setBusy(true);
    const res = await saveBankDetailsAction({ accountHolder, bankName, accountNumber, ifscCode: ifsc, cancelledChequeUrl: chequeUrl || undefined });
    setBusy(false);
    if (res.success) { notify('Bank details saved securely.', true); onDone(res.agency); }
    else notify(res.error);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-slate-900">Step 6 · Bank & Settlement Information</h2>
        <p className="text-xs text-slate-500 font-medium">Bank account details for weekly partner payouts from Kleanzo. Never exposed to customers.</p>
      </div>

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2">
        <Lock className="w-4 h-4 text-amber-700 shrink-0" />
        <span>Financial Privacy Guarantee: Bank details are encrypted and isolated from public customer views.</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Account Holder Name</FieldLabel>
          <input className={inputCls} value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="Full account holder name" />
        </div>
        <div>
          <FieldLabel>Bank Name</FieldLabel>
          <input className={inputCls} value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. HDFC Bank" />
        </div>
        <div>
          <FieldLabel>Account Number</FieldLabel>
          <input className={inputCls} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))} placeholder="9-18 digit account number" />
        </div>
        <div>
          <FieldLabel>IFSC Code</FieldLabel>
          <input className={inputCls} value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase())} placeholder="e.g. HDFC0001234" />
        </div>
      </div>

      <FileUploadBox label="Cancelled Cheque / Bank Passbook (Optional)" url={chequeUrl} onPick={setChequeUrl} />

      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="px-6 py-3 rounded-xl border border-gray-200 text-xs font-bold text-slate-600">Back</button>
        <button disabled={busy} onClick={submit} className="bg-[#FACC15] hover:bg-amber-400 text-black font-black text-xs px-8 py-3 rounded-xl shadow-md uppercase tracking-wider">
          Save Bank Details & Continue →
        </button>
      </div>
    </div>
  );
}

// ---------------- STEP 7: PARTNER AGREEMENT ----------------
function AgreementStep({ agency, busy, setBusy, notify, onBack, onDone }: any) {
  const [accepted, setAccepted] = useState(agency.agreementAccepted || false);

  const submit = async () => {
    if (!accepted) { notify('You must accept the Partner Agreement to continue'); return; }
    setBusy(true);
    const res = await acceptPartnerAgreementAction();
    setBusy(false);
    if (res.success) { notify('Partner agreement accepted.', true); onDone(res.agency); }
    else notify(res.error);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-slate-900">Step 7 · Kleanzo Partner Agreement (v1.2)</h2>
        <p className="text-xs text-slate-500 font-medium">Review and accept official terms of service, quality SLAs, and fixed partner payout policies.</p>
      </div>

      <div className="bg-slate-50 border border-gray-200 rounded-2xl p-5 text-xs text-slate-700 space-y-3 max-h-72 overflow-y-auto font-medium">
        <h3 className="font-black text-slate-900 uppercase tracking-wider">Official Fulfillment Terms & SLA</h3>
        <p><strong>1. Golden Rule Compliance:</strong> Every cleaning job requires a mandatory site inspection with before-photos (Rule 2) and supervisor Quality Control check with after-photos (Rule 3) before customer handover (Rule 4).</p>
        <p><strong>2. Partner Payouts:</strong> Fixed partner payouts are issued directly by Kleanzo upon customer approval. Agency shall not negotiate customer pricing directly.</p>
        <p><strong>3. Customer Non-Diversion:</strong> Agency and staff agree not to solicit or solicit direct cleaning contracts from Kleanzo customers outside the platform.</p>
        <p><strong>4. Chemical Safety:</strong> Strict non-acidic solvent guidelines apply to Italian marble, granite, and brass fittings.</p>
        <p><strong>5. Punctuality & SLA:</strong> Partner must maintain &ge;95% on-time arrival rate. Repeated unexcused delays may result in account suspension.</p>
      </div>

      <label className="flex items-start gap-2.5 text-xs font-bold text-slate-900 cursor-pointer bg-amber-50 p-4 rounded-xl border border-amber-200">
        <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-0.5" />
        <span>I have read and agree to the Kleanzo Partner Agreement (v1.2) and operational standards.</span>
      </label>

      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="px-6 py-3 rounded-xl border border-gray-200 text-xs font-bold text-slate-600">Back</button>
        <button disabled={busy || !accepted} onClick={submit} className="bg-[#FACC15] hover:bg-amber-400 disabled:opacity-40 text-black font-black text-xs px-8 py-3 rounded-xl shadow-md uppercase tracking-wider">
          Accept & Proceed to Review →
        </button>
      </div>
    </div>
  );
}

// ---------------- STEP 8: FINAL REVIEW & SUBMISSION ----------------
function FinalReviewStep({ agency, busy, setBusy, notify, onJumpStep, onSubmitted }: any) {
  const applicationCode = agency.applicationCode || `KZ-PARTNER-${agency.id?.substring(0, 6).toUpperCase()}`;
  const isSubmitted = agency.partnerStatus === 'UNDER_REVIEW' || agency.partnerStatus === 'SUBMITTED';

  const handleFinalSubmit = async () => {
    setBusy(true);
    const res = await submitOnboardingForReviewAction();
    setBusy(false);
    if (res.success) {
      notify('Partner application submitted successfully!', true);
      onSubmitted(res.agency);
    } else {
      notify(res.error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-10 h-10 text-amber-600" />
        </div>

        <div className="space-y-1">
          <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full uppercase">
            APPLICATION UNDER REVIEW
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">Application Submitted Successfully!</h2>
          <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto">
            Your application <strong className="text-slate-900">{applicationCode}</strong> is currently being reviewed by Kleanzo Operations.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-gray-200 text-xs font-bold text-slate-700 max-w-md mx-auto text-left space-y-2">
          <div className="flex justify-between"><span>Agency Name:</span><span className="text-slate-900">{agency.name}</span></div>
          <div className="flex justify-between"><span>Application Code:</span><span className="text-amber-800 font-black">{applicationCode}</span></div>
          <div className="flex justify-between"><span>Status:</span><span className="text-amber-700 uppercase">Under Review</span></div>
        </div>

        <div className="pt-4 flex justify-center gap-3">
          <a
            href="/agency/dashboard"
            className="bg-slate-900 hover:bg-black text-white font-black text-xs px-8 py-3 rounded-xl uppercase tracking-wider shadow-md"
          >
            Go to Partner Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-slate-900">Review Your Partner Application</h2>
        <p className="text-xs text-slate-500 font-medium">Verify all details before submitting for Kleanzo Admin verification.</p>
      </div>

      <div className="space-y-4">
        {/* Section 1 */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 flex justify-between items-start">
          <div className="text-xs space-y-1">
            <h4 className="font-black text-slate-900 uppercase">1. Agency & Owner Details</h4>
            <p className="text-slate-600"><strong>Name:</strong> {agency.name} | <strong>Owner:</strong> {agency.ownerName} | <strong>Phone:</strong> {agency.phone}</p>
          </div>
          <button onClick={() => onJumpStep(1)} className="text-amber-800 font-black text-xs flex items-center gap-1 hover:underline">
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        {/* Section 2 */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 flex justify-between items-start">
          <div className="text-xs space-y-1">
            <h4 className="font-black text-slate-900 uppercase">2. Mobile Verification</h4>
            <p className="text-emerald-700 font-bold">✓ Mobile number {agency.phone} verified</p>
          </div>
          <button onClick={() => onJumpStep(2)} className="text-amber-800 font-black text-xs flex items-center gap-1 hover:underline">
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        {/* Section 3 */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 flex justify-between items-start">
          <div className="text-xs space-y-1">
            <h4 className="font-black text-slate-900 uppercase">3. KYC & Business Documents</h4>
            <p className="text-slate-600"><strong>PAN:</strong> {agency.panNumber || 'Submitted'} | <strong>Aadhaar:</strong> {agency.aadhaarNumber || 'Submitted'}</p>
          </div>
          <button onClick={() => onJumpStep(3)} className="text-amber-800 font-black text-xs flex items-center gap-1 hover:underline">
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        {/* Section 4 */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 flex justify-between items-start">
          <div className="text-xs space-y-1">
            <h4 className="font-black text-slate-900 uppercase">4. Services & Coverage</h4>
            <p className="text-slate-600">Selected services and local Pune service areas saved.</p>
          </div>
          <button onClick={() => onJumpStep(4)} className="text-amber-800 font-black text-xs flex items-center gap-1 hover:underline">
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        {/* Section 5 */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 flex justify-between items-start">
          <div className="text-xs space-y-1">
            <h4 className="font-black text-slate-900 uppercase">5. Team & Operations</h4>
            <p className="text-slate-600"><strong>Teams:</strong> {agency.teamsCount || 2} | <strong>Cleaners:</strong> {agency.cleanerCount || 6}</p>
          </div>
          <button onClick={() => onJumpStep(5)} className="text-amber-800 font-black text-xs flex items-center gap-1 hover:underline">
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        {/* Section 6 */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 flex justify-between items-start">
          <div className="text-xs space-y-1">
            <h4 className="font-black text-slate-900 uppercase">6. Bank Details</h4>
            <p className="text-slate-600"><strong>Holder:</strong> {agency.bankAccountHolder || agency.ownerName} | <strong>Bank:</strong> {agency.bankName || 'Configured'}</p>
          </div>
          <button onClick={() => onJumpStep(6)} className="text-amber-800 font-black text-xs flex items-center gap-1 hover:underline">
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        {/* Section 7 */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 flex justify-between items-start">
          <div className="text-xs space-y-1">
            <h4 className="font-black text-slate-900 uppercase">7. Partner Agreement</h4>
            <p className="text-emerald-700 font-bold">✓ Kleanzo Partner Agreement accepted</p>
          </div>
          <button onClick={() => onJumpStep(7)} className="text-amber-800 font-black text-xs flex items-center gap-1 hover:underline">
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
      </div>

      <div className="pt-4 flex justify-between items-center">
        <button onClick={() => onJumpStep(7)} className="px-6 py-3 rounded-xl border border-gray-200 text-xs font-bold text-slate-600">Back</button>
        <button
          disabled={busy}
          onClick={handleFinalSubmit}
          className="bg-[#FACC15] hover:bg-amber-400 text-black font-black text-xs px-10 py-3.5 rounded-xl shadow-lg uppercase tracking-wider flex items-center gap-2 cursor-pointer"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Submit Partner Application →'}
        </button>
      </div>
    </div>
  );
}
