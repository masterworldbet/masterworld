-- Run once in Supabase Dashboard -> SQL Editor.
-- The website reads/writes settings through server-side routes only.

create table if not exists public.site_settings (
  id integer primary key check (id = 1),
  config jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
revoke all on table public.site_settings from anon, authenticated;

-- Create a public bucket for optimized delivery of uploaded website images.
-- Uploads are made server-side with SUPABASE_SERVICE_ROLE_KEY, never from the browser.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-assets', 'site-assets', true, 8388608, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public visitors can display uploaded assets; no browser upload policy is granted.
drop policy if exists "Public can read Masterworld site assets" on storage.objects;
create policy "Public can read Masterworld site assets"
  on storage.objects for select
  to public
  using (bucket_id = 'site-assets');
