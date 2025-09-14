import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get('returnTo') || '/login';
  
  const auth0Domain = process.env.AUTH0_DOMAIN;
  const baseUrl = process.env.AUTH0_BASE_URL || 'http://localhost:3000';
  
  const logoutUrl = `https://${auth0Domain}/v2/logout?` + new URLSearchParams({
    returnTo: `${baseUrl}${returnTo}`
  });
  
  // Create response with redirect
  const response = NextResponse.redirect(logoutUrl);
  
  // Clear authentication cookies
  response.cookies.delete('auth0.access_token');
  response.cookies.delete('auth0.id_token');
  response.cookies.delete('auth0.is.authenticated');
  
  return response;
}
