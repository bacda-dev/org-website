/**
 * Zod schema for team_members table mutations.
 */

import { z } from 'zod';

export const TeamMemberInputSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name must be at most 200 characters')
    .describe('Full name'),
  role: z
    .string()
    .min(2, 'Role must be at least 2 characters')
    .max(200, 'Role must be at most 200 characters')
    .describe('Role / title (e.g. Artistic Director)'),
  bio: z
    .string()
    .max(10000, 'Bio must be at most 10,000 characters')
    .nullish()
    .describe('Markdown biography'),
  photo_url: z
    .string()
    .url('photo_url must be a valid URL')
    .max(1000, 'photo_url must be at most 1000 characters')
    .nullish()
    .describe('Supabase Storage public URL of the headshot'),
  credits: z
    .array(
      z
        .string()
        .min(1, 'Credit cannot be empty')
        .max(300, 'Credit must be at most 300 characters'),
    )
    .max(50, 'At most 50 credits allowed')
    .default([])
    .describe('Notable credits / accomplishments'),
  is_lead: z
    .boolean()
    .default(false)
    .describe('Mark as artistic lead (one row typically true)'),
  sort_order: z
    .number()
    .int('sort_order must be an integer')
    .min(0, 'sort_order must be non-negative')
    .default(0)
    .describe('Display order (lower shows first)'),
});

export type TeamMemberInput = z.infer<typeof TeamMemberInputSchema>;

export const TeamMemberUpdateSchema = TeamMemberInputSchema.partial();
export type TeamMemberUpdate = z.infer<typeof TeamMemberUpdateSchema>;
