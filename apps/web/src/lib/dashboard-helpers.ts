/**
 * Dashboard Data Processing Helpers
 *
 * This module contains specialized helper functions for the dashboard component,
 * focused on data transformation, extraction, and business logic.
 */

import { METRIC_CONFIG } from './utils';
import { getProgressColor, createRadialChartData } from './chart-utils';
import type {
  MetricName,
  MetricIds,
  DashboardMetrics,
  DashboardGoals,
  RadialChartConfig,
  UserDataItem,
  GoalDataItem,
} from '../types';

// ============================================================================
// Metric ID Resolution
// ============================================================================

/**
 * Creates a lookup function for metric IDs with fallback to defaults
 * Uses closure to capture the metricIdMap for efficient lookups
 * @param metricIdMap - Record mapping metric names to IDs
 * @returns Function that resolves metric IDs
 */
export const createMetricIdResolver = (metricIdMap: Record<string, number>) => {
  return (name: MetricName): number =>
    metricIdMap[METRIC_CONFIG[name].name] ?? METRIC_CONFIG[name].defaultId;
};

/**
 * Resolves all metric IDs in a single operation
 * This batches the lookups for better performance
 * @param metricIdMap - Record mapping metric names to IDs
 * @returns Object containing all resolved metric IDs
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
    energy: resolver('energy'),
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
  const extractDate = dataMap.get(metricIds.weight)
    ? userData
        .find((item) => item.metricTypeId === metricIds.weight)
        ?.measuredAt?.toString()
    : undefined;

  return {
    currentWeight: dataMap.get(metricIds.weight),
    currentDistance: dataMap.get(metricIds.distance),
    currentWater: dataMap.get(metricIds.water),
    currentSteps: dataMap.get(metricIds.steps),
    currentExercise: dataMap.get(metricIds.exercise),
    currentStanding: dataMap.get(metricIds.standing),
    currentEnergy: dataMap.get(metricIds.energy),
    dateMeasured: extractDate,
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

  const goalsMapStartingPoint = new Map(
    goalsData.map((goal) => [goal.metricTypeId, Number(goal.startDate)]),
  );

  return {
    weight: {
      value: goalsMap.get(metricIds.weight) ?? defaultTarget,
      startDate:
        goalsMapStartingPoint.get(metricIds.weight) !== undefined
          ? String(goalsMapStartingPoint.get(metricIds.weight))
          : undefined,
    },
    steps: {
      value: goalsMap.get(metricIds.steps) ?? defaultTarget,
      startDate:
        goalsMapStartingPoint.get(metricIds.steps) !== undefined
          ? String(goalsMapStartingPoint.get(metricIds.steps))
          : undefined,
    },
    exercise: {
      value: goalsMap.get(metricIds.exercise) ?? defaultTarget,
      startDate:
        goalsMapStartingPoint.get(metricIds.exercise) !== undefined
          ? String(goalsMapStartingPoint.get(metricIds.exercise))
          : undefined,
    },
    standing: {
      value: goalsMap.get(metricIds.standing) ?? defaultTarget,
      startDate:
        goalsMapStartingPoint.get(metricIds.standing) !== undefined
          ? String(goalsMapStartingPoint.get(metricIds.standing))
          : undefined,
    },
    distance: {
      value: goalsMap.get(metricIds.distance) ?? defaultTarget,
      startDate:
        goalsMapStartingPoint.get(metricIds.distance) !== undefined
          ? String(goalsMapStartingPoint.get(metricIds.distance))
          : undefined,
    },
    water: {
      value: goalsMap.get(metricIds.water) ?? defaultTarget,
      startDate:
        goalsMapStartingPoint.get(metricIds.water) !== undefined
          ? String(goalsMapStartingPoint.get(metricIds.water))
          : undefined,
    },
    energy: {
      value: goalsMap.get(metricIds.energy) ?? defaultTarget,
      startDate:
        goalsMapStartingPoint.get(metricIds.energy) !== undefined
          ? String(goalsMapStartingPoint.get(metricIds.energy))
          : undefined,
    },
  };
};

/**
 * Get the measurement date for a specific metric
 * @param userData - Array of user data items
 * @param metricTypeId - ID of the metric to find
 * @returns Date string or undefined if not found
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
 * Transform measurement data to chart-ready format
 * @param measurements - Array of measurements with date and value
 * @returns Array of chart data points
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
 * Convert water measurement from milliliters to liters
 * @param waterMl - Water value in milliliters
 * @returns Water value in liters, rounded to 2 decimal places
 */
