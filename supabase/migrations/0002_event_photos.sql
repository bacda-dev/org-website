-- 0002_event_photos.sql — Photo gallery entries linked to events.

create table if not exists event_photos (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid not null references events(id) on delete cascade,
  storage_path text not null, -- path in Supabase Storage bucket 'gallery'
  caption      text,
  sort_order   int default 0,
  created_at   timestamptz default now()
);

create index if not exists event_photos_event_idx on event_photos(event_id, sort_order);
