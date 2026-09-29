'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import CustomerBookingClientView from './CustomerBookingClientView';
import { notFound } from 'next/navigation';

export default async function CustomerBookingPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const currentUser = await getCurrentUser();

  const booking = await prisma.booking.findFirst({
    where: {
      OR: [
        { id },
        { bookingCode: id },
      ],
    },
    include: {
      customer: { select: { id: true, name: true, phone: true, email: true } },
      items: true,
      addresses: true,
      statusHistory: { orderBy: { createdAt: 'asc' } },
      feedback: true,
      additionalWorkRequests: { where: { status: { in: ['APPROVED', 'PENDING'] } } },
    },
  });

  if (!booking) {
    notFound();
  }

  // Tenant Isolation: If user is logged in as CUSTOMER, verify customer ID match
  if (currentUser?.role === 'CUSTOMER' && currentUser.id !== booking.customerId) {
    throw new Error('Forbidden: You are not authorized to view this booking.');
  }

  const address = booking.addresses[0];
  const item = booking.items[0];

  const safeBookingData = {
    id: booking.id,
    bookingCode: booking.bookingCode,
    customerName: booking.customer?.name || 'Valued Customer',
    customerPhone: booking.customer?.phone || '',
    serviceName: item?.serviceName || 'Deep Cleaning Service',
    scheduledDate: booking.scheduledDate,
    scheduledTime: booking.scheduledTime,
    propertyType: booking.propertyType,
    address: address ? `${address.fullAddress}, ${address.areaName}, ${address.city} - ${address.pinCode}` : 'Site Address',
    city: address?.city || 'Pune',
    bookingStatus: booking.bookingStatus,
    paymentStatus: booking.paymentStatus,
    subtotal: booking.subtotal,
    gstAmount: booking.gstAmount,
    totalAmount: booking.totalAmount,
    advanceAmount: booking.advanceAmount,
    balanceAmount: booking.balanceAmount,
    createdAt: booking.createdAt.toISOString(),
    assignedAgencyName: booking.agencyId ? 'Kleanzo Verified Fulfillment Partner' : 'Assigning Nearby Partner...',
    hasFeedback: !!booking.feedback,
    existingRating: booking.feedback?.overallRating,
    existingComments: booking.feedback?.comments || undefined,
    additionalWorkRequests: booking.additionalWorkRequests.map(r => ({
      id: r.id,
      reason: r.reason,
      description: r.description,
      requestedAmount: r.requestedAmount,
      status: r.status,
    })),
    statusHistory: booking.statusHistory.map(h => ({
      fromStatus: h.fromStatus,
      toStatus: h.toStatus,
      remarks: h.remarks || undefined,
      createdAt: h.createdAt.toISOString(),
    })),
  };

  return <CustomerBookingClientView booking={safeBookingData} />;
}
