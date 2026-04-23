import { Reveal } from './reveal';
import { cn } from '@/lib/utils';

/**
 * BACD acronym — concert-hall noir edition.
 *
 * Home variant (`grid`): four stacked horizontal strips, each with a giant
 * letter as a visual anchor, the word in italic Fraunces, and a single-line
 * descriptor. Borders only; no card chrome. The strips compete with nothing
 * because they ARE the page.
 *
 * Story variant (`story`, /about): same strips with more breathing room and
 * an opening lede.
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
  const isStory = variant === 'story';

  return (
    <section
      aria-labelledby={isStory ? 'bacd-story-heading' : 'bacd-heading'}
      className="relative overflow-hidden bg-ink py-24 md:py-32"
    >
      <div className="container">
        <Reveal className="flex items-center justify-between border-b border-cream/10 pb-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-cream/40">
              N° {isStory ? '03' : '02'}
            </span>
            <span className="label-eyebrow">
              {isStory ? 'Our creed' : 'Four letters, four promises'}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2
            id={isStory ? 'bacd-story-heading' : 'bacd-heading'}
            className={cn(
              'mt-10 max-w-3xl italic text-cream',
              isStory ? 'display-lg' : 'display-md'
            )}
          >
            {isStory
              ? 'BACD, letter by letter.'
              : 'What we build, one word at a time.'}
          </h2>
        </Reveal>

        {/* 4 horizontal strips */}
        <div className="mt-14 md:mt-20" role="list">
          {ENTRIES.map((e, i) => (
            <Reveal
              key={e.letter}
              delay={i * 0.06}
              role="listitem"
              className={cn(
                'group grid items-center gap-6 border-t border-cream/10 py-8 transition-colors hover:border-burgundy/60 md:grid-cols-12 md:gap-10 md:py-12',
                i === ENTRIES.length - 1 && 'border-b border-cream/10'
              )}
            >
              {/* Index */}
              <div className="flex items-baseline gap-4 md:col-span-2">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-cream/40">
                  {`0${i + 1}`}
                </span>
              </div>

              {/* Letter + word */}
              <div className="flex items-baseline gap-5 md:col-span-5">
                <span
                  aria-hidden="true"
                  className="font-display font-medium leading-none tracking-tightest text-burgundy transition-colors duration-500 group-hover:text-gold"
                  style={{ fontSize: 'clamp(5rem, 12vw, 10rem)' }}
                >
                  {e.letter}
                </span>
                <span className="font-display text-3xl font-medium italic leading-none text-cream md:text-5xl">
                  {e.word}
                </span>
              </div>

              {/* Descriptor */}
              <p className="md:col-span-5 md:pt-2 text-lg leading-[1.6] text-cream/70">
                {e.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
