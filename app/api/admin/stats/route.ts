import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isValidAdminSession } from "../../../../lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnalyticsEvent = {
  event_type: "page_view" | "register_click";
  created_at: string;
  referrer: string | null;
  device_type: string | null;
};

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  if (!isValidAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "missing_database_config" }, { status: 503 });
  }

  const allowedDays = new Set([7, 30, 90]);
  const requestedDays = Number(request.nextUrl.searchParams.get("days") || 7);
  const days = allowedDays.has(requestedDays) ? requestedDays : 7;
  const from = new Date();
  from.setDate(from.getDate() - (days - 1));
  from.setHours(0, 0, 0, 0);

  try {
    const query = new URLSearchParams({
      select: "event_type,created_at,referrer,device_type",
      created_at: `gte.${from.toISOString()}`,
      order: "created_at.asc",
      limit: "10000",
    });
    const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/analytics_events?${query}`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("Analytics query failed:", response.status, await response.text());
      return NextResponse.json({ error: "database_query_failed" }, { status: 502 });
    }

    const events = (await response.json()) as AnalyticsEvent[];
    const byDay = new Map<string, { date: string; views: number; clicks: number }>();
    for (let offset = 0; offset < days; offset++) {
      const date = new Date(from);
      date.setDate(from.getDate() + offset);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      byDay.set(key, { date: key, views: 0, clicks: 0 });
    }

    let pageViews = 0;
    let clicks = 0;
    const devices: Record<string, number> = {};
    const sources: Record<string, number> = {};
    for (const event of events) {
      const timestamp = new Date(event.created_at);
      const key = `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, "0")}-${String(timestamp.getDate()).padStart(2, "0")}`;
      const day = byDay.get(key);
      if (event.event_type === "page_view") {
        pageViews++;
        if (day) day.views++;
        const device = event.device_type || "unknown";
        devices[device] = (devices[device] || 0) + 1;
        let source = "Direct / ไม่ทราบแหล่งที่มา";
        if (event.referrer) {
          try { source = new URL(event.referrer).hostname.replace(/^www\./, ""); } catch { source = "Other"; }
        }
        sources[source] = (sources[source] || 0) + 1;
      } else if (event.event_type === "register_click") {
        clicks++;
        if (day) day.clicks++;
      }
    }

    return NextResponse.json({
      days,
      pageViews,
      clicks,
      clickRate: pageViews ? Math.round((clicks / pageViews) * 1000) / 10 : 0,
      daily: Array.from(byDay.values()),
      devices: Object.entries(devices).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      sources: Object.entries(sources).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 8),
      note: events.length >= 10000 ? "แสดงข้อมูลได้สูงสุด 10,000 เหตุการณ์ในช่วงที่เลือก" : null,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Analytics stats error:", error);
    return NextResponse.json({ error: "stats_unavailable" }, { status: 502 });
  }
}
