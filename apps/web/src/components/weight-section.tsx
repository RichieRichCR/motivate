'use client';

import { useDataContext } from '@/app/provider/data-provider';
import { getMetricDate } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Progress,
} from '@repo/ui';
import { useWeightCalculations } from './weight-section-hooks';
import { WeightMetric } from './weight-metric';
import { getProgressClass } from '@/lib/dashboard-helpers';
import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export const WeightSection = () => {
  const { currentMetrics, goalTargets, user, metricIds, weightHistory } =
    useDataContext();

  const metricDate = getMetricDate(user.data, metricIds.weight);
  const displayDate = metricDate
    ? `on ${new Date(metricDate).toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric',
      })}`
    : 'No date';

  const { weightToGo, sevenDayTrend, progress, isAboveTarget, isTrendingDown } =
    useWeightCalculations({
      currentWeight: currentMetrics.currentWeight,
      targetWeight: goalTargets.weight.value,
      weightHistory: weightHistory.data,
      startDate: goalTargets.weight.startDate,
    });

  const hasTriggeredConfetti = useRef(false);

  // Trigger confetti on goal achievement
  useEffect(() => {
    if (progress >= 100 && !hasTriggeredConfetti.current) {
      hasTriggeredConfetti.current = true;

      // Multiple confetti bursts for celebration
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }
  }, [progress]);

  console.log('WeightSection render', {
    weightToGo,
    sevenDayTrend,
    progress,
    isAboveTarget,
    isTrendingDown,
  });

  return (
    <div className="grid grid-cols-1 gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Card>
          <CardHeader className="flex items-center gap-0 border-b sm:flex-row">
            <div className="grid flex-1 gap-1">
              <CardTitle>Weight</CardTitle>
              <CardDescription>{displayDate}</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 justify-between gap-6">
              <WeightMetric
                label="Current"
                value={currentMetrics.currentWeight ?? '—'}
              />
              <WeightMetric label="Target" value={goalTargets.weight.value} />
              <WeightMetric
                label="To Go"
                value={weightToGo}
                className={cn(
                  isAboveTarget ? 'text-red-600' : 'text-green-600',
                )}
              />
              <WeightMetric
                label="7 Day Trend"
                value={sevenDayTrend ?? '—'}
                className={cn(
                  'items-baseline-last',
                  isTrendingDown
                    ? 'text-green-600 trend-positive'
                    : 'text-red-600 trend-warning',
                )}
                showTrend
                trendValue={sevenDayTrend}
                isTrendingDown={isTrendingDown}
              />
            </div>

            {/* Progress Bar */}
            <div className="grow shrink">
              <div className="text-xs font-bold text-left text-foreground/45 uppercase tracking-widest gap-0 mb-4">
                Progress
              </div>
              <motion.div
                className="flex flex-row flex-nowrap gap-4 justify-center items-center"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Progress
                  value={progress}
                  aria-description={`Weight Loss Progress @ ${progress}`}
                  className={cn(
                    'w-full h-2 rounded-lg transition-all duration-300',
                    `${getProgressClass(Number(progress), 100)}`,
                  )}
                />
                <motion.div
                  className="text-sm flex items-center shrink-0"
                  animate={
                    progress >= 100
                      ? {
                          scale: [1, 1.1, 1],
                          color: [
                            'var(--color-chart-1)',
                            'var(--color-chart-5)',
                            'var(--color-chart-1)',
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 1,
                    repeat: progress >= 100 ? Infinity : 0,
                  }}
                >
                  {progress}% to goal
                </motion.div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
