import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. CSRF Protection: Verify Origin matches Host on mutating /api/admin & /api/auth requests
  if (
    MUTATING_METHODS.has(req.method) &&
    (pathname.startsWith('/api/admin') || pathname.startsWith('/api/auth'))
  ) {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return NextResponse.json(
            { error: 'Geçersiz istek kaynağı (CSRF koruması).' },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: 'Geçersiz istek kaynağı.' },
          { status: 403 }
        );
      }
    }
  }

  // 2. Edge-level gate: block unauthenticated /yonetim access before rendering
  if (pathname.startsWith('/yonetim')) {
    const hasSessionCookie = Boolean(req.cookies.get(AUTH_COOKIE_NAME)?.value);
    if (!hasSessionCookie) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/yonetim/:path*', '/api/admin/:path*', '/api/auth/:path*'],
};
