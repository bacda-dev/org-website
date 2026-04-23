/**
 * Testimonial fetchers — cached 60s, tag 'testimonials'.
 */

import { unstable_cache } from 'next/cache';
import { createPublicReadClient } from '@/lib/supabase/server';
import type { TestimonialRow } from '@/types/database';

const REVALIDATE_SECONDS = 60;
const TAGS = ['testimonials'];

async function fetchFeatured(): Promise<TestimonialRow[]> {
  const supabase = createPublicReadClient();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true });
  if (error) return [];
  return (data ?? []) as TestimonialRow[];
}

async function fetchAll(): Promise<TestimonialRow[]> {
  const supabase = createPublicReadClient();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return (data ?? []) as TestimonialRow[];
}

export const getFeaturedTestimonials = unstable_cache(
  fetchFeatured,
  ['testimonials:featured'],
  { revalidate: REVALIDATE_SECONDS, tags: TAGS },
);

export const getAllTestimonials = unstable_cache(fetchAll, ['testimonials:all'], {
  revalidate: REVALIDATE_SECONDS,
  tags: TAGS,
});
