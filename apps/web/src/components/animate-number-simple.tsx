'use client';

import { useSpring, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export default function AnimateNumberSimple({
  value,
  className,
  as = 'span',
  x,
  y,
}: {
  value: number;
  className?: string;
  as?: 'span' | 'tspan';
  x?: number;
  y?: number;
}) {
  const elementRef = useRef<HTMLSpanElement | SVGTSpanElement>(null);
  const hasAnimated = useRef(false);
  const [displayValue, setDisplayValue] = useState('0');

  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  // Check if target value has decimals
  const hasDecimals = value !== Math.floor(value);

  const display = useTransform(spring, (current) => {
    if (hasDecimals) {
      // For decimal numbers, show decimals during animation
      const rounded = Math.round(current * 100) / 100;
      return rounded === Math.floor(rounded)
        ? Math.floor(rounded).toLocaleString()
        : rounded.toFixed(2).replace(/\.?0+$/, '');
    } else {
      // For whole numbers, always show as integers
      return Math.floor(current).toLocaleString();
    }
  });

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            spring.set(0);
            setTimeout(() => spring.set(value), 50);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = display.on('change', (latest) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [display]);

  const Component = as;

  if (as === 'tspan') {
    return (
      <Component
        // @ts-expect-error - ref typing for dynamic component
        ref={elementRef}
        x={x}
        y={y}
        className={className}
      >
        {displayValue}
      </Component>
    );
  }

  return (
    <Component
      // @ts-expect-error - ref typing for dynamic component
      ref={elementRef}
      className={className}
    >
      {displayValue}
    </Component>
  );
}
