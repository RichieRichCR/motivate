import { Dashboard } from '../components/dash/dash';
import { ErrorBoundary } from '../components/error-boundary';
import { Suspense } from 'react';
import { SkeletonDashboard } from '@/components/skeleton-dashboard';

// Revalidate every 24 hours
export const revalidate = 86400; // 60 * 60 * 24 seconds

export default async function Home() {
  return (
    <div
      id="main-content"
      className="container flex flex-col items-start justify-center gap-8 mb-16 w-full"
    >
      <ErrorBoundary>
        <Suspense fallback={<SkeletonDashboard />}>
          <Dashboard />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
