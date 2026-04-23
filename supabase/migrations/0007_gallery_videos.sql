-- 0007_gallery_videos.sql — Standalone YouTube highlights for /gallery (not tied to an event).

create table if not exists gallery_videos (
  id          uuid primary key default gen_random_uuid(),
  youtube_id  text not null unique,
  title       text,
  description text,
  sort_order  int default 0,
  created_at  timestamptz default now()
);
