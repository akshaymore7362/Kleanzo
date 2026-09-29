'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { assertRole } from '@/lib/auth/rbac';
import { logAudit } from '@/lib/audit/audit-logger';
import { dispatchNotification } from '@/lib/notifications/notification-service';
import { assertWorkflowTransition } from '@/lib/booking/workflow-engine';

export async function acceptJobRequestAction(jobId: string, agencyId: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO']);
    if (!user?.agencyId || user.agencyId !== agencyId) {
      throw new Error('Forbidden: Job does not belong to the current agency');
    }

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

      // 2. Update linked Booking status to inspection-ready partner state
      await tx.booking.update({
        where: { id: job.bookingId },
        data: {
          agencyId,
          bookingStatus: 'PARTNER_ACCEPTED',
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
        performedBy: user!.id,
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
    const user = await getCurrentUser();
    assertRole(user, ['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO']);
    if (!user?.agencyId || user.agencyId !== agencyId) {
      throw new Error('Forbidden: Job does not belong to the current agency');
    }

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
          bookingStatus: 'ASSIGNMENT_PENDING',
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId: job.bookingId,
          fromStatus: 'PARTNER_PENDING_ACCEPTANCE',
          toStatus: 'ASSIGNMENT_PENDING',
          changedBy: agencyId,
          changedType: 'AGENCY',
          remarks: `Partner rejected job request: ${reason}`,
        },
      });

      await logAudit({
        action: 'AGENCY_REJECTED',
        entityType: 'Job',
        entityId: jobId,
        performedBy: user!.id,
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
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'FINANCE']);

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
      performedBy: user!.id,
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
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'FINANCE']);

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
      performedBy: user!.id,
      actorType: 'OPERATIONS',
      metadata: { transactionRef, status: 'PAID' },
    });

    return { success: true, payout };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addCrewMemberAction(agencyId: string, name: string, phone: string, role: string, skills?: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO']);
    if (!user?.agencyId || user.agencyId !== agencyId) {
      throw new Error('Forbidden: Cannot modify another agency\'s crew');
    }
    if (!name?.trim() || !phone?.trim()) throw new Error('Name and phone are required');

    const crewMember = await prisma.crewMember.create({
      data: { agencyId, name, phone, role: role || 'CLEANER', skills },
    });

    await logAudit({
      action: 'ADMIN_CONFIG_CHANGED',
      entityType: 'CrewMember',
      entityId: crewMember.id,
      performedBy: user!.id,
      actorType: 'AGENCY',
      metadata: { action: 'ADDED', name, role },
    });

    return { success: true, crewMember };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCrewMemberAction(crewMemberId: string, agencyId: string, data: { name?: string; phone?: string; role?: string; skills?: string }) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO']);
    if (!user?.agencyId || user.agencyId !== agencyId) {
      throw new Error('Forbidden: Cannot modify another agency\'s crew');
    }

    const crewMember = await prisma.crewMember.update({
      where: { id: crewMemberId },
      data,
    });

    return { success: true, crewMember };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleCrewMemberActiveAction(crewMemberId: string, agencyId: string, active: boolean) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO']);
    if (!user?.agencyId || user.agencyId !== agencyId) {
      throw new Error('Forbidden: Cannot modify another agency\'s crew');
    }

    const crewMember = await prisma.crewMember.update({
      where: { id: crewMemberId },
      data: { active },
    });

    await logAudit({
      action: 'ADMIN_CONFIG_CHANGED',
      entityType: 'CrewMember',
      entityId: crewMemberId,
      performedBy: user!.id,
      actorType: 'AGENCY',
      metadata: { active },
    });

    return { success: true, crewMember };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function assignCrewToJobAction(bookingId: string, agencyId: string, crewMemberIds: string[], roleOnJob = 'CLEANER') {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO']);
    if (!user?.agencyId || user.agencyId !== agencyId) {
      throw new Error('Forbidden: Booking does not belong to the current agency');
    }
    if (!crewMemberIds.length) throw new Error('Select at least one crew member to assign');

    await prisma.crewAssignment.deleteMany({ where: { bookingId } });
    await prisma.crewAssignment.createMany({
      data: crewMemberIds.map((crewMemberId) => ({ bookingId, crewMemberId, roleOnJob })),
    });

    await logAudit({
      action: 'ADMIN_CONFIG_CHANGED',
      entityType: 'CrewAssignment',
      entityId: bookingId,
      performedBy: user!.id,
      actorType: 'AGENCY',
      metadata: { crewMemberIds, roleOnJob },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePartnerStatusAction(agencyId: string, targetStatus: string, adminUserId: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN']);

    const agency = await prisma.agency.update({
      where: { id: agencyId },
      data: { partnerStatus: targetStatus },
    });

    await logAudit({
      action: 'ADMIN_CONFIG_CHANGED',
      entityType: 'Agency',
      entityId: agencyId,
      performedBy: user!.id,
      actorType: 'ADMIN',
      metadata: { partnerStatus: targetStatus },
    });

    return { success: true, agency };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
