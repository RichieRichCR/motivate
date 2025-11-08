import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';

export async function POST(request: NextRequest) {
  //get headers
  const headers = request.headers;
  const revalidateSecret = headers.get('x-revalidate-secret');

  // Check for secret to confirm this is a valid request
  if (revalidateSecret !== env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: 'Invalid revalidate secret' },
      { status: 401 },
    );
  }

  try {
    // Revalidate the homepage
    await revalidateTag('metric', 'max');
    await revalidatePath('/');
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 },
    );
  }
}
