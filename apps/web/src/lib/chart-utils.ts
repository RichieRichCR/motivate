/**
 * Chart Utilities
 *
 * Centralized functions for chart data processing and styling
 */

import { CHART_FILL_COLOR } from './utils';

/**
 * Determine progress color based on percentage of target achieved
 * Red colors for below target (darker as you get further below)
 * Green colors for above target (darker as you get further above)
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
  let colorString = '--color-chart-5'; // Default green

  // Below target - use red colors (darker as percentage decreases)
  if (percentage < 100) {
    if (percentage < 20)
      colorString = '--color-chart-red-5'; // Darkest red
    else if (percentage < 40) colorString = '--color-chart-red-4';
    else if (percentage < 60) colorString = '--color-chart-red-3';
    else if (percentage < 80) colorString = '--color-chart-red-2';
    else colorString = '--color-chart-red-1'; // Lightest red (close to target)
    return includeVar ? `var(${colorString})` : colorString;
  }

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
    return 'chart-100';
  }

  return 'chart-200';
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
