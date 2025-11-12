'use client';

import * as React from 'react';

export interface TimeRangeOption {
  value: string;
  label: string;
  days: number;
}

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { value: '7d', label: 'Last 7 days', days: 7 },
  { value: '30d', label: 'Last 30 days', days: 30 },
  { value: '90d', label: 'Last 90 days', days: 90 },
];

interface TimeframeContextValue {
  timeRange: string;
  setTimeRange: (value: string) => void;
  timeRangeOptions: TimeRangeOption[];
  selectedOption: TimeRangeOption;
}

const TimeframeContext = React.createContext<TimeframeContextValue | undefined>(
  undefined,
);

export function TimeframeProvider({
  children,
  defaultTimeRange = '7d',
}: {
  children: React.ReactNode;
  defaultTimeRange?: string;
}) {
  const [timeRange, setTimeRange] = React.useState(defaultTimeRange);

  const selectedOption = React.useMemo(
    () =>
      TIME_RANGE_OPTIONS.find((opt) => opt.value === timeRange) ||
      TIME_RANGE_OPTIONS[0],
    [timeRange],
  );

  const value = React.useMemo(
    () => ({
      timeRange,
      setTimeRange,
      timeRangeOptions: TIME_RANGE_OPTIONS,
      selectedOption,
    }),
    [timeRange, selectedOption],
  );

  return (
    <TimeframeContext.Provider value={value}>
      {children}
    </TimeframeContext.Provider>
  );
}

export function useTimeframe() {
  const context = React.useContext(TimeframeContext);
  if (context === undefined) {
    throw new Error('useTimeframe must be used within a TimeframeProvider');
  }
  return context;
}
