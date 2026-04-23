'use client';

/**
 * PhotosSection — drag-drop photo upload + reorder + delete.
 * Renders a grid of existing photos with up/down arrow reorder and a delete
 * button. Multi-file uploads append to the end of the list.
 */

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { ImageUploader } from '@/components/admin/image-uploader';
import {
  deleteEventPhoto,
  reorderEventPhotos,
  uploadEventPhotos,
} from '@/lib/actions/events';
import type { EventPhotoRow } from '@/types/database';

export interface PhotosSectionProps {
  eventId: string;
  photos: EventPhotoRow[];
  storageUrlFor: (path: string) => string;
}

export function PhotosSection({
  eventId,
  photos,
  storageUrlFor,
}: PhotosSectionProps) {
  const router = useRouter();
  // Local copy of photos for optimistic reorder; resets when server photos change.
  const [ordered, setOrdered] = React.useState<EventPhotoRow[]>(photos);
  const [pending, setPending] = React.useState<string | null>(null);

  React.useEffect(() => {
    setOrdered(photos);
  }, [photos]);

  const handleUpload = async (files: File[]) => {
    const result = await uploadEventPhotos(eventId, files);
    if (!result.ok) {
      toast.error(result.error ?? 'Upload failed');
      return;
    }
    if (result.data.inserted === 0) {
      toast.error('No photos were uploaded');
      return;
    }
    toast.success(
      `Uploaded ${result.data.inserted} photo${result.data.inserted === 1 ? '' : 's'}`
    );
    router.refresh();
  };

  const swap = async (index: number, direction: 'up' | 'down') => {
    const j = direction === 'up' ? index - 1 : index + 1;
    if (j < 0 || j >= ordered.length) return;
    const next = ordered.slice();
    const a = next[index];
    const b = next[j];
    if (!a || !b) return;
    next[index] = b;
    next[j] = a;
    setOrdered(next);
    const result = await reorderEventPhotos(
      eventId,
      next.map((p) => p.id)
    );
    if (!result.ok) {
      toast.error(result.error ?? 'Reorder failed');
      setOrdered(ordered);
      return;
    }
    router.refresh();
  };

  const handleDelete = async (photoId: string) => {
    setPending(photoId);
    try {
      const result = await deleteEventPhoto(photoId);
      if (!result.ok) {
        toast.error(result.error ?? 'Delete failed');
        return;
      }
      toast.success('Photo deleted');
      setOrdered((cur) => cur.filter((p) => p.id !== photoId));
      router.refresh();
    } finally {
      setPending(null);
    }
  };

  return (
    <section className="flex flex-col gap-4 rounded-md border border-border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-medium">Photo gallery</h2>
        <span className="text-xs text-muted">
          {ordered.length} photo{ordered.length === 1 ? '' : 's'}
        </span>
      </div>

      <ImageUploader
        onUpload={handleUpload}
        multiple
        accept="image/*"
        maxSizeMB={10}
        label="Drop photos here, or click to browse (multiple allowed)"
      />

      {ordered.length === 0 ? (
        <p className="text-sm text-muted">No photos yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ordered.map((photo, i) => {
            const src = storageUrlFor(photo.storage_path);
            return (
              <li
                key={photo.id}
                className="group relative overflow-hidden rounded-md border border-border bg-cream"
              >
                <div className="relative aspect-square">
                  {src ? (
                    <Image
                      src={src}
                      alt={photo.caption ?? `Photo ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted">
                      No preview
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-1 p-2">
                  <div className="inline-flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Move up"
                      disabled={i === 0 || pending !== null}
                      onClick={() => swap(i, 'up')}
                    >
                      <ArrowUp className="size-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Move down"
                      disabled={i === ordered.length - 1 || pending !== null}
                      onClick={() => swap(i, 'down')}
                    >
                      <ArrowDown className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                  <ConfirmDialog
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-error hover:bg-error/10"
                        aria-label="Delete photo"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    }
                    title="Delete this photo?"
                    description="Removes the photo from storage and the event gallery."
                    confirmLabel="Delete"
                    onConfirm={() => handleDelete(photo.id)}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
