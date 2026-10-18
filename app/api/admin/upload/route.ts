import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isValidAdminSession } from "../../../../lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  const store = await cookies();
  if (!isValidAdminSession(store.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "กรุณาตั้งค่า Supabase ใน Vercel" }, { status: 503 });
  }

  let form: FormData;
  try { form = await request.formData(); }
  catch { return NextResponse.json({ error: "อ่านไฟล์ไม่สำเร็จ" }, { status: 400 }); }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "กรุณาเลือกไฟล์รูปภาพ" }, { status: 400 });
  const extension = allowedTypes[file.type];
  if (!extension) return NextResponse.json({ error: "รองรับเฉพาะ JPG, PNG, WEBP และ GIF" }, { status: 415 });
  if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "ขนาดรูปต้องมากกว่า 0 และไม่เกิน 8 MB" }, { status: 413 });
  }

  const objectName = `${randomUUID()}.${extension}`;
  try {
    const response = await fetch(`${supabaseUrl}/storage/v1/object/site-assets/${objectName}`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": file.type,
        "Cache-Control": "public, max-age=31536000, immutable",
        "x-upsert": "false",
      },
      body: await file.arrayBuffer(),
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("Supabase image upload failed:", response.status, await response.text());
      return NextResponse.json({ error: "อัปโหลดไม่ได้ กรุณารัน SQL ตั้งค่า Storage ก่อน" }, { status: 502 });
    }
    const url = `${supabaseUrl}/storage/v1/object/public/site-assets/${objectName}`;
    return NextResponse.json({ ok: true, url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Supabase image upload error:", error);
    return NextResponse.json({ error: "อัปโหลดไม่สำเร็จ กรุณาลองอีกครั้ง" }, { status: 502 });
  }
}
