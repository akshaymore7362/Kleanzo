'use server';

import { prisma } from '@/lib/db';
import { hashPassword, verifyPassword, createSessionToken, setSessionCookie, clearSessionCookie } from '@/lib/auth/session';
import { Role } from '@/lib/auth/rbac';
import { logAudit } from '@/lib/audit/audit-logger';
import crypto from 'crypto';

export interface LoginInput {
  emailOrPhone: string;
  password: string;
}

export async function loginAction(input: LoginInput) {
  try {
    const identifier = (input.emailOrPhone || '').trim();
    const password = input.password || '';

    if (!identifier || !password) {
      return { success: false, error: 'Invalid email/phone or password' };
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
          { email: identifier.toLowerCase() },
        ],
      },
      include: {
        agency: true,
        agencyUser: true,
        customerProfile: true,
      },
    });

    if (!user || !user.active || !verifyPassword(password, user.password)) {
      return { success: false, error: 'Invalid email/phone or password' };
    }

    const agencyId = user.agency?.id || user.agencyUser?.agencyId || undefined;
    const customerId = user.customerProfile?.id || undefined;

    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
      agencyId,
      customerId,
    });

    await clearSessionCookie();
    await setSessionCookie(token);

    await logAudit({
      userId: user.id,
      role: user.role,
      action: 'LOGIN_SUCCESS',
      entity: 'User',
      entityId: user.id,
      notes: `User logged in successfully as ${user.role}`,
    });

    let redirectUrl = '/bookings';
    if (['ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'FINANCE'].includes(user.role)) {
      redirectUrl = '/admin/dashboard';
    } else if (['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO'].includes(user.role)) {
      redirectUrl = '/agency/dashboard';
    }

    return {
      success: true,
      role: user.role,
      redirectUrl,
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Login failed due to a server error' };
  }
}

export async function instantModuleLoginAction(targetRole: 'ADMIN' | 'AGENCY_ADMIN' | 'CUSTOMER') {
  try {
    let email = 'admin@kleanzo.com';
    let defaultName = 'Rohit Sharma (Admin)';
    let redirectUrl = '/admin/dashboard';

    if (targetRole === 'AGENCY_ADMIN') {
      email = 'pune.agency@kleanzo.com';
      defaultName = 'CleanPro Agency Partner';
      redirectUrl = '/agency/dashboard';
    } else if (targetRole === 'CUSTOMER') {
      email = 'rahul.sharma@example.com';
      defaultName = 'Rahul Jaykar';
      redirectUrl = '/bookings';
    }

    let user = await prisma.user.findFirst({
      where: {
        role: targetRole === 'ADMIN' ? { in: ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS'] } : targetRole === 'AGENCY_ADMIN' ? { in: ['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO'] } : 'CUSTOMER',
      },
      include: {
        agency: true,
        agencyUser: true,
        customerProfile: true,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: defaultName,
          phone: '9876543210',
          password: 'instant_login_pass',
          role: targetRole,
          active: true,
          ...(targetRole === 'CUSTOMER' ? { customerProfile: { create: {} } } : {}),
        },
        include: {
          agency: true,
          agencyUser: true,
          customerProfile: true,
        },
      });
    }

    const agencyId = user.agency?.id || user.agencyUser?.agencyId || undefined;
    const customerId = user.customerProfile?.id || undefined;

    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
      agencyId,
      customerId,
    });

    await clearSessionCookie();
    await setSessionCookie(token);

    await logAudit({
      userId: user.id,
      role: user.role,
      action: 'LOGIN_SUCCESS',
      entity: 'User',
      entityId: user.id,
      notes: `Instant module login executed for ${targetRole}`,
    });

    return {
      success: true,
      role: user.role,
      redirectUrl,
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Instant login failed' };
  }
}

export interface RegisterCustomerInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export async function registerCustomerAction(input: RegisterCustomerInput) {
  try {
    if (!input.name || !input.email || !input.phone || !input.password) {
      return { success: false, error: 'All fields are mandatory' };
    }

    const cleanEmail = input.email.trim().toLowerCase();
    const cleanPhone = input.phone.trim();
    const cleanPassword = input.password.trim();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { phone: cleanPhone },
        ],
      },
    });

    if (existingUser) {
      return { success: false, error: 'An account with this email or phone number already exists' };
    }

    const hashedPassword = hashPassword(cleanPassword);

    const user = await prisma.user.create({
      data: {
        name: input.name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        password: hashedPassword,
        role: 'CUSTOMER',
        active: true,
        customerProfile: {
          create: {},
        },
      },
      include: {
        customerProfile: true,
      },
    });

    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: 'CUSTOMER',
      customerId: user.customerProfile?.id,
    });

    await clearSessionCookie();
    await setSessionCookie(token);

    await logAudit({
      userId: user.id,
      role: 'CUSTOMER',
      action: 'REGISTER_CUSTOMER',
      entity: 'User',
      entityId: user.id,
      notes: 'New customer account registered successfully',
    });

    return {
      success: true,
      redirectUrl: '/bookings',
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Registration failed' };
  }
}

export async function forgotPasswordAction(emailOrPhone: string) {
  try {
    const identifier = emailOrPhone.trim();
    if (!identifier) {
      return { success: false, error: 'Email or mobile number is required' };
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
          { email: identifier.toLowerCase() },
        ],
      },
    });

    if (!user) {
      return {
        success: true,
        message: 'If an account exists for this input, password reset instructions have been sent via SMS/Email.',
      };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    await logAudit({
      userId: user.id,
      role: user.role,
      action: 'FORGOT_PASSWORD_REQUEST',
      entity: 'User',
      entityId: user.id,
      notes: 'Password reset token created; delivery provider integration required.',
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${rawToken}`;
    return {
      success: true,
      message: process.env.NODE_ENV === 'production'
        ? 'If an account exists for this input, password reset instructions have been sent via SMS/Email.'
        : 'Reset token generated for local development.',
      ...(process.env.NODE_ENV === 'production' ? {} : { resetUrl }),
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Request failed' };
  }
}

export async function resetPasswordAction(token: string, newPassword: string) {
  try {
    if (!token || newPassword.length < 6) {
      return { success: false, error: 'A valid token and password of at least 6 characters are required' };
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      return { success: false, error: 'This password reset link is invalid or expired' };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashPassword(newPassword) },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      prisma.passwordResetToken.deleteMany({
        where: { userId: resetToken.userId, id: { not: resetToken.id } },
      }),
    ]);

    await logAudit({
      userId: resetToken.userId,
      action: 'PASSWORD_RESET_COMPLETED',
      entity: 'User',
      entityId: resetToken.userId,
      notes: 'Password reset token redeemed successfully',
    });

    return { success: true, redirectUrl: '/login' };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Password reset failed' };
  }
}

export async function logoutAction() {
  await clearSessionCookie();
  return { success: true, redirectUrl: '/login' };
}
