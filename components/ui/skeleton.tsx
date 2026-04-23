import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Skeleton — pulse-animated placeholder for loading states.
 * Uses the `border` token as the bg tint so the shimmer reads well on the
 * cream page background without introducing a new color.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-border/70', className)}
      {...props}
    />
  );
}
Skeleton.displayName = 'Skeleton';

export { Skeleton };
