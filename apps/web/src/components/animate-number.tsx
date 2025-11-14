'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@repo/ui';
import {
  DIGIT_ANIMATION_BASE_DELAY_MS,
  DIGIT_ANIMATION_MIN_STEP_MS,
  DIGIT_ANIMATION_MAX_STEP_MS,
} from '@/lib/utils';

function RollingDigit({
  targetDigit,
  position,
  direction,
}: {
  targetDigit: string;
  position: number;
  direction?: 'up' | 'down' | 'none';
}) {
  const [currentDigit, setCurrentDigit] = useState('0');

  useEffect(() => {
    if (targetDigit === '.') {
      setCurrentDigit('.');
      return;
    }

    const target = parseInt(targetDigit);

    if (isNaN(target)) {
      setCurrentDigit(targetDigit);
      return;
    }

    // If target is 0, just set it without animation
    if (target === 0) {
      setCurrentDigit('0');
      return;
    }

    let current = 0;
    setCurrentDigit('0');

    // Delay based on position (rightmost digits start first)
    const startDelay = position * DIGIT_ANIMATION_BASE_DELAY_MS;

    const timeout = setTimeout(() => {
      // Easing function - starts fast, slows down
      const getStepDuration = (step: number, total: number) => {
        const progress = step / total;
        // Ease out quadratic
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const range = DIGIT_ANIMATION_MAX_STEP_MS - DIGIT_ANIMATION_MIN_STEP_MS;
        return DIGIT_ANIMATION_MIN_STEP_MS + easeProgress * range;
      };

      let stepCount = 0;
      const roll = () => {
        if (current < target) {
          current++;
          setCurrentDigit(current.toString());
          stepCount++;

          const nextDelay = getStepDuration(stepCount, target);
          setTimeout(roll, nextDelay);
        }
      };

      roll();
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [targetDigit, position]);

  const isOne = targetDigit === '1';
  const isDecimal = currentDigit === '.';
  const isNegative = currentDigit === '-';

  // Add glow effect class based on direction
  const glowClass =
    direction === 'up'
      ? 'number-up'
      : direction === 'down'
        ? 'number-down'
        : '';

  return (
    <span
      className={cn(
        `inline-block relative overflow-hidden align-baseline h-12 2xl:h-20`,
        { 'w-4 2xl:w-5 bg-transparent': isDecimal },
        { 'w-6 2xl:w-10 ': isNegative },
        { 'w-10 2xl:w-16': !isDecimal && !isNegative && !isOne },
        { 'w-8 2xl:w-14': isOne },
      )}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={currentDigit}
          initial={{
            y: '100%',
            x: '10%',
            filter: 'blur(8px) brightness(0.7)',
            opacity: 0,
            scale: 0.8,
            rotate: -5,
            rotateX: 45,
          }}
          animate={{
            y: '0%',
            x: '0%',
            filter: 'blur(0px) brightness(1.2)',
            opacity: 1,
            scale: 1,
            rotate: 0,
            rotateX: 0,
          }}
          exit={{
            y: '-100%',
            x: '10%',
            filter: 'blur(4px) brightness(0.7)',
            opacity: 0,
            scale: 0.8,
            rotate: 5,
            rotateX: -45,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            mass: 0.8,
          }}
          style={{ transformPerspective: 800 }}
          className={cn(
            `flex items-center justify-center absolute inset-0 ${
              isDecimal ? 'p-0' : ''
            }`,
            glowClass,
          )}
        >
          {currentDigit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function AnimateNumber({
  value,
  className,
}: {
  value: number;
  className: string;
}) {
  // Format the target value
  const rounded = Math.round(value * 100) / 100;
  const formatted =
    rounded === Math.floor(rounded)
      ? Math.floor(rounded).toFixed(0)
      : rounded.toFixed(2).replace(/\.?0+$/, '');

  const chars = formatted.split('');

  return (
    <span className={className} style={{ display: 'inline-flex' }}>
      {chars.map((char, i) => (
        <RollingDigit
          key={`pos-${i}`}
          targetDigit={char}
          position={chars.length - i - 1}
          direction="none"
        />
      ))}
    </span>
  );
}
