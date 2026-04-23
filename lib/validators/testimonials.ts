/**
 * Zod schema for testimonials table mutations.
 */

import { z } from 'zod';

export const TestimonialInputSchema = z.object({
  quote: z
    .string()
    .min(10, 'Quote must be at least 10 characters')
    .max(2000, 'Quote must be at most 2000 characters')
    .describe('The testimonial body'),
  author_name: z
    .string()
    .min(2, 'Author name must be at least 2 characters')
    .max(200, 'Author name must be at most 200 characters')
    .describe('Full name of the person quoted'),
  author_title: z
    .string()
    .max(300, 'Author title must be at most 300 characters')
    .nullish()
    .describe('Role / credentials of the author'),
  author_photo_url: z
    .string()
    .url('author_photo_url must be a valid URL')
    .max(1000, 'author_photo_url must be at most 1000 characters')
    .nullish()
    .describe('Supabase Storage public URL of the author photo'),
  is_featured: z
    .boolean()
    .default(false)
    .describe('Show on the home page carousel'),
  sort_order: z
    .number()
    .int('sort_order must be an integer')
    .min(0, 'sort_order must be non-negative')
    .default(0)
    .describe('Display order (lower shows first)'),
});

export type TestimonialInput = z.infer<typeof TestimonialInputSchema>;

export const TestimonialUpdateSchema = TestimonialInputSchema.partial();
export type TestimonialUpdate = z.infer<typeof TestimonialUpdateSchema>;
