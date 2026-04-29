import { Reveal, StaggerGroup, RevealItem } from '@/components/sections/reveal';

/**
 * Collaborators — renowned artists BACDA has worked with.
 *
 * Editorial roll call of choreographers and artistic directors who have
 * collaborated on BACDA programs over the years. Names render as oversized
 * Fraunces, with a one-line credit beneath each.
 */
const COLLABORATORS = [
  {
    name: 'Tanushree Shankar',
    credit: 'Choreographer · Tanusree Shankar Dance Company',
    note: 'Workshops & program direction',
  },
  {
    name: 'Mallika Sarabhai',
    credit: 'Dancer & cultural icon · Darpana Academy',
    note: 'Choreography collaboration',
  },
  {
    name: 'Luna Poddar',
    credit: 'Choreographer & dance educator',
    note: 'Original program work',
  },
] as const;

export function Collaborators() {
  return (
    <section
      aria-labelledby="collaborators-heading"
      className="relative bg-ink-100 py-24 md:py-32"
    >
      <div className="container">
        <Reveal className="border-b border-cream/10 pb-10">
          <span className="label-eyebrow">Collaborators</span>
          <h2
            id="collaborators-heading"
            className="mt-4 max-w-3xl display-md leading-[1.05] text-cream"
          >
            In the room with
            <br />
            <span className="text-burgundy">renowned artists.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream/65 md:text-lg">
            BACDA programs have been choreographed by and developed with some
            of the most respected names in Indian classical and contemporary
            dance — across India and the diaspora.
          </p>
        </Reveal>

        <StaggerGroup
          as="ul"
          className="mt-12 grid gap-0"
          step={0.06}
        >
          {COLLABORATORS.map((c) => (
            <RevealItem
              as="li"
              key={c.name}
              className="group grid items-baseline gap-2 border-b border-cream/10 py-10 md:grid-cols-12 md:gap-8"
            >
              <div className="md:col-span-7">
                <h3 className="font-display text-5xl leading-[1.02] text-cream md:text-6xl lg:text-7xl">
                  {c.name}
                </h3>
                <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-burgundy">
                  {c.credit}
                </p>
              </div>
              <div className="md:col-span-5 md:pt-3">
                <p className="text-base leading-relaxed text-cream/65">
                  {c.note}
                </p>
              </div>
            </RevealItem>
          ))}
          <RevealItem
            as="li"
            className="border-b border-cream/10 py-10 text-cream/55"
          >
            <p className="font-display text-2xl leading-snug md:text-3xl">
              … and many more across two decades of programs.
            </p>
          </RevealItem>
        </StaggerGroup>
      </div>
    </section>
  );
}
