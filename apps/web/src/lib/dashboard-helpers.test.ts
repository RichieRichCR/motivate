import { describe, it, expect } from 'vitest';
import {
  createMetricIdResolver,
  resolveAllMetricIds,
  extractCurrentMetrics,
  extractGoalTargets,
  getMetricDate,
  transformMeasurementData,
  convertWaterToLiters,
  buildRadialChartConfig,
  buildAllRadialChartConfigs,
} from './dashboard-helpers';
import { createRadialChartData } from './chart-utils';
import type { MetricIds, UserDataItem, GoalDataItem } from '@/types';

describe('dashboard-helpers', () => {
  describe('createMetricIdResolver', () => {
    it('should resolve metric IDs from map', () => {
      const metricIdMap = { weight: 10, steps: 20 };
      const resolver = createMetricIdResolver(metricIdMap);
      expect(resolver('weight')).toBe(10);
      expect(resolver('steps')).toBe(20);
    });

    it('should fallback to default ID when not in map', () => {
      const metricIdMap = {};
      const resolver = createMetricIdResolver(metricIdMap);
      // Should use default from METRIC_CONFIG
      expect(resolver('weight')).toBe(1); // weight default is 1
      expect(resolver('steps')).toBe(2); // steps default is 2
    });
  });

  describe('resolveAllMetricIds', () => {
    it('should resolve all metric IDs at once', () => {
      const metricIdMap = {
        weight: 10,
        steps: 20,
        exercise: 30,
        standing: 40,
        distance: 50,
        water: 60,
      };
      const result = resolveAllMetricIds(metricIdMap);
      expect(result).toEqual({
        weight: 10,
        steps: 20,
        exercise: 30,
        standing: 40,
        distance: 50,
        water: 60,
        energy: 7, // energy uses default
      });
    });

    it('should use defaults for missing metrics', () => {
      const metricIdMap = { weight: 10 };
      const result = resolveAllMetricIds(metricIdMap);
      expect(result.weight).toBe(10);
      expect(result.steps).toBe(2); // default
    });
  });

  describe('extractCurrentMetrics', () => {
    const mockMetricIds: MetricIds = {
      weight: 1,
      steps: 2,
      exercise: 3,
      standing: 4,
      distance: 5,
      water: 6,
      energy: 7,
    };

    const mockUserData: UserDataItem[] = [
      { metricTypeId: 1, value: '150', measuredAt: new Date() },
      { metricTypeId: 2, value: '10000', measuredAt: new Date() },
      { metricTypeId: 3, value: '45', measuredAt: new Date() },
      { metricTypeId: 6, value: '2000', measuredAt: new Date() },
    ];

    it('should extract all current metrics', () => {
      const result = extractCurrentMetrics(mockUserData, mockMetricIds);
      expect(result.currentWeight).toBe('150');
      expect(result.currentSteps).toBe('10000');
      expect(result.currentExercise).toBe('45');
      expect(result.currentWater).toBe('2000');
    });

    it('should return undefined for missing metrics', () => {
      const result = extractCurrentMetrics(mockUserData, mockMetricIds);
      expect(result.currentDistance).toBeUndefined();
      expect(result.currentStanding).toBeUndefined();
    });

    it('should handle empty userData', () => {
      const result = extractCurrentMetrics([], mockMetricIds);
      expect(result.currentWeight).toBeUndefined();
      expect(result.currentSteps).toBeUndefined();
    });

    it('should use previous non-zero weight when current weight is 0', () => {
      const userDataWithZeroWeight: UserDataItem[] = [
        { metricTypeId: 1, value: '0', measuredAt: new Date('2024-01-15') },
        { metricTypeId: 2, value: '10000', measuredAt: new Date('2024-01-15') },
      ];

      const weightHistory: UserDataItem[] = [
        { metricTypeId: 1, value: '0', measuredAt: new Date('2024-01-15') },
        { metricTypeId: 1, value: '150', measuredAt: new Date('2024-01-14') },
        { metricTypeId: 1, value: '151', measuredAt: new Date('2024-01-13') },
      ];

      const result = extractCurrentMetrics(
        userDataWithZeroWeight,
        mockMetricIds,
        weightHistory,
      );

      expect(result.currentWeight).toBe('150');
      expect(result.currentSteps).toBe('10000');
    });

    it('should keep zero weight if no non-zero history exists', () => {
      const userDataWithZeroWeight: UserDataItem[] = [
        { metricTypeId: 1, value: '0', measuredAt: new Date('2024-01-15') },
      ];

      const weightHistory: UserDataItem[] = [
        { metricTypeId: 1, value: '0', measuredAt: new Date('2024-01-15') },
        { metricTypeId: 1, value: '0', measuredAt: new Date('2024-01-14') },
      ];

      const result = extractCurrentMetrics(
        userDataWithZeroWeight,
        mockMetricIds,
        weightHistory,
      );

      expect(result.currentWeight).toBe('0');
    });

    it('should use current weight when it is non-zero', () => {
      const userDataWithValidWeight: UserDataItem[] = [
        { metricTypeId: 1, value: '152', measuredAt: new Date('2024-01-15') },
      ];

      const weightHistory: UserDataItem[] = [
        { metricTypeId: 1, value: '152', measuredAt: new Date('2024-01-15') },
        { metricTypeId: 1, value: '150', measuredAt: new Date('2024-01-14') },
      ];

      const result = extractCurrentMetrics(
        userDataWithValidWeight,
        mockMetricIds,
        weightHistory,
      );

      expect(result.currentWeight).toBe('152');
    });

    it('should handle weight as "0.00" decimal format', () => {
      const userDataWithZeroWeight: UserDataItem[] = [
        { metricTypeId: 1, value: '0.00', measuredAt: new Date('2024-01-15') },
      ];

      const weightHistory: UserDataItem[] = [
        { metricTypeId: 1, value: '0.00', measuredAt: new Date('2024-01-15') },
        {
          metricTypeId: 1,
          value: '148.50',
          measuredAt: new Date('2024-01-14'),
        },
        {
          metricTypeId: 1,
          value: '149.00',
          measuredAt: new Date('2024-01-13'),
        },
      ];

      const result = extractCurrentMetrics(
        userDataWithZeroWeight,
        mockMetricIds,
        weightHistory,
      );

      expect(result.currentWeight).toBe('148.50');
    });
  });

  describe('extractGoalTargets', () => {
    const mockMetricIds: MetricIds = {
      weight: 1,
      steps: 2,
      exercise: 3,
      standing: 4,
      distance: 5,
      water: 6,
      energy: 7,
    };

    const mockGoalsData: GoalDataItem[] = [
      { metricTypeId: 2, targetValue: '12000' },
      { metricTypeId: 3, targetValue: '60' },
    ];

    it('should extract goal targets', () => {
      const result = extractGoalTargets(mockGoalsData, mockMetricIds);
      expect(result.steps.value).toBe(12000);
      expect(result.exercise.value).toBe(60);
    });

    it('should use default value for missing goals', () => {
      const result = extractGoalTargets(mockGoalsData, mockMetricIds);
      expect(result.standing.value).toBe(10000);
    });

    it('should use custom default value', () => {
      const result = extractGoalTargets(mockGoalsData, mockMetricIds, 5000);
      expect(result.standing.value).toBe(5000);
    });

    it('should handle empty goalsData', () => {
      const result = extractGoalTargets([], mockMetricIds);
      expect(result.steps.value).toBe(10000);
      expect(result.exercise.value).toBe(10000);
      expect(result.standing.value).toBe(10000);
    });
  });

  describe('getMetricDate', () => {
    const testDate = new Date('2024-01-15');
    const mockUserData: UserDataItem[] = [
      { metricTypeId: 1, value: '150', measuredAt: testDate },
      { metricTypeId: 2, value: '10000', measuredAt: new Date('2024-01-16') },
    ];

    it('should return date string for existing metric', () => {
      const result = getMetricDate(mockUserData, 1);
      expect(result).toBeTruthy();
      expect(result).toContain('2024');
    });

    it('should return undefined for non-existing metric', () => {
      const result = getMetricDate(mockUserData, 999);
      expect(result).toBeUndefined();
    });

    it('should handle empty userData', () => {
      const result = getMetricDate([], 1);
      expect(result).toBeUndefined();
    });
  });

  describe('transformMeasurementData', () => {
    it('should transform measurements to chart format', () => {
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
      expect(typeof result[0].value).toBe('number');
      expect(result[0].value).toBe(42.5);
    });
  });

  describe('convertWaterToLiters', () => {
    it('should convert milliliters to liters', () => {
      const result = convertWaterToLiters('2000');
      expect(result).toBe('2.00');
    });

    it('should handle decimal values', () => {
      const result = convertWaterToLiters('1500');
      expect(result).toBe('1.50');
    });

    it('should return undefined for undefined input', () => {
      const result = convertWaterToLiters(undefined);
      expect(result).toBeUndefined();
    });

    it('should format to 2 decimal places', () => {
      const result = convertWaterToLiters('2345');
      expect(result).toBe('2.35');
      expect(result?.split('.')[1].length).toBe(2);
    });
  });

  describe('createRadialChartData', () => {
    it('should create chart data with custom dataKey', () => {
      const result = createRadialChartData('7500', 'steps');
      expect(result).toEqual([
        { steps: 7500, fill: 'var(--color-chart-2)', fillOpacity: 0.7 },
      ]);
    });

    it('should handle undefined value as 0', () => {
      const result = createRadialChartData(undefined, 'steps');
      expect(result[0].steps).toBe(0);
    });

    it('should use custom fill color', () => {
      const result = createRadialChartData('100', 'steps', 'red');
      expect(result[0].fill).toBe('red');
    });

    it('should convert string to number', () => {
      const result = createRadialChartData('42.5', 'exercise');
      expect(typeof result[0].exercise).toBe('number');
    });
  });

  describe('buildRadialChartConfig', () => {
    it('should build complete chart config', () => {
      const result = buildRadialChartConfig({
        dataKey: 'steps',
        unit: 'steps',
        title: 'Steps',
        description: 'Steps taken today',
        value: '7500',
        target: { value: 10000, startDate: undefined },
        label: 'Steps',
      });

      expect(result).toEqual({
        unit: 'steps',
        title: 'Steps',
        description: 'Steps taken today',
        chartData: [
          { steps: 7500, fill: 'var(--color-chart-2)', fillOpacity: 0.7 },
        ],
        target: 10000,
        chartConfig: { steps: { label: 'Steps' } },
        dataKey: 'steps',
      });
    });

    it('should handle undefined value', () => {
      const result = buildRadialChartConfig({
        dataKey: 'steps',
        unit: 'steps',
        title: 'Steps',
        description: 'Steps taken today',
        value: undefined,
        target: { value: 10000, startDate: undefined },
        label: 'Steps',
      });

      expect(result.chartData[0].steps).toBe(0);
    });
  });

  describe('buildAllRadialChartConfigs', () => {
    const mockMetrics = {
      currentSteps: '8000',
      currentExercise: '45',
      currentStanding: '180',
    };

    const mockGoals = {
      weight: { value: 75, startDate: undefined },
      steps: { value: 10000, startDate: undefined },
      exercise: { value: 60, startDate: undefined },
      standing: { value: 240, startDate: undefined },
      water: { value: 2000, startDate: undefined },
      distance: { value: 5000, startDate: undefined },
      energy: { value: 500, startDate: undefined },
    };

    it('should build configs for all three charts', () => {
      const result = buildAllRadialChartConfigs(mockMetrics, mockGoals);

      expect(result).toHaveProperty('steps');
      expect(result).toHaveProperty('exercise');
      expect(result).toHaveProperty('standing');
    });

    it('should have correct steps config', () => {
      const result = buildAllRadialChartConfigs(mockMetrics, mockGoals);

      expect(result.steps.title).toBe('Steps');
      expect(result.steps.target).toBe(10000);
      expect(result.steps.chartData[0].steps).toBe(8000);
    });

    it('should have correct exercise config', () => {
      const result = buildAllRadialChartConfigs(mockMetrics, mockGoals);

      expect(result.exercise.title).toBe('Exercise');
      expect(result.exercise.target).toBe(60);
      expect(result.exercise.chartData[0].exercise).toBe(45);
    });

    it('should have correct standing config', () => {
      const result = buildAllRadialChartConfigs(mockMetrics, mockGoals);

      expect(result.standing.title).toBe('Standing');
      expect(result.standing.target).toBe(240);
      expect(result.standing.chartData[0].standing).toBe(180);
    });
  });
});
