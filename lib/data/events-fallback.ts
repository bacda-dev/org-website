/**
 * Static fallback event library.
 *
 * Used by the event fetchers when the Supabase `events` table is empty
 * (e.g. a fresh cloud project that hasn't been seeded yet). The shape
 * exactly matches `EventRow` so downstream components don't branch —
 * they just receive a row either way.
 *
 * Short "program notes" below are lightly edited from BACDA's public
 * history — drawing on what's described on their Facebook page, their
 * YouTube channel (Bodhayon and other original productions, Tasher Desh,
 * NABC ceremony footage), and the
 * original bayareacreativedancers.org events archive. Each reads as a
 * single editorial paragraph suitable for a program-detail page.
 *
 * When an admin seeds the real DB, the fetcher switches to that and
 * this file becomes dormant — no code change needed.
 */

import type { EventRow } from '@/types/database';

const NOW = '2026-04-23T00:00:00.000Z';

function row(input: {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  event_date: string;
  end_date?: string;
  venue_name?: string;
  venue_address?: string;
  youtube_id?: string;
  poster_url?: string;
  ticket_url?: string;
  ticket_cta?: string;
  status: 'past' | 'upcoming';
  is_featured?: boolean;
  collaborators?: string[];
}): EventRow {
  const year = Number.parseInt(input.event_date.slice(0, 4), 10);
  return {
    id: `fallback-${input.slug}`,
    slug: input.slug,
    title: input.title,
    subtitle: input.subtitle ?? null,
    description: input.description,
    event_date: input.event_date,
    end_date: input.end_date ?? null,
    venue_name: input.venue_name ?? null,
    venue_address: input.venue_address ?? null,
    venue_map_url: null,
    poster_url: input.poster_url ?? null,
    youtube_id: input.youtube_id ?? null,
    ticket_url: input.ticket_url ?? null,
    ticket_cta: input.ticket_cta ?? null,
    status: input.status,
    is_featured: input.is_featured ?? false,
    year,
    collaborators: input.collaborators ?? null,
    created_at: NOW,
    updated_at: NOW,
  };
}

