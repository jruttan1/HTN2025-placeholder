import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserSubmissions, createSubmission } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = getSession(request);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submissions = await getUserSubmissions(session.user.sub);
    
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
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
    const submissionData = {
      ...body,
      userId: session.user.sub,
      submissionId: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    const newSubmission = await createSubmission(submissionData);
    
    return NextResponse.json(newSubmission);
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
