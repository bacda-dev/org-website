'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * 25th Anniversary (Silver Jubilee) badge — celebratory mark for 2002–2026.
 *
 * Sits on the AnniversaryBand which is solid ink. The badge's own black
 * background blends seamlessly with the band, so we don't need any blend
 * mode. Two motion layers:
 *   1) A pulsing amber halo behind the mark (4s loop) — slow, ceremonial,
 *      reads like a coin catching warm light.
 *   2) Mount entrance: scale-up + fade-in.
 *
 * Honors `prefers-reduced-motion` — animations stop, the static badge stays.
 */
export interface AnniversaryBadgeProps {
  className?: string;
  /** Pixel width hint for `next/image` `sizes` (defaults to 160). */
  size?: number;
}

export function AnniversaryBadge({
  className,
  size = 160,
}: AnniversaryBadgeProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: reduce ? 0 : 1.1,
        delay: reduce ? 0 : 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        'pointer-events-none relative aspect-square select-none',
        className
      )}
    >
      {/* Pulsing amber halo behind the badge. Sits inset slightly so the
          glow hugs the gold ring without bleeding to a hard edge. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full"
        style={{ boxShadow: '0 0 60px 10px rgba(224, 141, 47, 0.35)' }}
        animate={
          reduce
            ? undefined
            : {
                opacity: [0.35, 0.65, 0.35],
                scale: [1, 1.04, 1],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      />

      <Image
        src="/brand/bacda-25-anniversary.png"
        alt="BACDA Silver Jubilee — 25 years of dance, 2002–2026"
        fill
        sizes={`${size}px`}
        className="relative object-contain"
        priority
      />
    </motion.div>
  );
}
