import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Redirect to dashboard after any auth action - user data will be processed there
  return NextResponse.redirect(new URL('/dashboard', request.url));
}

export async function POST(request: NextRequest) {
  // Handle POST auth requests and redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
