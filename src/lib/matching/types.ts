export interface BookingRequirement {
  bookingId?: string;
  city: string;
  area?: string;
  postalCode?: string;
  lat?: number;
  lng?: number;
  scheduledDate: string; // YYYY-MM-DD
  timeSlot?: string;
  services: {
    serviceId?: string;
    serviceSlug: string;
    variantSlug?: string;
    quantity?: number;
  }[];
}

export interface EligibilityResult {
  isEligible: boolean;
  reasons: string[];
}

export interface ScoreBreakdown {
  serviceCapability: number; // 0-100
  availability: number;       // 0-100
  proximity: number;          // 0-100
  rating: number;             // 0-100
  experience: number;         // 0-100
  responseSpeed: number;      // 0-100
  priceCompetitiveness: number;// 0-100
}

export interface MatchingWeights {
  serviceCapability: number;
  availability: number;
  proximity: number;
  rating: number;
  experience: number;
  responseSpeed: number;
  priceCompetitiveness: number;
}

export interface AgencyCandidate {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  rating: number;
  completedJobs: number;
  experienceYears: number;
  minOrderPrice?: number;
  serviceRadiusKm: number;
  lat: number;
  lng: number;
  city: string;
  active: boolean;
  verified: boolean;
  supportedServices?: string[];
  serviceAreas?: string[];
}

export interface RankedAgencyResult {
  agency: AgencyCandidate;
  eligible: boolean;
  eligibilityReasons: string[];
  matchScore: number;
  breakdown: ScoreBreakdown;
  distanceKm: number;
  estimatedArrivalMin: number;
}
