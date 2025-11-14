import { QueryClient } from '@tanstack/react-query';
import { api } from './api-client';
import {
  createMetricIdMap,
  getDateRange,
  METRIC_TYPES,
  DATA_FETCH_WINDOW_DAYS,
  type MetricType,
} from './utils';
import { resolveAllMetricIds } from './dashboard-helpers';

/**
 * Query Keys Factory
 * Centralized query key management following TanStack Query best practices
 */
export const queryKeys = {
  user: {
    all: ['user'] as const,
    detail: (userId: string) => [...queryKeys.user.all, userId] as const,
    goals: (userId: string) =>
      [...queryKeys.user.detail(userId), 'goals'] as const,
  },
  metrics: {
    all: ['metrics'] as const,
    list: () => [...queryKeys.metrics.all, 'list'] as const,
  },
  measurements: {
    all: ['measurements'] as const,
    list: (
      userId: string,
      metricId: number,
      startDate: string,
      endDate: string,
    ) =>
      [
        ...queryKeys.measurements.all,
        userId,
        metricId,
        startDate,
        endDate,
      ] as const,
    byType: (
      userId: string,
      type: string,
      startDate: string,
      endDate: string,
    ) =>
      [
        ...queryKeys.measurements.all,
        'type',
        userId,
        type,
        startDate,
        endDate,
      ] as const,
  },
} as const;

/**
 * Query Options Factory
 * Defines the query functions for each data type
 */

export function getUserQueryOptions(userId: string) {
  return {
    queryKey: queryKeys.user.detail(userId),
    queryFn: async () => {
      const response = await fetch(`/api/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
  };
}

export function getGoalsQueryOptions(userId: string) {
  return {
    queryKey: queryKeys.user.goals(userId),
    queryFn: async () => {
      const response = await fetch(`/api/user/${userId}/goals`);
      if (!response.ok) throw new Error('Failed to fetch goals');
      return response.json();
    },
  };
}

export function getMetricsQueryOptions() {
  return {
    queryKey: queryKeys.metrics.list(),
    queryFn: async () => {
      const response = await fetch('/api/metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      return response.json();
    },
  };
}

export function getMeasurementQueryOptions(
  userId: string,
  measurementId: number,
  startDate: string,
  endDate: string,
) {
  return {
    queryKey: queryKeys.measurements.list(
      userId,
      measurementId,
      startDate,
      endDate,
    ),
    queryFn: async () => {
      const params = new URLSearchParams({ startDate, endDate });
      const response = await fetch(
        `/api/user/${userId}/measurements/${measurementId}?${params}`,
      );
      if (!response.ok) throw new Error('Failed to fetch measurements');
      return response.json();
    },
  };
}

/**
 * Helper function to get all measurement query options for all metric types
 */
export function getAllMeasurementQueryOptions(
  userId: string,
  metricIds: Record<MetricType, number>,
  startDate: string,
  endDate: string,
) {
  return METRIC_TYPES.map((type) =>
    getMeasurementQueryOptions(
      userId,
      metricIds[type as MetricType],
      startDate,
      endDate,
    ),
  );
}

/**
 * Prefetch all dashboard data
 * This function is called on the server to prefetch all queries
 * Uses direct API calls since it runs on the server with access to API_KEY
 */
export async function prefetchDashboardData(
  queryClient: QueryClient,
  userId: string,
) {
  const { startDate, endDate } = getDateRange(DATA_FETCH_WINDOW_DAYS);

  // Prefetch user, goals, and metrics using direct API calls (server-side)
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.user.detail(userId),
      queryFn: () => api.user.get(userId),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.user.goals(userId),
      queryFn: () => api.user.goals.get(userId),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.metrics.list(),
      queryFn: () => api.metrics.get(),
    }),
  ]);

  // Get metrics to resolve metric IDs
  const metrics = queryClient.getQueryData(queryKeys.metrics.list()) as Awaited<
    ReturnType<typeof api.metrics.get>
  >;

  if (!metrics) {
    throw new Error('Metrics not found in cache');
  }

  const metricIdMap = createMetricIdMap(metrics.data);
  const metricIds = resolveAllMetricIds(metricIdMap);

  // Prefetch all measurements using direct API calls (server-side)
  await Promise.all(
    METRIC_TYPES.map((type) =>
      queryClient.prefetchQuery({
        queryKey: queryKeys.measurements.list(
          userId,
          metricIds[type as MetricType],
          startDate,
          endDate,
        ),
        queryFn: () =>
          api.user.measurements.getById({
            userId,
            measurementId: metricIds[type as MetricType],
            startDate,
            endDate,
          }),
      }),
    ),
  );

  return { userId, startDate, endDate, metricIds };
}
