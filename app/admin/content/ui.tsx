"use client";

import { ChangeEvent, useEffect, useState } from "react";
import type { SiteConfig } from "../../../lib/site-config";

const defaults: SiteConfig = {
  promoImageUrl: "/promo-square.png",
  imageAlt: "Masterworld",
  registerUrl: "https://masterworldbet.com/sign-up?ref_agent=1feacd0466b9&ref_zean=9ED5866AF713",
  buttonText: "สมัครเลย",
  showImage: true,
  showButton: true,
  pageBackgroundColor: null,
  cardBackgroundColor: null,
  buttonBackgroundColor: null,
  buttonTextColor: null,
};

const colorDefaults = { pageBackgroundColor: "#050505", cardBackgroundColor: "#141414", buttonBackgroundColor: "#f0a900", buttonTextColor: "#171000" };
type ColorKey = keyof typeof colorDefaults;

export default function ContentEditor() {
  const [config, setConfig] = useState<SiteConfig>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/content", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "โหลดการตั้งค่าไม่สำเร็จ");
        if (active) setConfig({ ...defaults, ...data.config });
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "โหลดการตั้งค่าไม่สำเร็จ");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function update<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
    setConfig((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true); setError(""); setMessage("");
    try {
      const form = new FormData(); form.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "อัปโหลดรูปไม่สำเร็จ");
      update("promoImageUrl", data.url);
      setMessage("อัปโหลดรูปแล้ว อย่าลืมกดบันทึกการเปลี่ยนแปลง");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "อัปโหลดรูปไม่สำเร็จ");
    } finally { setUploading(false); }
  }

  async function save() {
    setSaving(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "บันทึกไม่สำเร็จ");
      setConfig({ ...defaults, ...data.config });
      setMessage("บันทึกแล้ว หน้าเว็บหลักจะใช้การตั้งค่าใหม่นี้");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "บันทึกไม่สำเร็จ");
    } finally { setSaving(false); }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    window.location.href = "/admin/analytics/login";
  }

  function setColor(key: ColorKey, value: string) { update(key, value as SiteConfig[ColorKey]); }
  function resetColors() {
    setConfig((current) => ({ ...current, pageBackgroundColor: null, cardBackgroundColor: null, buttonBackgroundColor: null, buttonTextColor: null }));
    setMessage("คืนค่าสีเดิมแล้ว กดบันทึกเพื่อใช้กับหน้าเว็บ");
  }

  if (loading) return <main className="editorLoading">กำลังโหลดการตั้งค่าเว็บไซต์…</main>;

  return (
    <main className="editorPage">
      <header className="editorHeader">
        <div><p className="editorEyebrow">MASTER WORLD CLASS</p><h1>จัดการหน้าเว็บไซต์</h1><p className="editorSub">เปลี่ยนรูป ข้อความ ลิงก์ และสี โดยไม่ต้องแก้โค้ด</p></div>
        <div className="editorHeaderActions"><a href="/" target="_blank" rel="noreferrer">ดูหน้าเว็บ ↗</a><a href="/admin/analytics">สถิติ</a><button type="button" className="logoutButton" onClick={logout}>ออกจากระบบ</button></div>
      </header>

      {error ? <div className="editorNotice editorError" role="alert">{error}</div> : null}
      {message ? <div className="editorNotice editorSuccess" role="status">{message}</div> : null}

      <div className="editorGrid">
        <section className="editorPanel">
          <div className="panelHeading"><span className="panelNumber">01</span><div><h2>รูปภาพและปุ่ม</h2><p>กำหนดเนื้อหาที่แสดงบนหน้าเว็บหลัก</p></div></div>

          <label className="toggleRow"><span><strong>แสดงรูปโปรโมชัน</strong><small>เปิดหรือซ่อนรูปหลักบนหน้าเว็บ</small></span><input type="checkbox" checked={config.showImage} onChange={(e) => update("showImage", e.target.checked)} /></label>
          <label className="fieldLabel" htmlFor="image-url">URL รูปภาพ</label>
          <input id="image-url" className="textField" value={config.promoImageUrl} onChange={(e) => update("promoImageUrl", e.target.value)} placeholder="/promo-square.png หรือ URL รูป" />
          <label className="fieldLabel" htmlFor="image-alt">คำอธิบายรูป</label>
          <input id="image-alt" className="textField" value={config.imageAlt} maxLength={160} onChange={(e) => update("imageAlt", e.target.value)} />
          <label className="uploadField"><span>{uploading ? "กำลังอัปโหลด…" : "＋ อัปโหลดรูปใหม่"}<small>JPG, PNG, WEBP หรือ GIF · ไม่เกิน 8 MB</small></span><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading} onChange={uploadImage} /></label>
          {config.showImage && config.promoImageUrl ? <div className="imagePreview"><img src={config.promoImageUrl} alt="ตัวอย่างรูปที่ตั้งค่า" onError={(e) => { e.currentTarget.style.display = "none"; }} /><span>ตัวอย่างรูปปัจจุบัน</span></div> : <p className="mutedNote">ขณะนี้ซ่อนรูปบนหน้าเว็บหลัก</p>}

          <div className="sectionRule" />
          <label className="toggleRow"><span><strong>แสดงปุ่มหลัก</strong><small>เปิดหรือซ่อนปุ่มบนหน้าเว็บ</small></span><input type="checkbox" checked={config.showButton} onChange={(e) => update("showButton", e.target.checked)} /></label>
          <label className="fieldLabel" htmlFor="button-text">ข้อความบนปุ่ม</label>
          <input id="button-text" className="textField" value={config.buttonText} maxLength={80} onChange={(e) => update("buttonText", e.target.value)} />
          <label className="fieldLabel" htmlFor="register-url">ลิงก์ปลายทางของปุ่ม (HTTPS)</label>
          <input id="register-url" className="textField" type="url" value={config.registerUrl} onChange={(e) => update("registerUrl", e.target.value)} required />
          <p className="fieldHint">ระบบจะเปิดลิงก์นี้ในแท็บใหม่เหมือนหน้าเว็บเดิม</p>
        </section>

        <section className="editorPanel">
          <div className="panelHeading"><span className="panelNumber">02</span><div><h2>ปรับแต่งสี</h2><p>ไม่เปลี่ยนสีเดิมจนกว่าจะบันทึกค่าที่เลือก</p></div></div>
          {([
            ["pageBackgroundColor", "สีพื้นหลังหน้าเว็บ"],
            ["cardBackgroundColor", "สีพื้นหลังกรอบหลัก"],
            ["buttonBackgroundColor", "สีปุ่มหลัก"],
            ["buttonTextColor", "สีข้อความบนปุ่ม"],
          ] as Array<[ColorKey, string]>).map(([key, label]) => (
            <div className="colorRow" key={key}><label htmlFor={key}>{label}</label><div className="colorControl"><input id={key} type="color" value={config[key] || colorDefaults[key]} onChange={(e) => setColor(key, e.target.value)} /><code>{config[key] || "สีเดิม"}</code><button type="button" onClick={() => update(key, null)}>คืนสีเดิม</button></div></div>
          ))}
          <button type="button" className="resetButton" onClick={resetColors}>คืนค่าสีเดิมทั้งหมด</button>
          <div className="sectionRule" />
          <div className="panelHeading"><span className="panelNumber">03</span><div><h2>ตัวอย่างก่อนบันทึก</h2><p>ตัวอย่างจำลองคร่าว ๆ ไม่ใช่หน้าเว็บที่เผยแพร่แล้ว</p></div></div>
          <div className="livePreview" style={{ backgroundColor: config.pageBackgroundColor || "#050505" }}>
            <div className="previewCard" style={{ backgroundColor: config.cardBackgroundColor || "#141414" }}>
              {config.showImage ? <div className="previewImageWrap"><img src={config.promoImageUrl} alt={config.imageAlt} /></div> : <p className="previewHidden">ซ่อนรูปภาพอยู่</p>}
              {config.showButton ? <div className="previewButton" style={{ backgroundColor: config.buttonBackgroundColor || "#f0a900", color: config.buttonTextColor || "#171000" }}>{config.buttonText || "ข้อความบนปุ่ม"}<span>›</span></div> : <p className="previewHidden">ซ่อนปุ่มอยู่</p>}
            </div>
          </div>
          <div className="saveArea"><p>การเปลี่ยนแปลงจะมีผลเมื่อกดบันทึกเท่านั้น</p><button type="button" className="saveButton" onClick={save} disabled={saving || uploading}>{saving ? "กำลังบันทึก…" : "บันทึกการเปลี่ยนแปลง"}</button></div>
        </section>
      </div>
      <style jsx>{`
        .editorPage{min-height:100svh;padding:28px clamp(14px,4vw,48px) 48px;background:#090b0e;color:#f4f5f7;font-family:Arial,"Noto Sans Thai",sans-serif}
        .editorHeader{max-width:1200px;margin:0 auto 25px;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}
        .editorEyebrow{margin:0 0 7px;color:#e6b844;font-size:10px;letter-spacing:.2em;font-weight:900}.editorHeader h1{margin:0;font-size:clamp(24px,4vw,34px);letter-spacing:-.03em}.editorSub{margin:8px 0 0;color:#9da3ad;font-size:14px}
        .editorHeaderActions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.editorHeaderActions a,.logoutButton{border:1px solid #30343b;border-radius:10px;padding:10px 13px;background:#14171c;color:#e9ebef;font-size:12px;font-weight:700;text-decoration:none}.logoutButton{cursor:pointer}
        .editorNotice{max-width:1200px;margin:0 auto 18px;padding:13px 15px;border-radius:12px;font-size:13px}.editorError{background:#351b1d;border:1px solid #79373b;color:#ffb6b6}.editorSuccess{background:#102a20;border:1px solid #245b43;color:#a9f0ca}
        .editorGrid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;align-items:start}.editorPanel{padding:22px;border:1px solid #292d34;border-radius:18px;background:#111419;box-shadow:0 16px 45px #0002;min-width:0}
        .panelHeading{display:flex;align-items:center;gap:12px;margin-bottom:22px}.panelNumber{width:38px;height:38px;display:grid;place-items:center;flex:0 0 38px;border-radius:12px;background:#292316;color:#f0c85b;font-size:12px;font-weight:900}.panelHeading h2{font-size:17px;margin:0}.panelHeading p{font-size:12px;color:#969da8;margin:5px 0 0;line-height:1.5}
        .fieldLabel{display:block;margin:16px 0 7px;color:#d8dce2;font-size:12px;font-weight:700}.textField{width:100%;min-width:0;min-height:44px;border:1px solid #343943;border-radius:10px;padding:10px 12px;background:#090b0e;color:#f4f5f7;font-size:13px;outline:none}.textField:focus{border-color:#c9a33f}.fieldHint,.mutedNote{font-size:11px;color:#8b929e;line-height:1.6}.toggleRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 0;border-bottom:1px solid #282c33}.toggleRow strong,.toggleRow small{display:block}.toggleRow strong{font-size:13px}.toggleRow small{margin-top:4px;color:#9299a4;font-size:11px}.toggleRow input{width:19px;height:19px;accent-color:#d9ad38;cursor:pointer;flex:0 0 auto}
        .uploadField{display:flex;align-items:center;justify-content:center;text-align:center;margin-top:12px;padding:15px;border:1px dashed #555b66;border-radius:12px;color:#f0cb65;font-size:13px;font-weight:800;cursor:pointer;position:relative}.uploadField small{display:block;margin-top:5px;color:#959ca7;font-size:10px;font-weight:400}.uploadField input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}.imagePreview{margin-top:15px;overflow:hidden;border:1px solid #2b3038;border-radius:12px;background:#08090b}.imagePreview img{display:block;width:100%;max-height:260px;object-fit:contain}.imagePreview span{display:block;padding:8px 10px;color:#a6acb5;font-size:10px;background:#111419}
        .sectionRule{height:1px;background:#2a2e35;margin:22px 0}.colorRow{padding:12px 0;border-bottom:1px solid #272b32}.colorRow>label{display:block;margin-bottom:9px;color:#d9dce1;font-size:12px;font-weight:700}.colorControl{display:flex;align-items:center;gap:10px}.colorControl input{width:40px;height:36px;padding:2px;border:1px solid #3a3f48;border-radius:8px;background:#0a0c0f;cursor:pointer}.colorControl code{flex:1;color:#a9b0bb;font-size:11px}.colorControl button,.resetButton{border:1px solid #353a43;border-radius:8px;padding:8px 10px;background:#191d23;color:#c6cbd3;font-size:11px;cursor:pointer}.resetButton{margin-top:14px}
        .livePreview{margin-top:10px;padding:14px;border-radius:16px;background-image:radial-gradient(circle at 50% 10%,rgba(255,194,55,.10),transparent 28%),radial-gradient(circle at 15% 70%,rgba(0,220,255,.07),transparent 30%)}.previewCard{width:min(100%,300px);margin:auto;padding:8px;border:1px solid #ffffff1a;border-radius:18px;background:linear-gradient(180deg,#141414,#070707);box-shadow:0 15px 30px #0008}.previewImageWrap{overflow:hidden;border:1px solid #ffffff18;border-radius:13px}.previewImageWrap img{display:block;width:100%;height:auto;max-height:230px;object-fit:contain}.previewButton{position:relative;display:grid;place-items:center;min-height:46px;margin-top:10px;padding:8px 32px;border-radius:11px;font-size:13px;font-weight:900;text-align:center}.previewButton span{position:absolute;right:14px;font-size:23px}.previewHidden{text-align:center;color:#8e949e;font-size:12px;padding:12px}.saveArea{margin-top:20px;padding-top:17px;border-top:1px solid #2a2e35}.saveArea p{color:#9299a4;font-size:11px;line-height:1.5}.saveButton{width:100%;min-height:48px;border:0;border-radius:11px;background:linear-gradient(180deg,#ffdc76,#e9a800);color:#211700;font-size:13px;font-weight:900;cursor:pointer}.saveButton:disabled{opacity:.55;cursor:wait}.editorLoading{min-height:100svh;display:grid;place-items:center;background:#090b0e;color:#eee}
        @media(max-width:850px){.editorGrid{grid-template-columns:1fr}.editorPanel{padding:18px}.editorHeaderActions{width:100%}}
      `}</style>
    </main>
  );
}
