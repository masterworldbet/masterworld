แก้ปัญหา Meta Pixel ตรวจไม่พบ และแยก Event A/B

1) แตก ZIP
2) นำ components/MetaPixelSettings.tsx และ app/page.tsx ไปแทนไฟล์เดิมตามพาธใน GitHub
3) Commit changes และรอ Vercel Deploy
4) ใน Meta Event Setup ให้ทดสอบ URL พร้อมแหล่งที่มา เช่น https://masterworld-nu.vercel.app/?mw_source=a สำหรับ Pixel A และ ?mw_source=b สำหรับ Pixel B

โค้ดจะ init Pixel IDs ที่ตั้งไว้เพื่อให้ Meta ตรวจพบได้ แต่ส่ง PageView/Contact เฉพาะ Pixel ที่ตรงกับ mw_source เท่านั้น; การเข้า URL เปล่าไม่ถูกนับเป็น A/B
