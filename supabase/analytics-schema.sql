-- Run this SQL once in Supabase Dashboard -> SQL Editor.
-- The service-role key is used only by server routes; never expose it in NEXT_PUBLIC_* variables.

create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  event_type text not null check (event_type in ('page_view', 'register_click')),
  path text not null default '/',
  referrer text,
  device_type text not null default 'unknown' check (device_type in ('mobile', 'tablet', 'desktop', 'unknown')),
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at desc);
create index if not exists analytics_events_type_created_at_idx
  on public.analytics_events (event_type, created_at desc);

-- Deny direct browser access. The app accesses this table only through server-side routes.
alter table public.analytics_events enable row level security;
revoke all on table public.analytics_events from anon, authenticated;
