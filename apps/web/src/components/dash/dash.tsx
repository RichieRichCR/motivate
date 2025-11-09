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

export const Dashboard = async () => {
  const userId = env.USER_ID;
  const { startDate, endDate } = getDateRange(DAYS_TO_FETCH);

  const [user, goals, metrics] = await Promise.all([
    api.user.get(userId),
    api.user.goals.get(userId),
    api.metrics.get(),
  ]);

  const metricIdMap = createMetricIdMap(metrics.data);
  const metricIds = resolveAllMetricIds(metricIdMap);

  const [
    stepsHistory,
    weightHistory,
    energyHistory,
    exerciseHistory,
    distanceHistory,
    waterHistory,
  ] = await Promise.all([
    api.user.measurements.getById({
      userId,
      measurementId: metricIds.steps,
      startDate,
      endDate,
    }),
    api.user.measurements.getById({
      userId,
      measurementId: metricIds.weight,
      startDate,
      endDate,
    }),
    api.user.measurements.getById({
      userId,
      measurementId: metricIds.energy,
      startDate,
      endDate,
    }),
    api.user.measurements.getById({
      userId,
      measurementId: metricIds.exercise,
      startDate,
      endDate,
    }),
    api.user.measurements.getById({
      userId,
      measurementId: metricIds.distance,
      startDate,
      endDate,
    }),
    api.user.measurements.getById({
      userId,
      measurementId: metricIds.water,
      startDate,
      endDate,
    }),
  ]);

  const stepsData = transformMeasurementData(stepsHistory.data);
  const weightData = transformMeasurementData(weightHistory.data);
  const energyData = transformMeasurementData(energyHistory.data);
  const exerciseData = transformMeasurementData(exerciseHistory.data);
  const distanceData = transformMeasurementData(distanceHistory.data);
  const waterData = transformMeasurementData(waterHistory.data);

  const currentMetrics = extractCurrentMetrics(user.data, metricIds);

  const goalTargets = extractGoalTargets(goals.data, metricIds);

  const radialCharts = buildAllRadialChartConfigs(currentMetrics, goalTargets);

  return (
    <DataProvider
      data={{
        userId,
        startDate,
        endDate,
        user,
        goals,
        metrics,
        linearCharts: {
          steps: stepsData,
          weight: weightData,
          exercise: exerciseData,
          energy: energyData,
          distance: distanceData,
          water: waterData,
        },
        radialCharts,
        currentMetrics,
        goalTargets,
        stepsHistory,
        weightHistory,
        energyHistory,
        exerciseHistory,
        metricIdMap,
        metricIds,
      }}
    >
      <div className="w-full flex flex-col gap-8">
        <TitleSection className="w-full">
          <h1 className="text-xl">Dashboard</h1>
        </TitleSection>

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
