'use client';

import * as React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Reveal — additive scroll-into-view motion for editorial sections.
 *
 * Content is ALWAYS visible at SSR (opacity:1); motion only adjusts y-offset
 * on client-side when the element enters the viewport. This keeps the page
 * readable without JS, for crawlers, and in fullPage screenshots.
 */
export interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number;
  y?: number;
  duration?: number;
  amount?: number;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 14,
  duration = 0.7,
  amount = 0.1,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={cn(className)}>{children as React.ReactNode}</div>;
  }
  return (
    <motion.div
      initial={{ opacity: 1, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({
  children,
  className,
  step = 0.06,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  step?: number;
  as?: 'div' | 'ul' | 'ol' | 'section';
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <Tag className={cn(className)}>{children}</Tag>;
  }
  const MotionTag = motion[Tag] as typeof motion.div;
  return (
    <MotionTag
      className={cn(className)}
      initial="show"
      whileInView="show"
      viewport={{ once: true, amount: 0.05 }}
      variants={{
        rest: {},
        show: {
          transition: { staggerChildren: step },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  y = 14,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  as?: 'li' | 'div' | 'article';
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <Tag className={cn(className)}>{children}</Tag>;
  }
  const MotionTag = motion[Tag] as typeof motion.div;
  return (
    <MotionTag
      className={cn(className)}
      variants={{
        rest: { opacity: 1, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      initial="rest"
    >
      {children}
    </MotionTag>
  );
}
