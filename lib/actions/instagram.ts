'use server';

/**
 * Server actions for the `instagram_highlights` resource.
 *
 * `createInstagramHighlight` attempts an oEmbed fetch via
 * `lib/integrations/instagram.ts` if `FB_OEMBED_TOKEN` is set. Without the
 * token, the row saves with null thumbnail/author/caption — admin fills
 * these in via a follow-up update.
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import {
  InstagramHighlightInputSchema,
  InstagramHighlightUpdateSchema,
} from '@/lib/validators/instagram';
import { adminDb } from './db';
import { actionError, validationError, type ActionResult } from './types';

function revalidateInstagramSurfaces(): void {
  revalidatePath('/');
  revalidatePath('/gallery');
  revalidateTag('instagram');
  revalidateTag('home');
}

/**
 * Best-effort Instagram oEmbed fetch.
 *
 * Dynamic-imports `@/lib/integrations/instagram` so this action compiles
 * cleanly even while the integrator agent is still landing that module.
 * Falls back to a bare row (no thumbnail / author / caption) when oEmbed is
 * unavailable.
 */
async function fetchOEmbedSafe(postUrl: string): Promise<{
  caption: string | null;
  thumbnail_url: string | null;
  author: string | null;
}> {
  if (!process.env.FB_OEMBED_TOKEN) {
    return { caption: null, thumbnail_url: null, author: null };
  }
  try {
    const mod = (await import('@/lib/integrations/instagram').catch(
      () => null,
    )) as
      | {
          getInstagramOEmbed?: (url: string) => Promise<{
            caption?: string | null;
            thumbnail_url?: string | null;
            author_name?: string | null;
          } | null>;
        }
      | null;
    if (!mod?.getInstagramOEmbed) {
      return { caption: null, thumbnail_url: null, author: null };
    }
    const result = await mod.getInstagramOEmbed(postUrl);
    if (!result) {
      return { caption: null, thumbnail_url: null, author: null };
    }
    return {
      caption: result.caption ?? null,
      thumbnail_url: result.thumbnail_url ?? null,
      author: result.author_name ?? null,
    };
  } catch {
    return { caption: null, thumbnail_url: null, author: null };
  }
}

export async function createInstagramHighlight(
  postUrl: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAuth();
    if (typeof postUrl !== 'string') {
      return { ok: false, error: 'post_url is required' };
    }

    // Validate the minimal input — only post_url is required from the caller.
    const parsed = InstagramHighlightInputSchema.pick({ post_url: true }).safeParse({
      post_url: postUrl,
    });
    if (!parsed.success) return validationError(parsed.error);

    const oembed = await fetchOEmbedSafe(parsed.data.post_url);

    const supabase = adminDb();
    const { data, error } = await supabase
      .from('instagram_highlights')
      .insert({
        post_url: parsed.data.post_url,
        caption: oembed.caption,
        thumbnail_url: oembed.thumbnail_url,
        author: oembed.author,
      })
      .select('id')
      .single();
    if (error) return { ok: false, error: error.message };

    revalidateInstagramSurfaces();
    return { ok: true, data: { id: (data as { id: string }).id } };
  } catch (err) {
    return actionError(err);
  }
}

export async function updateInstagramHighlight(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAuth();
    if (typeof id !== 'string' || id.length === 0) {
      return { ok: false, error: 'Highlight id is required' };
    }
    const parsed = InstagramHighlightUpdateSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    const update: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(parsed.data)) {
      if (v !== undefined) update[k] = v;
    }

    const supabase = adminDb();
    const { error } = await supabase
      .from('instagram_highlights')
      .update(update)
      .eq('id', id);
    if (error) return { ok: false, error: error.message };

    revalidateInstagramSurfaces();
    return { ok: true, data: { id } };
  } catch (err) {
    return actionError(err);
  }
}

export async function deleteInstagramHighlight(
  id: string,
): Promise<ActionResult> {
  try {
    await requireAuth();
    if (typeof id !== 'string' || id.length === 0) {
      return { ok: false, error: 'Highlight id is required' };
    }

    const supabase = adminDb();
    const { error } = await supabase
      .from('instagram_highlights')
      .delete()
      .eq('id', id);
    if (error) return { ok: false, error: error.message };

    revalidateInstagramSurfaces();
    return { ok: true, data: undefined };
  } catch (err) {
    return actionError(err);
  }
}

export async function reorderInstagramHighlights(
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
      const hid = orderedIds[i];
      if (!hid) continue;
      const { error } = await supabase
        .from('instagram_highlights')
        .update({ sort_order: i })
        .eq('id', hid);
      if (!error) updated += 1;
    }

    revalidateInstagramSurfaces();
    return { ok: true, data: { updated } };
  } catch (err) {
    return actionError(err);
  }
}
