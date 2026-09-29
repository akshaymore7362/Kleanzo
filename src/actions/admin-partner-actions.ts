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

export async function adminApprovePartnerAction(agencyId: string, adminRemarks?: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN']);

    const agency = await prisma.agency.update({
      where: { id: agencyId },
      data: {
        partnerStatus: 'ACTIVE',
        verified: true,
        active: true,
        approvedAt: new Date(),
        approvedBy: user!.id,
        adminRemarks: adminRemarks || 'Approved by Kleanzo Admin',
      },
    });

    if (agency.userId) {
      await prisma.notification.create({
        data: {
          userId: agency.userId,
          title: 'Partner Account Approved!',
          message: 'Your Kleanzo Partner application has been approved. Your account is now active and eligible to receive job offers.',
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
      notes: `Admin approved agency ${agency.name} (Code: ${agency.applicationCode}) as ACTIVE fulfillment partner.`,
    });

    return { success: true, agency };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to approve partner agency' };
  }
}

export async function adminRequestChangesAction(agencyId: string, sectionKeys: string[], adminRemarks: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS']);

    if (!adminRemarks?.trim()) throw new Error('Admin feedback comment is required when requesting changes');

    const agency = await prisma.agency.update({
      where: { id: agencyId },
      data: {
        partnerStatus: 'ACTION_REQUIRED',
        actionRequiredSections: JSON.stringify(sectionKeys || []),
        adminRemarks: adminRemarks.trim(),
      },
    });

    if (agency.userId) {
      await prisma.notification.create({
        data: {
          userId: agency.userId,
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
      notes: `Admin requested changes for agency ${agency.name}. Sections: ${sectionKeys.join(', ')}. Remark: ${adminRemarks}`,
    });

    return { success: true, agency };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to request application changes' };
  }
}

export async function adminRejectPartnerAction(agencyId: string, rejectionReason: string) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN']);

    if (!rejectionReason?.trim()) throw new Error('Rejection reason is required');

    const agency = await prisma.agency.update({
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

    if (agency.userId) {
      await prisma.notification.create({
        data: {
          userId: agency.userId,
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
      notes: `Admin rejected partner application ${agency.name}. Reason: ${rejectionReason}`,
    });

    return { success: true, agency };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to reject partner application' };
  }
}

export async function adminTogglePartnerSuspensionAction(agencyId: string, suspend: boolean) {
  try {
    const user = await getCurrentUser();
    assertRole(user, ['ADMIN', 'SUPER_ADMIN']);

    const targetStatus = suspend ? 'SUSPENDED' : 'ACTIVE';

    const agency = await prisma.agency.update({
      where: { id: agencyId },
      data: {
        partnerStatus: targetStatus,
        active: !suspend,
      },
    });

    await logAudit({
      userId: user!.id,
      role: user!.role,
      action: 'ADMIN_CONFIG_CHANGED',
      entity: 'Agency',
      entityId: agencyId,
      notes: `Admin updated partner status for ${agency.name} to ${targetStatus}`,
    });

    return { success: true, agency };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update partner suspension status' };
  }
}
