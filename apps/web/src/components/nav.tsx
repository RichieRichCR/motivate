'use client';

import { useEffect, useRef } from 'react';
import { useTimeframe } from '@/app/provider/timeframe-provider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';
import { RefreshButton } from './refresh-button';

export const NavBar = () => {
  const navRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { timeRange, setTimeRange, timeRangeOptions } = useTimeframe();

  useEffect(() => {
    const nav = navRef.current;
    const sentinel = sentinelRef.current;
    if (!nav || !sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is not visible, nav is stuck
        nav.classList.toggle('stuck', !entry.isIntersecting);
      },
      { threshold: [0], rootMargin: '0px 0px 0px 0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sentinel element to detect when nav becomes sticky */}
      <div ref={sentinelRef} className="h-0" />
      <nav
        ref={navRef}
        className="sticky top-0 w-full h-16 bg-card/30 backdrop-blur-2xl text-card-foreground gap-6 border border-foreground/20 p-4 shadow-2xl flex items-center justify-between z-20 rounded-2xl transition-all duration-200 transform-3d "
      >
        <h1 className="text-xs lg:text-sm tracking-widest uppercase font-black">
          Motivate Me
        </h1>
        <div className="flex items-center gap-2">
          <div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-40 rounded-lg"
                aria-label="Select time range for dashboard metrics"
              >
                <SelectValue placeholder={timeRangeOptions[0]?.label} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {timeRangeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <RefreshButton />
          </div>
        </div>
      </nav>
    </>
  );
};
