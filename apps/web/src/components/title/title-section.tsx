'use client';

import { cn } from '@repo/ui';
import { motion } from 'motion/react';

export const TitleSection = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth acceleration
      }}
      className={cn(
        'text-xs font-bold text-left text-foreground/45 uppercase tracking-widest gap-0 mt-8',
        className,
      )}
    >
      {children}
    </motion.div>

    // <Card
    //   className={cn(
    //     'text-xs font-bold text-left  text-foreground/45 uppercase tracking-widest gap-0',
    //     className,
    //   )}
    // >
    //   <CardHeader className="pb-0 gap-0">
    //     <CardTitle>{children}</CardTitle>
    //   </CardHeader>
    // </Card>
  );
};
