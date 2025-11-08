'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { ContentCardProps } from '../types';
import { formatDate } from '../lib/utils';

export const ContentCard = ({ value, title, unit, date }: ContentCardProps) => {
  const displayValue = value ?? '—';
  const displayDate = date ? `as of ${formatDate(date)}` : 'No date';

  return (
    <Card>
      <CardHeader className="flex items-center gap-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="text-8xl font-black">{displayValue}</div>
        <div className="flex flex-row justify-between items-center mt-2 flex-nowrap">
          <div className="text-sm text-muted-foreground">{unit}</div>
          <div className="text-sm text-muted-foreground">{displayDate}</div>
        </div>
      </CardContent>
    </Card>
  );
};
