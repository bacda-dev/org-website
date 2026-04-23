-- 0009_sponsors.sql — Admin-managed sponsors. Ships empty; admin adds entries via /admin/sponsors.

create table if not exists sponsors (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  logo_url    text,
  website_url text,
  sort_order  int default 0,
  is_active   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists sponsors_active_idx on sponsors(is_active, sort_order);
