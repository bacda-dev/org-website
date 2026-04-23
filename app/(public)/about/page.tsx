import type { Metadata } from 'next';
import Image from 'next/image';
import { Reveal } from '@/components/sections/reveal';
import { BacdAcronym } from '@/components/sections/bacd-acronym';
import { Badge } from '@/components/ui/badge';
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

  // Extract just the intro paragraph (before the BACD acronym breakdown).
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
        className="relative overflow-hidden bg-ink pt-20 md:pt-24"
      >
        <div className="relative h-[50vh] min-h-[360px] w-full md:h-[60vh]">
          {heroImage && (
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-70"
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/40 to-ink/80"
          />
          <div className="container relative flex h-full items-end pb-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-cream/70">
                About
              </p>
              <h1
                id="about-hero-heading"
                className="mt-4 font-display text-4xl font-medium italic text-cream md:text-6xl lg:text-7xl"
              >
                Bay Area Creative Dancers
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Mission intro */}
      {missionIntro && (
        <section className="bg-cream py-24 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
                  Our mission
                </p>
                <p className="mt-6 font-display text-2xl font-normal leading-relaxed text-ink md:text-3xl">
                  {missionIntro}
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* BACD acronym story */}
      <BacdAcronym variant="story" />

      {/* Dalia bio */}
      {lead && (
        <section
          aria-labelledby="lead-heading"
          className="bg-[#F5EFE4] py-24 md:py-32"
        >
          <div className="container">
            <div className="grid gap-12 md:grid-cols-12 md:gap-16">
              <Reveal className="md:col-span-5">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-ink/10 shadow-md">
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
                      <span className="font-display text-4xl italic text-muted">
                        {lead.name}
                      </span>
                    </div>
                  )}
                </div>
              </Reveal>
              <div className="md:col-span-7 md:pt-6">
                <Reveal>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
                    Artistic Director
                  </p>
                  <h2
                    id="lead-heading"
                    className="mt-4 font-display text-4xl font-medium italic md:text-5xl lg:text-6xl"
                  >
                    {lead.name}
                  </h2>
                  <p className="mt-2 font-display text-lg text-muted md:text-xl">
                    {lead.role}
                  </p>
                </Reveal>
                {lead.bio && (
                  <Reveal delay={0.1}>
                    <p className="mt-8 max-w-xl leading-relaxed text-ink/85">
                      {lead.bio}
                    </p>
                  </Reveal>
                )}
                {lead.credits && lead.credits.length > 0 && (
                  <Reveal delay={0.2}>
                    <div className="mt-8">
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                        Selected credits
                      </p>
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {lead.credits.map((c) => (
                          <li key={c}>
                            <Badge variant="outline" className="font-sans">
                              {c}
                            </Badge>
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
          className="bg-cream py-24 md:py-32"
        >
          <div className="container">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
                The team
              </p>
              <h2
                id="team-heading"
                className="mt-4 font-display text-3xl font-medium italic md:text-4xl"
              >
                Coordinators
              </h2>
            </Reveal>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {coordinators.map((m, i) => {
                const photo = m.photo_url
                  ? m.photo_url.startsWith('http')
                    ? m.photo_url
                    : storageUrl('gallery', m.photo_url)
                  : null;
                return (
                  <Reveal key={m.id} delay={(i % 3) * 0.08}>
                    <li className="flex items-start gap-4 rounded-md border border-border bg-white p-5">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={m.name}
                          width={80}
                          height={80}
                          className="size-20 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="inline-flex size-20 shrink-0 items-center justify-center rounded-full bg-burgundy/10 font-display text-2xl text-burgundy"
                        >
                          {m.name.charAt(0)}
                        </span>
                      )}
                      <div>
                        <h3 className="font-display text-xl font-medium">
                          {m.name}
                        </h3>
                        <p className="text-sm text-muted">{m.role}</p>
                      </div>
                    </li>
                  </Reveal>
                );
              })}
            </ul>
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

/**
 * Extract the first paragraph of the mission statement (before the BACD
 * acronym breakdown, which starts with "**B is for"). Falls back to the
 * whole string with markdown emphasis stripped.
 */
function extractMissionIntro(raw: string): string {
  if (!raw) return '';
  const cutoff = raw.indexOf('**B is for');
  const intro = cutoff > -1 ? raw.slice(0, cutoff) : raw;
  return intro
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .trim();
}
