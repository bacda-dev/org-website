-- 0008_instagram_highlights.sql — Admin-curated Instagram post highlights (manual URL paste + oEmbed fetch).

create table if not exists instagram_highlights (
  id            uuid primary key default gen_random_uuid(),
  post_url      text not null unique,
  caption       text,
  thumbnail_url text,          -- fetched via oEmbed at save time
  author        text,
  posted_at     timestamptz,
  sort_order    int default 0,
  is_featured   boolean default false,
  created_at    timestamptz default now()
);
