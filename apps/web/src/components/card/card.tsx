'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui';
import { ContentCardProps } from '../../types';

export const ContentCard = ({ value, title, unit, date }: ContentCardProps) => {
  const displayValue = value ?? '—';
  const displayDate = date
    ? `as of ${new Date(date).toLocaleDateString(undefined, {
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
      <CardContent className="px-4 sm:px-6 ">
        <div className="text-6xl xk:text-7xl 2xl:text-8xl font-black flex flex-row justify-start items-baseline mt-2 flex-nowrap">
          {displayValue}
          <div className="text-sm text-muted-foreground">{unit}</div>
        </div>
      </CardContent>
    </Card>
  );
};
