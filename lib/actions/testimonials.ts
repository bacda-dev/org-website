'use server';

/**
 * Server actions for the `testimonials` resource.
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import {
  TestimonialInputSchema,
  TestimonialUpdateSchema,
} from '@/lib/validators/testimonials';
import { adminDb } from './db';
import { actionError, validationError, type ActionResult } from './types';

function revalidateTestimonialSurfaces(): void {
  revalidatePath('/');
  revalidatePath('/testimonials');
  revalidateTag('testimonials');
  revalidateTag('home');
}

export async function createTestimonial(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAuth();
    const parsed = TestimonialInputSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    const supabase = adminDb();
    const { data, error } = await supabase
      .from('testimonials')
      .insert({
        quote: parsed.data.quote,
        author_name: parsed.data.author_name,
        author_title: parsed.data.author_title ?? null,
        author_photo_url: parsed.data.author_photo_url ?? null,
        is_featured: parsed.data.is_featured,
        sort_order: parsed.data.sort_order,
      })
      .select('id')
      .single();
    if (error) return { ok: false, error: error.message };

    revalidateTestimonialSurfaces();
    return { ok: true, data: { id: (data as { id: string }).id } };
  } catch (err) {
    return actionError(err);
  }
}

export async function updateTestimonial(
  id: string,
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAuth();
    if (typeof id !== 'string' || id.length === 0) {
      return { ok: false, error: 'Testimonial id is required' };
    }
    const parsed = TestimonialUpdateSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    const update: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(parsed.data)) {
      if (v !== undefined) update[k] = v;
    }

    const supabase = adminDb();
    const { error } = await supabase
      .from('testimonials')
      .update(update)
      .eq('id', id);
    if (error) return { ok: false, error: error.message };

    revalidateTestimonialSurfaces();
    return { ok: true, data: { id } };
  } catch (err) {
    return actionError(err);
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    await requireAuth();
    if (typeof id !== 'string' || id.length === 0) {
      return { ok: false, error: 'Testimonial id is required' };
    }

    const supabase = adminDb();
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };

    revalidateTestimonialSurfaces();
    return { ok: true, data: undefined };
  } catch (err) {
    return actionError(err);
  }
}

export async function reorderTestimonials(
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
        .from('testimonials')
        .update({ sort_order: i })
        .eq('id', tid);
      if (!error) updated += 1;
    }

    revalidateTestimonialSurfaces();
    return { ok: true, data: { updated } };
  } catch (err) {
    return actionError(err);
  }
}
