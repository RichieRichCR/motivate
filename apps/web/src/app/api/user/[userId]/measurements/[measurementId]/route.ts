import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/api-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; measurementId: string }> },
) {
  try {
    const { userId, measurementId } = await params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    const data = await api.user.measurements.getById({
      userId,
      measurementId: parseInt(measurementId, 10),
      startDate,
      endDate,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching measurements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch measurements' },
      { status: 500 },
    );
  }
}
