-- Schema migration for Chaitanya Keralam website & admin panel

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('super', 'editor', 'enquiry')),
  status text not null check (status in ('active', 'invited', 'suspended')) default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. PAGES
create table if not exists public.pages (
  id text primary key,
  name text not null,
  path text not null,
  status text not null check (status in ('pub', 'draft', 'unpub', 'review')) default 'pub',
  updated_at timestamptz not null default now(),
  updated_by text not null default 'System'
);

-- 3. PAGE SECTIONS
create table if not exists public.page_sections (
  id text primary key,
  page_id text not null references public.pages(id) on delete cascade,
  section_id text not null,
  name text not null,
  title text not null default '',
  subtitle text not null default '',
  body text not null default '',
  cta text not null default '',
  cta_href text not null default '',
  images jsonb not null default '[]'::jsonb,
  is_carousel boolean not null default false,
  is_hidden boolean not null default false,
  order_index integer not null default 0,
  draft_content jsonb default null,
  published_content jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  updated_at timestamptz not null default now()
);

-- 4. CAROUSEL SLIDES
create table if not exists public.carousel_slides (
  id text primary key,
  kicker text not null default '',
  title text not null default '',
  cap text not null default '',
  left_text text not null default '',
  right_text text not null default '',
  cta text not null default '',
  href text not null default '',
  alt text not null default '',
  en boolean not null default true,
  fx numeric not null default 50,
  fy numeric not null default 50,
  file text not null default '',
  order_index integer not null default 0,
  status text not null check (status in ('pub', 'draft')) default 'pub',
  updated_at timestamptz not null default now()
);

-- 5. MEDIA
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  filename text not null,
  alt text not null,
  credit text not null,
  category text not null default 'general',
  mime_type text not null default 'image/jpeg',
  size_bytes bigint not null default 0,
  created_at timestamptz not null default now(),
  created_by text not null default 'System'
);

-- 6. PROGRAMMES
create table if not exists public.programmes (
  id text primary key,
  name text not null,
  tagline text not null default '',
  duration text not null default '',
  hours text not null default '',
  eligibility text not null default '',
  description text not null default '',
  summary text not null default '',
  learning_areas jsonb not null default '[]'::jsonb,
  curriculum jsonb not null default '[]'::jsonb,
  outcomes jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  status text not null check (status in ('pub', 'draft', 'review')) default 'pub',
  order_index integer not null default 0,
  updated_at timestamptz not null default now()
);

-- 7. ANNOUNCEMENTS
create table if not exists public.announcements (
  id text primary key,
  title text not null,
  date text not null,
  body text not null,
  category text not null default 'General',
  status text not null check (status in ('pub', 'draft', 'archived')) default 'pub',
  order_index integer not null default 0,
  updated_at timestamptz not null default now()
);

-- 8. ENQUIRIES
create table if not exists public.enquiries (
  id text primary key,
  type text not null check (type in ('programme', 'tesh', 'partnership', 'general')),
  sub_type text not null default '',
  name text not null,
  email text not null,
  phone text not null default '',
  district text not null default '',
  message text not null default '',
  status text not null check (status in ('new', 'contacted', 'progress', 'completed', 'archived')) default 'new',
  notes text not null default '',
  consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9. INVITATIONS
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null check (role in ('super', 'editor', 'enquiry')),
  token text not null unique,
  invited_by text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

-- 10. ACTIVITY LOG
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  item text not null,
  by_user text not null,
  role text not null,
  details text not null default '',
  created_at timestamptz not null default now()
);

-- GRANT PERMISSIONS TO SUPABASE ROLES
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on routines to anon, authenticated, service_role;

-- HELPER FUNCTIONS FOR RLS
create or replace function public.current_user_role()
returns text as $$
  select role from public.profiles where id = auth.uid() and status = 'active' limit 1;
$$ language sql security definer stable;

create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and status = 'active'
  );
$$ language sql security definer stable;

-- ENABLE ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.carousel_slides enable row level security;
alter table public.media enable row level security;
alter table public.programmes enable row level security;
alter table public.announcements enable row level security;
alter table public.enquiries enable row level security;
alter table public.invitations enable row level security;
alter table public.activity_log enable row level security;

-- PROFILES POLICIES
drop policy if exists "Super admin has full access to profiles" on public.profiles;
create policy "Super admin has full access to profiles"
  on public.profiles for all
  using (public.current_user_role() = 'super');

