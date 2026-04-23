-- 0005_team_members.sql — Artistic director + coordinators shown on /about.

create table if not exists team_members (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text not null, -- e.g., "Artistic Director", "Choreographer"
  bio        text,
  photo_url  text,
  credits    text[], -- array of production credits
  is_lead    boolean default false, -- e.g., Dalia Sen
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
