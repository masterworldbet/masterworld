"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { DEFAULT_SITE_CONFIG, type SiteConfig } from "../lib/site-config";

declare global { interface Window { fbq?: (...args: unknown[]) => void } }
function sendPixelEvent(type: "none" | "standard" | "custom" | undefined, name?: string) {
  if (!type || type === "none" || !name || typeof window === "undefined" || !window.fbq) return;
  if (type === "standard") window.fbq("track", name);
  else window.fbq("trackCustom", name);
}

function trackEvent(event: "page_view" | "register_click") {
  if (typeof window === "undefined") return;
  const width = window.innerWidth;
  const device = width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop";
  const payload = JSON.stringify({
    event,
    path: window.location.pathname,
    referrer: document.referrer || null,
    device,
  });
  try {
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Analytics must never interrupt the landing page or registration link.
  }
}

export default function Home() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);

  useEffect(() => {
    trackEvent("page_view");
    let active = true;
    fetch("/api/site-config", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (active && data?.config) setConfig({ ...DEFAULT_SITE_CONFIG, ...data.config });
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const customStyles = {
    ...(config.pageBackgroundColor ? { "--page-background": config.pageBackgroundColor } : {}),
    ...(config.cardBackgroundColor ? { "--card-background": config.cardBackgroundColor } : {}),
    ...(config.buttonBackgroundColor ? { "--button-background": `linear-gradient(180deg, color-mix(in srgb, ${config.buttonBackgroundColor} 40%, white), ${config.buttonBackgroundColor})` } : {}),
    ...(config.buttonTextColor ? { "--button-text-color": config.buttonTextColor } : {}),
  } as unknown as CSSProperties;

  const renderMainButton = () => config.showButton ? (
    <div className="actionButtons" key="main-button" style={{ display: "flex", flexDirection: "column", width: "auto", margin: "12px", gap: 10 }}>
      <a className="registerButton" href={config.registerUrl} onClick={() => { trackEvent("register_click"); sendPixelEvent(config.mainButtonEventType, config.mainButtonEventName); }} target="_blank" rel="noopener noreferrer" aria-label={config.buttonText} style={{ width: "100%", minHeight: 56, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", boxSizing: "border-box", padding: "0 48px", borderRadius: 14, border: "1px solid rgba(255,215,100,.65)", background: config.buttonBackgroundColor ? `linear-gradient(180deg, color-mix(in srgb, ${config.buttonBackgroundColor} 40%, white), ${config.buttonBackgroundColor})` : "linear-gradient(180deg,#ffd76a,#f0a900)", color: config.buttonTextColor || "#171000", textDecoration: "none", fontSize: 17, fontWeight: 900, boxShadow: "0 8px 24px rgba(0,0,0,.35), 0 0 20px rgba(255,190,40,.12)" }}>
        <span>{config.buttonText}</span><span className="buttonArrow" aria-hidden="true" style={{ position: "absolute", right: 18, fontSize: 26, lineHeight: 1, color: "rgba(23,16,0,.75)" }}>›</span>
      </a>
    </div>
  ) : null;

  const renderCustomButton = (buttonId: string) => {
    const button = config.customButtons?.find((item) => `button:${item.id}` === buttonId);
    if (!button || !button.enabled) return null;
    return <div className="customButtonRow" key={button.id} style={{ display: "flex", justifyContent: button.align, width: "auto", margin: "10px 12px 0" }}><a className={`customButton customButton-${button.size}`} href={button.url} onClick={() => sendPixelEvent(button.eventType, button.eventName)} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, maxWidth: "100%", minHeight: button.size === "small" ? 36 : button.size === "large" ? 56 : 46, padding: "12px 18px", borderRadius: 12, textDecoration: "none", fontWeight: 800, boxSizing: "border-box", background: button.backgroundColor, color: button.textColor, fontSize: button.size === "small" ? 13 : button.size === "large" ? 17 : 15, width: button.size === "large" ? "100%" : "auto" }}><span>{button.text}</span><span aria-hidden="true">›</span></a></div>;
  };

  const legacyImages = config.images ?? [{ id: "legacy-main-image", url: config.promoImageUrl, alt: config.imageAlt, enabled: config.showImage }];
  const defaultLayoutItems = [
    ...legacyImages.map((image) => `image:${image.id}`),
    "main-button",
    ...(config.customButtons ?? []).map((button) => `button:${button.id}`),
  ];
  const validLayoutIds = new Set(defaultLayoutItems);
  const savedLayoutOrder = Array.isArray(config.layoutOrder) ? config.layoutOrder : [];
  const layoutOrder = savedLayoutOrder.filter((id) => typeof id === "string" && validLayoutIds.has(id));
  // Recover from stale/incomplete saved orders so an enabled button cannot disappear.
  for (const id of defaultLayoutItems) {
    if (!layoutOrder.includes(id)) layoutOrder.push(id);
  }

  const renderLayoutItem = (id: string) => {
    if (id === "main-button") return renderMainButton();
    if (id.startsWith("button:")) return renderCustomButton(id);
    if (id.startsWith("image:")) {
      const image = legacyImages.find((item) => `image:${item.id}` === id);
      if (!image?.enabled) return null;
      return <div className="promoLink" key={image.id} style={{ display: "block", width: "100%", minWidth: 0, maxWidth: "100%", margin: 0, padding: 0, overflow: "hidden", borderRadius: 0, border: 0, background: "transparent", boxShadow: "none", lineHeight: 0 }}><img src={image.url} alt={image.alt} className="promoImage" loading="lazy" style={{ display: "block", width: "100%", height: "auto", maxWidth: "100%", minWidth: 0, objectFit: "contain", objectPosition: "center" }} /></div>;
    }
    return null;
  };

  return (
    <main className="linkPage" style={{ ...customStyles, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", width: "100%", maxWidth: "100vw", minHeight: "100svh", margin: 0, padding: 0, boxSizing: "border-box", overflowX: "clip", background: config.pageBackgroundColor || "#050505" }}>
      <div className="landingGlow landingGlowOne" aria-hidden="true" />
      <div className="landingGlow landingGlowTwo" aria-hidden="true" />

      <section className="landingCard" aria-label="Masterworld content" style={{ position: "relative", zIndex: 2, display: "block", width: "100%", maxWidth: 560, minWidth: 0, margin: "0 auto", padding: 0, boxSizing: "border-box", border: 0, borderRadius: 0, background: "transparent", boxShadow: "none" }}>
        <div className="freeLayoutStack" style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 0, width: "100%", maxWidth: "100%", minWidth: 0 }}>{layoutOrder.map((id) => renderLayoutItem(id))}</div>
      </section>

      <style jsx>{`
        .linkPage {
          position: relative;
          min-height: 100svh;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          overflow-x: hidden;
          overflow-y: visible;
          width: 100%;
          max-width: 100vw;
          margin: 0;
          padding: 0 0 24px;
          box-sizing: border-box;
          background: var(--page-background, radial-gradient(circle at 50% 10%, rgba(255, 194, 55, 0.10), transparent 28%), radial-gradient(circle at 15% 70%, rgba(0, 220, 255, 0.07), transparent 30%), #050505);
        }

        .landingCard {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 560px;
          min-width: 0;
