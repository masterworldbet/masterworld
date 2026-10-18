
"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { DEFAULT_SITE_CONFIG, type SiteConfig } from "../lib/site-config";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function sendPixelEvent(
  type: "none" | "standard" | "custom" | undefined,
  name?: string
) {
  if (
    !type ||
    type === "none" ||
    !name ||
    typeof window === "undefined" ||
    !window.fbq
  ) {
    return;
  }

  if (type === "standard") {
    window.fbq("track", name);
  } else {
    window.fbq("trackCustom", name);
  }
}

function trackEvent(event: "page_view" | "register_click") {
  if (typeof window === "undefined") return;

  const width = window.innerWidth;
  const device =
    width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop";

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
    // Analytics must never interrupt the page or registration link.
  }
}

export default function Home() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);

  useEffect(() => {
    trackEvent("page_view");

    let active = true;

    fetch("/api/site-config", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && data?.config) {
          setConfig({ ...DEFAULT_SITE_CONFIG, ...data.config });
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  const customStyles = {
    ...(config.pageBackgroundColor
      ? { "--page-background": config.pageBackgroundColor }
      : {}),
    ...(config.cardBackgroundColor
      ? { "--card-background": config.cardBackgroundColor }
      : {}),
    ...(config.buttonBackgroundColor
      ? {
          "--button-background": `linear-gradient(180deg, color-mix(in srgb, ${config.buttonBackgroundColor} 40%, white), ${config.buttonBackgroundColor})`,
        }
      : {}),
    ...(config.buttonTextColor
      ? { "--button-text-color": config.buttonTextColor }
      : {}),
  } as unknown as CSSProperties;

  const renderMainButton = () =>
    config.showButton ? (
      <div
        className="actionButtons"
        key="main-button"
        style={{
          display: "flex",
          width: "auto",
          margin: "12px",
          minWidth: 0,
        }}
      >
        <a
          className="registerButton"
          href={config.registerUrl}
          onClick={() => {
            trackEvent("register_click");
            sendPixelEvent(
              config.mainButtonEventType,
              config.mainButtonEventName
            );
          }}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={config.buttonText}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
