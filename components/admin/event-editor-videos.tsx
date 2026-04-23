'use client';

/**
 * VideosSection — paste a YouTube URL, parse to 11-char id, attach to event.
 * Uses `parseYouTubeId` from lib/integrations/youtube (no API key required).
 */

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { addEventVideo, removeEventVideo } from '@/lib/actions/events';
import {
  getVideoThumbnail,
  parseYouTubeId,
} from '@/lib/integrations/youtube';
import type { EventVideoRow } from '@/types/database';

export interface VideosSectionProps {
  eventId: string;
  videos: EventVideoRow[];
}

export function VideosSection({ eventId, videos }: VideosSectionProps) {
  const router = useRouter();
  const [url, setUrl] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [adding, setAdding] = React.useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseYouTubeId(url);
    if (!id) {
      toast.error('Could not parse YouTube URL');
      return;
    }
    setAdding(true);
    try {
      const result = await addEventVideo(
        eventId,
        id,
        title.trim() || undefined
      );
      if (!result.ok) {
        toast.error(result.error ?? 'Could not add video');
        return;
      }
      toast.success('Video added');
      setUrl('');
      setTitle('');
      router.refresh();
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (videoId: string) => {
    const result = await removeEventVideo(videoId);
    if (!result.ok) {
      toast.error(result.error ?? 'Remove failed');
      return;
    }
    toast.success('Video removed');
    router.refresh();
  };

  return (
    <section className="flex flex-col gap-4 rounded-md border border-border bg-white p-6">
      <h2 className="font-display text-xl font-medium">YouTube videos</h2>

      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-3 rounded-md border border-dashed border-border p-4"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="video_url">YouTube URL or ID</Label>
            <Input
              id="video_url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtu.be/KWzwSzxBUis"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="video_title">Title (optional)</Label>
            <Input
              id="video_title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Performance highlight"
            />
          </div>
        </div>
        <div>
          <Button type="submit" size="sm" disabled={adding}>
            {adding ? 'Adding…' : 'Add video'}
          </Button>
        </div>
      </form>

      {videos.length === 0 ? (
        <p className="text-sm text-muted">No videos attached yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => {
            const thumb = getVideoThumbnail(video.youtube_id, 'hq');
            return (
              <li
                key={video.id}
                className="overflow-hidden rounded-md border border-border bg-cream"
              >
                <div className="relative aspect-video">
                  <Image
                    src={thumb}
                    alt={video.title ?? 'Event video thumbnail'}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex items-start justify-between gap-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {video.title ?? video.youtube_id}
                    </p>
                    <p className="truncate font-mono text-xs text-muted">
                      {video.youtube_id}
                    </p>
                  </div>
                  <ConfirmDialog
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-error hover:bg-error/10"
                        aria-label={`Remove ${video.title ?? video.youtube_id}`}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    }
                    title="Remove this video?"
                    description="Detaches the video from this event. The YouTube video itself is untouched."
                    confirmLabel="Remove"
                    onConfirm={() => handleRemove(video.id)}
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
