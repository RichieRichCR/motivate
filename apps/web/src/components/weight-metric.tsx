import { cn } from '@repo/ui';
import { TrendingDown, TrendingUp } from 'lucide-react';
import AnimateNumber from './animate-number';

interface WeightMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
  showTrend?: boolean;
  trendValue?: number | null;
  isTrendingDown?: boolean;
}

/**
 * Reusable component for displaying weight metrics
 */
export const WeightMetric = ({
  label,
  value,
  unit = 'Kgs',
  className,
  showTrend = false,
  trendValue,
  isTrendingDown,
}: WeightMetricProps) => {
  return (
    <div className={cn('grow shrink w-full lg:w-auto')}>
      <div className="text-xs font-bold text-left text-foreground/45 uppercase tracking-widest gap-0">
        {label}
      </div>
      <div
        className={cn(
          'flex flex-row justify-start items-baseline mt-2 flex-nowrap',
          className,
        )}
      >
        <AnimateNumber
          value={Number(value)}
          className="text-6xl xk:text-7xl 2xl:text-8xl font-black"
        />
        {showTrend && trendValue !== null && (
          <div className="flex flex-col gap-1 items-center justify-center ml-2">
            {isTrendingDown ? (
              <TrendingDown className="text-primary" />
            ) : (
              <TrendingUp className="text-red-600" />
            )}
            <div className="text-sm">{unit}</div>
          </div>
        )}
        {!showTrend && (
          <div className="text-sm text-muted-foreground">{unit}</div>
        )}
      </div>
    </div>
  );
};
