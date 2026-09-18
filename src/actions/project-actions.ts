'use server';

import { prisma } from '@/lib/db';
import { logAudit } from '@/lib/audit/audit-logger';
import { dispatchNotification } from '@/lib/notifications/notification-service';
import { assertWorkflowTransition } from '@/lib/booking/workflow-engine';
import { createSettlementRecord } from '@/lib/settlements/settlement-engine';

export async function approveCustomerHandoverAction(bookingId: string, customerId: string) {
  try {
    // ENFORCE GOLDEN RULE 3: NO QC = NO HANDOVER
    await assertWorkflowTransition(bookingId, 'CUSTOMER_APPROVAL_PENDING');

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new Error('Booking not found');

    const result = await prisma.$transaction(async (tx) => {
      // Mark customerApproved = true (Golden Rule 4 Satisfied!)
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          customerApproved: true,
          bookingStatus: 'CUSTOMER_APPROVED',
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          fromStatus: 'QC_PASSED',
          toStatus: 'CUSTOMER_APPROVED',
          changedBy: customerId,
          changedType: 'CUSTOMER',
          remarks: 'Customer inspected property and approved completion.',
        },
      });

      await logAudit({
        action: 'HANDOVER_APPROVED',
        entityType: 'Booking',
        entityId: bookingId,
        performedBy: customerId,
        actorType: 'CUSTOMER',
      });

      return updatedBooking;
    });

    return { success: true, booking: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function processBalancePaymentAndCloseAction(bookingId: string, performedBy: string) {
  try {
    // ENFORCE GOLDEN RULE 4: NO APPROVAL = NO CLOSURE
    await assertWorkflowTransition(bookingId, 'BALANCE_PAYMENT_PENDING');

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true },
    });

    if (!booking) throw new Error('Booking not found');

    const invoiceNumber = `INV-2026-${1001 + Math.floor(Math.random() * 8999)}`;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Invoice record
      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          bookingId: booking.id,
          customerId: booking.customerId,
          subtotal: booking.subtotal,
          gstAmount: booking.gstAmount,
          totalAmount: booking.totalAmount,
          advancePaid: booking.advanceAmount,
          balancePaid: booking.balanceAmount,
        },
      });

      // 2. Mark payment complete & status CLOSED
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: 'FULLY_PAID',
          bookingStatus: 'CLOSED',
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          fromStatus: 'CUSTOMER_APPROVED',
          toStatus: 'CLOSED',
          changedBy: performedBy,
          changedType: 'OPERATIONS',
          remarks: `Balance payment of ₹${booking.balanceAmount} collected. Invoice #${invoiceNumber} issued. Booking CLOSED.`,
        },
      });

      await logAudit({
        action: 'PAYMENT_COMPLETED',
        entityType: 'Invoice',
        entityId: invoice.id,
        performedBy,
        actorType: 'OPERATIONS',
        metadata: { invoiceNumber, totalAmount: booking.totalAmount },
      });

      return { booking: updatedBooking, invoice };
    });

    // Automatically trigger internal agency settlement payout
    if (booking.agencyId) {
      await createSettlementRecord(
        {
          bookingId: booking.id,
          agencyId: booking.agencyId,
          customerTotalAmount: booking.totalAmount,
        },
        'SYSTEM_AUTOMATION'
      );
    }

    dispatchNotification({
      event: 'BOOKING_CLOSED',
      title: 'Booking Completed & Invoice Issued',
      message: `Thank you for choosing Kleanzo! Booking #${booking.bookingCode} is closed. Invoice #${invoiceNumber} generated.`,
    });

    return { success: true, ...result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitCustomerFeedbackAction(
  bookingId: string,
  customerId: string,
  overallRating: number,
  cleanlinessScore: number,
  punctualityScore: number,
  comments?: string,
  wouldRecommend: boolean = true
) {
  try {
    const feedback = await prisma.feedback.create({
      data: {
        bookingId,
        customerId,
        overallRating,
        cleanlinessScore,
        punctualityScore,
        comments,
        wouldRecommend,
      },
    });

    return { success: true, feedback };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
