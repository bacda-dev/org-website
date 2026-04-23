/**
 * Admin — Testimonials CRUD.
 */

import { getAllTestimonials } from '@/lib/fetchers/testimonials';
import { TestimonialsManager } from './testimonials-manager';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          Admin · Testimonials
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
          Testimonials
        </h1>
        <p className="mt-1 text-sm text-muted">
          Endorsement quotes. Mark as featured to surface on the home carousel.
        </p>
      </div>

      <TestimonialsManager testimonials={testimonials} />
    </div>
  );
}
