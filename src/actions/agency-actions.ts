'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { assertRole } from '@/lib/auth/rbac';
import { logAudit } from '@/lib/audit/audit-logger';
import { dispatchNotification } from '@/lib/notifications/notification-service';
import { assertWorkflowTransition } from '@/lib/booking/workflow-engine';

/**
 * Ensures logged-in user belongs to the assigned agency for the specified booking.
 */
async function requireAgencyBookingAccess(bookingId: string) {
  const user = await getCurrentUser();
  assertRole(user, ['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO']);

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error('Booking not found');
  if (!user?.agencyId || booking.agencyId !== user.agencyId) {
    throw new Error('Forbidden: Booking does not belong to the current agency');
  }

  return { user, booking };
}

/**
 * Assigns Team Leader and Crew Members to an accepted job.
 * Validates staff belong to the agency and have no conflicting jobs at the scheduled time.
 */
export async function assignAgencyTeamAction(
  bookingId: string,
  teamLeaderId: string,
  workerIds: string[]
) {
  try {
    const { user, booking } = await requireAgencyBookingAccess(bookingId);

    const allMemberIds = Array.from(new Set([teamLeaderId, ...workerIds]));
    
    // Verify all members belong to the agency
    const members = await prisma.crewMember.findMany({
      where: {
        id: { in: allMemberIds },
        agencyId: user.agencyId!,
        active: true,
      },
    });

    if (members.length !== allMemberIds.length) {
      throw new Error('One or more selected team members do not belong to your agency or are inactive.');
    }

    // Check for conflicting active assignments on same date and time
    const conflictingAssignments = await prisma.crewAssignment.findMany({
      where: {
        crewMemberId: { in: allMemberIds },
        booking: {
          scheduledDate: booking.scheduledDate,
          scheduledTime: booking.scheduledTime,
          id: { not: bookingId },
          bookingStatus: { notIn: ['CANCELLED', 'CLOSED', 'COMPLETED'] },
        },
      },
      include: { crewMember: true },
    });

    if (conflictingAssignments.length > 0) {
      const names = conflictingAssignments.map(c => c.crewMember.name).join(', ');
      throw new Error(`Schedule Conflict: Workers (${names}) are already assigned to another job at ${booking.scheduledTime} on ${booking.scheduledDate}.`);
    }

    await prisma.$transaction(async (tx) => {
      // Clear previous crew assignments for this booking
      await tx.crewAssignment.deleteMany({ where: { bookingId } });

      // Create new assignments
      const assignments = allMemberIds.map(id => ({
        bookingId,
        crewMemberId: id,
        roleOnJob: id === teamLeaderId ? 'LEAD' : 'CLEANER',
      }));

      await tx.crewAssignment.createMany({ data: assignments });

      await tx.booking.update({
        where: { id: bookingId },
        data: {
          bookingStatus: 'TEAM_ASSIGNED',
          teamId: teamLeaderId,
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          fromStatus: booking.bookingStatus,
          toStatus: 'TEAM_ASSIGNED',
          changedBy: user.id,
          changedType: 'AGENCY',
          remarks: `Assigned Team Leader and ${workerIds.length} cleaners to job.`,
        },
      });

      await logAudit({
        action: 'TEAM_ASSIGNED',
        entityType: 'Booking',
        entityId: bookingId,
        performedBy: user.id,
        actorType: 'AGENCY',
        metadata: { teamLeaderId, workerCount: workerIds.length },
      }, tx);
    }, { timeout: 20000 });

    return { success: true, message: 'Team successfully assigned to job.' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Updates Job Day Operational Status (ON_THE_WAY, ARRIVED, WORK_STARTED).
 */
export async function updateJobDayStatusAction(
  bookingId: string,
  newStatus: 'ON_THE_WAY' | 'ARRIVED' | 'WORK_STARTED' | 'WORK_IN_PROGRESS'
) {
  try {
    const { user, booking } = await requireAgencyBookingAccess(bookingId);

    const now = new Date();
    const updateData: any = { bookingStatus: newStatus };

    if (newStatus === 'ON_THE_WAY') updateData.onTheWayAt = now;
    if (newStatus === 'ARRIVED') updateData.arrivedAt = now;
    if (newStatus === 'WORK_STARTED' || newStatus === 'WORK_IN_PROGRESS') {
      updateData.workStartedAt = now;
      updateData.bookingStatus = 'CLEANING_IN_PROGRESS';
    }

    const updated = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id: bookingId },
        data: updateData,
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          fromStatus: booking.bookingStatus,
          toStatus: updateData.bookingStatus,
          changedBy: user.id,
          changedType: 'AGENCY',
          remarks: `Job status updated to ${newStatus}`,
        },
      });

      return b;
    }, { timeout: 20000 });

    dispatchNotification({
      event: 'SERVICE_STARTED',
      title: `Service Update: ${newStatus.replace(/_/g, ' ')}`,
      message: `Your Kleanzo service status is now ${newStatus.replace(/_/g, ' ')}.`,
    });

    return { success: true, booking: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Records Site Inspection (Before Photos & Condition).
 */
export async function recordSiteInspectionAction(
  bookingId: string,
  inspectorName: string,
  actualCondition: string,
  confirmedScope: string,
  beforePhotos: string[],
  notes?: string
) {
  try {
    const { user } = await requireAgencyBookingAccess(bookingId);
    if (!beforePhotos || beforePhotos.length === 0) {
      throw new Error('GOLDEN RULE 2 VIOLATION: NO INSPECTION = NO CLEANING. Before photos are mandatory for site inspection.');
    }

    const result = await prisma.$transaction(async (tx) => {
      const inspection = await tx.siteInspection.upsert({
        where: { bookingId },
        create: {
          bookingId,
          inspectorName,
          actualCondition,
          confirmedScope,
          beforePhotos: JSON.stringify(beforePhotos),
          notes,
        },
        update: {
          inspectorName,
          actualCondition,
          confirmedScope,
          beforePhotos: JSON.stringify(beforePhotos),
          notes,
        },
      });

      await tx.booking.update({
        where: { id: bookingId },
        data: {
          inspectionCompleted: true,
          bookingStatus: 'INSPECTION_COMPLETED',
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          fromStatus: 'PARTNER_ACCEPTED',
          toStatus: 'INSPECTION_COMPLETED',
          changedBy: user.id,
          changedType: 'AGENCY',
          remarks: `Site inspection completed. Condition: ${actualCondition}. ${beforePhotos.length} before photos captured.`,
        },
      });

      await logAudit({
        action: 'STATUS_TRANSITION',
        entityType: 'SiteInspection',
        entityId: inspection.id,
        performedBy: user.id,
        actorType: 'AGENCY',
        metadata: { actualCondition, confirmedScope },
      }, tx);

      return inspection;
    }, { timeout: 20000 });

    dispatchNotification({
      event: 'SERVICE_STARTED',
      title: 'Site Inspection Completed',
      message: 'Kleanzo team has completed site inspection and verified scope with before photos.',
    });

    return { success: true, inspection: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Agency submits job completion proof (Photos, Notes, Completion Time).
 * Transitions booking to VERIFICATION_PENDING for Admin review.
 */
export async function submitAgencyCompletionAction(
  bookingId: string,
  completionNotes: string,
  completionPhotos: string[]
) {
  try {
    const { user, booking } = await requireAgencyBookingAccess(bookingId);

    if (!completionPhotos || completionPhotos.length === 0) {
      throw new Error('Completion photos are required before submitting completion proof.');
    }

    const now = new Date();

    const result = await prisma.$transaction(async (tx) => {
      // Save QualityCheck record if not present
      await tx.qualityCheck.upsert({
        where: { bookingId },
        create: {
          bookingId,
          supervisorName: user.name || 'Agency Supervisor',
          afterPhotos: JSON.stringify(completionPhotos),
          passed: true,
        },
        update: {
          supervisorName: user.name || 'Agency Supervisor',
          afterPhotos: JSON.stringify(completionPhotos),
          passed: true,
        },
      });

      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          bookingStatus: 'VERIFICATION_PENDING',
          verificationStatus: 'PENDING',
          workCompletedAt: now,
          completionProof: JSON.stringify(completionPhotos),
          completionNotes,
          qcPassed: true,
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          fromStatus: booking.bookingStatus,
          toStatus: 'VERIFICATION_PENDING',
          changedBy: user.id,
          changedType: 'AGENCY',
          remarks: `Agency submitted completion proof (${completionPhotos.length} photos). Awaiting Admin verification.`,
        },
      });

      await logAudit({
        action: 'COMPLETION_SUBMITTED',
        entityType: 'Booking',
        entityId: bookingId,
        performedBy: user.id,
        actorType: 'AGENCY',
        metadata: { completionNotes, photoCount: completionPhotos.length },
      }, tx);

      return updatedBooking;
    }, { timeout: 20000 });

    dispatchNotification({
      event: 'COMPLETION_SUBMITTED',
      title: 'Completion Proof Submitted',
      message: `Agency submitted completion proof for booking #${booking.bookingCode}. Awaiting Admin verification.`,
    });

    return { success: true, booking: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Agency requests additional work authorization on site.
 */
export async function requestAdditionalWorkAction(
  bookingId: string,
  reason: string,
  description: string,
  requestedAmount: number,
  photos?: string[]
) {
  try {
    const { user, booking } = await requireAgencyBookingAccess(bookingId);

    const workRequest = await prisma.additionalWorkRequest.create({
      data: {
        bookingId,
        agencyId: user.agencyId!,
        reason,
        description,
        requestedAmount,
        photos: photos ? JSON.stringify(photos) : undefined,
        status: 'PENDING',
      },
    });

    await logAudit({
      action: 'ADDITIONAL_WORK_REQUESTED',
      entityType: 'AdditionalWorkRequest',
      entityId: workRequest.id,
      performedBy: user.id,
      actorType: 'AGENCY',
      metadata: { requestedAmount, reason },
    });

    dispatchNotification({
      event: 'ADDITIONAL_WORK_REQUEST',
      title: 'Additional Work Request Submitted',
      message: `Agency requested ₹${requestedAmount} additional work for booking #${booking.bookingCode}.`,
    });

    return { success: true, request: workRequest };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Fetches jobs assigned to the logged-in agency with tenant isolation.
 */
export async function getAgencyJobsAction(statusFilter?: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO']);

    if (!user?.agencyId) {
      throw new Error('No agency profile associated with this account.');
    }

    const whereClause: any = { agencyId: user.agencyId };
    if (statusFilter && statusFilter !== 'ALL') {
      whereClause.bookingStatus = statusFilter;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        items: true,
        addresses: true,
        crewAssignments: { include: { crewMember: true } },
        siteInspection: true,
        qualityCheck: true,
        offers: { where: { agencyId: user.agencyId }, orderBy: { sentAt: 'desc' } },
        additionalWorkRequests: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, bookings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Fetches agency crew members for team assignment.
 */
export async function getAgencyTeamMembersAction() {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO']);

    if (!user?.agencyId) {
      throw new Error('No agency profile associated with this account.');
    }

    const members = await prisma.crewMember.findMany({
      where: { agencyId: user.agencyId, active: true },
      orderBy: { name: 'asc' },
    });

    return { success: true, members };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function startDeepCleaningAction(bookingId: string, performedBy?: string) {
  try {
    const { user } = await requireAgencyBookingAccess(bookingId);
    await assertWorkflowTransition(bookingId, 'CLEANING_IN_PROGRESS');

    const updated = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id: bookingId },
        data: { bookingStatus: 'CLEANING_IN_PROGRESS' },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          fromStatus: 'INSPECTION_COMPLETED',
          toStatus: 'CLEANING_IN_PROGRESS',
          changedBy: user.id,
          changedType: 'AGENCY',
          remarks: 'Deep cleaning started.',
        },
      });

      return b;
    }, { timeout: 20000 });

    return { success: true, booking: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitQualityCheckAction(
  bookingId: string,
  supervisorName: string,
  checklist: any,
  afterPhotos: string[],
  recleanedDetails?: string
) {
  try {
    const { user } = await requireAgencyBookingAccess(bookingId);
    if (!afterPhotos || afterPhotos.length === 0) {
      throw new Error('GOLDEN RULE 3 VIOLATION: NO QC = NO HANDOVER. After photos are mandatory for quality check pass.');
    }

    const result = await prisma.$transaction(async (tx) => {
      const qc = await tx.qualityCheck.upsert({
        where: { bookingId },
        create: {
          bookingId,
          supervisorName,
          bedroomsChecked: checklist?.bedroomsChecked ?? true,
          livingChecked: checklist?.livingChecked ?? true,
          kitchenChecked: checklist?.kitchenChecked ?? true,
          bathroomsChecked: checklist?.bathroomsChecked ?? true,
          windowsChecked: checklist?.windowsChecked ?? true,
          floorsChecked: checklist?.floorsChecked ?? true,
          addonsChecked: checklist?.addonsChecked ?? true,
          afterPhotos: JSON.stringify(afterPhotos),
          passed: true,
          recleanedDetails,
        },
        update: {
          supervisorName,
          bedroomsChecked: checklist?.bedroomsChecked ?? true,
          livingChecked: checklist?.livingChecked ?? true,
          kitchenChecked: checklist?.kitchenChecked ?? true,
          bathroomsChecked: checklist?.bathroomsChecked ?? true,
          windowsChecked: checklist?.windowsChecked ?? true,
          floorsChecked: checklist?.floorsChecked ?? true,
          addonsChecked: checklist?.addonsChecked ?? true,
          afterPhotos: JSON.stringify(afterPhotos),
          passed: true,
          recleanedDetails,
        },
      });

      await tx.booking.update({
        where: { id: bookingId },
        data: {
          qcPassed: true,
          bookingStatus: 'QC_PASSED',
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          fromStatus: 'CLEANING_IN_PROGRESS',
          toStatus: 'QC_PASSED',
          changedBy: supervisorName,
          changedType: 'AGENCY',
          remarks: `Quality check passed by supervisor ${supervisorName}.`,
        },
      });

      return qc;
    }, { timeout: 20000 });

    return { success: true, qc: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

