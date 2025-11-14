'use client';

import * as React from 'react';

export interface TimeRangeOption {
  value: string;
  label: string;
  days: number;
}

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { value: '7d', label: '7 days', days: 7 },
  { value: '30d', label: '30 days', days: 30 },
  { value: '90d', label: '90 days', days: 90 },
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
  // Initialize from localStorage if available
  const [timeRange, setTimeRangeState] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('timeRange') || defaultTimeRange;
    }
    return defaultTimeRange;
  });

  // Persist to localStorage when changed
  const setTimeRange = React.useCallback((value: string) => {
    setTimeRangeState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('timeRange', value);
    }
  }, []);

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
    [timeRange, selectedOption, setTimeRange],
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
