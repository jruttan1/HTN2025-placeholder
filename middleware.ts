import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to public routes
  const publicRoutes = ['/', '/login'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
  
  // Allow API auth routes
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }
  
  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // For protected routes, check if user has auth cookie
  const authCookie = request.cookies.get('appSession');
  
  if (!authCookie) {
    // Redirect to login if no auth session
    const loginUrl = new URL('/api/auth/login', request.url);
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
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
     * - api/auth (Auth0 routes)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
