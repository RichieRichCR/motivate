import { useEffect, useRef, useState } from 'react';

export function useAnimateOnView(threshold = 0.5) {
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            setIsVisible(true);
          }
        });
      },
      { threshold },
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [threshold]);

  return { isVisible, elementRef };
}
