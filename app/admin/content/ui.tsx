"use client";

import { ChangeEvent, useEffect, useState } from "react";
import type { CustomButton, SiteConfig, SiteImage } from "../../../lib/site-config";

const defaults: SiteConfig = {
  customButtons: [],
  images: [{ id: "legacy-main-image", url: "/promo-square.png", alt: "Masterworld", enabled: true }],
  promoImageUrl: "/promo-square.png",
  imageAlt: "Masterworld",
  registerUrl: "https://masterworldbet.com/sign-up?ref_agent=1feacd0466b9&ref_zean=9ED5866AF713",
  buttonText: "สมัครเลย",
  pixelId: "",
  pixelIdA: "",
  pixelIdB: "",
  mainButtonEventType: "none",
  mainButtonEventName: "",
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
      ...(config.images ?? []).map((image) => `image:${image.id}`),
      "main-button",
      ...(config.customButtons ?? []).map((button) => `button:${button.id}`),
    ];
    const current = (config.layoutOrder ?? []).filter((id) => valid.includes(id));
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

  function layoutItemLabel(id: string) {
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
            <div><h2>จัดการปุ่ม</h2><p>ส่วนนี้มีเฉพาะการตั้งค่าปุ่มและ Event ของแต่ละปุ่ม</p></div>
          </div>

          <label className="toggleRow">
            <span><strong>แสดงปุ่มหลัก</strong><small>เปิดหรือซ่อนปุ่มหลักบนหน้าเว็บ</small></span>
            <input type="checkbox" checked={config.showButton} onChange={(event) => update("showButton", event.target.checked)} />
          </label>

          <label className="fieldLabel" htmlFor="button-text">ข้อความบนปุ่มหลัก</label>
          <input id="button-text" className="textField" value={config.buttonText} maxLength={80} onChange={(event) => update("buttonText", event.target.value)} />

          <label className="fieldLabel" htmlFor="register-url">ลิงก์ปลายทางของปุ่มหลัก (HTTPS)</label>
          <input id="register-url" className="textField" type="url" value={config.registerUrl} onChange={(event) => update("registerUrl", event.target.value)} required />

          <label className="fieldLabel" htmlFor="button-placement">ตำแหน่งปุ่มหลักเทียบกับรูปภาพ</label>
          <select id="button-placement" className="textField" value={config.buttonPlacement ?? "below"} onChange={(event) => update("buttonPlacement", event.target.value as SiteConfig["buttonPlacement"])}>
            <option value="above">วางปุ่มเหนือรูปทั้งหมด</option>
            <option value="below">วางปุ่มใต้รูปทั้งหมด</option>
            <option value="overlay-top">ซ้อนบนรูปแรกด้านบน</option>
            <option value="overlay-bottom">ซ้อนบนรูปแรกด้านล่าง</option>
          </select>
          <p className="fieldHint">ตำแหน่งแสดงผลจริงอาจขึ้นกับวิธีจัดเรียงในส่วน “ลำดับการแสดงผล” ด้านล่าง</p>

          <label className="fieldLabel">Meta Pixel Event ของปุ่มหลัก</label>
          <select className="textField" value={config.mainButtonEventType} onChange={(event) => update("mainButtonEventType", event.target.value as SiteConfig["mainButtonEventType"])}>
            <option value="none">ไม่ส่ง Event</option>
            <option value="standard">Standard Event</option>
            <option value="custom">Custom Event</option>
          </select>
          {config.mainButtonEventType === "standard" ? (
            <select className="textField" value={config.mainButtonEventName} onChange={(event) => update("mainButtonEventName", event.target.value)}>
              {standardEvents.map((eventName) => <option key={eventName} value={eventName}>{eventName}</option>)}
            </select>
          ) : null}
          {config.mainButtonEventType === "custom" ? (
            <input className="textField" value={config.mainButtonEventName} maxLength={80} placeholder="เช่น MyButtonClick" onChange={(event) => update("mainButtonEventName", event.target.value.replace(/[^a-zA-Z0-9_]/g, ""))} />
          ) : null}
          <p className="fieldHint">เลือก Event ให้ตรงกับการกระทำที่เกิดขึ้นจริง การคลิกปุ่มไม่ควรนับเป็นการสมัครสำเร็จหากยังไม่ได้สมัคร</p>

          <div className="sectionRule" />
          <div className="panelHeading compactHeading">
            <span className="panelNumber">03</span>
            <div><h2>ปุ่มเพิ่มเติม</h2><p>เพิ่มและจัดการปุ่มอื่นแยกจากส่วนรูปภาพ</p></div>
          </div>
          <button type="button" className="addButton" onClick={addCustomButton}>＋ เพิ่มปุ่มใหม่</button>
          {config.customButtons.length === 0 ? <p className="mutedNote">ยังไม่มีปุ่มเพิ่มเติม กด “เพิ่มปุ่มใหม่” เพื่อสร้างปุ่มแรก</p> : null}

          {config.customButtons.map((button, index) => (
            <div className="customButtonEditor" key={button.id}>
              <div className="customButtonEditorTop">
                <strong>ปุ่มเพิ่มเติม {index + 1}</strong>
                <div className="smallActions">
                  <button type="button" onClick={() => moveCustomButton(index, -1)} disabled={index === 0} aria-label="เลื่อนปุ่มขึ้น">↑</button>
                  <button type="button" onClick={() => moveCustomButton(index, 1)} disabled={index === config.customButtons.length - 1} aria-label="เลื่อนปุ่มลง">↓</button>
                  <button type="button" onClick={() => updateCustomButton(button.id, { enabled: !button.enabled })}>{button.enabled ? "ซ่อน" : "แสดง"}</button>
                  <button type="button" onClick={() => update("customButtons", config.customButtons.filter((item) => item.id !== button.id))}>ลบ</button>
                </div>
              </div>
              <label className="fieldLabel">ข้อความบนปุ่ม</label>
              <input className="textField" value={button.text} maxLength={80} onChange={(event) => updateCustomButton(button.id, { text: event.target.value })} />
              <label className="fieldLabel">ลิงก์ปลายทาง (HTTPS)</label>
              <input className="textField" type="url" value={button.url} onChange={(event) => updateCustomButton(button.id, { url: event.target.value })} />

              <div className="customButtonFields">
                <label>สีปุ่ม<input type="color" value={button.backgroundColor} onChange={(event) => updateCustomButton(button.id, { backgroundColor: event.target.value })} /></label>
                <label>สีข้อความ<input type="color" value={button.textColor} onChange={(event) => updateCustomButton(button.id, { textColor: event.target.value })} /></label>
                <label>ขนาด<select value={button.size} onChange={(event) => updateCustomButton(button.id, { size: event.target.value as CustomButton["size"] })}><option value="small">เล็ก</option><option value="medium">กลาง</option><option value="large">ใหญ่</option></select></label>
                <label>ตำแหน่ง<select value={button.align} onChange={(event) => updateCustomButton(button.id, { align: event.target.value as CustomButton["align"] })}><option value="left">ซ้าย</option><option value="center">กลาง</option><option value="right">ขวา</option></select></label>
              </div>

              <label className="fieldLabel">Meta Pixel Event ของปุ่มนี้</label>
              <select className="textField" value={button.eventType ?? "none"} onChange={(event) => updateCustomButton(button.id, { eventType: event.target.value as CustomButton["eventType"] })}>
                <option value="none">ไม่ส่ง Event</option><option value="standard">Standard Event</option><option value="custom">Custom Event</option>
              </select>
              {button.eventType === "standard" ? (
                <select className="textField" value={button.eventName || "Lead"} onChange={(event) => updateCustomButton(button.id, { eventName: event.target.value })}>
                  {standardEvents.map((eventName) => <option key={eventName} value={eventName}>{eventName}</option>)}
                </select>
              ) : null}
              {button.eventType === "custom" ? (
                <input className="textField" value={button.eventName || ""} maxLength={80} placeholder="เช่น MyButtonClick" onChange={(event) => updateCustomButton(button.id, { eventName: event.target.value.replace(/[^a-zA-Z0-9_]/g, "") })} />
              ) : null}
              <div className="customButtonSample" style={{ justifyContent: button.align }}>
                <span style={{ background: button.backgroundColor, color: button.textColor, fontSize: button.size === "small" ? 12 : button.size === "large" ? 17 : 14, padding: button.size === "small" ? "8px 12px" : button.size === "large" ? "14px 20px" : "11px 16px", opacity: button.enabled ? 1 : 0.45 }}>
                  {button.text || "ตัวอย่างปุ่ม"}　›
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="editorPanel settingsPanel">
          <div className="panelHeading">
            <span className="panelNumber">04</span>
            <div><h2>การตั้งค่าทั่วไป</h2><p>Pixel สี ตัวอย่าง และลำดับแสดงผล</p></div>
          </div>

          <label className="fieldLabel">Meta Pixel ID — แหล่ง A</label>
          <input className="textField" inputMode="numeric" value={config.pixelIdA} maxLength={30} placeholder="Pixel ID สำหรับลิงก์ mw_source=a" onChange={(event) => update("pixelIdA", event.target.value.replace(/\D/g, ""))} />
          <label className="fieldLabel">Meta Pixel ID — แหล่ง B</label>
          <input className="textField" inputMode="numeric" value={config.pixelIdB} maxLength={30} placeholder="Pixel ID สำหรับลิงก์ mw_source=b" onChange={(event) => update("pixelIdB", event.target.value.replace(/\D/g, ""))} />
          <p className="fieldHint">ลิงก์ A ใช้ ?mw_source=a และลิงก์ B ใช้ ?mw_source=b ระบบจะส่ง Pixel event ไปยัง ID ที่ตรงกับแหล่งที่มาเท่านั้น</p>
          <label className="fieldLabel">Pixel ID เดิม (สำรอง)</label>
          <input className="textField" inputMode="numeric" value={config.pixelId} maxLength={100} placeholder="ค่าเดิม ถ้าต้องการคงการทำงานเดิม" onChange={(event) => update("pixelId", event.target.value.replace(/[^0-9,\s]/g, ""))} />

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
                <span className="dragHint">ลากเพื่อย้าย</span>
              </div>
            ))}
          </div>

          <div className="sectionRule" />
          <div className="panelHeading compactHeading"><span className="panelNumber">07</span><div><h2>ตัวอย่างก่อนบันทึก</h2><p>ตัวอย่างจำลองคร่าว ๆ ไม่ใช่หน้าเว็บที่เผยแพร่แล้ว</p></div></div>
          <div className="livePreview" style={{ backgroundColor: config.pageBackgroundColor || "#050505" }}>
            <div className="previewCard" style={{ backgroundColor: config.cardBackgroundColor || "#141414" }}>
              {(config.images ?? []).filter((image) => image.enabled).map((image) => (
                <div className="previewImageWrap" key={image.id}><img src={image.url} alt={image.alt} /></div>
              ))}
              {!config.images.some((image) => image.enabled) ? <p className="previewHidden">ซ่อนรูปภาพอยู่</p> : null}
              {config.showButton ? <div className="previewButton" style={{ backgroundColor: config.buttonBackgroundColor || "#f0a900", color: config.buttonTextColor || "#171000" }}>{config.buttonText}<span>›</span></div> : <p className="previewHidden">ซ่อนปุ่มอยู่</p>}
              {config.customButtons.filter((button) => button.enabled).map((button) => (
                <div className="previewCustomButton" key={button.id} style={{ justifyContent: button.align }}>
                  <span style={{ backgroundColor: button.backgroundColor, color: button.textColor }}>{button.text}　›</span>
                </div>
              ))}
            </div>
          </div>

          <div className="saveArea">
            <p>การเปลี่ยนแปลงจะมีผลเมื่อกดบันทึกเท่านั้น</p>
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
        .addButton{width:100%;padding:12px;border:1px dashed #b88c2b;border-radius:10px;background:#282216;color:#ffd45e;font-weight:800;cursor:pointer}.customButtonEditor{margin-top:12px;padding:14px;border:1px solid #30343b;border-radius:12px;background:#0c0f13}.customButtonEditorTop{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px}
        .customButtonFields{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:12px}.customButtonFields label{display:grid;gap:6px;color:#aab1bd;font-size:11px}.customButtonFields input[type=color]{width:100%;height:34px;border:1px solid #343943;border-radius:6px;background:#111419}.customButtonFields select{width:100%;min-width:0;padding:8px;border:1px solid #343943;border-radius:6px;background:#090b0e;color:#fff}
        .customButtonSample{display:flex;margin-top:12px;padding:10px;background:#08090b;border-radius:8px}.customButtonSample span{display:inline-block;border-radius:8px;font-weight:800}
        .colorRow{padding:12px 0;border-bottom:1px solid #272b32}.colorRow>label{display:block;margin-bottom:9px;color:#d9dce1;font-size:12px;font-weight:700}.colorControl{display:flex;align-items:center;gap:10px}.colorControl input{width:40px;height:36px;padding:2px;border:1px solid #3a3f48;border-radius:8px;background:#0a0c0f;cursor:pointer}.colorControl code{flex:1;color:#a9b0bb;font-size:11px}.colorControl button,.resetButton{border:1px solid #353a43;border-radius:8px;padding:8px 10px;background:#191d23;color:#c6cbd3;font-size:11px;cursor:pointer}.resetButton{margin-top:14px}
        .layoutOrderList{display:grid;gap:8px;margin-top:12px}.layoutOrderItem{display:flex;align-items:center;gap:9px;padding:11px;border:1px solid #3b414b;border-radius:10px;background:#0b0e12;cursor:grab;user-select:none}.layoutOrderItem:active{cursor:grabbing}.dragHandle{font-size:20px;color:#f0c44f}.layoutOrderNumber{display:grid;place-items:center;min-width:25px;height:25px;border-radius:7px;background:#302816;color:#ffd45e;font-size:11px;font-weight:800}.layoutOrderLabel{flex:1;min-width:0;overflow-wrap:anywhere;font-size:12px;color:#f2f4f8}.dragHint{font-size:10px;color:#8f98a6}
        .livePreview{margin-top:10px;padding:14px;border-radius:16px;background-image:radial-gradient(circle at 50% 10%,rgba(255,194,55,.10),transparent 28%),radial-gradient(circle at 15% 70%,rgba(0,220,255,.07),transparent 30%)}.previewCard{width:min(100%,300px);margin:auto;padding:8px;border:1px solid #ffffff1a;border-radius:18px;background:linear-gradient(180deg,#141414,#070707);box-shadow:0 15px 30px #0008}.previewImageWrap{overflow:hidden;border:1px solid #ffffff18;border-radius:13px}.previewImageWrap+.previewImageWrap{margin-top:8px}.previewImageWrap img{display:block;width:100%;height:auto;max-width:100%;object-fit:contain}.previewButton{position:relative;display:grid;place-items:center;min-height:46px;margin-top:10px;padding:8px 32px;border-radius:11px;font-size:13px;font-weight:900;text-align:center}.previewButton span{position:absolute;right:14px;font-size:23px}.previewCustomButton{display:flex;margin-top:8px}.previewCustomButton span{padding:10px 14px;border-radius:9px;font-size:12px;font-weight:800}.previewHidden{text-align:center;color:#8e949e;font-size:12px;padding:12px}
        .saveArea{margin-top:20px;padding-top:17px;border-top:1px solid #2a2e35}.saveArea p{color:#9299a4;font-size:11px;line-height:1.5}.saveButton{width:100%;min-height:48px;border:0;border-radius:11px;background:linear-gradient(180deg,#ffdc76,#e9a800);color:#211700;font-size:13px;font-weight:900;cursor:pointer}.saveButton:disabled{opacity:.55;cursor:wait}.editorLoading{min-height:100svh;display:grid;place-items:center;background:#090b0e;color:#eee}
        @media(max-width:850px){.editorSections{grid-template-columns:1fr}.settingsPanel{grid-column:auto}.editorPanel{padding:18px}.editorHeaderActions{width:100%}.customButtonFields{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:520px){.imageItem{grid-template-columns:1fr}.imageItem>img{max-height:300px}.colorControl{flex-wrap:wrap}.colorControl code{min-width:80px}}
      `}</style>
    </main>
  );
}
