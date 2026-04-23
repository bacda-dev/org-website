-- 0012_storage_buckets.sql — Create gallery/posters/private storage buckets + access policies.

-- Three buckets per PRD §5.4
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('posters', 'posters', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('private', 'private', false)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────────────────
-- Public read on gallery + posters; admin (authenticated) write/delete on all.
-- ─────────────────────────────────────────────────────────────────────────
drop policy if exists "public read gallery" on storage.objects;
create policy "public read gallery" on storage.objects
  for select using (bucket_id = 'gallery');

drop policy if exists "public read posters" on storage.objects;
create policy "public read posters" on storage.objects
  for select using (bucket_id = 'posters');

drop policy if exists "admin read private" on storage.objects;
create policy "admin read private" on storage.objects
  for select using (bucket_id = 'private' and auth.role() = 'authenticated');

drop policy if exists "admin writes gallery" on storage.objects;
create policy "admin writes gallery" on storage.objects
  for insert with check (bucket_id = 'gallery' and auth.role() = 'authenticated');

drop policy if exists "admin updates gallery" on storage.objects;
create policy "admin updates gallery" on storage.objects
  for update using (bucket_id = 'gallery' and auth.role() = 'authenticated')
  with check (bucket_id = 'gallery' and auth.role() = 'authenticated');

drop policy if exists "admin deletes gallery" on storage.objects;
create policy "admin deletes gallery" on storage.objects
  for delete using (bucket_id = 'gallery' and auth.role() = 'authenticated');

drop policy if exists "admin writes posters" on storage.objects;
create policy "admin writes posters" on storage.objects
  for insert with check (bucket_id = 'posters' and auth.role() = 'authenticated');

drop policy if exists "admin updates posters" on storage.objects;
create policy "admin updates posters" on storage.objects
  for update using (bucket_id = 'posters' and auth.role() = 'authenticated')
  with check (bucket_id = 'posters' and auth.role() = 'authenticated');

drop policy if exists "admin deletes posters" on storage.objects;
create policy "admin deletes posters" on storage.objects
  for delete using (bucket_id = 'posters' and auth.role() = 'authenticated');

drop policy if exists "admin writes private" on storage.objects;
create policy "admin writes private" on storage.objects
  for insert with check (bucket_id = 'private' and auth.role() = 'authenticated');

drop policy if exists "admin updates private" on storage.objects;
create policy "admin updates private" on storage.objects
  for update using (bucket_id = 'private' and auth.role() = 'authenticated')
  with check (bucket_id = 'private' and auth.role() = 'authenticated');

drop policy if exists "admin deletes private" on storage.objects;
create policy "admin deletes private" on storage.objects
  for delete using (bucket_id = 'private' and auth.role() = 'authenticated');
