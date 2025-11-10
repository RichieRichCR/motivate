'use client';

import { useDataContext } from '@/app/provider/data-provider';
import { RadialChart } from './charts/radial';

export const RadialChartsSection = () => {
  const { radialCharts } = useDataContext();

  const charts = Object.keys(radialCharts) as Array<keyof typeof radialCharts>;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {charts.map((chart) => (
        <RadialChart
          key={chart}
          unit={radialCharts[chart].unit}
          title={radialCharts[chart].title}
          description={radialCharts[chart].description}
          chartData={radialCharts[chart].chartData}
          target={radialCharts[chart].target}
          chartConfig={radialCharts[chart].chartConfig}
          dataKey={radialCharts[chart].dataKey}
          footer={undefined}
        />
      ))}
    </div>
  );
};
