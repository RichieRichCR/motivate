import { api } from '../../lib/api-client';
import { env } from '../../env';
import {
  createMetricIdMap,
  DAYS_TO_FETCH,
  getDateRange,
} from '../../lib/utils';
import {
  buildAllRadialChartConfigs,
  extractCurrentMetrics,
  extractGoalTargets,
  resolveAllMetricIds,
  transformMeasurementData,
} from '../../lib/dashboard-helpers';
import { TitleSection } from '../title/title-section';
import { DataProvider } from '@/app/provider/data';
import { WeightSection } from '../weight-section';
import { RadialChartsSection } from '../radial-charts-section';
import { LinearChartSection } from '../linear-chart-section';

const METRIC_TYPES = [
  'steps',
  'weight',
  'energy',
  'exercise',
  'distance',
  'water',
] as const;

type MetricType = (typeof METRIC_TYPES)[number];

export const Dashboard = async () => {
  const userId = env.USER_ID;
  const { startDate, endDate } = getDateRange(DAYS_TO_FETCH);

  // Fetch user data, goals, and available metrics
  const [user, goals, metrics] = await Promise.all([
    api.user.get(userId),
    api.user.goals.get(userId),
    api.metrics.get(),
  ]);

  const metricIdMap = createMetricIdMap(metrics.data);
  const metricIds = resolveAllMetricIds(metricIdMap);

  // Fetch all measurement histories in parallel
  const measurementHistories = await Promise.all(
    METRIC_TYPES.map((type) =>
      api.user.measurements.getById({
        userId,
        measurementId: metricIds[type],
        startDate,
        endDate,
      }),
    ),
  );

  // Create a map of metric type to history data
  const historyMap = METRIC_TYPES.reduce(
    (acc, type, index) => {
      acc[type] = measurementHistories[index];
      return acc;
    },
    {} as Record<MetricType, (typeof measurementHistories)[number]>,
  );

  // Transform all measurement data
  const transformedData = Object.fromEntries(
    METRIC_TYPES.map((type) => [
      type,
      transformMeasurementData(historyMap[type].data),
    ]),
  ) as Record<MetricType, ReturnType<typeof transformMeasurementData>>;

  const currentMetrics = extractCurrentMetrics(user.data, metricIds);
  const goalTargets = extractGoalTargets(goals.data, metricIds);
  const radialCharts = buildAllRadialChartConfigs(currentMetrics, goalTargets);

  const data = {
    userId,
    startDate,
    endDate,
    user,
    goals,
    metrics,
    linearCharts: {
      steps: transformedData.steps,
      weight: transformedData.weight,
      exercise: transformedData.exercise,
      energy: transformedData.energy,
      distance: transformedData.distance,
      water: transformedData.water,
    },
    radialCharts,
    currentMetrics,
    goalTargets,
    stepsHistory: historyMap.steps,
    weightHistory: historyMap.weight,
    energyHistory: historyMap.energy,
    exerciseHistory: historyMap.exercise,
    metricIdMap,
    metricIds,
  };

  return (
    <DataProvider data={data}>
      <div className="w-full flex flex-col gap-8">
        <TitleSection className="w-full mt-8">Welcome</TitleSection>
        <div className="max-w-3xl backdrop-blur-sm flex items-center p-6 md:p-8 rounded-2xl shadow-md bg-card">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Track. Measure. Stay accountable. This dashboard helps me stay
            motivated on my health journey with data syncing from my Apple Watch
            and iPhone via HealthKit every night at 2am.
          </p>
        </div>

        <TitleSection className="w-full">Weight Summary</TitleSection>

        <WeightSection />

        <TitleSection>Daily Activity</TitleSection>

        <RadialChartsSection />

        <TitleSection>Activity</TitleSection>

        <LinearChartSection />
      </div>
    </DataProvider>
  );
};
