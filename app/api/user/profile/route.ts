import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createUser, getUser, updateUser } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = getSession(request);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUser(session.user.sub);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = getSession(request);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email } = body;

    // Check if user already exists
    const existingUser = await getUser(session.user.sub);
    
    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    // Create new user
    const newUser = await createUser({
      userId: session.user.sub,
      name: name || session.user.name,
      email: email || session.user.email,
      preferences: {},
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = getSession(request);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, preferences } = body;

    const updatedUser = await updateUser(session.user.sub, {
      name,
      email,
      preferences,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
