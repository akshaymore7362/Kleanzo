# Kleanzo Platform — Comprehensive Project Functionality & Working Report

> **Tagline:** Dirt Gone. Shine On.  
> **Platform Overview:** Kleanzo is a post-construction deep cleaning, stain remediation, and handover management platform connecting residential & commercial customers with verified local fulfillment agency partners.

---

## 📋 Executive Summary

The Kleanzo platform provides an end-to-end digital ecosystem for scheduling, fulfilling, and managing specialized deep cleaning services. The system features three distinct user workflows:

1. **Customer Direct Booking & Diagnosis Portal**
2. **Fulfillment Partner Agency Portal & 8-Step Onboarding Wizard**
3. **Admin Operations Management Center & Audit Console**

---

## 🛠️ Technology Stack & Architecture

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Vanilla CSS & Tailwind CSS with dynamic design tokens
- **Icons:** Lucide React
- **Payments:** Razorpay Online Gateway Integration
- **Server Logic:** Next.js Server Actions (`/src/actions/*`)
- **State & Storage:** React Local State, Client-side Draft Persistence (`localStorage`), Cookie Sessions (`kleanzo_session`)

---

## 🚀 Key Modules & Functionalities

### 1. Customer Booking Workflow (9-Step Wizard)
Located at `/bookings/new`:

| Step | Module | Functionality & Features |
| :--- | :--- | :--- |
| **1** | **Service Category & Selection** | Choose from Residential Deep Cleaning (1BHK–4BHK/Villa), Specialized Remediation (Kitchen, Bathroom, Sofa, Carpet), or Post-Construction Handover. |
| **2** | **Property Specifications** | Select Property Type (Apartment, Villa, Office), BHK specs, Sq.Ft area, Floor number, Lift availability, and Occupancy status. |
| **3** | **Stain Remediation & Photos** | Interactive diagnostic selector for specific stains (Glue/Fevicol, Paint/Colour, Acid marks, Limescale, Construction dust) with optional photo uploads. |
| **4** | **Customer Details & Mobile OTP** | Contact information entry with 6-digit SMS OTP verification workflow. |
| **5** | **GPS Location & Map Preview** | One-click GPS geolocation ("Detect My Location") with interactive map marker preview and area landmark detection. |
| **6** | **Partner Matching Engine** | Real-time query matching nearby verified cleaning agencies based on service area, rating, crew availability, and distance in Pune. |
| **7** | **Date & Slot Scheduling** | Select preferred service date and time slot (e.g., 08:00 AM – 10:00 AM, 10:00 AM – 12:00 PM). |
| **8** | **Transparent Review & Pricing** | Detailed cost breakdown showing Base Price + Stain Add-ons - Discounts with full service guarantees. |
| **9** | **Advance Payment Gateway** | Razorpay online payment integration for advance deposit to confirm job dispatch. |

#### **UX & Layout Enhancements in Booking Wizard:**
- **2-Column Responsive Layout:** Main Step Form (8 cols) + Sticky Live Booking Summary Sidebar (4 cols).
- **Sticky Summary Sidebar:** Live updating box showing selected service, property specs, partner agency, scheduled slot, and price breakdown.
- **Mobile Floating Action Bar:** Sticky bottom drawer on smaller screens allowing single-tap step advancement without scrolling.
- **Auto Scroll-to-Top:** Smooth viewport reset to top on every step change.

---

### 2. Partner Agency Portal & Onboarding Wizard
Located at `/partner/register` and `/partner/onboarding`:

- **Step 1: Agency & Owner Profile:** Basic company name, GST registration, owner contact, and city selection.
- **Step 2: Mobile OTP Verification:** Secure phone verification for agency owner.
- **Step 3: KYC & Business Verification:** Upload Aadhaar, PAN, GST certificate, and business proof documents.
- **Step 4: Services & Coverage Areas:** Select supported cleaning categories and operating Pincodes in Pune.
- **Step 5: Team & Equipment Checklist:** Declare crew headcount and equipment inventory (Single-disc scrubber, wet/dry vacuum, pressure washers).
- **Step 6: Bank & Payout Details:** IFSC, Account Number, and UPI ID for automated post-job payouts.
- **Step 7: Partner Agreement:** Legal terms signature for fixed payout guarantees and quality standards.
- **Step 8: Final Review & Submission:** Instant status tracking (`PENDING_VERIFICATION` → `ACTIVE`).

#### **Agency Operations Dashboard (`/agency/dashboard`):**
- **Job Management:** Accept/Decline incoming pre-paid leads, assign crew members, view customer location on map.
- **Live QC Checklist & Photos:** Upload before/after job completion photos for admin verification.
- **Financial Payout Tracker:** Track completed job payouts, settlement history, and platform commission deductions.

---

### 3. Admin Operations Control Center
Located at `/admin/dashboard` & `/admin/partners/[id]`:

- **Partner Application Management:** Inspect KYC documents, approve active agencies, or request correction updates with notes.
- **Job Dispatch Console:** Monitor live customer bookings across Pune, manually re-assign partner agencies, and update job status (`UNASSIGNED` → `MATCHED` → `IN_PROGRESS` → `COMPLETED`).
- **Audit Logging System:** Complete chronological audit trail tracking all partner status updates, approvals, and payout releases.

---

### 4. Public Website & Discovery System

- **Hero Slider & Brand Banner (`/`):** Dynamic hero section highlighting Kleanzo handover guarantees and instant lead time.
- **Stain Remediation Tool:** Interactive diagnostic section allowing users to pick stain types and directly launch the pre-filled 9-step booking flow.
- **Instant Role Switcher Dropdown (`Navbar`):** Client-side session selector allowing instant switching between Admin, Agency, and Customer demo portals.
- **Global `ScrollToTop` Component:** Automatic scroll restoration to `(0, 0)` on all route transitions across public and portal routes.

---

## 🔒 Security & Data Integrity

1. **Authentication & Authorization:** Role-Based Access Control (`ADMIN`, `AGENCY_ADMIN`, `CUSTOMER`) managed via encrypted session cookies (`kleanzo_session`).
2. **Draft Preservation:** Local storage auto-save (`kleanzo_booking_wizard_draft`) prevents user data loss during booking wizard navigation.
3. **Payment Security:** Razorpay signature verification for advance payment processing.

---

## 📈 System Summary Metrics

| Component | Status | Coverage |
| :--- | :---: | :--- |
| **Booking Flow** | ✅ Complete | 9 Steps with Live Summary & Mobile Sticky Bar |
| **Partner Onboarding** | ✅ Complete | 8 Steps with KYC Uploads & QC Checklists |
| **Admin Panel** | ✅ Complete | Audit Logging & Partner Approval System |
| **UX & Navigation** | ✅ Complete | Auto Scroll-to-Top & Glassmorphism Theme |
| **Build Status** | ✅ Verified | 100% Turbopack Build Success |

---
*Report Generated: 2026-09-30*  
*Kleanzo Fulfillment Platform v1.0*
