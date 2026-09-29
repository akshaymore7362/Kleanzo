import crypto from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { AuthUser, Role } from './rbac';

const SESSION_COOKIE_NAME = 'kleanzo_session';
const SECRET_KEY = process.env.SESSION_SECRET || 'kleanzo-secret-key-production-grade-2026';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  if (!combinedHash || !combinedHash.includes(':')) {
    // Fallback for legacy plain text passwords in dev/seed
    return password === combinedHash;
  }
  const [salt, key] = combinedHash.split(':');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
  agencyId?: string;
  customerId?: string;
  exp: number;
}

export function createSessionToken(payload: Omit<SessionPayload, 'exp'>): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const data = JSON.stringify({ ...payload, exp });
  const hmac = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
  const token = Buffer.from(data).toString('base64url') + '.' + hmac;
  return token;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encodedData, signature] = parts;
    const dataStr = Buffer.from(encodedData, 'base64url').toString('utf8');
    const expectedHmac = crypto.createHmac('sha256', SECRET_KEY).update(dataStr).digest('hex');
    
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedHmac))) {
      return null;
    }
    
    const payload: SessionPayload = JSON.parse(dataStr);
    if (Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
}

let mockTestUser: AuthUser | null = null;

export function setMockTestUser(user: AuthUser | null) {
  mockTestUser = user;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (mockTestUser) return mockTestUser;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifySessionToken(token);
    if (!payload) return null;

    // Fast return or verified fetch
    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      agencyId: payload.agencyId,
      customerId: payload.customerId,
    };
  } catch {
    return null;
  }
}
