-- Run after 001 if create:admin / setup says "permission denied" or "table missing".
-- Tables can exist in the UI but still block the API without these grants.

grant usage on schema public to postgres, anon, authenticated, service_role;

grant select on table public.pam_africa_journals to anon, authenticated;
grant insert, update, delete on table public.pam_africa_journals to service_role;
grant select on table public.pam_africa_journals to service_role;

grant all on table public.pam_africa_users to service_role;

alter table public.pam_africa_journals enable row level security;
alter table public.pam_africa_users enable row level security;
