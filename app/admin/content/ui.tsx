"use client";

import { ChangeEvent, useEffect, useState } from "react";
import type { CustomButton, SiteConfig, SiteImage } from "../../../lib/site-config";

const defaults: SiteConfig = {
  customButtons: [],
  customCss: "",
  images: [{ id: "legacy-main-image", url: "/promo-square.png", alt: "Masterworld", enabled: true }],
  promoImageUrl: "/promo-square.png",
  imageAlt: "Masterworld",
  registerUrl: "https://masterworldbet.com/sign-up?ref_agent=1feacd0466b9&ref_zean=9ED5866AF713",
  buttonText: "สมัครเลย",
  pageHeadline: "",
  pageDescription: "",
  pixelId: "",
  pixelIdA: "",
  pixelIdB: "",
  mainButtonEventType: "none",
  mainButtonEventName: "",
  mainButtonIcon: "",
  mainButtonFontSize: 17,
  mainButtonFontFamily: "inherit",
  mainButtonBorderRadius: 14,
  mainButtonFullWidth: true,
  showImage: true,
  showButton: true,
  buttonPlacement: "below",
  layoutOrder: ["image:legacy-main-image", "main-button"],
  pageBackgroundColor: null,
  cardBackgroundColor: null,
  buttonBackgroundColor: null,
  buttonTextColor: null,
};

const colorDefaults = {
  pageBackgroundColor: "#050505",
  cardBackgroundColor: "#141414",
  buttonBackgroundColor: "#f0a900",
  buttonTextColor: "#171000",
};
type ColorKey = keyof typeof colorDefaults;

