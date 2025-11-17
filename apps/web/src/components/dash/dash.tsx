'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import {
  createMetricIdMap,
  getDateRange,
  METRIC_TYPES,
  DATA_FETCH_WINDOW_DAYS,
  type MetricType,
} from '../../lib/utils';
import {
  buildAllRadialChartConfigs,
  extractCurrentMetrics,
  extractGoalTargets,
  resolveAllMetricIds,
  transformMeasurementData,
} from '../../lib/dashboard-helpers';
import { TitleSection } from '../title/title-section';
import { DataProvider } from '@/app/provider/data-provider';
import { WeightSection } from '../weight-section';
import { RadialChartsSection } from '../radial-charts-section';
import { LinearChartSection } from '../linear-chart-section';
import {
  getUserQueryOptions,
  getGoalsQueryOptions,
  getMetricsQueryOptions,
  getAllMeasurementQueryOptions,
} from '@/lib/api-queries';

interface DashboardProps {
  userId: string;
}

export const Dashboard = ({ userId }: DashboardProps) => {
  const { startDate, endDate } = getDateRange(DATA_FETCH_WINDOW_DAYS);

  // Fetch user data, goals, and available metrics using React Query with Suspense
  const { data: user } = useSuspenseQuery(getUserQueryOptions(userId));
  const { data: goals } = useSuspenseQuery(getGoalsQueryOptions(userId));
  const { data: metrics } = useSuspenseQuery(getMetricsQueryOptions());

  // Calculate metric IDs (safe even if metrics not loaded - will create placeholder queries)
  const metricIdMap = metrics ? createMetricIdMap(metrics.data) : {};
  const metricIds = metrics
    ? resolveAllMetricIds(metricIdMap)
    : {
        weight: 1, // Use placeholder IDs that won't match real data
        steps: 1,
        exercise: 1,
        standing: 1,
        distance: 1,
        water: 1,
        energy: 1,
      };

  // Get all measurement query options
  const measurementQueries = getAllMeasurementQueryOptions(
    userId,
    metricIds,
    startDate,
    endDate,
  );

  // Fetch all measurements using useSuspenseQuery hooks
  const measurementResults = [
    useSuspenseQuery(measurementQueries[0]), // steps
    useSuspenseQuery(measurementQueries[1]), // weight
    useSuspenseQuery(measurementQueries[2]), // energy
    useSuspenseQuery(measurementQueries[3]), // exercise
    useSuspenseQuery(measurementQueries[4]), // distance
    useSuspenseQuery(measurementQueries[5]), // water
  ];

  const measurementHistories = measurementResults.map((result) => result.data);

  // Transform measurement data directly, avoiding intermediate maps
  const transformedData = Object.fromEntries(
    METRIC_TYPES.map((type, index) => [
      type,
      transformMeasurementData(measurementHistories[index].data),
    ]),
  ) as Record<MetricType, ReturnType<typeof transformMeasurementData>>;

  const currentMetrics = extractCurrentMetrics(
    user.data,
    metricIds,
    measurementHistories[1].data, // Pass weight history for fallback
  );
  const goalTargets = extractGoalTargets(goals.data, metricIds);
  const radialCharts = buildAllRadialChartConfigs(currentMetrics, goalTargets);

  const data = {
    userId,
    startDate,
    endDate,
    user,
    goals,
    metrics,
    linearCharts: transformedData,
    radialCharts,
    currentMetrics,
    goalTargets,
    stepsHistory: measurementHistories[0],
    weightHistory: measurementHistories[1],
    energyHistory: measurementHistories[2],
    exerciseHistory: measurementHistories[3],
    metricIdMap,
    metricIds,
  };

  return (
    <DataProvider data={data}>
      <div className="w-full flex flex-col gap-8">
        <TitleSection className="mb-0">Weight Summary</TitleSection>

        <WeightSection />

        <TitleSection>Daily Activity</TitleSection>

        <RadialChartsSection />

        <TitleSection>Long Term Activity</TitleSection>

        <LinearChartSection />
      </div>
    </DataProvider>
  );
};
