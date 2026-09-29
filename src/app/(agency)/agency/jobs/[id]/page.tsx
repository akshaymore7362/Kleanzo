'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { getAgencyTeamMembersAction } from '@/actions/agency-actions';
import AgencyJobDetailClientView from './AgencyJobDetailClientView';
import { notFound } from 'next/navigation';

export default async function AgencyJobDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const user = await getCurrentUser();

  if (!user || !user.agencyId) {
    throw new Error('Forbidden: Agency access required.');
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id,
      agencyId: user.agencyId,
    },
    include: {
      customer: { select: { id: true, name: true, phone: true, email: true } },
      items: true,
      addresses: true,
      crewAssignments: { include: { crewMember: true } },
      offers: { where: { agencyId: user.agencyId }, orderBy: { sentAt: 'desc' } },
      additionalWorkRequests: true,
      siteInspection: true,
      qualityCheck: true,
    },
  });

  if (!booking) {
    notFound();
  }

  const teamRes = await getAgencyTeamMembersAction();
  const teamMembers = (teamRes.success && teamRes.members) ? teamRes.members : [];

  const address = booking.addresses[0];
  const item = booking.items[0];
  const activeOffer = booking.offers[0];

  const isAccepted = ['PARTNER_ACCEPTED', 'TEAM_ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'CLEANING_IN_PROGRESS', 'VERIFICATION_PENDING', 'VERIFIED', 'COMPLETED'].includes(booking.bookingStatus);

  const jobData = {
    id: booking.id,
    bookingCode: booking.bookingCode,
    offerId: activeOffer?.id,
    customerName: isAccepted ? (booking.customer?.name || 'Customer') : 'Customer details hidden until acceptance',
    customerPhone: isAccepted ? (booking.customer?.phone || '') : '98******00',
    serviceName: item?.serviceName || 'Deep Cleaning',
    propertyType: booking.propertyType,
    address: address ? `${address.fullAddress}, ${address.areaName}, ${address.city} (${address.pinCode})` : 'Site Address',
    area: address?.areaName || 'Baner',
    city: address?.city || 'Pune',
    scheduledDate: booking.scheduledDate,
    scheduledTime: booking.scheduledTime,
    bookingStatus: booking.bookingStatus,
    partnerPayout: booking.partnerPayout || Math.round(booking.totalAmount * 0.70),
    assignedCrew: booking.crewAssignments.map(c => ({
      id: c.crewMember.id,
      name: c.crewMember.name,
      phone: c.crewMember.phone,
      role: c.roleOnJob,
    })),
    additionalWorkRequests: booking.additionalWorkRequests.map(r => ({
      id: r.id,
      reason: r.reason,
      description: r.description,
      requestedAmount: r.requestedAmount,
      status: r.status,
    })),
    siteInspection: booking.siteInspection ? {
      actualCondition: booking.siteInspection.actualCondition,
      beforePhotos: booking.siteInspection.beforePhotos,
    } : null,
    qualityCheck: booking.qualityCheck ? {
      afterPhotos: booking.qualityCheck.afterPhotos,
    } : null,
  };

  return (
    <AgencyJobDetailClientView 
      job={jobData} 
      agencyId={user.agencyId} 
      teamMembers={teamMembers} 
    />
  );
}
