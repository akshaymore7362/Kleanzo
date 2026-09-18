'use server';

import { prisma } from '@/lib/db';
import { logAudit } from '@/lib/audit/audit-logger';
import { dispatchNotification } from '@/lib/notifications/notification-service';
import { assertWorkflowTransition } from '@/lib/booking/workflow-engine';

export async function acceptJobRequestAction(jobId: string, agencyId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { booking: true },
    });

    if (!job) throw new Error('Job request not found');

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Job status
      const updatedJob = await tx.job.update({
        where: { id: jobId },
        data: {
          agencyId,
          status: 'PARTNER_ACCEPTED',
        },
      });

      // 2. Update linked Booking status to TEAM_ASSIGNED
      await tx.booking.update({
        where: { id: job.bookingId },
        data: {
          agencyId,
          bookingStatus: 'TEAM_ASSIGNED',
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: job.bookingId,
          fromStatus: 'PARTNER_PENDING_ACCEPTANCE',
          toStatus: 'PARTNER_ACCEPTED',
          changedBy: agencyId,
          changedType: 'AGENCY',
          remarks: 'Partner agency accepted job execution request.',
        },
      });

      await logAudit({
        action: 'AGENCY_ACCEPTED',
        entityType: 'Job',
        entityId: jobId,
        performedBy: agencyId,
        actorType: 'AGENCY',
      });

      return updatedJob;
    });

    return { success: true, job: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectJobRequestAction(jobId: string, agencyId: string, reason: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) throw new Error('Job request not found');

    const result = await prisma.$transaction(async (tx) => {
      const updatedJob = await tx.job.update({
        where: { id: jobId },
        data: {
          agencyId: null,
          status: 'JOB_UNASSIGNED',
        },
      });

      await tx.assignmentRejection.create({
        data: {
          assignmentId: jobId,
          bookingId: job.bookingId,
          agencyId,
          reason: reason || 'Capacity full',
          rejectedBy: agencyId,
        },
      });

      await tx.booking.update({
        where: { id: job.bookingId },
        data: {
          agencyId: null,
          bookingStatus: 'CONFIRMED',
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: job.bookingId,
          fromStatus: 'PARTNER_PENDING_ACCEPTANCE',
          toStatus: 'CONFIRMED',
          changedBy: agencyId,
          changedType: 'AGENCY',
          remarks: `Partner rejected job request: ${reason}`,
        },
      });

      await logAudit({
        action: 'AGENCY_REJECTED',
        entityType: 'Job',
        entityId: jobId,
        performedBy: agencyId,
        actorType: 'AGENCY',
        metadata: { reason },
      });

      return updatedJob;
    });

    return { success: true, job: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createPartnerPayoutAction(jobId: string, adminUserId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { booking: true },
    });

    if (!job) throw new Error('Job not found');
    if (!job.agencyId) throw new Error('Job has no assigned partner agency');

    const payoutNo = `PO-${Date.now()}-${Math.floor(Math.random() * 8999)}`;
    const customerPrice = job.booking.totalAmount;
    const partnerPayout = job.partnerPayout || Math.round(customerPrice * 0.75);
    const kleanzoRetained = Math.max(0, customerPrice - partnerPayout);

    const payout = await prisma.partnerPayout.create({
      data: {
        payoutNo,
        jobId: job.id,
        bookingId: job.bookingId,
        agencyId: job.agencyId,
        customerPrice,
        partnerPayout,
        kleanzoRetained,
        status: 'PENDING',
      },
    });

    await logAudit({
      action: 'SETTLEMENT_CREATED',
      entityType: 'PartnerPayout',
      entityId: payout.id,
      performedBy: adminUserId,
      actorType: 'OPERATIONS',
      metadata: { payoutNo, partnerPayout, kleanzoRetained },
    });

    return { success: true, payout };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markPartnerPayoutPaidAction(payoutId: string, transactionRef: string, adminUserId: string) {
  try {
    const payout = await prisma.partnerPayout.update({
      where: { id: payoutId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        transactionRef,
      },
    });

    await logAudit({
      action: 'SETTLEMENT_CREATED',
      entityType: 'PartnerPayout',
      entityId: payoutId,
      performedBy: adminUserId,
      actorType: 'OPERATIONS',
      metadata: { transactionRef, status: 'PAID' },
    });

    return { success: true, payout };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePartnerStatusAction(agencyId: string, targetStatus: string, adminUserId: string) {
  try {
    const agency = await prisma.agency.update({
      where: { id: agencyId },
      data: { partnerStatus: targetStatus },
    });

    await logAudit({
      action: 'ADMIN_CONFIG_CHANGED',
      entityType: 'Agency',
      entityId: agencyId,
      performedBy: adminUserId,
      actorType: 'ADMIN',
      metadata: { partnerStatus: targetStatus },
    });

    return { success: true, agency };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
