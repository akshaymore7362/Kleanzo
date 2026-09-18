import { AuthUser } from './rbac';

export interface MaskedCustomerPII {
  fullName: string;
  phone: string;
  areaLocality: string;
  fullAddress?: string;
  landmark?: string;
  isUnlocked: boolean;
}

/**
 * Enforces strict Agency Data Isolation.
 * Returns a filter object for Prisma queries scoped to the user's assigned agency ID.
 * If user is not an agency user (or has no agencyId), throws or returns unmatchable filter.
 */
export function getAgencyScopedWhere(user: AuthUser, extraWhere: Record<string, any> = {}) {
  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'OPERATIONS') {
    return extraWhere;
  }

  if (!user.agencyId) {
    throw new Error('Security Error: Agency user missing agency context');
  }

  return {
    ...extraWhere,
    agencyId: user.agencyId,
  };
}

/**
 * Server-side Customer PII Masking before agency accepts job offer (Section 16)
 */
export function sanitizeCustomerDetailsForAgency(
  customerName: string,
  phone: string,
  fullAddress: string,
  city: string,
  state: string,
  postalCode: string,
  isAccepted: boolean
): MaskedCustomerPII {
  if (isAccepted) {
    return {
      fullName: customerName,
      phone: phone,
      areaLocality: `${city}, ${state} - ${postalCode}`,
      fullAddress: fullAddress,
      isUnlocked: true,
    };
  }

  // Masked PII before acceptance
  const nameParts = customerName.trim().split(' ');
  const maskedName = nameParts.length > 1
    ? `${nameParts[0]} ${nameParts[1][0]}.`
    : nameParts[0];

  const maskedPhone = phone.length >= 4
    ? '••••••••' + phone.slice(-2)
    : '••••••••21';

  return {
    fullName: maskedName,
    phone: maskedPhone,
    areaLocality: `${city} area / locality`,
    isUnlocked: false,
  };
}
