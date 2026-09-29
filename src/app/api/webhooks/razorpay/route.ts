import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { dispatchNotification } from '@/lib/notifications/notification-service';
import { logAudit } from '@/lib/audit/audit-logger';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'whsec_kleanzo_secret_key_123';

    // 1. Verify Webhook Signature
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(bodyText)
      .digest('hex');

    if (signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      console.error('[Razorpay Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(bodyText);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;

    if (!paymentEntity) {
      return NextResponse.json({ status: 'ignored_no_entity' });
    }

    const razorpayPaymentId = paymentEntity.id;
    const razorpayOrderId = paymentEntity.order_id;

    // 2. Idempotency Check (Prevent duplicate webhook processing)
    const existingPayment = await prisma.payment.findFirst({
      where: { razorpayPaymentId: razorpayPaymentId },
    });

    if (existingPayment) {
      console.log(`[Razorpay Webhook] Duplicate event ignored for tx: ${razorpayPaymentId}`);
      return NextResponse.json({ status: 'already_processed' });
    }

    // 3. Database Transaction: Process payment & update booking state safely
    if (event === 'payment.captured' || event === 'order.paid') {
      await prisma.$transaction(async (tx) => {
        // Find corresponding Payment
        const paymentRecord = await tx.payment.findFirst({
          where: { razorpayOrderId: razorpayOrderId },
        });

        if (paymentRecord) {
          // Record transaction
          await tx.paymentTransaction.create({
            data: {
              paymentId: paymentRecord.id,
              type: 'ADVANCE',
              amount: paymentEntity.amount / 100,
              status: 'SUCCESS',
              rawResponse: JSON.stringify(payload),
            },
          });

          // Mark payment success
          await tx.payment.update({
            where: { id: paymentRecord.id },
            data: {
              status: 'PAYMENT_SUCCESS',
              razorpayPaymentId: razorpayPaymentId,
              verifiedAt: new Date(),
            },
          });

          // Verified advance payment unlocks partner assignment.
          if (paymentRecord.bookingId) {
            await tx.booking.update({
              where: { id: paymentRecord.bookingId },
              data: {
                bookingStatus: 'ASSIGNMENT_PENDING',
                paymentStatus: 'PAYMENT_SUCCESS',
              },
            });

            await tx.bookingStatusHistory.create({
              data: {
                bookingId: paymentRecord.bookingId,
                fromStatus: 'BOOKING_PENDING_ADVANCE',
                toStatus: 'ASSIGNMENT_PENDING',
                changedBy: 'RAZORPAY_WEBHOOK',
                changedType: 'SYSTEM',
                remarks: `Payment captured: ${razorpayPaymentId}. Transitioned to ASSIGNMENT_PENDING`,
              },
            });

            await logAudit({
              action: 'PAYMENT_COMPLETED',
              entityType: 'Booking',
              entityId: paymentRecord.bookingId,
              performedBy: 'RAZORPAY_WEBHOOK',
              actorType: 'SYSTEM',
              metadata: { razorpayPaymentId, razorpayOrderId },
            });
          }
        }
      });

      // Send confirmation notifications asynchronously
      dispatchNotification({
        event: 'PAYMENT_SUCCESS',
        title: 'Payment Received & Booking Confirmed',
        message: `Your advance payment for booking ${razorpayOrderId} was successfully processed.`,
      });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error: unknown) {
    console.error('[Razorpay Webhook Error]:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Webhook processing failed' }, { status: 500 });
  }
}
