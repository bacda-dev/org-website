/**
 * Zod schema for the singleton home_content row.
 */

import { z } from 'zod';

export const HomeContentInputSchema = z.object({
  hero_headline: z
    .string()
    .min(2, 'Hero headline must be at least 2 characters')
    .max(200, 'Hero headline must be at most 200 characters')
    .describe('Top-of-home display headline'),
  hero_subheadline: z
    .string()
    .max(500, 'Hero subheadline must be at most 500 characters')
    .nullish()
    .describe('Secondary line under the headline'),
  hero_image_url: z
    .string()
    .url('hero_image_url must be a valid URL')
    .max(1000, 'hero_image_url must be at most 1000 characters')
    .nullish()
    .describe('Supabase Storage public URL for the hero image'),
  hero_video_url: z
    .string()
    .url('hero_video_url must be a valid URL')
    .max(1000, 'hero_video_url must be at most 1000 characters')
    .nullish()
    .describe('Optional background video URL'),
  featured_event_id: z
    .string()
    .uuid('featured_event_id must be a UUID')
    .nullish()
    .describe('Featured event UUID (optional — overrides events.is_featured)'),
  mission_statement: z
    .string()
    .max(5000, 'Mission statement must be at most 5000 characters')
    .nullish()
    .describe('Markdown mission statement'),
  donate_url: z
    .string()
    .url('donate_url must be a valid URL')
    .max(1000, 'donate_url must be at most 1000 characters')
    .nullish()
    .describe(
      'External donation URL (Zeffy / Donorbox / Stripe). Button hidden when empty.',
    ),
});

export type HomeContentInput = z.infer<typeof HomeContentInputSchema>;

export const HomeContentUpdateSchema = HomeContentInputSchema.partial();
export type HomeContentUpdate = z.infer<typeof HomeContentUpdateSchema>;
