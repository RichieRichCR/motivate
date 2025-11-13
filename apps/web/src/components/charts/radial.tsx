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
import AnimateNumberSimple from '../animate-number-simple';
import { useAnimateOnView } from '@/hooks/use-animate-on-view';

export const description = 'A radial chart with text';

export function RadialChart({
  unit,
  title,
  description,
  chartData,
  target,
  chartConfig,
  dataKey,
  footer,
}: {
  unit: string;
  title: string;
  description: string;
  chartData: Record<string, unknown>[];
  target: number;
  chartConfig: ChartConfig;
  dataKey: string;
  footer?: React.ReactNode;
}) {
  const { isVisible, elementRef } = useAnimateOnView();

  return (
    <Card ref={elementRef} className="flex flex-col">
      <CardHeader className="items-center pb-0 border-b">
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px] lg:max-h-[300px] xl:max-h-[400px] w-full"
        >
          <RadialBarChart
            data={isVisible ? chartData : [{ [dataKey]: 0 }]}
            startAngle={0}
            endAngle={
              isVisible ? (Number(chartData[0][dataKey]) / target) * 360 : 0
            }
            innerRadius={130}
            outerRadius={170}
            aria-label={`${title} progress chart showing ${chartData[0]?.[dataKey] || 0} out of ${target} ${unit}`}
            role="img"
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted/50 last:fill-foreground/5"
              polarRadius={[116, 116]}
            />
            <RadialBar
              dataKey={dataKey}
              cornerRadius={10}
              isAnimationActive={true}
            />
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
                        <AnimateNumberSimple
                          value={chartData[0]?.[dataKey] as number}
                          as="tspan"
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-5xl font-bold"
                        />
                        {/* <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-5xl font-bold"
                        >
                          {(
                            chartData[0]?.[dataKey] as number
                          )?.toLocaleString()}
                        </tspan> */}
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 32}
                          className="fill-muted-foreground"
                        >
                          {unit}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 52}
                          className="fill-muted-foreground"
                        >
                          {(
                            (Number(chartData[0][dataKey]) / target) *
                            100
                          ).toFixed(1)}
                          % of {target.toLocaleString()}
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
      {footer && (
        <CardFooter className="flex-col gap-2 text-sm">{footer}</CardFooter>
      )}
    </Card>
  );
}

// <div className="flex items-center gap-2 leading-none font-medium">
//   Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
// </div>
// <div className="text-muted-foreground leading-none">
//   Showing total visitors for the last 6 months
// </div>
