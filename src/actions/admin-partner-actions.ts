'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { assertRole } from '@/lib/auth/rbac';
import { logAudit } from '@/lib/audit/audit-logger';

export interface GetPartnerApplicationsFilter {
  status?: string;
  search?: string;
}

export async function getAdminPartnerApplicationsAction(filter?: GetPartnerApplicationsFilter) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'FINANCE']);

    const statusFilter = filter?.status && filter.status !== 'ALL' ? filter.status : undefined;
    const search = filter?.search?.trim();

    const whereClause: any = {};
    if (statusFilter) {
      whereClause.partnerStatus = statusFilter;
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { ownerName: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
        { applicationCode: { contains: search } },
      ];
    }

    const [agencies, counts] = await Promise.all([
      prisma.agency.findMany({
        where: whereClause,
        orderBy: { updatedAt: 'desc' },
        include: {
          documents: true,
          serviceAreas: true,
          services: { include: { service: true } },
        },
      }),
      Promise.all([
        prisma.agency.count(),
        prisma.agency.count({ where: { partnerStatus: 'UNDER_REVIEW' } }),
        prisma.agency.count({ where: { partnerStatus: 'ACTION_REQUIRED' } }),
        prisma.agency.count({ where: { partnerStatus: 'ACTIVE' } }),
        prisma.agency.count({ where: { partnerStatus: 'SUSPENDED' } }),
        prisma.agency.count({ where: { partnerStatus: 'REJECTED' } }),
      ]),
    ]);

    const formattedApplications = agencies.map((a) => ({
      id: a.id,
      applicationCode: a.applicationCode || `KZ-PARTNER-${a.id.substring(0, 6).toUpperCase()}`,
      agencyName: a.name,
      ownerName: a.ownerName || 'N/A',
      phone: a.phone,
      email: a.email,
      city: a.city,
      partnerStatus: a.partnerStatus || 'DRAFT',
      verified: a.verified,
      active: a.active,
      teamsCount: a.teamsCount || 1,
      cleanerCount: a.cleanerCount || 4,
      serviceAreasCount: a.serviceAreas.length,
      documentsCount: a.documents.length,
      verifiedDocsCount: a.documents.filter((d) => d.status === 'VERIFIED').length,
      submittedAt: a.submittedAt || a.createdAt,
      updatedAt: a.updatedAt,
    }));

    return {
      success: true,
      applications: formattedApplications,
      counts: {
        total: counts[0],
        underReview: counts[1],
        actionRequired: counts[2],
        active: counts[3],
        suspended: counts[4],
        rejected: counts[5],
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch partner applications' };
  }
}

export async function getAdminPartnerDetailAction(agencyId: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'FINANCE']);

    const agency = await prisma.agency.findUnique({
      where: { id: agencyId },
      include: {
        documents: true,
        serviceAreas: true,
        services: { include: { service: true } },
        crewMembers: true,
        bookings: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!agency) throw new Error('Agency partner record not found');

    const auditLogs = await prisma.auditLog.findMany({
      where: { entityId: agencyId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      success: true,
      agency,
      auditLogs,
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch agency details' };
  }
}

export async function adminVerifyDocumentAction(
  documentId: string,
  status: 'VERIFIED' | 'REJECTED' | 'REUPLOAD_REQUIRED',
  rejectionReason?: string,
  adminRemarks?: string
) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS']);

    const doc = await prisma.partnerDocument.update({
      where: { id: documentId },
      data: {
        status,
        rejectionReason: rejectionReason || null,
        adminRemarks: adminRemarks || null,
        verifiedAt: new Date(),
        verifiedBy: user!.id,
      },
    });

    await logAudit({
      userId: user!.id,
      role: user!.role,
      action: 'ADMIN_CONFIG_CHANGED',
      entity: 'PartnerDocument',
      entityId: documentId,
      notes: `Admin verified document ${doc.documentType} as ${status}. Remarks: ${adminRemarks || 'N/A'}`,
    });

    return { success: true, document: doc };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update document verification status' };
  }
}

export async function getAgencyReadinessChecklistAction(agencyId: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'FINANCE']);

    const agency = await prisma.agency.findUnique({
      where: { id: agencyId },
      include: {
        documents: true,
        serviceAreas: true,
        services: true,
        crewMembers: true,
      },
    });

    if (!agency) throw new Error('Agency partner record not found');

    const businessInfo = Boolean(agency.name && agency.ownerName && agency.phone && agency.email);
    const services = agency.services.length > 0;
    const serviceArea = agency.serviceAreas.length > 0;
    const team = (agency.cleanerCount ? agency.cleanerCount >= 1 : false) || agency.crewMembers.length > 0;
    const documents = agency.documents.some((d) => d.status === 'VERIFIED' || d.status === 'PENDING');
    const bankDetails = Boolean(agency.bankAccountHolder && agency.bankAccountNumber && agency.bankIfscCode);
    const adminVerification = agency.verified || agency.partnerStatus === 'APPROVED' || agency.partnerStatus === 'ACTIVE';

    const items = [
      { key: 'businessInfo', label: 'Business & Owner Information', complete: businessInfo },
      { key: 'services', label: 'Cleaning Services & Rates', complete: services },
      { key: 'serviceArea', label: 'Service Areas & Pincodes', complete: serviceArea },
      { key: 'team', label: 'Team & Cleaner Capacity', complete: team },
      { key: 'documents', label: 'KYC & Business Documents', complete: documents },
      { key: 'bankDetails', label: 'Bank Account & Payout Info', complete: bankDetails },
      { key: 'adminVerification', label: 'Admin Verification Approval', complete: adminVerification },
    ];

    const isReadyForActivation = items.every((item) => item.complete);

    return {
      success: true,
      checklist: {
        items,
        isReadyForActivation,
      },
      agency,
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to calculate readiness checklist' };
  }
}

