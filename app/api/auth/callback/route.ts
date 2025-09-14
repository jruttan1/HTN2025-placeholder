import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state') || '/dashboard';
  const code = searchParams.get('code');
  
  if (code) {
    // Exchange the authorization code for tokens
    const auth0Domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const clientSecret = process.env.AUTH0_CLIENT_SECRET;
    const baseUrl = process.env.AUTH0_BASE_URL || 'http://localhost:3000';
    
    try {
      const tokenResponse = await fetch(`https://${auth0Domain}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          redirect_uri: `${baseUrl}/api/auth/callback`,
        }),
      });

      if (tokenResponse.ok) {
        const tokens = await tokenResponse.json();
        
        // Create response with redirect
        const response = NextResponse.redirect(new URL(state, request.url));
        
        // Set authentication cookies
        response.cookies.set('auth0.access_token', tokens.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 86400, // 24 hours
        });
        
        response.cookies.set('auth0.id_token', tokens.id_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 86400, // 24 hours
        });
        
        response.cookies.set('auth0.is.authenticated', 'true', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 86400, // 24 hours
        });
        
        return response;
      } else {
        console.error('Token exchange failed:', await tokenResponse.text());
      }
    } catch (error) {
      console.error('Auth callback error:', error);
    }
  }
  
  // If authentication failed, redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}
