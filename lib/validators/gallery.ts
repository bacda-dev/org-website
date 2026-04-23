/**
 * Zod schemas for gallery content — standalone videos + event-scoped photos.
 */

import { z } from 'zod';

/**
 * YouTube video id regex — 11 chars, URL-safe alphabet.
 */
const YT_ID_RE = /^[A-Za-z0-9_-]{11}$/u;

export const GalleryVideoInputSchema = z.object({
  youtube_id: z
    .string()
    .regex(YT_ID_RE, 'youtube_id must be an 11-char YouTube id')
    .describe('YouTube video ID (11 chars)'),
  title: z
    .string()
    .max(300, 'Title must be at most 300 characters')
    .nullish()
    .describe('Display title'),
  description: z
    .string()
    .max(2000, 'Description must be at most 2000 characters')
    .nullish()
    .describe('Optional description / context'),
  sort_order: z
    .number()
    .int('sort_order must be an integer')
    .min(0, 'sort_order must be non-negative')
    .default(0)
    .describe('Display order (lower shows first)'),
});

export type GalleryVideoInput = z.infer<typeof GalleryVideoInputSchema>;

export const GalleryVideoUpdateSchema = GalleryVideoInputSchema.partial();
export type GalleryVideoUpdate = z.infer<typeof GalleryVideoUpdateSchema>;

export const EventPhotoInputSchema = z.object({
  event_id: z
    .string()
    .uuid('event_id must be a UUID')
    .describe('Parent event UUID'),
  storage_path: z
    .string()
    .min(1, 'storage_path cannot be empty')
    .max(1000, 'storage_path must be at most 1000 characters')
    .describe('Path within the "gallery" Supabase Storage bucket'),
  caption: z
    .string()
    .max(500, 'Caption must be at most 500 characters')
    .nullish()
    .describe('Optional caption / alt text'),
  sort_order: z
    .number()
    .int('sort_order must be an integer')
    .min(0, 'sort_order must be non-negative')
    .default(0)
    .describe('Display order (lower shows first)'),
});

export type EventPhotoInput = z.infer<typeof EventPhotoInputSchema>;

export const EventPhotoUpdateSchema = EventPhotoInputSchema.partial();
export type EventPhotoUpdate = z.infer<typeof EventPhotoUpdateSchema>;
