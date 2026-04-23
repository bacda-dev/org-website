/**
 * Zod schema for instagram_highlights table mutations.
 */

import { z } from 'zod';

export const InstagramHighlightInputSchema = z.object({
  post_url: z
    .string()
    .url('post_url must be a valid URL')
    .max(1000, 'post_url must be at most 1000 characters')
    .describe('Public Instagram post URL'),
  caption: z
    .string()
    .max(2000, 'Caption must be at most 2000 characters')
    .nullish()
    .describe('Caption copy (from oEmbed or admin override)'),
  thumbnail_url: z
    .string()
    .url('thumbnail_url must be a valid URL')
    .max(1000, 'thumbnail_url must be at most 1000 characters')
    .nullish()
    .describe('Thumbnail image URL (from oEmbed or admin paste)'),
  author: z
    .string()
    .max(200, 'Author must be at most 200 characters')
    .nullish()
    .describe('Instagram handle of the post author'),
  posted_at: z
    .string()
    .datetime({ offset: true, message: 'posted_at must be ISO 8601 with offset' })
    .nullish()
    .describe('Original post timestamp (ISO 8601)'),
  sort_order: z
    .number()
    .int('sort_order must be an integer')
    .min(0, 'sort_order must be non-negative')
    .default(0)
    .describe('Display order (lower shows first)'),
  is_featured: z
    .boolean()
    .default(false)
    .describe('Highlight on the home page'),
});

export type InstagramHighlightInput = z.infer<typeof InstagramHighlightInputSchema>;

export const InstagramHighlightUpdateSchema =
  InstagramHighlightInputSchema.partial();
export type InstagramHighlightUpdate = z.infer<
  typeof InstagramHighlightUpdateSchema
>;
