import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get('returnTo') || '/login';
  
  // For now, just clear cookies and redirect to login
  // This avoids Auth0 logout URL configuration issues
  const response = NextResponse.redirect(new URL(returnTo, request.url));
  
  // Clear authentication cookies
  response.cookies.delete('optimate_session');
  response.cookies.delete('optimate_user');
  
  return response;
}
