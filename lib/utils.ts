import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditionally joins Tailwind classes and resolves conflicts.
 * Use this for every className={...} that mixes static + conditional classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Slugify a string for URL/ID use.
 * Lowercase, replaces non-alphanumeric with hyphens, collapses repeats,
 * trims leading/trailing hyphens.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format a Supabase Storage public URL from a bucket + path.
 * Local dev points at the local Supabase instance; production resolves via
 * NEXT_PUBLIC_SUPABASE_URL automatically.
 */
export function storageUrl(bucket: string, path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  if (!base) return '';
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Safely return a URL or null.
 */
export function toAbsoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  if (path.startsWith('http')) return path;
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}
