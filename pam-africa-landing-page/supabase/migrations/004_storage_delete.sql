-- Explicit storage access for API (service_role) — fixes delete failures on migrated sanity/* files

drop policy if exists "pam_africa_service_role_journal_media" on storage.objects;
create policy "pam_africa_service_role_journal_media"
on storage.objects
for all
to service_role
using (bucket_id = 'pam-africa-journal-media')
with check (bucket_id = 'pam-africa-journal-media');
