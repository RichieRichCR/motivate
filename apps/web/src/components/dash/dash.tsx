import { api } from '../../lib/api-client';
import { env } from '../../env';
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

export const Dashboard = async () => {
  const userId = env.USER_ID;
  const { startDate, endDate } = getDateRange(DATA_FETCH_WINDOW_DAYS);

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

  // Transform measurement data directly, avoiding intermediate maps
  const transformedData = Object.fromEntries(
    METRIC_TYPES.map((type, index) => [
      type,
      transformMeasurementData(measurementHistories[index].data),
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
        <div className="flex items-center justify-between w-full">
          <TitleSection className="mb-0">Weight Summary</TitleSection>
          {/* <ExportData /> */}
        </div>

        <WeightSection />

        <TitleSection>Daily Activity</TitleSection>

        <RadialChartsSection />

        <TitleSection>Long Term Activity</TitleSection>

        <LinearChartSection />
      </div>
    </DataProvider>
  );
};
