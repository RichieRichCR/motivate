import { ChartDataPoint, MetricData } from '../types';

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

// Constants
export const DAYS_TO_FETCH = 90;
export const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
export const CHART_FILL_COLOR = 'var(--color-chart-2)';
export const DEFAULT_TARGET = 10000;

// Metric name constants and default IDs
export const METRIC_CONFIG = {
  weight: { name: 'weight', defaultId: 2 },
  steps: { name: 'steps', defaultId: 2 },
  exercise: { name: 'exercise', defaultId: 3 },
  standing: { name: 'standing', defaultId: 3 },
  distance: { name: 'distance', defaultId: 5 },
  water: { name: 'water', defaultId: 4 },
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
