-- Admin roles + invites (run in Supabase SQL editor)

alter table public.pam_africa_users
  add column if not exists role text not null default 'admin'
    check (role in ('super_admin', 'admin'));

alter table public.pam_africa_users
  add column if not exists invite_token_hash text;

alter table public.pam_africa_users
  add column if not exists invite_expires timestamptz;

update public.pam_africa_users
set role = 'super_admin'
where lower(email) = lower('support@pamafrica.com');

grant all on table public.pam_africa_users to service_role;
