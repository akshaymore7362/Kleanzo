export type Role =
  | 'CUSTOMER'
  | 'PRO'
  | 'AGENCY_ADMIN'
  | 'AGENCY_STAFF'
  | 'OPERATIONS'
  | 'FINANCE'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  agencyId?: string;
  customerId?: string;
}

export function hasRole(user: AuthUser | null, allowedRoles: Role[]): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN') return true;
  return allowedRoles.includes(user.role);
}

export function assertRole(user: AuthUser | null, allowedRoles: Role[]): void {
  if (!user || !hasRole(user, allowedRoles)) {
    throw new Error('Forbidden: Unauthorized operation or insufficient privileges');
  }
}
