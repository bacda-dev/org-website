import { Reveal } from './reveal';

/**
 * BACD acronym reveal — Bridge, Alive, Cherish, Dance. Rendered as an
 * asymmetric 4-card grid with the letter set in large Fraunces display type,
 * followed by the word and a single-sentence explanation. Part of the
 * organization's branding per PRD §4.2.1 — intentionally hardcoded here
 * rather than read from the database (the letters themselves are the brand).
 *
 * If `variant="story"` (used on /about), each entry stacks vertically with
 * alternating left/right alignment and more breathing room. Otherwise a
 * compact 4-up grid fit for the home page.
 */
const ENTRIES: ReadonlyArray<{
  letter: 'B' | 'A' | 'C' | 'D';
  word: string;
  body: string;
}> = [
  {
    letter: 'B',
    word: 'Bridge',
    body: 'We fuse traditional Indian dance with modern forms — bridging geographies, generations, and genders.',
  },
  {
    letter: 'A',
    word: 'Alive',
    body: 'We introduce Indian dance customs to new audiences, keeping the culture alive for the next generation.',
  },
  {
    letter: 'C',
    word: 'Cherish',
    body: 'We cherish all forms of dance, both classical and modern, and use dance to unite people across communities.',
  },
  {
    letter: 'D',
    word: 'Dance',
    body: 'We revere dance as an ancient art form integral to the human experience — to movement, to storytelling, and to joy.',
  },
];

export interface BacdAcronymProps {
  variant?: 'grid' | 'story';
}

export function BacdAcronym({ variant = 'grid' }: BacdAcronymProps) {
  if (variant === 'story') {
    return (
      <section
        aria-labelledby="bacd-story-heading"
        className="bg-cream py-24 md:py-32"
      >
        <div className="container">
          <Reveal>
            <h2
              id="bacd-story-heading"
              className="font-display text-3xl font-medium italic md:text-4xl"
            >
              BACD, letter by letter
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              Four promises we keep to ourselves and to the dancers who come
              after us.
            </p>
          </Reveal>
          <div className="mt-16 space-y-20 md:space-y-24">
            {ENTRIES.map((e, i) => (
              <Reveal
                key={e.letter}
                delay={i * 0.05}
                className={
                  i % 2 === 0
                    ? 'grid gap-8 md:grid-cols-12 md:gap-16'
                    : 'grid gap-8 md:grid-cols-12 md:gap-16 md:[direction:rtl]'
                }
              >
                <div className="md:col-span-4 md:[direction:ltr]">
                  <span
                    aria-hidden="true"
                    className="block font-display font-semibold leading-none text-burgundy [font-size:clamp(6rem,14vw,11rem)]"
                  >
                    {e.letter}
                  </span>
                </div>
                <div className="md:col-span-8 md:pt-6 md:[direction:ltr]">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                    {e.letter} is for
                  </p>
                  <h3 className="mt-2 font-display text-4xl font-medium italic md:text-5xl">
                    {e.word}
                  </h3>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
                    {e.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="bacd-heading"
      className="bg-cream py-24 md:py-32"
    >
      <div className="container">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-burgundy">
            What B.A.C.D. stands for
          </p>
          <h2
            id="bacd-heading"
            className="mt-4 max-w-2xl font-display text-3xl font-medium italic md:text-5xl"
          >
            Four letters, four commitments.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {ENTRIES.map((e, i) => (
            <Reveal
              key={e.letter}
              delay={i * 0.08}
              className="group relative border-t border-border pt-8"
            >
              <span
                aria-hidden="true"
                className="block font-display font-semibold leading-none text-burgundy [font-size:clamp(4rem,9vw,7rem)]"
              >
                {e.letter}
              </span>
              <h3 className="mt-6 font-display text-2xl font-medium italic text-ink">
                {e.word}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                {e.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
