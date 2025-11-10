import { useMemo } from 'react';
import { DAYS_IN_WEEK, getUTCDateDaysAgo, isSameUTCDate } from '@/lib/utils';

interface WeightHistoryEntry {
  measuredAt: Date;
  value: string;
}

interface UseWeightCalculationsProps {
  currentWeight: string | undefined;
  targetWeight: number;
  weightHistory: WeightHistoryEntry[];
  startDate?: string;
}

interface WeightCalculations {
  weightToGo: number;
  sevenDayTrend: number | null;
  progress: number;
  isAboveTarget: boolean;
  isTrendingDown: boolean;
}

/**
 * Custom hook to calculate weight-related metrics
 */
export const useWeightCalculations = ({
  currentWeight,
  targetWeight,
  weightHistory,
  startDate,
}: UseWeightCalculationsProps): WeightCalculations => {
  return useMemo(() => {
    const current = Number(currentWeight ?? 0);

    // Find weight from 7 days ago (using UTC to avoid timezone issues)
    const oneWeekAgoUTC = getUTCDateDaysAgo(DAYS_IN_WEEK);
    const lastWeekEntry = weightHistory
      .slice()
      .sort(
        (a, b) =>
          new Date(b.measuredAt).getTime() - new Date(a.measuredAt).getTime(),
      )
      .find((entry) => {
        const entryDate = new Date(entry.measuredAt);
        return entryDate <= oneWeekAgoUTC;
      });

    const lastWeekWeight = lastWeekEntry ? Number(lastWeekEntry.value) : null;

    // Calculate 7-day trend
    const sevenDayTrend =
      currentWeight && lastWeekWeight
        ? Number((current - lastWeekWeight).toFixed(2))
        : null;

    // Find starting weight for progress calculation (weight when goal was set)
    // Using UTC date comparison to avoid timezone issues
    const startingValue = startDate
      ? weightHistory.find((entry) =>
          isSameUTCDate(new Date(entry.measuredAt), new Date(startDate)),
        )?.value
      : null;

    // Starting point should only be the weight when the goal was set, not a fallback
    const startingPoint = startingValue ? Number(startingValue) : null;

    // Calculate progress percentage - only if we have a valid starting point from goal start date
    const progress =
      startingPoint !== null && targetWeight && startingPoint !== targetWeight
        ? Math.min(
            Math.max(
              Math.round(
                ((startingPoint - current) / (startingPoint - targetWeight)) *
                  100,
              ),
              0,
            ),
            100,
          )
        : 0;

    // Weight to go until target
    const weightToGo = Number((current - targetWeight).toFixed(2));

    return {
      weightToGo,
      sevenDayTrend,
      progress,
      isAboveTarget: weightToGo >= 0,
      isTrendingDown: sevenDayTrend !== null && sevenDayTrend <= 0,
    };
  }, [currentWeight, targetWeight, weightHistory, startDate]);
};