export async function adminApprovePartnerAction(agencyId: string, adminRemarks?: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN']);

    const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
    if (!agency) throw new Error('Agency not found');

    const previousStatus = agency.partnerStatus || 'SUBMITTED';

    const updatedAgency = await prisma.$transaction(async (tx) => {
      const res = await tx.agency.update({
        where: { id: agencyId },
        data: {
          partnerStatus: 'APPROVED',
          verified: true,
          approvedAt: new Date(),
          approvedBy: user!.id,
          adminRemarks: adminRemarks || 'Approved by Kleanzo Operations',
        },
      });

      await tx.agencyStatusHistory.create({
        data: {
          agencyId,
          fromStatus: previousStatus,
          toStatus: 'APPROVED',
          action: 'APPROVE',
          performedBy: user!.id,
          performedRole: user!.role,
          reason: adminRemarks || 'Verification passed and approved by Admin',
        },
      });

      return res;
    });

    if (updatedAgency.userId) {
      await prisma.notification.create({
        data: {
          userId: updatedAgency.userId,
          title: 'Partner Application Approved',
          message: 'Your Kleanzo Partner application has passed background verification (APPROVED). Admin activation will follow.',
          type: 'SUCCESS',
        },
      });
    }

    await logAudit({
      userId: user!.id,
      role: user!.role,
      action: 'ADMIN_CONFIG_CHANGED',
      entity: 'Agency',
      entityId: agencyId,
      notes: `Admin approved partner application ${updatedAgency.name}. Status: APPROVED.`,
    });

    return { success: true, agency: updatedAgency };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to approve partner agency' };
  }
}

export async function adminActivatePartnerAction(agencyId: string, adminRemarks?: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN']);

    const readiness = await getAgencyReadinessChecklistAction(agencyId);
    if (!readiness.success || !readiness.checklist?.isReadyForActivation) {
      throw new Error('Cannot activate agency: Required business, team, service area, or document details are incomplete');
    }

    const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
    if (!agency) throw new Error('Agency not found');

    const previousStatus = agency.partnerStatus || 'APPROVED';

    const updatedAgency = await prisma.$transaction(async (tx) => {
      const res = await tx.agency.update({
        where: { id: agencyId },
        data: {
          partnerStatus: 'ACTIVE',
          active: true,
          verified: true,
          adminRemarks: adminRemarks || 'Activated for live job dispatch',
        },
      });

      await tx.agencyStatusHistory.create({
        data: {
          agencyId,
          fromStatus: previousStatus,
          toStatus: 'ACTIVE',
          action: 'ACTIVATE',
          performedBy: user!.id,
          performedRole: user!.role,
          reason: adminRemarks || 'Activated for live operational job dispatch',
        },
      });

      return res;
    });

    if (updatedAgency.userId) {
      await prisma.notification.create({
        data: {
          userId: updatedAgency.userId,
          title: 'Partner Account Activated!',
          message: 'Your Kleanzo Partner account is now ACTIVE and eligible to receive live customer job requests.',
          type: 'SUCCESS',
        },
      });
    }

    await logAudit({
      userId: user!.id,
      role: user!.role,
      action: 'ADMIN_CONFIG_CHANGED',
      entity: 'Agency',
      entityId: agencyId,
      notes: `Admin activated agency ${updatedAgency.name}. Status: ACTIVE. Eligible for job matching.`,
    });

    return { success: true, agency: updatedAgency };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to activate partner agency' };
  }
}

