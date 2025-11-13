/**
 * Chart Utilities
 *
 * Centralized functions for chart data processing and styling
 */

import { CHART_FILL_COLOR } from './utils';

/**
 * Determine progress color based on percentage of target achieved
 * @param value - Current value
 * @param target - Target value
 * @param includeVar - Whether to wrap in CSS var() function
 * @returns CSS color variable name or value
 */
export const getProgressColor = (
  value: number,
  target: number,
  includeVar = true,
): string => {
  const percentage = (value / target) * 100;
  let colorString = '--color-chart-1';

  if (percentage < 100) {
    if (percentage < 20) colorString = '--color-chart-red-1';
    if (percentage < 40) colorString = '--color-chart-red-2';
    if (percentage < 60) colorString = '--color-chart-red-3';
    if (percentage < 80) colorString = '--color-chart-4';
    return includeVar ? `var(${colorString})` : colorString;
  }

  const overPercentage = percentage - 100;
  if (overPercentage === 0) colorString = '--color-chart-1';
  if (overPercentage < 20) colorString = '--color-chart-1';
  if (overPercentage < 40) colorString = '--color-chart-2';
  if (overPercentage < 60) colorString = '--color-chart-3';
  if (overPercentage < 80) colorString = '--color-chart-4';
  colorString = '--color-chart-5';

  return includeVar ? `var(${colorString})` : colorString;
};

/**
 * Get CSS class name for progress indicator
 * @param value - Current value
 * @param target - Target value
 * @returns CSS class string for progress color
 */
export const getProgressClass = (value: number, target: number): string => {
  const percentage = (value / target) * 100;

  if (percentage < 100) {
    if (percentage < 20) return 'chart-20';
    if (percentage < 40) return 'chart-40';
    if (percentage < 60) return 'chart-60';
    if (percentage < 80) return 'chart-80';
    return 'chart-99';
  }

  const overPercentage = percentage - 100;
  if (overPercentage < 20) return 'chart-100';
  if (overPercentage < 40) return 'chart-120';
  if (overPercentage < 60) return 'chart-140';
  if (overPercentage < 80) return 'chart-160';
  return 'chart-180';
};

/**
 * Create data structure for radial chart component
 * @param value - Metric value to display
 * @param dataKey - Key name for the data point
 * @param fillColor - Color for the chart fill
 * @param fillOpacity - Opacity for the chart fill
 * @returns Array containing chart data object
 */
export const createRadialChartData = (
  value: string | undefined,
  dataKey: string,
  fillColor = CHART_FILL_COLOR,
  fillOpacity = 0.7,
) => {
  return [{ [dataKey]: Number(value ?? 0), fill: fillColor, fillOpacity }];
};
