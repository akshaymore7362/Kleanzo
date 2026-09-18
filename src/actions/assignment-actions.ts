'use server';

import { prisma } from '@/lib/db';
import { runAgencyMatchingEngine } from '@/lib/matching/agency-matching';
import { logAudit } from '@/lib/audit/audit-logger';
import { dispatchNotification } from '@/lib/notifications/notification-service';

export async function findMatchingAgenciesAction(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        items: true,
        addresses: true,
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    const firstAddress = booking.addresses[0];
    const requirement = {
      bookingId: booking.id,
      city: firstAddress?.city || 'Pune',
      area: firstAddress?.areaName,
      scheduledDate: booking.scheduledDate,
      timeSlot: booking.scheduledTime,
      services: booking.items.map(i => ({
        serviceSlug: i.serviceName.toLowerCase().replace(/\s+/g, '-'),
        quantity: i.quantity,
      })),
    };

    const rankedAgencies = await runAgencyMatchingEngine(requirement);
    return { success: true, rankedAgencies };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createAssignmentOfferAction(bookingId: string, agencyId: string, performedBy: string) {
  try {
    const offerMinutesDeadline = 30;
    const expiresAt = new Date(Date.now() + offerMinutesDeadline * 60 * 1000);

    const result = await prisma.$transaction(async (tx) => {
      const assignment = await tx.assignment.create({
        data: {
          bookingId,
          agencyId,
          assignedBy: 'OPERATIONS',
          status: 'OFFER_SENT',
          offerExpiresAt: expiresAt,
        },
      });

      const offer = await tx.assignmentOffer.create({
        data: {
          assignmentId: assignment.id,
          bookingId,
          agencyId,
          expiresAt,
        },
      });

      await tx.booking.update({
        where: { id: bookingId },
        data: { bookingStatus: 'ASSIGNED', agencyId },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          fromStatus: 'ASSIGNMENT_PENDING',
          toStatus: 'ASSIGNED',
          changedBy: performedBy,
          changedType: 'OPERATIONS',
          remarks: `Job offered to agency ID: ${agencyId}`,
        },
      });

      await logAudit({
        action: 'ASSIGNMENT_CREATED',
        entityType: 'AssignmentOffer',
        entityId: offer.id,
        performedBy,
        actorType: 'OPERATIONS',
        metadata: { bookingId, agencyId, expiresAt },
      });

      return { assignment, offer };
    });

    dispatchNotification({
      event: 'AGENCY_ASSIGNED',
      title: 'New Job Offer Received',
      message: `New Kleanzo booking available for agency. Offer expires in ${offerMinutesDeadline} minutes.`,
    });

    return { success: true, ...result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function respondToAssignmentOfferAction(
  offerId: string,
  agencyId: string,
  response: 'ACCEPTED' | 'REJECTED',
  rejectionReason?: string
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const offer = await tx.assignmentOffer.findUnique({
        where: { id: offerId },
        include: { assignment: true },
      });

      if (!offer) throw new Error('Assignment offer not found');
      if (offer.agencyId !== agencyId) throw new Error('Unauthorized: Offer does not belong to this agency');

      const now = new Date();

      if (response === 'ACCEPTED') {
        await tx.assignmentOffer.update({
          where: { id: offerId },
          data: {
            response: 'ACCEPTED',
            respondedAt: now,
          },
        });

        await tx.assignment.update({
          where: { id: offer.assignmentId },
          data: { status: 'ACCEPTED', acceptedAt: now },
        });

        await tx.booking.update({
          where: { id: offer.bookingId },
          data: { bookingStatus: 'AGENCY_ACCEPTED' },
        });

        await tx.bookingStatusHistory.create({
          data: {
            bookingId: offer.bookingId,
            fromStatus: 'ASSIGNED',
            toStatus: 'AGENCY_ACCEPTED',
            changedBy: agencyId,
            changedType: 'AGENCY',
            remarks: 'Agency accepted job offer. Unlocked customer details.',
          },
        });

        await logAudit({
          action: 'AGENCY_ACCEPTED',
          entityType: 'AssignmentOffer',
          entityId: offerId,
          performedBy: agencyId,
          actorType: 'AGENCY',
        });

        return { status: 'AGENCY_ACCEPTED' };
      } else {
        await tx.assignmentOffer.update({
          where: { id: offerId },
          data: {
            response: 'REJECTED',
            respondedAt: now,
          },
        });

        await tx.assignmentRejection.create({
          data: {
            assignmentId: offer.assignmentId,
            bookingId: offer.bookingId,
            agencyId,
            reason: rejectionReason || 'Capacity full',
            rejectedBy: agencyId,
          },
        });

        await tx.booking.update({
          where: { id: offer.bookingId },
          data: { bookingStatus: 'ASSIGNMENT_PENDING', agencyId: null },
        });

        await tx.bookingStatusHistory.create({
          data: {
            bookingId: offer.bookingId,
            fromStatus: 'ASSIGNED',
            toStatus: 'ASSIGNMENT_PENDING',
            changedBy: agencyId,
            changedType: 'AGENCY',
            remarks: `Agency rejected offer: ${rejectionReason || 'No reason provided'}`,
          },
        });

        await logAudit({
          action: 'AGENCY_REJECTED',
          entityType: 'AssignmentOffer',
          entityId: offerId,
          performedBy: agencyId,
          actorType: 'AGENCY',
          metadata: { reason: rejectionReason },
        });

        return { status: 'REJECTED_REASSIGNMENT_PENDING' };
      }
    });

    return { success: true, ...result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
