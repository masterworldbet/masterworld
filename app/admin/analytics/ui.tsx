"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type DailyStat = { date: string; views: number; clicks: number };
type HourlyStat = { hour: number; views: number; clicks: number };
type Breakdown = { name: string; count: number };
type Stats = {
  days: number;
  pageViews: number;
  clicks: number;
  clickRate: number;
  daily: DailyStat[];
  hourly: HourlyStat[];
  selectedDate: string | null;
  devices: Breakdown[];
  sources: Breakdown[];
  trafficSources?: Record<string, { pageViews: number; clicks: number }>;
  buttonClicks?: Breakdown[];
  note: string | null;
};

const number = (value: number) => new Intl.NumberFormat("th-TH").format(value);
const dateLabel = (value: string) => new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short", timeZone: "Asia/Bangkok" }).format(new Date(`${value}T12:00:00+07:00`));
const bangkokToday = () => {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const get = (type: string) => parts.find((part) => part.type === type)?.value || "00";
  return `${get("year")}-${get("month")}-${get("day")}`;
};
const shiftDate = (value: string, amount: number) => {
  const date = new Date(`${value}T12:00:00+07:00`);
  date.setUTCDate(date.getUTCDate() + amount);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
};

export default function AnalyticsDashboard() {
  const [days, setDays] = useState(7);
  const [viewMode, setViewMode] = useState<"day" | "range">("day");
  const [selectedDate, setSelectedDate] = useState(bangkokToday);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = viewMode === "day" ? `date=${selectedDate}` : `days=${days}`;
      const response = await fetch(`/api/admin/stats?${query}`, { cache: "no-store" });
      if (response.status === 401) {
        window.location.href = "/admin/analytics/login";
        return;
      }
      const result = await response.json();
      if (!response.ok) {
        setError(result.error === "missing_database_config"
          ? "ยังไม่ได้ตั้งค่า Supabase ใน Environment Variables ของ Vercel"
          : "โหลดสถิติไม่สำเร็จ กรุณาตรวจสอบการตั้งค่าฐานข้อมูล");
        setStats(null);
        return;
      }
      setStats(result);
      setUpdatedAt(new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }));
    } catch {
      setError("เชื่อมต่อระบบสถิติไม่ได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }, [days, viewMode, selectedDate]);

  useEffect(() => { void load(); }, [load]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/analytics/login";
  }

  const chartValues = viewMode === "day" ? (stats?.hourly || []) : (stats?.daily || []);
  const maxValue = useMemo(() => Math.max(1, ...chartValues.flatMap((item) => [item.views, item.clicks])), [chartValues]);

  return (
    <main className="dashboardPage">
      <div className="dashboardShell">
        <header className="topbar">
          <div className="brandLockup"><div className="brandIcon">MW</div><div><strong>MASTER WORLD CLASS</strong><span>WEBSITE ANALYTICS</span></div></div>
          <div className="topActions"><span className="secureLabel"><i /> Admin session</span><a className="contentLink" href="/admin">เมนูหลัก</a><a className="contentLink" href="/admin/content">ตกแต่งเว็บ</a><button className="logoutButton" onClick={logout}>ออกจากระบบ</button></div>
        </header>

        <section className="pageIntro">
          <div><p className="eyebrow">ภาพรวมเว็บไซต์</p><h1>สถิติผู้เข้าชม</h1><p className="subtitle">ติดตามยอดเข้าชมและการคลิกปุ่มบนหน้าเว็บ</p></div>
          <div className="filtersArea">
            <div className="modeControls" aria-label="รูปแบบสถิติ">
              <button onClick={() => setViewMode("day")} className={viewMode === "day" ? "selected" : ""}>รายวัน</button>
              <button onClick={() => setViewMode("range")} className={viewMode === "range" ? "selected" : ""}>ย้อนหลัง</button>
            </div>
            {viewMode === "day" ? <div className="dateControls" aria-label="เลือกวันที่">
              <button onClick={() => setSelectedDate((value) => shiftDate(value, -1))} aria-label="วันก่อนหน้า" title="วันก่อนหน้า">‹</button>
              <input type="date" value={selectedDate} max={bangkokToday()} onChange={(event) => setSelectedDate(event.target.value || bangkokToday())} aria-label="เลือกวันที่" />
              <button onClick={() => setSelectedDate((value) => value < bangkokToday() ? shiftDate(value, 1) : value)} disabled={selectedDate >= bangkokToday()} aria-label="วันถัดไป" title="วันถัดไป">›</button>
              <button onClick={() => setSelectedDate(bangkokToday())} className="todayButton">วันนี้</button>
            </div> : <div className="periodControls" aria-label="เลือกช่วงเวลา">
              {[7, 30, 90].map((value) => <button key={value} onClick={() => setDays(value)} className={days === value ? "selected" : ""}>{value} วัน</button>)}
            </div>}
            <button className="refreshButton" onClick={() => void load()} aria-label="รีเฟรชสถิติ" title="รีเฟรช"><span className={loading ? "spin" : ""}>↻</span></button>
          </div>
        </section>

        {error ? <div className="errorPanel"><strong>ยังไม่สามารถแสดงสถิติได้</strong><span>{error}</span><p>ตรวจสอบว่าได้สร้างตาราง Supabase และตั้งค่า Environment Variables ครบแล้ว</p></div> : null}

        <section className="metricGrid">
          <Metric title="ยอดเข้าชมหน้าเว็บ" value={stats ? number(stats.pageViews) : "—"} detail={viewMode === "day" ? `วันที่ ${dateLabel(selectedDate)}` : `ในช่วง ${days} วันที่เลือก`} icon="◉" accent="blue" />
          <Metric title="คลิกปุ่มสมัคร" value={stats ? number(stats.clicks) : "—"} detail="จำนวนคลิกที่บันทึกได้" icon="↗" accent="gold" />
          <Metric title="อัตราคลิกต่อยอดเข้าชม" value={stats ? `${stats.clickRate}%` : "—"} detail="คลิก ÷ จำนวน Page Views" icon="％" accent="purple" />
          <Metric title="ข้อมูลล่าสุด" value={updatedAt || "—"} detail="เวลาโหลดข้อมูลสำเร็จ" icon="◷" accent="green" />
        </section>

        <section className="metricGrid" style={{ marginTop: 14 }}>
          <Metric title="Pixel A · เข้าชม" value={stats ? number(stats.trafficSources?.a?.pageViews ?? 0) : "—"} detail={`คลิกปุ่ม ${stats ? number(stats.trafficSources?.a?.clicks ?? 0) : "—"}`} icon="A" accent="blue" />
          <Metric title="Pixel B · เข้าชม" value={stats ? number(stats.trafficSources?.b?.pageViews ?? 0) : "—"} detail={`คลิกปุ่ม ${stats ? number(stats.trafficSources?.b?.clicks ?? 0) : "—"}`} icon="B" accent="purple" />
        </section>

        <section className="contentGrid">
          <div className="panel chartPanel">
            <div className="panelHeader"><div><h2>ยอดเข้าชมและคลิก</h2><p>{viewMode === "day" ? `รายชั่วโมง · ${dateLabel(selectedDate)}` : "เปรียบเทียบรายวัน"}</p></div><div className="legend"><span><i className="viewDot" />เข้าชม</span><span><i className="clickDot" />คลิก</span></div></div>
            {loading && !stats ? <div className="emptyState">กำลังโหลดข้อมูล…</div> : viewMode === "day" ? (stats && stats.hourly.length ? <div className="chartScroll"><div className="barChart hourlyChart">{stats.hourly.map((item) => <div className="barGroup" key={item.hour} title={`${String(item.hour).padStart(2, "0")}:00 · เข้าชม ${item.views}, คลิก ${item.clicks}`}><div className="bars"><div className="bar viewsBar" style={{ height: `${Math.max(item.views ? 4 : 0, item.views / maxValue * 100)}%` }} /><div className="bar clicksBar" style={{ height: `${Math.max(item.clicks ? 4 : 0, item.clicks / maxValue * 100)}%` }} /></div><span>{item.hour % 3 === 0 ? `${String(item.hour).padStart(2, "0")}:00` : ""}</span></div>)}</div></div> : <div className="emptyState">{error ? "" : "วันนี้ยังไม่มีข้อมูลที่บันทึกได้"}</div>) : (stats && stats.daily.length ? <div className="chartScroll"><div className="barChart">{stats.daily.map((item) => <div className="barGroup" key={item.date} title={`${item.date}: เข้าชม ${item.views}, คลิก ${item.clicks}`}><div className="bars"><div className="bar viewsBar" style={{ height: `${Math.max(item.views ? 4 : 0, item.views / maxValue * 100)}%` }} /><div className="bar clicksBar" style={{ height: `${Math.max(item.clicks ? 4 : 0, item.clicks / maxValue * 100)}%` }} /></div><span>{dateLabel(item.date)}</span></div>)}</div></div> : <div className="emptyState">{error ? "" : "ยังไม่มีข้อมูลในช่วงเวลานี้ เมื่อมีผู้เข้าชม ข้อมูลจะแสดงที่นี่"}</div>)}
            {stats?.note ? <p className="dataNote">{stats.note}</p> : null}
          </div>

          <div className="panel breakdownPanel"><div className="panelHeader"><div><h2>อุปกรณ์</h2><p>จำแนกตามประเภทอุปกรณ์</p></div></div>{stats?.devices.length ? <BreakdownList items={stats.devices.map((item) => ({ ...item, name: ({ mobile: "มือถือ", tablet: "แท็บเล็ต", desktop: "คอมพิวเตอร์", unknown: "ไม่ทราบ" } as Record<string, string>)[item.name] || item.name }))} total={stats.pageViews} /> : <div className="smallEmpty">ยังไม่มีข้อมูล</div>}</div>
        </section>

        <section className="panel sourcesPanel"><div className="panelHeader"><div><h2>คลิกแยกตามปุ่ม</h2><p>จำนวนคลิกของแต่ละปุ่มในช่วงเวลาที่เลือก</p></div></div>{stats?.buttonClicks?.length ? <BreakdownList items={stats.buttonClicks} total={stats.clicks} /> : <div className="smallEmpty">ยังไม่มีข้อมูลคลิกปุ่ม</div>}</section>

        <section className="panel sourcesPanel"><div className="panelHeader"><div><h2>แหล่งที่มาของผู้เข้าชม</h2><p>อ้างอิงจาก referrer ที่เบราว์เซอร์ส่งมา</p></div></div>{stats?.sources.length ? <BreakdownList items={stats.sources} total={stats.pageViews} /> : <div className="smallEmpty">ยังไม่มีข้อมูลแหล่งที่มา บางแอปอาจไม่ส่ง referrer มาให้</div>}</section>
        <footer className="dashboardFooter">ข้อมูลนี้นับเฉพาะการเข้าชมและคลิกที่ระบบบันทึกได้ ไม่ได้ยืนยันการสมัครสำเร็จบนเว็บไซต์ปลายทาง{updatedAt ? ` · อัปเดต ${updatedAt} น.` : ""}</footer>
      </div>
      <style jsx>{`
        .dashboardPage { min-height: 100svh; background: #090a0c; color: #f4f5f7; padding: 0 22px 40px; box-sizing: border-box; }
        .dashboardShell { width: min(1180px,100%); margin: 0 auto; }
        .topbar { min-height: 82px; display: flex; align-items: center; justify-content: space-between; gap: 18px; border-bottom: 1px solid #24262a; }
        .brandLockup,.topActions,.brandLockup>div:last-child { display: flex; align-items: center; }
        .brandLockup { gap: 12px; }.brandIcon { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 13px; background: linear-gradient(135deg,#ffe08a,#d99b00); color: #211700; font-size: 13px; font-weight: 950; }
        .brandLockup>div:last-child { align-items: flex-start; flex-direction: column; gap: 4px; }.brandLockup strong { font-size: 12px; letter-spacing: .09em; }.brandLockup span { color: #848991; font-size: 10px; letter-spacing: .16em; }
        .topActions { gap: 18px; }.contentLink { border: 1px solid #5c4b20; border-radius: 9px; padding: 9px 12px; color: #f0cd6b; background: #211d12; text-decoration: none; font-size: 12px; font-weight: 800; }.secureLabel { display: flex; align-items: center; gap: 8px; color: #a7abb2; font-size: 12px; }.secureLabel i { width: 7px; height: 7px; border-radius: 50%; background: #46d39a; box-shadow: 0 0 10px #46d39a66; }.logoutButton { border: 1px solid #33363b; border-radius: 9px; background: transparent; color: #d8dbe0; padding: 9px 12px; cursor: pointer; font-size: 12px; }
        .pageIntro { display: flex; align-items: end; justify-content: space-between; gap: 20px; padding: 34px 0 24px; }.eyebrow { margin: 0 0 8px; color: #e8ba47; text-transform: uppercase; font-size: 10px; letter-spacing: .18em; font-weight: 800; }.pageIntro h1 { margin: 0; font-size: clamp(26px,4vw,36px); letter-spacing: -.04em; }.subtitle { margin: 8px 0 0; color: #9297a0; font-size: 13px; }
        .filtersArea { display:flex; flex-wrap:wrap; align-items:center; justify-content:flex-end; gap:8px; }
        .modeControls,.periodControls,.dateControls { display:flex; align-items:center; gap:5px; padding:5px; border:1px solid #292c31; border-radius:12px; background:#111316; }
        .modeControls button,.periodControls button,.dateControls button { min-width:42px; padding:9px 10px; border:0; border-radius:8px; background:transparent; color:#9da2aa; font-size:12px; cursor:pointer; }
        .modeControls button.selected,.periodControls button.selected { background:#eab83d; color:#211800; font-weight:850; }
        .dateControls input { width:135px; max-width:38vw; border:1px solid #34373c; border-radius:8px; padding:8px 6px; background:#0b0c0e; color:#f4f5f7; color-scheme:dark; font-size:12px; }
        .dateControls button:disabled { opacity:.3; cursor:not-allowed; }.dateControls .todayButton { color:#f0c451; }
        .refreshButton { min-width:36px; padding:8px; border:1px solid #292c31; border-radius:10px; background:#111316; color:#9da2aa; font-size:20px; line-height:1; cursor:pointer; }.spin { display: inline-block; animation: spin 1s linear infinite; }@keyframes spin { to { transform: rotate(360deg); } }
        .metricGrid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 14px; }.metricCard { min-width: 0; padding: 20px; border: 1px solid #25282d; border-radius: 16px; background: linear-gradient(145deg,#15171a,#101113); }.metricTop { display: flex; align-items: center; justify-content: space-between; gap: 8px; }.metricTitle { color: #a5aab2; font-size: 12px; }.metricIcon { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 10px; font-size: 18px; font-weight: 800; }.blue .metricIcon { color: #74b9ff; background: #1c3851; }.gold .metricIcon { color: #f6cb60; background: #443719; }.purple .metricIcon { color: #c5a0ff; background: #342548; }.green .metricIcon { color: #70e3b4; background: #183c30; }.metricValue { display: block; overflow-wrap: anywhere; margin-top: 18px; font-size: clamp(24px,3vw,32px); line-height: 1.1; font-weight: 750; letter-spacing: -.04em; }.metricDetail { display: block; margin-top: 10px; color: #747a83; font-size: 11px; }
        .contentGrid { display: grid; grid-template-columns: minmax(0,1.8fr) minmax(250px,1fr); gap: 14px; margin-top: 14px; }.panel { min-width: 0; border: 1px solid #25282d; border-radius: 16px; background: #111315; padding: 21px; }.panelHeader { display: flex; justify-content: space-between; align-items: center; gap: 14px; }.panelHeader h2 { margin: 0; font-size: 15px; }.panelHeader p { margin: 6px 0 0; color: #858a93; font-size: 11px; }.legend { display: flex; gap: 13px; color: #a8adb5; font-size: 11px; }.legend span { display: flex; align-items: center; gap: 6px; white-space: nowrap; }.legend i { width: 7px; height: 7px; display: inline-block; border-radius: 3px; }.viewDot { background: #69adff; }.clickDot { background: #edbd45; }.chartScroll { overflow-x: auto; margin-top: 20px; }.barChart { min-width: 380px; height: 205px; display: flex; align-items: stretch; gap: 8px; padding: 0 2px; }.hourlyChart { min-width: 720px; gap: 4px; }.hourlyChart .barGroup { min-width: 20px; }.hourlyChart .bar { width: min(10px,42%); }.barGroup { flex: 1; min-width: 20px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 10px; color: #838994; font-size: 10px; }.bars { width: 100%; height: 170px; display: flex; align-items: end; justify-content: center; gap: 3px; border-bottom: 1px solid #303238; background: repeating-linear-gradient(to top,transparent 0,transparent 41px,#292c30 42px); }.bar { width: min(14px,40%); min-height: 0; border-radius: 4px 4px 0 0; transition: height .25s ease; }.viewsBar { background: linear-gradient(180deg,#73baff,#3679d0); }.clicksBar { background: linear-gradient(180deg,#f6d36d,#c28a12); }.emptyState { min-height: 205px; display: grid; place-items: center; color: #777d86; text-align: center; font-size: 12px; }.dataNote { color: #d6b768; font-size: 11px; }.smallEmpty { padding: 30px 0 12px; color: #777d86; font-size: 12px; text-align: center; }.breakdownList { display: flex; flex-direction: column; gap: 16px; margin-top: 22px; }.breakdownItem { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 7px 12px; font-size: 12px; }.breakdownName { color: #c8cbd1; overflow-wrap: anywhere; }.breakdownCount { color: #f1f2f4; font-variant-numeric: tabular-nums; }.breakdownTrack { grid-column: 1 / -1; height: 5px; overflow: hidden; border-radius: 5px; background: #292c31; }.breakdownFill { height: 100%; border-radius: inherit; background: linear-gradient(90deg,#4c91e5,#79bcff); }.sourcesPanel { margin-top: 14px; }.sourcesPanel .breakdownList { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 18px 30px; }.errorPanel { display: flex; flex-direction: column; gap: 8px; padding: 16px 18px; margin-bottom: 14px; border: 1px solid #744a28; border-radius: 12px; background: #291b12; color: #ffd7a1; font-size: 13px; }.errorPanel span,.errorPanel p { margin: 0; color: #d2b79b; font-size: 12px; }.dashboardFooter { padding: 22px 0 0; color: #737983; font-size: 10px; line-height: 1.7; }
        @media(max-width:850px) { .metricGrid { grid-template-columns: repeat(2,minmax(0,1fr)); }.contentGrid { grid-template-columns: 1fr; }.breakdownPanel .breakdownList { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; } }
        @media(max-width:560px) { .dashboardPage { padding: 0 13px 28px; }.topbar { min-height: 72px; }.brandLockup { gap: 8px; }.brandIcon { width: 36px; height: 36px; }.brandLockup strong { font-size: 10px; }.brandLockup span { font-size: 8px; }.topActions { gap: 8px; }.secureLabel { display: none; }.logoutButton { padding: 8px; font-size: 11px; }.pageIntro { display: block; padding: 26px 0 18px; }.filtersArea { justify-content:flex-start; margin-top:18px; }.periodControls { width: fit-content; }.dateControls input { width:120px; }.modeControls button,.periodControls button,.dateControls button { padding:8px; }.metricGrid { gap: 9px; }.metricCard { padding: 14px; border-radius: 13px; }.metricTitle { font-size: 11px; }.metricIcon { width: 29px; height: 29px; }.metricValue { font-size: 25px; margin-top: 15px; }.metricDetail { font-size: 10px; line-height: 1.5; }.panel { padding: 16px; }.sourcesPanel .breakdownList,.breakdownPanel .breakdownList { grid-template-columns: 1fr; }.legend { gap: 8px; font-size: 10px; } }
      `}</style>
    </main>
  );
}

function Metric({ title, value, detail, icon, accent }: { title: string; value: string; detail: string; icon: string; accent: string }) {
  return <article className={`metricCard ${accent}`}><div className="metricTop"><span className="metricTitle">{title}</span><span className="metricIcon" aria-hidden="true">{icon}</span></div><strong className="metricValue">{value}</strong><span className="metricDetail">{detail}</span><style jsx>{`.metricCard { min-width: 0; padding: 20px; border: 1px solid #25282d; border-radius: 16px; background: linear-gradient(145deg,#15171a,#101113); }.metricTop { display:flex; align-items:center; justify-content:space-between; gap:8px; }.metricTitle { color:#a5aab2; font-size:12px; }.metricIcon { width:34px; height:34px; display:grid; place-items:center; border-radius:10px; font-size:18px; font-weight:800; }.blue .metricIcon { color:#74b9ff; background:#1c3851; }.gold .metricIcon { color:#f6cb60; background:#443719; }.purple .metricIcon { color:#c5a0ff; background:#342548; }.green .metricIcon { color:#70e3b4; background:#183c30; }.metricValue { display:block; overflow-wrap:anywhere; margin-top:18px; font-size:clamp(24px,3vw,32px); line-height:1.1; font-weight:750; letter-spacing:-.04em; }.metricDetail { display:block; margin-top:10px; color:#747a83; font-size:11px; } @media(max-width:560px){.metricCard{padding:14px;border-radius:13px}.metricTitle{font-size:11px}.metricIcon{width:29px;height:29px}.metricValue{font-size:25px;margin-top:15px}.metricDetail{font-size:10px;line-height:1.5}}`}</style></article>;
}

function BreakdownList({ items, total }: { items: Breakdown[]; total: number }) {
  return <div className="breakdownList">{items.map((item) => <div className="breakdownItem" key={item.name}><span className="breakdownName">{item.name}</span><span className="breakdownCount">{number(item.count)} · {total ? Math.round(item.count / total * 100) : 0}%</span><div className="breakdownTrack"><div className="breakdownFill" style={{ width: `${total ? Math.min(100, item.count / total * 100) : 0}%` }} /></div></div>)}<style jsx>{`.breakdownList{display:flex;flex-direction:column;gap:16px;margin-top:22px}.breakdownItem{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px 12px;font-size:12px}.breakdownName{color:#c8cbd1;overflow-wrap:anywhere}.breakdownCount{color:#f1f2f4;font-variant-numeric:tabular-nums}.breakdownTrack{grid-column:1/-1;height:5px;overflow:hidden;border-radius:5px;background:#292c31}.breakdownFill{height:100%;border-radius:inherit;background:linear-gradient(90deg,#4c91e5,#79bcff)}`}</style></div>;
}
