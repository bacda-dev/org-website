'use client';

/**
 * InstagramEditDialog — edit caption / thumbnail / author for an existing
 * highlight. Used by InstagramHighlightsManager.
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateInstagramHighlight } from '@/lib/actions/instagram';
import type { InstagramHighlightRow } from '@/types/database';

export interface InstagramEditDialogProps {
  row: InstagramHighlightRow | null;
  onClose: () => void;
}

export function InstagramEditDialog({
  row,
  onClose,
}: InstagramEditDialogProps) {
  const router = useRouter();
  const [caption, setCaption] = React.useState('');
  const [thumb, setThumb] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => {
    setCaption(row?.caption ?? '');
    setThumb(row?.thumbnail_url ?? '');
    setAuthor(row?.author ?? '');
  }, [row]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!row) return;
    setPending(true);
    try {
      const result = await updateInstagramHighlight(row.id, {
        caption: caption || null,
        thumbnail_url: thumb || null,
        author: author || null,
      });
      if (!result.ok) {
        toast.error(result.error ?? 'Save failed');
        return;
      }
      toast.success('Highlight updated');
      onClose();
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={row !== null} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit highlight</DialogTitle>
          <DialogDescription>Adjust caption, thumbnail, or author.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="ig_caption">Caption</Label>
            <Textarea
              id="ig_caption"
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ig_thumb">Thumbnail URL</Label>
            <Input
              id="ig_thumb"
              type="url"
              value={thumb}
              onChange={(e) => setThumb(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ig_author">Author</Label>
            <Input
              id="ig_author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
