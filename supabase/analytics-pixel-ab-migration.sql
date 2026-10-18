-- MASTERWORLD: add source and button labels to analytics events.
-- Run once in Supabase SQL Editor before deploying the updated application.
ALTER TABLE public.analytics_events
  ADD COLUMN IF NOT EXISTS source_label text NOT NULL DEFAULT 'direct',
  ADD COLUMN IF NOT EXISTS button_name text;

CREATE INDEX IF NOT EXISTS analytics_events_source_created_at_idx
  ON public.analytics_events (source_label, created_at DESC);

CREATE INDEX IF NOT EXISTS analytics_events_button_created_at_idx
  ON public.analytics_events (button_name, created_at DESC);
