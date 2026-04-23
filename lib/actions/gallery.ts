'use server';

/**
 * Server actions for `gallery_videos` (standalone YouTube highlights).
 *
 * Event-scoped photos and videos live in `lib/actions/events.ts` because
 * they're always mutated in the context of an event.
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import {
  GalleryVideoInputSchema,
  GalleryVideoUpdateSchema,
} from '@/lib/validators/gallery';
import { adminDb } from './db';
import { actionError, validationError, type ActionResult } from './types';

function revalidateGallerySurfaces(): void {
  revalidatePath('/');
  revalidatePath('/gallery');
  revalidateTag('gallery');
  revalidateTag('home');
}

export async function createGalleryVideo(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAuth();
    const parsed = GalleryVideoInputSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    const supabase = adminDb();
    const { data, error } = await supabase
      .from('gallery_videos')
      .insert({
        youtube_id: parsed.data.youtube_id,
        title: parsed.data.title ?? null,
        description: parsed.data.description ?? null,
        sort_order: parsed.data.sort_order,
      })
      .select('id')
      .single();
    if (error) return { ok: false, error: error.message };

    revalidateGallerySurfaces();
    return { ok: true, data: { id: (data as { id: string }).id } };
  } catch (err) {
    return actionError(err);
  }
}

export async function updateGalleryVideo(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAuth();
    if (typeof id !== 'string' || id.length === 0) {
      return { ok: false, error: 'Gallery video id is required' };
    }
    const parsed = GalleryVideoUpdateSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    const update: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(parsed.data)) {
      if (v !== undefined) update[k] = v;
    }

    const supabase = adminDb();
    const { error } = await supabase
      .from('gallery_videos')
      .update(update)
      .eq('id', id);
    if (error) return { ok: false, error: error.message };

    revalidateGallerySurfaces();
    return { ok: true, data: { id } };
  } catch (err) {
    return actionError(err);
  }
}

export async function deleteGalleryVideo(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    if (typeof id !== 'string' || id.length === 0) {
      return { ok: false, error: 'Gallery video id is required' };
    }

    const supabase = adminDb();
    const { error } = await supabase
      .from('gallery_videos')
      .delete()
      .eq('id', id);
    if (error) return { ok: false, error: error.message };

    revalidateGallerySurfaces();
    return { ok: true, data: undefined };
  } catch (err) {
    return actionError(err);
  }
}

export async function reorderGalleryVideos(
  orderedIds: string[],
): Promise<ActionResult<{ updated: number }>> {
  try {
    await requireAuth();
    if (!Array.isArray(orderedIds)) {
      return { ok: false, error: 'orderedIds must be an array' };
    }
    if (orderedIds.some((x) => typeof x !== 'string' || x.length === 0)) {
      return { ok: false, error: 'orderedIds must contain non-empty strings' };
    }

    const supabase = adminDb();
    let updated = 0;
    for (let i = 0; i < orderedIds.length; i += 1) {
      const gid = orderedIds[i];
      if (!gid) continue;
      const { error } = await supabase
        .from('gallery_videos')
        .update({ sort_order: i })
        .eq('id', gid);
      if (!error) updated += 1;
    }

    revalidateGallerySurfaces();
    return { ok: true, data: { updated } };
  } catch (err) {
    return actionError(err);
  }
}
