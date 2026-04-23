'use server';

/**
 * Server actions for the `sponsors` resource.
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import {
  SponsorInputSchema,
  SponsorUpdateSchema,
} from '@/lib/validators/sponsors';
import { adminDb } from './db';
import { actionError, validationError, type ActionResult } from './types';

const GALLERY_BUCKET = 'gallery';

function revalidateSponsorSurfaces(): void {
  revalidatePath('/');
  revalidateTag('sponsors');
  revalidateTag('home');
}

function extFromFile(file: File): string {
  const name = file.name ?? '';
  const dot = name.lastIndexOf('.');
  if (dot === -1) return 'png';
  const ext = name.slice(dot + 1).toLowerCase();
  return /^[a-z0-9]{1,5}$/u.test(ext) ? ext : 'png';
}

export async function createSponsor(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAuth();
    const parsed = SponsorInputSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    const supabase = adminDb();
    const { data, error } = await supabase
      .from('sponsors')
      .insert({
        name: parsed.data.name,
        logo_url: parsed.data.logo_url ?? null,
        website_url: parsed.data.website_url ?? null,
        sort_order: parsed.data.sort_order,
        is_active: parsed.data.is_active,
      })
      .select('id')
      .single();
    if (error) return { ok: false, error: error.message };

    revalidateSponsorSurfaces();
    return { ok: true, data: { id: (data as { id: string }).id } };
  } catch (err) {
    return actionError(err);
  }
}

export async function updateSponsor(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAuth();
    if (typeof id !== 'string' || id.length === 0) {
      return { ok: false, error: 'Sponsor id is required' };
    }
    const parsed = SponsorUpdateSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    const update: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(parsed.data)) {
      if (v !== undefined) update[k] = v;
    }

    const supabase = adminDb();
    const { error } = await supabase
      .from('sponsors')
      .update(update)
      .eq('id', id);
    if (error) return { ok: false, error: error.message };

    revalidateSponsorSurfaces();
    return { ok: true, data: { id } };
  } catch (err) {
    return actionError(err);
  }
}

export async function deleteSponsor(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    if (typeof id !== 'string' || id.length === 0) {
      return { ok: false, error: 'Sponsor id is required' };
    }

    const supabase = adminDb();
    const { error } = await supabase.from('sponsors').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };

    revalidateSponsorSurfaces();
    return { ok: true, data: undefined };
  } catch (err) {
    return actionError(err);
  }
}

export async function reorderSponsors(
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
      const sid = orderedIds[i];
      if (!sid) continue;
      const { error } = await supabase
        .from('sponsors')
        .update({ sort_order: i })
        .eq('id', sid);
      if (!error) updated += 1;
    }

    revalidateSponsorSurfaces();
    return { ok: true, data: { updated } };
  } catch (err) {
    return actionError(err);
  }
}

export async function toggleSponsorActive(
  id: string,
): Promise<ActionResult<{ id: string; is_active: boolean }>> {
  try {
    await requireAuth();
    if (typeof id !== 'string' || id.length === 0) {
      return { ok: false, error: 'Sponsor id is required' };
    }

    const supabase = adminDb();
    const { data: current, error: readErr } = await supabase
      .from('sponsors')
      .select('is_active')
      .eq('id', id)
      .maybeSingle();
    if (readErr) return { ok: false, error: readErr.message };
    if (!current) return { ok: false, error: 'Sponsor not found' };

    const next = !(current as { is_active: boolean }).is_active;
    const { error } = await supabase
      .from('sponsors')
      .update({ is_active: next })
      .eq('id', id);
    if (error) return { ok: false, error: error.message };

    revalidateSponsorSurfaces();
    return { ok: true, data: { id, is_active: next } };
  } catch (err) {
    return actionError(err);
  }
}

export async function uploadSponsorLogo(
  sponsorId: string,
  file: File,
): Promise<ActionResult<{ logo_url: string }>> {
  try {
    await requireAuth();
    if (typeof sponsorId !== 'string' || sponsorId.length === 0) {
      return { ok: false, error: 'Sponsor id is required' };
    }
    if (!(file instanceof File)) {
      return { ok: false, error: 'File is required' };
    }

    const supabase = adminDb();
    const { data: existing } = await supabase
      .from('sponsors')
      .select('name')
      .eq('id', sponsorId)
      .maybeSingle();
    const row = existing as { name: string } | null;
    if (!row) return { ok: false, error: 'Sponsor not found' };

    const nameSlug = slugify(row.name) || sponsorId;
    const ext = extFromFile(file);
    const path = `sponsors/${nameSlug}-${Date.now()}.${ext}`;

    const bytes = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await supabase.storage
      .from(GALLERY_BUCKET)
      .upload(path, bytes, {
        upsert: true,
        contentType: file.type || `image/${ext}`,
      });
    if (upErr) return { ok: false, error: upErr.message };

    const publicUrl = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path)
      .data.publicUrl;

    const { error: updErr } = await supabase
      .from('sponsors')
      .update({ logo_url: publicUrl })
      .eq('id', sponsorId);
    if (updErr) return { ok: false, error: updErr.message };

    revalidateSponsorSurfaces();
    return { ok: true, data: { logo_url: publicUrl } };
  } catch (err) {
    return actionError(err);
  }
}
