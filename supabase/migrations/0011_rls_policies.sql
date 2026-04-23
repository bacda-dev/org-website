-- 0011_rls_policies.sql — Row Level Security: public SELECT on content, admin (any authenticated user) writes.

-- Enable RLS on all content tables
alter table events enable row level security;
alter table event_photos enable row level security;
alter table event_videos enable row level security;
alter table testimonials enable row level security;
alter table team_members enable row level security;
alter table home_content enable row level security;
alter table gallery_videos enable row level security;
alter table instagram_highlights enable row level security;
alter table sponsors enable row level security;
alter table contact_submissions enable row level security;

-- ─────────────────────────────────────────────────────────────────────────
-- Public read access (drafts hidden on events; sponsors gated by is_active)
-- ─────────────────────────────────────────────────────────────────────────
drop policy if exists "public reads events" on events;
create policy "public reads events" on events
  for select using (status != 'draft');

drop policy if exists "public reads event_photos" on event_photos;
create policy "public reads event_photos" on event_photos for select using (true);

drop policy if exists "public reads event_videos" on event_videos;
create policy "public reads event_videos" on event_videos for select using (true);

drop policy if exists "public reads testimonials" on testimonials;
create policy "public reads testimonials" on testimonials for select using (true);

drop policy if exists "public reads team_members" on team_members;
create policy "public reads team_members" on team_members for select using (true);

drop policy if exists "public reads home_content" on home_content;
create policy "public reads home_content" on home_content for select using (true);

drop policy if exists "public reads gallery_videos" on gallery_videos;
create policy "public reads gallery_videos" on gallery_videos for select using (true);

drop policy if exists "public reads instagram_highlights" on instagram_highlights;
create policy "public reads instagram_highlights" on instagram_highlights for select using (true);

drop policy if exists "public reads sponsors" on sponsors;
create policy "public reads sponsors" on sponsors for select using (is_active = true);

-- ─────────────────────────────────────────────────────────────────────────
-- Admin writes: any authenticated user is admin (single-role model per PRD §5.5)
-- ─────────────────────────────────────────────────────────────────────────
drop policy if exists "admin writes events" on events;
create policy "admin writes events" on events
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin writes event_photos" on event_photos;
create policy "admin writes event_photos" on event_photos
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin writes event_videos" on event_videos;
create policy "admin writes event_videos" on event_videos
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin writes testimonials" on testimonials;
create policy "admin writes testimonials" on testimonials
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin writes team_members" on team_members;
create policy "admin writes team_members" on team_members
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin writes home_content" on home_content;
create policy "admin writes home_content" on home_content
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin writes gallery_videos" on gallery_videos;
create policy "admin writes gallery_videos" on gallery_videos
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin writes instagram_highlights" on instagram_highlights;
create policy "admin writes instagram_highlights" on instagram_highlights
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin writes sponsors" on sponsors;
create policy "admin writes sponsors" on sponsors
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─────────────────────────────────────────────────────────────────────────
-- Contact submissions: public can INSERT, only admins can read
-- ─────────────────────────────────────────────────────────────────────────
drop policy if exists "anyone submits contact" on contact_submissions;
create policy "anyone submits contact" on contact_submissions
  for insert with check (true);

drop policy if exists "admin reads contact" on contact_submissions;
create policy "admin reads contact" on contact_submissions
  for select using (auth.role() = 'authenticated');

drop policy if exists "admin deletes contact" on contact_submissions;
create policy "admin deletes contact" on contact_submissions
  for delete using (auth.role() = 'authenticated');