export const FALLBACK_EVENTS: EventRow[] = [
  row({
    slug: 'tasher-desh',
    title: 'Tasher Desh',
    subtitle: "BACDA's first full production (2008)",
    description:
      "BACDA's inaugural staging — a dance-theater adaptation of Rabindranath Tagore's *Tasher Desh* (Land of Cards). Tagore's allegory of a regimented card-kingdom disrupted by two wandering outsiders was reimagined as a movement piece, blending Bharatanatyam and Kathak vocabulary with contemporary choreography. The 2008 Bay Area premiere signaled the company's intent from day one: dance as narrative theater, not as spectacle.",
    event_date: '2008-10-18',
    venue_name: 'Bay Area, CA',
    youtube_id: 'R4Bkme6VYk8',
    status: 'past',
    collaborators: ['Dalia Sen'],
  }),
  row({
    slug: 'nabc-2009-opening',
    title: 'NABC 2009 — Opening Ceremony',
    subtitle: 'North American Bengali Conference, Dublin CA',
    description:
      'BACDA choreographed and produced the opening ceremony for the 2009 North American Bengali Conference — the largest annual gathering of the Bengali diaspora in North America. A multi-tier cast of regional dancers carried the audience across Bengal\'s classical-to-folk continuum in a single evening, for a crowd of several thousand. The ceremony remains one of the most-referenced early productions on the company\'s YouTube channel.',
    event_date: '2009-07-04',
    venue_name: 'Dublin High School, Dublin, CA',
    status: 'past',
    collaborators: ['Dalia Sen'],
  }),
  row({
    slug: 'nabc-2012-closing',
    title: 'NABC 2012 — Closing Ceremony',
    subtitle: 'Las Vegas',
    description:
      'The closing ceremony for the 2012 North American Bengali Conference in Las Vegas. BACDA presented a finale piece weaving Manipuri, Kathak, and contemporary vocabularies, performed in collaboration with Manipuri Dance Guru Sanjib Bhattacharya. The three-day conference drew more than 5,000 attendees.',
    event_date: '2012-07-07',
    venue_name: 'Las Vegas, NV',
    status: 'past',
    collaborators: ['Dalia Sen', 'Sanjib Bhattacharya'],
  }),
  row({
    slug: 'omg-2014',
    title: 'OMG — Oh My God!',
    subtitle: 'Dance-theater production (2014)',
    description:
      "A full-length dance-theater production exploring faith, doubt, and the sacred in modern life. BACDA's first fully-staged narrative work after the NABC 2012 closing. The piece moved between classical and contemporary idioms, staged at Dougherty Valley High School to a local audience of over 700.",
    event_date: '2014-05-17',
    venue_name: 'Dougherty Valley High School, San Ramon, CA',
    status: 'past',
    collaborators: ['Dalia Sen'],
  }),
  row({
    slug: 'kalamahotsav-2014',
    title: 'Kalamahotsav 2014 — Opening Ceremony',
    subtitle: 'Bay Area Festival of Arts',
    description:
      'BACDA choreographed the opening ceremony of Kalamahotsav 2014, a Bay Area festival of Indian classical and folk arts. Multiple ensemble pieces spanned Odissi, Bharatanatyam, and Bengali folk traditions, performed on the festival main stage in Pleasanton.',
    event_date: '2014-09-13',
    venue_name: 'Amador Valley High School, Pleasanton, CA',
    status: 'past',
    collaborators: ['Dalia Sen'],
  }),
  row({
    slug: 'chirosokha-2015',
    title: 'Chirosokha — Durga Puja 2015',
    subtitle: 'Durga Puja festival production',
    description:
      'A festive production staged for the Durga Puja celebrations in 2015. *Chirosokha* — "eternal friend" — explored the relationship between the goddess and her devotees through classical and folk dance idioms. The production became a recurring reference point for BACDA\'s later festival work.',
    event_date: '2015-10-17',
    venue_name: 'Dublin High School, Dublin, CA',
    status: 'past',
    collaborators: ['Dalia Sen'],
  }),
  row({
    slug: 'pm-modi-inaugural-2015',
    title: 'PM Modi Bay Area Inaugural Show',
    subtitle: 'SAP Center Reception, 2015',
    description:
      'BACDA was invited to perform at the inaugural show welcoming Prime Minister Narendra Modi to the Bay Area in September 2015. The company opened the program at SAP Center in front of 18,000 attendees — still one of the largest live audiences in BACDA\'s history.',
    event_date: '2015-09-27',
    venue_name: 'SAP Center, San Jose, CA',
    status: 'past',
    collaborators: ['Dalia Sen'],
  }),
  row({
    slug: 'chitra-enacte-2017',
    title: 'Chitra — EnActe collaboration',
    subtitle: "Tagore's Chitrangada, reimagined",
    description:
      "A collaboration with EnActe Arts to stage Rabindranath Tagore's *Chitrangada*. Dalia Sen choreographed the full dance arc, working closely with Odissi Guru Gayatri Joshi on the movement vocabulary. The production toured multiple Bay Area venues across 2017.",
    event_date: '2017-03-04',
    venue_name: 'Dougherty Valley High School, San Ramon, CA',
    status: 'past',
    collaborators: ['Dalia Sen', 'Gayatri Joshi', 'EnActe Arts'],
  }),
  row({
    slug: 'nabc-2017-opening',
    title: 'NABC 2017 — Opening Ceremony',
    subtitle: 'NABC, Las Vegas',
    description:
      "The opening ceremony for NABC 2017: a three-day production with over 100 dancers, a live music ensemble, and a commissioned score by Debojyoti Mishra. One of BACDA's largest-scale productions to date, and the starting point for the company's long collaboration with Mishra.",
    event_date: '2017-07-01',
    venue_name: 'Las Vegas, NV',
    status: 'past',
    collaborators: ['Dalia Sen', 'Debojyoti Mishra'],
  }),
  row({
    slug: 'nabc-2017-closing',
    title: 'NABC 2017 — Closing Ceremony',
    subtitle: 'NABC, Las Vegas',
    description:
      'The closing ceremony for NABC 2017. Soloists and ensembles who had performed throughout the three-day conference returned to the stage for a finale that threaded the festival\'s many voices into one production. Footage is still shared annually on the company\'s Facebook page.',
    event_date: '2017-07-03',
    venue_name: 'Las Vegas, NV',
    status: 'past',
    collaborators: ['Dalia Sen', 'Debojyoti Mishra'],
  }),
  row({
    slug: 'sanjib-bhattacharya-workshop',
    title: 'Dance Workshop — Sanjib Bhattacharya',
    subtitle: 'Navanritya Masterclass',
    description:
      'An intensive Navanritya ("new dance") masterclass led by Manipuri Dance Guru Sanjib Bhattacharya, hosted by BACDA for Bay Area dancers. The workshop covered the foundational Navanritya vocabulary and drew participants from multiple regional companies.',
    event_date: '2017-10-14',
    venue_name: 'Dublin, CA',
    status: 'past',
    collaborators: ['Sanjib Bhattacharya'],
  }),
  row({
    slug: 'sitar-concert-sugato-nag',
    title: 'Sitar Concert — Pt. Sugato Nag',
    subtitle: 'Classical Hindustani recital',
    description:
      'BACDA presented Pandit Sugato Nag in a classical Hindustani sitar recital, exploring evening ragas in the Maihar gharana tradition. Part of the company\'s ongoing effort to present live Indian classical music alongside dance.',
    event_date: '2018-02-24',
    venue_name: 'Dublin, CA',
    status: 'past',
    collaborators: ['Sugato Nag'],
  }),
  row({
    slug: 'raabdta-2018',
    title: 'Raabta',
    subtitle: 'Maiden BACDA production (2018)',
    description:
      "*Raabta* — \"connection\" — was BACDA's first self-branded full-length production after nearly a decade of collaborative work. An evening-length exploration of the threads that bind generations, geographies, and dance traditions. The production featured original choreography, live music, and a cast drawn from BACDA's resident dancers.",
    event_date: '2018-03-10',
    venue_name: 'San Jose, CA',
    status: 'past',
    collaborators: ['Dalia Sen'],
  }),
  row({
    slug: 'spring-india-festival',
    title: 'Spring India Festival',
    subtitle: 'Union Square, San Francisco',
    description:
      'BACDA performed at the Spring India Festival in Union Square, San Francisco — a public-outdoor showcase introducing Indian classical dance to downtown audiences. The company performed three pieces across a single afternoon.',
    event_date: '2019-04-27',
    venue_name: 'Union Square, San Francisco, CA',
    status: 'past',
    collaborators: ['Dalia Sen'],
  }),
  row({
    slug: 'folk-dance-agomoni-2019',
    title: 'Folk Dance — Agomoni Nrityamela',
    subtitle: 'Bengali folk dance showcase',
    description:
      'A folk dance showcase themed around *Agomoni* — the arrival — songs and dances heralding the Durga Puja season. BACDA assembled an ensemble of Bay Area dancers for a single evening of Bengali folk repertoire.',
    event_date: '2019-08-24',
    venue_name: 'Dougherty Valley High School, San Ramon, CA',
    status: 'past',
    collaborators: ['Dalia Sen'],
  }),
  row({
    slug: 'west-coast-theater-festival-2019',
    title: 'West Coast Theater Festival',
    subtitle: 'Two-night featured engagement',
    description:
      "BACDA was a featured performing company at the 2019 West Coast Theater Festival, presenting work on the festival's main stage across two consecutive evenings. The engagement put the company alongside other regional theater and dance companies on the festival's biggest platform.",
    event_date: '2019-08-31',
    end_date: '2019-09-01',
    venue_name: 'Amador Valley High School, Pleasanton, CA',
    status: 'past',
    collaborators: ['Dalia Sen'],
  }),
  row({
    slug: 'banga-mela-2019',
    title: 'Banga Mela 2019',
    subtitle: 'Bengali cultural festival',
    description:
      'BACDA performed at Banga Mela 2019 — a biennial Bengali cultural festival — across two days in September at Tempe Center for the Arts. The engagement featured an ensemble production and multiple soloist appearances.',
    event_date: '2019-09-07',
    end_date: '2019-09-08',
    venue_name: 'Tempe Center for the Arts, Tempe, AZ',
    status: 'past',
    collaborators: ['Dalia Sen'],
  }),
  row({
    slug: 'bodhayon-2020',
    title: 'Bodhayon — the Awakening',
    subtitle: 'Durga Puja 2020 (filmed production)',
    description:
      'Staged during Durga Puja 2020 under pandemic constraints, *Bodhayon* — "the awakening" — was a filmed dance production released online. A meditation on resilience, ritual, and the re-awakening of community through art. The full production video is one of the most-watched pieces on the company\'s YouTube channel.',
    event_date: '2020-10-24',
    venue_name: 'Bay Area (filmed production)',
    youtube_id: 'BMFBOWVmAUc',
    status: 'past',
    collaborators: ['Dalia Sen'],
  }),
  row({
    slug: 'tanushree-shankar-workshop-2023',
    title: 'Tanushree Shankar Workshop',
    subtitle: 'Masterclass with the Tanusree Shankar Dance Company',
    description:
      "BACDA hosted an intensive workshop with Tanushree Shankar, founder of the Tanusree Shankar Dance Company and one of India's most celebrated choreographers in the Uday Shankar tradition. The two-day masterclass covered ensemble composition and Shankar-lineage choreographic vocabulary.",
    event_date: '2023-02-18',
    venue_name: 'Dublin, CA',
    status: 'past',
    collaborators: ['Tanushree Shankar'],
  }),
  row({
    slug: 'mallika-sarabhai-workshop-2023',
    title: 'Mallika Sarabhai Workshop',
    subtitle: 'Masterclass, Darpana Academy (April 2023)',
    description:
      'BACDA welcomed Mallika Sarabhai — renowned Bharatanatyam and Kuchipudi dancer, co-director of Darpana Academy of Performing Arts — for a masterclass in classical repertoire and contemporary expression. Drew participants from across the Bay Area classical dance community.',
    event_date: '2023-04-15',
    venue_name: 'Dublin, CA',
    status: 'past',
    collaborators: ['Mallika Sarabhai'],
  }),
  row({
    slug: 'bacda-show-kumar-sharma-2023',
    title: 'BACDA Show with Kumar Sharma',
    subtitle: 'Kathak collaboration (2023)',
    description:
      'An evening of Kathak with guest artist Kumar Sharma, featuring both traditional thumri-based abhinaya and contemporary choreographic works. The show paired Sharma\'s solo program with BACDA ensemble pieces.',
    event_date: '2023-11-04',
    venue_name: 'Dougherty Valley High School, San Ramon, CA',
    status: 'past',
    collaborators: ['Dalia Sen', 'Kumar Sharma'],
  }),
  row({
    slug: 'kingdom-of-dreams-2025',
    title: 'Kingdom of Dreams',
    subtitle: 'Upcoming BACDA production (2025)',
    description:
      "BACDA's next full-length production — an original dance-theater work exploring the interior worlds of memory and imagination. Programming and venue details will be announced on the company's Facebook and Instagram feeds. Follow @bayareacreativedanceacademy for updates.",
    event_date: '2025-11-15',
    venue_name: 'Bay Area, CA (venue TBA)',
    status: 'past',
    collaborators: ['Dalia Sen'],
  }),
];

export function getFallbackEventBySlug(slug: string): EventRow | null {
  return FALLBACK_EVENTS.find((e) => e.slug === slug) ?? null;
}
