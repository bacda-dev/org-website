import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, StaggerGroup, RevealItem } from '@/components/sections/reveal';

/**
 * Productions — BACDA's own musical productions, named.
 *
 * The four canonical original works the company has staged: Raabta, Bodhayon,
 * Ehsaas, Kingdom of Dreams. Editorial list with year, marquee credit, and a
 * sentence each, framed by a left-rail intro on desktop.
 */
const PRODUCTIONS = [
  {
    title: 'Raabta',
    year: '2018',
    note: 'Maiden BACDA production',
    body:
      'The company\'s debut full-length musical — a fusion piece weaving classical idioms with original score. The work that made BACDA, BACDA.',
    href: '/events/raabdta-2018',
  },
  {
    title: 'Bodhayon',
    year: '2020',
    note: 'Original musical',
    body:
      'A BACDA production exploring myth and movement — not an NABC ceremony, but a fully-staged narrative work of the company\'s own.',
    href: '/events/bodhayon-2020',
  },
  {
    title: 'Ehsaas',
    year: '',
    note: 'Original musical',
    body:
      'Devised choreography on memory and feeling — a quieter, more intimate register from the same company that does big stages.',
    href: '/events',
  },
  {
    title: 'Kingdom of Dreams',
    year: '2025',
    note: 'Original musical',
    body:
      'BACDA\'s most recent full-length — a Bollywood-scale dance theater piece staged across two evenings.',
    href: '/events/kingdom-of-dreams-2025',
  },
] as const;

export function Productions() {
  return (
    <section
      aria-labelledby="productions-heading"
      className="relative bg-ink-100 py-24 md:py-32"
    >
      <div className="container">
        <div className="grid gap-14 md:grid-cols-12 md:gap-16">
          {/* Left rail — sticky on desktop */}
          <Reveal className="md:col-span-4">
            <span className="label-eyebrow">Original work</span>
            <h2
              id="productions-heading"
              className="mt-6 display-md leading-[1.05] text-cream"
            >
              Our musical
              <br />
              productions.
            </h2>
            <p className="mt-8 max-w-sm text-base leading-relaxed text-cream/65">
              BACDA isn&apos;t only a stage company that shows up at NABC — we
              write, choreograph, and stage our own full-length musical
              productions. Four are named below.
            </p>

            {/* Hero photo */}
            <div className="relative mt-10 hidden aspect-[4/5] w-full overflow-hidden rounded-sm bg-ink ring-1 ring-inset ring-cream/5 md:block">
              <Image
                src="/legacy/photo-bodhayon-poster.png"
                alt="Bodhayon — a BACDA original musical production"
                fill
                sizes="(min-width:768px) 33vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent"
              />
            </div>
          </Reveal>

          {/* Right — productions list */}
          <StaggerGroup
            as="ol"
            className="relative md:col-span-8"
            step={0.06}
          >
            {PRODUCTIONS.map((p, i) => (
              <RevealItem
                as="li"
                key={p.title}
                className="group grid gap-3 border-t border-cream/10 py-8 md:grid-cols-12 md:gap-6 md:py-10"
              >
                <div className="md:col-span-2">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-burgundy">
                    {String(i + 1).padStart(2, '0')}
                    {p.year ? ` · ${p.year}` : ''}
                  </span>
                </div>
                <div className="md:col-span-7">
                  <Link
                    href={p.href}
                    className="font-display text-4xl leading-[1.05] text-cream transition-colors hover:text-burgundy md:text-5xl"
                  >
                    {p.title}
                  </Link>
                  <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.25em] text-cream/45">
                    {p.note}
                  </p>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-cream/70">
                    {p.body}
                  </p>
                </div>
                <div className="flex items-start md:col-span-3 md:justify-end">
                  <Link
                    href={p.href}
                    aria-label={`Read about ${p.title}`}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition-all group-hover:border-burgundy group-hover:text-burgundy"
                  >
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </RevealItem>
            ))}
            <li className="border-t border-cream/10 pt-8">
              <Link
                href="/events"
                className="group inline-flex items-center gap-2 text-sm text-cream/80 transition-colors hover:text-burgundy"
              >
                <span className="border-b border-burgundy pb-0.5">
                  See every production
                </span>
                <ArrowUpRight
                  className="size-4 text-burgundy transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-2px]"
                  aria-hidden="true"
                />
              </Link>
            </li>
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
