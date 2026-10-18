import { NextResponse } from "next/server";
import { DEFAULT_SITE_CONFIG, mergeSiteConfig } from "../../../lib/site-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ config: DEFAULT_SITE_CONFIG }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const query = new URLSearchParams({ select: "config", id: "eq.1", limit: "1" });
    const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/site_settings?${query}`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("Site settings read failed:", response.status, await response.text());
      return NextResponse.json({ config: DEFAULT_SITE_CONFIG }, { headers: { "Cache-Control": "no-store" } });
    }
    const rows = (await response.json()) as Array<{ config?: unknown }>;
    const config = mergeSiteConfig(rows[0]?.config);
    return NextResponse.json({ config }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Site settings read error:", error);
    return NextResponse.json({ config: DEFAULT_SITE_CONFIG }, { headers: { "Cache-Control": "no-store" } });
  }
}
