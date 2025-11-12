'use client';

import { useDataContext } from '@/app/provider/data-provider';
import { RadialChart } from './charts/radial';
import { motion } from 'motion/react';

export const RadialChartsSection = () => {
  const { radialCharts } = useDataContext();

  const charts = Object.keys(radialCharts) as Array<keyof typeof radialCharts>;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {charts.map((chart, index) => (
        <motion.div
          key={chart}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: 'easeOut',
          }}
          whileHover={{
            scale: 1.02,
            rotateY: 3,
            rotateX: -3,
            transition: { type: 'spring', stiffness: 300 },
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <RadialChart
            unit={radialCharts[chart].unit}
            title={radialCharts[chart].title}
            description={radialCharts[chart].description}
            chartData={radialCharts[chart].chartData}
            target={radialCharts[chart].target}
            chartConfig={radialCharts[chart].chartConfig}
            dataKey={radialCharts[chart].dataKey}
            footer={undefined}
          />
        </motion.div>
      ))}
    </div>
  );
};
