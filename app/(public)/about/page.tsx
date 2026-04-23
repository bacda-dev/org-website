import type { Metadata } from 'next';
import Image from 'next/image';
import { Reveal, StaggerGroup, RevealItem } from '@/components/sections/reveal';
import { PersonSchema, BreadcrumbSchema } from '@/lib/seo/json-ld';
import { getLeadMember, getTeamMembers } from '@/lib/fetchers/team';
import { getHomeContent } from '@/lib/fetchers/home';
import { storageUrl } from '@/lib/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'About Bay Area Creative Dancers',
  description:
    'Meet Bay Area Creative Dancers — a non-profit dance company led by artistic director Dalia Sen, producing classical, contemporary, and fusion Indian dance in the San Francisco Bay Area.',
  alternates: { canonical: SITE_URL + '/about' },
  openGraph: {
    title: 'About Bay Area Creative Dancers',
    description:
      'Non-profit Indian dance organization led by Dalia Sen — classical, contemporary, and fusion productions.',
    url: SITE_URL + '/about',
    type: 'website',
  },
};

export default async function AboutPage() {
  const [lead, team, home] = await Promise.all([
    getLeadMember(),
    getTeamMembers(),
    getHomeContent(),
  ]);

  const coordinators = team.filter((m) => !m.is_lead);
  const missionIntro = extractMissionIntro(home?.mission_statement ?? '');
  const heroImage = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? storageUrl('gallery', 'hero/slider2.jpg')
    : null;

  const daliaPhoto = lead?.photo_url
    ? lead.photo_url.startsWith('http')
      ? lead.photo_url
      : storageUrl('gallery', lead.photo_url)
    : null;

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="about-hero-heading"
        className="relative overflow-hidden bg-ink pt-28 md:pt-32 grain"
      >
        <div className="relative min-h-[70vh] w-full">
          {heroImage && (
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-55"
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent"
          />
          <div className="container relative flex min-h-[70vh] flex-col justify-end pb-16 pt-24 md:pb-24">
            <Reveal>
              <span className="label-eyebrow">About BACDA</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1
                id="about-hero-heading"
                className="mt-6 max-w-[14ch] display-xl italic text-cream"
              >
                Two decades of dance, told in movement.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-cream/70 md:text-xl">
                Founded in 2008 by artistic director Dalia Sen, BACDA stages
                classical Indian, contemporary, and fusion productions across
                the Bay Area — from NABC ceremonies to intimate devotional
                works.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission intro */}
      {missionIntro && (
        <section className="relative bg-ink py-24 md:py-36">
          <div className="container">
            <Reveal className="flex items-center gap-4 border-b border-cream/10 pb-6">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-cream/40">
                N° 02
              </span>
              <span className="label-eyebrow">Our mission</span>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mt-12 max-w-4xl display-md italic leading-[1.12] text-cream">
                {missionIntro}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* Lead bio */}
      {lead && (
        <section
          aria-labelledby="lead-heading"
          className="relative overflow-hidden bg-ink-100 py-24 md:py-32"
        >
          <div className="container">
            <Reveal className="flex items-center gap-4 border-b border-cream/10 pb-6">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-cream/40">
                N° 04
              </span>
              <span className="label-eyebrow">Artistic director</span>
            </Reveal>

            <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-16">
              <Reveal className="md:col-span-5">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-ink shadow-lg">
                  {daliaPhoto ? (
                    <Image
                      src={daliaPhoto}
                      alt={lead.name}
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-6 text-center">
                      <span className="font-display text-4xl italic text-cream/35">
                        {lead.name}
                      </span>
                    </div>
                  )}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-cream/10"
                  />
                </div>
              </Reveal>

              <div className="md:col-span-7 md:pt-4">
                <Reveal delay={0.05}>
                  <h2
                    id="lead-heading"
                    className="display-lg italic text-cream"
                  >
                    {lead.name}
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="mt-4 font-mono text-[0.72rem] uppercase tracking-[0.28em] text-burgundy">
                    {lead.role}
                  </p>
                </Reveal>
                {lead.bio && (
                  <Reveal delay={0.15}>
                    <p className="mt-8 max-w-xl text-lg leading-[1.65] text-cream/75">
                      {lead.bio}
                    </p>
                  </Reveal>
                )}
                {lead.credits && lead.credits.length > 0 && (
                  <Reveal delay={0.2}>
                    <div className="mt-10 border-t border-cream/10 pt-8">
                      <p className="label-eyebrow-muted">Selected credits</p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {lead.credits.map((c) => (
                          <li
                            key={c}
                            className="rounded-full border border-cream/20 px-3 py-1 text-xs text-cream/75"
                          >
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team grid */}
      {coordinators.length > 0 && (
        <section
          aria-labelledby="team-heading"
          className="relative bg-ink py-24 md:py-32"
        >
          <div className="container">
            <Reveal className="flex items-center gap-4 border-b border-cream/10 pb-6">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-cream/40">
                N° 05
              </span>
              <span className="label-eyebrow">The team</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                id="team-heading"
                className="mt-10 display-md italic text-cream"
              >
                Coordinators & collaborators.
              </h2>
            </Reveal>
            <StaggerGroup
              as="ul"
              step={0.08}
              className="mt-14 grid gap-0 border-t border-cream/10 sm:grid-cols-2 lg:grid-cols-3"
            >
              {coordinators.map((m) => {
                const photo = m.photo_url
                  ? m.photo_url.startsWith('http')
                    ? m.photo_url
                    : storageUrl('gallery', m.photo_url)
                  : null;
                return (
                  <RevealItem
                    key={m.id}
                    as="li"
                    className="group flex items-center gap-5 border-b border-cream/10 py-7 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:pr-8 sm:[&:nth-child(even)]:pl-8 lg:[&:nth-child(3n-1)]:border-r lg:[&:nth-child(3n-1)]:px-8 lg:[&:nth-child(3n-2)]:pr-8 lg:[&:nth-child(3n)]:pl-8 lg:[&:nth-child(n)]:border-r-0 lg:[&:nth-child(3n-2)]:border-r lg:[&:nth-child(3n-1)]:border-r"
                  >
                    {photo ? (
                      <Image
                        src={photo}
                        alt={m.name}
                        width={96}
                        height={96}
                        className="size-20 shrink-0 rounded-full object-cover ring-1 ring-cream/15 transition-transform group-hover:scale-[1.04]"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="inline-flex size-20 shrink-0 items-center justify-center rounded-full bg-burgundy/15 font-display text-3xl italic text-burgundy ring-1 ring-burgundy/30"
                      >
                        {m.name.charAt(0)}
                      </span>
                    )}
                    <div>
                      <h3 className="font-display text-2xl italic text-cream">
                        {m.name}
                      </h3>
                      <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.25em] text-cream/55">
                        {m.role}
                      </p>
                    </div>
                  </RevealItem>
                );
              })}
            </StaggerGroup>
          </div>
        </section>
      )}

      {lead && (
        <PersonSchema
          name={lead.name}
          jobTitle={lead.role}
          description={lead.bio ?? undefined}
          imageUrl={daliaPhoto ?? undefined}
          knowsAbout={lead.credits ?? undefined}
        />
      )}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL + '/' },
          { name: 'About', url: SITE_URL + '/about' },
        ]}
      />
    </>
  );
}

/** Extract mission intro (pre-acronym breakdown). */
function extractMissionIntro(raw: string): string {
  if (!raw) return '';
  const cutoff = raw.indexOf('**B is for');
  const intro = cutoff > -1 ? raw.slice(0, cutoff) : raw;
  return intro
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .trim();
}
