'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Button primitive — PRD §6.5 compliant.
 *
 * Variants:
 *   - default     : filled burgundy (logo-derived burnt amber), cream text
 *   - outline     : ink border, transparent bg
 *   - ghost       : text-only, no bg; hover cream-tint
 *   - destructive : error-bg + cream text (for destructive admin actions)
 *   - link        : underline-on-hover, inline text style
 *
 * Sizes: sm (36px), md (default, 44px touch target), lg (52px), icon (square).
 * md+ meets the 44px minimum touch target from PRD §6.5.
 *
 * Use `asChild` to render the class-only styling onto a child element (e.g.
 * wrap a Next <Link>). This delegates to Radix Slot, preserving props.
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-sans font-medium tracking-tight',
    'rounded-full',
    'transition-colors duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'bg-burgundy text-ink hover:bg-burgundy-dark active:bg-burgundy-dark',
        outline:
          'border border-cream/30 bg-transparent text-cream hover:border-cream/60 hover:bg-cream/5',
        ghost:
          'bg-transparent text-cream/80 hover:bg-cream/5 hover:text-cream',
        destructive:
          'bg-error text-cream hover:bg-error/90 active:bg-error/80',
        link:
          'text-burgundy underline-offset-4 hover:underline p-0 h-auto rounded-none',
      },
      size: {
        sm: 'h-9 px-3 text-sm [&_svg]:size-4',
        md: 'h-11 px-5 text-sm md:min-h-[44px] [&_svg]:size-4',
        lg: 'h-13 px-7 text-base md:min-h-[52px] [&_svg]:size-5',
        icon: 'h-11 w-11 md:min-h-[44px] md:min-w-[44px] [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
