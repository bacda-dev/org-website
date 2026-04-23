-- 0001_events.sql — Events table (productions, workshops, ceremonies) + indexes.

create table if not exists events (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  subtitle      text,
  description   text, -- markdown
  event_date    date not null,
  end_date      date, -- for multi-day events
  venue_name    text,
  venue_address text,
  venue_map_url text,
  poster_url    text, -- Supabase Storage URL
  youtube_id    text, -- single featured video
  ticket_url    text, -- external ticketing link
  ticket_cta    text default 'Get Tickets',
  status        text not null check (status in ('upcoming', 'past', 'draft')),
  is_featured   boolean default false, -- featured on home
  year          int generated always as (extract(year from event_date)) stored,
  collaborators text[], -- array of names
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists events_status_idx on events(status);
create index if not exists events_year_idx on events(year desc);
create index if not exists events_slug_idx on events(slug);
