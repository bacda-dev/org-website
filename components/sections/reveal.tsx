'use client';

import * as React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Reveal — fade + translate-8 on scroll into view. Respects
 * prefers-reduced-motion (renders a plain div with no motion). Used throughout
 * the editorial sections for gentle, non-parallax entry animations per PRD
 * §14.2. Staggered children can pass `delay` in seconds.
 */
export interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
  y?: number;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 12,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={cn(className)}>{children as React.ReactNode}</div>;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
