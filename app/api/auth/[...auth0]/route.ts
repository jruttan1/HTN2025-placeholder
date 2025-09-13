import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { NextRequest } from 'next/server';

const auth0 = new Auth0Client();

export function GET(req: NextRequest) {
  return auth0.middleware(req);
}

export function POST(req: NextRequest) {
  return auth0.middleware(req);
}
