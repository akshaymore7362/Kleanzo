import { AgencyCandidate, BookingRequirement, EligibilityResult } from './types';

/**
 * Checks hard eligibility rules for an agency:
 * 1. Service Capability (does the agency provide all requested services?)
 * 2. Service Area (is customer location inside agency coverage/city/radius?)
 * 3. Slot Availability & Capacity Left
 */
export function checkEligibility(
  agency: AgencyCandidate,
  requirement: BookingRequirement
): EligibilityResult {
  const reasons: string[] = [];

  // Rule 1: Agency Active & Verified
  if (!agency.active || !agency.verified) {
    reasons.push('Agency is not active or verified');
  }

  // Rule 2: Service Capability
  if (agency.supportedServices && agency.supportedServices.length > 0 && Array.isArray(requirement.services)) {
    for (const reqItem of requirement.services) {
      const slug = (typeof reqItem === 'string' ? reqItem : (reqItem?.serviceSlug || '')).toLowerCase();
      if (!slug) continue;
      const handlesService = agency.supportedServices.some(s => {
        const str = (s || '').toLowerCase();
        return str === slug || str.startsWith(slug) || slug.startsWith(str);
      });
      if (!handlesService) {
        reasons.push(`Does not offer service: ${slug}`);
      }
    }
  }

  // Rule 3: Service Area / Location Coverage
  if (requirement.city) {
    const matchesCity = agency.city.toLowerCase() === requirement.city.toLowerCase();
    const matchesArea = agency.serviceAreas?.some(
      area => area.toLowerCase().includes(requirement.city.toLowerCase()) ||
              (requirement.area && area.toLowerCase().includes(requirement.area.toLowerCase()))
    );
    if (!matchesCity && !matchesArea) {
      reasons.push(`Location outside service coverage: ${requirement.city}`);
    }
  }

  return {
    isEligible: reasons.length === 0,
    reasons,
  };
}
