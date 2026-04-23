-- 0003_event_videos.sql — YouTube videos associated with a specific event (admin-curated).

create table if not exists event_videos (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid references events(id) on delete cascade,
  youtube_id text not null,
  title      text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create index if not exists event_videos_event_idx on event_videos(event_id, sort_order);