export async function adminRequestChangesAction(agencyId: string, sectionKeys: string[], adminRemarks: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS']);

    if (!adminRemarks?.trim()) throw new Error('Admin feedback comment is required when requesting changes');

    const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
    if (!agency) throw new Error('Agency not found');

    const previousStatus = agency.partnerStatus || 'UNDER_REVIEW';

    const updatedAgency = await prisma.$transaction(async (tx) => {
      const res = await tx.agency.update({
        where: { id: agencyId },
        data: {
          partnerStatus: 'ACTION_REQUIRED',
          actionRequiredSections: JSON.stringify(sectionKeys || []),
          adminRemarks: adminRemarks.trim(),
        },
      });

      await tx.agencyStatusHistory.create({
        data: {
          agencyId,
          fromStatus: previousStatus,
          toStatus: 'ACTION_REQUIRED',
          action: 'REQUEST_CHANGES',
          performedBy: user!.id,
          performedRole: user!.role,
          reason: adminRemarks.trim(),
          sectionKeys: JSON.stringify(sectionKeys || []),
        },
      });

      return res;
    });

    if (updatedAgency.userId) {
      await prisma.notification.create({
        data: {
          userId: updatedAgency.userId,
          title: 'Action Required on Partner Application',
          message: `Kleanzo Operations requested updates on your application. Remark: ${adminRemarks}`,
          type: 'WARNING',
        },
      });
    }

    await logAudit({
      userId: user!.id,
      role: user!.role,
      action: 'ADMIN_CONFIG_CHANGED',
      entity: 'Agency',
      entityId: agencyId,
      notes: `Admin requested changes for agency ${updatedAgency.name}. Sections: ${sectionKeys.join(', ')}. Remark: ${adminRemarks}`,
    });

    return { success: true, agency: updatedAgency };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to request application changes' };
  }
}

export async function adminRejectPartnerAction(agencyId: string, rejectionReason: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN']);

    if (!rejectionReason?.trim()) throw new Error('Rejection reason is required');

    const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
    if (!agency) throw new Error('Agency not found');

    const previousStatus = agency.partnerStatus || 'UNDER_REVIEW';

    const updatedAgency = await prisma.$transaction(async (tx) => {
      const res = await tx.agency.update({
        where: { id: agencyId },
        data: {
          partnerStatus: 'REJECTED',
          active: false,
          verified: false,
          rejectedAt: new Date(),
          rejectedBy: user!.id,
          rejectionReason: rejectionReason.trim(),
        },
      });

      await tx.agencyStatusHistory.create({
        data: {
          agencyId,
          fromStatus: previousStatus,
          toStatus: 'REJECTED',
          action: 'REJECT',
          performedBy: user!.id,
          performedRole: user!.role,
          reason: rejectionReason.trim(),
        },
      });

      return res;
    });

    if (updatedAgency.userId) {
      await prisma.notification.create({
        data: {
          userId: updatedAgency.userId,
          title: 'Partner Application Decision',
          message: `Your Kleanzo Partner application was not approved. Reason: ${rejectionReason}`,
          type: 'ERROR',
        },
      });
    }

    await logAudit({
      userId: user!.id,
      role: user!.role,
      action: 'ADMIN_CONFIG_CHANGED',
      entity: 'Agency',
      entityId: agencyId,
      notes: `Admin rejected partner application ${updatedAgency.name}. Reason: ${rejectionReason}`,
    });

    return { success: true, agency: updatedAgency };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to reject partner application' };
  }
}

export async function adminTogglePartnerSuspensionAction(agencyId: string, suspend: boolean, reason?: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN']);

    const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
    if (!agency) throw new Error('Agency not found');

    const targetStatus = suspend ? 'SUSPENDED' : 'ACTIVE';
    const actionName = suspend ? 'SUSPEND' : 'ACTIVATE';
    const previousStatus = agency.partnerStatus || (suspend ? 'ACTIVE' : 'SUSPENDED');

    if (!suspend) {
      const readiness = await getAgencyReadinessChecklistAction(agencyId);
      if (!readiness.success || !readiness.checklist?.isReadyForActivation) {
        throw new Error('Cannot reactivate agency: Required onboarding information is incomplete');
      }
    }

    const updatedAgency = await prisma.$transaction(async (tx) => {
      const res = await tx.agency.update({
        where: { id: agencyId },
        data: {
          partnerStatus: targetStatus,
          active: !suspend,
        },
      });

      await tx.agencyStatusHistory.create({
        data: {
          agencyId,
          fromStatus: previousStatus,
          toStatus: targetStatus,
          action: actionName,
          performedBy: user!.id,
          performedRole: user!.role,
          reason: reason || (suspend ? 'Suspended by Operations Admin' : 'Reactivated by Operations Admin'),
        },
      });

      return res;
    });

    if (updatedAgency.userId) {
      await prisma.notification.create({
        data: {
          userId: updatedAgency.userId,
          title: suspend ? 'Partner Account Suspended' : 'Partner Account Reactivated',
          message: suspend
            ? `Your Kleanzo Partner account has been suspended. Reason: ${reason || 'Operational review'}`
            : 'Your Kleanzo Partner account has been reactivated for job dispatch.',
          type: suspend ? 'ERROR' : 'SUCCESS',
        },
      });
    }

    await logAudit({
      userId: user!.id,
      role: user!.role,
      action: 'ADMIN_CONFIG_CHANGED',
      entity: 'Agency',
      entityId: agencyId,
      notes: `Admin updated partner status for ${updatedAgency.name} to ${targetStatus}. Reason: ${reason || 'N/A'}`,
    });

    return { success: true, agency: updatedAgency };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update partner suspension status' };
  }
}

export async function getAgencyStatusHistoryAction(agencyId: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'AGENCY_ADMIN']);

    const history = await prisma.agencyStatusHistory.findMany({
      where: { agencyId },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, history };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch agency status history' };
  }
}
