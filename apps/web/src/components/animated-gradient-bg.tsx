'use client';

import { motion, useAnimation } from 'motion/react';
import { useState, useMemo } from 'react';
import { ANIMATION_GRAVITATE_DURATION_MS } from '@/lib/utils';

interface BlobConfig {
  size: string;
  opacity: string;
  background: string;
  animate: {
    x: string[];
    y: string[];
    scale: number[];
    rotate?: number[];
  };
  duration: number;
}

export const AnimatedGradientBackground = () => {
  const [shouldGravitate, setShouldGravitate] = useState(false);

  // Blob configurations
  const blobConfigs: BlobConfig[] = useMemo(
    () => [
      {
        size: 'w-[900px] h-[900px]',
        opacity: 'opacity-30',
        background:
          'radial-gradient(circle, var(--color-chart-blue-1) 0%, var(--color-chart-blue-3) 50%, transparent 100%)',
        animate: {
          x: ['40%', '-40%', '30%', '40%'],
          y: ['30%', '-30%', '40%', '30%'],
          scale: [1.1, 0.8, 1.3, 1.1],
        },
        duration: 28,
      },
      {
        size: 'w-[750px] h-[750px]',
        opacity: 'opacity-25',
        background:
          'radial-gradient(circle, var(--color-chart-1) 0%, var(--color-chart-3) 50%, transparent 100%)',
        animate: {
          x: ['-45%', '45%', '-20%', '-45%'],
          y: ['0%', '35%', '-45%', '0%'],
          scale: [0.9, 1.2, 0.85, 0.9],
        },
        duration: 32,
      },
      {
        size: 'w-[850px] h-[850px]',
        opacity: 'opacity-20',
        background:
          'radial-gradient(circle, var(--color-primary) 0%, var(--color-chart-blue-2) 50%, transparent 100%)',
        animate: {
          x: ['-5%', '35%', '-50%', '-5%'],
          y: ['-40%', '20%', '30%', '-40%'],
          scale: [1, 1.15, 0.9, 1],
          rotate: [0, 120, 240, 360],
        },
        duration: 35,
      },
      {
        size: 'w-[650px] h-[650px]',
        opacity: 'opacity-18',
        background:
          'radial-gradient(circle, var(--color-chart-red-1) 0%, var(--color-chart-red-3) 50%, transparent 100%)',
        animate: {
          x: ['25%', '-40%', '40%', '25%'],
          y: ['-35%', '30%', '-25%', '-35%'],
          scale: [1.2, 0.85, 1.1, 1.2],
          rotate: [0, -90, -180, -270, -360],
        },
        duration: 30,
      },
      {
        size: 'w-[700px] h-[700px]',
        opacity: 'opacity-22',
        background:
          'radial-gradient(circle, var(--color-chart-blue-4) 0%, var(--color-chart-5) 50%, transparent 100%)',
        animate: {
          x: ['-20%', '30%', '-45%', '-20%'],
          y: ['40%', '-30%', '20%', '40%'],
          scale: [0.95, 1.25, 0.8, 0.95],
        },
        duration: 26,
      },
      {
        size: 'w-[800px] h-[800px]',
        opacity: 'opacity-15',
        background:
          'radial-gradient(circle, var(--color-chart-2) 0%, var(--color-chart-blue-5) 50%, transparent 100%)',
        animate: {
          x: ['10%', '-50%', '35%', '10%'],
          y: ['-10%', '25%', '-45%', '-10%'],
          scale: [1.05, 0.9, 1.2, 1.05],
          rotate: [0, 90, 180, 270, 360],
        },
        duration: 38,
      },
    ],
    [],
  );

  // Create animation controls for each blob
  const control1 = useAnimation();
  const control2 = useAnimation();
  const control3 = useAnimation();
  const control4 = useAnimation();
  const control5 = useAnimation();
  const control6 = useAnimation();
  const controls = [control1, control2, control3, control4, control5, control6];

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    const offsetX = clickX - 50;
    const offsetY = clickY - 50;

    setShouldGravitate(true);

    // Animate all blobs to click position
    controls.forEach((control) => {
      control.start({
        x: `${offsetX}%`,
        y: `${offsetY}%`,
        scale: 0.7,
        transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
      });
    });

    setTimeout(
      () => setShouldGravitate(false),
      ANIMATION_GRAVITATE_DURATION_MS,
    );
  };

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {blobConfigs.map((config, index) => (
        <motion.div
          key={index}
          className={`absolute ${config.size} rounded-full ${config.opacity} blur-3xl -translate-x-1/2 -translate-y-1/2`}
          style={{
            background: config.background,
            left: '50%',
            top: '50%',
          }}
          animate={shouldGravitate ? controls[index] : config.animate}
          transition={
            shouldGravitate
              ? {}
              : {
                  duration: config.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        />
      ))}

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-linear-to-b from-background/50 via-transparent to-background/80 pointer-events-none" />
    </div>
  );
};
