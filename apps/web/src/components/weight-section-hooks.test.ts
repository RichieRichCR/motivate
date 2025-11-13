import { describe, it, expect } from 'vitest';
import { useWeightCalculations } from './weight-section-hooks';
import { renderHook } from '@testing-library/react';
import type { WeightHistoryEntry } from '@/types';

describe('useWeightCalculations', () => {
  const mockHistory: WeightHistoryEntry[] = [
    { measuredAt: new Date('2024-01-15'), value: '75.0' },
    { measuredAt: new Date('2024-01-08'), value: '76.0' },
    { measuredAt: new Date('2023-12-16'), value: '77.0' },
    { measuredAt: new Date('2023-10-17'), value: '80.0' },
  ];

  it('should calculate weight to go correctly', () => {
    const { result } = renderHook(() =>
      useWeightCalculations({
        currentWeight: '75.0',
        targetWeight: 70,
        weightHistory: mockHistory,
      }),
    );

    expect(result.current.weightToGo).toBe(5);
  });

  it('should calculate 7-day trend', () => {
    const { result } = renderHook(() =>
      useWeightCalculations({
        currentWeight: '75.0',
        targetWeight: 70,
        weightHistory: mockHistory,
      }),
    );

    expect(result.current.sevenDayTrend).toBe(-1); // 75 - 76
  });

  it('should determine if trending down', () => {
    const { result } = renderHook(() =>
      useWeightCalculations({
        currentWeight: '75.0',
        targetWeight: 70,
        weightHistory: mockHistory,
      }),
    );

    expect(result.current.sevenDayIsTrendingDown).toBe(true);
  });

  it('should calculate progress percentage', () => {
    const { result } = renderHook(() =>
      useWeightCalculations({
        currentWeight: '75.0',
        targetWeight: 70,
        weightHistory: mockHistory,
      }),
    );

    // Starting at 80, target 70, current 75 = 50% progress
    expect(result.current.progress).toBeGreaterThan(0);
  });

  it('should handle missing weight history gracefully', () => {
    const { result } = renderHook(() =>
      useWeightCalculations({
        currentWeight: '75.0',
        targetWeight: 70,
        weightHistory: [],
      }),
    );

    expect(result.current.sevenDayTrend).toBeNull();
    expect(result.current.thirtyDayTrend).toBeNull();
    expect(result.current.ninetyDayTrend).toBeNull();
  });

  it('should identify when above target', () => {
    const { result } = renderHook(() =>
      useWeightCalculations({
        currentWeight: '75.0',
        targetWeight: 70,
        weightHistory: mockHistory,
      }),
    );

    expect(result.current.isAboveTarget).toBe(true);
  });

  it('should identify when at or below target', () => {
    const { result } = renderHook(() =>
      useWeightCalculations({
        currentWeight: '68.0',
        targetWeight: 70,
        weightHistory: mockHistory,
      }),
    );

    expect(result.current.isAboveTarget).toBe(false);
  });
});
