'use client';

/**
 * SubmissionsViewer — search box + table + read-state pill.
 * Archive = client-side hide toggle (no server action in v1).
 */

import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DataTable,
  DataTableEmpty,
  DataTableHead,
} from '@/components/admin/data-table';
import { SubmissionRow } from '@/components/admin/submission-row';
import type { ContactSubmissionRow } from '@/types/database';

export interface SubmissionsViewerProps {
  submissions: ContactSubmissionRow[];
}

export function SubmissionsViewer({ submissions }: SubmissionsViewerProps) {
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return submissions;
    return submissions.filter(
      (s) =>
        s.email.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        (s.subject ?? '').toLowerCase().includes(q)
    );
  }, [submissions, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search
            className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or subject"
            className="pl-7"
            aria-label="Search submissions"
          />
        </div>
        <span className="text-xs text-muted">
          {filtered.length} of {submissions.length}
        </span>
      </div>

      <DataTable caption="Contact submissions list">
        <DataTableHead
          columns={[
            { key: 'status', label: 'Status' },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'subject', label: 'Subject' },
            { key: 'received', label: 'Received' },
          ]}
        />
        <tbody>
          {filtered.length === 0 ? (
            <DataTableEmpty colSpan={5} message="No submissions match." />
          ) : (
            filtered.map((s) => <SubmissionRow key={s.id} submission={s} />)
          )}
        </tbody>
      </DataTable>
    </div>
  );
}
