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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';

export const description = 'An interactive area chart';

export interface AreaSeries {
  dataKey: string;
  color: string;
  label?: string;
  stackId?: string;
  fillOpacity?: number;
}

export interface TimeRangeOption {
  value: string;
  label: string;
  days: number;
}

export function ChartArea({
  chartData,
  title = 'Chart',
  description,
  chartConfig,
  series = [{ dataKey: 'value', color: 'var(--color-chart-2)' }],
  timeRangeOptions = [
    { value: '7d', label: 'Last 7 days', days: 7 },
    { value: '30d', label: 'Last 30 days', days: 30 },
    { value: '90d', label: 'Last 90 days', days: 90 },
  ],
  defaultTimeRange = '7d',
  dateKey = 'date',
  showLegend = true,
  showTimeRange = true,
}: {
  chartData: Record<string, unknown>[];
  title?: string;
  description?: string;
  chartConfig: ChartConfig;
  series?: AreaSeries[];
  timeRangeOptions?: TimeRangeOption[];
  defaultTimeRange?: string;
  dateKey?: string;
  showLegend?: boolean;
  showTimeRange?: boolean;
}) {
  const [timeRange, setTimeRange] = React.useState(defaultTimeRange);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item[dateKey] as string);
    const referenceDate = new Date();
    const selectedRange = timeRangeOptions.find((r) => r.value === timeRange);
    const daysToSubtract = selectedRange?.days || 90;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="">
      <CardHeader className="flex items-center space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {showTimeRange && (
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="hidden w-40 rounded-lg sm:ml-auto sm:flex"
              aria-label="Select a value"
            >
              <SelectValue placeholder={timeRangeOptions[0]?.label} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {timeRangeOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="rounded-lg"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
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
                return date.toLocaleDateString('en-US', {
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
                    return new Date(value).toLocaleDateString('en-US', {
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
                dataKey={s.dataKey}
                type="natural"
                fill={`url(#fill-${s.dataKey})`}
                stroke={s.color}
                stackId={s.stackId}
              />
            ))}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
