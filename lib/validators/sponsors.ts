/**
 * Zod schema for sponsors table mutations.
 */

import { z } from 'zod';

export const SponsorInputSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name must be at most 200 characters')
    .describe('Sponsor display name'),
  logo_url: z
    .string()
    .url('logo_url must be a valid URL')
    .max(1000, 'logo_url must be at most 1000 characters')
    .nullish()
    .describe('Supabase Storage public URL of the logo'),
  website_url: z
    .string()
    .url('website_url must be a valid URL')
    .max(1000, 'website_url must be at most 1000 characters')
    .nullish()
    .describe('External sponsor website'),
  sort_order: z
    .number()
    .int('sort_order must be an integer')
    .min(0, 'sort_order must be non-negative')
    .default(0)
    .describe('Display order (lower shows first)'),
  is_active: z
    .boolean()
    .default(true)
    .describe('Public display toggle'),
});

export type SponsorInput = z.infer<typeof SponsorInputSchema>;

export const SponsorUpdateSchema = SponsorInputSchema.partial();
export type SponsorUpdate = z.infer<typeof SponsorUpdateSchema>;
