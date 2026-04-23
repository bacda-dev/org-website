/**
 * DataTable — minimal sortable table wrapper.
 *
 * Intentionally kept as server-render-friendly HTML/Tailwind rather than a
 * client-heavy table library. Admin list pages call this with a header row
 * and a rendered list of body rows. For row-level interactivity (delete,
 * toggle), pages wrap each row in their own client component.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DataTableProps {
  children: React.ReactNode;
  className?: string;
  caption?: string;
}

export function DataTable({ children, className, caption }: DataTableProps) {
  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-md border border-border bg-white',
        className
      )}
    >
      <table className="w-full border-collapse text-left text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
}

export function DataTableHead({
  columns,
}: {
  columns: ReadonlyArray<{ key: string; label: string; className?: string }>;
}) {
  return (
    <thead className="border-b border-border bg-accent/40">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            scope="col"
            className={cn(
              'px-4 py-3 text-xs font-medium uppercase tracking-[0.08em] text-muted',
              col.className
            )}
          >
            {col.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function DataTableEmpty({
  colSpan,
  message = 'No entries yet.',
}: {
  colSpan: number;
  message?: string;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-12 text-center text-sm text-muted"
      >
        {message}
      </td>
    </tr>
  );
}
