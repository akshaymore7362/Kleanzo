import { NextRequest, NextResponse } from 'next/server';
import { calculateBookingPricing } from '@/lib/pricing/pricing-engine';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, items, advanceAmount, userId } = body;

    // 1. Authoritative server-side price calculation
    const pricing = calculateBookingPricing(items || []);
    const payableAdvance = advanceAmount || pricing.advanceAmount;

    // Generate unique server payment order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_KleanzoMockKey123';

    // Record initial Payment record in DB if bookingId & userId are provided
    if (bookingId && userId) {
      await prisma.payment.create({
        data: {
          bookingId: bookingId,
          userId: userId,
          amount: pricing.totalAmount,
          advanceAmount: payableAdvance,
          balanceAmount: pricing.balanceAmount,
          razorpayOrderId: orderId,
          status: 'PAYMENT_PENDING',
        },
      });
    }

    return NextResponse.json({
      success: true,
      orderId,
      amount: payableAdvance * 100, // Amount in paise for Razorpay
      currency: 'INR',
      key: razorpayKeyId,
      pricing,
    });
  } catch (error: any) {
    console.error('[API Payment Order] Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
