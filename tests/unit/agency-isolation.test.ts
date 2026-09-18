import { getAgencyScopedWhere, sanitizeCustomerDetailsForAgency } from '../../src/lib/auth/agency-isolation';
import { AuthUser } from '../../src/lib/auth/rbac';

describe('Agency Data Isolation & PII Security Tests', () => {
  test('CRITICAL SECURITY TEST: Agency A must NEVER access Agency B data', () => {
    const agencyAUser: AuthUser = {
      id: 'usr_agency_a',
      email: 'admin@agency-a.com',
      name: 'Agency A Admin',
      role: 'AGENCY_ADMIN',
      agencyId: 'agency_A_123',
    };

    const scopedQuery = getAgencyScopedWhere(agencyAUser, { status: 'CONFIRMED' });

    // Ensure query strictly scopes by agencyId = agency_A_123
    expect(scopedQuery.agencyId).toBe('agency_A_123');
    expect(scopedQuery.status).toBe('CONFIRMED');
  });

  test('SECURITY TEST: User without agencyId cannot form valid agency query', () => {
    const invalidUser: AuthUser = {
      id: 'usr_invalid',
      email: 'hacker@test.com',
      name: 'Hacker',
      role: 'AGENCY_STAFF',
      // missing agencyId!
    };

    expect(() => getAgencyScopedWhere(invalidUser)).toThrow();
  });

  test('CUSTOMER PII MASKING TEST: Customer PII is masked before agency accepts offer', () => {
    const masked = sanitizeCustomerDetailsForAgency(
      'Rahul Jaykar',
      '9876543210',
      'Flat 402, Sunshine Heights, Baner Road',
      'Pune',
      'Maharashtra',
      '411045',
      false // NOT accepted yet!
    );

    expect(masked.isUnlocked).toBe(false);
    expect(masked.fullName).toBe('Rahul J.');
    expect(masked.phone).toBe('••••••••10');
    expect(masked.areaLocality).toBe('Pune area / locality');
    expect(masked.fullAddress).toBeUndefined();
  });

  test('CUSTOMER PII UNLOCK TEST: Full customer details unlock after agency accepts offer', () => {
    const unlocked = sanitizeCustomerDetailsForAgency(
      'Rahul Jaykar',
      '9876543210',
      'Flat 402, Sunshine Heights, Baner Road',
      'Pune',
      'Maharashtra',
      '411045',
      true // ACCEPTED!
    );

    expect(unlocked.isUnlocked).toBe(true);
    expect(unlocked.fullName).toBe('Rahul Jaykar');
    expect(unlocked.phone).toBe('9876543210');
    expect(unlocked.fullAddress).toBe('Flat 402, Sunshine Heights, Baner Road');
  });
});
