import { prisma } from '@/lib/db';
import { BookingRequirement, MatchingWeights, RankedAgencyResult, AgencyCandidate } from './types';
import { rankAgencies } from './ranking';

export async function runAgencyMatchingEngine(
  requirement: BookingRequirement,
  overrideWeights?: Partial<MatchingWeights>
): Promise<RankedAgencyResult[]> {
  // 1. Fetch configurable weights from DB
  const dbWeights = await prisma.matchingWeightConfig.findUnique({
    where: { id: 'default' },
  });

  const defaultWeights: MatchingWeights = {
    serviceCapability: dbWeights?.serviceCapability ?? 25,
    availability: dbWeights?.availability ?? 20,
    proximity: dbWeights?.distance ?? 20,
    rating: dbWeights?.qualityRating ?? 15,
    experience: dbWeights?.experience ?? 10,
    responseSpeed: dbWeights?.responseSpeed ?? 5,
    priceCompetitiveness: dbWeights?.price ?? 5,
  };

  const weights: MatchingWeights = {
    ...defaultWeights,
    ...overrideWeights,
  };

  const sumWeights =
    weights.serviceCapability +
    weights.availability +
    weights.proximity +
    weights.rating +
    weights.experience +
    weights.responseSpeed +
    weights.priceCompetitiveness;

  if (sumWeights !== 100) {
    console.warn(`[MatchingEngine] Warning: Matching weights sum to ${sumWeights}%, expected 100%`);
  }

  // 2. Fetch agencies with service areas
  const agencies = await prisma.agency.findMany({
    where: {
      verified: true,
      active: true,
      partnerStatus: { in: ['ACTIVE', 'APPROVED', 'PREFERRED', 'HIGH_VOLUME'] },
    },
    include: {
      serviceAreas: true,
      services: {
        include: {
          service: true,
        },
      },
    },
  });

  const candidates: AgencyCandidate[] = agencies.map(a => ({
    id: a.id,
    name: a.name,
    tagline: a.tagline || 'Kleanzo Certified Fulfillment Partner',
    description: a.description || 'Specialized in deep cleaning and stain removal.',
    logoUrl: a.logoUrl || '/images/agency-default.png',
    rating: a.rating,
    completedJobs: a.reviewCount * 3 || 48,
    experienceYears: a.experienceYears,
    minOrderPrice: a.minOrderPrice || 2500,
    serviceRadiusKm: a.serviceRadiusKm,
    lat: a.lat,
    lng: a.lng,
    city: a.city,
    active: a.active,
    verified: a.verified,
    supportedServices: a.services.map(s => s.service.slug),
    serviceAreas: a.serviceAreas.map(sa => `${sa.areaName}, ${sa.city}`),
  }));

  // 3. Rank agencies using modular ranking pipeline
  return rankAgencies(candidates, requirement, weights);
}

export async function matchAgencies(criteria?: any) {
  const req: BookingRequirement = {
    city: criteria?.city || 'Pune',
    area: criteria?.area,
    scheduledDate: criteria?.scheduledDate || new Date().toISOString().split('T')[0],
    services: criteria?.serviceSlug ? [{ serviceSlug: criteria.serviceSlug }] : [{ serviceSlug: 'deep-cleaning' }],
  };
  return runAgencyMatchingEngine(req);
}
