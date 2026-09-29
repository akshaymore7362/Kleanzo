'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import AdminBookingMatchingClientView from './AdminBookingMatchingClientView';
import { notFound } from 'next/navigation';

export default async function AdminBookingDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const user = await getCurrentUser();

  const booking = await prisma.booking.findFirst({
    where: {
      OR: [
        { id },
        { bookingCode: id },
      ],
    },
    include: {
      customer: true,
      agency: true,
      items: true,
      addresses: true,
      assignments: {
        include: { agency: true, offers: true, rejections: true },
        orderBy: { createdAt: 'desc' },
      },
      rejections: { include: { agency: true } },
      siteInspection: true,
      qualityCheck: true,
      partnerPayouts: true,
      additionalWorkRequests: { include: { agency: true } },
      crewAssignments: { include: { crewMember: true } },
      statusHistory: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!booking) {
    notFound();
  }

  const address = booking.addresses[0];
  const item = booking.items[0];

  const bookingData = {
    id: booking.id,
    bookingCode: booking.bookingCode,
    customerName: booking.customer?.name || 'Customer',
    customerPhone: booking.customer?.phone || '',
    customerEmail: booking.customer?.email || '',
    serviceName: item?.serviceName || 'Deep Cleaning',
    scheduledDate: booking.scheduledDate,
    scheduledTime: booking.scheduledTime,
    propertyType: booking.propertyType,
    address: address ? `${address.fullAddress}, ${address.areaName}, ${address.city} (${address.pinCode})` : 'Site Address',
    city: address?.city || 'Pune',
    area: address?.areaName || 'Baner',
    lat: address?.lat ?? 18.5204,
    lng: address?.lng ?? 73.8567,
    bookingStatus: booking.bookingStatus,
    paymentStatus: booking.paymentStatus,
    subtotal: booking.subtotal,
    gstAmount: booking.gstAmount,
    totalAmount: booking.totalAmount,
    advanceAmount: booking.advanceAmount,
    balanceAmount: booking.balanceAmount,
    partnerPayout: booking.partnerPayout || Math.round(booking.totalAmount * 0.70),
    kleanzoRetained: booking.kleanzoRetained || Math.round(booking.totalAmount * 0.30),
    assignmentMode: booking.assignmentMode || 'AUTOMATIC',
    assignedAgencyId: booking.agencyId,
    assignedAgencyName: booking.agency?.name || 'Unassigned',
    assignedAgencyPhone: booking.agency?.phone || '',
    completionProof: booking.completionProof,
    completionNotes: booking.completionNotes,
    verificationStatus: booking.verificationStatus || 'NONE',
    correctionNotes: booking.correctionNotes,
    siteInspection: booking.siteInspection ? {
      inspectorName: booking.siteInspection.inspectorName,
      actualCondition: booking.siteInspection.actualCondition,
      beforePhotos: booking.siteInspection.beforePhotos,
    } : null,
    qualityCheck: booking.qualityCheck ? {
      supervisorName: booking.qualityCheck.supervisorName,
      afterPhotos: booking.qualityCheck.afterPhotos,
      passed: booking.qualityCheck.passed,
    } : null,
    crewMembers: booking.crewAssignments.map(c => ({
      id: c.crewMember.id,
      name: c.crewMember.name,
      role: c.roleOnJob,
    })),
    additionalWorkRequests: booking.additionalWorkRequests.map(r => ({
      id: r.id,
      reason: r.reason,
      description: r.description,
      requestedAmount: r.requestedAmount,
      status: r.status,
      agencyName: r.agency.name,
    })),
    assignments: booking.assignments.map(a => ({
      id: a.id,
      agencyName: a.agency.name,
      assignedBy: a.assignedBy,
      assignmentMode: a.assignmentMode || 'AUTOMATIC',
      status: a.status,
      createdAt: a.createdAt.toISOString(),
      acceptedAt: a.acceptedAt?.toISOString(),
      rejectedAt: a.rejectedAt?.toISOString(),
    })),
    rejections: booking.rejections.map(r => ({
      id: r.id,
      agencyName: r.agency.name,
      reason: r.reason,
      createdAt: r.createdAt.toISOString(),
    })),
    statusHistory: booking.statusHistory.map(h => ({
      id: h.id,
      fromStatus: h.fromStatus,
      toStatus: h.toStatus,
      changedBy: h.changedBy,
      changedType: h.changedType,
      remarks: h.remarks,
      createdAt: h.createdAt.toISOString(),
    })),
  };

  return <AdminBookingMatchingClientView booking={bookingData} />;
}
