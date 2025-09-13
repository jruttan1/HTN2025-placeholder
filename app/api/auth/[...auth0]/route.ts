import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const authAction = pathname.split('/').pop();

  switch (authAction) {
    case 'login':
      // Redirect to Auth0 login
      const loginUrl = new URL(`https://${process.env.AUTH0_DOMAIN}/authorize`);
      loginUrl.searchParams.set('response_type', 'code');
      loginUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID!);
      loginUrl.searchParams.set('redirect_uri', `${process.env.AUTH0_BASE_URL}/api/auth/callback`);
      loginUrl.searchParams.set('scope', 'openid profile email');
      
      // Add returnTo parameter if provided
      const returnTo = request.nextUrl.searchParams.get('returnTo');
      if (returnTo) {
        loginUrl.searchParams.set('state', returnTo);
      }
      
      return NextResponse.redirect(loginUrl);

    case 'logout':
      // Redirect to Auth0 logout
      const logoutUrl = new URL(`https://${process.env.AUTH0_DOMAIN}/v2/logout`);
      logoutUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID!);
      logoutUrl.searchParams.set('returnTo', process.env.AUTH0_BASE_URL!);
      
      // Clear the session cookie
      const response = NextResponse.redirect(logoutUrl);
      response.cookies.delete('appSession');
      return response;

    case 'callback':
      // Handle Auth0 callback
      const code = request.nextUrl.searchParams.get('code');
      const state = request.nextUrl.searchParams.get('state');
      
      if (!code) {
        return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/login?error=callback_error`);
      }

      try {
        // Exchange code for tokens
        const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            code,
            redirect_uri: `${process.env.AUTH0_BASE_URL}/api/auth/callback`,
          }),
        });

        const tokens = await tokenResponse.json();
        
        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for tokens');
        }

        // Get user info
        const userResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
          },
        });

        const user = await userResponse.json();

        // Create session cookie (simplified)
        const session = {
          user: {
            sub: user.sub,
            name: user.name,
            email: user.email,
            picture: user.picture,
          },
          accessToken: tokens.access_token,
          idToken: tokens.id_token,
        };

        const redirectUrl = state ? `${process.env.AUTH0_BASE_URL}${state}` : `${process.env.AUTH0_BASE_URL}/dashboard`;
        const response = NextResponse.redirect(redirectUrl);
        
        // Set session cookie (this is simplified - in production you'd want proper encryption)
        response.cookies.set('appSession', JSON.stringify(session), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
      } catch (error) {
        console.error('Callback error:', error);
        return NextResponse.redirect(`${process.env.AUTH0_BASE_URL}/login?error=callback_error`);
      }

    default:
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
