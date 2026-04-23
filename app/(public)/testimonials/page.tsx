import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, StaggerGroup, RevealItem } from '@/components/sections/reveal';
import { BreadcrumbSchema } from '@/lib/seo/json-ld';
import { getAllTestimonials } from '@/lib/fetchers/testimonials';
import { storageUrl } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Voices',
  description:
    'Endorsements from leading Indian dance artists and collaborators — Tanushree Shankar, Debojyoti Mishra, Gayatri Joshi, and Sanjib Bhattacharya on BACDA.',
  alternates: { canonical: SITE_URL + '/testimonials' },
  openGraph: {
    title: 'Voices — Bay Area Creative Dancers',
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
      <section className="relative bg-ink pt-36 md:pt-44">
        <div className="container">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-cream/45">
                Chapter 04
              </span>
              <span className="inline-block h-[1px] w-10 bg-burgundy" />
              <span className="label-eyebrow">Voices</span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 max-w-[14ch] display-xl italic leading-[0.95] text-cream">
              What collaborators say.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-cream/65 md:text-xl">
              From the musicians, choreographers, and teachers who&apos;ve shared
              a rehearsal room with BACDA.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink py-20 md:py-28">
        <div className="container">
          {testimonials.length === 0 ? (
            <div className="flex flex-col items-start gap-3 border-t border-cream/10 py-20">
              <span className="label-eyebrow-muted">Intermission</span>
              <p className="max-w-md font-display text-2xl italic text-cream/70 md:text-3xl">
                No testimonials yet.
              </p>
            </div>
          ) : (
            <StaggerGroup
              as="ul"
              step={0.1}
              className="grid gap-0 border-t border-cream/10"
            >
              {testimonials.map((t, i) => {
                const photo = t.author_photo_url
                  ? t.author_photo_url.startsWith('http')
                    ? t.author_photo_url
                    : storageUrl('gallery', t.author_photo_url)
                  : null;
                return (
                  <RevealItem
                    key={t.id}
                    as="li"
                    className="group relative border-b border-cream/10 py-14 md:py-20"
                  >
                    <div className="grid gap-8 md:grid-cols-12 md:gap-12">
                      <div className="md:col-span-2">
                        <span className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-cream/40">
                          {String(i + 1).padStart(2, '0')} /{' '}
                          {String(testimonials.length).padStart(2, '0')}
                        </span>
                      </div>

                      <blockquote className="md:col-span-10">
                        <p className="font-display italic leading-[1.12] text-cream transition-colors group-hover:text-cream [font-size:clamp(1.75rem,3.8vw,3rem)]">
                          <span className="text-burgundy">&ldquo;</span>
                          {t.quote}
                          <span className="text-burgundy">&rdquo;</span>
                        </p>

                        <footer className="mt-10 flex items-center gap-5">
                          {photo ? (
                            <Image
                              src={photo}
                              alt={t.author_name}
                              width={56}
                              height={56}
                              className="size-14 rounded-full object-cover ring-1 ring-cream/15"
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="inline-flex size-14 items-center justify-center rounded-full bg-burgundy/15 font-display text-xl italic text-burgundy ring-1 ring-burgundy/30"
                            >
                              {t.author_name.charAt(0)}
                            </span>
                          )}
                          <div>
                            <div className="font-display text-xl italic text-cream">
                              {t.author_name}
                            </div>
                            {t.author_title && (
                              <div className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-cream/55">
                                {t.author_title}
                              </div>
                            )}
                          </div>
                        </footer>
                      </blockquote>
                    </div>
                  </RevealItem>
                );
              })}
            </StaggerGroup>
          )}
        </div>
      </section>

      <section className="relative bg-ink-100 py-20 md:py-28">
        <div className="container flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl display-sm italic text-cream">
            Worked with us? We&apos;d love to hear from you.
          </p>
          <a
            href="https://www.facebook.com/BayAreaCreativeDanceAcademy/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full bg-burgundy py-3 pl-6 pr-3 text-sm font-medium text-ink transition-colors hover:bg-burgundy-dark"
          >
            <span>Leave a review</span>
            <span
              aria-hidden="true"
              className="inline-flex size-8 items-center justify-center rounded-full bg-ink/15 transition-transform group-hover:translate-x-0.5"
            >
              <ArrowUpRight className="size-4" />
            </span>
          </a>
        </div>
      </section>

      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL + '/' },
          { name: 'Voices', url: SITE_URL + '/testimonials' },
        ]}
      />
    </>
  );
}
