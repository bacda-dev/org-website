-- 0004_testimonials.sql — Endorsements from collaborating artists (Tanushree Shankar, etc.).

create table if not exists testimonials (
  id               uuid primary key default gen_random_uuid(),
  quote            text not null,
  author_name      text not null,
  author_title     text,
  author_photo_url text,
  is_featured      boolean default false, -- show on home
  sort_order       int default 0,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);
