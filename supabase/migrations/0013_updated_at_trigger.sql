-- 0013_updated_at_trigger.sql — Generic trigger to auto-bump updated_at columns.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists events_set_updated_at on events;
create trigger events_set_updated_at
  before update on events
  for each row execute function public.set_updated_at();

drop trigger if exists testimonials_set_updated_at on testimonials;
create trigger testimonials_set_updated_at
  before update on testimonials
  for each row execute function public.set_updated_at();

drop trigger if exists team_members_set_updated_at on team_members;
create trigger team_members_set_updated_at
  before update on team_members
  for each row execute function public.set_updated_at();

drop trigger if exists home_content_set_updated_at on home_content;
create trigger home_content_set_updated_at
  before update on home_content
  for each row execute function public.set_updated_at();

drop trigger if exists sponsors_set_updated_at on sponsors;
create trigger sponsors_set_updated_at
  before update on sponsors
  for each row execute function public.set_updated_at();
