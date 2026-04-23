-- 0006_home_content.sql — Singleton row with hero copy, mission statement, donate URL.

create table if not exists home_content (
  id                uuid primary key default gen_random_uuid(),
  singleton_key     text unique default 'home' check (singleton_key = 'home'),
  hero_headline     text not null,
  hero_subheadline  text,
  hero_image_url    text,
  hero_video_url    text, -- optional background video
  featured_event_id uuid references events(id),
  mission_statement text,
  donate_url        text, -- admin-editable; button hidden when empty
  updated_at        timestamptz default now()
);

-- Seed the singleton row. Real content populated by seed.sql later.
insert into home_content (hero_headline, hero_subheadline)
values ('Bay Area Creative Dancers', 'Foster the Love of Dance')
on conflict (singleton_key) do nothing;
