-- seed.sql — BACDA content seed (past events, upcoming KoD 2025, team, testimonials, home, gallery videos).
-- Idempotent via ON CONFLICT on slugs/unique keys. Safe to run on `supabase db reset`.
-- Source: PRD Appendix B (page 60). Sponsors + instagram_highlights + contact_submissions
-- are intentionally NOT seeded.

-- ─────────────────────────────────────────────────────────────────────────
-- PAST EVENTS
-- ─────────────────────────────────────────────────────────────────────────
insert into events (slug, title, subtitle, description, event_date, venue_name, poster_url, status, collaborators)
values
  (
    'tasher-desh',
    'Tasher Desh',
    'BACDA''s First Production',
    E'BACDA''s inaugural production — a dance-theater adaptation of Rabindranath Tagore''s *Tasher Desh* (Land of Cards). Blending classical Indian dance forms with Tagore''s lyrical allegory, this debut signaled the company''s intent to treat dance as narrative theater rather than mere spectacle.',
    '2008-10-18',
    'Bay Area, CA',
    'events/tasher-desh/poster.jpg',
    'past',
    array['Dalia Sen']
  ),
  (
    'nabc-2009-opening',
    'NABC 2009 Opening Ceremony',
    'North American Bengali Conference — Opening Gala',
    E'BACDA choreographed and produced the opening ceremony for the 2009 North American Bengali Conference, the largest annual gathering of the Bengali diaspora in North America. A multi-tier cast of regional dancers showcased Bengal''s classical-to-folk continuum to an audience of several thousand.',
    '2009-07-04',
    'Dublin High School, Dublin, CA',
    'events/nabc-2009-opening/poster.jpg',
    'past',
    array['Dalia Sen']
  ),
  (
    'nabc-2012-closing',
    'NABC 2012 Closing Ceremony',
    'Las Vegas',
    E'Closing ceremony of the 2012 North American Bengali Conference in Las Vegas. BACDA presented a finale piece that wove together Manipuri, Kathak, and contemporary vocabularies. Featured collaboration with Manipuri Dance Guru Sanjib Bhattacharya.',
    '2012-07-07',
    'Las Vegas, NV',
    'events/nabc-2012-closing/poster.jpg',
    'past',
    array['Dalia Sen', 'Sanjib Bhattacharya']
  ),
  (
    'omg-2014',
    'OMG — Oh My God!',
    'Dance Theater Production (2014)',
    E'A full-length dance theater production exploring faith, doubt, and the sacred in modern life. BACDA''s first fully-staged narrative work after NABC 2012.',
    '2014-05-17',
    'Dougherty Valley High School, San Ramon, CA',
    'events/omg-2014/poster.jpg',
    'past',
    array['Dalia Sen']
  ),
  (
    'kalamahotsav-2014',
    'Kalamahotsav 2014 Opening Ceremony',
    'Festival of Arts — Opening',
    E'BACDA choreographed the opening ceremony of Kalamahotsav 2014, a Bay Area festival of Indian classical and folk arts. Multiple ensemble pieces spanning Odissi, Bharatanatyam, and Bengali folk traditions.',
    '2014-09-13',
    'Amador Valley High School, Pleasanton, CA',
    'events/kalamahotsav-2014/poster.jpg',
    'past',
    array['Dalia Sen']
  ),
  (
    'chirosokha-2015',
    'Chirosokha — Durga Pujo 2015',
    'Durga Puja Festival Production',
    E'A festive production staged for the Durga Puja celebrations in 2015. *Chirosokha* — "eternal friend" — explored the relationship between the goddess and her devotees through classical and folk dance idioms.',
    '2015-10-17',
    'Dublin High School, Dublin, CA',
    'events/chirosokha-2015/poster.jpg',
    'past',
    array['Dalia Sen']
  ),
  (
    'pm-modi-inaugural-2015',
    'PM Modi Bay Area Inaugural Show',
    'Prime Minister of India — SAP Center Reception',
    E'BACDA was invited to perform at the inaugural show welcoming Prime Minister Narendra Modi to the Bay Area in September 2015. The company opened the program at the SAP Center in front of 18,000 attendees.',
    '2015-09-27',
    'SAP Center, San Jose, CA',
    'events/pm-modi-inaugural-2015/poster.jpg',
    'past',
    array['Dalia Sen']
  ),
  (
    'chitra-enacte-2017',
    'Chitra — EnActe Collaboration',
    'Tagore''s Chitrangada re-imagined',
    E'A collaboration with EnActe Arts to stage Rabindranath Tagore''s *Chitrangada*. Dalia Sen choreographed the full dance arc, working closely with Odissi Guru Gayatri Joshi on the movement vocabulary.',
    '2017-03-04',
    'Dougherty Valley High School, San Ramon, CA',
    'events/chitra-enacte-2017/poster.jpg',
    'past',
    array['Dalia Sen', 'Gayatri Joshi', 'EnActe Arts']
  ),
  (
    'nabc-2017-opening',
    'NABC 2017 Opening Ceremony',
    'North American Bengali Conference — Opening',
    E'The opening ceremony for NABC 2017, a three-day-long production with over 100 dancers, live musicians, and a commissioned score by Debojyoti Mishra. One of BACDA''s largest-scale productions to date.',
    '2017-07-01',
    'Las Vegas, NV',
    'events/nabc-2017-opening/poster.jpg',
    'past',
    array['Dalia Sen', 'Debojyoti Mishra']
  ),
  (
    'nabc-2017-closing',
    'NABC 2017 Closing Ceremony',
    'North American Bengali Conference — Closing Gala',
    E'The closing ceremony for NABC 2017. A finale bringing together soloists and ensembles that had performed throughout the three-day conference.',
    '2017-07-03',
    'Las Vegas, NV',
    'events/nabc-2017-closing/poster.jpg',
    'past',
    array['Dalia Sen', 'Debojyoti Mishra']
  ),
  (
    'sanjib-bhattacharya-workshop',
    'Dance Workshop — Sanjib Bhattacharya',
    'Navanritya Masterclass',
    E'An intensive Navanritya (New Dance) masterclass led by Manipuri Dance Guru Sanjib Bhattacharya, hosted by BACDA for Bay Area dancers.',
    '2017-10-14',
    'Dublin, CA',
    'events/sanjib-bhattacharya-workshop/poster.jpg',
    'past',
    array['Sanjib Bhattacharya']
  ),
  (
    'sitar-concert-sugato-nag',
    'Sitar Concert — Pt. Sugato Nag',
    'Classical Hindustani Sitar Recital',
    E'BACDA presented Pandit Sugato Nag in a classical Hindustani sitar recital, exploring evening ragas in the Maihar gharana tradition.',
    '2018-02-24',
    'Dublin, CA',
    'events/sitar-concert-sugato-nag/poster.jpg',
    'past',
    array['Sugato Nag']
  ),
  (
    'raabdta-2018',  -- slug retained for stable URLs; display name is "Raabta"
    'Raabta',
    'Maiden BACDA Production (2018)',
    E'*Raabta* — "connection" — was BACDA''s first self-branded full-length production after years of collaboration work. An evening-length exploration of the threads that bind generations, geographies, and dance traditions.',
    '2018-03-10',
    'San Jose, CA',
    'events/raabdta-2018/poster.jpg',
    'past',
    array['Dalia Sen']
  ),
  (
    'spring-india-festival',
    'Spring India Festival',
    'Union Square, San Francisco',
    E'BACDA performed at the Spring India Festival in Union Square, San Francisco — a public-outdoor showcase introducing Indian classical dance to downtown audiences.',
    '2019-04-27',
    'Union Square, San Francisco, CA',
    'events/spring-india-festival/poster.jpg',
    'past',
    array['Dalia Sen']
  ),
  (
    'folk-dance-agomoni-2019',
    'Folk Dance — Agomoni Nrityamela',
    'Bengali Folk Dance Showcase',
    E'A folk dance showcase themed around *Agomoni* (the arrival) — songs and dances heralding the Durga Puja season, with an ensemble of Bay Area dancers.',
    '2019-08-24',
    'Dougherty Valley High School, San Ramon, CA',
    'events/folk-dance-agomoni-2019/poster.jpg',
    'past',
    array['Dalia Sen']
  ),
  (
    'west-coast-theater-festival-2019',
    'West Coast Theater Festival',
    'Multi-night theater festival (Aug 31 – Sep 1, 2019)',
    E'BACDA was a featured performing company at the 2019 West Coast Theater Festival, presenting work on the festival''s main stage across two consecutive evenings.',
    '2019-08-31',
    'Amador Valley High School, Pleasanton, CA',
    'events/west-coast-theater-festival-2019/poster.jpg',
    'past',
    array['Dalia Sen']
  ),
  (
    'banga-mela-2019',
    'Banga Mela 2019',
    'Bengali Cultural Festival',
    E'BACDA performed at Banga Mela 2019 — a biennial Bengali cultural festival — over two days (Sept 7–8) at Tempe Center for the Arts.',
    '2019-09-07',
    'Tempe Center for the Arts, Tempe, AZ',
    'events/banga-mela-2019/poster.jpg',
    'past',
    array['Dalia Sen']
  ),
  (
    'bodhayon-2020',
    'Bodhayon — the Awakening',
    'Durga Puja 2020 Production',
    E'Staged during Durga Puja 2020 under pandemic constraints, *Bodhayon* — "the awakening" — was a filmed dance production released online. A meditation on resilience, ritual, and the re-awakening of community through art.',
    '2020-10-24',
    'Bay Area (Filmed Production)',
    'events/bodhayon-2020/poster.jpg',
    'past',
    array['Dalia Sen']
  ),
  (
    'tanushree-shankar-workshop-2023',
    'Tanushree Shankar Workshop',
    'Masterclass with the Tanusree Shankar Dance Company',
    E'BACDA hosted an intensive workshop with Tanushree Shankar, founder of the Tanusree Shankar Dance Company and one of India''s most celebrated choreographers in the Uday Shankar tradition.',
    '2023-02-18',
    'Dublin, CA',
    'events/tanushree-shankar-workshop-2023/poster.jpg',
    'past',
    array['Tanushree Shankar']
  ),
  (
    'mallika-sarabhai-workshop-2023',
    'Mallika Sarabhai Workshop',
    'Masterclass with Darpana Academy (April 2023)',
    E'BACDA welcomed Mallika Sarabhai, renowned Bharatanatyam and Kuchipudi dancer and co-director of Darpana Academy of Performing Arts, for a masterclass in classical repertoire and contemporary expression.',
    '2023-04-15',
    'Dublin, CA',
    'events/mallika-sarabhai-workshop-2023/poster.jpg',
    'past',
    array['Mallika Sarabhai']
  ),
  (
    'bacda-show-kumar-sharma-2023',
    'BACDA Show with Kumar Sharma',
    'Kathak Collaboration (2023)',
    E'BACDA presented an evening of Kathak with guest artist Kumar Sharma, featuring both traditional thumri-based abhinaya and contemporary choreographic works.',
    '2023-11-04',
    'Dougherty Valley High School, San Ramon, CA',
    'events/bacda-show-kumar-sharma-2023/poster.jpg',
    'past',
    array['Dalia Sen', 'Kumar Sharma']
  )
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────────────────────────────────
-- UPCOMING EVENT
-- ─────────────────────────────────────────────────────────────────────────
insert into events (slug, title, subtitle, description, event_date, venue_name, poster_url, ticket_url, ticket_cta, status, is_featured, collaborators)
values (
  'kingdom-of-dreams-2025',
  'Kingdom Of Dreams',
  'BACDA''s 2025 Production',
  E'BACDA''s 2025 production — *Kingdom Of Dreams* — a full-length dance theater work. Tickets via Tugoz. Venue and final date to be confirmed by the production team.',
  '2025-09-15',
  'Bay Area, CA (venue TBA)',
  'events/kingdom-of-dreams-2025/poster.jpg',
  'https://tugoz.com/bacda2025',
  'Buy Tickets',
  'upcoming',
  true,
  array['Dalia Sen']
)
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────────────────────────────────
-- TEAM MEMBERS
-- ─────────────────────────────────────────────────────────────────────────
-- Clear + reinsert so the seed is idempotent against an already-seeded DB.
delete from team_members where name in ('Dalia Sen','Urmi Dutta','Dalia Chatterjee Sen','Ishita Sinha');
insert into team_members (name, role, bio, photo_url, credits, is_lead, sort_order)
values
  (
    'Dalia Sen',
    'Artistic Director',
    E'Dalia Sen is the founder and artistic director of Bay Area Creative Dance Academy. Over two decades she has choreographed and staged productions ranging from intimate ensemble work to ceremonies for audiences of tens of thousands — including the NABC 2009, 2012 and 2017 opening/closing ceremonies, the PM Modi Bay Area inaugural show at SAP Center (2015), Kalamahotsav (2014/2015), *Chitra* in collaboration with EnActe Arts (2017), and BACDA''s own musical productions *Raabta* (2018), *Bodhayon* (2020), *Ehsaas*, and *Kingdom of Dreams* (2025). Her practice braids classical, contemporary, and folk Indian dance into narrative theater.',
    'team/dalia-sen.jpg',
    array['NABC 2009','NABC 2012','NABC 2017','Chitra/EnActe 2017','Kalamahotsav 2014/2015','PM Modi Opening 2015','Raabta 2018','Bodhayon 2020','Kingdom of Dreams 2025'],
    true,
    0
  ),
  ('Urmi Dutta', 'Coordinator', null, null, null, false, 10),
  ('Dalia Chatterjee Sen', 'Coordinator', null, null, null, false, 20),
  ('Ishita Sinha', 'Coordinator', null, null, null, false, 30);

