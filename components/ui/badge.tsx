import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badge — small status/metadata label.
 * Variants map to the semantic color tokens: default (burgundy filled),
 * secondary (gold tint), outline (ink border only), destructive (error).
 */
const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5',
    'text-xs font-medium tracking-tight',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-transparent bg-burgundy text-cream',
        secondary: 'border-transparent bg-gold/20 text-cream',
        outline: 'border-cream/10 bg-transparent text-cream',
        destructive: 'border-transparent bg-error text-cream',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
