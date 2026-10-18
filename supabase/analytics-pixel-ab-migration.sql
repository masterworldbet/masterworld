-- รันครั้งเดียวใน Supabase Dashboard > SQL Editor
-- เพิ่มฟิลด์แหล่งที่มาและชื่อปุ่ม โดยไม่ลบข้อมูล Analytics เดิม
alter table public.analytics_events
  add column if not exists source_label text not null default 'direct',
  add column if not exists button_name text;

create index if not exists analytics_events_source_created_at_idx
  on public.analytics_events (source_label, created_at desc);
create index if not exists analytics_events_button_created_at_idx
  on public.analytics_events (button_name, created_at desc);

-- ค่าที่รับได้: a, b, direct
update public.analytics_events
set source_label = 'direct'
where source_label is null or source_label not in ('a', 'b', 'direct');
