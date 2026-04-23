import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Textarea — same underline style as Input (PRD §6.5).
 * Defaults to min-height 96px so form textareas have a reasonable draft space
 * without forcing a specific rows value.
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[96px] w-full bg-transparent px-0 py-2 text-base text-ink',
          'border-0 border-b border-border rounded-none resize-y',
          'placeholder:text-muted',
          'focus:outline-none focus:border-burgundy focus:border-b-2',
          'focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-60',
          'aria-[invalid=true]:border-error aria-[invalid=true]:focus:border-error',
          'transition-colors duration-150 ease-out',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
