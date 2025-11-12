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
  energy: number;
}

export interface DashboardMetrics {
  currentWeight?: string;
  currentDistance?: string;
  currentWater?: string;
  currentSteps?: string;
  currentExercise?: string;
  currentStanding?: string;
  currentEnergy?: string;
  dateMeasured?: string;
}

export interface DashboardGoals {
  weight: { value: number; startDate?: string | undefined };
  steps: { value: number; startDate?: string | undefined };
  exercise: { value: number; startDate?: string | undefined };
  standing: { value: number; startDate?: string | undefined };
  water: { value: number; startDate?: string | undefined };
  distance: { value: number; startDate?: string | undefined };
  energy: { value: number; startDate?: string | undefined };
}

export interface RadialChartConfig {
  unit: string;
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
  startDate?: string;
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
 * Assigns a color variant based on proximity to target
 *
 * @param value - Current value
 * @param target - Target value
 * @returns CSS variable string for the appropriate color
 *
 * Logic:
 * - Below target: Red variants (--color-chart-red-1 to red-5)
 *   - Darker red = further from target
 * - At or above target: Green variants (--color-chart-1 to chart-5)
 *   - Darker green = further above target
 * - 20% ranges: 0-20%, 20-40%, 40-60%, 60-80%, 80-100%+
 */
export const getProgressColor = (
  value: number,
  target: number,
  includeVar = true,
): string => {
  const percentage = (value / target) * 100;

  console.log('Calculating progress color:', { value, target, percentage });

  let colorString = '';

  if (percentage < 100) {
    if (percentage < 20) colorString = '--color-chart-red-5';
    if (percentage < 40) colorString = '--color-chart-red-4';
    if (percentage < 60) colorString = '--color-chart-red-3';
    if (percentage < 80) colorString = '--color-chart-red-2';
    colorString = '--color-chart-red-1';
    return includeVar ? `var(${colorString})` : colorString;
  }

  const overPercentage = percentage - 100; // How much over target
  if (overPercentage === 0) colorString = '--color-chart-1';
  if (overPercentage < 20) colorString = '--color-chart-1';
  if (overPercentage < 40) colorString = '--color-chart-2';
  if (overPercentage < 60) colorString = '--color-chart-3';
  if (overPercentage < 80) colorString = '--color-chart-4';
  colorString = '--color-chart-5';

  return includeVar ? `var(${colorString})` : colorString;
};

export const getProgressClass = (value: number, target: number): string => {
  const percentage = (value / target) * 100;

  if (percentage < 100) {
    if (percentage < 20) return 'chart-20';
    if (percentage < 40) return 'chart-40';
    if (percentage < 60) return 'chart-60';
    if (percentage < 80) return 'chart-80';
    return 'chart-100';
  }

  const overPercentage = percentage - 100; // How much over target
  if (overPercentage === 0) return 'chart-120';
  if (overPercentage < 20) return 'chart-120';
  if (overPercentage < 40) return 'chart-140';
  if (overPercentage < 60) return 'chart-160';
  if (overPercentage < 80) return 'chart-180';
  return 'chart-200';
};

/**
 * Creates radial chart data with fill color
 * Ensures data is in the correct format for the chart component
 */
export const createRadialChartData = (
  value: string | undefined,
  dataKey: string,
  fillColor = 'var(--color-chart-2)',
  fillOpacity = 0.7,
) => {
  return [{ [dataKey]: Number(value ?? 0), fill: fillColor, fillOpacity }];
};

/**
 * Builds a complete configuration object for radial charts
 * This provides a consistent interface for all radial charts
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

  console.log('Radial Chart Config:', {
    dataKey,
    unit,
    title,
    description,
    value: numericValue,
    target: target.value,
    label,
    fillColor,
  });

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
      unit: 'Steps',
      title: 'Steps',
      description: `Steps taken on ${dateMeasured}`,
      value: currentMetrics.currentSteps,
      target: goalTargets.steps,
      label: 'Steps',
    }),

    standing: buildRadialChartConfig({
      dataKey: 'standing',
      unit: 'Minutes',
      title: 'Standing',
      description: `Minutes standing on ${dateMeasured}`,
      value: currentMetrics.currentStanding,
      target: goalTargets.standing,
      label: 'Minutes',
    }),

    exercise: buildRadialChartConfig({
      dataKey: 'exercise',
      unit: 'Minutes',
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
      value: currentMetrics.currentWater,
      target: goalTargets.water,
      label: 'ml',
    }),

    distance: buildRadialChartConfig({
      dataKey: 'distance',
      unit: 'Kms',
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