drop policy if exists "Active users can view their own profile" on public.profiles;
create policy "Active users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- PAGES POLICIES
drop policy if exists "Public can view published pages" on public.pages;
create policy "Public can view published pages"
  on public.pages for select
  using (status = 'pub' or public.current_user_role() in ('super', 'editor'));

drop policy if exists "Editors and Super Admins can modify pages" on public.pages;
create policy "Editors and Super Admins can modify pages"
  on public.pages for all
  using (public.current_user_role() in ('super', 'editor'));

-- PAGE SECTIONS POLICIES
drop policy if exists "Public can view published unhidden sections" on public.page_sections;
create policy "Public can view published unhidden sections"
  on public.page_sections for select
  using (
    (not is_hidden and exists (select 1 from public.pages where pages.id = page_sections.page_id and pages.status = 'pub'))
    or public.current_user_role() in ('super', 'editor')
  );

drop policy if exists "Editors and Super Admins can modify page sections" on public.page_sections;
create policy "Editors and Super Admins can modify page sections"
  on public.page_sections for all
  using (public.current_user_role() in ('super', 'editor'));

-- CAROUSEL SLIDES POLICIES
drop policy if exists "Public can view enabled published slides" on public.carousel_slides;
create policy "Public can view enabled published slides"
  on public.carousel_slides for select
  using ((en = true and status = 'pub') or public.current_user_role() in ('super', 'editor'));

drop policy if exists "Editors and Super Admins can modify carousel slides" on public.carousel_slides;
create policy "Editors and Super Admins can modify carousel slides"
  on public.carousel_slides for all
  using (public.current_user_role() in ('super', 'editor'));

-- MEDIA POLICIES
drop policy if exists "Public can view media records" on public.media;
create policy "Public can view media records"
  on public.media for select
  using (true);

drop policy if exists "Editors and Super Admins can insert/update media records" on public.media;
create policy "Editors and Super Admins can insert/update media records"
  on public.media for all
  using (public.current_user_role() in ('super', 'editor'));

-- PROGRAMMES POLICIES
drop policy if exists "Public can view published programmes" on public.programmes;
create policy "Public can view published programmes"
  on public.programmes for select
  using (status = 'pub' or public.current_user_role() in ('super', 'editor'));

drop policy if exists "Editors and Super Admins can modify programmes" on public.programmes;
create policy "Editors and Super Admins can modify programmes"
  on public.programmes for all
  using (public.current_user_role() in ('super', 'editor'));

-- ANNOUNCEMENTS POLICIES
drop policy if exists "Public can view published announcements" on public.announcements;
create policy "Public can view published announcements"
  on public.announcements for select
  using (status = 'pub' or public.current_user_role() in ('super', 'editor'));

drop policy if exists "Editors and Super Admins can modify announcements" on public.announcements;
create policy "Editors and Super Admins can modify announcements"
  on public.announcements for all
  using (public.current_user_role() in ('super', 'editor'));

-- ENQUIRIES POLICIES
drop policy if exists "Public can submit enquiries" on public.enquiries;
create policy "Public can submit enquiries"
  on public.enquiries for insert
  with check (consent = true);

drop policy if exists "Enquiry and Super Admins can view and update enquiries" on public.enquiries;
create policy "Enquiry and Super Admins can view and update enquiries"
  on public.enquiries for select
  using (public.current_user_role() in ('super', 'enquiry'));

drop policy if exists "Enquiry and Super Admins can update enquiries" on public.enquiries;
create policy "Enquiry and Super Admins can update enquiries"
  on public.enquiries for update
  using (public.current_user_role() in ('super', 'enquiry'));

drop policy if exists "Super Admins can delete enquiries" on public.enquiries;
create policy "Super Admins can delete enquiries"
  on public.enquiries for delete
  using (public.current_user_role() = 'super');

-- INVITATIONS POLICIES
drop policy if exists "Super Admin has full control of invitations" on public.invitations;
create policy "Super Admin has full control of invitations"
  on public.invitations for all
  using (public.current_user_role() = 'super');

-- ACTIVITY LOG POLICIES
drop policy if exists "Admins can view activity log" on public.activity_log;
create policy "Admins can view activity log"
  on public.activity_log for select
  using (public.is_admin());

drop policy if exists "Admins can insert activity log entries" on public.activity_log;
create policy "Admins can insert activity log entries"
  on public.activity_log for insert
  with check (public.is_admin());
