'use server';

/**
 * Server actions for the `team_members` resource.
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import {
  TeamMemberInputSchema,
  TeamMemberUpdateSchema,
} from '@/lib/validators/team';
import { adminDb } from './db';
import { actionError, validationError, type ActionResult } from './types';

const GALLERY_BUCKET = 'gallery';

function revalidateTeamSurfaces(): void {
  revalidatePath('/');
  revalidatePath('/about');
  revalidateTag('team');
  revalidateTag('home');
}

function extFromFile(file: File): string {
  const name = file.name ?? '';
  const dot = name.lastIndexOf('.');
  if (dot === -1) return 'jpg';
  const ext = name.slice(dot + 1).toLowerCase();
  return /^[a-z0-9]{1,5}$/u.test(ext) ? ext : 'jpg';
}

export async function createTeamMember(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAuth();
    const parsed = TeamMemberInputSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    const supabase = adminDb();
    const { data, error } = await supabase
      .from('team_members')
      .insert({
        name: parsed.data.name,
        role: parsed.data.role,
        bio: parsed.data.bio ?? null,
        photo_url: parsed.data.photo_url ?? null,
        credits: parsed.data.credits,
        is_lead: parsed.data.is_lead,
        sort_order: parsed.data.sort_order,
      })
      .select('id')
      .single();
    if (error) return { ok: false, error: error.message };

    revalidateTeamSurfaces();
    return { ok: true, data: { id: (data as { id: string }).id } };
  } catch (err) {
    return actionError(err);
  }
}

export async function updateTeamMember(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAuth();
    if (typeof id !== 'string' || id.length === 0) {
      return { ok: false, error: 'Team member id is required' };
    }
    const parsed = TeamMemberUpdateSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    const update: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(parsed.data)) {
      if (v !== undefined) update[k] = v;
    }

    const supabase = adminDb();
    const { error } = await supabase
      .from('team_members')
      .update(update)
      .eq('id', id);
    if (error) return { ok: false, error: error.message };

    revalidateTeamSurfaces();
    return { ok: true, data: { id } };
  } catch (err) {
    return actionError(err);
  }
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    if (typeof id !== 'string' || id.length === 0) {
      return { ok: false, error: 'Team member id is required' };
    }

    const supabase = adminDb();
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };

    revalidateTeamSurfaces();
    return { ok: true, data: undefined };
  } catch (err) {
    return actionError(err);
  }
}

export async function reorderTeamMembers(
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
      const tid = orderedIds[i];
      if (!tid) continue;
      const { error } = await supabase
        .from('team_members')
        .update({ sort_order: i })
        .eq('id', tid);
      if (!error) updated += 1;
    }

    revalidateTeamSurfaces();
    return { ok: true, data: { updated } };
  } catch (err) {
    return actionError(err);
  }
}

export async function uploadTeamPhoto(
  memberId: string,
  file: File,
): Promise<ActionResult<{ photo_url: string }>> {
  try {
    await requireAuth();
    if (typeof memberId !== 'string' || memberId.length === 0) {
      return { ok: false, error: 'Member id is required' };
    }
    if (!(file instanceof File)) {
      return { ok: false, error: 'File is required' };
    }

    const supabase = adminDb();
    const { data: existing } = await supabase
      .from('team_members')
      .select('name')
      .eq('id', memberId)
      .maybeSingle();
    const row = existing as { name: string } | null;
    if (!row) return { ok: false, error: 'Team member not found' };

    const nameSlug = slugify(row.name) || memberId;
    const ext = extFromFile(file);
    const path = `team/${nameSlug}-${Date.now()}.${ext}`;

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
      .from('team_members')
      .update({ photo_url: publicUrl })
      .eq('id', memberId);
    if (updErr) return { ok: false, error: updErr.message };

    revalidateTeamSurfaces();
    return { ok: true, data: { photo_url: publicUrl } };
  } catch (err) {
    return actionError(err);
  }
}
