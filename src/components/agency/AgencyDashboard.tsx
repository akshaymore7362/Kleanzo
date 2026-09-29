'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, LifeBuoy } from 'lucide-react';
import { logoutAction } from '@/actions/auth-actions';
import TopNav, { type Tab } from './TopNav';
import OnboardingBanner from './OnboardingBanner';
import ProfileVerificationCard from './ProfileVerificationCard';
import AgencyOperationsCard from './AgencyOperationsCard';
import VerificationCenterCard from './VerificationCenterCard';
import PartnerModelTimeline from './PartnerModelTimeline';
import ResponsibilityCards from './ResponsibilityCards';
import PerformanceRow from './PerformanceRow';
import ClassificationCard from './ClassificationCard';
import { ConfirmDialog } from './shared';
import AgencyFooter from './AgencyFooter';

export default function AgencyDashboard({ currentUser, agency, pendingJobs, activeJobs, jobHistory, payouts, crew, settlements }: any) {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4500);
  };

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = '/login?switch=true';
  };

  return (
    <div className="bg-[#F4F6F8] min-h-screen flex flex-col font-sans">
      <TopNav currentUser={currentUser} agency={agency} tab={tab} setTab={setTab} onLogout={() => setLogoutConfirm(true)} />

      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl text-xs font-black flex items-center gap-2 ${toast.ok ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />} {toast.msg}
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {tab === 'dashboard' && (
          <>
            {/* Top Banner */}
            <OnboardingBanner agency={agency} />

            {/* 3 Columns Row: Profile Verification | Operations | Verification Center */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
              <div className="lg:col-span-1">
                <ProfileVerificationCard agency={agency} />
              </div>
              <div className="lg:col-span-2">
                <AgencyOperationsCard
                  agency={agency}
                  pendingJobs={pendingJobs}
                  activeJobs={activeJobs}
                  jobHistory={jobHistory}
                  payouts={payouts}
                  settlements={settlements}
                  crew={crew}
                  notify={notify}
                />
              </div>
              <div className="lg:col-span-1">
                <VerificationCenterCard agency={agency} />
              </div>
            </div>

            {/* Partner Model & Responsibilities */}
            <PartnerModelTimeline />
            <ResponsibilityCards />

            {/* Performance & Classification */}
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-black text-black">Performance</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Track your performance and grow with Kleanzo</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
                <div className="lg:col-span-3">
                  <PerformanceRow agency={agency} />
                </div>
                <div className="lg:col-span-1">
                  <ClassificationCard agency={agency} />
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'jobs' && (
          <AgencyOperationsCard
            agency={agency}
            pendingJobs={pendingJobs}
            activeJobs={activeJobs}
            jobHistory={jobHistory}
            payouts={payouts}
            settlements={settlements}
            crew={crew}
            notify={notify}
            defaultTab="requests"
          />
        )}

        {tab === 'payouts' && (
          <AgencyOperationsCard
            agency={agency}
            pendingJobs={pendingJobs}
            activeJobs={activeJobs}
            jobHistory={jobHistory}
            payouts={payouts}
            settlements={settlements}
            crew={crew}
            notify={notify}
            defaultTab="payouts"
          />
        )}

        {tab === 'team' && (
          <AgencyOperationsCard
            agency={agency}
            pendingJobs={pendingJobs}
            activeJobs={activeJobs}
            jobHistory={jobHistory}
            payouts={payouts}
            settlements={settlements}
            crew={crew}
            notify={notify}
            defaultTab="crew"
          />
        )}

        {tab === 'resources' && (
          <div className="space-y-6">
            <PartnerModelTimeline />
            <ResponsibilityCards />
          </div>
        )}

        {tab === 'support' && (
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm max-w-2xl">
            <h2 className="text-base font-black text-black mb-2 flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-[#FACC15]" /> Partner Support
            </h2>
            <p className="text-xs text-gray-500 font-medium mb-4">Reach Kleanzo Operations for job, payout or account queries.</p>
            <div className="text-xs font-bold space-y-2 text-gray-700">
              <div>Partner Helpdesk: <span className="text-black font-extrabold">+91 98765 43210</span></div>
              <div>Email: <span className="text-black font-extrabold">support@kleanzo.com</span></div>
            </div>
          </div>
        )}
      </main>

      <AgencyFooter />

      {logoutConfirm && (
        <ConfirmDialog
          title="Logout / Switch Role"
          message="You will be signed out of your partner account. Continue?"
          confirmLabel="Logout"
          danger
          onCancel={() => setLogoutConfirm(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}

