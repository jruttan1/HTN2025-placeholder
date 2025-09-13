import { NextRequest } from 'next/server';

export interface Session {
  user: {
    sub: string;
    name: string;
    email: string;
    picture?: string;
  };
  accessToken: string;
  idToken: string;
}

export function getSession(request: NextRequest): Session | null {
  try {
    const sessionCookie = request.cookies.get('appSession');
    if (!sessionCookie) {
      return null;
    }

    const session = JSON.parse(sessionCookie.value) as Session;
    return session;
  } catch (error) {
    console.error('Error parsing session:', error);
    return null;
  }
}

export function getSessionFromHeaders(headers: Headers): Session | null {
  try {
    const cookieHeader = headers.get('cookie');
    if (!cookieHeader) {
      return null;
    }

    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const sessionCookie = cookies['appSession'];
    if (!sessionCookie) {
      return null;
    }

    const session = JSON.parse(decodeURIComponent(sessionCookie)) as Session;
    return session;
  } catch (error) {
    console.error('Error parsing session from headers:', error);
    return null;
  }
}
