-- Run once in Supabase SQL Editor if not already applied.
alter table public.analytics_events add column if not exists source_label text;
alter table public.analytics_events add column if not exists button_name text;
create index if not exists analytics_events_source_created_at_idx on public.analytics_events (source_label, created_at desc);
