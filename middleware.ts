import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to auth routes, login page, not-found page, and static files
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/not-found' ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // For now, allow all routes - let client-side auth handle the checks
  // This will prevent the redirect loop while we debug
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - not-found (404 page)
     * - api routes that don't need auth
     */
    '/((?!_next/static|_next/image|favicon.ico|not-found|api/auth).*)',
  ],
};
