'use server';

/**
 * Server action for the singleton `home_content` row.
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { requireAuth } from '@/lib/auth';
import { HomeContentUpdateSchema } from '@/lib/validators/home';
import { adminDb } from './db';
import { actionError, validationError, type ActionResult } from './types';

export async function updateHomeContent(
  input: unknown,
): Promise<ActionResult<{ singleton_key: string }>> {
  try {
    await requireAuth();
    const parsed = HomeContentUpdateSchema.safeParse(input);
    if (!parsed.success) return validationError(parsed.error);

    const update: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(parsed.data)) {
      if (v !== undefined) update[k] = v;
    }

    if (Object.keys(update).length === 0) {
      return { ok: false, error: 'No fields provided' };
    }

    const supabase = adminDb();
    const { error } = await supabase
      .from('home_content')
      .update(update)
      .eq('singleton_key', 'home');
    if (error) return { ok: false, error: error.message };

    revalidatePath('/');
    revalidateTag('home');
    return { ok: true, data: { singleton_key: 'home' } };
  } catch (err) {
    return actionError(err);
  }
}
