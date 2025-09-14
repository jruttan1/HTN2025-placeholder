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

  // Check for authentication token in cookies
  const authToken = request.cookies.get('auth0.session.token') || 
                   request.cookies.get('auth0.is.authenticated');
  
  // If no auth token and trying to access protected route, redirect to login
  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

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
