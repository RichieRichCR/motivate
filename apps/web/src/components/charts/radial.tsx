'use client';

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui';
import { ChartConfig, ChartContainer } from '@repo/ui';

export const description = 'A radial chart with text';

export function RadialChart({
  chartTitle,
  title,
  description,
  chartData,
  target,
  chartConfig,
  dataKey,
  footer,
}: {
  chartTitle: string;
  title: string;
  description: string;
  chartData: Record<string, unknown>[];
  target: number;
  chartConfig: ChartConfig;
  dataKey: string;
  footer?: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0 border-b">
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={(Number(chartData[0][dataKey]) / target) * 360}
            innerRadius={80}
            outerRadius={90}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey={dataKey} background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {(
                            chartData[0]?.[dataKey] as number
                          )?.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {chartTitle}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">{footer}</CardFooter>
    </Card>
  );
}

// <div className="flex items-center gap-2 leading-none font-medium">
//   Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
// </div>
// <div className="text-muted-foreground leading-none">
//   Showing total visitors for the last 6 months
// </div>
