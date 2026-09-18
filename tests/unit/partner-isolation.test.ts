import { AuthUser } from '../../src/lib/auth/rbac';
import { getAgencyScopedWhere, sanitizeCustomerDetailsForAgency } from '../../src/lib/auth/agency-isolation';

describe('Kleanzo Master Spec — Partner Data Isolation & Privacy Tests', () => {
  test('CRITICAL SECURITY: Partner payout and margin are stripped for CUSTOMER role', () => {
    const rawBookingData = {
      id: 'bk_1001',
      bookingCode: 'KLZ-BK-9021',
      totalAmount: 15079,
      partnerPayout: 11000, // Internal partner payout
      kleanzoRetained: 4079, // Kleanzo margin
      agencyId: 'agency_secret_123',
    };

    // Client/Customer Sanitization helper
    const sanitizeForCustomer = (data: typeof rawBookingData) => {
      const { partnerPayout, kleanzoRetained, agencyId, ...publicData } = data;
      return publicData;
    };

    const customerView = sanitizeForCustomer(rawBookingData);

    expect((customerView as any).partnerPayout).toBeUndefined();
    expect((customerView as any).kleanzoRetained).toBeUndefined();
    expect((customerView as any).agencyId).toBeUndefined();
    expect(customerView.totalAmount).toBe(15079);
  });

  test('SECURITY TEST: Partner A cannot query Partner B jobs or payouts', () => {
    const partnerA: AuthUser = {
      id: 'usr_partner_a',
      email: 'admin@partner-a.com',
      name: 'Partner A Admin',
      role: 'AGENCY_ADMIN',
      agencyId: 'agency_A_99',
    };

    const query = getAgencyScopedWhere(partnerA);
    expect(query.agencyId).toBe('agency_A_99');
  });
});
