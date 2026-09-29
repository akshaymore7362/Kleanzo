import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { runAgencyMatchingEngine } from '@/lib/matching/agency-matching';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { city, area, lat, lng, serviceSlug, scheduledDate, scheduledTime } = body;

    // 1. Execute matching engine
    const rankedResults = await runAgencyMatchingEngine({
      city: city || 'Pune',
      area: area || 'Wakad',
      lat: lat || 18.5987,
      lng: lng || 73.7689,
      scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
      timeSlot: scheduledTime || '10:00 AM',
      services: [{ serviceSlug: serviceSlug || 'deep-cleaning' }],
    });

    // 2. Fetch full agency records from DB for ACTIVE + VERIFIED agencies only
    const agencyIds = rankedResults.map((r) => r.agency.id);
    const agencies = await prisma.agency.findMany({
      where: {
        id: { in: agencyIds },
        active: true,
        verified: true,
        partnerStatus: { in: ['ACTIVE', 'APPROVED', 'PREFERRED', 'HIGH_VOLUME'] },
      },
      include: {
        serviceAreas: true,
        services: { include: { service: true } },
      },
    });

    // 3. Map into Customer-Safe Agency View (STRICT FINANCIAL & PRIVATE DATA ISOLATION)
    // - Strips internal partner payout, Kleanzo margin, bank account, documents, and admin notes
    const customerSafeAgencies = agencies.map((agency) => {
      const ranked = rankedResults.find((r) => r.agency.id === agency.id);
      return {
        id: agency.id,
        name: agency.name,
        tagline: agency.tagline || 'Kleanzo Certified Fulfillment Partner',
        description: agency.description || 'Specialized in deep cleaning and stain removal.',
        logoUrl: agency.logoUrl || '/images/agency-default.png',
        rating: agency.rating || 4.8,
        completedJobs: agency.completedJobsCount || agency.reviewCount * 3 || 120,
        experienceYears: agency.experienceYears || 5,
        partnerTier: agency.partnerTier || 'PREFERRED',
        verified: true,
        distanceKm: ranked?.distanceKm ?? 2.4,
        serviceAreaNames: agency.serviceAreas.map((sa) => sa.areaName).join(', ') || 'Baner / Wakad, Pune',
        supportedServices: agency.services.map((s) => s.service.name),
        matchScore: ranked?.matchScore || 95,
        lat: agency.lat || 18.5987,
        lng: agency.lng || 73.7689,
        availableForSlot: true,
      };
    });

    // Sort by proximity / distance by default
    customerSafeAgencies.sort((a, b) => a.distanceKm - b.distanceKm);

    return NextResponse.json({
      success: true,
      agencies: customerSafeAgencies,
      totalCount: customerSafeAgencies.length,
    });
  } catch (error: any) {
    console.error('[API /api/agencies/eligible] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch eligible agencies' },
      { status: 500 }
    );
  }
}
