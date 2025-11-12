'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/ui';
import { useAnimateOnView } from '@/hooks/use-animate-on-view';
import { useTimeframe } from '@/app/provider/timeframe-provider';

export const description = 'An interactive area chart';

export interface AreaSeries {
  dataKey: string;
  color: string;
  label?: string;
  stackId?: string;
  fillOpacity?: number;
}

export function ChartArea({
  chartData,
  title = 'Chart',
  description,
  chartConfig,
  series = [{ dataKey: 'value', color: 'var(--color-chart-2)' }],
  dateKey = 'date',
  showLegend = true,
}: {
  chartData: Record<string, unknown>[];
  title?: string;
  description?: string;
  chartConfig: ChartConfig;
  series?: AreaSeries[];
  dateKey?: string;
  showLegend?: boolean;
}) {
  const { timeRange } = useTimeframe();
  const { isVisible, elementRef } = useAnimateOnView();
  const [currentTimeRange, setCurrentTimeRange] = React.useState(timeRange);

  // Update local state when context changes
  React.useEffect(() => {
    if (timeRange !== currentTimeRange) {
      setCurrentTimeRange(timeRange);
    }
  }, [timeRange, currentTimeRange]);

  const filteredData = React.useMemo(() => {
    const TIME_RANGE_MAP: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
    };
    const daysToSubtract = TIME_RANGE_MAP[currentTimeRange] || 7;

    // Use UTC date for consistent filtering regardless of server timezone
    const now = new Date();
    const startDate = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - daysToSubtract,
      ),
    );

    const filtered = chartData.filter((item) => {
      const date = new Date(item[dateKey] as string);
      return date >= startDate;
    });

    return filtered;
  }, [chartData, currentTimeRange, dateKey]);

  return (
    <Card ref={elementRef} className="">
      <CardHeader className="flex items-center space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 ">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              {series.map((s) => (
                <linearGradient
                  key={s.dataKey}
                  id={`fill-${s.dataKey}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={s.color}
                    stopOpacity={s.fillOpacity || 0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={s.color}
                    stopOpacity={(s.fillOpacity || 0.8) * 0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={dateKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-GB', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-GB', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {series.map((s) => (
              <Area
                key={s.dataKey}
                dataKey={isVisible ? s.dataKey : ''}
                type="natural"
                fill={`url(#fill-${s.dataKey})`}
                stroke={s.color}
                stackId={s.stackId}
                isAnimationActive={isVisible}
                animationBegin={300}
              />
            ))}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
