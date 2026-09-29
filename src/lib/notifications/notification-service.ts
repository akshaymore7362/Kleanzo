import { prisma } from '@/lib/db';

export type NotificationEvent =
  | 'BOOKING_CREATED'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'BOOKING_CONFIRMED'
  | 'AGENCY_ASSIGNED'
  | 'AGENCY_ACCEPTED'
  | 'AGENCY_REJECTED'
  | 'OFFER_EXPIRED'
  | 'CREW_ASSIGNED'
  | 'CREW_ON_THE_WAY'
  | 'CREW_ARRIVED'
  | 'SERVICE_STARTED'
  | 'SERVICE_COMPLETED'
  | 'HANDOVER_PENDING'
  | 'REWORK_REQUESTED'
  | 'BOOKING_CLOSED'
  | 'REFUND_COMPLETED'
  | 'SETTLEMENT_COMPLETED'
  | 'CORRECTION_REQUIRED'
  | 'COMPLETION_SUBMITTED'
  | 'ADDITIONAL_WORK_REQUEST'
  | 'NO_AGENCY_AVAILABLE';

export type NotificationChannel = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH';

export interface DispatchNotificationParams {
  event: NotificationEvent;
  userId?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  channels?: NotificationChannel[];
}

export async function dispatchNotification(params: DispatchNotificationParams): Promise<void> {
  const channels = params.channels || ['EMAIL', 'SMS', 'WHATSAPP'];

  for (const channel of channels) {
    try {
      if (params.userId) {
        await prisma.notification.create({
          data: {
            userId: params.userId,
            title: params.title,
            message: params.message,
            type: params.event,
          },
        });
      }

      const recipient = channel === 'EMAIL' ? params.recipientEmail : params.recipientPhone;
      
      await prisma.notificationLog.create({
        data: {
          event: params.event,
          channel,
          recipient: recipient || params.userId || 'UNKNOWN',
          status: 'SENT',
          payload: JSON.stringify({ title: params.title, message: params.message, metadata: params.metadata }),
        },
      });

      console.log(`[NotificationEngine] Dispatched ${params.event} via ${channel} to ${recipient}`);
    } catch (err: any) {
      console.error(`[NotificationEngine] Channel ${channel} dispatch failed for ${params.event}:`, err?.message);
      try {
        await prisma.notificationLog.create({
          data: {
            event: params.event,
            channel,
            recipient: params.recipientEmail || params.recipientPhone || 'UNKNOWN',
            status: 'FAILED',
            payload: JSON.stringify({ error: err?.message || 'Unknown error' }),
          },
        });
      } catch (logErr) {
        // Ignore write failure
      }
    }
  }
}
