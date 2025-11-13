import { METRIC_CONFIG } from './lib/utils';

// ============================================================================
// Basic Types
// ============================================================================

export type MetricName = keyof typeof METRIC_CONFIG;
export type MetricType =
  | 'steps'
  | 'weight'
  | 'energy'
  | 'exercise'
  | 'distance'
  | 'water';

export type ChartDataPoint = { date: string; value: number };

// ============================================================================
// Component Props
// ============================================================================

export interface ContentCardProps {
  value: string | undefined;
  title: string;
  unit: string;
  date: string | undefined;
  className?: string;
}

// ============================================================================
// Dashboard Types
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

// ============================================================================
// Chart Types
// ============================================================================

export type ChartDataType = Array<{
  date: string;
  value: number;
}>;

export interface RadialChartConfig {
  unit: string;
  title: string;
  description: string;
  chartData: Array<{ [key: string]: number | string }>;
  target: number;
  chartConfig: { [key: string]: { label: string } };
  dataKey: string;
}

// ============================================================================
// Data Types
// ============================================================================

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

export interface WeightHistoryEntry {
  measuredAt: Date;
  value: string;
}

export interface MetricData {
  metricTypeId: number;
  value: string;
  measuredAt?: Date;
}

// ============================================================================
// Hook Types
// ============================================================================

export interface UseWeightCalculationsProps {
  currentWeight: string | undefined;
  targetWeight: number;
  weightHistory: WeightHistoryEntry[];
  startDate?: string;
}

export interface WeightCalculations {
  weightToGo: number;
  sevenDayTrend: number | null;
  thirtyDayTrend: number | null;
  ninetyDayTrend: number | null;
  progress: number;
  isAboveTarget: boolean;
  sevenDayIsTrendingDown: boolean;
  thirtyDayIsTrendingDown: boolean;
  ninetyDayIsTrendingDown: boolean;
}
