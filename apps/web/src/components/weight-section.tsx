'use client';

import { useDataContext } from '@/app/provider/data';
import { getMetricDate, DAYS_IN_WEEK } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Progress,
} from '@repo/ui';
import { TrendingDown, TrendingUp } from 'lucide-react';

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

  const lastWeekWeightEntry = weightHistory.data
    .slice()
    .sort(
      (a, b) =>
        new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime(),
    )
    .find((entry) => {
      const entryDate = new Date(entry.measuredAt);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - DAYS_IN_WEEK);
      return entryDate <= oneWeekAgo;
    });

  const lastWeekWeight = lastWeekWeightEntry ? lastWeekWeightEntry.value : null;

  const weightDifference =
    currentMetrics.currentWeight && lastWeekWeight
      ? (Number(currentMetrics.currentWeight) - Number(lastWeekWeight)).toFixed(
          2,
        )
      : null;

  const startingDate = goalTargets.weight.startDate;

  const startingValue = startingDate
    ? weightHistory.data.find(
        (entry) =>
          new Date(entry.measuredAt).toDateString() ===
          new Date(startingDate).toDateString(),
      )?.value
    : null;

  const startingPoint = startingValue
    ? Number(startingValue)
    : lastWeekWeight
      ? Number(lastWeekWeight)
      : Number(currentMetrics.currentWeight);

  const progress =
    startingPoint && goalTargets.weight.value
      ? Math.min(
          Math.max(
            Math.round(
              ((startingPoint - Number(currentMetrics.currentWeight)) /
                (startingPoint - goalTargets.weight.value)) *
                100,
            ),
            0,
          ),
          100,
        )
      : 0;

  return (
    <div className="grid grid-cols-1 gap-8">
      <Card className="">
        <CardHeader className="flex items-center gap-0 border-b sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Weight</CardTitle>
            <CardDescription>{displayDate}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6 flex flex-col gap-6">
          <div className="flex flex-row justify-between gap-6">
            <div className="grow shrink">
              <div className="text-xs font-bold text-left  text-foreground/45 uppercase tracking-widest gap-0">
                Current
              </div>
              <div className="text-6xl xk:text-7xl 2xl:text-8xl font-black flex flex-row justify-start items-baseline mt-2 flex-nowrap">
                {currentMetrics.currentWeight ?? '—'}
                <div className="text-sm text-muted-foreground">Kgs</div>
              </div>
            </div>
            <div className="grow shrink">
              <div className="text-xs font-bold text-left  text-foreground/45 uppercase tracking-widest gap-0">
                7 Day Trend
              </div>
              <div
                className={cn(
                  'text-6xl xk:text-7xl 2xl:text-8xl font-black flex flex-row justify-start items-end mt-2 flex-nowrap',
                  weightDifference && Number(weightDifference) >= 0
                    ? 'text-green-600'
                    : 'text-red-600',
                )}
              >
                {weightDifference}
                <div className="flex flex-col gap-1 items-center justify-center ml-2">
                  {weightDifference && Number(weightDifference) >= 0 && (
                    <TrendingDown className="text-green-600" />
                  )}
                  {weightDifference && Number(weightDifference) < 0 && (
                    <TrendingUp className="text-red-600" />
                  )}
                  <div className="text-sm ">Kgs</div>
                </div>
              </div>
            </div>

            <div className="grow shrink">
              <div className="text-xs font-bold text-left  text-foreground/45 uppercase tracking-widest gap-0">
                To Go
              </div>
              <div
                className={cn(
                  'text-6xl xk:text-7xl 2xl:text-8xl font-black flex flex-row justify-start items-baseline mt-2 flex-nowrap',
                  Number(currentMetrics.currentWeight) -
                    goalTargets.weight.value >=
                    0
                    ? 'text-red-600'
                    : 'text-green-600',
                )}
              >
                {(
                  Number(currentMetrics.currentWeight) -
                  goalTargets.weight.value
                )
                  .toFixed(2)
                  .toString()}
                <div className="text-sm text-muted-foreground">Kgs</div>
              </div>
            </div>
            <div className="grow shrink">
              <div className="text-xs font-bold text-left  text-foreground/45 uppercase tracking-widest gap-0">
                Target
              </div>
              <div className="text-6xl xk:text-7xl 2xl:text-8xl font-black flex flex-row justify-start items-baseline mt-2 flex-nowrap">
                {goalTargets.weight.value.toString()}
                <div className="text-sm text-muted-foreground">Kgs</div>
              </div>
            </div>
          </div>
          <div className="grow shrink ">
            <div className="text-xs font-bold text-left  text-foreground/45 uppercase tracking-widest gap-0 mb-4">
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
