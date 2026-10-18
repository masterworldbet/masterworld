import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isValidAdminSession } from "../../../../lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIME_ZONE = "Asia/Bangkok";
type AnalyticsEvent = {
  event_type: "page_view" | "register_click";
  created_at: string;
  referrer: string | null;
  device_type: string | null;
};
type Count = { name: string; count: number };

function bangkokDateKey(value: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(value);
  const get = (type: string) => parts.find((part) => part.type === type)?.value || "00";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function bangkokHour(value: Date) {
  return Number(new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE, hour: "2-digit", hourCycle: "h23",
  }).format(value));
}

function shiftDateKey(value: string, amount: number) {
  const date = new Date(`${value}T12:00:00+07:00`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function countBreakdown(counts: Record<string, number>): Count[] {
  return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}

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

  const params = request.nextUrl.searchParams;
  const requestedDate = params.get("date");
  const isDaily = !!requestedDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate);
  const today = bangkokDateKey(new Date());
  const selectedDate = isDaily ? (requestedDate! > today ? today : requestedDate!) : null;
  const allowedDays = new Set([7, 30, 90]);
  const requestedDays = Number(params.get("days") || 7);
  const days = allowedDays.has(requestedDays) ? requestedDays : 7;

  // Convert Bangkok calendar boundaries to UTC instants for the database query.
  const startDate = selectedDate || shiftDateKey(today, -(days - 1));
  const endDateExclusive = selectedDate ? shiftDateKey(selectedDate, 1) : shiftDateKey(today, 1);
  const from = new Date(`${startDate}T00:00:00+07:00`);
  const until = new Date(`${endDateExclusive}T00:00:00+07:00`);

  try {
    const query = new URLSearchParams({
      select: "event_type,created_at,referrer,device_type",
      created_at: `gte.${from.toISOString()}`,
      and: `(created_at.lt.${until.toISOString()})`,
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
    const byHour = new Map<number, { hour: number; views: number; clicks: number }>();
    if (selectedDate) {
      for (let hour = 0; hour < 24; hour++) byHour.set(hour, { hour, views: 0, clicks: 0 });
    } else {
      for (let offset = 0; offset < days; offset++) {
        const key = shiftDateKey(startDate, offset);
        byDay.set(key, { date: key, views: 0, clicks: 0 });
      }
    }

    let pageViews = 0;
    let clicks = 0;
    const devices: Record<string, number> = {};
    const sources: Record<string, number> = {};
    for (const event of events) {
      const timestamp = new Date(event.created_at);
      const key = bangkokDateKey(timestamp);
      const day = byDay.get(key);
      const hour = byHour.get(bangkokHour(timestamp));
      if (event.event_type === "page_view") {
        pageViews++;
        if (day) day.views++;
        if (hour) hour.views++;
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
        if (hour) hour.clicks++;
      }
    }

    return NextResponse.json({
      days: selectedDate ? 1 : days,
      selectedDate,
      pageViews,
      clicks,
      clickRate: pageViews ? Math.round((clicks / pageViews) * 1000) / 10 : 0,
      daily: selectedDate ? [] : Array.from(byDay.values()),
      hourly: selectedDate ? Array.from(byHour.values()) : [],
      devices: countBreakdown(devices),
      sources: countBreakdown(sources).slice(0, 8),
      note: events.length >= 10000 ? "แสดงข้อมูลได้สูงสุด 10,000 เหตุการณ์ในช่วงที่เลือก" : null,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Analytics stats error:", error);
    return NextResponse.json({ error: "stats_unavailable" }, { status: 502 });
  }
}
