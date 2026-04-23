'use client';

/**
 * GalleryVideosManager — table with add form + row actions.
 */

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Pencil, Plus, Trash2 } from 'lucide-react';
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
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import {
  DataTable,
  DataTableEmpty,
  DataTableHead,
} from '@/components/admin/data-table';
import {
  createGalleryVideo,
  deleteGalleryVideo,
  updateGalleryVideo,
} from '@/lib/actions/gallery';
import {
  getVideoThumbnail,
  parseYouTubeId,
} from '@/lib/integrations/youtube';
import type { GalleryVideoRow } from '@/types/database';

interface FormState {
  url: string;
  title: string;
  description: string;
}

const EMPTY_FORM: FormState = { url: '', title: '', description: '' };

export interface GalleryVideosManagerProps {
  videos: GalleryVideoRow[];
}

export function GalleryVideosManager({ videos }: GalleryVideosManagerProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<GalleryVideoRow | null>(null);
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
  const [pending, setPending] = React.useState(false);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (video: GalleryVideoRow) => {
    setEditing(video);
    setForm({
      url: `https://youtu.be/${video.youtube_id}`,
      title: video.title ?? '',
      description: video.description ?? '',
    });
    setDialogOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseYouTubeId(form.url);
    if (!id) {
      toast.error('Could not parse YouTube URL');
      return;
    }
    setPending(true);
    try {
      const payload = {
        youtube_id: id,
        title: form.title.trim() || null,
        description: form.description.trim() || null,
        sort_order: editing?.sort_order ?? 0,
      };
      const result = editing
        ? await updateGalleryVideo(editing.id, payload)
        : await createGalleryVideo(payload);
      if (!result.ok) {
        toast.error(result.error ?? 'Save failed');
        return;
      }
      toast.success(editing ? 'Video updated' : 'Video added');
      setDialogOpen(false);
      setForm(EMPTY_FORM);
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteGalleryVideo(id);
    if (!result.ok) {
      toast.error(result.error ?? 'Delete failed');
      return;
    }
    toast.success('Video removed');
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          {videos.length} video{videos.length === 1 ? '' : 's'}
        </p>
        <Button onClick={openNew}>
          <Plus className="size-4" aria-hidden="true" />
          Add video
        </Button>
      </div>

      <DataTable caption="Gallery videos list">
        <DataTableHead
          columns={[
            { key: 'thumb', label: 'Thumb' },
            { key: 'title', label: 'Title' },
            { key: 'id', label: 'YouTube ID' },
            { key: 'actions', label: 'Actions', className: 'text-right' },
          ]}
        />
        <tbody>
          {videos.length === 0 ? (
            <DataTableEmpty colSpan={4} message="No videos yet." />
          ) : (
            videos.map((v) => (
              <tr key={v.id} className="border-b border-border">
                <td className="px-4 py-3">
                  <div className="relative h-10 w-16 bg-cream">
                    <Image
                      src={getVideoThumbnail(v.youtube_id, 'hq')}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-ink">
                  {v.title ?? <span className="text-muted">—</span>}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">
                  {v.youtube_id}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(v)}>
                      <Pencil className="size-4" aria-hidden="true" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-error hover:bg-error/10"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      }
                      title="Remove this video?"
                      description="Detaches it from the public gallery."
                      confirmLabel="Remove"
                      onConfirm={() => handleDelete(v.id)}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </DataTable>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit video' : 'Add video'}</DialogTitle>
            <DialogDescription>
              Paste a YouTube URL — we extract the video ID automatically.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="yt_url">YouTube URL *</Label>
              <Input
                id="yt_url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://youtu.be/KWzwSzxBUis"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="yt_title">Title</Label>
              <Input
                id="yt_title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="yt_desc">Description</Label>
              <Textarea
                id="yt_desc"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? 'Saving…' : editing ? 'Save' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
