import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, isValidAdminSession } from "../../lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const cookieStore = await cookies();
  if (!isValidAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    redirect("/admin/analytics/login?next=%2Fadmin");
  }

  return (
    <main className="adminHome">
      <header className="adminHomeHeader">
        <div><p className="eyebrow">MASTER WORLD CLASS</p><h1>ศูนย์จัดการเว็บไซต์</h1><p className="sub">เลือกเครื่องมือที่ต้องการใช้งาน</p></div>
        <a className="homeButton secondary" href="/" target="_blank" rel="noreferrer">ดูหน้าเว็บ ↗</a>
      </header>
      <nav className="adminHomeGrid" aria-label="เมนูจัดการเว็บไซต์">
        <a className="adminHomeCard featured" href="/admin/analytics"><span className="cardIcon">▥</span><span className="cardTitle">สถิติเข้าใช้งาน</span><span className="cardDesc">ดูยอดเข้าชม คลิกปุ่ม อุปกรณ์ และแหล่งที่มาของผู้เข้าชม</span><span className="cardAction">เปิดสถิติ <b>→</b></span></a>
        <a className="adminHomeCard" href="/admin/content"><span className="cardIcon">✦</span><span className="cardTitle">ตกแต่งเว็บไซต์</span><span className="cardDesc">จัดการรูปหลัก ข้อความ ลิงก์ สี และการแสดงผล</span><span className="cardAction">เปิดหน้าตกแต่ง <b>→</b></span></a>
      </nav>
      <p className="homeNote">เมนูนี้ใช้ระบบเข้าสู่ระบบผู้ดูแลเดิมร่วมกัน</p>
      <style>{`
        *{box-sizing:border-box}.adminHome{min-height:100svh;background:#08090b;color:#f5f6f8;padding:clamp(22px,5vw,64px);font-family:Arial,sans-serif}.adminHomeHeader{max-width:1100px;margin:0 auto 34px;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}.eyebrow{color:#e8b83f;font-size:11px;font-weight:900;letter-spacing:.2em;margin:0 0 12px}.adminHome h1{font-size:clamp(28px,4vw,42px);margin:0;letter-spacing:-.03em}.sub{color:#9da3ad;margin:10px 0 0;font-size:14px}.homeButton{border:1px solid #34373c;border-radius:10px;padding:11px 15px;color:#eee;text-decoration:none;font-size:13px}.adminHomeGrid{max-width:1100px;margin:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.adminHomeCard{min-height:230px;display:flex;flex-direction:column;padding:25px;border-radius:18px;border:1px solid #292c31;background:linear-gradient(145deg,#15171b,#0e1013);text-decoration:none;color:#f4f5f6;transition:transform .15s,border-color .15s}.adminHomeCard:hover{transform:translateY(-3px);border-color:#b58a29}.adminHomeCard.featured{border-color:#6c5725;background:linear-gradient(145deg,#211d12,#111214)}.cardIcon{display:grid;place-items:center;width:44px;height:44px;border-radius:13px;background:#292315;color:#f4c34e;font-size:25px;margin-bottom:24px}.cardTitle{font-size:20px;font-weight:800}.cardDesc{font-size:13px;line-height:1.7;color:#a8adb6;margin-top:10px}.cardAction{display:flex;justify-content:space-between;align-items:center;color:#f0c44e;font-size:13px;font-weight:800;margin-top:auto;padding-top:22px}.cardAction b{font-size:20px}.homeNote{max-width:1100px;margin:25px auto;color:#747b86;font-size:12px}@media(max-width:760px){.adminHomeGrid{grid-template-columns:1fr}.adminHomeCard{min-height:190px}.adminHomeHeader{align-items:flex-start}}
      `}</style>
    </main>
  );
}
