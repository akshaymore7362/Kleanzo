'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  Phone,
  ShieldCheck,
  Star,
  Clock,
  Building,
  UserPlus,
  Wrench,
  ChevronRight
} from 'lucide-react';

interface CrewMember {
  id: string;
  name: string;
  phone: string;
  role: 'SUPERVISOR' | 'CLEANER' | 'SPECIALIST';
  skills: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'ON_JOB' | 'VERIFICATION_PENDING';
  rating: number;
  completedJobs: number;
  noShowCount: number;
  currentAssignment?: string;
}

export default function AgencyCrewClientView() {
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'CALENDAR'>('MEMBERS');
  const [showAddModal, setShowAddModal] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [crew, setCrew] = useState<CrewMember[]>([
    {
      id: 'crew-1',
      name: 'Rajesh Shinde',
      phone: '+91 98220 12345',
      role: 'SUPERVISOR',
      skills: ['Deep Cleaning', 'Floor Scrubbing', 'Team Lead'],
      status: 'ON_JOB',
      rating: 4.9,
      completedJobs: 84,
      noShowCount: 0,
      currentAssignment: 'KZ-10234 (Kitchen Degreasing)',
    },
    {
      id: 'crew-2',
      name: 'Suresh Patil',
      phone: '+91 98765 11223',
      role: 'SPECIALIST',
      skills: ['Sofa Shampooing', 'Carpet Cleaning', 'Steam Degreasing'],
      status: 'ACTIVE',
      rating: 4.8,
      completedJobs: 62,
      noShowCount: 0,
    },
    {
      id: 'crew-3',
      name: 'Ramesh Pawar',
      phone: '+91 91234 99887',
      role: 'CLEANER',
      skills: ['Bathroom Deep Clean', 'Glass Cleaning'],
      status: 'ACTIVE',
      rating: 4.7,
      completedJobs: 45,
      noShowCount: 1,
    },
    {
      id: 'crew-4',
      name: 'Anil Jadhav',
      phone: '+91 99887 12344',
      role: 'CLEANER',
      skills: ['Post-Construction Clean', 'Dusting'],
      status: 'VERIFICATION_PENDING',
      rating: 4.5,
      completedJobs: 12,
      noShowCount: 0,
    }
  ]);

  const calendarDays = ['Mon 09', 'Tue 10', 'Wed 11', 'Thu 12', 'Fri 13', 'Sat 14', 'Sun 15'];
  const teamSlots = [
    { teamName: 'Team Alpha (Lead: Rajesh)', schedule: ['ON_JOB (10-2)', 'AVAILABLE', 'ON_JOB (2-5)', 'AVAILABLE', 'ON_JOB (10-2)', 'AVAILABLE', 'OFF'] },
    { teamName: 'Team Beta (Lead: Suresh)', schedule: ['AVAILABLE', 'ON_JOB (10-2)', 'AVAILABLE', 'ON_JOB (10-2)', 'AVAILABLE', 'ON_JOB (2-5)', 'OFF'] },
    { teamName: 'Team Gamma (Lead: Ramesh)', schedule: ['ON_JOB (2-5)', 'AVAILABLE', 'ON_JOB (10-2)', 'AVAILABLE', 'ON_JOB (2-5)', 'AVAILABLE', 'OFF'] },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-6 sm:p-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-amber-600 tracking-wider uppercase mb-1">
            <Building className="w-4 h-4 text-amber-500" /> Agency Fulfillment Operations
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#E8B619]" /> Agency Crew Management & Availability Calendar
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage field technicians, supervisors, skills verification, attendance history, and weekly dispatch schedules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setNotice('New crew registration modal opened');
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
          >
            <UserPlus className="w-4 h-4" /> Register New Crew Member
          </button>
          <Link
            href="/agency/dashboard"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-gray-200 rounded-2xl text-xs font-bold transition"
          >
            Agency Dashboard
          </Link>
        </div>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-xs font-bold flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-emerald-700 font-black">Dismiss</button>
        </div>
      )}

      {/* Navigation Mode Switcher */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
        <button
          onClick={() => setActiveTab('MEMBERS')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'MEMBERS'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4" /> Crew Roster ({crew.length})
        </button>

        <button
          onClick={() => setActiveTab('CALENDAR')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'CALENDAR'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Calendar className="w-4 h-4" /> Visual Weekly Availability Matrix
        </button>
      </div>

      {activeTab === 'MEMBERS' ? (
        /* Crew Roster Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crew.map((member) => (
            <div key={member.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-4">
              
              <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">{member.name}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      member.status === 'ON_JOB' ? 'bg-indigo-100 text-indigo-800' :
                      member.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {member.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {member.phone}
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-1 rounded-xl text-xs font-extrabold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {member.rating}
                </div>
              </div>

              {/* Role & Skills */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-bold">Role: </span>
                  <span className="font-extrabold text-slate-800">{member.role}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold">Certified Skills:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {member.skills.map((skill, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {member.currentAssignment && (
                  <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-2xl text-[11px] text-indigo-900 font-bold space-y-1">
                    <div>Currently Assigned:</div>
                    <div className="text-indigo-700">{member.currentAssignment}</div>
                  </div>
                )}
              </div>

              {/* Attendance & Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <div className="text-[10px] font-bold text-slate-400">Completed Jobs</div>
                  <div className="text-sm font-black text-slate-900">{member.completedJobs}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400">No-Show Count</div>
                  <div className="text-sm font-black text-red-600">{member.noShowCount}</div>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Visual Crew Availability Calendar Matrix */
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" /> Weekly Resource & Double-Booking Prevention Grid
            </h2>
            <span className="text-xs font-bold text-slate-500">Conflict-Free Operational Dispatch</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3">Team / Crew Lead</th>
                  {calendarDays.map((day, idx) => (
                    <th key={idx} className="p-3 text-center">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-slate-700">
                {teamSlots.map((team, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-black text-slate-900">{team.teamName}</td>
                    {team.schedule.map((slot, sIdx) => (
                      <td key={sIdx} className="p-2 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-xl text-[10px] font-extrabold ${
                          slot.startsWith('ON_JOB') ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                          slot === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          'bg-gray-100 text-slate-400'
                        }`}>
                          {slot}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
