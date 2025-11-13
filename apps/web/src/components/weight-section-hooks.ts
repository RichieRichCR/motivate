import { useMemo } from 'react';
import {
  DAYS_IN_WEEK,
  getEntryForTimeRange,
  getUTCDateDaysAgo,
  isSameUTCDate,
} from '@/lib/utils';
import type { UseWeightCalculationsProps, WeightCalculations } from '@/types';

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
    const thirtyDaysAgoUTC = getUTCDateDaysAgo(30);
    const ninetyDaysAgoUTC = getUTCDateDaysAgo(90);

    const lastWeekEntry = getEntryForTimeRange(weightHistory, oneWeekAgoUTC);

    const thirtyDayEntry = getEntryForTimeRange(
      weightHistory,
      thirtyDaysAgoUTC,
    );
    const ninetyDayEntry = getEntryForTimeRange(
      weightHistory,
      ninetyDaysAgoUTC,
    );

    const lastWeekWeight = lastWeekEntry ? Number(lastWeekEntry.value) : null;
    const thirtyDayWeight = thirtyDayEntry
      ? Number(thirtyDayEntry.value)
      : null;
    const ninetyDayWeight = ninetyDayEntry
      ? Number(ninetyDayEntry.value)
      : null;

    // Calculate 7-day trend
    const sevenDayTrend =
      currentWeight && lastWeekWeight
        ? Number((current - lastWeekWeight).toFixed(2))
        : null;
    // Calculate 30-day trend
    const thirtyDayTrend =
      currentWeight && thirtyDayWeight
        ? Number((current - thirtyDayWeight).toFixed(2))
        : null;
    // Calculate 90-day trend
    const ninetyDayTrend =
      currentWeight && ninetyDayWeight
        ? Number((current - ninetyDayWeight).toFixed(2))
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
      thirtyDayTrend,
      ninetyDayTrend,
      progress,
      isAboveTarget: weightToGo >= 0,
      sevenDayIsTrendingDown: sevenDayTrend !== null && sevenDayTrend < 0,
      thirtyDayIsTrendingDown: thirtyDayTrend !== null && thirtyDayTrend < 0,
      ninetyDayIsTrendingDown: ninetyDayTrend !== null && ninetyDayTrend < 0,
    };
  }, [currentWeight, targetWeight, weightHistory, startDate]);
};
