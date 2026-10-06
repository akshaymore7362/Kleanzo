import { prisma } from '@/lib/db';

export type WorkflowStatus =
  | 'ENQUIRY_RECEIVED'
  | 'QUOTE_CREATED'
  | 'QUOTE_ACCEPTED'
  | 'BOOKING_PENDING_ADVANCE'
  | 'PAYMENT_FAILED'
  | 'CONFIRMED'
  | 'MATCHING'
  | 'MATCHING_FAILED'
  | 'AGENCY_REQUIRED'
  | 'OFFER_SENT'
  | 'OFFER_EXPIRED'
  | 'PARTNER_PENDING_ACCEPTANCE'
  | 'PARTNER_ACCEPTED'
  | 'TEAM_ASSIGNED'
  | 'INSPECTION_PENDING'
  | 'INSPECTION_COMPLETED'
  | 'ON_THE_WAY'
  | 'CLEANING_IN_PROGRESS'
  | 'CLEANING_COMPLETED'
  | 'QC_PENDING'
  | 'QC_PASSED'
  | 'VERIFICATION_PENDING'
  | 'CORRECTION_REQUIRED'
  | 'CORRECTION_COMPLETED'
  | 'CUSTOMER_APPROVAL_PENDING'
  | 'CUSTOMER_APPROVED'
  | 'CUSTOMER_ISSUE_RAISED'
  | 'DISPUTED'
  | 'BALANCE_PAYMENT_PENDING'
  | 'PAYMENT_COMPLETED'
  | 'INVOICE_ISSUED'
  | 'COMPLETED'
  | 'CLOSED'
  | 'RESCHEDULE_REQUESTED'
  | 'RESCHEDULED'
  | 'CANCEL_REQUESTED'
  | 'CUSTOMER_CANCELLED'
  | 'AGENCY_CANCELLED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'EMERGENCY_REASSIGNMENT'
  | 'ABANDONED';

