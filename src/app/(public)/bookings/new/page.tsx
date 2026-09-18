'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  FileText,
  Upload,
  Check,
  MessageSquare,
  Download,
  Home,
  Building2,
  Briefcase,
} from 'lucide-react';
import { createCustomerDirectBookingAction } from '@/actions/booking-actions';

export default function CustomerBookingWizard() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  // Category Toggle: RESIDENTIAL vs COMMERCIAL
  const [serviceCategory, setServiceCategory] = useState<'RESIDENTIAL' | 'COMMERCIAL'>('RESIDENTIAL');

  // Selected Service State
  const [selectedMainService, setSelectedMainService] = useState({
    slug: '3-bhk-deep-cleaning',
    name: '3 BHK Deep Cleaning',
    price: 4499,
  });

  const residentialServices = [
    { slug: '1-bhk-deep-cleaning', name: '1 BHK Deep Cleaning', price: 2499, category: 'RESIDENTIAL', desc: 'Complete deep cleaning for 1 BHK apartment' },
    { slug: '2-bhk-deep-cleaning', name: '2 BHK Deep Cleaning', price: 3499, category: 'RESIDENTIAL', desc: 'Thorough deep clean for 2 BHK home' },
    { slug: '3-bhk-deep-cleaning', name: '3 BHK Deep Cleaning', price: 4499, category: 'RESIDENTIAL', desc: 'Full home intense deep cleaning' },
    { slug: '4-bhk-deep-cleaning', name: '4 BHK Deep Cleaning', price: 5499, category: 'RESIDENTIAL', desc: 'Premium deep clean for large 4 BHK' },
    { slug: 'villa-duplex-cleaning', name: 'Villa / Duplex Deep Cleaning', price: 7999, category: 'RESIDENTIAL', desc: 'Heavy duty cleaning for multi-floor home' },
  ];

  const commercialServices = [
    { slug: 'office-studio-cleaning', name: 'Office & Studio Cleaning', price: 5999, category: 'COMMERCIAL', desc: 'Up to 1,000 sqft work area deep sanitization' },
    { slug: 'workspace-cleaning', name: 'Commercial Workspace Cleaning', price: 9999, category: 'COMMERCIAL', desc: '1,000 - 3,000 sqft corporate office deep clean' },
    { slug: 'showroom-handover', name: 'Showroom & Retail Handover', price: 7499, category: 'COMMERCIAL', desc: 'Store & retail space post-fitout deep clean' },
    { slug: 'post-construction-commercial', name: 'Post-Construction Commercial', price: 12499, category: 'COMMERCIAL', desc: 'Debris removal & deep clean for new builds' },
  ];

  const currentServicesList = serviceCategory === 'RESIDENTIAL' ? residentialServices : commercialServices;

  const handleCategoryChange = (cat: 'RESIDENTIAL' | 'COMMERCIAL') => {
    setServiceCategory(cat);
    if (cat === 'RESIDENTIAL') {
      setSelectedMainService(residentialServices[2]); // 3 BHK default
    } else {
      setSelectedMainService(commercialServices[0]); // Office default
    }
  };

  // Property Details State
  const [propertyDetails, setPropertyDetails] = useState({
    address: 'Flat 402, Rosewood Society, Wakad, Pune - 411057',
    bhk: '3 BHK',
    bathrooms: '3',
    balconies: '2',
    condition: 'Medium',
    requirements: 'Deep stain removal in kitchen tiles and balcony dust clean.',
    commercialSqft: '1200 sqft',
    commercialType: 'Office Workspace',
  });

  // Schedule State
  const [schedule, setSchedule] = useState({
    date: '2025-05-24',
    displayDate: '24 May 2025',
    time: '10:00 AM - 12:00 PM',
  });

  // Addons State
  const [selectedAddons, setSelectedAddons] = useState<Record<string, { name: string; price: number; checked: boolean }>>({
    balcony: { name: 'Balcony Deep Clean', price: 499, checked: true },
    fridge: { name: 'Refrigerator Interior Cleaning', price: 399, checked: true },
    sofa: { name: '5-Seater Sofa Shampooing', price: 1199, checked: false },
    mattress: { name: 'King Mattress Sanitization', price: 899, checked: false },
    chimney: { name: 'Kitchen Chimney Degreasing', price: 699, checked: false },
  });

  const [agreeTerms, setAgreeTerms] = useState(true);

  const activeAddonsList = Object.values(selectedAddons).filter((a) => a.checked);
  const addonsTotal = activeAddonsList.reduce((acc, curr) => acc + curr.price, 0);
  const subtotal = selectedMainService.price + addonsTotal;
  const gstAmount = Math.round(subtotal * 0.18);
  const totalCustomerPrice = subtotal + gstAmount;
  const advanceRequired = Math.round(totalCustomerPrice * 0.2); // 20% advance
  const balancePayable = totalCustomerPrice - advanceRequired;

  const handleToggleAddon = (key: string) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [key]: { ...prev[key], checked: !prev[key].checked },
    }));
  };

  const handleConfirmAdvancePayment = async () => {
    setSubmitting(true);
    const code = `KZ-PNE${Math.floor(100 + Math.random() * 899)}`;

    const payload = {
      customerName: 'Rahul Jaykar',
      customerPhone: '9876543210',
      customerEmail: 'rahul.j@example.com',
      propertyType: serviceCategory === 'RESIDENTIAL' ? 'Residential Apartment' : 'Commercial Workspace',
      bhkType: serviceCategory === 'RESIDENTIAL' ? propertyDetails.bhk : propertyDetails.commercialType,
      city: 'Pune',
      area: 'Wakad',
      address: propertyDetails.address,
      propertyCondition: propertyDetails.condition,
      serviceName: selectedMainService.name,
      packagePrice: selectedMainService.price,
      addedAddons: activeAddonsList.map((a) => ({
        slug: a.name.toLowerCase().replace(/ /g, '-'),
        name: a.name,
        price: a.price,
        quantity: 1,
      })),
      subtotal: subtotal,
      gstAmount: gstAmount,
      totalAmount: totalCustomerPrice,
      advanceAmount: advanceRequired,
      balanceAmount: balancePayable,
      scheduledDate: schedule.displayDate,
      scheduledTime: schedule.time,
      notes: propertyDetails.requirements,
    };

    try {
      const res = await createCustomerDirectBookingAction(payload);
      const finalCode = res.success && res.bookingCode ? res.bookingCode : code;

      const newBookingObject = {
        id: finalCode,
        realDbId: res.bookingId || finalCode,
        bookingCode: finalCode,
        customerName: 'Rahul Jaykar',
        customerPhone: '9876543210',
        customerEmail: 'rahul.j@example.com',
        serviceName: selectedMainService.name,
        propertyAddress: propertyDetails.address,
        scheduledDate: schedule.displayDate,
        scheduledTime: schedule.time,
        bookingStatus: 'CLEANING_IN_PROGRESS',
        paymentStatus: 'ADVANCE_PAID',
        subtotal: subtotal,
        gstAmount: gstAmount,
        totalAmount: totalCustomerPrice,
        advanceAmount: advanceRequired,
        balanceAmount: balancePayable,
        hasScope: true,
        inspectionCompleted: true,
        qcPassed: false,
        customerApproved: false,
        scopeDetails: `${selectedMainService.name} (${serviceCategory}) including ${
          activeAddonsList.length > 0 ? activeAddonsList.map((a) => a.name).join(', ') : 'standard checklist'
        }`,
        items: [
          { serviceName: selectedMainService.name, quantity: 1, unitPrice: selectedMainService.price, totalSnapshot: selectedMainService.price },
          ...activeAddonsList.map((a) => ({ serviceName: a.name, quantity: 1, unitPrice: a.price, totalSnapshot: a.price })),
        ],
        createdAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        const existingStr = localStorage.getItem('kleanzo_real_bookings');
        const existing = existingStr ? JSON.parse(existingStr) : [];
        localStorage.setItem('kleanzo_real_bookings', JSON.stringify([newBookingObject, ...existing]));
      }

      setBookingCode(finalCode);
      setBookingConfirmed(true);
    } catch (err) {
      console.error('Error submitting booking:', err);
      setBookingCode(code);
      setBookingConfirmed(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {!bookingConfirmed ? (
          <div className="space-y-6">
            
            {/* STEPPER HEADER */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex items-center justify-between overflow-x-auto">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E8B619] text-black font-black flex items-center justify-center text-sm shadow-xs">
                  K
                </div>
                <span className="font-extrabold text-base text-[#111111]">KLEANZO</span>
              </div>

              {/* 5-Step Stepper */}
              <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                {[
                  { num: 1, label: 'Service' },
                  { num: 2, label: 'Property' },
                  { num: 3, label: 'Date & Time' },
                  { num: 4, label: 'Add-ons' },
                  { num: 5, label: 'Review & Pay' },
                ].map((s) => (
                  <div
                    key={s.num}
                    onClick={() => step >= s.num && setStep(s.num)}
                    className={`flex items-center gap-1.5 cursor-pointer ${
                      step === s.num
                        ? 'text-[#111111] font-black'
                        : step > s.num
                        ? 'text-[#E8B619] font-extrabold'
                        : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center ${
                        step === s.num
                          ? 'bg-[#E8B619] text-black ring-2 ring-[#E8B619]/40'
                          : step > s.num
                          ? 'bg-amber-100 text-[#92400E]'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {s.num}
                    </div>
                    <span className="hidden sm:inline">{s.label}</span>
                    {s.num < 5 && <span className="text-gray-300">›</span>}
                  </div>
                ))}
              </div>

              <span className="text-xs font-extrabold text-[#E8B619] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Step {step} of 5
              </span>
            </div>

            {/* WIZARD CONTAINER */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6">
              
              {/* STEP 01: SELECT SERVICE */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-[#111111]">01 Select Service</h2>
                      <p className="text-xs text-gray-500 font-medium mt-1">Choose between Home/Residential or Commercial/Office cleaning</p>
                    </div>

                    {/* CATEGORY TOGGLE: Home / Residential vs Commercial */}
                    <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1 border border-gray-200 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleCategoryChange('RESIDENTIAL')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                          serviceCategory === 'RESIDENTIAL'
                            ? 'bg-[#E8B619] text-black shadow-md'
                            : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        <Home className="w-4 h-4" />
                        <span>Home / Residential</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCategoryChange('COMMERCIAL')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                          serviceCategory === 'COMMERCIAL'
                            ? 'bg-[#E8B619] text-black shadow-md'
                            : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>Commercial / Office</span>
                      </button>
                    </div>
                  </div>

                  {/* Category Banner Info */}
                  <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-center justify-between text-xs font-bold text-[#92400E]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#E8B619]" />
                      <span>
                        {serviceCategory === 'RESIDENTIAL'
                          ? 'Showing Residential Deep Cleaning Packages (Apartments, Villas & Flats)'
                          : 'Showing Commercial & Office Deep Cleaning Packages (Offices, Workspaces & Showrooms)'}
                      </span>
                    </div>
                    <span className="text-[10px] bg-white px-2.5 py-1 rounded-full border border-amber-300 font-black text-black">
                      {serviceCategory}
                    </span>
                  </div>

                  {/* Service Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {currentServicesList.map((pkg) => (
                      <button
                        key={pkg.slug}
                        onClick={() => setSelectedMainService(pkg)}
                        className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                          selectedMainService.slug === pkg.slug
                            ? 'border-[#E8B619] bg-amber-50/50 ring-2 ring-[#E8B619] shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        {selectedMainService.slug === pkg.slug && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#E8B619] text-black flex items-center justify-center text-[10px] font-black">
                            ✓
                          </div>
                        )}
                        <div>
                          <span className="font-extrabold text-black block text-sm">{pkg.name}</span>
                          <p className="text-[11px] text-gray-500 font-medium mt-1 leading-snug">{pkg.desc}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100/80">
                          <span className="text-[10px] text-gray-400 font-bold block">Starting From</span>
                          <span className="text-lg font-black text-black">₹{pkg.price.toLocaleString()}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Quick Addons Grid */}
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-black text-gray-600 uppercase tracking-wider mb-3">Popular Service Add-ons</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
                        <span className="font-bold text-black block">Kitchen Degreasing</span>
                        <span className="text-[11px] text-[#92400E] font-extrabold">From ₹999</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
                        <span className="font-bold text-black block">Bathroom Sanitization</span>
                        <span className="text-[11px] text-[#92400E] font-extrabold">From ₹799</span>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
                        <span className="font-bold text-black block">Window Glass Clean</span>
                        <span className="text-[11px] text-[#92400E] font-extrabold">From ₹699</span>
                      </div>
                      <div
                        onClick={() => setStep(4)}
                        className="p-3 bg-amber-50 hover:bg-amber-100 rounded-2xl border border-amber-200 text-xs font-bold text-[#92400E] cursor-pointer flex items-center justify-between transition-all"
                      >
                        <span>View All Add-ons</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      className="bg-[#E8B619] hover:bg-[#D4A512] text-black font-extrabold text-xs px-8 py-3.5 rounded-xl flex items-center gap-2 shadow-md uppercase tracking-wider"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 02: PROPERTY DETAILS */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-[#111111]">02 Property Details</h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      {serviceCategory === 'RESIDENTIAL'
                        ? 'Tell Us About Your Home — helps us assign the right crew & equipment'
                        : 'Tell Us About Your Commercial Space — office, showroom or store details'}
                    </p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-extrabold text-gray-700 mb-1">
                        Full {serviceCategory === 'RESIDENTIAL' ? 'Home' : 'Commercial Space'} Address:
                      </label>
                      <input
                        type="text"
                        value={propertyDetails.address}
                        onChange={(e) => setPropertyDetails({ ...propertyDetails, address: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:outline-none focus:border-[#E8B619]"
                      />
                    </div>

                    {serviceCategory === 'RESIDENTIAL' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-extrabold text-gray-700 mb-1">BHK Type:</label>
                          <select
                            value={propertyDetails.bhk}
                            onChange={(e) => setPropertyDetails({ ...propertyDetails, bhk: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:outline-none focus:border-[#E8B619]"
                          >
                            <option value="1 BHK">1 BHK</option>
                            <option value="2 BHK">2 BHK</option>
                            <option value="3 BHK">3 BHK</option>
                            <option value="4 BHK">4 BHK</option>
                            <option value="Villa / Duplex">Villa / Duplex</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-extrabold text-gray-700 mb-1">Bathrooms:</label>
                          <select
                            value={propertyDetails.bathrooms}
                            onChange={(e) => setPropertyDetails({ ...propertyDetails, bathrooms: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:outline-none focus:border-[#E8B619]"
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4+</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-extrabold text-gray-700 mb-1">Balconies:</label>
                          <select
                            value={propertyDetails.balconies}
                            onChange={(e) => setPropertyDetails({ ...propertyDetails, balconies: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:outline-none focus:border-[#E8B619]"
                          >
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3+</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-extrabold text-gray-700 mb-1">Commercial Property Type:</label>
                          <select
                            value={propertyDetails.commercialType}
                            onChange={(e) => setPropertyDetails({ ...propertyDetails, commercialType: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:outline-none focus:border-[#E8B619]"
                          >
                            <option value="Office Workspace">Office Workspace</option>
                            <option value="Retail Showroom">Retail Showroom</option>
                            <option value="Studio / IT Hub">Studio / IT Hub</option>
                            <option value="Post-Construction Site">Post-Construction Site</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-extrabold text-gray-700 mb-1">Approx Carpet Area (Sqft):</label>
                          <input
                            type="text"
                            value={propertyDetails.commercialSqft}
                            onChange={(e) => setPropertyDetails({ ...propertyDetails, commercialSqft: e.target.value })}
                            placeholder="e.g. 1500 sqft"
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:outline-none focus:border-[#E8B619]"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block font-extrabold text-gray-700 mb-1.5">Property Condition:</label>
                      <div className="flex gap-3">
                        {['Light', 'Medium', 'Heavy'].map((cond) => (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => setPropertyDetails({ ...propertyDetails, condition: cond })}
                            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all ${
                              propertyDetails.condition === cond
                                ? 'bg-[#E8B619] text-black shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {cond}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-extrabold text-gray-700 mb-1">Upload Site Photos (Optional):</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        <div className="h-20 bg-gray-100 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-[10px] font-bold text-gray-500">
                          <span>Photo #1</span>
                          <span className="text-[#92400E]">Main Area</span>
                        </div>
                        <div className="h-20 bg-gray-100 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-[10px] font-bold text-gray-500">
                          <span>Photo #2</span>
                          <span className="text-[#92400E]">Washroom</span>
                        </div>
                        <div className="h-20 bg-amber-50 rounded-2xl border border-dashed border-[#E8B619] flex flex-col items-center justify-center text-[10px] font-black text-black cursor-pointer">
                          <Plus className="w-4 h-4 text-[#E8B619]" />
                          <span>Add More</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-extrabold text-gray-700 mb-1">Any Special Instructions (Optional):</label>
                      <textarea
                        rows={2}
                        value={propertyDetails.requirements}
                        onChange={(e) => setPropertyDetails({ ...propertyDetails, requirements: e.target.value })}
                        placeholder="e.g. Tough stains, deep carpet dust, post-renovation debris etc."
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-medium focus:outline-none focus:border-[#E8B619]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button onClick={() => setStep(1)} className="text-xs font-extrabold text-gray-500 hover:text-black">
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="bg-[#E8B619] hover:bg-[#D4A512] text-black font-extrabold text-xs px-8 py-3.5 rounded-xl flex items-center gap-2 shadow-md uppercase tracking-wider"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 03: CHOOSE DATE & TIME */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-[#111111]">03 Choose Date & Time</h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">Select your preferred date and arrival time slot</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    
                    {/* Calendar Widget */}
                    <div className="bg-gray-50 p-5 rounded-3xl border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-black text-sm text-[#111111]">May 2025</span>
                        <span className="text-[10px] font-bold text-gray-400">📅 Calendar Picker</span>
                      </div>
                      <div className="grid grid-cols-7 gap-2 text-center font-bold text-gray-500 text-[11px] mb-2">
                        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                      </div>
                      <div className="grid grid-cols-7 gap-2 text-center font-extrabold text-xs">
                        {[...Array(31)].map((_, i) => {
                          const dayNum = i + 1;
                          const isSelected = dayNum === 24;
                          return (
                            <button
                              key={dayNum}
                              type="button"
                              onClick={() => setSchedule({ ...schedule, date: `2025-05-${dayNum}`, displayDate: `${dayNum} May 2025` })}
                              className={`py-2 rounded-xl transition-all ${
                                isSelected
                                  ? 'bg-[#E8B619] text-black font-black shadow-sm ring-2 ring-[#E8B619]'
                                  : 'hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              {dayNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Slot Selector */}
                    <div className="space-y-3">
                      <label className="block font-black text-sm text-[#111111]">Select Time Slot:</label>
                      {[
                        '08:00 AM - 10:00 AM',
                        '10:00 AM - 12:00 PM',
                        '12:00 PM - 02:00 PM',
                        '02:00 PM - 04:00 PM',
                        '04:00 PM - 06:00 PM',
                      ].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSchedule({ ...schedule, time: slot })}
                          className={`w-full p-3 rounded-2xl border text-left flex justify-between items-center transition-all ${
                            schedule.time === slot
                              ? 'border-[#E8B619] bg-amber-50 font-black text-black ring-2 ring-[#E8B619]'
                              : 'border-gray-200 hover:border-gray-300 font-bold text-gray-600'
                          }`}
                        >
                          <span>{slot}</span>
                          {schedule.time === slot && <span className="text-[#E8B619] font-black text-sm">✓</span>}
                        </button>
                      ))}
                    </div>

                  </div>

                  <div className="pt-4 flex justify-between">
                    <button onClick={() => setStep(2)} className="text-xs font-extrabold text-gray-500 hover:text-black">
                      Back
                    </button>
                    <button
                      onClick={() => setStep(4)}
                      className="bg-[#E8B619] hover:bg-[#D4A512] text-black font-extrabold text-xs px-8 py-3.5 rounded-xl flex items-center gap-2 shadow-md uppercase tracking-wider"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 04: ADD-ONS */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-[#111111]">04 Add-ons</h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">Enhance Your Cleaning — Add extra services if you need</p>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(selectedAddons).map(([key, item]) => (
                      <label
                        key={key}
                        onClick={() => handleToggleAddon(key)}
                        className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          item.checked
                            ? 'border-[#E8B619] bg-amber-50/60 ring-2 ring-[#E8B619]'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => {}}
                            className="w-4 h-4 text-[#E8B619] focus:ring-[#E8B619] rounded"
                          />
                          <span className="font-extrabold text-xs text-black">{item.name}</span>
                        </div>
                        <span className="font-black text-xs text-[#111111]">₹{item.price.toLocaleString()}</span>
                      </label>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button onClick={() => setStep(3)} className="text-xs font-extrabold text-gray-500 hover:text-black">
                      Back
                    </button>
                    <button
                      onClick={() => setStep(5)}
                      className="bg-[#E8B619] hover:bg-[#D4A512] text-black font-extrabold text-xs px-8 py-3.5 rounded-xl flex items-center gap-2 shadow-md uppercase tracking-wider"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 05: REVIEW & PAY */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-[#111111]">05 Review & Pay</h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">Review your booking scope and complete advance payment</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    
                    {/* Booking Summary Box */}
                    <div className="bg-gray-50 p-5 rounded-3xl border border-gray-200 space-y-3">
                      <h3 className="font-black text-sm text-[#111111] border-b border-gray-200 pb-2 flex items-center justify-between">
                        <span>Booking Summary</span>
                        <span className="text-[10px] bg-amber-100 text-[#92400E] px-2 py-0.5 rounded font-black">{serviceCategory}</span>
                      </h3>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Service</span>
                        <span className="font-black text-[#111111]">{selectedMainService.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Property</span>
                        <span className="font-bold text-gray-700">{propertyDetails.address}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Date & Time</span>
                        <span className="font-bold text-gray-700">{schedule.displayDate}, {schedule.time}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Add-ons</span>
                        <span className="font-bold text-gray-700">
                          {activeAddonsList.length > 0 ? activeAddonsList.map((a) => a.name).join(', ') : 'None'}
                        </span>
                      </div>
                    </div>

                    {/* Price Details Box */}
                    <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2.5">
                      <h3 className="font-black text-sm text-[#111111] border-b border-gray-200 pb-2">Price Details</h3>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Service ({selectedMainService.name})</span>
                        <span className="font-bold">₹{selectedMainService.price.toLocaleString()}</span>
                      </div>
                      {activeAddonsList.map((addon) => (
                        <div key={addon.name} className="flex justify-between text-gray-600">
                          <span>{addon.name}</span>
                          <span className="font-bold">₹{addon.price.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-gray-700">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>GST (18%)</span>
                        <span>₹{gstAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2 font-black text-sm text-black">
                        <span>Total</span>
                        <span>₹{totalCustomerPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 font-extrabold pt-1">
                        <span>Advance (20%)</span>
                        <span>₹{advanceRequired.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[#92400E] font-extrabold border-t border-gray-200 pt-2">
                        <span>Balance After Service</span>
                        <span>₹{balancePayable.toLocaleString()}</span>
                      </div>
                    </div>

                  </div>

                  <div className="flex items-center gap-2 pt-2 text-xs text-gray-600 font-bold">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 text-[#E8B619] rounded"
                    />
                    <span>I agree to the <Link href="/terms" className="text-[#92400E] underline">Terms & Conditions</Link></span>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button onClick={() => setStep(4)} className="text-xs font-extrabold text-gray-500 hover:text-black">
                      Back
                    </button>
                    <button
                      onClick={handleConfirmAdvancePayment}
                      disabled={submitting || !agreeTerms}
                      className="bg-[#E8B619] hover:bg-[#D4A512] disabled:opacity-50 text-black font-black text-xs px-8 py-3.5 rounded-xl shadow-lg uppercase tracking-wider cursor-pointer"
                    >
                      {submitting ? 'PROCESSING...' : `Pay Advance ₹${advanceRequired.toLocaleString()}`}
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        ) : (
          
          /* BOOKING CONFIRMED SCREEN */
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-[#FEF3C7] text-[#92400E] rounded-full flex items-center justify-center mx-auto border-2 border-[#E8B619]">
              <CheckCircle2 className="w-10 h-10 text-[#E8B619]" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#111111]">Your Booking is Confirmed!</h2>
              <p className="text-xs text-gray-500 mt-1">We have received your booking and will take care of the rest.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-xs text-left space-y-3 max-w-md mx-auto">
              <div className="flex justify-between border-b border-gray-200 pb-2 font-bold">
                <span className="text-gray-500">Booking ID:</span>
                <span className="font-black text-black">{bookingCode}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2 font-bold">
                <span className="text-gray-500">Category & Service:</span>
                <span className="text-black font-extrabold">{serviceCategory} — {selectedMainService.name}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-gray-500">Date & Time:</span>
                <span className="text-black">{schedule.displayDate}, {schedule.time}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/bookings"
                className="bg-[#E8B619] hover:bg-[#D4A512] text-black font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all uppercase"
              >
                Track Booking
              </Link>
              <button
                onClick={() => alert(`Downloading Invoice for ${bookingCode}...`)}
                className="bg-white border border-gray-300 hover:border-black text-black font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Invoice
              </button>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp Us
              </a>
            </div>

            <p className="text-[11px] text-gray-400 font-medium">We will send all updates on your WhatsApp and Email.</p>
          </div>

        )}

      </div>
    </div>
  );
}
