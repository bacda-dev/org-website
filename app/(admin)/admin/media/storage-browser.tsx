'use client';

/**
 * StorageBrowser — read-only display of `gallery/` and `posters/` Supabase
 * Storage buckets. Listing is loaded server-side (see page.tsx). This client
 * component renders thumbnails + copy-URL helpers.
 *
 * v1: read-only. No delete button in storage — admins remove photos via the
 * event editor's photo section, which calls the proper action + deletes the
 * row. Raw storage delete would orphan rows.
 */

import * as React from 'react';
import Image from 'next/image';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface StorageEntry {
  name: string;
  path: string;
  publicUrl: string;
}

interface Bucket {
  name: string;
  entries: StorageEntry[];
}

export interface StorageBrowserProps {
  buckets: ReadonlyArray<Bucket>;
}

export function StorageBrowser({ buckets }: StorageBrowserProps) {
  const copy = (url: string) => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      toast.error('Clipboard not available in this browser');
      return;
    }
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success('URL copied'))
      .catch(() => toast.error('Copy failed'));
  };

  return (
    <div className="flex flex-col gap-8">
      {buckets.map((bucket) => (
        <section
          key={bucket.name}
          className="rounded-md border border-border bg-white p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
              {bucket.name} — {bucket.entries.length} file
              {bucket.entries.length === 1 ? '' : 's'}
            </h3>
          </div>
          {bucket.entries.length === 0 ? (
            <p className="text-sm text-muted">
              No files at bucket root. Use the event editor to upload content.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {bucket.entries.map((entry) => (
                <li
                  key={`${bucket.name}-${entry.path}`}
                  className="overflow-hidden rounded-md border border-border"
                >
                  <div className="relative aspect-square bg-cream">
                    {isImage(entry.name) ? (
                      <Image
                        src={entry.publicUrl}
                        alt={entry.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted">
                        {extOf(entry.name)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2">
                    <span
                      className="truncate font-mono text-xs text-muted"
                      title={entry.name}
                    >
                      {entry.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Copy URL"
                      onClick={() => copy(entry.publicUrl)}
                    >
                      <Copy className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}

function extOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot === -1 ? '—' : name.slice(dot + 1).toUpperCase();
}

function isImage(name: string): boolean {
  return /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(name);
}
