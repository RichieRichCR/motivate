import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Dashboard } from '../components/dash/dash';
import { ErrorBoundary } from '../components/error-boundary';
import { Suspense } from 'react';
import { SkeletonDashboard } from '@/components/skeleton-dashboard';
import { prefetchDashboardData } from '@/lib/api-queries';
import { env } from '@/env';

export const revalidate = 300; // Revalidate every 5 minutes

const timestamp = new Date().toUTCString();

export default async function Home() {
  // Create a new QueryClient for this request
  const queryClient = new QueryClient();

  // Prefetch all dashboard data on the server
  await prefetchDashboardData(queryClient, env.USER_ID);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div
        id="main-content"
        className="flex flex-col items-start justify-start gap-8 mb-16 w-full min-h-screen"
      >
        <ErrorBoundary>
          <Suspense fallback={<SkeletonDashboard />}>
            <Dashboard userId={env.USER_ID} timestamp={timestamp} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrationBoundary>
  );
}
