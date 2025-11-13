import { Card, CardContent, CardHeader, Skeleton } from '@repo/ui';

export const SkeletonDashboard = () => {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* Export and Title Row Skeleton */}
      <div className="flex items-center justify-between w-full">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Weight Section Skeleton */}
      <div className="flex flex-col gap-4 w-full">
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-4 w-full mt-4" />
          </CardContent>
        </Card>
      </div>

      {/* Daily Activity Section Skeleton */}
      <div className="flex flex-col gap-4 w-full">
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-0">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Long Term Activity Section Skeleton */}
      <div className="flex flex-col gap-4 w-full">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-0">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[400px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
