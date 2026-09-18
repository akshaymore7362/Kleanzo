import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getSessionFromCookie(request: NextRequest) {
  try {
    const token = request.cookies.get('kleanzo_session')?.value;
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const jsonStr = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(jsonStr);
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const session = getSessionFromCookie(request);

  // Security Headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(`https://${request.headers.get('host')}${pathname}`, 301);
  }

  // Redirect logged-in users away from /login only if explicit switch is NOT requested
  if ((pathname === '/login' || pathname === '/register') && session && !searchParams.has('switch')) {
    let redirectUrl = '/bookings';
    if (['ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'FINANCE'].includes(session.role)) {
      redirectUrl = '/admin/dashboard';
    } else if (['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO'].includes(session.role)) {
      redirectUrl = '/agency/dashboard';
    }
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Protect Admin Portal (/admin/*)
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL(`/login?redirectTo=${encodeURIComponent(pathname)}`, request.url));
    }
    if (!['ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'FINANCE'].includes(session.role)) {
      const dest = ['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO'].includes(session.role) ? '/agency/dashboard' : '/bookings';
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  // Protect Agency / Partner Portal (/agency/*)
  if (pathname.startsWith('/agency')) {
    if (!session) {
      return NextResponse.redirect(new URL(`/login?redirectTo=${encodeURIComponent(pathname)}`, request.url));
    }
    if (!['AGENCY_ADMIN', 'AGENCY_STAFF', 'PRO'].includes(session.role)) {
      const dest = ['ADMIN', 'SUPER_ADMIN', 'OPERATIONS', 'FINANCE'].includes(session.role) ? '/admin/dashboard' : '/bookings';
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  // Customer Bookings Dashboard (/bookings) - Available to Customers & Bookers
  if (pathname === '/bookings' || pathname.startsWith('/bookings/dashboard')) {
    // Always allow viewing /bookings - do not redirect to admin
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
