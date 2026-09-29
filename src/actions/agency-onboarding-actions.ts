'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser, hashPassword, createSessionToken, setSessionCookie } from '@/lib/auth/session';
import { Role } from '@/lib/auth/rbac';
import { logAudit } from '@/lib/audit/audit-logger';

/**
 * Partner Onboarding Wizard server actions.
 * Each step persists partial data onto the Agency (and related) records
 * so an applicant can resume the wizard at any time via onboardingStep.
 */

export interface RegisterPartnerInput {
  agencyName: string;
  ownerName: string;
  phone: string;
  email: string;
  password?: string;
  city?: string;
}

export async function registerPartnerAgencyAction(input: RegisterPartnerInput) {
  try {
    const agencyName = (input.agencyName || '').trim();
    const ownerName = (input.ownerName || '').trim();
    const phone = (input.phone || '').trim();
    const email = (input.email || '').trim().toLowerCase();
    const city = input.city || 'Pune';
    const password = input.password || 'KleanzoPartner@123';

    if (!agencyName) throw new Error('Agency/Business name is required');
    if (!ownerName) throw new Error('Owner contact name is required');
    if (!/^[6-9]\d{9}$/.test(phone)) throw new Error('Enter a valid 10-digit mobile number');
    if (!email.includes('@')) throw new Error('Enter a valid email address');

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existingUser) {
      throw new Error('An account with this email or mobile number already exists. Please login to continue.');
    }

    const applicationCode = `KZ-PARTNER-${Math.floor(100000 + Math.random() * 900000)}`;

    const { user, agency } = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: ownerName,
          email,
          phone,
          password: hashPassword(password),
          role: 'AGENCY_ADMIN',
          active: true,
        },
      });

      const newAgency = await tx.agency.create({
        data: {
          userId: newUser.id,
          name: agencyName,
          ownerName,
          email,
          phone,
          city,
          address: `${city}, Maharashtra`,
          state: 'Maharashtra',
          pinCode: '411057',
          applicationCode,
          partnerStatus: 'DRAFT',
          onboardingStep: 1,
          verified: false,
          active: false,
        },
      });

      await tx.agencyUser.create({
        data: {
          agencyId: newAgency.id,
          userId: newUser.id,
          role: 'AGENCY_ADMIN',
        },
      });

      return { user: newUser, agency: newAgency };
    });

    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: 'AGENCY_ADMIN',
      agencyId: agency.id,
    });
    await setSessionCookie(token);

    await logAudit({
      userId: user.id,
      role: 'AGENCY_ADMIN',
      action: 'ADMIN_CONFIG_CHANGED',
      entity: 'Agency',
      entityId: agency.id,
      notes: `Partner registration created with Application Code ${applicationCode}`,
    });

    return { success: true, redirectUrl: '/partner/onboarding', applicationCode, agency };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function requireAgencyOwner() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  if (!user.agencyId) throw new Error('No agency profile linked to this account');
  return user;
}

// ---------- STEP 1: Basic Details ----------
export interface BasicDetailsInput {
  agencyName: string;
  ownerName: string;
  mobile: string;
  whatsappNumber?: string;
  ownerPhotoUrl?: string;
  serviceAreas: { city: string; areaName: string; pinCode: string }[];
}