-- ─────────────────────────────────────────────────────────────────────────
-- TESTIMONIALS
-- ─────────────────────────────────────────────────────────────────────────
delete from testimonials where author_name in ('Tanushree Shankar','Debojyoti Mishra','Gayatri Joshi','Sanjib Bhattacharya');
insert into testimonials (quote, author_name, author_title, author_photo_url, is_featured, sort_order)
values
  (
    E'I have worked with Dalia and the BACDA team on multiple occasions, and each time I have been struck by their dedication, meticulous planning, and genuine love for the art form. They bring a rare combination of artistic vision and organisational rigour — a reminder of what a diaspora dance company can achieve when it is built on real passion.',
    'Tanushree Shankar',
    'Choreographer & Artistic Director, Tanusree Shankar Dance Company',
    'testimonials/tanushree-shankar.jpg',
    true,
    0
  ),
  (
    E'Collaborating with Dalia on NABC 2017 was a joy. She brings a rare spontaneity to the rehearsal room and, at the same time, a methodical approach that keeps a large cast aligned. The result is work that feels both alive and thoroughly rehearsed — not an easy balance to strike.',
    'Debojyoti Mishra',
    'Musician, Composer & Arranger',
    'testimonials/debojyoti-mishra.jpg',
    true,
    10
  ),
  (
    E'Working on *Chitra* with BACDA was a genuine pleasure. Dalia''s organising skills and her professionalism stood out — every rehearsal ran on time, every dancer knew their material, and the production values matched what you would expect from a touring professional company.',
    'Gayatri Joshi',
    'Odissi Dance Guru',
    'testimonials/gayatri-joshi.jpg',
    true,
    20
  ),
  (
    E'From NABC 2012 onwards, Dalia has been, in my view, a glorious cultural ambassador for Indian dance in America. She has the vision to choose material worth staging and the patience to bring it to fruition — two qualities that rarely live in the same artist.',
    'Sanjib Bhattacharya',
    'Manipuri Dance Guru',
    'testimonials/sanjib-bhattacharya.jpg',
    false,
    30
  );

