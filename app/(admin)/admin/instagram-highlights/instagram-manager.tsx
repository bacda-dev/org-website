'use client';

/**
 * InstagramHighlightsManager — paste-URL add form + card list with
 * reorder / feature toggle / delete.
 */

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Star, StarOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { InstagramEditDialog } from './instagram-edit-dialog';
import {
  createInstagramHighlight,
  deleteInstagramHighlight,
  reorderInstagramHighlights,
  updateInstagramHighlight,
} from '@/lib/actions/instagram';
import type { InstagramHighlightRow } from '@/types/database';

export interface InstagramHighlightsManagerProps {
  highlights: InstagramHighlightRow[];
}

export function InstagramHighlightsManager({
  highlights,
}: InstagramHighlightsManagerProps) {
  const router = useRouter();
  const [items, setItems] = React.useState(highlights);
  const [newUrl, setNewUrl] = React.useState('');
  const [adding, setAdding] = React.useState(false);
  const [editing, setEditing] = React.useState<InstagramHighlightRow | null>(null);

  React.useEffect(() => {
    setItems(highlights);
  }, [highlights]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    setAdding(true);
    try {
      const result = await createInstagramHighlight(newUrl.trim());
      if (!result.ok) {
        toast.error(result.error ?? 'Could not save highlight');
        return;
      }
      toast.success('Highlight saved');
      setNewUrl('');
      router.refresh();
    } finally {
      setAdding(false);
    }
  };

  const swap = async (index: number, direction: 'up' | 'down') => {
    const j = direction === 'up' ? index - 1 : index + 1;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    const a = next[index];
    const b = next[j];
    if (!a || !b) return;
    next[index] = b;
    next[j] = a;
    setItems(next);
    const result = await reorderInstagramHighlights(next.map((h) => h.id));
    if (!result.ok) {
      toast.error(result.error ?? 'Reorder failed');
      setItems(items);
      return;
    }
    router.refresh();
  };

  const toggleFeatured = async (row: InstagramHighlightRow) => {
    const result = await updateInstagramHighlight(row.id, {
      is_featured: !row.is_featured,
    });
    if (!result.ok) {
      toast.error(result.error ?? 'Toggle failed');
      return;
    }
    toast.success(!row.is_featured ? 'Featured' : 'Unfeatured');
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    const result = await deleteInstagramHighlight(id);
    if (!result.ok) {
      toast.error(result.error ?? 'Delete failed');
      return;
    }
    toast.success('Highlight deleted');
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Add a highlight</CardTitle>
          <CardDescription>
            Paste a public Instagram post URL. If oEmbed is configured, the
            thumbnail and caption populate automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://www.instagram.com/p/XXXX/"
              aria-label="Instagram post URL"
              type="url"
            />
            <Button type="submit" disabled={adding || newUrl.trim().length === 0}>
              {adding ? 'Saving…' : 'Add highlight'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-sm text-cream/55">
            No highlights yet. Paste a post URL above to add the first one.
          </CardContent>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((h, i) => (
            <li key={h.id}>
              <Card className="h-full">
                <div className="relative aspect-square overflow-hidden rounded-t-md bg-ink-100">
                  {h.thumbnail_url ? (
                    <Image
                      src={h.thumbnail_url}
                      alt={h.caption ?? 'Instagram post'}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-cream/55">
                      No thumbnail
                    </div>
                  )}
                </div>
                <CardContent className="flex flex-col gap-3 p-4">
                  <p className="line-clamp-3 text-xs text-cream">
                    {h.caption ?? <span className="text-cream/55">(no caption)</span>}
                  </p>
                  <div className="flex items-center justify-between text-xs text-cream/55">
                    <span>{h.author ?? '—'}</span>
                    {h.is_featured ? <Badge variant="default">Featured</Badge> : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Move up"
                      disabled={i === 0}
                      onClick={() => swap(i, 'up')}
                    >
                      <ArrowUp className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Move down"
                      disabled={i === items.length - 1}
                      onClick={() => swap(i, 'down')}
                    >
                      <ArrowDown className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={h.is_featured ? 'Unfeature' : 'Feature'}
                      onClick={() => toggleFeatured(h)}
                    >
                      {h.is_featured ? (
                        <Star className="size-4 fill-current text-burgundy" aria-hidden="true" />
                      ) : (
                        <StarOff className="size-4" aria-hidden="true" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditing(h)}>
                      <Pencil className="size-4" aria-hidden="true" />
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <a href={h.post_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="size-4" aria-hidden="true" />
                        <span className="sr-only">Open on Instagram</span>
                      </a>
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-error hover:bg-error/10"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </Button>
                      }
                      title="Delete this highlight?"
                      description="This only removes it from the BACDA site — the Instagram post is untouched."
                      confirmLabel="Delete"
                      onConfirm={() => handleDelete(h.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <InstagramEditDialog
        row={editing}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}