const standardEvents = [
  "Lead",
  "Contact",
  "CompleteRegistration",
  "Subscribe",
  "ViewContent",
  "Search",
  "AddToCart",
  "InitiateCheckout",
  "Purchase",
];

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
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function update<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
    setConfig((current) => ({ ...current, [key]: value }));
    setMessage("");
  }

  function syncLegacyImageFields(images: SiteImage[]) {
    return {
      images,
      promoImageUrl: images[0]?.url ?? "/promo-square.png",
      imageAlt: images[0]?.alt ?? "Masterworld",
      showImage: images[0]?.enabled ?? false,
    };
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;

    setUploading(true);
    setError("");
    setMessage("");
    const uploaded: SiteImage[] = [];

    try {
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);
        const response = await fetch("/api/admin/upload", { method: "POST", body: form });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `อัปโหลด ${file.name} ไม่สำเร็จ`);

        uploaded.push({
          id: `image-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          url: data.url,
          alt: file.name.replace(/\.[^.]+$/, "").slice(0, 160) || "Masterworld",
          enabled: true,
        });
      }

      setConfig((current) => {
        const images = [...(current.images ?? []), ...uploaded];
        return { ...current, ...syncLegacyImageFields(images) };
      });
      setMessage(`อัปโหลดรูปสำเร็จ ${uploaded.length} รูป อย่าลืมกดบันทึกการเปลี่ยนแปลง`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "อัปโหลดรูปไม่สำเร็จ");
    } finally {
      setUploading(false);
    }
  }

  function updateImage(id: string, patch: Partial<SiteImage>) {
    setConfig((current) => {
      const images = (current.images ?? []).map((image) =>
        image.id === id ? { ...image, ...patch } : image
      );
      return { ...current, ...syncLegacyImageFields(images) };
    });
    setMessage("");
  }

  function moveImage(index: number, direction: -1 | 1) {
    setConfig((current) => {
      const images = [...(current.images ?? [])];
      const target = index + direction;
      if (target < 0 || target >= images.length) return current;
      [images[index], images[target]] = [images[target], images[index]];
      return { ...current, ...syncLegacyImageFields(images) };
    });
    setMessage("");
  }

  function removeImage(id: string) {
    setConfig((current) => {
      const images = (current.images ?? []).filter((image) => image.id !== id);
      return { ...current, ...syncLegacyImageFields(images) };
    });
    setMessage("");
  }

  async function save() {
    setSaving(true);
    setError("");
    setMessage("");
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
    } finally {
      setSaving(false);
    }
  }

  function addCustomButton() {
    if (config.customButtons.length >= 20) {
      setError("เพิ่มปุ่มได้สูงสุด 20 ปุ่ม");
      return;
    }
    const button: CustomButton = {
      id: `button-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text: "ปุ่มใหม่",
      url: "https://example.com",
      backgroundColor: "#f0a900",
      textColor: "#171000",
      size: "medium",
      align: "center",
      enabled: true,
      eventType: "none",
      eventName: "",
      icon: "✨",
      fontSize: 15,
      fontFamily: "inherit",
      borderRadius: 12,
      fullWidth: false,
    };
    update("customButtons", [...config.customButtons, button]);
  }

  function updateCustomButton(id: string, patch: Partial<CustomButton>) {
    update(
      "customButtons",
      config.customButtons.map((button) => (button.id === id ? { ...button, ...patch } : button))
    );
  }

  function moveCustomButton(index: number, direction: -1 | 1) {
    const buttons = [...config.customButtons];
    const target = index + direction;
    if (target < 0 || target >= buttons.length) return;
    [buttons[index], buttons[target]] = [buttons[target], buttons[index]];
    update("customButtons", buttons);
  }

  function normalizedLayoutOrder(): string[] {
    const valid = [
      "headline",
      "description",
      ...(config.images ?? []).map((image) => `image:${image.id}`),
      "main-button",
      ...(config.customButtons ?? []).map((button) => `button:${button.id}`),
    ];
    const current = (config.layoutOrder ?? []).filter((id) => valid.includes(id));
    // Add both text blocks in the original text-first order for older saved layouts.
    const missingText = ["headline", "description"].filter((id) => !current.includes(id));
    current.unshift(...missingText);
    for (const id of valid) if (!current.includes(id)) current.push(id);
    return current;
  }

  function moveLayoutItem(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    const next = normalizedLayoutOrder();
    const from = next.indexOf(sourceId);
    const to = next.indexOf(targetId);
    if (from < 0 || to < 0) return;
    next.splice(from, 1);
    next.splice(to, 0, sourceId);
    update("layoutOrder", next);
  }

  function moveLayoutItemByStep(index: number, direction: -1 | 1) {
    const next = normalizedLayoutOrder();
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update("layoutOrder", next);
  }

  function layoutItemLabel(id: string) {
    if (id === "headline") return `หัวข้อหน้าเว็บ: ${config.pageHeadline || "ยังไม่ได้กรอก"}`;
    if (id === "description") return `รายละเอียดเว็บไซต์: ${config.pageDescription ? config.pageDescription.slice(0, 45) : "ยังไม่ได้กรอก"}`;
    if (id === "main-button") return `ปุ่มหลัก: ${config.buttonText}`;
    if (id.startsWith("image:")) {
      const image = config.images.find((item) => `image:${item.id}` === id);
      return image ? `รูปภาพ: ${image.alt || image.url}` : "รูปภาพ";
    }
    const button = config.customButtons.find((item) => `button:${item.id}` === id);
    return button ? `ปุ่มเพิ่มเติม: ${button.text}` : "ปุ่มเพิ่มเติม";
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    window.location.href = "/admin/analytics/login";
  }

  function setColor(key: ColorKey, value: string) {
    update(key, value as SiteConfig[ColorKey]);
  }

  function resetColors() {
    setConfig((current) => ({
      ...current,
      pageBackgroundColor: null,
      cardBackgroundColor: null,
      buttonBackgroundColor: null,
      buttonTextColor: null,
    }));
    setMessage("คืนค่าสีเดิมแล้ว กดบันทึกเพื่อใช้กับหน้าเว็บ");
  }

  if (loading) return <main className="editorLoading">กำลังโหลดการตั้งค่าเว็บไซต์…</main>;

  return (
    <main className="editorPage">
      <header className="editorHeader">
        <div>
          <p className="editorEyebrow">MASTER WORLD CLASS</p>
          <h1>จัดการหน้าเว็บไซต์</h1>
          <p className="editorSub">แยกจัดการรูปภาพ ปุ่ม และการตั้งค่าออกจากกัน</p>
        </div>
        <div className="editorHeaderActions">
          <a href="/admin">เมนูหลัก</a>
          <a href="/" target="_blank" rel="noreferrer">ดูหน้าเว็บ ↗</a>
          <a href="/admin/analytics">สถิติ</a>
          <button type="button" className="logoutButton" onClick={logout}>ออกจากระบบ</button>
        </div>
      </header>

      {error ? <div className="editorNotice editorError" role="alert">{error}</div> : null}
      {message ? <div className="editorNotice editorSuccess" role="status">{message}</div> : null}

      <div className="editorSections">
        <section className="editorPanel">
          <div className="panelHeading">
            <span className="panelNumber">01</span>
            <div><h2>ข้อความบนหน้าเว็บไซต์</h2><p>เพิ่มหัวข้อและรายละเอียดที่ต้องการให้แสดงบนหน้าเว็บจริง</p></div>
          </div>
          <label className="fieldLabel">หัวข้อหน้าเว็บ</label>
          <input className="textField" value={config.pageHeadline ?? ""} maxLength={120} placeholder="เช่น ยินดีต้อนรับสู่เว็บไซต์ของเรา" onChange={(event) => update("pageHeadline", event.target.value)} />
          <p className="fieldHint">ไม่เกิน 120 ตัวอักษร · เว้นว่างไว้หากไม่ต้องการแสดงหัวข้อ</p>
          <label className="fieldLabel" style={{ marginTop: 14 }}>รายละเอียด / คำอธิบายเว็บไซต์</label>
          <textarea className="textField" value={config.pageDescription ?? ""} maxLength={1000} rows={4} placeholder="กรอกรายละเอียดเว็บไซต์ ข่าวสาร หรือข้อความแนะนำที่ต้องการให้ผู้เข้าชมอ่าน" onChange={(event) => update("pageDescription", event.target.value)} style={{ minHeight: 100, resize: "vertical" }} />
          <p className="fieldHint">ไม่เกิน 1,000 ตัวอักษร · ข้อความจะแสดงเหนือรูปภาพและปุ่มบนหน้าเว็บ</p>
        </section>
        <section className="editorPanel">
          <div className="panelHeading">
            <span className="panelNumber">01</span>
            <div><h2>จัดการรูปภาพ</h2><p>ส่วนนี้มีเฉพาะการอัปโหลดและจัดการรูปภาพ</p></div>
          </div>

          <label className="toggleRow">
            <span><strong>แสดงรูปภาพ</strong><small>เปิดหรือซ่อนรูปภาพทั้งหมดบนหน้าเว็บหลัก</small></span>
            <input
              type="checkbox"
              checked={config.showImage}
              onChange={(event) => {
                const enabled = event.target.checked;
                setConfig((current) => {
                  const images = (current.images ?? []).map((image, index) =>
                    index === 0 ? { ...image, enabled } : image
                  );
                  return { ...current, showImage: enabled, images };
                });
              }}
            />
          </label>

          <p className="fieldHint">
            อัปโหลดหลายรูปพร้อมกัน รูปจะแสดงเรียงลงด้านล่างและไม่ตัดขอบ รองรับ JPG, PNG, WEBP หรือ GIF ตามข้อจำกัดของระบบอัปโหลด
          </p>
          <label className="uploadField">
            <span>{uploading ? "กำลังอัปโหลดรูป…" : "＋ อัปโหลดรูปภาพ"}
              <small>เลือกไฟล์ได้หลายรูป · อย่าลืมบันทึกหลังอัปโหลด</small>
            </span>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple disabled={uploading} onChange={uploadImage} />
          </label>

          {(config.images ?? []).length ? (
            <div className="imageList">
              {(config.images ?? []).map((image, index) => (
                <div className="imageItem" key={image.id}>
                  <img src={image.url} alt={image.alt} />
                  <div className="imageItemFields">
                    <strong>รูปที่ {index + 1}</strong>
                    <label className="toggleRow">
                      <span><small>แสดงรูปนี้</small></span>
                      <input type="checkbox" checked={image.enabled} onChange={(event) => updateImage(image.id, { enabled: event.target.checked })} />
                    </label>
                    <label className="fieldLabel">คำอธิบายรูป</label>
                    <input className="textField" value={image.alt} maxLength={160} onChange={(event) => updateImage(image.id, { alt: event.target.value })} />
                    <div className="smallActions">
                      <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0}>↑ เลื่อนขึ้น</button>
                      <button type="button" onClick={() => moveImage(index, 1)} disabled={index === (config.images ?? []).length - 1}>↓ เลื่อนลง</button>
                      <button type="button" onClick={() => removeImage(image.id)}>ลบรูป</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="mutedNote">ยังไม่มีรูปภาพ กดอัปโหลดเพื่อเพิ่มรูปแรก</p>}
        </section>

        <section className="editorPanel">
          <div className="panelHeading">
            <span className="panelNumber">02</span>
            <div><h2>จัดการปุ่มทั้งหมด</h2><p>ตั้งค่าปุ่มหลักและปุ่มเพิ่มเติมในพื้นที่เดียวกัน ใช้รูปแบบการปรับแต่งแบบเดียวกัน</p></div>
          </div>

          <p className="fieldHint">ปุ่มทุกปุ่มอยู่ในรายการเดียวกัน ปรับข้อความ ไอคอน ฟอนต์ สี ขนาด ลิงก์ และ Event ได้เหมือนกัน</p>
          <button type="button" className="addButton" onClick={addCustomButton}>＋ เพิ่มปุ่มใหม่</button>

          <div className="customButtonEditor">
            <div className="customButtonEditorTop">
              <strong>ปุ่ม 1 · ปุ่มหลัก</strong>
              <label className="toggleRow" style={{ margin: 0, padding: 0, border: 0 }}><span>{config.showButton ? "แสดง" : "ซ่อน"}</span><input type="checkbox" checked={config.showButton} onChange={(event) => update("showButton", event.target.checked)} /></label>
            </div>
            <details className="buttonSettingsDetails" open>
              <summary>แก้ไขข้อความ ไอคอน สี ขนาด ฟอนต์ และลิงก์</summary>
              <div className="buttonSettingsBody">
                <label className="fieldLabel">ข้อความบนปุ่ม</label>
                <input className="textField" value={config.buttonText} maxLength={80} onChange={(event) => update("buttonText", event.target.value)} />
                <label className="fieldLabel">ลิงก์ปลายทาง (HTTPS)</label>
                <input className="textField" type="url" value={config.registerUrl} onChange={(event) => update("registerUrl", event.target.value)} required />
                <div className="customButtonFields customButtonFieldsWide">
                  <label>ไอคอน (Emoji)<input className="textField" value={config.mainButtonIcon ?? ""} maxLength={24} placeholder="เช่น 💬 หรือ ⭐" onChange={(event) => update("mainButtonIcon", event.target.value)} /></label>
                  <label>ขนาดตัวอักษร: {config.mainButtonFontSize ?? 17} px<input type="range" min="10" max="32" value={config.mainButtonFontSize ?? 17} onChange={(event) => update("mainButtonFontSize", Number(event.target.value))} /></label>
                  <label>ฟอนต์<select value={config.mainButtonFontFamily ?? "inherit"} onChange={(event) => update("mainButtonFontFamily", event.target.value as SiteConfig["mainButtonFontFamily"])}><option value="inherit">ฟอนต์เว็บไซต์</option><option value="Arial">Arial</option><option value="Tahoma">Tahoma</option><option value="Noto Sans Thai">Noto Sans Thai</option><option value="Georgia">Georgia</option></select></label>
                  <label>ความโค้งมุม: {config.mainButtonBorderRadius ?? 14} px<input type="range" min="0" max="40" value={config.mainButtonBorderRadius ?? 14} onChange={(event) => update("mainButtonBorderRadius", Number(event.target.value))} /></label>
                </div>
                <label className="toggleRow"><span><strong>เต็มความกว้าง</strong><small>ให้ปุ่มขยายเต็มพื้นที่</small></span><input type="checkbox" checked={config.mainButtonFullWidth ?? true} onChange={(event) => update("mainButtonFullWidth", event.target.checked)} /></label>
                <label className="fieldLabel">ตำแหน่งปุ่มเทียบกับรูปภาพ</label>
                <select className="textField" value={config.buttonPlacement ?? "below"} onChange={(event) => update("buttonPlacement", event.target.value as SiteConfig["buttonPlacement"])}><option value="above">วางเหนือรูปทั้งหมด</option><option value="below">วางใต้รูปทั้งหมด</option><option value="overlay-top">ซ้อนบนรูปแรกด้านบน</option><option value="overlay-bottom">ซ้อนบนรูปแรกด้านล่าง</option></select>
                <label className="fieldLabel">Meta Pixel Event ของปุ่มนี้</label>
                <select className="textField" value={config.mainButtonEventType} onChange={(event) => update("mainButtonEventType", event.target.value as SiteConfig["mainButtonEventType"])}><option value="none">ไม่ส่ง Event</option><option value="standard">Standard Event</option><option value="custom">Custom Event</option></select>
                {config.mainButtonEventType === "standard" ? <select className="textField" value={config.mainButtonEventName} onChange={(event) => update("mainButtonEventName", event.target.value)}>{standardEvents.map((eventName) => <option key={eventName} value={eventName}>{eventName}</option>)}</select> : null}
                {config.mainButtonEventType === "custom" ? <input className="textField" value={config.mainButtonEventName} maxLength={80} placeholder="เช่น MyButtonClick" onChange={(event) => update("mainButtonEventName", event.target.value.replace(/[^a-zA-Z0-9_]/g, ""))} /> : null}
                <div className="customButtonSample"><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: config.mainButtonFullWidth === false ? "auto" : "100%", background: config.buttonBackgroundColor || "#00e719", color: config.buttonTextColor || "#071507", fontSize: config.mainButtonFontSize ?? 17, fontFamily: config.mainButtonFontFamily && config.mainButtonFontFamily !== "inherit" ? config.mainButtonFontFamily : "inherit", borderRadius: config.mainButtonBorderRadius ?? 14, padding: "14px 20px", opacity: config.showButton ? 1 : 0.45 }}>{config.mainButtonIcon ? <span>{config.mainButtonIcon}</span> : null}{config.buttonText || "ตัวอย่างปุ่ม"} <span>›</span></span></div>
              </div>
            </details>
          </div>

          {config.customButtons.map((button, index) => (
            <div className="customButtonEditor" key={button.id}>
              <div className="customButtonEditorTop">
                <strong>ปุ่ม {index + 2}</strong>
                <div className="smallActions">
                  <button type="button" onClick={() => moveCustomButton(index, -1)} disabled={index === 0} aria-label="เลื่อนปุ่มขึ้น">↑</button>
                  <button type="button" onClick={() => moveCustomButton(index, 1)} disabled={index === config.customButtons.length - 1} aria-label="เลื่อนปุ่มลง">↓</button>
                  <button type="button" onClick={() => updateCustomButton(button.id, { enabled: !button.enabled })}>{button.enabled ? "ซ่อน" : "แสดง"}</button>
                  <button type="button" onClick={() => update("customButtons", config.customButtons.filter((item) => item.id !== button.id))}>ลบ</button>
                </div>
              </div>
              <details className="buttonSettingsDetails">
                <summary>แก้ไขข้อความ ไอคอน สี ขนาด ฟอนต์ และลิงก์</summary>
                <div className="buttonSettingsBody">
                  <label className="fieldLabel">ข้อความบนปุ่ม</label>
                  <input className="textField" value={button.text} maxLength={80} onChange={(event) => updateCustomButton(button.id, { text: event.target.value })} />
                  <div className="customButtonFields customButtonFieldsWide">
                    <label>ไอคอน (Emoji)<input className="textField" value={button.icon ?? ""} maxLength={24} placeholder="เช่น 💬 หรือ ⭐" onChange={(event) => updateCustomButton(button.id, { icon: event.target.value })} /></label>
                    <label>ขนาดตัวอักษร: {button.fontSize ?? 15} px<input type="range" min="10" max="32" value={button.fontSize ?? 15} onChange={(event) => updateCustomButton(button.id, { fontSize: Number(event.target.value) })} /></label>
                    <label>ฟอนต์<select value={button.fontFamily ?? "inherit"} onChange={(event) => updateCustomButton(button.id, { fontFamily: event.target.value as CustomButton["fontFamily"] })}><option value="inherit">ฟอนต์เว็บไซต์</option><option value="Arial">Arial</option><option value="Tahoma">Tahoma</option><option value="Noto Sans Thai">Noto Sans Thai</option><option value="Georgia">Georgia</option></select></label>
                    <label>ความโค้งมุม: {button.borderRadius ?? 12} px<input type="range" min="0" max="40" value={button.borderRadius ?? 12} onChange={(event) => updateCustomButton(button.id, { borderRadius: Number(event.target.value) })} /></label>
                  </div>
                  <label className="toggleRow"><span><strong>เต็มความกว้าง</strong><small>ให้ปุ่มขยายเต็มพื้นที่</small></span><input type="checkbox" checked={button.fullWidth ?? true} onChange={(event) => updateCustomButton(button.id, { fullWidth: event.target.checked })} /></label>
                  <label className="fieldLabel">ลิงก์ปลายทาง (HTTPS)</label><input className="textField" type="url" value={button.url} onChange={(event) => updateCustomButton(button.id, { url: event.target.value })} />
                  <div className="customButtonFields"><label>สีปุ่ม<input type="color" value={button.backgroundColor} onChange={(event) => updateCustomButton(button.id, { backgroundColor: event.target.value })} /></label><label>สีข้อความ<input type="color" value={button.textColor} onChange={(event) => updateCustomButton(button.id, { textColor: event.target.value })} /></label><label>ขนาด<select value={button.size} onChange={(event) => updateCustomButton(button.id, { size: event.target.value as CustomButton["size"] })}><option value="small">เล็ก</option><option value="medium">กลาง</option><option value="large">ใหญ่</option></select></label><label>ตำแหน่ง<select value={button.align} onChange={(event) => updateCustomButton(button.id, { align: event.target.value as CustomButton["align"] })}><option value="left">ซ้าย</option><option value="center">กลาง</option><option value="right">ขวา</option></select></label></div>
                  <label className="fieldLabel">Meta Pixel Event ของปุ่มนี้</label><select className="textField" value={button.eventType ?? "none"} onChange={(event) => updateCustomButton(button.id, { eventType: event.target.value as CustomButton["eventType"] })}><option value="none">ไม่ส่ง Event</option><option value="standard">Standard Event</option><option value="custom">Custom Event</option></select>
                  {button.eventType === "standard" ? <select className="textField" value={button.eventName || "Lead"} onChange={(event) => updateCustomButton(button.id, { eventName: event.target.value })}>{standardEvents.map((eventName) => <option key={eventName} value={eventName}>{eventName}</option>)}</select> : null}
                  {button.eventType === "custom" ? <input className="textField" value={button.eventName || ""} maxLength={80} placeholder="เช่น MyButtonClick" onChange={(event) => updateCustomButton(button.id, { eventName: event.target.value.replace(/[^a-zA-Z0-9_]/g, "") })} /> : null}
                  <div className="customButtonSample"><span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: button.fullWidth ?? true ? "100%" : "auto", background: button.backgroundColor, color: button.textColor, fontSize: button.fontSize ?? 15, fontFamily: button.fontFamily && button.fontFamily !== "inherit" ? button.fontFamily : "inherit", borderRadius: button.borderRadius ?? 12, padding: "14px 20px", opacity: button.enabled ? 1 : 0.45 }}>{button.icon ? <span>{button.icon}</span> : null}{button.text || "ตัวอย่างปุ่ม"} <span>›</span></span></div>
                </div>
              </details>
            </div>
          ))}

        </section>

        <section className="editorPanel settingsPanel">
          <div className="panelHeading">
            <span className="panelNumber">04</span>
            <div><h2>การตั้งค่าทั่วไป</h2><p>Pixel สี ตัวอย่าง และลำดับแสดงผล</p></div>
          </div>

          <label className="fieldLabel">Meta Pixel ID A</label>
          <input className="textField" inputMode="numeric" value={config.pixelIdA ?? ""} maxLength={30} placeholder="Pixel ID สำหรับลิงก์ mw_source=a" onChange={(event) => update("pixelIdA", event.target.value.replace(/\D/g, ""))} />
          <p className="fieldHint">ใช้กับผู้เข้าชมที่เข้ามาผ่านลิงก์ที่มี mw_source=a</p>

          <label className="fieldLabel" style={{ marginTop: 12 }}>Meta Pixel ID B</label>
          <input className="textField" inputMode="numeric" value={config.pixelIdB ?? ""} maxLength={30} placeholder="Pixel ID สำหรับลิงก์ mw_source=b" onChange={(event) => update("pixelIdB", event.target.value.replace(/\D/g, ""))} />
          <p className="fieldHint">ใช้กับผู้เข้าชมที่เข้ามาผ่านลิงก์ที่มี mw_source=b</p>
          <p className="fieldHint">ค่า Pixel ID เดิมยังคงเก็บไว้เพื่อรองรับการตั้งค่าเก่าและตัวแปร NEXT_PUBLIC_META_PIXEL_ID</p>

          <div className="sectionRule" />
          <div className="panelHeading compactHeading"><span className="panelNumber">05</span><div><h2>ปรับแต่งสี</h2><p>ไม่เปลี่ยนสีเดิมจนกว่าจะบันทึกค่าที่เลือก</p></div></div>
          {([
            ["pageBackgroundColor", "สีพื้นหลังหน้าเว็บ"],
            ["cardBackgroundColor", "สีพื้นหลังกรอบหลัก"],
            ["buttonBackgroundColor", "สีปุ่มหลัก"],
            ["buttonTextColor", "สีข้อความบนปุ่ม"],
          ] as Array<[ColorKey, string]>).map(([key, label]) => (
            <div className="colorRow" key={key}>
              <label htmlFor={key}>{label}</label>
              <div className="colorControl">
                <input id={key} type="color" value={config[key] || colorDefaults[key]} onChange={(event) => setColor(key, event.target.value)} />
                <code>{config[key] || "สีเดิม"}</code>
                <button type="button" onClick={() => update(key, null)}>คืนสีเดิม</button>
              </div>
            </div>
          ))}
          <button type="button" className="resetButton" onClick={resetColors}>คืนค่าสีเดิมทั้งหมด</button>

          <div className="sectionRule" />
          <div className="panelHeading compactHeading"><span className="panelNumber">CSS</span><div><h2>โค้ดตกแต่งเว็บไซต์ (Custom CSS)</h2><p>เพิ่ม CSS สำหรับหน้าเว็บหลัก โดยไม่เปลี่ยนระบบอื่น</p></div></div>
          <label className="fieldLabel" htmlFor="custom-css-editor">วางโค้ด CSS (ไม่ต้องใส่ &lt;style&gt;)</label>
          <textarea id="custom-css-editor" className="textField" rows={10} maxLength={12000}
            spellCheck={false} value={config.customCss ?? ""}
            onChange={(event) => update("customCss", event.target.value)}
            placeholder={".landingCard { border-radius: 20px; }\n.registerButton { box-shadow: 0 0 20px #f0a900; }"}
            style={{ width: "100%", minHeight: 200, resize: "vertical", fontFamily: "monospace", fontSize: 13, lineHeight: 1.6 }} />
          <p className="fieldHint">รองรับ CSS เท่านั้น ไม่รองรับ JavaScript, @import หรือ url() · กดบันทึกเพื่อใช้บนหน้าเว็บจริง · ตัวอย่างด้านล่างไม่แสดง Custom CSS</p>
          <button type="button" className="resetButton" onClick={() => update("customCss", "")}>ล้างโค้ด CSS</button>

          <div className="sectionRule" />
          <div className="panelHeading compactHeading"><span className="panelNumber">06</span><div><h2>ลำดับการแสดงผล</h2><p>จัดลำดับรูปและปุ่มบนหน้าเว็บหลัก</p></div></div>
          <p className="fieldHint">ลากรายการเพื่อย้ายตำแหน่ง รายการนี้แสดงรวมกันเฉพาะเพื่อกำหนดลำดับหน้าเว็บ ส่วนการแก้ไขรูปและปุ่มอยู่ในคนละส่วนด้านบน</p>
          <div className="layoutOrderList">
            {normalizedLayoutOrder().map((id, index) => (
              <div
                className="layoutOrderItem"
                key={id}
                draggable
                onDragStart={(event) => { event.dataTransfer.setData("text/plain", id); event.dataTransfer.effectAllowed = "move"; }}
                onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }}
                onDrop={(event) => { event.preventDefault(); moveLayoutItem(event.dataTransfer.getData("text/plain"), id); }}
              >
                <span className="dragHandle" aria-hidden="true">⠿</span>
                <span className="layoutOrderNumber">{index + 1}</span>
                <span className="layoutOrderLabel">{layoutItemLabel(id)}</span>
                <div className="layoutOrderControls">
                  <button type="button" onClick={() => moveLayoutItemByStep(index, -1)} disabled={index === 0} aria-label="เลื่อนขึ้น">↑</button>
                  <button type="button" onClick={() => moveLayoutItemByStep(index, 1)} disabled={index === normalizedLayoutOrder().length - 1} aria-label="เลื่อนลง">↓</button>
                </div>
                <span className="dragHint">ลากหรือใช้ปุ่มลูกศร</span>
              </div>
            ))}
          </div>

          <div className="sectionRule" />
          <div className="panelHeading compactHeading"><span className="panelNumber">07</span><div><h2>ตัวอย่างก่อนบันทึก</h2><p>ตัวอย่างจำลองคร่าว ๆ ไม่ใช่หน้าเว็บที่เผยแพร่แล้ว</p></div></div>
          <div className="livePreview" style={{ backgroundColor: config.pageBackgroundColor || "#050505" }}>
            <div className="previewCard" style={{ backgroundColor: config.cardBackgroundColor || "#141414" }}>
              <div className="previewLayoutStack">
                {normalizedLayoutOrder().map((id) => {
                  if (id === "headline") return config.pageHeadline ? <h3 key={id} className="previewHeadline">{config.pageHeadline}</h3> : null;
                  if (id === "description") return config.pageDescription ? <p key={id} className="previewDescription">{config.pageDescription}</p> : null;
                  if (id.startsWith("image:")) {
                    const image = (config.images ?? []).find((item) => `image:${item.id}` === id);
                    return image?.enabled ? <div className="previewImageWrap" key={id}><img src={image.url} alt={image.alt} /></div> : null;
                  }
                  if (id === "main-button") return config.showButton ? (
                    <div className="previewMainButtonRow" key={id}>
                      <div className="previewButton" style={{
                        background: config.buttonBackgroundColor || "linear-gradient(180deg,#00f51b,#00d91b)",
                        color: config.buttonTextColor || "#071507",
                        borderRadius: config.mainButtonBorderRadius ?? 14,
                        fontSize: config.mainButtonFontSize ?? 17,
                        fontFamily: config.mainButtonFontFamily && config.mainButtonFontFamily !== "inherit" ? config.mainButtonFontFamily : "inherit",
                        width: config.mainButtonFullWidth === false ? "auto" : "100%",
                      }}>
                        {config.mainButtonIcon ? <span aria-hidden="true" className="previewMainIcon">{config.mainButtonIcon}</span> : null}
                        <span className="previewButtonText">{config.buttonText}</span>
                        <span className="previewButtonArrow" aria-hidden="true">›</span>
                      </div>
                    </div>
                  ) : null;
                  if (id.startsWith("button:")) {
                    const button = (config.customButtons ?? []).find((item) => `button:${item.id}` === id);
                    if (!button?.enabled) return null;
                    return <div className="previewCustomButton" key={id} style={{ justifyContent: button.align, width: "100%" }}>
                      <div className="previewCustomButtonInner" style={{
                        background: button.backgroundColor,
                        color: button.textColor,
                        fontSize: button.fontSize ?? (button.size === "small" ? 13 : button.size === "large" ? 17 : 15),
                        fontFamily: button.fontFamily && button.fontFamily !== "inherit" ? button.fontFamily : "inherit",
                        borderRadius: button.borderRadius ?? 12,
                        minHeight: button.size === "small" ? 36 : button.size === "medium" ? 46 : 56,
                        padding: button.size === "small" ? "9px 14px" : button.size === "large" ? "14px 20px" : "11px 16px",
                        width: (button.fullWidth ?? button.size === "large") ? "100%" : "auto",
                      }}>
                        {button.icon ? <span className="previewCustomIcon" aria-hidden="true">{button.icon}</span> : null}
                        <span className="previewCustomText">{button.text || "ตัวอย่างปุ่ม"}</span>
                        <span className="previewCustomArrow" aria-hidden="true">›</span>
                      </div>
                    </div>;
                  }
                  return null;
                })}
              </div>
            </div>
          </div>

          <div className="saveArea">
            <p>ตัวอย่างด้านบนอัปเดตทันทีเมื่อแก้ไข การกดบันทึกจะนำค่าที่ตั้งไว้ไปใช้บนหน้าเว็บจริง</p>
            <button type="button" className="saveButton" onClick={save} disabled={saving || uploading}>
              {saving ? "กำลังบันทึก…" : "บันทึกการเปลี่ยนแปลง"}
            </button>
          </div>
        </section>
      </div>

      <style jsx>{`
        .editorPage{min-height:100svh;padding:28px clamp(14px,4vw,48px) 48px;background:#090b0e;color:#f4f5f7;font-family:Arial,"Noto Sans Thai",sans-serif}
        .editorHeader{max-width:1200px;margin:0 auto 25px;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}
        .editorEyebrow{margin:0 0 7px;color:#e6b844;font-size:10px;letter-spacing:.2em;font-weight:900}.editorHeader h1{margin:0;font-size:clamp(24px,4vw,34px);letter-spacing:-.03em}.editorSub{margin:8px 0 0;color:#9da3ad;font-size:14px}
        .editorHeaderActions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.editorHeaderActions a,.logoutButton{border:1px solid #30343b;border-radius:10px;padding:10px 13px;background:#14171c;color:#e9ebef;font-size:12px;font-weight:700;text-decoration:none}.logoutButton{cursor:pointer}
        .editorNotice{max-width:1200px;margin:0 auto 18px;padding:13px 15px;border-radius:12px;font-size:13px}.editorError{background:#351b1d;border:1px solid #79373b;color:#ffb6b6}.editorSuccess{background:#102a20;border:1px solid #245b43;color:#a9f0ca}
        .editorSections{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;align-items:start}
        .editorPanel{padding:22px;border:1px solid #292d34;border-radius:18px;background:#111419;box-shadow:0 16px 45px #0002;min-width:0}
        .settingsPanel{grid-column:1/-1}
        .panelHeading{display:flex;align-items:center;gap:12px;margin-bottom:22px}.compactHeading{margin-top:4px}.panelNumber{width:38px;height:38px;display:grid;place-items:center;flex:0 0 38px;border-radius:12px;background:#292316;color:#f0c85b;font-size:12px;font-weight:900}.panelHeading h2{font-size:17px;margin:0}.panelHeading p{font-size:12px;color:#969da8;margin:5px 0 0;line-height:1.5}
        .fieldLabel{display:block;margin:16px 0 7px;color:#d8dce2;font-size:12px;font-weight:700}.textField{width:100%;min-width:0;min-height:44px;border:1px solid #343943;border-radius:10px;padding:10px 12px;background:#090b0e;color:#f4f5f7;font-size:13px;outline:none}.textField:focus{border-color:#c9a33f}.fieldHint,.mutedNote{font-size:11px;color:#8b929e;line-height:1.6}
        .toggleRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 0;border-bottom:1px solid #282c33}.toggleRow strong,.toggleRow small{display:block}.toggleRow strong{font-size:13px}.toggleRow small{margin-top:4px;color:#9299a4;font-size:11px}.toggleRow input{width:19px;height:19px;accent-color:#d9ad38;cursor:pointer;flex:0 0 auto}
        .uploadField{display:flex;align-items:center;justify-content:center;text-align:center;margin-top:12px;padding:15px;border:1px dashed #555b66;border-radius:12px;color:#f0cb65;font-size:13px;font-weight:800;cursor:pointer;position:relative}.uploadField small{display:block;margin-top:5px;color:#959ca7;font-size:10px;font-weight:400}.uploadField input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}
        .imageList{display:grid;gap:12px;margin-top:14px}.imageItem{display:grid;grid-template-columns:minmax(90px,140px) minmax(0,1fr);gap:12px;padding:12px;border:1px solid #30343b;border-radius:12px;background:#0c0f13}.imageItem>img{display:block;width:100%;height:auto;max-height:220px;object-fit:contain;align-self:start;background:#08090b;border-radius:8px}.imageItemFields{min-width:0}.imageItemFields>.toggleRow{padding:4px 0}
        .sectionRule{height:1px;background:#2a2e35;margin:22px 0}.smallActions{display:flex;gap:5px;flex-wrap:wrap;margin-top:10px}.smallActions button{padding:6px 9px;border:1px solid #353a43;border-radius:7px;background:#191d23;color:#e8eaf0;cursor:pointer}.smallActions button:disabled{opacity:.35;cursor:default}
        .addButton{width:100%;padding:12px;border:1px dashed #b88c2b;border-radius:10px;background:#282216;color:#ffd45e;font-weight:800;cursor:pointer}.customButtonEditor{margin-top:10px;padding:12px;border:1px solid #30343b;border-radius:12px;background:#0c0f13}.customButtonEditorTop{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px}
        .buttonSettingsDetails{margin-top:10px;border-top:1px solid #272b32;padding-top:9px}.buttonSettingsDetails>summary{cursor:pointer;color:#e7c65f;font-size:11px;font-weight:700;padding:5px 0}.buttonSettingsBody{padding-top:5px}.customButtonFields{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:12px}.customButtonFields label{display:grid;min-width:0;overflow-wrap:anywhere;gap:6px;color:#aab1bd;font-size:11px}.customButtonFields input[type=range]{width:100%;min-width:0;accent-color:#e6b844}.customButtonFields input[type=color]{width:100%;height:34px;border:1px solid #343943;border-radius:6px;background:#111419}.customButtonFields select{width:100%;min-width:0;padding:8px;border:1px solid #343943;border-radius:6px;background:#090b0e;color:#fff}
        .customButtonSample{display:flex;margin-top:12px;padding:10px;background:#08090b;border-radius:8px}.customButtonSample span{display:inline-block;border-radius:8px;font-weight:800}
        .colorRow{padding:12px 0;border-bottom:1px solid #272b32}.colorRow>label{display:block;margin-bottom:9px;color:#d9dce1;font-size:12px;font-weight:700}.colorControl{display:flex;align-items:center;gap:10px}.colorControl input{width:40px;height:36px;padding:2px;border:1px solid #3a3f48;border-radius:8px;background:#0a0c0f;cursor:pointer}.colorControl code{flex:1;color:#a9b0bb;font-size:11px}.colorControl button,.resetButton{border:1px solid #353a43;border-radius:8px;padding:8px 10px;background:#191d23;color:#c6cbd3;font-size:11px;cursor:pointer}.resetButton{margin-top:14px}
        .layoutOrderControls{display:flex;gap:4px;flex:0 0 auto}.layoutOrderControls button{border:1px solid #343b46;border-radius:7px;background:#171b22;color:#f3c84b;padding:4px 8px;cursor:pointer}.layoutOrderControls button:disabled{opacity:.3;cursor:not-allowed}.layoutOrderList{display:grid;gap:8px;margin-top:12px;max-height:320px;overflow:auto;padding-right:4px;overscroll-behavior:contain}.layoutOrderItem{display:flex;align-items:center;gap:9px;padding:11px;border:1px solid #3b414b;border-radius:10px;background:#0b0e12;cursor:grab;user-select:none}.layoutOrderItem:active{cursor:grabbing}.dragHandle{font-size:20px;color:#f0c44f}.layoutOrderNumber{display:grid;place-items:center;min-width:25px;height:25px;border-radius:7px;background:#302816;color:#ffd45e;font-size:11px;font-weight:800}.layoutOrderLabel{flex:1;min-width:0;overflow-wrap:anywhere;font-size:12px;color:#f2f4f8}.dragHint{font-size:10px;color:#8f98a6}
        .previewLayoutStack{display:flex;flex-direction:column;gap:8px;min-width:0}.previewHeadline{margin:8px 14px 4px;color:#fff;text-align:center;font-size:22px;font-weight:800;line-height:1.4;overflow-wrap:anywhere}.previewDescription{margin:0 16px 12px;color:#e5e7eb;text-align:center;font-size:14px;line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere}.previewMainButtonRow{display:flex;width:auto;min-width:0;margin:12px}.previewMainIcon{margin-right:8px;flex:0 0 auto}.previewButton{position:relative;display:flex;align-items:center;justify-content:center;box-sizing:border-box;min-height:56px;padding:0 48px;border:1px solid rgba(255,215,100,.65);font-weight:900;line-height:1.35;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.35);overflow-wrap:anywhere}.previewButtonText{display:block;min-width:0;overflow-wrap:anywhere}.previewButtonArrow{position:absolute;right:18px;font-size:26px;line-height:1}.previewCustomButtonInner{max-width:100%;overflow-wrap:anywhere}.previewCustomText{overflow-wrap:anywhere}.livePreview{margin-top:10px;padding:14px;border-radius:16px;background-image:radial-gradient(circle at 50% 10%,rgba(255,194,55,.10),transparent 28%),radial-gradient(circle at 15% 70%,rgba(0,220,255,.07),transparent 30%)}.previewCard{width:min(100%,300px);margin:auto;padding:0;border:1px solid #ffffff1a;border-radius:18px;background:linear-gradient(180deg,#141414,#070707);box-shadow:0 15px 30px #0008;box-sizing:border-box}.previewImageWrap{overflow:hidden;border:0;border-radius:0}.previewImageWrap+.previewImageWrap{margin-top:8px}.previewImageWrap img{display:block;width:100%;height:auto;max-width:100%;object-fit:contain}.previewButton{position:relative;display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:100%;min-height:46px;margin-top:10px;padding:8px 42px;border-radius:11px;font-size:13px;font-weight:900;text-align:center}.previewButtonText{display:block;position:static!important;overflow-wrap:anywhere}.previewButton .previewButtonArrow{position:absolute;right:14px;font-size:23px}.previewCustomButton{display:flex;width:100%;margin-top:8px;min-width:0}.previewCustomButtonInner{display:flex;align-items:center;justify-content:space-between;gap:10px;box-sizing:border-box;width:100%;min-width:0;font-weight:800;text-align:center;overflow-wrap:anywhere}.previewCustomIcon,.previewCustomArrow{flex:0 0 auto;line-height:1}.previewCustomText{flex:1 1 auto;min-width:0}.previewCustomArrow{font-size:23px}.previewHidden{text-align:center;color:#8e949e;font-size:12px;padding:12px}
        .saveArea{margin-top:20px;padding-top:17px;border-top:1px solid #2a2e35}.saveArea p{color:#9299a4;font-size:11px;line-height:1.5}.saveButton{width:100%;min-height:48px;border:0;border-radius:11px;background:linear-gradient(180deg,#ffdc76,#e9a800);color:#211700;font-size:13px;font-weight:900;cursor:pointer}.saveButton:disabled{opacity:.55;cursor:wait}.editorLoading{min-height:100svh;display:grid;place-items:center;background:#090b0e;color:#eee}
        @media(max-width:850px){.editorSections{grid-template-columns:1fr}.settingsPanel{grid-column:auto}.editorPanel{padding:18px}.editorHeaderActions{width:100%}.customButtonFields{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:520px){.customButtonFields{grid-template-columns:repeat(2,minmax(0,1fr))}.customButtonEditorTop{align-items:flex-start}.imageItem{grid-template-columns:1fr}.imageItem>img{max-height:300px}.colorControl{flex-wrap:wrap}.colorControl code{min-width:80px}}
      `}</style>
    </main>
  );
}