export async function saveBasicDetailsAction(input: BasicDetailsInput) {
  try {
    const user = await requireAgencyOwner();
    if (!input.agencyName?.trim()) throw new Error('Agency name is required');
    if (!input.ownerName?.trim()) throw new Error('Owner name is required');
    if (!/^[6-9]\d{9}$/.test(input.mobile || '')) throw new Error('Enter a valid 10-digit mobile number');
    if (!input.serviceAreas || input.serviceAreas.length === 0) throw new Error('At least one service area is required');

    const agency = await prisma.$transaction(async (tx) => {
      const updated = await tx.agency.update({
        where: { id: user.agencyId! },
        data: {
          name: input.agencyName,
          ownerName: input.ownerName,
          phone: input.mobile,
          whatsappNumber: input.whatsappNumber || input.mobile,
          ownerPhotoUrl: input.ownerPhotoUrl,
          onboardingStep: Math.max(2, 1),
        },
      });

      await tx.agencyServiceArea.deleteMany({ where: { agencyId: user.agencyId! } });
      await tx.agencyServiceArea.createMany({
        data: input.serviceAreas.map((a) => ({
          agencyId: user.agencyId!,
          city: a.city,
          areaName: a.areaName,
          pinCode: a.pinCode,
        })),
      });

      return updated;
    });

    await logAudit({
      action: 'ADMIN_CONFIG_CHANGED',
      entityType: 'Agency',
      entityId: agency.id,
      performedBy: user.id,
      actorType: 'AGENCY',
      metadata: { step: 'BASIC_DETAILS' },
    });

    return { success: true, agency };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---------- STEP 2: Mobile OTP Verification ----------
// Stubbed SMS dispatch — in production wire to an SMS gateway.
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function sendMobileOtpAction(mobile: string) {
  try {
    if (!/^[6-9]\d{9}$/.test(mobile || '')) throw new Error('Enter a valid 10-digit mobile number');
    const code = String(Math.floor(100000 + Math.random() * 900000));
    otpStore.set(mobile, { code, expiresAt: Date.now() + 5 * 60 * 1000 });
    // STUB: integrate real SMS provider here.
    console.log(`[OTP STUB] OTP for ${mobile}: ${code}`);
    return { success: true, message: 'OTP sent successfully', devOtp: process.env.NODE_ENV !== 'production' ? code : undefined };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function verifyMobileOtpAction(mobile: string, code: string) {
  try {
    const user = await requireAgencyOwner();
    const entry = otpStore.get(mobile);
    if (!entry) throw new Error('No OTP was sent to this number. Please resend.');
    if (Date.now() > entry.expiresAt) throw new Error('OTP has expired. Please resend.');
    if (entry.code !== code) throw new Error('Incorrect OTP. Please try again.');

    otpStore.delete(mobile);
    const agency = await prisma.agency.update({
      where: { id: user.agencyId! },
      data: { mobileVerified: true, onboardingStep: 3 },
    });

    await logAudit({
      action: 'ADMIN_CONFIG_CHANGED',
      entityType: 'Agency',
      entityId: agency.id,
      performedBy: user.id,
      actorType: 'AGENCY',
      metadata: { step: 'MOBILE_VERIFIED' },
    });

    return { success: true, agency };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---------- STEP 3: KYC (Aadhaar + PAN + Owner Photo) ----------
export interface KycInput {
  aadhaarNumber: string;
  aadhaarDocUrl: string;
  panNumber: string;
  panDocUrl: string;
  ownerPhotoUrl?: string;
}

export async function saveKycAction(input: KycInput) {
  try {
    const user = await requireAgencyOwner();
    if (!/^\d{12}$/.test(input.aadhaarNumber || '')) throw new Error('Enter a valid 12-digit Aadhaar number');
    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test((input.panNumber || '').toUpperCase())) throw new Error('Enter a valid PAN number (e.g. ABCDE1234F)');
    if (!input.aadhaarDocUrl) throw new Error('Aadhaar document upload is required');
    if (!input.panDocUrl) throw new Error('PAN document upload is required');

    const maskedAadhaar = `XXXX-XXXX-${input.aadhaarNumber.slice(-4)}`;

    const agency = await prisma.$transaction(async (tx) => {
      const updated = await tx.agency.update({
        where: { id: user.agencyId! },
        data: {
          aadhaarNumber: maskedAadhaar,
          panNumber: input.panNumber.toUpperCase(),
          ownerPhotoUrl: input.ownerPhotoUrl,
          onboardingStep: 4,
          partnerStatus: 'DOCUMENTS_PENDING',
        },
      });

      // AADHAAR_CARD is not in the original enum comment (GST/PAN/BANK_PASSBOOK/BUSINESS_AGREEMENT)
      // but PartnerDocument.documentType is a free-text String column, so we extend it here
      // rather than faking data — it's stored/queried the same way as the other types.
      await tx.partnerDocument.upsert({
        where: { id: `${user.agencyId}-AADHAAR_CARD` },
        create: { id: `${user.agencyId}-AADHAAR_CARD`, agencyId: user.agencyId!, documentType: 'AADHAAR_CARD', documentUrl: input.aadhaarDocUrl, status: 'PENDING' },
        update: { documentUrl: input.aadhaarDocUrl, status: 'PENDING' },
      });
      await tx.partnerDocument.upsert({
        where: { id: `${user.agencyId}-PAN_CARD` },
        create: { id: `${user.agencyId}-PAN_CARD`, agencyId: user.agencyId!, documentType: 'PAN_CARD', documentUrl: input.panDocUrl, status: 'PENDING' },
        update: { documentUrl: input.panDocUrl, status: 'PENDING' },
      });

      return updated;
    });

    return { success: true, agency };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---------- STEP 4: Business & Operations ----------
export interface BusinessOperationsInput {
  teamsCount: number;
  cleanerCount: number;
  equipmentList: string[];
  serviceSlugs: string[];
  serviceAreas: { city: string; areaName: string; pinCode: string }[];
  officeAddress?: string; // Optional
}

export async function saveBusinessOperationsAction(input: BusinessOperationsInput) {
  try {
    const user = await requireAgencyOwner();
    if (!input.teamsCount || input.teamsCount < 1) throw new Error('Number of teams must be at least 1');
    if (!input.cleanerCount || input.cleanerCount < 1) throw new Error('Number of cleaners must be at least 1');
    if (!input.serviceSlugs || input.serviceSlugs.length === 0) throw new Error('Select at least one service offered');
    if (!input.serviceAreas || input.serviceAreas.length === 0) throw new Error('At least one service area is required');

    const services = await prisma.service.findMany({ where: { slug: { in: input.serviceSlugs } } });

    const agency = await prisma.$transaction(async (tx) => {
      const updated = await tx.agency.update({
        where: { id: user.agencyId! },
        data: {
          teamsCount: input.teamsCount,
          cleanerCount: input.cleanerCount,
          equipmentList: JSON.stringify(input.equipmentList || []),
          officeAddress: input.officeAddress || null,
          onboardingStep: 5,
        },
      });

      await tx.agencyServiceArea.deleteMany({ where: { agencyId: user.agencyId! } });
      await tx.agencyServiceArea.createMany({
        data: input.serviceAreas.map((a) => ({ agencyId: user.agencyId!, city: a.city, areaName: a.areaName, pinCode: a.pinCode })),
      });

      await tx.agencyService.deleteMany({ where: { agencyId: user.agencyId! } });
      if (services.length) {
        await tx.agencyService.createMany({
          data: services.map((s) => ({ agencyId: user.agencyId!, serviceId: s.id })),
        });
      }

      return updated;
    });

    return { success: true, agency };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---------- STEP 5: Bank Details ----------
export interface BankDetailsInput {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  cancelledChequeUrl?: string;
}

export async function saveBankDetailsAction(input: BankDetailsInput) {
  try {
    const user = await requireAgencyOwner();
    if (!input.accountHolder?.trim()) throw new Error('Account holder name is required');
    if (!input.bankName?.trim()) throw new Error('Bank name is required');
    if (!/^\d{9,18}$/.test(input.accountNumber || '')) throw new Error('Enter a valid bank account number');
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test((input.ifscCode || '').toUpperCase())) throw new Error('Enter a valid IFSC code');

    const maskedAccount = `XXXXXXXX${input.accountNumber.slice(-4)}`;

    const agency = await prisma.$transaction(async (tx) => {
      const updated = await tx.agency.update({
        where: { id: user.agencyId! },
        data: {
          bankAccountHolder: input.accountHolder,
          bankName: input.bankName,
          bankAccountNumber: maskedAccount, // production: store via encrypted/tokenized vault, never plaintext
          bankIfscCode: input.ifscCode.toUpperCase(),
          onboardingStep: 6,
        },
      });

      if (input.cancelledChequeUrl) {
        await tx.partnerDocument.upsert({
          where: { id: `${user.agencyId}-BANK_PASSBOOK` },
          create: { id: `${user.agencyId}-BANK_PASSBOOK`, agencyId: user.agencyId!, documentType: 'BANK_PASSBOOK', documentUrl: input.cancelledChequeUrl, status: 'PENDING' },
          update: { documentUrl: input.cancelledChequeUrl, status: 'PENDING' },
        });
      }

      return updated;
    });

    return { success: true, agency };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---------- STEP 6: Partner Agreement ----------
export async function acceptPartnerAgreementAction() {
  try {
    const user = await requireAgencyOwner();
    const agency = await prisma.agency.update({
      where: { id: user.agencyId! },
      data: {
        agreementAccepted: true,
        agreementAcceptedAt: new Date(),
        onboardingStep: 7,
      },
    });

    await prisma.partnerDocument.upsert({
      where: { id: `${user.agencyId}-BUSINESS_AGREEMENT` },
      create: { id: `${user.agencyId}-BUSINESS_AGREEMENT`, agencyId: user.agencyId!, documentType: 'BUSINESS_AGREEMENT', documentUrl: 'accepted-in-app', status: 'VERIFIED' },
      update: { status: 'VERIFIED' },
    });

    return { success: true, agency };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ---------- STEP 7: Finalize / Submit for Review ----------
export async function submitOnboardingForReviewAction() {
  try {
    const user = await requireAgencyOwner();
    const agency = await prisma.agency.findUnique({
      where: { id: user.agencyId! },
      include: { documents: true, serviceAreas: true, services: true },
    });
    if (!agency) throw new Error('Agency not found');

    const missing: string[] = [];
    if (!agency.mobileVerified) missing.push('Mobile verification');
    if (!agency.aadhaarNumber || !agency.panNumber) missing.push('KYC details');
    if (!agency.teamsCount || !agency.cleanerCount) missing.push('Business & operations details');
    if (!agency.bankAccountNumber) missing.push('Bank details');
    if (!agency.agreementAccepted) missing.push('Partner agreement acceptance');
    if (agency.serviceAreas.length === 0) missing.push('Service areas');

    if (missing.length > 0) {
      throw new Error(`Cannot submit for review — incomplete: ${missing.join(', ')}`);
    }

    const updated = await prisma.agency.update({
      where: { id: user.agencyId! },
      data: { partnerStatus: 'UNDER_REVIEW' },
    });

    await logAudit({
      action: 'ADMIN_CONFIG_CHANGED',
      entityType: 'Agency',
      entityId: agency.id,
      performedBy: user.id,
      actorType: 'AGENCY',
      metadata: { step: 'SUBMITTED_FOR_REVIEW' },
    });

    return { success: true, agency: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getOnboardingStateAction() {
  try {
    const user = await requireAgencyOwner();
    const agency = await prisma.agency.findUnique({
      where: { id: user.agencyId! },
      include: { documents: true, serviceAreas: true, services: { include: { service: true } } },
    });
    if (!agency) throw new Error('Agency not found');
    return { success: true, agency };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
