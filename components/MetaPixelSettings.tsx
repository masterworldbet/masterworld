"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    __mwPixelIds?: string[];
    __mwSelectedPixelId?: string;
  }
}

export default function MetaPixelSettings() {
  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(window.location.search);
    const paramSource = params.get("mw_source");
    const source = paramSource === "a" || paramSource === "b"
      ? paramSource
      : (sessionStorage.getItem("mw_source") === "a" || sessionStorage.getItem("mw_source") === "b"
          ? sessionStorage.getItem("mw_source") as "a" | "b"
          : "direct");
    if (paramSource === "a" || paramSource === "b") sessionStorage.setItem("mw_source", paramSource);

    fetch("/api/site-config", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (cancelled) return;
        const config = data?.config;
        const legacyIds = String(config?.pixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID || "")
          .split(",").map((x: string) => x.trim()).filter(Boolean);
        const idA = String(config?.pixelIdA || "").trim();
        const idB = String(config?.pixelIdB || "").trim();
        const allIds = Array.from(new Set([idA, idB, ...legacyIds].filter(Boolean)));
        const selectedId = source === "a" ? idA : source === "b" ? idB : (legacyIds[0] || "");
        window.__mwSelectedPixelId = selectedId;
        if (!allIds.length) return;

        const w = window;
        if (!w.fbq) {
          type FbqFunction = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[][]; loaded?: boolean; version?: string; push?: (...args: unknown[]) => void };
          const fbq: FbqFunction = function (...args: unknown[]) {
            if (fbq.callMethod) fbq.callMethod(...args);
            else fbq.queue.push(args);
          };
          fbq.queue = [];
          fbq.loaded = true;
          fbq.version = "2.0";
          fbq.push = (...args: unknown[]) => fbq.queue.push(args);
          w.fbq = fbq;
          w._fbq = fbq;
          const script = document.createElement("script");
          script.async = true;
          script.src = "https://connect.facebook.net/en_US/fbevents.js";
          document.head.appendChild(script);
        }

        const initialized = w.__mwPixelIds ?? [];
        for (const id of allIds) {
          if (!initialized.includes(id)) {
            w.fbq?.("init", id);
            initialized.push(id);
          }
        }
        w.__mwPixelIds = initialized;
        // Keep A/B event data separate. Direct visits do not get assigned to A or B.
        if (selectedId) w.fbq?.("trackSingle", selectedId, "PageView");
      })
      .catch(() => undefined);

    return () => { cancelled = true; };
  }, []);

  return null;
}
