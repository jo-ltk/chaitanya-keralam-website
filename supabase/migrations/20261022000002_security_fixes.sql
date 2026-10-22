-- Migration: security_fixes + settings table + storage bucket
-- Apply via: supabase db push  OR paste into Supabase SQL editor

-- 1. site_settings table
create table if not exists public.site_settings (
  key   text primary key,
  value text not null default ''
);
insert into public.site_settings (key, value) values
  ('req2fa','false'),('timeout','30'),('invite','48'),('domains','')
on conflict (key) do nothing;
alter table public.site_settings enable row level security;
drop policy if exists "Super Admins can manage settings" on public.site_settings;
create policy "Super Admins can manage settings"
  on public.site_settings for all
  using (public.current_user_role() = 'super');

-- 2. enquiries.id default  (was text primary key with no default)
alter table public.enquiries alter column id set default gen_random_uuid()::text;

-- 3. Extend enquiries.type check to include action-layer values
-- submitEnquiryAction sends: admission, tesh, partner, contact
-- Schema had:                programme, tesh, partnership, general
alter table public.enquiries drop constraint if exists enquiries_type_check;
alter table public.enquiries
  add constraint enquiries_type_check
  check (type in ('admission','programme','tesh','partner','partnership','contact','general'));

-- 4. Tighten media RLS: remove anon-readable policy
drop policy if exists "Public can view media records" on public.media;
create policy "Authenticated admins can view media records"
  on public.media for select
  using (public.is_admin());

-- 5. Fix page_sections write RLS: explicit WITH CHECK
drop policy if exists "Editors and Super Admins can modify page sections" on public.page_sections;
create policy "Editors and Super Admins can modify page sections"
  on public.page_sections for all
  using (public.current_user_role() in ('super', 'editor'))
  with check (public.current_user_role() in ('super', 'editor'));

-- 6. Create site-media storage bucket (idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media','site-media',true,5242880,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "Public can read site-media" on storage.objects;
create policy "Public can read site-media"
  on storage.objects for select
  using (bucket_id = 'site-media');

drop policy if exists "Admins can upload to site-media" on storage.objects;
create policy "Admins can upload to site-media"
  on storage.objects for insert
  with check (bucket_id = 'site-media' and public.current_user_role() in ('super','editor'));

drop policy if exists "Admins can delete from site-media" on storage.objects;
create policy "Admins can delete from site-media"
  on storage.objects for delete
  using (bucket_id = 'site-media' and public.current_user_role() in ('super','editor'));
