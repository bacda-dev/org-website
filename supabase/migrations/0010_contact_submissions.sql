-- 0010_contact_submissions.sql — Public contact-form submissions (admin-read only).

create table if not exists contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text,
  message    text not null,
  ip_address inet,
  user_agent text,
  created_at timestamptz default now()
);

create index if not exists contact_submissions_created_idx on contact_submissions(created_at desc);
