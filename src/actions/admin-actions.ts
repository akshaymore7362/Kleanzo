'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { assertRole } from '@/lib/auth/rbac';
import { logAudit } from '@/lib/audit/audit-logger';
import { dispatchNotification } from '@/lib/notifications/notification-service';

export async function getAdminRealDataAction() {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'FINANCE']);

    const [
      bookings,
      agencies,
      enquiries,
      auditLogs,
      enquiryCount,
      quoteCount,
      todayBookingCount,
      unassignedCount,
      inspectionPendingCount,
      cleaningInProgressCount,
      qcPendingCount,
      approvalPendingCount,
      payoutPendingCount,
    ] = await Promise.all([
      prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          customer: true,
          agency: true,
          items: true,
          addresses: true,
          assignments: {
            include: { agency: true },
            orderBy: { createdAt: 'desc' },
          },
          rejections: { include: { agency: true } },
          siteInspection: true,
          qualityCheck: true,
          partnerPayouts: true,
          additionalWorkRequests: true,
          crewAssignments: { include: { crewMember: true } },
        },
      }),
      prisma.agency.findMany({
        orderBy: { rating: 'desc' },
        include: {
          services: { include: { service: true } },
          serviceAreas: true,
          crewMembers: true,
          documents: true,
          _count: { select: { bookings: true } },
        },
      }),
      prisma.enquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 15,
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 15,
      }),
      prisma.enquiry.count({ where: { status: 'ENQUIRY_RECEIVED' } }),
      prisma.quote.count({ where: { status: 'QUOTE_CREATED' } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { bookingStatus: { in: ['ASSIGNMENT_PENDING', 'PARTNER_PENDING_ACCEPTANCE', 'AGENCY_REQUIRED'] } } }),
      prisma.booking.count({ where: { bookingStatus: 'INSPECTION_PENDING' } }),
      prisma.booking.count({ where: { bookingStatus: 'CLEANING_IN_PROGRESS' } }),
      prisma.booking.count({ where: { bookingStatus: 'VERIFICATION_PENDING' } }),
      prisma.booking.count({ where: { bookingStatus: 'CUSTOMER_APPROVAL_PENDING' } }),
      prisma.partnerPayout.count({ where: { status: 'PENDING' } }),
    ]);

    // Format real bookings into UI friendly records
    const formattedBookings = bookings.map((b) => {
      const item = b.items[0];
      const address = b.addresses[0];
      const assignedAgency = b.agency?.name || b.assignments[0]?.agency?.name || 'Unassigned';
      
      let statusLabel = 'Booked';
      let statusColor = 'bg-amber-100 text-amber-800';
      let stepNumber = 3;

      if (b.bookingStatus === 'AGENCY_REQUIRED') { statusLabel = 'Agency Required'; statusColor = 'bg-red-100 text-red-700'; stepNumber = 3; }
      else if (b.bookingStatus === 'PARTNER_PENDING_ACCEPTANCE') { statusLabel = 'Offer Sent'; statusColor = 'bg-yellow-100 text-yellow-800'; stepNumber = 3; }
      else if (b.bookingStatus === 'PARTNER_ACCEPTED' || b.bookingStatus === 'TEAM_ASSIGNED') { statusLabel = 'Assigned'; statusColor = 'bg-blue-100 text-blue-700'; stepNumber = 4; }
      else if (b.bookingStatus === 'INSPECTION_PENDING' || b.bookingStatus === 'INSPECTION_COMPLETED') { statusLabel = 'Inspection'; statusColor = 'bg-indigo-100 text-indigo-700'; stepNumber = 5; }
      else if (b.bookingStatus === 'CLEANING_IN_PROGRESS') { statusLabel = 'In Progress'; statusColor = 'bg-purple-100 text-purple-700'; stepNumber = 6; }
      else if (b.bookingStatus === 'VERIFICATION_PENDING' || b.bookingStatus === 'QC_PENDING') { statusLabel = 'Verification Pending'; statusColor = 'bg-cyan-100 text-cyan-800'; stepNumber = 7; }
      else if (b.bookingStatus === 'VERIFIED' || b.bookingStatus === 'COMPLETED' || b.bookingStatus === 'CLOSED') { statusLabel = 'Completed'; statusColor = 'bg-emerald-100 text-emerald-700'; stepNumber = 8; }

      return {
        id: b.bookingCode || b.id.substring(0, 8),
        realDbId: b.id,
        customer: b.customer?.name || 'Customer',
        customerPhone: b.customer?.phone || '',
        customerEmail: b.customer?.email || '',
        service: item?.serviceName || 'Deep Cleaning',
        property: `${b.propertyType || 'Apartment'} - ${address?.areaName || address?.city || 'Pune'}`,
        fullAddress: address ? `${address.fullAddress}, ${address.areaName}, ${address.city} (${address.pinCode})` : 'Site Address',
        scheduledDate: b.scheduledDate,
        scheduledTime: b.scheduledTime,
        datetime: `${b.scheduledDate} (${b.scheduledTime})`,
        partner: assignedAgency,
        agencyId: b.agencyId,
        status: statusLabel,
        statusColor,
        stepNumber,
        paymentStatus: b.paymentStatus,
        totalAmount: b.totalAmount,
        advanceAmount: b.advanceAmount,
        balanceAmount: b.balanceAmount,
        partnerPayout: b.partnerPayout || Math.round(b.totalAmount * 0.70),
        bookingStatusRaw: b.bookingStatus,
        assignmentMode: b.assignmentMode,
        completionProof: b.completionProof,
        completionNotes: b.completionNotes,
        verificationStatus: b.verificationStatus,
        hasQualityCheck: !!b.qualityCheck,
        crewMembers: b.crewAssignments.map(c => ({ name: c.crewMember.name, role: c.roleOnJob })),
        additionalWorkCount: b.additionalWorkRequests.length,
      };
    });

    return {
      success: true,
      realData: {
        bookings: formattedBookings,
        agencies: agencies.map((a) => ({
          id: a.id,
          name: a.name,
          ownerName: a.ownerName,
          phone: a.phone,
          email: a.email,
          city: a.city,
          jobsCount: a._count.bookings || a.completedJobsCount || 0,
          rating: `${a.rating || 4.8} ⭐`,
          status: a.partnerStatus || 'ACTIVE',
          active: a.active,
          serviceRadiusKm: a.serviceRadiusKm,
          crewCount: a.crewMembers.length,
          supportedServices: a.services.map(s => s.service.name),
        })),
        enquiries: enquiries.map((e) => ({
          id: e.enquiryCode || e.id.substring(0, 8),
          customerName: e.customerName,
          phone: e.customerPhone,
          service: e.propertyType,
          city: e.city,
          status: e.status,
          date: new Date(e.createdAt).toLocaleDateString(),
        })),
        auditLogs: auditLogs.map((l) => ({
          action: l.action,
          entity: l.entityType,
          actor: l.actorType,
          notes: l.details ? (typeof l.details === 'string' && l.details.startsWith('{') ? JSON.parse(l.details).notes || l.details : l.details) : 'System action logged',
          time: new Date(l.createdAt).toLocaleTimeString(),
        })),
        stats: {
          enquiryCount,
          quoteCount,
          todayBookingCount,
          unassignedCount,
          inspectionPendingCount,
          cleaningInProgressCount,
          qcPendingCount,
          approvalPendingCount,
          payoutPendingCount,
        },
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch real application data' };
  }
}

