import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  
  const auth0Domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const baseUrl = process.env.AUTH0_BASE_URL || 'http://localhost:3000';
  
  const authUrl = `https://${auth0Domain}/authorize?` + new URLSearchParams({
    response_type: 'code',
    client_id: clientId!,
    redirect_uri: `${baseUrl}/api/auth/callback`,
    scope: 'openid profile email',
    state: returnTo
  });
  
  return NextResponse.redirect(authUrl);
}
