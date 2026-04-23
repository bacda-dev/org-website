import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Input — underline style per PRD §6.5 (no boxed inputs, burgundy focus ring).
 * The input rests on a bottom border only; focus thickens the border to the
 * burgundy (logo-derived amber) accent and the component also picks up the
 * global focus-visible ring for keyboard users.
 *
 * Supports `aria-invalid="true"` to paint the error state without a separate
 * error prop — downstream React Hook Form integrations pass the flag through
 * `{...register('field')}` + error state automatically.
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
          'flex w-full bg-transparent px-0 py-2 text-base text-ink',
          'border-0 border-b border-border rounded-none',
          'placeholder:text-muted',
          'focus:outline-none focus:border-burgundy focus:border-b-2',
          'focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-60',
          'aria-[invalid=true]:border-error aria-[invalid=true]:focus:border-error',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink',
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