-- ─────────────────────────────────────────────────────────────────────────
-- HOME CONTENT (upsert the singleton row seeded in migration 0006)
-- ─────────────────────────────────────────────────────────────────────────
update home_content
set
  hero_headline    = 'Foster the Love of Dance',
  hero_subheadline = 'Classical, contemporary, and fusion Indian dance productions from Bay Area Creative Dancers — a non-profit dedicated to passing on dance to generations to come.',
  hero_image_url   = null,
  featured_event_id = (select id from events where slug = 'kingdom-of-dreams-2025' limit 1),
  mission_statement = E'We are **Bay Area Creative Dancers** — a non-profit organization formed by individuals passionate about traditional, classical and contemporary dance and dedicated to passing on the love for this art form to generations to come.\n\n**B is for Bridge.** We fuse traditional Indian dance with modern forms — bridging geographies, generations, and genders.\n\n**A is for Alive.** We introduce Indian dance customs to new audiences, keeping the culture alive for the next generation.\n\n**C is for Cherish.** We cherish all forms of dance, both classical and modern, and use dance to unite people across communities.\n\n**D is for Dance.** We revere dance as an ancient art form integral to the human experience — to movement, to storytelling, and to joy.',
  donate_url        = null
where singleton_key = 'home';

-- ─────────────────────────────────────────────────────────────────────────
-- GALLERY VIDEOS (standalone YouTube highlights, legacy IDs)
-- ─────────────────────────────────────────────────────────────────────────
insert into gallery_videos (youtube_id, title, description, sort_order)
values
  ('KWzwSzxBUis', 'BACDA featured',              null,                                                                              0),
  ('LDdBAEWIfh4', 'Tanushree Shankar Workshop',  null,                                                                             10),
  ('BMFBOWVmAUc', 'Bodhayon',                    'A BACDA original musical production — filmed during Durga Puja 2020.',          20),
  ('aX0ykUf-g0k', 'Performance',                 null,                                                                             30),
  ('R4Bkme6VYk8', 'Tasher Desh',                 null,                                                                             40)
on conflict (youtube_id) do update set
  title       = excluded.title,
  description = excluded.description,
  sort_order  = excluded.sort_order;
