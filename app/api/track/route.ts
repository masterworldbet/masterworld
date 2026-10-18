import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const allowedEvents = new Set(["page_view", "register_click"]);

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ ok: false, reason: "analytics_not_configured" }, { status: 503 });
  }

  let body: { event?: unknown; path?: unknown; referrer?: unknown; device?: unknown; source?: unknown; buttonName?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof body.event !== "string" || !allowedEvents.has(body.event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 200) : "/";
  const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;
  const device = body.device === "mobile" || body.device === "tablet" || body.device === "desktop" ? body.device : "unknown";
  const source = body.source === "a" || body.source === "b" ? body.source : "direct";
  const buttonName = body.event === "register_click" && typeof body.buttonName === "string" ? body.buttonName.slice(0, 120) : null;

  try {
    const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/analytics_events`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ event_type: body.event, path, referrer, device_type: device, source_label: source, button_name: buttonName }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Analytics event insert failed:", response.status, await response.text());
      return NextResponse.json({ ok: false }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Analytics event insert error:", error);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
