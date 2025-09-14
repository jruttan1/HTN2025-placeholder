import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state') || '/dashboard';
  const code = searchParams.get('code');
  
  if (code) {
    // In a real implementation, you would exchange the code for tokens here
    // For now, we'll just redirect to the return URL
    console.log('Auth callback received with code:', code);
  }
  
  // Redirect to the return URL or dashboard
  return NextResponse.redirect(new URL(state, request.url));
}
