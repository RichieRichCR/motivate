'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@repo/ui';
import { ContentCardProps } from '../../types';

export const ContentCard = ({
  value,
  title,
  unit,
  date,
  className,
}: ContentCardProps) => {
  const displayValue = value ?? '—';
  const displayDate = date
    ? `on ${new Date(date).toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric',
      })}`
    : 'No date';

  return (
    <Card>
      <CardHeader className="flex items-center gap-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{displayDate}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className={cn('px-6', className)}>
        <div className="text-6xl xk:text-7xl 2xl:text-8xl font-black flex flex-row justify-start items-baseline mt-2 flex-nowrap">
          {displayValue}
          <div className="text-sm text-muted-foreground">{unit}</div>
        </div>
      </CardContent>
    </Card>
  );
};
