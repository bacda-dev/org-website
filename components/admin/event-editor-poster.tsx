'use client';

/**
 * PosterSection — upload-and-preview for event poster image.
 * Child of EventEditor, extracted to keep that file under 300 lines.
 */

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ImageUploader } from '@/components/admin/image-uploader';
import { uploadEventPoster } from '@/lib/actions/events';
import type { EventRow } from '@/types/database';

export interface PosterSectionProps {
  event: EventRow;
}

export function PosterSection({ event }: PosterSectionProps) {
  const router = useRouter();

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const result = await uploadEventPoster(event.id, file);
    if (!result.ok) {
      toast.error(result.error ?? 'Upload failed');
      return;
    }
    toast.success('Poster updated');
    router.refresh();
  };

  return (
    <section className="flex flex-col gap-4 rounded-md border border-border bg-white p-6">
      <h2 className="font-display text-xl font-medium">Poster</h2>

      {event.poster_url ? (
        <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-md border border-border bg-cream">
          <Image
            src={event.poster_url}
            alt={`${event.title} poster`}
            fill
            sizes="320px"
            className="object-cover"
          />
        </div>
      ) : (
        <p className="text-sm text-muted">No poster uploaded yet.</p>
      )}

      <ImageUploader
        onUpload={handleUpload}
        multiple={false}
        accept="image/*"
        maxSizeMB={10}
        label={event.poster_url ? 'Replace poster' : 'Upload poster'}
      />
    </section>
  );
}
