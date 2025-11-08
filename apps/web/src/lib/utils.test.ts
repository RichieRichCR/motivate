import { describe, it, expect } from 'vitest';
import {
  formatDate,
  getDateRange,
  formatDateString,
  transformMeasurementData,
  createMetricIdMap,
  getMetricValue,
  getMetricDate,
  getGoalTarget,
  createRadialChartData,
  DAYS_TO_FETCH,
  DEFAULT_TARGET,
  CHART_FILL_COLOR,
} from './utils';

describe('utils', () => {
  describe('formatDate', () => {
    it('should format a date string to locale date string', () => {
      const result = formatDate('2024-01-15');
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should handle ISO date strings', () => {
      const result = formatDate('2024-01-15T10:30:00Z');
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });
  });

  describe('getDateRange', () => {
    it('should return date range with correct format', () => {
      const { startDate, endDate } = getDateRange(7);
      expect(startDate).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(endDate).toMatch(/\d{4}-\d{2}-\d{2}/);
    });

    it('should calculate correct date range for 90 days', () => {
      const { startDate, endDate } = getDateRange(90);
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      expect(diffDays).toBeGreaterThanOrEqual(89);
      expect(diffDays).toBeLessThanOrEqual(90);
    });

    it('should use DAYS_TO_FETCH constant', () => {
      expect(DAYS_TO_FETCH).toBe(90);
    });
  });

  describe('formatDateString', () => {
    it('should format Date object to YYYY-MM-DD string', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = formatDateString(date);
      expect(result).toBe('2024-01-15');
    });

    it('should format string date to YYYY-MM-DD', () => {
      const result = formatDateString('2024-01-15T10:30:00Z');
      expect(result).toBe('2024-01-15');
    });
  });

  describe('transformMeasurementData', () => {
    it('should transform measurements to chart data points', () => {
      const measurements = [
        { measuredAt: new Date('2024-01-15'), value: '150' },
        { measuredAt: new Date('2024-01-16'), value: '155' },
      ];
      const result = transformMeasurementData(measurements);
      expect(result).toEqual([
        { date: '2024-01-15', value: 150 },
        { date: '2024-01-16', value: 155 },
      ]);
    });

    it('should handle empty array', () => {
      const result = transformMeasurementData([]);
      expect(result).toEqual([]);
    });

    it('should convert string values to numbers', () => {
      const measurements = [
        { measuredAt: new Date('2024-01-15'), value: '42.5' },
      ];
      const result = transformMeasurementData(measurements);
      expect(result[0].value).toBe(42.5);
      expect(typeof result[0].value).toBe('number');
    });
  });

  describe('createMetricIdMap', () => {
    it('should create a map of metric names to IDs', () => {
      const metrics = [
        { id: 1, name: 'weight' },
        { id: 2, name: 'steps' },
        { id: 3, name: 'exercise' },
      ];
      const result = createMetricIdMap(metrics);
      expect(result).toEqual({
        weight: 1,
        steps: 2,
        exercise: 3,
      });
    });

    it('should handle empty array', () => {
      const result = createMetricIdMap([]);
      expect(result).toEqual({});
    });

    it('should handle duplicate names (last one wins)', () => {
      const metrics = [
        { id: 1, name: 'weight' },
        { id: 2, name: 'weight' },
      ];
      const result = createMetricIdMap(metrics);
      expect(result.weight).toBe(2);
    });
  });

  describe('getMetricValue', () => {
    const mockData = [
      { metricTypeId: 1, value: '150', measuredAt: new Date() },
      { metricTypeId: 2, value: '10000', measuredAt: new Date() },
    ];

    it('should return value for existing metric', () => {
      const result = getMetricValue(mockData, 1);
      expect(result).toBe('150');
    });

    it('should return undefined for non-existing metric', () => {
      const result = getMetricValue(mockData, 999);
      expect(result).toBeUndefined();
    });

    it('should work with empty array', () => {
      const result = getMetricValue([], 1);
      expect(result).toBeUndefined();
    });
  });

  describe('getMetricDate', () => {
    const testDate = new Date('2024-01-15');
    const mockData = [
      { metricTypeId: 1, value: '150', measuredAt: testDate },
      { metricTypeId: 2, value: '10000', measuredAt: new Date('2024-01-16') },
    ];

    it('should return date string for existing metric', () => {
      const result = getMetricDate(mockData, 1);
      expect(result).toBeTruthy();
    });

    it('should return undefined for non-existing metric', () => {
      const result = getMetricDate(mockData, 999);
      expect(result).toBeUndefined();
    });

    it('should work with empty array', () => {
      const result = getMetricDate([], 1);
      expect(result).toBeUndefined();
    });
  });

  describe('getGoalTarget', () => {
    const mockGoals = [
      { metricTypeId: 1, targetValue: '10000' },
      { metricTypeId: 2, targetValue: '8000' },
    ];

    it('should return goal target value as number', () => {
      const result = getGoalTarget(mockGoals, 1);
      expect(result).toBe(10000);
      expect(typeof result).toBe('number');
    });

    it('should return default value for non-existing goal', () => {
      const result = getGoalTarget(mockGoals, 999);
      expect(result).toBe(DEFAULT_TARGET);
    });

    it('should use custom default value', () => {
      const result = getGoalTarget(mockGoals, 999, 5000);
      expect(result).toBe(5000);
    });

    it('should work with empty goals array', () => {
      const result = getGoalTarget([], 1);
      expect(result).toBe(DEFAULT_TARGET);
    });
  });

  describe('createRadialChartData', () => {
    it('should create chart data with value and fill color', () => {
      const result = createRadialChartData('7500');
      expect(result).toEqual([{ value: 7500, fill: CHART_FILL_COLOR }]);
    });

    it('should handle undefined value as 0', () => {
      const result = createRadialChartData(undefined);
      expect(result).toEqual([{ value: 0, fill: CHART_FILL_COLOR }]);
    });

    it('should convert string to number', () => {
      const result = createRadialChartData('42.5');
      expect(result[0].value).toBe(42.5);
      expect(typeof result[0].value).toBe('number');
    });

    it('should use correct fill color constant', () => {
      expect(CHART_FILL_COLOR).toBe('var(--color-chart-2)');
    });
  });
});
