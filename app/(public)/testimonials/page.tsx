import type { Metadata } from 'next';
import Image from 'next/image';
import { Quote } from 'lucide-react';
import { Reveal } from '@/components/sections/reveal';
import { Button } from '@/components/ui/button';
import { BreadcrumbSchema } from '@/lib/seo/json-ld';
import { getAllTestimonials } from '@/lib/fetchers/testimonials';
import { storageUrl } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Testimonials',
  description:
    'Endorsements from leading Indian dance artists and collaborators — Tanushree Shankar, Debojyoti Mishra, Gayatri Joshi, and Sanjib Bhattacharya on BACDA.',
  alternates: { canonical: SITE_URL + '/testimonials' },
  openGraph: {
    title: 'Testimonials — Bay Area Creative Dancers',
    description:
      'Endorsements from leading Indian dance artists and collaborators on BACDA.',
    url: SITE_URL + '/testimonials',
    type: 'website',
  },
};

export default async function TestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <>
      <section className="pt-32 md:pt-40">
        <div className="container">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
            Voices
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-medium italic leading-[1.05] md:text-6xl lg:text-7xl">
            What artists and collaborators say
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            From the musicians, choreographers, and teachers who&apos;ve shared
            a rehearsal room with BACDA.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container">
          {testimonials.length === 0 ? (
            <p className="py-16 text-center text-muted">
              No testimonials yet.
            </p>
          ) : (
            <ul className="grid gap-10 md:grid-cols-2">
              {testimonials.map((t, i) => {
                const photo = t.author_photo_url
                  ? t.author_photo_url.startsWith('http')
                    ? t.author_photo_url
                    : storageUrl('gallery', t.author_photo_url)
                  : null;
                return (
                  <Reveal key={t.id} delay={(i % 2) * 0.08}>
                    <li className="relative flex h-full flex-col rounded-md border border-border bg-white p-8 shadow-sm md:p-10">
                      <Quote
                        aria-hidden="true"
                        className="size-8 text-burgundy/40"
                      />
                      <blockquote className="mt-6 flex-1 font-display text-xl font-normal italic leading-relaxed text-ink md:text-2xl">
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>
                      <figcaption className="mt-8 flex items-center gap-4 border-t border-border pt-6">
                        {photo ? (
                          <Image
                            src={photo}
                            alt={t.author_name}
                            width={56}
                            height={56}
                            className="size-14 rounded-full object-cover"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="inline-flex size-14 items-center justify-center rounded-full bg-burgundy/10 font-display text-xl text-burgundy"
                          >
                            {t.author_name.charAt(0)}
                          </span>
                        )}
                        <div>
                          <div className="font-display text-lg font-medium">
                            {t.author_name}
                          </div>
                          {t.author_title && (
                            <div className="text-sm text-muted">
                              {t.author_title}
                            </div>
                          )}
                        </div>
                      </figcaption>
                    </li>
                  </Reveal>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="bg-[#F5EFE4] py-20 md:py-28">
        <div className="container text-center">
          <p className="mx-auto max-w-xl font-display text-2xl italic leading-relaxed md:text-3xl">
            Worked with us? We&apos;d love to hear from you.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <a
                href="https://www.facebook.com/BayAreaCreativeDanceAcademy/reviews"
                target="_blank"
                rel="noopener noreferrer"
              >
                Leave a review on Facebook
              </a>
            </Button>
          </div>
        </div>
      </section>

      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL + '/' },
          { name: 'Testimonials', url: SITE_URL + '/testimonials' },
        ]}
      />
    </>
  );
}
