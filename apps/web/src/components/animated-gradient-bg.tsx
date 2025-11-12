'use client';

import { motion, useAnimation } from 'motion/react';
import { useState } from 'react';

export const AnimatedGradientBackground = () => {
  const [shouldGravitate, setShouldGravitate] = useState(false);

  // Create animation controls for each blob
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();
  const controls4 = useAnimation();
  const controls5 = useAnimation();
  const controls6 = useAnimation();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    // Get click position as percentage relative to center (50%, 50%)
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Calculate offset from center in percentage
    const offsetX = clickX - 50;
    const offsetY = clickY - 50;

    setShouldGravitate(true);

    // Animate all blobs to click position using percentages
    controls1.start({
      x: `${offsetX}%`,
      y: `${offsetY}%`,
      scale: 0.7,
      transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }, // Snappy spring-like easing
    });
    controls2.start({
      x: `${offsetX}%`,
      y: `${offsetY}%`,
      scale: 0.7,
      transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
    });
    controls3.start({
      x: `${offsetX}%`,
      y: `${offsetY}%`,
      scale: 0.7,
      transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
    });
    controls4.start({
      x: `${offsetX}%`,
      y: `${offsetY}%`,
      scale: 0.7,
      transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
    });
    controls5.start({
      x: `${offsetX}%`,
      y: `${offsetY}%`,
      scale: 0.7,
      transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
    });
    controls6.start({
      x: `${offsetX}%`,
      y: `${offsetY}%`,
      scale: 0.7,
      transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
    });

    // Resume normal animation after 1.5 seconds
    setTimeout(() => {
      setShouldGravitate(false);
    }, 1500);
  };
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {/* Primary gradient blob - Blue/Purple */}
      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            'radial-gradient(circle, var(--color-chart-blue-1) 0%, var(--color-chart-blue-3) 50%, transparent 100%)',
          left: '50%',
          top: '50%',
        }}
        animate={
          shouldGravitate
            ? controls1
            : {
                x: ['40%', '-40%', '30%', '40%'],
                y: ['30%', '-30%', '40%', '30%'],
                scale: [1.1, 0.8, 1.3, 1.1],
              }
        }
        transition={
          shouldGravitate
            ? {}
            : {
                duration: 28,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      />

      {/* Secondary gradient blob - Green/Teal */}
      <motion.div
        className="absolute w-[750px] h-[750px] rounded-full opacity-25 blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            'radial-gradient(circle, var(--color-chart-1) 0%, var(--color-chart-3) 50%, transparent 100%)',
          left: '50%',
          top: '50%',
        }}
        animate={
          shouldGravitate
            ? controls2
            : {
                x: ['-45%', '45%', '-20%', '-45%'],
                y: ['0%', '35%', '-45%', '0%'],
                scale: [0.9, 1.2, 0.85, 0.9],
              }
        }
        transition={
          shouldGravitate
            ? {}
            : {
                duration: 32,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      />

      {/* Tertiary gradient blob - Purple/Pink */}
      <motion.div
        className="absolute w-[850px] h-[850px] rounded-full opacity-20 blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            'radial-gradient(circle, var(--color-primary) 0%, var(--color-chart-blue-2) 50%, transparent 100%)',
          left: '50%',
          top: '50%',
        }}
        animate={
          shouldGravitate
            ? controls3
            : {
                x: ['-5%', '35%', '-50%', '-5%'],
                y: ['-40%', '20%', '30%', '-40%'],
                scale: [1, 1.15, 0.9, 1],
                rotate: [0, 120, 240, 360],
              }
        }
        transition={
          shouldGravitate
            ? {}
            : {
                duration: 35,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      />

      {/* Quaternary accent blob - Red/Orange tones */}
      <motion.div
        className="absolute w-[650px] h-[650px] rounded-full opacity-18 blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            'radial-gradient(circle, var(--color-chart-red-1) 0%, var(--color-chart-red-3) 50%, transparent 100%)',
          left: '50%',
          top: '50%',
        }}
        animate={
          shouldGravitate
            ? controls4
            : {
                x: ['25%', '-40%', '40%', '25%'],
                y: ['-35%', '30%', '-25%', '-35%'],
                scale: [1.2, 0.85, 1.1, 1.2],
                rotate: [0, -90, -180, -270, -360],
              }
        }
        transition={
          shouldGravitate
            ? {}
            : {
                duration: 30,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      />

      {/* Fifth blob - Cyan/Blue */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full opacity-22 blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            'radial-gradient(circle, var(--color-chart-blue-4) 0%, var(--color-chart-5) 50%, transparent 100%)',
          left: '50%',
          top: '50%',
        }}
        animate={
          shouldGravitate
            ? controls5
            : {
                x: ['-20%', '30%', '-45%', '-20%'],
                y: ['40%', '-30%', '20%', '40%'],
                scale: [0.95, 1.25, 0.8, 0.95],
              }
        }
        transition={
          shouldGravitate
            ? {}
            : {
                duration: 26,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      />

      {/* Sixth blob - Warm tones */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-15 blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            'radial-gradient(circle, var(--color-chart-2) 0%, var(--color-chart-blue-5) 50%, transparent 100%)',
          left: '50%',
          top: '50%',
        }}
        animate={
          shouldGravitate
            ? controls6
            : {
                x: ['10%', '-50%', '35%', '10%'],
                y: ['-10%', '25%', '-45%', '-10%'],
                scale: [1.05, 0.9, 1.2, 1.05],
                rotate: [0, 90, 180, 270, 360],
              }
        }
        transition={
          shouldGravitate
            ? {}
            : {
                duration: 38,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      />

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-linear-to-b from-background/50 via-transparent to-background/80 pointer-events-none" />
    </div>
  );
};