/**
 * Admin verifies agency completion proof (APPROVE or REQUEST CORRECTION).
 */
export async function verifyBookingCompletionAdminAction(
  bookingId: string,
  decision: 'APPROVE' | 'REQUEST_CORRECTION',
  correctionNotes?: string
) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS']);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { agency: true, job: true },
    });

    if (!booking) throw new Error('Booking not found');

    const now = new Date();

    if (decision === 'APPROVE') {
      const partnerPayoutAmt = booking.partnerPayout || Math.round(booking.totalAmount * 0.70);
      const kleanzoRetainedAmt = booking.totalAmount - partnerPayoutAmt;

      const result = await prisma.$transaction(async (tx) => {
        const updatedBooking = await tx.booking.update({
          where: { id: bookingId },
          data: {
            bookingStatus: 'COMPLETED',
            verificationStatus: 'APPROVED',
            verifiedBy: user!.id,
            verifiedAt: now,
            customerApproved: true,
            partnerPayout: partnerPayoutAmt,
            kleanzoRetained: kleanzoRetainedAmt,
          },
        });

        // Create PartnerPayout record marked ELIGIBLE
        if (booking.agencyId) {
          let job = await tx.job.findUnique({ where: { bookingId } });
          if (!job) {
            const jobCount = await tx.job.count();
            job = await tx.job.create({
              data: {
                jobCode: `JOB-${1000 + jobCount + Math.floor(Math.random() * 9000)}`,
                bookingId,
                agencyId: booking.agencyId,
                scheduledDate: booking.scheduledDate,
                scheduledTime: booking.scheduledTime,
                status: 'COMPLETED',
                partnerPayout: partnerPayoutAmt,
              },
            });
          }

          const payoutCount = await tx.partnerPayout.count();
          await tx.partnerPayout.upsert({
            where: { jobId: job.id },
            create: {
              payoutNo: `PO-${1000 + payoutCount + Math.floor(Math.random() * 9000)}`,
              jobId: job.id,
              bookingId,
              agencyId: booking.agencyId,
              customerPrice: booking.totalAmount,
              partnerPayout: partnerPayoutAmt,
              kleanzoRetained: kleanzoRetainedAmt,
              status: 'ELIGIBLE',
            },
            update: {
              status: 'ELIGIBLE',
              customerPrice: booking.totalAmount,
              partnerPayout: partnerPayoutAmt,
              kleanzoRetained: kleanzoRetainedAmt,
            },
          });
        }

        await tx.bookingStatusHistory.create({
          data: {
            bookingId,
            fromStatus: booking.bookingStatus,
            toStatus: 'COMPLETED',
            changedBy: user!.id,
            changedType: 'OPERATIONS',
            remarks: 'Admin verified work completion and approved booking.',
          },
        });

        await logAudit({
          action: 'COMPLETION_VERIFIED',
          entityType: 'Booking',
          entityId: bookingId,
          performedBy: user!.id,
          actorType: 'OPERATIONS',
          metadata: { decision: 'APPROVE', partnerPayoutAmt },
        }, tx);

        return updatedBooking;
      }, { timeout: 20000 });

      dispatchNotification({
        event: 'SERVICE_COMPLETED',
        title: 'Booking Service Completed & Verified',
        message: `Your Kleanzo service for booking #${booking.bookingCode} is verified and complete! Thank you for choosing Kleanzo.`,
      });

      return { success: true, booking: result, message: 'Completion approved. Booking marked COMPLETED and partner payout is ELIGIBLE.' };
    } else {
      // Request Correction
      if (!correctionNotes || correctionNotes.trim().length === 0) {
        throw new Error('Correction notes are required when requesting correction.');
      }

      const result = await prisma.$transaction(async (tx) => {
        const updatedBooking = await tx.booking.update({
          where: { id: bookingId },
          data: {
            bookingStatus: 'CORRECTION_REQUIRED',
            verificationStatus: 'CORRECTION_REQUIRED',
            correctionNotes,
          },
        });

        await tx.bookingStatusHistory.create({
          data: {
            bookingId,
            fromStatus: booking.bookingStatus,
            toStatus: 'CORRECTION_REQUIRED',
            changedBy: user!.id,
            changedType: 'OPERATIONS',
            remarks: `Admin requested correction: ${correctionNotes}`,
          },
        });

        await logAudit({
          action: 'CORRECTION_REQUESTED',
          entityType: 'Booking',
          entityId: bookingId,
          performedBy: user!.id,
          actorType: 'OPERATIONS',
          metadata: { correctionNotes },
        }, tx);

        return updatedBooking;
      }, { timeout: 20000 });

      dispatchNotification({
        event: 'CORRECTION_REQUIRED',
        title: 'Correction Requested for Booking',
        message: `Admin requested correction for booking #${booking.bookingCode}: ${correctionNotes}`,
      });

      return { success: true, booking: result, message: 'Correction requested from agency.' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Admin reviews additional work request submitted by agency.
 */
export async function reviewAdditionalWorkRequestAdminAction(
  requestId: string,
  decision: 'APPROVE' | 'REJECT',
  adminNotes?: string
) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS']);

    const req = await prisma.additionalWorkRequest.findUnique({
      where: { id: requestId },
      include: { booking: true },
    });

    if (!req) throw new Error('Additional work request not found');

    const now = new Date();

    if (decision === 'APPROVE') {
      await prisma.$transaction(async (tx) => {
        await tx.additionalWorkRequest.update({
          where: { id: requestId },
          data: {
            status: 'APPROVED',
            adminNotes,
            reviewedBy: user!.id,
            reviewedAt: now,
          },
        });

        // Update Booking financial breakdown
        await tx.booking.update({
          where: { id: req.bookingId },
          data: {
            totalAmount: { increment: req.requestedAmount },
            balanceAmount: { increment: req.requestedAmount },
          },
        });

        await logAudit({
          action: 'ADDITIONAL_WORK_APPROVED',
          entityType: 'AdditionalWorkRequest',
          entityId: requestId,
          performedBy: user!.id,
          actorType: 'OPERATIONS',
          metadata: { amount: req.requestedAmount },
        }, tx);
      }, { timeout: 20000 });

      return { success: true, message: `Additional work of ₹${req.requestedAmount} approved.` };
    } else {
      await prisma.additionalWorkRequest.update({
        where: { id: requestId },
        data: {
          status: 'REJECTED',
          adminNotes,
          reviewedBy: user!.id,
          reviewedAt: now,
        },
      });

      return { success: true, message: 'Additional work request rejected.' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Admin updates agency status (APPROVED, ACTIVE, SUSPENDED, REJECTED).
 */
export async function togglePartnerStatusAction(agencyId: string, newStatus: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN']);

    const activeBool = newStatus === 'APPROVED' || newStatus === 'ACTIVE';

    const agency = await prisma.agency.update({
      where: { id: agencyId },
      data: {
        partnerStatus: newStatus,
        active: activeBool,
      },
    });

    await logAudit({
      userId: user?.id,
      role: user?.role,
      action: 'ADMIN_CONFIG_CHANGED',
      entity: 'Agency',
      entityId: agencyId,
      notes: `Admin changed partner agency status to ${newStatus}`,
    });

    return { success: true, agency };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update partner status' };
  }
}

/**
 * Process Partner Payout (change status from ELIGIBLE/PENDING to PAID with reference).
 */
export async function processPartnerPayoutAdminAction(payoutId: string, referenceNumber: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'FINANCE']);

    const payout = await prisma.partnerPayout.update({
      where: { id: payoutId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        transactionRef: referenceNumber,
      },
    });

    await logAudit({
      userId: user?.id,
      role: user?.role,
      action: 'SETTLEMENT_CREATED',
      entity: 'PartnerPayout',
      entityId: payoutId,
      notes: `Partner payout processed and marked PAID with reference ${referenceNumber}`,
    });

    return { success: true, payout };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to process partner payout' };
  }
}

export async function reassignJobPartnerAction(bookingId: string, partnerId: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS']);

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        bookingStatus: 'PARTNER_PENDING_ACCEPTANCE',
        agencyId: partnerId,
        assignedAgencyId: partnerId,
        assignedAt: new Date(),
        assignmentMode: 'ADMIN',
        assignments: {
          create: {
            agencyId: partnerId,
            assignedBy: user?.id || 'SYSTEM_ADMIN',
            status: 'OFFER_SENT',
            offerExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        },
      },
    });

    await logAudit({
      userId: user?.id,
      role: user?.role,
      action: 'ASSIGNMENT_REASSIGNED',
      entity: 'Booking',
      entityId: bookingId,
      notes: `Job reassigned to partner agency ${partnerId}`,
    });

    return { success: true, booking };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to reassign job partner' };
  }
}

