/**
 * Dashboard Data Processing Helpers
 *
 * This module contains specialized helper functions for the dashboard component,
 * focused on data transformation, extraction, and business logic.
 */

import { METRIC_CONFIG } from './utils';
import type { MetricName } from '../types';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface MetricIds {
  weight: number;
  steps: number;
  exercise: number;
  standing: number;
  distance: number;
  water: number;
}

export interface DashboardMetrics {
  currentWeight?: string;
  currentDistance?: string;
  currentWater?: string;
  currentSteps?: string;
  currentExercise?: string;
  currentStanding?: string;
}

export interface DashboardGoals {
  steps: number;
  exercise: number;
  standing: number;
}

export interface RadialChartConfig {
  chartTitle: string;
  title: string;
  description: string;
  chartData: Array<{ [key: string]: number | string }>;
  target: number;
  chartConfig: { [key: string]: { label: string } };
  dataKey: string;
}

export interface UserDataItem {
  metricTypeId: number;
  value: string;
  measuredAt?: Date;
}

export interface GoalDataItem {
  metricTypeId: number;
  targetValue: string;
}

// ============================================================================
// Metric ID Resolution
// ============================================================================

/**
 * Creates a lookup function for metric IDs with fallback to defaults
 * Uses closure to capture the metricIdMap for efficient lookups
 */
export const createMetricIdResolver = (metricIdMap: Record<string, number>) => {
  return (name: MetricName): number =>
    metricIdMap[METRIC_CONFIG[name].name] ?? METRIC_CONFIG[name].defaultId;
};

/**
 * Resolves all metric IDs in a single operation
 * This batches the lookups for better performance
 */
export const resolveAllMetricIds = (
  metricIdMap: Record<string, number>,
): MetricIds => {
  const resolver = createMetricIdResolver(metricIdMap);
  return {
    weight: resolver('weight'),
    steps: resolver('steps'),
    exercise: resolver('exercise'),
    standing: resolver('standing'),
    distance: resolver('distance'),
    water: resolver('water'),
  };
};

// ============================================================================
// Data Extraction
// ============================================================================

/**
 * Extracts current metric values from user data
 * Uses Map for O(1) lookup complexity instead of O(n) with array.find()
 *
 * @performance For n=6 metrics: O(m + 6) vs O(6m) where m is userData length
 */
export const extractCurrentMetrics = (
  userData: UserDataItem[],
  metricIds: MetricIds,
): DashboardMetrics => {
  // Create a Map for O(1) lookup instead of repeated array.find() calls
  const dataMap = new Map(
    userData.map((item) => [item.metricTypeId, item.value]),
  );

  return {
    currentWeight: dataMap.get(metricIds.weight),
    currentDistance: dataMap.get(metricIds.distance),
    currentWater: dataMap.get(metricIds.water),
    currentSteps: dataMap.get(metricIds.steps),
    currentExercise: dataMap.get(metricIds.exercise),
    currentStanding: dataMap.get(metricIds.standing),
  };
};

/**
 * Extracts goal targets from goals data
 * Uses Map for O(1) lookup complexity
 *
 * @param goalsData - Array of goal data items
 * @param metricIds - Resolved metric IDs
 * @param defaultTarget - Fallback value when goal is not set
 */
export const extractGoalTargets = (
  goalsData: GoalDataItem[],
  metricIds: MetricIds,
  defaultTarget = 10000,
): DashboardGoals => {
  // Create a Map for O(1) lookup
  const goalsMap = new Map(
    goalsData.map((goal) => [goal.metricTypeId, Number(goal.targetValue)]),
  );

  return {
    steps: goalsMap.get(metricIds.steps) ?? defaultTarget,
    exercise: goalsMap.get(metricIds.exercise) ?? defaultTarget,
    standing: goalsMap.get(metricIds.standing) ?? defaultTarget,
  };
};

/**
 * Gets the measurement date for a specific metric
 * Falls back to find() since we only call this a few times
 */
export const getMetricDate = (
  userData: UserDataItem[],
  metricTypeId: number,
): string | undefined => {
  return userData
    .find((d) => d.metricTypeId === metricTypeId)
    ?.measuredAt?.toString();
};

// ============================================================================
// Data Transformation
// ============================================================================

/**
 * Transforms measurement data for chart consumption
 * Converts API format to chart-ready format
 */
export const transformMeasurementData = (
  measurements: Array<{ measuredAt: Date; value: string }>,
) => {
  return measurements.map((m) => ({
    date: new Date(m.measuredAt).toISOString().split('T')[0],
    value: Number(m.value),
  }));
};

/**
 * Converts water measurement from milliliters to liters
 * Returns undefined if value is not provided
 */
export const convertWaterToLiters = (
  waterMl: string | undefined,
): string | undefined => {
  if (!waterMl) return undefined;
  const liters = Number(waterMl) / 1000;
  return liters.toFixed(2);
};

// ============================================================================
// Chart Configuration
// ============================================================================

/**
 * Creates radial chart data with fill color
 * Ensures data is in the correct format for the chart component
 */
export const createRadialChartData = (
  value: string | undefined,
  dataKey: string,
  fillColor = 'var(--color-chart-2)',
) => {
  return [{ [dataKey]: Number(value ?? 0), fill: fillColor }];
};

/**
 * Builds a complete configuration object for radial charts
 * This provides a consistent interface for all radial charts
 */
export const buildRadialChartConfig = (
  dataKey: string,
  title: string,
  description: string,
  value: string | undefined,
  target: number,
  label: string,
): RadialChartConfig => ({
  chartTitle: dataKey,
  title,
  description,
  chartData: createRadialChartData(value, dataKey),
  target,
  chartConfig: { [dataKey]: { label } },
  dataKey,
});

/**
 * Builds configurations for all radial charts
 * Reduces repetition in the main component
 */
export const buildAllRadialChartConfigs = (
  currentMetrics: DashboardMetrics,
  goalTargets: DashboardGoals,
) => {
  return {
    steps: buildRadialChartConfig(
      'steps',
      'Steps',
      'Steps taken today',
      currentMetrics.currentSteps,
      goalTargets.steps,
      'Steps',
    ),
    exercise: buildRadialChartConfig(
      'exercise',
      'Exercise',
      'Exercise minutes today',
      currentMetrics.currentExercise,
      goalTargets.exercise,
      'Minutes',
    ),
    standing: buildRadialChartConfig(
      'standing',
      'Standing',
      'Minutes standing today',
      currentMetrics.currentStanding,
      goalTargets.standing,
      'Minutes',
    ),
  };
};
