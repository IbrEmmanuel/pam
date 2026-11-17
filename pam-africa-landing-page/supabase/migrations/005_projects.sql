-- PAM Africa — Projects CMS (mirrors journals pattern)
-- Run in Supabase → SQL Editor after 001–004.

create table if not exists public.pam_africa_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  year text not null default '',
  blurb text not null default '',
  cover_url text,
  gallery_urls text[] not null default '{}',
  info text not null default '',
  project_type text not null default 'Energy',
  featured boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists pam_africa_projects_updated_at on public.pam_africa_projects;
create trigger pam_africa_projects_updated_at
before update on public.pam_africa_projects
for each row
execute function public.pam_africa_set_updated_at();

alter table public.pam_africa_projects enable row level security;

drop policy if exists "pam_africa_public_read_published_projects" on public.pam_africa_projects;
create policy "pam_africa_public_read_published_projects"
on public.pam_africa_projects
for select
using (status = 'published');

grant select on table public.pam_africa_projects to anon, authenticated;
grant insert, update, delete, select on table public.pam_africa_projects to service_role;

-- Public site falls back to src/constants/projects.ts until rows exist.
-- Create/publish projects from /admin/projects (same flow as journals).