export const WORKFLOW_TRANSITIONS: Record<WorkflowStatus, readonly WorkflowStatus[]> = {
  ENQUIRY_RECEIVED: ['QUOTE_CREATED', 'CANCELLED', 'ABANDONED'],
  QUOTE_CREATED: ['QUOTE_ACCEPTED', 'CANCELLED', 'ABANDONED'],
  QUOTE_ACCEPTED: ['BOOKING_PENDING_ADVANCE', 'CANCELLED', 'ABANDONED'],
  BOOKING_PENDING_ADVANCE: ['CONFIRMED', 'PAYMENT_FAILED', 'CANCELLED', 'ABANDONED'],
  PAYMENT_FAILED: ['BOOKING_PENDING_ADVANCE', 'CANCELLED', 'ABANDONED'],
  CONFIRMED: ['MATCHING', 'RESCHEDULE_REQUESTED', 'CUSTOMER_CANCELLED', 'CANCELLED'],
  MATCHING: ['OFFER_SENT', 'MATCHING_FAILED', 'AGENCY_REQUIRED', 'CUSTOMER_CANCELLED', 'CANCELLED'],
  MATCHING_FAILED: ['AGENCY_REQUIRED', 'MATCHING', 'CUSTOMER_CANCELLED', 'CANCELLED'],
  AGENCY_REQUIRED: ['OFFER_SENT', 'PARTNER_ACCEPTED', 'EMERGENCY_REASSIGNMENT', 'CUSTOMER_CANCELLED', 'CANCELLED'],
  OFFER_SENT: ['PARTNER_ACCEPTED', 'OFFER_EXPIRED', 'AGENCY_CANCELLED', 'CUSTOMER_CANCELLED', 'CANCELLED'],
  OFFER_EXPIRED: ['MATCHING', 'AGENCY_REQUIRED', 'EMERGENCY_REASSIGNMENT', 'CUSTOMER_CANCELLED', 'CANCELLED'],
  PARTNER_PENDING_ACCEPTANCE: ['PARTNER_ACCEPTED', 'AGENCY_CANCELLED', 'MATCHING', 'CANCELLED'],
  PARTNER_ACCEPTED: ['TEAM_ASSIGNED', 'INSPECTION_PENDING', 'AGENCY_CANCELLED', 'EMERGENCY_REASSIGNMENT', 'RESCHEDULE_REQUESTED', 'CUSTOMER_CANCELLED', 'CANCELLED'],
  TEAM_ASSIGNED: ['ON_THE_WAY', 'INSPECTION_PENDING', 'AGENCY_CANCELLED', 'EMERGENCY_REASSIGNMENT', 'RESCHEDULE_REQUESTED', 'CUSTOMER_CANCELLED', 'CANCELLED'],
  INSPECTION_PENDING: ['INSPECTION_COMPLETED', 'AGENCY_CANCELLED', 'EMERGENCY_REASSIGNMENT', 'CANCELLED'],
  INSPECTION_COMPLETED: ['ON_THE_WAY', 'CLEANING_IN_PROGRESS', 'AGENCY_CANCELLED', 'CANCELLED'],
  ON_THE_WAY: ['CLEANING_IN_PROGRESS', 'AGENCY_CANCELLED', 'EMERGENCY_REASSIGNMENT', 'CANCELLED'],
  CLEANING_IN_PROGRESS: ['CLEANING_COMPLETED', 'VERIFICATION_PENDING', 'CUSTOMER_ISSUE_RAISED', 'DISPUTED', 'CANCELLED'],
  CLEANING_COMPLETED: ['QC_PENDING', 'QC_PASSED', 'VERIFICATION_PENDING', 'DISPUTED', 'CANCELLED'],
  QC_PENDING: ['QC_PASSED', 'CORRECTION_REQUIRED', 'CANCELLED'],
  QC_PASSED: ['CUSTOMER_APPROVAL_PENDING', 'VERIFICATION_PENDING', 'CANCELLED'],
  VERIFICATION_PENDING: ['CUSTOMER_APPROVED', 'CORRECTION_REQUIRED', 'COMPLETED', 'DISPUTED', 'REFUND_PENDING', 'CANCELLED'],
  CORRECTION_REQUIRED: ['CORRECTION_COMPLETED', 'CLEANING_IN_PROGRESS', 'CANCELLED'],
  CORRECTION_COMPLETED: ['QC_PENDING', 'QC_PASSED', 'VERIFICATION_PENDING'],
  CUSTOMER_APPROVAL_PENDING: ['CUSTOMER_APPROVED', 'CUSTOMER_ISSUE_RAISED', 'DISPUTED'],
  CUSTOMER_APPROVED: ['BALANCE_PAYMENT_PENDING', 'PAYMENT_COMPLETED', 'COMPLETED', 'CLOSED'],
  CUSTOMER_ISSUE_RAISED: ['CORRECTION_REQUIRED', 'DISPUTED', 'REFUND_PENDING', 'CANCELLED'],
  DISPUTED: ['CORRECTION_REQUIRED', 'REFUND_PENDING', 'REFUNDED', 'COMPLETED', 'CANCELLED'],
  BALANCE_PAYMENT_PENDING: ['PAYMENT_COMPLETED', 'CLOSED', 'COMPLETED'],
  PAYMENT_COMPLETED: ['INVOICE_ISSUED', 'COMPLETED', 'CLOSED'],
  INVOICE_ISSUED: ['CLOSED', 'COMPLETED'],
  COMPLETED: ['DISPUTED', 'REFUND_PENDING', 'CLOSED'],
  CLOSED: [],
  RESCHEDULE_REQUESTED: ['RESCHEDULED', 'MATCHING', 'CANCELLED'],
  RESCHEDULED: ['CONFIRMED', 'MATCHING', 'PARTNER_ACCEPTED', 'TEAM_ASSIGNED'],
  CANCEL_REQUESTED: ['CUSTOMER_CANCELLED', 'AGENCY_CANCELLED', 'REFUND_PENDING', 'CANCELLED'],
  CUSTOMER_CANCELLED: ['REFUND_PENDING', 'REFUNDED', 'CANCELLED'],
  AGENCY_CANCELLED: ['EMERGENCY_REASSIGNMENT', 'MATCHING', 'AGENCY_REQUIRED', 'REFUND_PENDING', 'CANCELLED'],
  CANCELLED: ['REFUND_PENDING', 'REFUNDED'],
  REFUND_PENDING: ['REFUNDED'],
  REFUNDED: [],
  EMERGENCY_REASSIGNMENT: ['OFFER_SENT', 'PARTNER_ACCEPTED', 'AGENCY_REQUIRED', 'CANCELLED'],
  ABANDONED: [],
};

