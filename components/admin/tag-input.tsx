'use client';

/**
 * TagInput — chip-style text input for string[] fields.
 *
 * Used for `collaborators` and team-member `credits`. Press Enter or comma to
 * commit a tag; Backspace on an empty input removes the last. Keyboard-first.
 */

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TagInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  id?: string;
  maxItems?: number;
  maxLength?: number;
  ariaLabel?: string;
}

export function TagInput({
  value,
  onChange,
  placeholder = 'Type and press Enter',
  id,
  maxItems = 50,
  maxLength = 200,
  ariaLabel,
}: TagInputProps) {
  const [draft, setDraft] = React.useState('');

  const commit = (raw: string) => {
    const next = raw.trim();
    if (!next) return;
    if (next.length > maxLength) return;
    if (value.includes(next)) {
      setDraft('');
      return;
    }
    if (value.length >= maxItems) return;
    onChange([...value, next]);
    setDraft('');
  };

  const removeAt = (index: number) => {
    const next = value.slice();
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <div
      className={cn(
        'flex min-h-[44px] flex-wrap items-center gap-1.5 border-b border-border py-2',
        'focus-within:border-burgundy focus-within:border-b-2'
      )}
    >
      {value.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-accent px-2.5 py-0.5 text-xs text-ink"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => removeAt(i)}
            className="rounded-full hover:bg-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        </span>
      ))}
      <input
        id={id}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={value.length === 0 ? placeholder : ''}
        aria-label={ariaLabel ?? placeholder}
        className="flex-1 min-w-[120px] bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            commit(draft);
          } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
            e.preventDefault();
            removeAt(value.length - 1);
          }
        }}
      />
    </div>
  );
}
