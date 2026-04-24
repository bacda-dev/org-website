'use client';

/**
 * MarkdownEditor — thin wrapper around @uiw/react-md-editor.
 *
 * Dynamically imported so the ~200KB editor bundle is not shipped to every
 * admin page. Accepts `value`, `onChange`, and `height`. Defaults to 320px
 * which accommodates ~10 lines of markdown without dominating the viewport.
 */

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[320px] w-full" />,
  }
);

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  id?: string;
  ariaLabel?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  height = 320,
  id,
  ariaLabel,
}: MarkdownEditorProps) {
  return (
    <div
      data-color-mode="light"
      className="rounded-md border border-cream/10 bg-ink-50"
    >
      <MDEditor
        value={value}
        onChange={(next) => onChange(next ?? '')}
        height={height}
        preview="edit"
        hideToolbar={false}
        textareaProps={{
          id,
          'aria-label': ariaLabel ?? 'Markdown editor',
          placeholder: 'Write in markdown…',
        }}
      />
    </div>
  );
}
