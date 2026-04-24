'use client';

/**
 * SubmissionRow — row + detail dialog for a contact submission.
 *
 * Client component because it owns (a) the "read" state (localStorage-scoped,
 * per PRD v1 spec) and (b) the detail dialog open state. Parent list keeps a
 * search filter live in its own state.
 */

import * as React from 'react';
import { Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ContactSubmissionRow } from '@/types/database';

const READ_STORAGE_KEY = 'admin:read-submissions';

function loadReadSet(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(READ_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is string => typeof x === 'string'));
  } catch {
    return new Set();
  }
}

function saveReadSet(s: Set<string>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      READ_STORAGE_KEY,
      JSON.stringify(Array.from(s))
    );
  } catch {
    // ignore — localStorage may be blocked (private mode); read-state is non-critical.
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export interface SubmissionRowProps {
  submission: ContactSubmissionRow;
}

export function SubmissionRow({ submission }: SubmissionRowProps) {
  const [open, setOpen] = React.useState(false);
  const [isRead, setIsRead] = React.useState<boolean>(false);

  React.useEffect(() => {
    const set = loadReadSet();
    setIsRead(set.has(submission.id));
  }, [submission.id]);

  const markRead = React.useCallback(() => {
    const set = loadReadSet();
    if (!set.has(submission.id)) {
      set.add(submission.id);
      saveReadSet(set);
      setIsRead(true);
    }
  }, [submission.id]);

  return (
    <>
      <tr
        className="cursor-pointer border-b border-cream/10 transition-colors hover:bg-accent/30"
        onClick={() => {
          setOpen(true);
          markRead();
        }}
      >
        <td className="px-4 py-3">
          {isRead ? (
            <Badge variant="outline">Read</Badge>
          ) : (
            <Badge variant="default">New</Badge>
          )}
        </td>
        <td className="px-4 py-3 font-medium text-cream">{submission.name}</td>
        <td className="px-4 py-3 text-cream/55">{submission.email}</td>
        <td className="px-4 py-3 text-cream">
          {submission.subject ?? <span className="text-cream/55">—</span>}
        </td>
        <td className="px-4 py-3 text-xs text-cream/55">
          {formatDate(submission.created_at)}
        </td>
      </tr>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{submission.subject ?? 'Message'}</DialogTitle>
            <DialogDescription>
              From {submission.name} &lt;{submission.email}&gt; on{' '}
              {formatDate(submission.created_at)}
            </DialogDescription>
          </DialogHeader>
          <div className="whitespace-pre-wrap text-sm text-cream">
            {submission.message}
          </div>
          <DialogFooter className="mt-4">
            <Button
              asChild
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <a
                href={`mailto:${submission.email}?subject=${encodeURIComponent(
                  `Re: ${submission.subject ?? 'your message to BACDA'}`
                )}`}
              >
                <Mail className="size-4" aria-hidden="true" />
                Reply
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
