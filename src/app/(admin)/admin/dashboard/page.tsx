'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Calendar,
  UserCheck,
  Plus,
  ArrowRight,
  TrendingUp,
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
  LogOut,
  ChevronRight,
  ChevronDown,
  Filter,
  DollarSign,
  Briefcase,
  Star,
  Check,
  X,
  FileSpreadsheet,
  Settings,
  Shield,
  History,
  Activity,
  Award,
  Package,
  Sliders,
  HelpCircle,
  RefreshCw,
  Home,
  MapPin,
  FileCheck,
} from 'lucide-react';
import { logoutAction } from '@/actions/auth-actions';
import { getAdminRealDataAction, togglePartnerStatusAction, reassignJobPartnerAction } from '@/actions/admin-actions';
import { updateBookingStatusAction } from '@/actions/booking-actions';
import type { WorkflowStatus } from '@/lib/booking/workflow-engine';

export default function OperationsAdminDashboard() {
  const [activeSidebarItem, setActiveSidebarItem] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalType, setModalType] = useState<string | null>(null);
  const [selectedBookingModal, setSelectedBookingModal] = useState<any | null>(null);
  const [newStatusSelection, setNewStatusSelection] = useState<WorkflowStatus>('CLEANING_IN_PROGRESS');
  const [selectedPartnerSelection, setSelectedPartnerSelection] = useState<string>('CleanPro Services');
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Real Database Data State
  const [realBookings, setRealBookings] = useState<any[]>([]);
  const [realAgencies, setRealAgencies] = useState<any[]>([]);
  const [realEnquiries, setRealEnquiries] = useState<any[]>([]);
  const [realAuditLogs, setRealAuditLogs] = useState<any[]>([]);
  const [realStats, setRealStats] = useState({
    enquiryCount: 12,
    quoteCount: 8,
    todayBookingCount: 6,
    unassignedCount: 5,
    inspectionPendingCount: 8,
    cleaningInProgressCount: 14,
    qcPendingCount: 7,
    approvalPendingCount: 6,
  });

  const loadRealData = async () => {
    try {
      let combinedBookings: any[] = [];
      const res = await getAdminRealDataAction();
      if (res.success && res.realData) {
        if (res.realData.bookings && res.realData.bookings.length > 0) {
          combinedBookings = [...res.realData.bookings];
        }
        if (res.realData.agencies && res.realData.agencies.length > 0) {
          setRealAgencies(res.realData.agencies);
        }
        if (res.realData.enquiries) {
          setRealEnquiries(res.realData.enquiries);
        }
        if (res.realData.auditLogs) {
          setRealAuditLogs(res.realData.auditLogs);
        }
        if (res.realData.stats) {
          setRealStats(res.realData.stats);
        }
      }

      // Merge client-side localStorage bookings if present
      if (typeof window !== 'undefined') {
        const localStr = localStorage.getItem('kleanzo_real_bookings');
        if (localStr) {
          const parsed = JSON.parse(localStr);
          if (Array.isArray(parsed)) {
            parsed.forEach((b: any) => {
              const exists = combinedBookings.some((cb: any) => cb.id === b.bookingCode || cb.id === b.id);
              if (!exists) {
                let statusLabel = 'Cleaning In Progress';
                let statusColor = 'bg-purple-100 text-purple-700';
                let stepNumber = 6;

                if (b.bookingStatus === 'QC_PASSED' || b.qcPassed) { statusLabel = 'QC Passed'; statusColor = 'bg-cyan-100 text-cyan-700'; stepNumber = 7; }
                else if (b.bookingStatus === 'CUSTOMER_APPROVED' || b.customerApproved) { statusLabel = 'Approved'; statusColor = 'bg-amber-100 text-amber-800'; stepNumber = 8; }
                else if (b.bookingStatus === 'PAYMENT_COMPLETED' || b.bookingStatus === 'CLOSED') { statusLabel = 'Fully Settled'; statusColor = 'bg-emerald-100 text-emerald-700'; stepNumber = 8; }

                combinedBookings.unshift({
                  id: b.bookingCode || b.id,
                  realDbId: b.realDbId || b.id,
                  customer: b.customerName || 'Rahul Jaykar',
                  customerPhone: b.customerPhone || '9876543210',
                  customerEmail: b.customerEmail || 'rahul.j@example.com',
                  service: b.serviceName || '3 BHK Deep Cleaning Package',
                  property: b.propertyAddress || 'Flat 402, Rosewood Society, Wakad, Pune',
                  address: b.propertyAddress || 'Flat 402, Rosewood Society, Wakad, Pune',
                  condition: b.propertyCondition || 'Medium Dirt & Stains',
                  bhkType: b.bhkType || '3 BHK',
                  requirements: b.notes || 'Deep stain removal in kitchen tiles and balcony dust clean',
                  datetime: `${b.scheduledDate || '24 May 2025'} (${b.scheduledTime || '10:00 AM'})`,
                  partner: b.partnerAgency || 'CleanPro Services',
                  status: statusLabel,
                  statusColor,
                  stepNumber,
                  payment: b.paymentStatus === 'ADVANCE_PAID' || b.paymentStatus === 'PAID' ? 'Advance Paid' : 'Pending',
                  paymentColor: 'bg-emerald-100 text-emerald-700',
                  action: 'Manage',
                  totalAmount: b.totalAmount || 4499,
                  advanceAmount: b.advanceAmount || 899,
                  balanceAmount: b.balanceAmount || 3600,
                  rawBookingObj: b
                });
              }
            });
          }
        }
      }

      setRealBookings(combinedBookings);
      setRealStats(prev => ({
        ...prev,
        todayBookingCount: Math.max(prev.todayBookingCount, combinedBookings.length)
      }));
    } catch (err) {
      console.error('Failed to load real admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealData();
  }, []);

  const showNotification = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = '/login?switch=true';
  };

  const handleSaveBookingModalUpdate = async () => {
    if (!selectedBookingModal) return;
    showNotification(`Updating booking ${selectedBookingModal.id} to ${newStatusSelection}...`);

    // 1. Call server action if realDbId is UUID
    if (selectedBookingModal.realDbId && selectedBookingModal.realDbId.includes('-')) {
      await updateBookingStatusAction(selectedBookingModal.realDbId, newStatusSelection);
    }

    // 2. Update localStorage if present
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kleanzo_real_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const updated = parsed.map((b: any) => {
            if (b.id === selectedBookingModal.id || b.bookingCode === selectedBookingModal.id) {
              const isApproved = newStatusSelection === 'CUSTOMER_APPROVED' || newStatusSelection === 'PAYMENT_COMPLETED' || newStatusSelection === 'CLOSED';
              const isQcPassed = newStatusSelection === 'QC_PASSED' || isApproved;
              const isInspectionDone = newStatusSelection === 'INSPECTION_COMPLETED' || newStatusSelection === 'CLEANING_IN_PROGRESS' || isQcPassed;
              return {
                ...b,
                bookingStatus: newStatusSelection,
                partnerAgency: selectedPartnerSelection,
                inspectionCompleted: isInspectionDone ? true : b.inspectionCompleted,
                qcPassed: isQcPassed ? true : b.qcPassed,
                customerApproved: isApproved ? true : b.customerApproved,
                paymentStatus: newStatusSelection === 'PAYMENT_COMPLETED' || newStatusSelection === 'CLOSED' ? 'PAID' : b.paymentStatus
              };
            }
            return b;
          });
          localStorage.setItem('kleanzo_real_bookings', JSON.stringify(updated));
        }
      }
    }

    setSelectedBookingModal(null);
    showNotification(`Booking ${selectedBookingModal.id} updated successfully!`);
    loadRealData();
  };

  // 8 Metric Cards
  const metrics = [
    { id: 'enquiries', title: 'New Enquiries', value: realStats.enquiryCount.toString(), change: '↑ 20%', color: 'bg-purple-50 text-purple-600', link: 'View Enquiries →', href: '/admin/bookings' },
    { id: 'quotes', title: 'Pending Quotes', value: realStats.quoteCount.toString(), change: '↑ 14%', color: 'bg-blue-50 text-blue-600', link: 'View Quotes →', href: '/admin/bookings' },
    { id: 'bookings', title: 'Today\'s Bookings', value: realStats.todayBookingCount.toString(), change: '↑ 12%', color: 'bg-emerald-50 text-emerald-600', link: 'View Bookings →', href: '/admin/bookings' },
    { id: 'unassigned', title: 'Unassigned Jobs', value: realStats.unassignedCount.toString(), change: '↑ 25%', color: 'bg-amber-50 text-amber-600', link: 'View Jobs →', href: '/admin/bookings' },
    { id: 'inspections', title: 'Inspections Pending', value: realStats.inspectionPendingCount.toString(), change: '↑ 33%', color: 'bg-indigo-50 text-indigo-600', link: 'View Inspections →', href: '/admin/bookings' },
    { id: 'cleaning', title: 'Cleaning In Progress', value: realStats.cleaningInProgressCount.toString(), change: '↑ 22%', color: 'bg-cyan-50 text-cyan-600', link: 'View Cleaning →', href: '/admin/bookings' },
    { id: 'qc', title: 'QC Pending', value: realStats.qcPendingCount.toString(), change: '↑ 17%', color: 'bg-pink-50 text-pink-600', link: 'View QC →', href: '/admin/bookings' },
    { id: 'approvals', title: 'Customer Approval Pending', value: realStats.approvalPendingCount.toString(), change: '↑ 15%', color: 'bg-orange-50 text-orange-600', link: 'View Approvals →', href: '/admin/bookings' },
  ];

  // Operations Pipeline Nodes
  const pipelineNodes = [
    { label: 'Enquiry', count: realStats.enquiryCount || 12 },
    { label: 'Quote', count: realStats.quoteCount || 8 },
    { label: 'Booking', count: realStats.todayBookingCount || 6 },
    { label: 'Advance Paid', count: realStats.todayBookingCount || 6 },
    { label: 'Team Assigned', count: realStats.todayBookingCount || 5 },
    { label: 'Site Inspection', count: realStats.inspectionPendingCount || 4 },
    { label: 'Cleaning In Progress', count: realStats.cleaningInProgressCount || 3 },
    { label: 'Quality Check (QC)', count: realStats.qcPendingCount || 2 },
    { label: 'Customer Approval', count: realStats.approvalPendingCount || 2 },
    { label: 'Balance Payment', count: 1 },
    { label: 'Invoice Issued', count: 1 },
  ];

  // Default fallback bookings
  const defaultBookings = [
    {
      id: 'KZ-PNE392',
      customer: 'Rahul Jaykar',
      customerPhone: '9876543210',
      service: '3 BHK Deep Cleaning Package',
      property: 'Flat 402, Rosewood Society, Wakad, Pune',
      address: 'Flat 402, Rosewood Society, Wakad, Pune',
      condition: 'Medium Dirt & Stains',
      bhkType: '3 BHK',
      requirements: 'Tough stains in kitchen tiles & balcony dust clean',
      datetime: '24 May 2025 (10:00 AM)',
      partner: 'CleanPro Services',
      status: 'Cleaning In Progress',
      statusColor: 'bg-purple-100 text-purple-700',
      stepNumber: 6,
      payment: 'Advance Paid (₹899)',
      paymentColor: 'bg-emerald-100 text-emerald-700',
      action: 'Manage',
      totalAmount: 4499,
      advanceAmount: 899,
      balanceAmount: 3600,
    },
    {
      id: 'KZ-PNE781',
      customer: 'Priya Sharma',
      customerPhone: '9812345678',
      service: 'Full Villa Deep Cleaning',
      property: 'Baner Hills Villa #12, Baner, Pune',
      address: 'Baner Hills Villa #12, Baner, Pune',
      condition: 'Heavy Post-Civil Mess',
      bhkType: 'Villa / Duplex',
      requirements: 'Paint splatters, cement haze & window squeegee',
      datetime: '25 May 2025 (09:00 AM)',
      partner: 'FreshHome Solutions',
      status: 'Site Inspection Completed',
      statusColor: 'bg-indigo-100 text-indigo-700',
      stepNumber: 5,
      payment: 'Advance Paid (₹1599)',
      paymentColor: 'bg-emerald-100 text-emerald-700',
      action: 'Manage',
      totalAmount: 7999,
      advanceAmount: 1599,
      balanceAmount: 6400,
    },
  ];

  const bookingsToDisplay = realBookings.length > 0 ? realBookings : defaultBookings;

  // Sidebar Menu Groups
  const sidebarGroups = [
    {
      title: 'OPERATIONS',
      items: [
        { name: 'Customers', icon: Users, href: '/admin/bookings' },
        { name: 'Enquiries', icon: FileText, href: '/admin/bookings' },
        { name: 'Quotes', icon: CreditCard, href: '/admin/bookings' },
        { name: 'Bookings', icon: Calendar, href: '/admin/bookings' },
        { name: 'Jobs', icon: Briefcase, href: '/admin/bookings' },
        { name: 'Assignments', icon: UserCheck, href: '/admin/bookings' },
        { name: 'Inspections', icon: Camera, href: '/admin/bookings' },
        { name: 'Cleaning', icon: Sparkles, href: '/admin/bookings' },
        { name: 'QC', icon: ShieldCheck, href: '/admin/bookings' },
        { name: 'Approvals', icon: CheckCircle2, href: '/admin/bookings' },
      ],
    },
    {
      title: 'PARTNERS',
      items: [
        { name: 'Partners / Agencies', icon: Building2, href: '/admin/partners' },
        { name: 'Partner Kit', icon: Package, href: '/admin/partners' },
        { name: 'Teams & Staff', icon: UserCheck, href: '/admin/partners' },
      ],
    },
    {
      title: 'FINANCE',
      items: [
        { name: 'Invoices', icon: FileText, href: '/admin/bookings' },
        { name: 'Partner Payouts', icon: DollarSign, href: '/admin/bookings' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-gray-800 font-sans">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto z-20 shadow-xs">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-gray-150 flex items-center justify-between sticky top-0 bg-white z-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#E8B619] text-black font-black flex items-center justify-center text-xl shadow-md">
              K
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#111111]">
              Kleanzo
            </span>
          </Link>
          <span className="text-[10px] font-extrabold bg-[#FEF3C7] text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full uppercase">
            Admin Portal
          </span>
        </div>

        {/* Dashboard Active Item */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => setActiveSidebarItem('Dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeSidebarItem === 'Dashboard'
                ? 'bg-[#E8B619] text-black shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Layers className="w-4 h-4 text-black" />
            Dashboard
          </button>
        </div>

        {/* Sidebar Groups */}
        <div className="px-3 space-y-5 pb-8">
          {sidebarGroups.map((group, idx) => (
            <div key={idx}>
              <p className="px-3 text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSidebarItem === item.name;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#E8B619] text-black font-extrabold shadow-xs'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER BAR */}
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-10 shadow-xs">
          
          {/* Search Input */}
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer name, booking ID, property condition..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#E8B619] focus:bg-white transition-all placeholder-gray-400"
            />
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#E8B619] text-black font-black text-[9px] rounded-full flex items-center justify-center">
                {bookingsToDisplay.length}
              </span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#E8B619] text-black font-black flex items-center justify-center text-xs shadow-xs">
                OP
              </div>
              <div className="hidden md:block text-left text-xs">
                <p className="font-extrabold text-black leading-tight">Admin Operations</p>
                <p className="text-[10px] text-gray-400 font-semibold">Live System Control</p>
              </div>
              <button
                onClick={handleLogout}
                title="Logout / Switch Portal"
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* NOTIFICATION FEEDBACK BANNER */}
        {noticeMessage && (
          <div className="bg-[#E8B619] text-black px-8 py-2.5 font-extrabold text-xs flex items-center justify-between animate-fade-in shadow-xs">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> {noticeMessage}
            </span>
            <button onClick={() => setNoticeMessage(null)} className="font-black text-sm">✕</button>
          </div>
        )}

        {/* MAIN BODY CONTAINER */}
        <main className="p-8 space-y-8 overflow-y-auto">
          
          {/* WELCOME BANNER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#111111] flex items-center gap-2">
                Kleanzo Operations Dashboard 👋
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Connected to User Dashboard — View property conditions, track records, and manage live customer bookings in real-time.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadRealData}
                className="bg-gray-100 hover:bg-gray-200 text-black font-bold text-xs px-4 py-2.5 rounded-xl border border-gray-300 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-600" /> Sync Real Customer Data
              </button>
            </div>
          </div>

          {/* TOP 8 METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-[#E8B619] transition-all hover:shadow-md cursor-pointer group block"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-gray-500">{card.title}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${card.color}`}>
                    {card.change}
                  </span>
                </div>
                <div className="text-3xl font-black text-[#111111] mb-2">{card.value}</div>
                <div className="text-[11px] font-extrabold text-[#92400E] group-hover:underline flex items-center gap-1">
                  {card.link}
                </div>
              </Link>
            ))}
          </div>

          {/* OPERATIONS PIPELINE STEPS */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-black text-base text-[#111111] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#E8B619]" /> Kleanzo 11-Step Master Operations Pipeline
            </h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 scrollbar-none">
              {pipelineNodes.map((node, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center bg-gray-50 border border-gray-200 hover:border-[#E8B619] rounded-2xl p-3 min-w-[100px] text-center transition-all">
                    <span className="w-7 h-7 rounded-full bg-[#E8B619] text-black font-black text-xs flex items-center justify-center mb-1 shadow-xs">
                      {i + 1}
                    </span>
                    <span className="text-[10px] font-bold text-gray-700 block truncate max-w-[90px]">{node.label}</span>
                    <span className="text-xs font-black text-black mt-0.5">{node.count}</span>
                  </div>
                  {i < pipelineNodes.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* REAL CUSTOMER BOOKINGS TABLE WITH PROPERTY CONDITION & TRACK RECORD */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-gray-150 flex justify-between items-center">
              <div>
                <h3 className="font-black text-base text-[#111111]">Live Customer Bookings & Track Records</h3>
                <p className="text-[11px] text-gray-400 font-medium">Synced with Customer Dashboard — includes actual property conditions & requirements</p>
              </div>
              <button onClick={loadRealData} className="text-xs font-bold text-[#92400E] hover:underline flex items-center gap-1 cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" /> Reload Latest
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-150 text-gray-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Booking ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Service & Property</th>
                    <th className="py-3.5 px-4">Actual Condition</th>
                    <th className="py-3.5 px-4">Scheduled Slot</th>
                    <th className="py-3.5 px-4">Assigned Partner</th>
                    <th className="py-3.5 px-4">Track Status</th>
                    <th className="py-3.5 px-4">Financials</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {bookingsToDisplay.map((row: any) => (
                    <tr key={row.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-black text-[#111111]">{row.id}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-800">
                        <div>{row.customer}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{row.customerPhone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-black">{row.service}</div>
                        <div className="text-[10px] text-gray-500 max-w-[180px] truncate">{row.address}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-amber-50 text-[#92400E] border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-black block w-fit">
                          {row.condition || 'Medium Dirt'}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold block mt-0.5">{row.bhkType || '3 BHK'}</span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 font-semibold">{row.datetime}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-700">{row.partner}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-black">₹{row.totalAmount?.toLocaleString()}</div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${row.paymentColor}`}>
                          Adv ₹{row.advanceAmount?.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedBookingModal(row);
                            setNewStatusSelection((row.bookingStatusRaw || 'CLEANING_IN_PROGRESS') as WorkflowStatus);
                          }}
                          className="px-4 py-2 bg-[#E8B619] hover:bg-[#D4A512] text-black font-black text-xs rounded-xl shadow-xs transition-all uppercase cursor-pointer"
                        >
                          Manage Job
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* REAL BOOKING MANAGEMENT MODAL WITH PROPERTY DETAILS & TIMELINE */}
      {selectedBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 space-y-5">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-150 pb-3">
              <div>
                <span className="text-[10px] font-black bg-[#FEF3C7] text-[#92400E] px-3 py-1 rounded-full uppercase border border-[#FDE68A]">
                  KLEANZO OPERATIONS CONTROL
                </span>
                <h3 className="font-black text-xl text-[#111111] mt-1.5">
                  Manage Booking #{selectedBookingModal.id}
                </h3>
              </div>
              <button onClick={() => setSelectedBookingModal(null)} className="font-bold text-gray-400 hover:text-black text-xl cursor-pointer">✕</button>
            </div>

            {/* Actual Property Condition Box */}
            <div className="bg-[#FAF7ED] p-5 rounded-2xl border border-[#E8B619]/40 space-y-3">
              <h4 className="font-black text-xs uppercase text-[#92400E] flex items-center gap-1.5 tracking-wider border-b border-amber-200 pb-2">
                <Home className="w-4 h-4" /> Actual Customer Property & Scope Details
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Customer:</span>
                  <span className="font-black text-black">{selectedBookingModal.customer} ({selectedBookingModal.customerPhone})</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Service Package:</span>
                  <span className="font-black text-black">{selectedBookingModal.service}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Property Address:</span>
                  <span className="font-bold text-gray-700">{selectedBookingModal.address || selectedBookingModal.property}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Actual Condition:</span>
                  <span className="font-black text-[#92400E] bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                    {selectedBookingModal.condition || 'Medium Dirt'} ({selectedBookingModal.bhkType || '3 BHK'})
                  </span>
                </div>
              </div>

              {selectedBookingModal.requirements && (
                <div className="pt-2 border-t border-amber-200/60 text-xs">
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Special Requirements / Notes:</span>
                  <span className="font-medium text-gray-800 italic">"{selectedBookingModal.requirements}"</span>
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex items-center justify-between text-xs font-bold">
              <div>
                <span className="text-gray-400 block text-[10px]">Total Price</span>
                <span className="font-black text-black text-base">₹{selectedBookingModal.totalAmount?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Advance Paid</span>
                <span className="font-black text-emerald-700">₹{selectedBookingModal.advanceAmount?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Balance Due After QC</span>
                <span className="font-black text-[#92400E]">₹{selectedBookingModal.balanceAmount?.toLocaleString()}</span>
              </div>
            </div>

            {/* Operational Stage Selector */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-black text-gray-800 mb-1.5">
                  Update Operational Stage & Sync to Customer Tracker:
                </label>
                <select
                  value={newStatusSelection}
                  onChange={(e) => setNewStatusSelection(e.target.value as WorkflowStatus)}
                  className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl font-extrabold text-xs focus:outline-none focus:border-[#E8B619]"
                >
                  <option value="TEAM_ALLOCATED">Step 4: Partner Team Allocated</option>
                  <option value="INSPECTION_PENDING">Step 5: Site Inspection Pending</option>
                  <option value="CLEANING_IN_PROGRESS">Step 6: Cleaning In Progress</option>
                  <option value="QC_PASSED">Step 7: Quality Check (QC) Passed</option>
                  <option value="CUSTOMER_APPROVED">Step 8: Customer Inspection Approved</option>
                  <option value="PAYMENT_COMPLETED">Step 9: Balance Payment Settled</option>
                  <option value="CLOSED">Step 10: Service Closed & Archived</option>
                </select>
              </div>

              <div>
                <label className="block font-black text-gray-800 mb-1.5">
                  Assign Partner Execution Agency:
                </label>
                <select
                  value={selectedPartnerSelection}
                  onChange={(e) => setSelectedPartnerSelection(e.target.value)}
                  className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs focus:outline-none focus:border-[#E8B619]"
                >
                  <option value="CleanPro Services">CleanPro Services (Pune Central)</option>
                  <option value="FreshHome Solutions">FreshHome Solutions (Wakad / Baner)</option>
                  <option value="Sparkle Clean Pro">Sparkle Clean Pro (Hinjewadi)</option>
                  <option value="GreenLine Cleaners">GreenLine Cleaners (Kharadi)</option>
                </select>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-3 flex flex-col sm:flex-row justify-between items-center border-t border-gray-150 gap-3">
              <Link
                href={`/admin/bookings/${selectedBookingModal.realDbId || selectedBookingModal.id}`}
                className="text-xs font-black text-amber-900 bg-amber-100 border border-amber-300 hover:bg-amber-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
              >
                Open Full Dispatch & Matching Center →
              </Link>
              <div className="flex gap-2">
                <button onClick={() => setSelectedBookingModal(null)} className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-black">
                  Cancel
                </button>
                <button
                  onClick={handleSaveBookingModalUpdate}
                  className="px-6 py-3 bg-[#E8B619] hover:bg-[#D4A512] text-black font-black text-xs rounded-xl shadow-md uppercase tracking-wide cursor-pointer"
                >
                  Save & Sync to User Module
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
