'use client';

import * as React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Reveal — scroll-into-view stagger for editorial sections.
 *
 * Implements the `whileInView` pattern from the motion-framer skill: GPU-only
 * transforms (opacity + translateY), viewport-based trigger, once-only play.
 * Respects `prefers-reduced-motion` by rendering a plain <div>.
 *
 * Use `delay` for sibling stagger. `y` tunes the travel distance (default 16).
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
  y = 16,
  duration = 0.7,
  amount = 0.25,
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
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerGroup — a <ul>/<div> container that staggers the reveal of its
 * direct <RevealItem> children. Use when you have an unknown count of items
 * (event grids, testimonial lists, team cards) and want them to cascade in.
 */
export function StaggerGroup({
  children,
  className,
  step = 0.08,
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
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: step },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * RevealItem — child of <StaggerGroup> that inherits the parent's orchestrated
 * reveal. Renders a plain tag under reduced motion.
 */
export function RevealItem({
  children,
  className,
  y = 18,
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
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}
