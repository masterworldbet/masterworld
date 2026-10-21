-- Run once in Supabase SQL Editor to enable A/B attribution in the analytics dashboard.
-- Existing events remain valid; older rows have NULL source_label and will be counted as Direct/unknown.
alter table public.analytics_events
  add column if not exists source_label text,
  add column if not exists button_name text;

create index if not exists analytics_events_source_created_at_idx
  on public.analytics_events (source_label, created_at desc);
create index if not exists analytics_events_button_created_at_idx
  on public.analytics_events (button_name, created_at desc);
