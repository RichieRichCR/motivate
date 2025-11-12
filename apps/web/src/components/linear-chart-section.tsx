'use client';

import { useDataContext } from '@/app/provider/data-provider';
import { ChartArea } from './charts/area-chart';
import { useMemo } from 'react';
import { motion } from 'motion/react';

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
        label: 'kg',
        configKey: 'weight',
      },
      {
        data: steps,
        title: 'Daily Steps',
        description: 'Step count changes over time.',
        color: 'var(--color-chart-3)',
        label: 'steps',
        configKey: 'steps',
      },
      {
        data: energy,
        title: 'Daily Active Energy',
        description: 'Active energy expenditure over time.',
        color: 'var(--color-chart-3)',
        label: 'kcal',
        configKey: 'energy',
      },
      {
        data: exercise,
        title: 'Daily Exercise Minutes',
        description: 'Daily exercise minutes over time.',
        color: 'var(--color-chart-3)',
        label: 'min',
        configKey: 'exercise',
      },
      {
        data: distance,
        title: 'Daily Distance',
        description: 'Daily distance covered over time.',
        color: 'var(--color-chart-3)',
        label: 'km',
        configKey: 'distance',
      },
      {
        data: water,
        title: 'Daily Water Intake',
        description: 'Daily water intake over time.',
        color: 'var(--color-chart-3)',
        label: 'ml',
        configKey: 'water',
      },
    ],
    [weight, steps, energy, exercise, distance, water],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {chartConfigs.map((config, index) => (
        <motion.div
          key={config.configKey}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: 'easeOut',
          }}
          whileHover={{
            scale: 1.02,
            transition: { type: 'spring', stiffness: 300 },
          }}
        >
          <ChartArea
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
            dateKey="date"
            showLegend={true}
          />
        </motion.div>
      ))}
    </div>
  );
};
