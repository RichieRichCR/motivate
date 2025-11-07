import { StepsChart } from './charts/steps';
import { api } from '../lib/api-client';
import { env } from '../../env';
import { RadialChart } from './charts/radial';
import { WeightChart } from './charts/weight';
import { ContentCard } from './card';

export const Dashboard = async () => {
  const userId = env.USER_ID;
  const user = await api.user.get(userId);
  const goals = await api.user.goals.get(userId);
  const metrics = await api.metrics.get();

  console.log('User Data:', user);

  const weightId = metrics.data.find((m) => m.name === 'weight')?.id ?? 2;
  const stepsId = metrics.data.find((m) => m.name === 'steps')?.id ?? 2;
  const exerciseId = metrics.data.find((m) => m.name === 'exercise')?.id ?? 3;
  const standingId = metrics.data.find((m) => m.name === 'standing')?.id ?? 3;
  const distanceId = metrics.data.find((m) => m.name === 'distance')?.id ?? 5;
  const waterId = metrics.data.find((m) => m.name === 'water')?.id ?? 4;

  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  const startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const totalSteps = await api.user.measurements.getById({
    userId,
    measurementId: stepsId,
    endDate,
    startDate,
  });

  const stepsData = totalSteps.data.map((m) => ({
    date: new Date(m.measuredAt).toISOString().split('T')[0],
    value: Number(m.value),
  }));

  const totalWeight = await api.user.measurements.getById({
    userId,
    measurementId: weightId,
    endDate,
    startDate,
  });

  const weightData = totalWeight.data.map((m) => ({
    date: new Date(m.measuredAt).toISOString().split('T')[0],
    value: Number(m.value),
  }));

  console.log('Weight Data:', weightData);

  const steps = user.data.find((m) => m.metricTypeId === stepsId)?.value;
  const stepsChartData = [{ steps, fill: 'var(--color-chart-2)' }];

  const exercise = user.data.find((m) => m.metricTypeId === exerciseId)?.value;
  const exerciseChartData = [{ exercise, fill: 'var(--color-chart-2)' }];

  const standing = user.data.find((m) => m.metricTypeId === standingId)?.value;
  const standingChartData = [{ standing, fill: 'var(--color-chart-2)' }];

  const mergedData = weightData.map((weightEntry) => {
    const stepEntry = stepsData.find((step) => step.date === weightEntry.date);
    return {
      date: weightEntry.date,
      weight: weightEntry.value,
      steps: stepEntry ? stepEntry.value : 0,
    };
  });
  console.log('Exercise Chart Data:', mergedData);

  return (
    <div className="w-full flex flex-col gap-8 px-4 py-6 md:px-8 lg:px-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ContentCard
          value={user.data.find((d) => d.metricTypeId === weightId)?.value}
          title="Current Weight"
          unit="Kgs"
          date={
            user.data
              .find((d) => d.metricTypeId === weightId)
              ?.measuredAt?.toString() ?? undefined
          }
        />
        <ContentCard
          value={user.data.find((d) => d.metricTypeId === distanceId)?.value}
          title="Distance Walked"
          unit="Kms"
          date={
            user.data
              .find((d) => d.metricTypeId === distanceId)
              ?.measuredAt?.toString() ?? undefined
          }
        />
        <ContentCard
          value={(
            Number(user.data.find((d) => d.metricTypeId === waterId)?.value) /
            1000
          ).toString()}
          title="Water Drunk"
          unit="L"
          date={
            user.data
              .find((d) => d.metricTypeId === waterId)
              ?.measuredAt?.toString() ?? undefined
          }
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <WeightChart weightData={weightData} />
        <StepsChart stepData={stepsData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <RadialChart
          chartTitle={'steps'}
          title={'Steps'}
          description={'Steps taken today'}
          chartData={stepsChartData}
          target={
            Number(
              goals.data.find((g) => g.metricTypeId === stepsId)?.targetValue,
            ) ?? 10000
          }
          chartConfig={{
            steps: {
              label: 'Steps',
            },
          }}
          dataKey={'steps'}
          footer={undefined}
        />
        <RadialChart
          chartTitle={'minutes'}
          title={'Exercise'}
          description={'Exercise Minutes today'}
          chartData={exerciseChartData}
          target={
            Number(
              goals.data.find((g) => g.metricTypeId === exerciseId)
                ?.targetValue,
            ) ?? 10000
          }
          chartConfig={{
            steps: {
              label: 'Minutes',
            },
          }}
          dataKey={'exercise'}
          footer={undefined}
        />
        <RadialChart
          chartTitle={'minutes'}
          title={'Standing'}
          description={'Mintues Standing Today'}
          chartData={standingChartData}
          target={
            Number(
              goals.data.find((g) => g.metricTypeId === standingId)
                ?.targetValue,
            ) ?? 10000
          }
          chartConfig={{
            standing: {
              label: 'Minutes',
            },
          }}
          dataKey={'standing'}
          footer={undefined}
        />
      </div>
    </div>
  );
};
