'use client';

import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';
import { queryKeys } from '@/lib/api-queries';

/**
 * RefreshButton component
 * Invalidates all queries and refetches data from the server
 */
export function RefreshButton() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Only render on client to avoid hydration issues
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isClient) {
    return null;
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);

    // Invalidate all queries to force a refetch
    await queryClient.invalidateQueries({
      queryKey: queryKeys.user.all,
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.metrics.all,
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.measurements.all,
    });

    setIsRefreshing(false);
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="bg-card/30 backdrop-blur-2xl text-card-foreground inline-flex rounded-xl border border-foreground/20 shadow-2xl h-10 w-10 justify-center items-center p-2 group cursor-pointer"
      aria-label="Refresh dashboard data"
    >
      <RefreshCw
        className={`h-4 w-4 group-hover:animate-pulse ${isRefreshing ? 'animate-spin' : ''}`}
      />
    </button>
  );
}
