import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Input — underline style. Cream-on-ink for the admin surfaces.
 * Bottom border only; focus thickens to the burgundy (logo amber) accent.
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex w-full bg-transparent px-0 py-2.5 text-base text-cream',
          'border-0 border-b border-cream/25 rounded-none',
          'placeholder:text-cream/35',
          'focus:outline-none focus:border-burgundy focus:border-b-2',
          'focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-60',
          'aria-[invalid=true]:border-error aria-[invalid=true]:focus:border-error',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-cream',
          'transition-colors duration-150 ease-out',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
