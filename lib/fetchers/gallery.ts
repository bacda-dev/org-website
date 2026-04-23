/**
 * Gallery fetchers (standalone videos + event-scoped photos/videos).
 * Cached 60s, tags 'gallery', 'event-media'.
 */

import { unstable_cache } from 'next/cache';
import { createAnonServerClient } from '@/lib/supabase/server';
import type {
  GalleryVideoRow,
  EventPhotoRow,
  EventVideoRow,
} from '@/types/database';

const REVALIDATE_SECONDS = 60;

async function fetchGalleryVideos(): Promise<GalleryVideoRow[]> {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from('gallery_videos')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return (data ?? []) as GalleryVideoRow[];
}

async function fetchEventPhotos(eventId: string): Promise<EventPhotoRow[]> {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from('event_photos')
    .select('*')
    .eq('event_id', eventId)
    .order('sort_order', { ascending: true });
  if (error) return [];
  return (data ?? []) as EventPhotoRow[];
}

async function fetchEventVideos(eventId: string): Promise<EventVideoRow[]> {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from('event_videos')
    .select('*')
    .eq('event_id', eventId)
    .order('sort_order', { ascending: true });
  if (error) return [];
  return (data ?? []) as EventVideoRow[];
}

export const getGalleryVideos = unstable_cache(
  fetchGalleryVideos,
  ['gallery:videos'],
  { revalidate: REVALIDATE_SECONDS, tags: ['gallery'] },
);

export const getEventPhotos = (eventId: string): Promise<EventPhotoRow[]> =>
  unstable_cache(
    () => fetchEventPhotos(eventId),
    ['event:photos', eventId],
    { revalidate: REVALIDATE_SECONDS, tags: ['event-media'] },
  )();

export const getEventVideos = (eventId: string): Promise<EventVideoRow[]> =>
  unstable_cache(
    () => fetchEventVideos(eventId),
    ['event:videos', eventId],
    { revalidate: REVALIDATE_SECONDS, tags: ['event-media'] },
  )();
