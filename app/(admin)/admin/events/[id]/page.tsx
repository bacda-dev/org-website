/**
 * Admin — Edit event page. Server component loads event + photos + videos.
 */

import { notFound } from 'next/navigation';
import { EventEditor } from '@/components/admin/event-editor';
import { createServerClient } from '@/lib/supabase/server';
import { storageUrl } from '@/lib/utils';
import type {
  EventPhotoRow,
  EventRow,
  EventVideoRow,
} from '@/types/database';

export const dynamic = 'force-dynamic';

async function loadEvent(id: string): Promise<{
  event: EventRow | null;
  photos: EventPhotoRow[];
  videos: EventVideoRow[];
}> {
  const supabase = createServerClient();
  const [eventRes, photosRes, videosRes] = await Promise.all([
    supabase.from('events').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('event_photos')
      .select('*')
      .eq('event_id', id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('event_videos')
      .select('*')
      .eq('event_id', id)
      .order('sort_order', { ascending: true }),
  ]);

  return {
    event: (eventRes.data as EventRow | null) ?? null,
    photos: ((photosRes.data as EventPhotoRow[] | null) ?? []),
    videos: ((videosRes.data as EventVideoRow[] | null) ?? []),
  };
}

export default async function AdminEventEditPage({
  params,
}: {
  params: { id: string };
}) {
  const { event, photos, videos } = await loadEvent(params.id);
  if (!event) notFound();

  return (
    <EventEditor
      event={event}
      photos={photos}
      videos={videos}
      storageUrlFor={(p) => storageUrl('gallery', p)}
    />
  );
}
