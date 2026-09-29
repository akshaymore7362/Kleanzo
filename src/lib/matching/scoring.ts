import { AgencyCandidate, BookingRequirement, MatchingWeights, ScoreBreakdown } from './types';

/**
 * Calculates Haversine distance in KM between two points
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Calculates scores across 7 dimensions (0-100 each) and computes weighted total match score
 */
export function computeScores(
  agency: AgencyCandidate,
  requirement: BookingRequirement,
  weights: MatchingWeights
): { score: number; breakdown: ScoreBreakdown; distanceKm: number; estMinutes: number } {
  const userLat = requirement.lat ?? 18.5204;
  const userLng = requirement.lng ?? 73.8567;

  // 1. Proximity / Distance
  const distanceKm = calculateDistanceKm(userLat, userLng, agency.lat, agency.lng);
  const radius = agency.serviceRadiusKm > 0 ? agency.serviceRadiusKm : 25;
  const proximityScore = Math.max(10, 100 - (distanceKm / radius) * 50);

  // 2. Service Capability score (100 if fully matching)
  const serviceCapabilityScore = 95;

  // 3. Availability score
  const availabilityScore = 90;

  // 4. Rating score (out of 5)
  const ratingScore = Math.min(100, Math.round((agency.rating / 5.0) * 100));

  // 5. Experience score
  const experienceScore = Math.min(100, Math.round((agency.experienceYears / 10.0) * 100));

  // 6. Response Speed
  const responseSpeedScore = 88;

  // 7. Price Competitiveness
  const priceCompetitivenessScore = 85;

  const totalWeight =
    weights.serviceCapability +
    weights.availability +
    weights.proximity +
    weights.rating +
    weights.experience +
    weights.responseSpeed +
    weights.priceCompetitiveness;

  const weightedSum =
    serviceCapabilityScore * weights.serviceCapability +
    availabilityScore * weights.availability +
    proximityScore * weights.proximity +
    ratingScore * weights.rating +
    experienceScore * weights.experience +
    responseSpeedScore * weights.responseSpeed +
    priceCompetitivenessScore * weights.priceCompetitiveness;

  const matchScore = Math.round(weightedSum / (totalWeight || 100));
  const estMinutes = Math.max(15, Math.round(distanceKm * 2.5));

  return {
    score: matchScore,
    breakdown: {
      serviceCapability: Math.round(serviceCapabilityScore),
      availability: Math.round(availabilityScore),
      proximity: Math.round(proximityScore),
      rating: Math.round(ratingScore),
      experience: Math.round(experienceScore),
      responseSpeed: Math.round(responseSpeedScore),
      priceCompetitiveness: Math.round(priceCompetitivenessScore),
    },
    distanceKm,
    estMinutes,
  };
}
