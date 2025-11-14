import { NextResponse } from 'next/server';
import { api } from '@/lib/api-client';

export async function GET() {
  try {
    const data = await api.metrics.get();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 },
    );
  }
}
