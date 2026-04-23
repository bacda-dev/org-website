import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, StaggerGroup, RevealItem } from '@/components/sections/reveal';
import { cn } from '@/lib/utils';

/**
 * Programs — two side-by-side editorial cards covering BACDA's two
 * programmatic strands. Typography-led, no icons. Each card has one photo,
 * a numbered eyebrow, italic Fraunces title, body copy, and an underline CTA.
 *
 * On mobile cards stack; on md+ they share the row, the second slightly
 * offset vertically to break the symmetry.
 */
const PROGRAMS = [
  {
    n: '01',
    eyebrow: 'Tradition',
    title: 'Classical & Devotional',
    body:
      'Bharatanatyam, Odissi, Kathak — and the devotional repertoire we present at NABC ceremonies and temple festivals. Trained under Artistic Director Dalia Sen.',
    photo: '/legacy/photo-folk-1.jpg',
    photoAlt: 'Classical Indian dance ensemble in performance',
    href: '/about',
    cta: 'Read about the practice',
  },
  {
    n: '02',
    eyebrow: 'Today',
    title: 'Contemporary & Fusion',
    body:
      'Original choreographies, theatrical productions, and fusion programs that move classical vocabulary into present-tense storytelling. Twenty-plus stagings since 2008.',
    photo: '/legacy/photo-theater-2019.jpg',
    photoAlt: 'Contemporary fusion dance piece on stage',
    href: '/events',
    cta: 'See past productions',
  },
] as const;

export function Programs() {
  return (
    <section
      aria-labelledby="programs-heading"
      className="relative bg-ink-100 py-24 md:py-32"
    >
      <div className="container">
        <Reveal className="border-b border-cream/10 pb-10">
          <span className="label-eyebrow">Two practices</span>
          <h2
            id="programs-heading"
            className="mt-4 display-md italic text-cream"
          >
            Tradition, and today.
          </h2>
        </Reveal>

        <StaggerGroup className="mt-14 grid gap-12 md:grid-cols-12 md:gap-10">
          {PROGRAMS.map((p, i) => (
            <RevealItem
              key={p.n}
              as="article"
              className={cn(
                'md:col-span-6',
                i === 1 && 'md:mt-16'
              )}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-ink ring-1 ring-inset ring-cream/5 md:aspect-[3/4]">
                <Image
                  src={p.photo}
                  alt={p.photoAlt}
                  fill
                  sizes="(max-width:768px) 100vw, 45vw"
                  className="object-cover transition-transform duration-1000 ease-out-expo hover:scale-[1.04]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent"
                />
                <div className="absolute left-5 top-5 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-burgundy">
                  <span className="inline-block h-[1px] w-6 bg-burgundy" />
                  {p.eyebrow}
                </div>
              </div>

              <div className="mt-8">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-burgundy">
                  {p.eyebrow}
                </span>
                <h3 className="mt-3 font-display text-4xl italic leading-[1.05] text-cream md:text-5xl">
                  {p.title}
                </h3>
                <p className="mt-5 max-w-md text-base leading-relaxed text-cream/70">
                  {p.body}
                </p>
                <Link
                  href={p.href}
                  className="group mt-8 inline-flex items-center gap-2 text-sm text-cream/85 transition-colors hover:text-burgundy"
                >
                  <span className="border-b border-burgundy pb-0.5">
                    {p.cta}
                  </span>
                  <ArrowUpRight
                    className="size-4 text-burgundy transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-2px]"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </RevealItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
