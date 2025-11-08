import { StepsChart } from '../charts/steps';
import { api } from '../../lib/api-client';
import { env } from '../../env';
import { RadialChart } from '../charts/radial';
import { WeightChart } from '../charts/weight';
import { ContentCard } from '../card/card';
import {
  createMetricIdMap,
  DAYS_TO_FETCH,
  getDateRange,
} from '../../lib/utils';
import {
  buildAllRadialChartConfigs,
  convertWaterToLiters,
  extractCurrentMetrics,
  extractGoalTargets,
  getMetricDate,
  resolveAllMetricIds,
  transformMeasurementData,
} from '../../lib/dashboard-helpers';

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

  const [stepsHistory, weightHistory] = await Promise.all([
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
  ]);

  const stepsData = transformMeasurementData(stepsHistory.data);
  const weightData = transformMeasurementData(weightHistory.data);

  const currentMetrics = extractCurrentMetrics(user.data, metricIds);

  const goalTargets = extractGoalTargets(goals.data, metricIds);

  const radialCharts = buildAllRadialChartConfigs(currentMetrics, goalTargets);

  const waterInLiters = convertWaterToLiters(currentMetrics.currentWater);

  return (
    <div className="w-full flex flex-col gap-8 px-4 py-6 md:px-8 lg:px-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ContentCard
          value={currentMetrics.currentWeight}
          title="Current Weight"
          unit="Kgs"
          date={getMetricDate(user.data, metricIds.weight)}
        />
        <ContentCard
          value={currentMetrics.currentDistance}
          title="Distance Walked"
          unit="Kms"
          date={getMetricDate(user.data, metricIds.distance)}
        />
        <ContentCard
          value={waterInLiters}
          title="Water Drunk"
          unit="L"
          date={getMetricDate(user.data, metricIds.water)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WeightChart weightData={weightData} />
        <StepsChart stepData={stepsData} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <RadialChart
          unit={radialCharts.steps.unit}
          title={radialCharts.steps.title}
          description={radialCharts.steps.description}
          chartData={radialCharts.steps.chartData}
          target={radialCharts.steps.target}
          chartConfig={radialCharts.steps.chartConfig}
          dataKey={radialCharts.steps.dataKey}
          footer={undefined}
        />
        <RadialChart
          unit={radialCharts.exercise.unit}
          title={radialCharts.exercise.title}
          description={radialCharts.exercise.description}
          chartData={radialCharts.exercise.chartData}
          target={radialCharts.exercise.target}
          chartConfig={radialCharts.exercise.chartConfig}
          dataKey={radialCharts.exercise.dataKey}
          footer={undefined}
        />
        <RadialChart
          unit={radialCharts.standing.unit}
          title={radialCharts.standing.title}
          description={radialCharts.standing.description}
          chartData={radialCharts.standing.chartData}
          target={radialCharts.standing.target}
          chartConfig={radialCharts.standing.chartConfig}
          dataKey={radialCharts.standing.dataKey}
          footer={undefined}
        />
      </div>
    </div>
  );
};