/**
 * GOLDEN RULE 1: NO SCOPE = NO BOOKING
 * Validates that scope of work and quote exist before confirming a booking.
 */
export async function validateScopeBeforeBooking(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { quote: true },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  const scopeText = booking.quote?.scopeDetails;
  if (!booking.hasScope && (!scopeText || scopeText.trim().length === 0)) {
    throw new Error('GOLDEN RULE VIOLATION: NO SCOPE = NO BOOKING. Scope of work must be defined in quote before booking confirmation.');
  }
}

/**
 * GOLDEN RULE 2: NO INSPECTION = NO CLEANING
 * Validates that site inspection is completed before starting cleaning.
 */
export async function validateInspectionBeforeCleaning(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { siteInspection: true },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (!booking.inspectionCompleted && (!booking.siteInspection || !booking.siteInspection.beforePhotos)) {
    throw new Error('GOLDEN RULE VIOLATION: NO INSPECTION = NO CLEANING. Site inspection with before photos must be completed before starting deep cleaning.');
  }
}

/**
 * GOLDEN RULE 3: NO QC = NO HANDOVER
 * Validates that Quality Check (QC) is passed before customer handover inspection.
 */
export async function validateQcBeforeHandover(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { qualityCheck: true },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (!booking.qcPassed && (!booking.qualityCheck || !booking.qualityCheck.passed)) {
    throw new Error('GOLDEN RULE VIOLATION: NO QC = NO HANDOVER. Supervisor quality check (QC) with after photos must pass before customer handover.');
  }
}

/**
 * GOLDEN RULE 4: NO APPROVAL = NO CLOSURE
 * Validates that customer approval is recorded before balance payment & closure.
 */
export async function validateApprovalBeforeClosure(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

  if (!booking.customerApproved) {
    throw new Error('GOLDEN RULE VIOLATION: NO APPROVAL = NO CLOSURE. Customer must inspect and approve service completion before booking closure and balance payment settlement.');
  }
}

/**
 * Master State Machine Transition Guard
 * Verifies that target state transitions satisfy all business rules and valid workflow sequences.
 */
export async function assertWorkflowTransition(
  bookingId: string,
  targetStatus: WorkflowStatus
): Promise<void> {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    throw new Error('Booking not found');
  }

  const currentStatus = booking.bookingStatus as WorkflowStatus;
  const allowedTargets = WORKFLOW_TRANSITIONS[currentStatus];
  if (!allowedTargets || !allowedTargets.includes(targetStatus)) {
    throw new Error(`Invalid workflow transition: ${currentStatus} -> ${targetStatus}`);
  }

  // Check Golden Rule 1 before confirming booking
  if (['ASSIGNMENT_PENDING'].includes(targetStatus)) {
    await validateScopeBeforeBooking(bookingId);
  }

  // Check Golden Rule 2 before starting cleaning
  if (['CLEANING_IN_PROGRESS', 'CLEANING_COMPLETED'].includes(targetStatus)) {
    await validateInspectionBeforeCleaning(bookingId);
  }

  // Check Golden Rule 3 before customer handover
  if (['CUSTOMER_APPROVAL_PENDING'].includes(targetStatus)) {
    await validateQcBeforeHandover(bookingId);
  }

  // Check Golden Rule 4 before balance payment & closure
  if (['BALANCE_PAYMENT_PENDING', 'PAYMENT_COMPLETED', 'CLOSED'].includes(targetStatus)) {
    await validateApprovalBeforeClosure(bookingId);
  }
}
