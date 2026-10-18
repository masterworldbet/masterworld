"use client";

import { useEffect } from "react";

declare global { interface Window { fbq?: (...args: unknown[]) => void; _fbq?: unknown; __mwPixelIds?: string[] } }

export default function MetaPixelSettings() {
  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(window.location.search);
    const sourceParam = params.get("mw_source");
    const source = sourceParam === "a" || sourceParam === "b" ? sourceParam : (sessionStorage.getItem("mw_source") || "direct");
    if (source === "a" || source === "b") sessionStorage.setItem("mw_source", source);
    fetch("/api/site-config", { cache: "no-store" }).then((r) => r.ok ? r.json() : null).then((data) => {
      if (cancelled) return;
      const config = data?.config;
      const legacyIds = String(config?.pixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID || "").split(",").map((x: string) => x.trim()).filter(Boolean);
      const selectedId = source === "a" ? String(config?.pixelIdA || "").trim() : source === "b" ? String(config?.pixelIdB || "").trim() : "";
      // Only use the legacy Pixel when the visitor did not arrive through an A/B source link.
      const ids = selectedId ? [selectedId] : (source === "direct" ? legacyIds.slice(0, 1) : []);
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
      w.fbq?.("track", "PageView");
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, []);
  return null;
}
