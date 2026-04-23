'use server';

/**
 * Server actions for the `events` resource + its child tables
 * (`event_photos`, `event_videos`).
 *
 * Every action:
 *  1. `requireAuth()` — Supabase-authenticated caller required.
 *  2. Zod-validate input — bounded strings + arrays.
 *  3. Service-role Supabase write (RLS bypass — we already authenticated).
 *  4. Revalidate the public paths + tags impacted.
 *
 * Returns `ActionResult<T>` uniformly so the admin UI renders errors
 * consistently. Never throws to the caller.
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import {
  EventInputSchema,
  EventUpdateSchema,
} from '@/lib/validators/events';
import { adminDb } from './db';
import { actionError, validationError, type ActionResult } from './types';

const POSTERS_BUCKET = 'posters';
const GALLERY_BUCKET = 'gallery';

function revalidateEventSurfaces(slug?: string): void {
  revalidatePath('/');
  revalidatePath('/events');
  if (slug) revalidatePath(`/events/${slug}`);
  revalidateTag('events');
  revalidateTag('event-media');
  revalidateTag('home');
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const supabase = adminDb();
  let candidate = base;
  let suffix = 2;
  // Loop until a slug is free. Bounded to 50 attempts to avoid runaway.
  for (let i = 0; i < 50; i += 1) {
    const { data, error } = await supabase
      .from('events')
      .select('id,slug')
      .eq('slug', candidate)
      .maybeSingle();
    if (error) {
      // On query error, bail with best-effort candidate — DB unique constraint
      // will still protect us.
      return candidate;
    }
    const row = data as { id: string; slug: string } | null;
    if (!row || row.id === excludeId) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

// ─────────────────────────────────────────────────────────────────────────
// CRUD
// ─────────────────────────────────────────────────────────────────────────

export async function createEvent(
  input: unknown,
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    await requireAuth();
    const parsed = EventInputSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    const base = slugify(parsed.data.title);
    if (!base) {
      return { ok: false, error: 'Title is required to generate a slug' };
    }
    const slug = await uniqueSlug(base);

    const supabase = adminDb();
    const { data, error } = await supabase
      .from('events')
      .insert({
        slug,
        title: parsed.data.title,
        subtitle: parsed.data.subtitle ?? null,
        description: parsed.data.description ?? null,
        event_date: parsed.data.event_date,
        end_date: parsed.data.end_date ?? null,
        venue_name: parsed.data.venue_name ?? null,
        venue_address: parsed.data.venue_address ?? null,
        venue_map_url: parsed.data.venue_map_url ?? null,
        poster_url: parsed.data.poster_url ?? null,
        youtube_id: parsed.data.youtube_id ?? null,
        ticket_url: parsed.data.ticket_url ?? null,
        ticket_cta: parsed.data.ticket_cta,
        status: parsed.data.status,
        is_featured: parsed.data.is_featured,
        collaborators: parsed.data.collaborators,
      })
      .select('id, slug')
      .single();
    if (error) return { ok: false, error: error.message };

    const row = data as { id: string; slug: string };
    revalidateEventSurfaces(row.slug);
    return { ok: true, data: { id: row.id, slug: row.slug } };
  } catch (err) {
    return actionError(err);
  }
}

export async function updateEvent(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    await requireAuth();
    if (typeof id !== 'string' || id.length === 0) {
      return { ok: false, error: 'Event id is required' };
    }
    const parsed = EventUpdateSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    const supabase = adminDb();

    // Compute slug update if title changed.
    const update: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(parsed.data)) {
      if (v !== undefined) update[k] = v;
    }

    if (typeof parsed.data.title === 'string') {
      const base = slugify(parsed.data.title);
      if (base) {
        update.slug = await uniqueSlug(base, id);
      }
    }

    const { data, error } = await supabase
      .from('events')
      .update(update)
      .eq('id', id)
      .select('id, slug')
      .single();
    if (error) return { ok: false, error: error.message };

    const row = data as { id: string; slug: string };
    revalidateEventSurfaces(row.slug);
    return { ok: true, data: { id: row.id, slug: row.slug } };
  } catch (err) {
    return actionError(err);
  }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    if (typeof id !== 'string' || id.length === 0) {
      return { ok: false, error: 'Event id is required' };
    }

    const supabase = adminDb();
    // Fetch slug so we can best-effort clean up storage.
    const { data: existing } = await supabase
      .from('events')
      .select('slug')
      .eq('id', id)
      .maybeSingle();
    const slug = (existing as { slug: string } | null)?.slug;

    // Child rows (event_photos, event_videos) will cascade if FK was
    // declared `on delete cascade`; otherwise explicit cleanup is harmless
    // because the admin deletes child rows first via their own screens.
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };

    // Best-effort storage cleanup — never fail the delete on storage error.
    if (slug) {
      try {
        const { data: posterFiles } = await supabase.storage
          .from(POSTERS_BUCKET)
          .list(slug);
        if (posterFiles && posterFiles.length > 0) {
          await supabase.storage
            .from(POSTERS_BUCKET)
            .remove(posterFiles.map((f) => `${slug}/${f.name}`));
        }
      } catch {
        // swallow — storage cleanup is best-effort.
      }
      try {
        const { data: galleryFiles } = await supabase.storage
          .from(GALLERY_BUCKET)
          .list(`events/${slug}`);
        if (galleryFiles && galleryFiles.length > 0) {
          await supabase.storage
            .from(GALLERY_BUCKET)
            .remove(galleryFiles.map((f) => `events/${slug}/${f.name}`));
        }
      } catch {
        // swallow
      }
    }

    revalidateEventSurfaces(slug);
    return { ok: true, data: undefined };
  } catch (err) {
    return actionError(err);
  }
}

export async function toggleFeaturedEvent(
  id: string,
): Promise<ActionResult<{ id: string; is_featured: boolean }>> {
  try {
    await requireAuth();
    if (typeof id !== 'string' || id.length === 0) {
      return { ok: false, error: 'Event id is required' };
    }

    const supabase = adminDb();
    const { data: current, error: readErr } = await supabase
      .from('events')
      .select('id, slug, is_featured')
      .eq('id', id)
      .maybeSingle();
    if (readErr) return { ok: false, error: readErr.message };
    if (!current) return { ok: false, error: 'Event not found' };

    const currentRow = current as { id: string; slug: string; is_featured: boolean };
    const next = !currentRow.is_featured;
    const { error } = await supabase
      .from('events')
      .update({ is_featured: next })
      .eq('id', id);
    if (error) return { ok: false, error: error.message };

    revalidateEventSurfaces(currentRow.slug);
    return { ok: true, data: { id, is_featured: next } };
  } catch (err) {
    return actionError(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Storage: poster + event photos
// ─────────────────────────────────────────────────────────────────────────

function extFromFile(file: File): string {
  const name = file.name ?? '';
  const dot = name.lastIndexOf('.');
  if (dot === -1) return 'jpg';
  const ext = name.slice(dot + 1).toLowerCase();
  return /^[a-z0-9]{1,5}$/u.test(ext) ? ext : 'jpg';
}

async function lookupEventSlug(id: string): Promise<string | null> {
  const supabase = adminDb();
  const { data, error } = await supabase
    .from('events')
    .select('slug')
    .eq('id', id)
    .maybeSingle();
  if (error) return null;
  return (data as { slug: string } | null)?.slug ?? null;
}

export async function uploadEventPoster(
  eventId: string,
  file: File,
): Promise<ActionResult<{ poster_url: string }>> {
  try {
    await requireAuth();
    if (typeof eventId !== 'string' || eventId.length === 0) {
      return { ok: false, error: 'Event id is required' };
    }
    if (!(file instanceof File)) {
      return { ok: false, error: 'File is required' };
    }
    const slug = await lookupEventSlug(eventId);
    if (!slug) return { ok: false, error: 'Event not found' };

    const ext = extFromFile(file);
    const path = `${slug}/poster.${ext}`;
    const supabase = adminDb();

    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await supabase.storage
      .from(POSTERS_BUCKET)
      .upload(path, bytes, {
        upsert: true,
        contentType: file.type || `image/${ext}`,
      });
    if (upErr) return { ok: false, error: upErr.message };

    const publicUrl = supabase.storage.from(POSTERS_BUCKET).getPublicUrl(path)
      .data.publicUrl;

    const { error: updErr } = await supabase
      .from('events')
      .update({ poster_url: publicUrl })
      .eq('id', eventId);
    if (updErr) return { ok: false, error: updErr.message };

    revalidateEventSurfaces(slug);
    return { ok: true, data: { poster_url: publicUrl } };
  } catch (err) {
    return actionError(err);
  }
}

export async function uploadEventPhotos(
  eventId: string,
  files: File[],
): Promise<ActionResult<{ inserted: number }>> {
  try {
    await requireAuth();
    if (typeof eventId !== 'string' || eventId.length === 0) {
      return { ok: false, error: 'Event id is required' };
    }
    if (!Array.isArray(files) || files.length === 0) {
      return { ok: false, error: 'At least one file is required' };
    }
    const slug = await lookupEventSlug(eventId);
    if (!slug) return { ok: false, error: 'Event not found' };

    const supabase = adminDb();

    // Find the current max sort_order so new photos append.
    const { data: existing } = await supabase
      .from('event_photos')
      .select('sort_order')
      .eq('event_id', eventId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();
    let nextOrder =
      ((existing as { sort_order: number } | null)?.sort_order ?? -1) + 1;

    let inserted = 0;
    for (const file of files) {
      if (!(file instanceof File)) continue;
      const ext = extFromFile(file);
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const storagePath = `events/${slug}/${filename}`;
      const bytes = Buffer.from(await file.arrayBuffer());

      const { error: upErr } = await supabase.storage
        .from(GALLERY_BUCKET)
        .upload(storagePath, bytes, {
          upsert: false,
          contentType: file.type || `image/${ext}`,
        });
      if (upErr) continue; // skip a failed one but keep going

      const { error: insErr } = await supabase.from('event_photos').insert({
        event_id: eventId,
        storage_path: storagePath,
        sort_order: nextOrder,
      });
      if (insErr) {
        // Best-effort: remove the orphan storage file.
        try {
          await supabase.storage.from(GALLERY_BUCKET).remove([storagePath]);
        } catch {
          // swallow
        }
        continue;
      }
      nextOrder += 1;
      inserted += 1;
    }

    revalidateEventSurfaces(slug);
    return { ok: true, data: { inserted } };
  } catch (err) {
    return actionError(err);
  }
}

export async function reorderEventPhotos(
  eventId: string,
  orderedIds: string[],
): Promise<ActionResult<{ updated: number }>> {
  try {
    await requireAuth();
    if (typeof eventId !== 'string' || eventId.length === 0) {
      return { ok: false, error: 'Event id is required' };
    }
    if (!Array.isArray(orderedIds)) {
      return { ok: false, error: 'orderedIds must be an array' };
    }
    if (orderedIds.some((x) => typeof x !== 'string' || x.length === 0)) {
      return { ok: false, error: 'orderedIds must contain non-empty strings' };
    }

    const supabase = adminDb();
    let updated = 0;
    for (let i = 0; i < orderedIds.length; i += 1) {
      const pid = orderedIds[i];
      if (!pid) continue;
      const { error } = await supabase
        .from('event_photos')
        .update({ sort_order: i })
        .eq('id', pid)
        .eq('event_id', eventId);
      if (!error) updated += 1;
    }

    const slug = await lookupEventSlug(eventId);
    revalidateEventSurfaces(slug ?? undefined);
    return { ok: true, data: { updated } };
  } catch (err) {
    return actionError(err);
  }
}

export async function deleteEventPhoto(photoId: string): Promise<ActionResult> {
  try {
    await requireAuth();
    if (typeof photoId !== 'string' || photoId.length === 0) {
      return { ok: false, error: 'Photo id is required' };
    }

    const supabase = adminDb();
    const { data: existing, error: readErr } = await supabase
      .from('event_photos')
      .select('id, storage_path, event_id')
      .eq('id', photoId)
      .maybeSingle();
    if (readErr) return { ok: false, error: readErr.message };
    if (!existing) return { ok: false, error: 'Photo not found' };

    const row = existing as { id: string; storage_path: string; event_id: string };
    const { error: delErr } = await supabase
      .from('event_photos')
      .delete()
      .eq('id', photoId);
    if (delErr) return { ok: false, error: delErr.message };

    try {
      await supabase.storage.from(GALLERY_BUCKET).remove([row.storage_path]);
    } catch {
      // swallow — row already deleted, storage cleanup best-effort.
    }

    const slug = await lookupEventSlug(row.event_id);
    revalidateEventSurfaces(slug ?? undefined);
    return { ok: true, data: undefined };
  } catch (err) {
    return actionError(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// event_videos (admin-curated YouTube attachments)
// ─────────────────────────────────────────────────────────────────────────

export async function addEventVideo(
  eventId: string,
  youtubeId: string,
  title?: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAuth();
    if (typeof eventId !== 'string' || eventId.length === 0) {
      return { ok: false, error: 'Event id is required' };
    }
    if (!/^[A-Za-z0-9_-]{11}$/u.test(youtubeId)) {
      return { ok: false, error: 'Invalid YouTube id' };
    }
    if (title !== undefined && typeof title !== 'string') {
      return { ok: false, error: 'Title must be a string' };
    }
    if (typeof title === 'string' && title.length > 300) {
      return { ok: false, error: 'Title must be at most 300 characters' };
    }

    const supabase = adminDb();
    // Append to the end of the current ordering.
    const { data: existing } = await supabase
      .from('event_videos')
      .select('sort_order')
      .eq('event_id', eventId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrder =
      ((existing as { sort_order: number } | null)?.sort_order ?? -1) + 1;

    const { data, error } = await supabase
      .from('event_videos')
      .insert({
        event_id: eventId,
        youtube_id: youtubeId,
        title: title ?? null,
        sort_order: nextOrder,
      })
      .select('id')
      .single();
    if (error) return { ok: false, error: error.message };

    const slug = await lookupEventSlug(eventId);
    revalidateEventSurfaces(slug ?? undefined);
    return { ok: true, data: { id: (data as { id: string }).id } };
  } catch (err) {
    return actionError(err);
  }
}

export async function removeEventVideo(videoId: string): Promise<ActionResult> {
  try {
    await requireAuth();
    if (typeof videoId !== 'string' || videoId.length === 0) {
      return { ok: false, error: 'Video id is required' };
    }

    const supabase = adminDb();
    const { data: existing } = await supabase
      .from('event_videos')
      .select('event_id')
      .eq('id', videoId)
      .maybeSingle();
    const eventId = (existing as { event_id: string | null } | null)?.event_id;

    const { error } = await supabase
      .from('event_videos')
      .delete()
      .eq('id', videoId);
    if (error) return { ok: false, error: error.message };

    const slug = eventId ? await lookupEventSlug(eventId) : null;
    revalidateEventSurfaces(slug ?? undefined);
    return { ok: true, data: undefined };
  } catch (err) {
    return actionError(err);
  }
}
