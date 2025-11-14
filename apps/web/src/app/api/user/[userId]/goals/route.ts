import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/api-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const data = await api.user.goals.get(userId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals data' },
      { status: 500 },
    );
  }
}
