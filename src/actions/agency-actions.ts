'use server';

import { prisma } from '@/lib/db';
import { logAudit } from '@/lib/audit/audit-logger';
import { dispatchNotification } from '@/lib/notifications/notification-service';
import { assertWorkflowTransition } from '@/lib/booking/workflow-engine';

export async function recordSiteInspectionAction(
  bookingId: string,
  inspectorName: string,
  actualCondition: string,
  confirmedScope: string,
  beforePhotos: string[],
  notes?: string
) {
  try {
    if (!beforePhotos || beforePhotos.length === 0) {
      throw new Error('GOLDEN RULE 2 VIOLATION: NO INSPECTION = NO CLEANING. Before photos are mandatory for site inspection.');
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create or update SiteInspection
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

      // 2. Mark inspectionCompleted = true
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          inspectionCompleted: true, // Golden Rule 2 Satisfied!
          bookingStatus: 'INSPECTION_COMPLETED',
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          fromStatus: 'TEAM_ASSIGNED',
          toStatus: 'INSPECTION_COMPLETED',
          changedBy: inspectorName,
          changedType: 'AGENCY',
          remarks: `Site inspection completed. Condition: ${actualCondition}. ${beforePhotos.length} before photos captured.`,
        },
      });

      await logAudit({
        action: 'STATUS_TRANSITION',
        entityType: 'SiteInspection',
        entityId: inspection.id,
        performedBy: inspectorName,
        actorType: 'AGENCY',
        metadata: { actualCondition, confirmedScope },
      });

      return inspection;
    });

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

export async function startDeepCleaningAction(bookingId: string, performedBy: string) {
  try {
    // ENFORCE GOLDEN RULE 2: NO INSPECTION = NO CLEANING
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
          changedBy: performedBy,
          changedType: 'AGENCY',
          remarks: 'Deep cleaning started. Systematic sequence: Bedrooms -> Living -> Kitchen -> Bathrooms -> Windows -> Floors -> Addons',
        },
      });

      return b;
    });

    return { success: true, booking: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitQualityCheckAction(
  bookingId: string,
  supervisorName: string,
  checklist: {
    bedroomsChecked: boolean;
    livingChecked: boolean;
    kitchenChecked: boolean;
    bathroomsChecked: boolean;
    windowsChecked: boolean;
    floorsChecked: boolean;
    addonsChecked: boolean;
  },
  afterPhotos: string[],
  recleanedDetails?: string
) {
  try {
    if (!afterPhotos || afterPhotos.length === 0) {
      throw new Error('GOLDEN RULE 3 VIOLATION: NO QC = NO HANDOVER. After photos are mandatory for quality check pass.');
    }

    const result = await prisma.$transaction(async (tx) => {
      const qc = await tx.qualityCheck.upsert({
        where: { bookingId },
        create: {
          bookingId,
          supervisorName,
          ...checklist,
          afterPhotos: JSON.stringify(afterPhotos),
          passed: true,
          recleanedDetails,
        },
        update: {
          supervisorName,
          ...checklist,
          afterPhotos: JSON.stringify(afterPhotos),
          passed: true,
          recleanedDetails,
        },
      });

      // Mark qcPassed = true (Golden Rule 3 Satisfied!)
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
          remarks: `Quality check passed by supervisor ${supervisorName}. All areas verified with ${afterPhotos.length} after photos.`,
        },
      });

      await logAudit({
        action: 'SERVICE_COMPLETED',
        entityType: 'QualityCheck',
        entityId: qc.id,
        performedBy: supervisorName,
        actorType: 'AGENCY',
      });

      return qc;
    });

    dispatchNotification({
      event: 'HANDOVER_PENDING',
      title: 'Quality Check Passed — Ready for Customer Inspection',
      message: 'Supervisor quality check completed successfully. Property is ready for your handover inspection!',
    });

    return { success: true, qc: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
