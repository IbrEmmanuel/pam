-- PAM Africa — Supabase tables (public schema)
-- Names: pam_africa_* so they are easy to find in the dashboard.
-- Auth: our JWT + password hashes (not Supabase Auth).
-- Run once in Supabase → SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.pam_africa_journals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default 'General',
  excerpt text not null default '',
  body text not null default '',
  subtext text,
  cover_url text,
  gallery_urls text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pam_africa_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  reset_token_hash text,
  reset_token_expires timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.pam_africa_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pam_africa_journals_updated_at on public.pam_africa_journals;
create trigger pam_africa_journals_updated_at
before update on public.pam_africa_journals
for each row
execute function public.pam_africa_set_updated_at();

drop trigger if exists pam_africa_users_updated_at on public.pam_africa_users;
create trigger pam_africa_users_updated_at
before update on public.pam_africa_users
for each row
execute function public.pam_africa_set_updated_at();

alter table public.pam_africa_journals enable row level security;
alter table public.pam_africa_users enable row level security;

drop policy if exists "pam_africa_public_read_published_journals" on public.pam_africa_journals;
create policy "pam_africa_public_read_published_journals"
on public.pam_africa_journals
for select
using (status = 'published');

-- pam_africa_users: no public policies. Server uses service_role only.

insert into storage.buckets (id, name, public)
values ('pam-africa-journal-media', 'pam-africa-journal-media', true)
on conflict (id) do update set public = true;

drop policy if exists "pam_africa_public_read_journal_media" on storage.objects;
create policy "pam_africa_public_read_journal_media"
on storage.objects
for select
using (bucket_id = 'pam-africa-journal-media');

-- API roles (required for Next.js + service_role key)
grant usage on schema public to postgres, anon, authenticated, service_role;
grant select on table public.pam_africa_journals to anon, authenticated;
grant insert, update, delete, select on table public.pam_africa_journals to service_role;
grant all on table public.pam_africa_users to service_role;
