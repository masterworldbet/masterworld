# Masterworld: ระบบจัดการเนื้อหาเว็บไซต์

## มีอะไรเพิ่มเข้ามา
- `/admin` และ `/admin/content`: หน้าแก้ไขรูป ข้อความปุ่ม URL ปลายทาง สี และเปิด/ปิดรูปหรือปุ่ม
- `/api/site-config`: ส่งค่าตั้งค่าที่หน้าเว็บหลักใช้งาน
- `/api/admin/content`: อ่าน/บันทึกการตั้งค่าโดยต้องมี session ผู้ดูแล
- `/api/admin/upload`: อัปโหลดรูปเข้า Supabase Storage โดยต้องมี session ผู้ดูแล
- ใช้ระบบล็อกอินเดิม (`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`) ร่วมกับหน้า Analytics

## ตั้งค่า Supabase (ทำครั้งเดียว)
1. เปิด Supabase Dashboard -> SQL Editor
2. รันไฟล์ `supabase/site-settings-schema.sql`
3. ตรวจสอบว่ามีตาราง `site_settings` และ Storage bucket `site-assets`

## Environment variables ใน Vercel
ตั้งค่าตัวแปรเหล่านี้ใน Project Settings -> Environment Variables:
- `SUPABASE_URL` — Project URL ของ Supabase
- `SUPABASE_SERVICE_ROLE_KEY` — Service Role key (เก็บฝั่งเซิร์ฟเวอร์เท่านั้น ห้ามใช้ prefix `NEXT_PUBLIC_`)
- `ADMIN_PASSWORD` — รหัสผ่านผู้ดูแลที่เดายาก
- `ADMIN_SESSION_SECRET` — secret สุ่มยาวอย่างน้อย 32 bytes
- `NEXT_PUBLIC_META_PIXEL_ID` — คงค่าเดิมของ Meta Pixel

จากนั้น Deploy ใหม่ และเข้า `https://<โดเมนเว็บ>/admin` ระบบจะพาไปหน้า login เดิม หากยังไม่ได้ล็อกอิน

## วิธีใช้งาน
1. เข้า `/admin` แล้วล็อกอินด้วยรหัสผ่าน Admin เดิม
2. แก้ข้อความ/URL หรือเลือกสี และอัปโหลดรูป
3. กด “บันทึกการเปลี่ยนแปลง”
4. เปิดหน้าเว็บหลักเพื่อตรวจสอบผล

## หมายเหตุ
- รูปที่อัปโหลดรองรับ JPG, PNG, WEBP และ GIF ขนาดไม่เกิน 8 MB
- รูปใหม่จะถูกเก็บเป็นไฟล์ใหม่ใน Storage; รูปเดิมไม่ถูกลบทิ้งอัตโนมัติ เพื่อป้องกันลิงก์เสีย
- ถ้ายังไม่ได้รัน SQL หรือยังไม่ได้ตั้งค่า Supabase หน้าเว็บหลักยังแสดงค่าเดิมได้ แต่การบันทึกหลังบ้านจะไม่ทำงาน
- ระบบนี้ไม่แก้ Meta Pixel, event tracking, หรือเส้นทาง Analytics เดิม
