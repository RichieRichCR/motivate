import { ChartDataPoint, MetricData } from '../types';

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-GB');
};

// Time-related constants
export const DAYS_TO_FETCH = 90;
export const DAYS_IN_WEEK = 7;
export const DAYS_IN_MONTH = 30;
export const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

// Chart-related constants
export const CHART_FILL_COLOR = 'var(--color-chart-2)';
export const DEFAULT_TARGET = 10000;

// Cache revalidation (in seconds)
export const CACHE_REVALIDATE_TIME = 60; // 1 minute

// Metric name constants and default IDs
export const METRIC_CONFIG = {
  weight: { name: 'weight', defaultId: 1 },
  steps: { name: 'steps', defaultId: 2 },
  exercise: { name: 'exercise', defaultId: 3 },
  standing: { name: 'standing', defaultId: 6 },
  distance: { name: 'distance', defaultId: 5 },
  water: { name: 'water', defaultId: 4 },
  energy: { name: 'energy', defaultId: 7 },
} as const;

// Helper Types

// Helper Functions
export const getDateRange = (daysBack: number) => {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  const startDate = new Date(now.getTime() - daysBack * MILLISECONDS_PER_DAY)
    .toISOString()
    .split('T')[0];

  return { startDate, endDate };
};

export const formatDateString = (date: string | Date): string => {
  return new Date(date).toISOString().split('T')[0];
};

export const transformMeasurementData = (
  measurements: Array<{ measuredAt: Date; value: string }>,
): ChartDataPoint[] => {
  return measurements.map((m) => ({
    date: formatDateString(m.measuredAt),
    value: Number(m.value),
  }));
};

export const createMetricIdMap = (
  metrics: Array<{ id: number; name: string }>,
): Record<string, number> => {
  return metrics.reduce(
    (acc, metric) => {
      acc[metric.name] = metric.id;
      return acc;
    },
    {} as Record<string, number>,
  );
};

export const getMetricValue = (
  data: MetricData[],
  metricTypeId: number,
): string | undefined => {
  return data.find((d) => d.metricTypeId === metricTypeId)?.value;
};

export const getMetricDate = (
  data: MetricData[],
  metricTypeId: number,
): string | undefined => {
  const measuredAt = data.find(
    (d) => d.metricTypeId === metricTypeId,
  )?.measuredAt;
  return measuredAt?.toString();
};

export const getGoalTarget = (
  goals: Array<{ metricTypeId: number; targetValue: string }>,
  metricTypeId: number,
  defaultValue: number = DEFAULT_TARGET,
): number => {
  const targetValue = goals.find(
    (g) => g.metricTypeId === metricTypeId,
  )?.targetValue;
  return targetValue ? Number(targetValue) : defaultValue;
};

export const createRadialChartData = (value: string | undefined) => {
  return [{ value: Number(value ?? 0), fill: CHART_FILL_COLOR }];
};

/**
 * Get the number of days to subtract based on the time range
 * @param timeRange - The time range selector value (e.g., '7d', '30d', '90d')
 * @returns Number of days to subtract from current date
 */
export const getDaysFromTimeRange = (timeRange: string): number => {
  switch (timeRange) {
    case '7d':
      return DAYS_IN_WEEK;
    case '30d':
      return DAYS_IN_MONTH;
    case '90d':
    default:
      return DAYS_TO_FETCH;
  }
};
