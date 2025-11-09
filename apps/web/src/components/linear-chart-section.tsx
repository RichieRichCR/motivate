'use client';

import { useDataContext } from '@/app/provider/data';
import { ChartArea } from './charts/area-chart';
import { useMemo } from 'react';

// Common chart configuration to reduce duplication
const COMMON_CHART_PROPS = {
  defaultTimeRange: '7d' as const,
  dateKey: 'date' as const,
  showLegend: false,
  showTimeRange: false,
};

export const LinearChartSection = () => {
  const {
    linearCharts: { weight, steps, energy, exercise, distance, water },
  } = useDataContext();

  const chartConfigs = useMemo(
    () => [
      {
        data: weight,
        title: 'Daily Weight',
        description: 'Weight changes over time.',
        color: 'var(--color-chart-3)',
        label: 'Weight',
        configKey: 'weight',
      },
      {
        data: steps,
        title: 'Daily Steps',
        description: 'Step count changes over time.',
        color: 'var(--color-chart-3)',
        label: 'Steps',
        configKey: 'steps',
      },
      {
        data: energy,
        title: 'Daily Active Energy',
        description: 'Active energy expenditure over time.',
        color: 'var(--color-chart-3)',
        label: 'Energy',
        configKey: 'energy',
      },
      {
        data: exercise,
        title: 'Daily Exercise Minutes',
        description: 'Daily exercise minutes over time.',
        color: 'var(--color-chart-3)',
        label: 'Exercise',
        configKey: 'exercise',
      },
      {
        data: distance,
        title: 'Daily Distance',
        description: 'Daily distance covered over time.',
        color: 'var(--color-chart-3)',
        label: 'Distance',
        configKey: 'distance',
      },
      {
        data: water,
        title: 'Daily Water Intake',
        description: 'Daily water intake over time.',
        color: 'var(--color-chart-3)',
        label: 'Water',
        configKey: 'water',
      },
    ],
    [weight, steps, energy, exercise, distance, water],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {chartConfigs.map((config) => (
        <ChartArea
          key={config.configKey}
          chartData={config.data}
          title={config.title}
          description={config.description}
          chartConfig={{
            [config.configKey]: {
              label: config.label,
            },
            value: {
              label: config.label.toLowerCase(),
              color: config.color,
            },
          }}
          series={[
            {
              dataKey: 'value',
              color: config.color,
              fillOpacity: 0.3,
            },
          ]}
          {...COMMON_CHART_PROPS}
        />
      ))}
    </div>
  );
};
