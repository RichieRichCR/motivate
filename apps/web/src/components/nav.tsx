'use client';

import { useEffect, useRef } from 'react';

export const NavBar = () => {
  const navRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const sentinel = sentinelRef.current;
    if (!nav || !sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is not visible, nav is stuck
        nav.classList.toggle('stuck', !entry.isIntersecting);
      },
      { threshold: [0], rootMargin: '0px 0px -1px 0px' },
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
        className="sticky top-0 w-full h-16 bg-background/50 backdrop-blur-sm flex items-center px-4 z-20 rounded-2xl shadow-md transition-all duration-200"
      >
        <h1 className="text-sm tracking-widest uppercase font-black">
          Motivate Richie Rich
        </h1>
      </nav>
    </>
  );
};