export const convertWaterToLiters = (
  waterMl: string | undefined,
): string | undefined => {
  if (!waterMl) return undefined;
  const liters = Number(waterMl) / 1000;
  return liters.toFixed(2);
};

// ============================================================================
// Radial Chart Configuration
// ============================================================================

/**
 * Build complete configuration for a single radial chart
 * @param config - Configuration object with metric details
 * @returns Complete radial chart configuration
 */
export const buildRadialChartConfig = ({
  dataKey,
  unit,
  title,
  description,
  value,
  target,
  label,
}: {
  dataKey: string;
  unit: string;
  title: string;
  description: string;
  value: string | undefined;
  target: { value: number; startDate?: string | undefined };
  label: string;
}): RadialChartConfig => {
  const numericValue = Number(value ?? 0);
  const fillColor = getProgressColor(numericValue, target.value);

  return {
    unit,
    title,
    description,
    chartData: createRadialChartData(value, dataKey, fillColor),
    target: target.value,
    chartConfig: { [dataKey]: { label } },
    dataKey,
  };
};

export const buildAllRadialChartConfigs = (
  currentMetrics: DashboardMetrics,
  goalTargets: DashboardGoals,
) => {
  const dateMeasured = new Date(
    currentMetrics.dateMeasured ?? '',
  ).toLocaleDateString('en-GB', {
    month: 'short',
    day: 'numeric',
  });
  return {
    steps: buildRadialChartConfig({
      dataKey: 'steps',
      unit: 'steps',
      title: 'Steps',
      description: `Steps taken on ${dateMeasured}`,
      value: currentMetrics.currentSteps,
      target: goalTargets.steps,
      label: 'Steps',
    }),

    standing: buildRadialChartConfig({
      dataKey: 'standing',
      unit: 'mins',
      title: 'Standing',
      description: `Minutes standing on ${dateMeasured}`,
      value: currentMetrics.currentStanding,
      target: goalTargets.standing,
      label: 'Minutes',
    }),

    exercise: buildRadialChartConfig({
      dataKey: 'exercise',
      unit: 'mins',
      title: 'Exercise',
      description: `Exercise minutes on ${dateMeasured}`,
      value: currentMetrics.currentExercise,
      target: goalTargets.exercise,
      label: 'Minutes',
    }),

    water: buildRadialChartConfig({
      dataKey: 'water',
      unit: 'ml',
      title: 'Water Drunk',
      description: `Water drunk on ${dateMeasured}`,
      value: Math.floor(Number(currentMetrics.currentWater)).toString(),
      target: goalTargets.water,
      label: 'ml',
    }),

    distance: buildRadialChartConfig({
      dataKey: 'distance',
      unit: 'km',
      title: 'Distance Walked',
      description: `Distance on ${dateMeasured}`,
      value: currentMetrics.currentDistance,
      target: goalTargets.distance,
      label: 'Kms',
    }),

    energy: buildRadialChartConfig({
      dataKey: 'energy',
      unit: 'kcal',
      title: 'Active Energy',
      description: `Active energy on ${dateMeasured}`,
      value: Math.floor(Number(currentMetrics.currentEnergy ?? '0'))
        .toFixed(0)
        .toString(),
      target: goalTargets.energy,
      label: 'kcal',
    }),
  };
};
