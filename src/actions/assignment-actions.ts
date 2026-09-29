'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { assertRole } from '@/lib/auth/rbac';
import { runAgencyMatchingEngine } from '@/lib/matching/agency-matching';
import { logAudit } from '@/lib/audit/audit-logger';
import { dispatchNotification } from '@/lib/notifications/notification-service';

/**
 * Finds eligible agencies sorted by suitability and distance for a given booking.
 */
export async function findMatchingAgenciesAction(bookingId: string) {
  try {
    const user = await getCurrentUser();
    if (user) {
      assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS']);
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        items: true,
        addresses: true,
        rejections: true,
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
      lat: firstAddress?.lat ?? undefined,
      lng: firstAddress?.lng ?? undefined,
      scheduledDate: booking.scheduledDate,
      timeSlot: booking.scheduledTime,
      services: booking.items.map(i => ({
        serviceSlug: i.serviceName.toLowerCase().replace(/\s+/g, '-'),
        quantity: i.quantity,
      })),
    };

    const rankedAgencies = await runAgencyMatchingEngine(requirement);
    
    // Mark agencies that have previously rejected this booking
    const rejectedAgencyIds = new Set(booking.rejections.map(r => r.agencyId));
    const processedAgencies = rankedAgencies.map(r => ({
      ...r,
      hasPreviouslyRejected: rejectedAgencyIds.has(r.agency.id),
      eligible: r.eligible && !rejectedAgencyIds.has(r.agency.id),
      eligibilityReasons: rejectedAgencyIds.has(r.agency.id)
        ? [...r.eligibilityReasons, 'Previously declined this booking']
        : r.eligibilityReasons,
    }));

    return { success: true, rankedAgencies: processedAgencies };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Triggers Automatic Matching Engine for a booking.
 * Picks the nearest eligible agency, assigns it, and sends offer.
 * If no eligible agency is found, marks booking as AGENCY_REQUIRED and alerts Admin.
 */
export async function runAutomaticAssignmentAction(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        items: true,
        addresses: true,
        rejections: true,
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    const rejectedAgencyIds = new Set(booking.rejections.map(r => r.agencyId));
    const firstAddress = booking.addresses[0];
    const requirement = {
      bookingId: booking.id,
      city: firstAddress?.city || 'Pune',
      area: firstAddress?.areaName,
      lat: firstAddress?.lat ?? undefined,
      lng: firstAddress?.lng ?? undefined,
      scheduledDate: booking.scheduledDate,
      timeSlot: booking.scheduledTime,
      services: booking.items.map(i => ({
        serviceSlug: i.serviceName.toLowerCase().replace(/\s+/g, '-'),
        quantity: i.quantity,
      })),
    };

    const ranked = await runAgencyMatchingEngine(requirement);
    
    // Filter eligible agencies excluding previous rejecters
    const eligibleCandidate = ranked.find(
      r => r.eligible && !rejectedAgencyIds.has(r.agency.id)
    );

    if (!eligibleCandidate) {
      // No eligible agency found -> Fallback to Admin
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          bookingStatus: 'AGENCY_REQUIRED',
          assignmentMode: 'AUTOMATIC',
          assignmentReason: 'NO_ELIGIBLE_AGENCY_AVAILABLE',
        },
      });

      await prisma.bookingStatusHistory.create({
        data: {
          bookingId,
          fromStatus: booking.bookingStatus,
          toStatus: 'AGENCY_REQUIRED',
          changedBy: 'SYSTEM_MATCHING_ENGINE',
          changedType: 'SYSTEM',
          remarks: 'Automatic matching found no eligible agency. Admin manual assignment required.',
        },
      });

      dispatchNotification({
        event: 'NO_AGENCY_AVAILABLE',
        title: 'Admin Alert: No Agency Available',
        message: `Booking #${booking.bookingCode} requires manual admin agency assignment.`,
      });

      return {
        success: true,
        assigned: false,
        status: 'AGENCY_REQUIRED',
        message: 'No eligible agency available. Alerted Admin for manual assignment.',
      };
    }

    // Auto-assign nearest eligible candidate
    const selectedAgency = eligibleCandidate.agency;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min offer window

    const result = await prisma.$transaction(async (tx) => {
      const assignment = await tx.assignment.create({
        data: {
          bookingId,
          agencyId: selectedAgency.id,
          assignedBy: 'SYSTEM_AUTOMATIC_MATCHING',
          assignmentMode: 'AUTOMATIC',
          assignmentReason: 'NEAREST_ELIGIBLE_AGENCY',
          status: 'OFFER_SENT',
          offerExpiresAt: expiresAt,
        },
      });

      const offer = await tx.assignmentOffer.create({
        data: {
          assignmentId: assignment.id,
          bookingId,
          agencyId: selectedAgency.id,
          matchScore: eligibleCandidate.matchScore,
          expiresAt,
        },
      });

      await tx.booking.update({
        where: { id: bookingId },
        data: {
          bookingStatus: 'PARTNER_PENDING_ACCEPTANCE',
          agencyId: selectedAgency.id,
          assignedAgencyId: selectedAgency.id,
          assignedAt: new Date(),
          assignedBy: 'SYSTEM_AUTOMATIC_MATCHING',
          assignmentMode: 'AUTOMATIC',
          assignmentReason: 'NEAREST_ELIGIBLE_AGENCY',
          agencyResponseStatus: 'PENDING',
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          fromStatus: booking.bookingStatus,
          toStatus: 'PARTNER_PENDING_ACCEPTANCE',
          changedBy: 'SYSTEM_AUTOMATIC_MATCHING',
          changedType: 'SYSTEM',
          remarks: `Automatic assignment sent offer to nearest eligible agency: ${selectedAgency.name} (${eligibleCandidate.distanceKm} KM)`,
        },
      });

      return { assignment, offer };
    }, { timeout: 20000 });

    dispatchNotification({
      event: 'AGENCY_ASSIGNED',
      title: 'New Job Offer Received',
      message: `New Kleanzo booking #${booking.bookingCode} assigned. Please accept or decline in your Agency Portal.`,
    });

    return {
      success: true,
      assigned: true,
      agencyId: selectedAgency.id,
      agencyName: selectedAgency.name,
      distanceKm: eligibleCandidate.distanceKm,
      status: 'PARTNER_PENDING_ACCEPTANCE',
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Admin manual agency assignment override.
 */
export async function adminManualAssignAgencyAction(bookingId: string, agencyId: string, remarks?: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS']);

    const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
    if (!agency) throw new Error('Target agency not found');
    if (!agency.active) throw new Error('Target agency is inactive or suspended');

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error('Booking not found');

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 mins for manual admin offer

    const result = await prisma.$transaction(async (tx) => {
      const assignment = await tx.assignment.create({
        data: {
          bookingId,
          agencyId,
          assignedBy: user!.id,
          assignmentMode: 'ADMIN',
          assignmentReason: remarks || 'ADMIN_MANUAL_ASSIGNMENT',
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
        data: {
          bookingStatus: 'PARTNER_PENDING_ACCEPTANCE',
          agencyId,
          assignedAgencyId: agencyId,
          assignedAt: new Date(),
          assignedBy: user!.id,
          assignmentMode: 'ADMIN',
          assignmentReason: remarks || 'ADMIN_MANUAL_ASSIGNMENT',
          agencyResponseStatus: 'PENDING',
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          fromStatus: booking.bookingStatus,
          toStatus: 'PARTNER_PENDING_ACCEPTANCE',
          changedBy: user!.id,
          changedType: 'OPERATIONS',
          remarks: `Admin manually assigned agency: ${agency.name}. ${remarks || ''}`,
        },
      });

      await logAudit({
        action: 'ADMIN_MANUAL_ASSIGNMENT',
        entityType: 'Booking',
        entityId: bookingId,
        performedBy: user!.id,
        actorType: 'OPERATIONS',
        metadata: { agencyId, agencyName: agency.name },
      }, tx);

      return { assignment, offer };
    }, { timeout: 20000 });

    dispatchNotification({
      event: 'AGENCY_ASSIGNED',
      title: 'New Admin Assigned Job',
      message: `Admin assigned new Kleanzo booking #${booking.bookingCode} to your agency. Please review in dashboard.`,
    });

    return { success: true, ...result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Agency responds to job offer (ACCEPT or REJECT).
 * If rejected, automatically triggers next eligible agency!
 */
export async function respondToAssignmentOfferAction(
  offerId: string,
  agencyId: string,
  response: 'ACCEPTED' | 'REJECTED',
  rejectionReason?: string
) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO']);

    if (user?.agencyId && user.agencyId !== agencyId) {
      throw new Error('Forbidden: Assignment offer does not belong to the current agency');
    }

    const offer = await prisma.assignmentOffer.findUnique({
      where: { id: offerId },
      include: { assignment: true, booking: true },
    });

    if (!offer) throw new Error('Assignment offer not found');
    if (offer.agencyId !== agencyId) throw new Error('Unauthorized: Offer does not belong to this agency');

    const now = new Date();
    const bookingId = offer.bookingId;

    if (response === 'ACCEPTED') {
      await prisma.$transaction(async (tx) => {
        await tx.assignmentOffer.update({
          where: { id: offerId },
          data: { response: 'ACCEPTED', respondedAt: now },
        });

        await tx.assignment.update({
          where: { id: offer.assignmentId },
          data: { status: 'ACCEPTED', acceptedAt: now },
        });

        await tx.booking.update({
          where: { id: bookingId },
          data: {
            bookingStatus: 'PARTNER_ACCEPTED',
            agencyResponseStatus: 'ACCEPTED',
            agencyRespondedAt: now,
          },
        });

        await tx.bookingStatusHistory.create({
          data: {
            bookingId,
            fromStatus: 'PARTNER_PENDING_ACCEPTANCE',
            toStatus: 'PARTNER_ACCEPTED',
            changedBy: user!.id,
            changedType: 'AGENCY',
            remarks: 'Agency accepted job offer.',
          },
        });

        await logAudit({
          action: 'AGENCY_ACCEPTED',
          entityType: 'AssignmentOffer',
          entityId: offerId,
          performedBy: user!.id,
          actorType: 'AGENCY',
        }, tx);
      }, { timeout: 20000 });

      return { success: true, status: 'PARTNER_ACCEPTED', message: 'Job successfully accepted.' };
    } else {
      // Rejection Workflow
      await prisma.$transaction(async (tx) => {
        await tx.assignmentOffer.update({
          where: { id: offerId },
          data: { response: 'REJECTED', respondedAt: now },
        });

        await tx.assignment.update({
          where: { id: offer.assignmentId },
          data: { status: 'REJECTED', rejectedAt: now },
        });

        await tx.assignmentRejection.create({
          data: {
            assignmentId: offer.assignmentId,
            bookingId,
            agencyId,
            reason: rejectionReason || 'Schedule conflict / Capacity unavailable',
            rejectedBy: user!.id,
          },
        });

        await tx.booking.update({
          where: { id: bookingId },
          data: {
            bookingStatus: 'ASSIGNMENT_PENDING',
            agencyId: null,
            agencyResponseStatus: 'REJECTED',
            agencyRespondedAt: now,
            agencyRejectionReason: rejectionReason || 'Capacity unavailable',
          },
        });

        await tx.bookingStatusHistory.create({
          data: {
            bookingId,
            fromStatus: 'PARTNER_PENDING_ACCEPTANCE',
            toStatus: 'ASSIGNMENT_PENDING',
            changedBy: user!.id,
            changedType: 'AGENCY',
            remarks: `Agency rejected offer. Reason: ${rejectionReason || 'Not specified'}`,
          },
        });

        await logAudit({
          action: 'AGENCY_REJECTED',
          entityType: 'AssignmentOffer',
          entityId: offerId,
          performedBy: user!.id,
          actorType: 'AGENCY',
          metadata: { reason: rejectionReason },
        }, tx);
      }, { timeout: 20000 });

      // Automatically trigger matching for NEXT eligible agency!
      const nextMatchingResult = await runAutomaticAssignmentAction(bookingId);

      return {
        success: true,
        status: 'REJECTED_REASSIGNING',
        message: 'Offer declined. Next suitable agency is being assigned automatically.',
        nextAssignment: nextMatchingResult,
      };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Gets assignment and rejection history for a booking.
 */
export async function getAssignmentHistoryAction(bookingId: string) {
  try {
    const user = await getCurrentUser();
    if (user) {
      assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'AGENCY_ADMIN']);
    }

    const assignments = await prisma.assignment.findMany({
      where: { bookingId },
      include: {
        agency: { select: { id: true, name: true, phone: true } },
        rejections: true,
        offers: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, assignments };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
