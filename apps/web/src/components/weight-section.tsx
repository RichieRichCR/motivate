'use client';

import { useDataContext } from '@/app/provider/data';
import { getMetricDate } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Progress,
} from '@repo/ui';
import { useWeightCalculations } from './weight-section-hooks';
import { WeightMetric } from './weight-metric';

export const WeightSection = () => {
  const { currentMetrics, goalTargets, user, metricIds, weightHistory } =
    useDataContext();

  const metricDate = getMetricDate(user.data, metricIds.weight);
  const displayDate = metricDate
    ? `on ${new Date(metricDate).toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric',
      })}`
    : 'No date';

  const { weightToGo, sevenDayTrend, progress, isAboveTarget, isTrendingDown } =
    useWeightCalculations({
      currentWeight: currentMetrics.currentWeight,
      targetWeight: goalTargets.weight.value,
      weightHistory: weightHistory.data,
      startDate: goalTargets.weight.startDate,
    });

  console.log('WeightSection render', {
    weightToGo,
    sevenDayTrend,
    progress,
    isAboveTarget,
    isTrendingDown,
  });

  return (
    <div className="grid grid-cols-1 gap-8">
      <Card>
        <CardHeader className="flex items-center gap-0 border-b sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Weight</CardTitle>
            <CardDescription>{displayDate}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-6 flex flex-col gap-6">
          <div className="flex flex-row flex-wrap justify-between gap-6">
            <WeightMetric
              label="Current"
              value={currentMetrics.currentWeight ?? '—'}
            />
            <WeightMetric label="Target" value={goalTargets.weight.value} />
            <WeightMetric
              label="To Go"
              value={weightToGo}
              className={cn(isAboveTarget ? 'text-red-600' : 'text-green-600')}
            />
            <WeightMetric
              label="7 Day Trend"
              value={sevenDayTrend ?? '—'}
              className={cn(
                'items-end',
                isTrendingDown ? 'text-green-600' : 'text-red-600',
              )}
              showTrend
              trendValue={sevenDayTrend}
              isTrendingDown={isTrendingDown}
            />
          </div>

          {/* Progress Bar */}
          <div className="grow shrink">
            <div className="text-xs font-bold text-left text-foreground/45 uppercase tracking-widest gap-0 mb-4">
              Progress
            </div>
            <div className="flex flex-row flex-nowrap gap-4 justify-center items-center">
              <Progress value={progress} />
              <div className="text-sm flex items-center shrink-0">
                {progress}% to goal
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
