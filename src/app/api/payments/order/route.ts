import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { assertRole } from '@/lib/auth/rbac';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    const body = await req.json();
    const bookingId = typeof body.bookingId === 'string' ? body.bookingId : '';
    if (!bookingId) {
      return NextResponse.json({ success: false, message: 'bookingId is required' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    // If user session exists, verify access permissions
    if (user) {
      const isOperationsUser = ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'FINANCE'].includes(user.role);
      if (!isOperationsUser && user.role === 'CUSTOMER' && booking.customerId !== user.id) {
        return NextResponse.json({ success: false, message: 'Forbidden: Booking ownership mismatch' }, { status: 403 });
      }
    }

    if (booking.paymentStatus !== 'PENDING_ADVANCE') {
      return NextResponse.json({ success: false, message: 'Advance payment is not pending' }, { status: 409 });
    }

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_KleanzoDemoKey';
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_KleanzoDemoSecret';

    let orderId = `order_demo_${booking.bookingCode}_${Date.now().toString().slice(-6)}`;
    let amount = Math.round(booking.advanceAmount * 100);
    let currency = 'INR';

    // Call live Razorpay API if production/valid keys are present
    const isLiveKeysConfigured =
      process.env.RAZORPAY_KEY_ID &&
      process.env.RAZORPAY_KEY_SECRET &&
      !process.env.RAZORPAY_KEY_ID.includes('KleanzoKeyId');

    if (isLiveKeysConfigured) {
      try {
        const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency,
            receipt: booking.bookingCode,
          }),
        });

        if (razorpayResponse.ok) {
          const razorpayOrder = (await razorpayResponse.json()) as { id: string; amount: number; currency: string };
          orderId = razorpayOrder.id;
          amount = razorpayOrder.amount;
          currency = razorpayOrder.currency;
        }
      } catch (e) {
        console.warn('[API Payment Order] Razorpay API call failed, using demo test order:', e);
      }
    }

    // Record payment order in database
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        userId: booking.customerId,
        amount: booking.totalAmount,
        advanceAmount: booking.advanceAmount,
        balanceAmount: booking.balanceAmount,
        razorpayOrderId: orderId,
        status: 'PAYMENT_PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      orderId,
      amount,
      currency,
      key: razorpayKeyId,
    });
  } catch (error: unknown) {
    console.error('[API Payment Order] Error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
