'use client';

import { useEffect, useRef, useState } from 'react';

export default function AnimateOnView({
  children,
  threshold = 0.1,
}: {
  children: React.ReactNode;
  threshold?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      { threshold },
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [threshold, isVisible]);

  return (
    <div ref={elementRef} style={{ minHeight: '1px' }}>
      {isVisible ? children : <div style={{ opacity: 0 }}>{children}</div>}
    </div>
  );
}
