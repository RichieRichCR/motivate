'use client';

import { Card, CardHeader, CardTitle, cn } from '@repo/ui';

export const TitleSection = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <Card
      className={cn(
        'text-xs font-bold text-left  text-foreground/45 uppercase tracking-widest gap-0',
        className,
      )}
    >
      <CardHeader className="pb-0 gap-0">
        <CardTitle>{children}</CardTitle>
      </CardHeader>
    </Card>
  );
};
