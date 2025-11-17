import { Skeleton } from '@repo/ui';

export const SkeletonNav = () => {
  return (
    <>
      {/* Sentinel placeholder */}
      <div className="h-0" />
      <nav className="sticky top-0 w-full h-16 bg-card/30 backdrop-blur-2xl text-card-foreground gap-6 border border-foreground/20 p-4 shadow-2xl flex items-center justify-between z-20 rounded-2xl">
        <Skeleton className="h-6 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-40 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </nav>
    </>
  );
};
