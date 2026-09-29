import { prisma } from '@/lib/db';

export type WorkflowStatus =
  | 'ENQUIRY_RECEIVED'
  | 'QUOTE_CREATED'
  | 'QUOTE_ACCEPTED'
  | 'BOOKING_PENDING_ADVANCE'
  | 'ASSIGNMENT_PENDING'
  | 'PARTNER_PENDING_ACCEPTANCE'
  | 'PARTNER_ACCEPTED'
  | 'INSPECTION_PENDING'
  | 'INSPECTION_COMPLETED'
  | 'CLEANING_IN_PROGRESS'
  | 'CLEANING_COMPLETED'
  | 'QC_PENDING'
  | 'QC_PASSED'
  | 'CUSTOMER_APPROVAL_PENDING'
  | 'CUSTOMER_APPROVED'
  | 'CUSTOMER_ISSUE_RAISED'
  | 'CORRECTION_REQUIRED'
  | 'CORRECTION_COMPLETED'
  | 'BALANCE_PAYMENT_PENDING'
  | 'PAYMENT_COMPLETED'
  | 'INVOICE_ISSUED'
  | 'CLOSED'
  | 'CANCELLED';

export const WORKFLOW_TRANSITIONS: Record<WorkflowStatus, readonly WorkflowStatus[]> = {
  ENQUIRY_RECEIVED: ['QUOTE_CREATED', 'CANCELLED'],
  QUOTE_CREATED: ['QUOTE_ACCEPTED', 'CANCELLED'],
  QUOTE_ACCEPTED: ['BOOKING_PENDING_ADVANCE', 'CANCELLED'],
  BOOKING_PENDING_ADVANCE: ['ASSIGNMENT_PENDING', 'CANCELLED'],
  ASSIGNMENT_PENDING: ['PARTNER_PENDING_ACCEPTANCE', 'CANCELLED'],
  PARTNER_PENDING_ACCEPTANCE: ['PARTNER_ACCEPTED', 'ASSIGNMENT_PENDING', 'CANCELLED'],
  PARTNER_ACCEPTED: ['INSPECTION_PENDING', 'CANCELLED'],
  INSPECTION_PENDING: ['INSPECTION_COMPLETED', 'CANCELLED'],
  INSPECTION_COMPLETED: ['CLEANING_IN_PROGRESS', 'CANCELLED'],
  CLEANING_IN_PROGRESS: ['CLEANING_COMPLETED', 'CANCELLED'],
  CLEANING_COMPLETED: ['QC_PENDING', 'QC_PASSED', 'CANCELLED'],
  QC_PENDING: ['QC_PASSED', 'CORRECTION_REQUIRED', 'CANCELLED'],
  QC_PASSED: ['CUSTOMER_APPROVAL_PENDING', 'CANCELLED'],
  CUSTOMER_APPROVAL_PENDING: ['CUSTOMER_APPROVED', 'CUSTOMER_ISSUE_RAISED'],
  CUSTOMER_APPROVED: ['BALANCE_PAYMENT_PENDING', 'PAYMENT_COMPLETED', 'CLOSED'],
  CUSTOMER_ISSUE_RAISED: ['CORRECTION_REQUIRED', 'CANCELLED'],
  CORRECTION_REQUIRED: ['CORRECTION_COMPLETED', 'CANCELLED'],
  CORRECTION_COMPLETED: ['QC_PENDING', 'QC_PASSED'],
  BALANCE_PAYMENT_PENDING: ['PAYMENT_COMPLETED', 'CLOSED'],
  PAYMENT_COMPLETED: ['INVOICE_ISSUED', 'CLOSED'],
  INVOICE_ISSUED: ['CLOSED'],
  CLOSED: [],
  CANCELLED: [],
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
