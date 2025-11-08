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
import { TitleSection } from '../title/title-section';
import { ChartArea } from '../charts/area-chart';

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

  const [stepsHistory, weightHistory, energyHistory] = await Promise.all([
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
  ]);

  const stepsData = transformMeasurementData(stepsHistory.data);
  const weightData = transformMeasurementData(weightHistory.data);
  const energyData = transformMeasurementData(energyHistory.data);

  console.log('energyData', energyData);

  const currentMetrics = extractCurrentMetrics(user.data, metricIds);

  const goalTargets = extractGoalTargets(goals.data, metricIds);

  const radialCharts = buildAllRadialChartConfigs(currentMetrics, goalTargets);

  return (
    <div className="w-full flex flex-col gap-8">
      <TitleSection className="w-full">
        <h1 className="text-xl">Motivate RichieRich</h1>
      </TitleSection>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ContentCard
          value={currentMetrics.currentWeight}
          title="Current Weight"
          unit="Kgs"
          date={getMetricDate(user.data, metricIds.weight)}
        />
        <ContentCard
          value={goalTargets.weight.toString()}
          title="Target Weight"
          unit="Kgs"
          date={getMetricDate(user.data, metricIds.weight)}
        />
        <ContentCard
          value={(Number(currentMetrics.currentWeight) - goalTargets.weight)
            .toFixed(2)
            .toString()}
          title="Weight Difference"
          unit="Kgs"
          date={getMetricDate(user.data, metricIds.weight)}
          className={
            Number(currentMetrics.currentWeight) - goalTargets.weight >= 0
              ? 'text-red-600'
              : 'text-green-600'
          }
        />
      </div>
      <TitleSection>Daily Activity</TitleSection>
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
          unit={radialCharts.distance.unit}
          title={radialCharts.distance.title}
          description={radialCharts.distance.description}
          chartData={radialCharts.distance.chartData}
          target={radialCharts.distance.target}
          chartConfig={radialCharts.distance.chartConfig}
          dataKey={radialCharts.distance.dataKey}
          footer={undefined}
        />
        <RadialChart
          unit={radialCharts.water.unit}
          title={radialCharts.water.title}
          description={radialCharts.water.description}
          chartData={radialCharts.water.chartData}
          target={radialCharts.water.target}
          chartConfig={radialCharts.water.chartConfig}
          dataKey={radialCharts.water.dataKey}
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

        <RadialChart
          unit={radialCharts.energy.unit}
          title={radialCharts.energy.title}
          description={radialCharts.energy.description}
          chartData={radialCharts.energy.chartData}
          target={radialCharts.energy.target}
          chartConfig={radialCharts.energy.chartConfig}
          dataKey={radialCharts.energy.dataKey}
          footer={undefined}
        />
      </div>

      <TitleSection>Activity</TitleSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WeightChart weightData={weightData} />
        <StepsChart stepData={stepsData} />
        <ChartArea
          chartData={weightData}
          title={'Daily Weight'}
          description={'Weight changes over time.'}
          chartConfig={{}}
          series={[{ dataKey: 'value', color: 'var(--color-chart-4)' }]}
          defaultTimeRange={'7d'}
          dateKey={'value'}
          showLegend={false}
          showTimeRange={true}
        />
        <ChartArea
          chartData={energyData}
          title={'Daily Active Energy'}
          description={'Active energy expenditure over time.'}
          chartConfig={{}}
          series={[{ dataKey: 'value', color: 'var(--color-chart-4)' }]}
          defaultTimeRange={'7d'}
          dateKey={'value'}
          showLegend={false}
          showTimeRange={true}
        />
      </div>
    </div>
  );
};
