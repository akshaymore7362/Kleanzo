import { AgencyCandidate, BookingRequirement, MatchingWeights, RankedAgencyResult } from './types';
import { checkEligibility } from './eligibility';
import { computeScores } from './scoring';

export function rankAgencies(
  agencies: AgencyCandidate[],
  requirement: BookingRequirement,
  weights: MatchingWeights
): RankedAgencyResult[] {
  const results: RankedAgencyResult[] = [];

  for (const agency of agencies) {
    const eligibility = checkEligibility(agency, requirement);
    const { score, breakdown, distanceKm, estMinutes } = computeScores(agency, requirement, weights);

    results.push({
      agency,
      eligible: eligibility.isEligible,
      eligibilityReasons: eligibility.reasons,
      matchScore: eligibility.isEligible ? score : 0,
      breakdown,
      distanceKm,
      estimatedArrivalMin: estMinutes,
    });
  }

  // Sort eligible agencies by highest matchScore first, followed by ineligible ones
  return results.sort((a, b) => {
    if (a.eligible && !b.eligible) return -1;
    if (!a.eligible && b.eligible) return 1;
    return b.matchScore - a.matchScore;
  });
}
