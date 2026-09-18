import { prisma } from '@/lib/db';

export type AuditAction =
  | 'LOGIN'
  | 'LOGIN_SUCCESS'
  | 'REGISTER_CUSTOMER'
  | 'FORGOT_PASSWORD_REQUEST'
  | 'BOOKING_CREATED'
  | 'BOOKING_MODIFIED'
  | 'PAYMENT_COMPLETED'
  | 'REFUND_PROCESSED'
  | 'ASSIGNMENT_CREATED'
  | 'AGENCY_ACCEPTED'
  | 'AGENCY_REJECTED'
  | 'ASSIGNMENT_REASSIGNED'
  | 'CREW_ASSIGNED'
  | 'STATUS_TRANSITION'
  | 'PRICE_CHANGED'
  | 'QUOTE_CHANGED'
  | 'SERVICE_COMPLETED'
  | 'HANDOVER_APPROVED'
  | 'REWORK_REQUESTED'
  | 'SETTLEMENT_CREATED'
  | 'ADMIN_CONFIG_CHANGED';

export interface LogAuditParams {
  action: AuditAction;
  entityType?: string;
  entity?: string;
  entityId: string;
  userId?: string;
  role?: string;
  performedBy?: string;
  actorType?: string;
  ipAddress?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export async function logAudit(params: LogAuditParams): Promise<void> {
  try {
    const eType = params.entityType || params.entity || 'User';
    const notesStr = params.notes ? { notes: params.notes, ...params.metadata } : params.metadata;

    await prisma.auditLog.create({
      data: {
        actorType: params.actorType || params.role || 'USER',
        action: params.action,
        entityType: eType,
        entityId: params.entityId,
        actorId: params.userId,
        ipAddress: params.ipAddress,
        details: notesStr ? JSON.stringify(notesStr) : undefined,
      },
    });
  } catch (error) {
    console.error('[AuditLogger] Failed to write audit log:', error);
  }
}
