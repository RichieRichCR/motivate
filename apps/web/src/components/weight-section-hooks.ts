import { useMemo } from 'react';
import { DAYS_IN_WEEK } from '@/lib/utils';

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

    // Find weight from 7 days ago
    const lastWeekEntry = weightHistory
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

    const lastWeekWeight = lastWeekEntry ? Number(lastWeekEntry.value) : null;

    // Calculate 7-day trend
    const sevenDayTrend =
      currentWeight && lastWeekWeight
        ? Number((current - lastWeekWeight).toFixed(2))
        : null;

    // Find starting weight for progress calculation
    const startingValue = startDate
      ? weightHistory.find(
          (entry) =>
            new Date(entry.measuredAt).toDateString() ===
            new Date(startDate).toDateString(),
        )?.value
      : null;

    const startingPoint = startingValue
      ? Number(startingValue)
      : (lastWeekWeight ?? current);

    // Calculate progress percentage
    const progress =
      startingPoint && targetWeight
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
      isTrendingDown: sevenDayTrend !== null && sevenDayTrend >= 0,
    };
  }, [currentWeight, targetWeight, weightHistory, startDate]);
};
