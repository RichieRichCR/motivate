import { METRIC_CONFIG } from './lib/utils';

export interface ContentCardProps {
  value: string | undefined;
  title: string;
  unit: string;
  date: string | undefined;
  className?: string;
}

export type MetricName = keyof typeof METRIC_CONFIG;
export type ChartDataPoint = { date: string; value: number };
export type MetricData = {
  metricTypeId: number;
  value: string;
  measuredAt?: Date;
};
