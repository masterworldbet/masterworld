"use client";

import { useEffect } from "react";

declare global { interface Window { fbq?: (...args: unknown[]) => void; _fbq?: unknown; __mwPixelIds?: string[]; __mwPixelSource?: string } }

export default function MetaPixelSettings() {
  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(window.location.search);
    const incoming = params.get("mw_source")?.toLowerCase();
    const source = incoming === "a" || incoming === "b" ? incoming : (sessionStorage.getItem("mw_source") || "direct");
    if (incoming === "a" || incoming === "b") sessionStorage.setItem("mw_source", incoming);
    window.__mwPixelSource = source;
    fetch("/api/site-config", { cache: "no-store" }).then((r) => r.ok ? r.json() : null).then((data) => {
      if (cancelled) return;
      const config = data?.config;
      const selected = source === "a" ? config?.pixelIdA : source === "b" ? config?.pixelIdB : "";
      const ids = String(selected || (source === "direct" ? (config?.pixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID || "") : "")).split(",").map((x: string) => x.trim()).filter(Boolean);
      if (!ids.length) return;
      const w = window;
      if (!w.fbq) {
        type FbqFunction = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[][]; loaded?: boolean; version?: string; push?: (...args: unknown[]) => void };
        const fbq: FbqFunction = function (...args: unknown[]) { if (fbq.callMethod) fbq.callMethod(...args); else fbq.queue.push(args); };
        fbq.queue = []; fbq.loaded = true; fbq.version = "2.0"; fbq.push = (...args: unknown[]) => fbq.queue.push(args);
        w.fbq = fbq; w._fbq = fbq;
        const script = document.createElement("script"); script.async = true; script.src = "https://connect.facebook.net/en_US/fbevents.js"; document.head.appendChild(script);
      }
      const initialized = w.__mwPixelIds ?? [];
      for (const id of ids) if (!initialized.includes(id)) { w.fbq?.("init", id); initialized.push(id); }
      w.__mwPixelIds = initialized;
      for (const id of ids) w.fbq?.("trackSingle", id, "PageView");
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, []);
  return null;
}
