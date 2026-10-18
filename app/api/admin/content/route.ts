import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isValidAdminSession } from "../../../../lib/admin-auth";
import { mergeSiteConfig, sanitizeSiteConfig } from "../../../../lib/site-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorized() {
  const store = await cookies();
  return isValidAdminSession(store.get(ADMIN_COOKIE_NAME)?.value);
}

function databaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const db = databaseConfig();
  if (!db) return NextResponse.json({ error: "กรุณาตั้งค่า SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY ใน Vercel" }, { status: 503 });

  try {
    const query = new URLSearchParams({ select: "config", id: "eq.1", limit: "1" });
    const response = await fetch(`${db.url}/rest/v1/site_settings?${query}`, {
      headers: { apikey: db.key, Authorization: `Bearer ${db.key}` }, cache: "no-store",
    });
    if (!response.ok) {
      console.error("Admin site settings read failed:", response.status, await response.text());
      return NextResponse.json({ error: "อ่านการตั้งค่าไม่ได้ กรุณารันไฟล์ supabase/site-settings-schema.sql ใน Supabase SQL Editor" }, { status: 502 });
    }
    const rows = (await response.json()) as Array<{ config?: unknown }>;
    const config = mergeSiteConfig(rows[0]?.config);
    return NextResponse.json({ config }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin site settings read error:", error);
    return NextResponse.json({ error: "เชื่อมต่อฐานข้อมูลไม่ได้" }, { status: 502 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const db = databaseConfig();
  if (!db) return NextResponse.json({ error: "กรุณาตั้งค่า SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY ใน Vercel" }, { status: 503 });

  let body: { config?: unknown };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 }); }
  const config = sanitizeSiteConfig(body.config);
  if (!config) return NextResponse.json({ error: "ข้อมูลบางช่องไม่ถูกต้อง กรุณาตรวจสอบลิงก์ สี และข้อความ" }, { status: 400 });

  try {
    const response = await fetch(`${db.url}/rest/v1/site_settings?on_conflict=id`, {
      method: "POST",
      headers: {
        apikey: db.key,
        Authorization: `Bearer ${db.key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ id: 1, config, updated_at: new Date().toISOString() }),
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("Admin site settings save failed:", response.status, await response.text());
      return NextResponse.json({ error: "บันทึกไม่ได้ กรุณาตรวจสอบตาราง site_settings และรัน SQL ตั้งค่าก่อน" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, config }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin site settings save error:", error);
    return NextResponse.json({ error: "เชื่อมต่อฐานข้อมูลไม่ได้" }, { status: 502 });
  }
}
