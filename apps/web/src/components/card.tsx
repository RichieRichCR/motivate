'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';

export const ContentCard = ({
  value,
  title,
  unit,
  date,
}: {
  value: string | undefined;
  title: string | undefined;
  unit: string | undefined;
  date: string | undefined;
}) => {
  return (
    <Card className="">
      <CardHeader className="flex items-center gap-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 ">
        <div className="text-8xl font-black">{value}</div>
        <div className="flex lex-row justify-between items-center mt-2 flex-nowrap">
          <div className="text-sm text-muted-foreground">{unit}</div>
          <div className="text-sm text-muted-foreground">
            {date ? `as of ${new Date(date).toLocaleDateString()}` : 'No date'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
