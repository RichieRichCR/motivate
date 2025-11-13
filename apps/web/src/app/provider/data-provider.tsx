'use client';
import type {
  DashboardGoals,
  DashboardMetrics,
  MetricIds,
  RadialChartConfig,
  ChartDataType,
} from '@/types';
import {
  MetricSchemaResponse,
  UserDataResponse,
  UserGoalsResponse,
} from '@repo/api/types';
import { createContext, useContext } from 'react';

export type DataContextType = {
  userId: string;
  startDate: string;
  endDate: string;
  user: UserDataResponse;
  goals: UserGoalsResponse;
  metrics: MetricSchemaResponse;
  stepsHistory: UserDataResponse;
  weightHistory: UserDataResponse;
  energyHistory: UserDataResponse;
  exerciseHistory: UserDataResponse;
  currentMetrics: DashboardMetrics;
  goalTargets: DashboardGoals;
  linearCharts: {
    steps: ChartDataType;
    weight: ChartDataType;
    exercise: ChartDataType;
    energy: ChartDataType;
    distance: ChartDataType;
    water: ChartDataType;
    standing?: ChartDataType;
  };
  radialCharts: {
    steps: RadialChartConfig;
    standing: RadialChartConfig;
    exercise: RadialChartConfig;
    water: RadialChartConfig;
    distance: RadialChartConfig;
    energy: RadialChartConfig;
  };
  metricIdMap: Record<string, number>;
  metricIds: MetricIds;
};

export const DataContext = createContext<DataContextType | undefined>(
  undefined,
);

export const DataProvider = ({
  data,
  children,
}: {
  data: DataContextType;
  children: React.ReactNode;
}) => {
  // Implementation would go here\

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
