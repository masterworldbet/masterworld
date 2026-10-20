
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
            position: "relative",
            width: "100%",
            minHeight: 56,
            boxSizing: "border-box",
            padding: "0 48px",
            borderRadius: config.mainButtonBorderRadius ?? 14,
            border: "1px solid rgba(255,215,100,.65)",
            background:
              config.buttonBackgroundColor ||
              "linear-gradient(180deg,#ffd76a,#f0a900)",
            color: config.buttonTextColor || "#171000",
            textDecoration: "none",
            textAlign: "center",
            fontSize: config.mainButtonFontSize ?? 17,
            fontFamily: config.mainButtonFontFamily && config.mainButtonFontFamily !== "inherit" ? config.mainButtonFontFamily : "inherit",
            fontWeight: 900,
            lineHeight: 1.35,
            boxShadow:
              "0 8px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.35)",
          }}
        >
          {config.mainButtonIcon ? <span aria-hidden="true" style={{ marginRight: 8 }}>{config.mainButtonIcon}</span> : null}
          <span>{config.buttonText}</span>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              right: 18,
              fontSize: 26,
              lineHeight: 1,
            }}
          >
            ›
          </span>
        </a>
      </div>
    ) : null;

  const renderCustomButton = (buttonId: string) => {
    const button = config.customButtons?.find(
      (item) => `button:${item.id}` === buttonId
    );

    if (!button || !button.enabled) return null;

    return (
      <div
        className="customButtonRow"
        key={button.id}
        style={{
          display: "flex",
          justifyContent: button.align,
          width: "auto",
          minWidth: 0,
          margin: "10px 12px 0",
        }}
      >
        <a
          className={`customButton customButton-${button.size}`}
          href={button.url}
          onClick={() => {
            // Count custom-button clicks in the same Dashboard metric as the main button.
            trackEvent("register_click");
            // Keep the optional Meta Pixel event configured for this button.
            sendPixelEvent(button.eventType, button.eventName);
          }}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            width: (button.fullWidth ?? button.size === "large") ? "100%" : "auto",
            maxWidth: "100%",
            minHeight:
              button.size === "small"
                ? 36
                : button.size === "medium"
                  ? 46
                  : 56,
            boxSizing: "border-box",
            padding: button.size === "small" ? "9px 14px" : button.size === "large" ? "14px 20px" : "11px 16px",
            borderRadius: button.borderRadius ?? 12,
            textDecoration: "none",
            fontWeight: 800,
            fontFamily: button.fontFamily && button.fontFamily !== "inherit" ? button.fontFamily : "inherit",
            fontSize: button.fontSize ?? (button.size === "small" ? 13 : button.size === "medium" ? 15 : 17),
            background: button.backgroundColor,
            color: button.textColor,
          }}
        >
          {button.icon ? <span aria-hidden="true" style={{ flex: "0 0 auto", lineHeight: 1 }}>{button.icon}</span> : null}
          <span style={{ flex: "1 1 auto", textAlign: "center" }}>{button.text}</span>
          <span aria-hidden="true" style={{ flex: "0 0 auto", lineHeight: 1 }}>›</span>
        </a>
      </div>
    );
  };

  const legacyImages = config.images ?? [
    {
      id: "legacy-main-image",
      url: config.promoImageUrl,
      alt: config.imageAlt,
      enabled: config.showImage,
    },
  ];

  const defaultLayoutItems = [
    "headline",
    "description",
    ...legacyImages.map((image) => `image:${image.id}`),
    "main-button",
    ...(config.customButtons ?? []).map((button) => `button:${button.id}`),
  ];

  const validLayoutIds = new Set(defaultLayoutItems);

  const configuredOrder = (
    config as SiteConfig & { layoutOrder?: string[] }
  ).layoutOrder;

  const savedLayoutOrder = Array.isArray(configuredOrder)
    ? configuredOrder
    : [];

  const layoutOrder = savedLayoutOrder.filter(
    (id) => typeof id === "string" && validLayoutIds.has(id)
  );

  // Keep the default text-first layout for older saved configurations while
  // allowing both text blocks to be moved anywhere through layoutOrder.
  const missingTextItems = ["headline", "description"].filter(
    (id) => !layoutOrder.includes(id)
  );
  layoutOrder.unshift(...missingTextItems);
  for (const id of defaultLayoutItems) {
    if (!layoutOrder.includes(id)) layoutOrder.push(id);
  }

  const renderLayoutItem = (id: string) => {
    if (id === "headline") return config.pageHeadline ? (
      <h1 key="headline" style={{ margin: "8px 14px 4px", color: "#fff", textAlign: "center", fontSize: 22, fontWeight: 800, lineHeight: 1.4, overflowWrap: "anywhere" }}>
        {config.pageHeadline}
      </h1>
    ) : null;

    if (id === "description") return config.pageDescription ? (
      <p key="description" style={{ margin: "0 16px 12px", color: "#e5e7eb", textAlign: "center", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
        {config.pageDescription}
      </p>
    ) : null;

    if (id === "main-button") return renderMainButton();

    if (id.startsWith("button:")) {
      return renderCustomButton(id);
    }

    if (id.startsWith("image:")) {
      const image = legacyImages.find(
        (item) => `image:${item.id}` === id
      );

      if (!image?.enabled) return null;

      return (
        <div
          className="promoLink"
          key={image.id}
          style={{
            display: "block",
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            margin: 0,
            padding: 0,
            overflow: "hidden",
            boxSizing: "border-box",
            border: 0,
            borderRadius: 0,
            lineHeight: 0,
          }}
        >
          <img
            src={image.url}
            alt={image.alt}
            className="promoImage"
            style={{
              display: "block",
              width: "100%",
              maxWidth: "100%",
              height: "auto",
              margin: 0,
              padding: 0,
              objectFit: "contain",
            }}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <main
      className="linkPage"
      style={{
        ...customStyles,
        width: "100%",
        minHeight: "100svh",
        margin: 0,
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        boxSizing: "border-box",
        overflowX: "clip",
        overflowY: "visible",
      }}
    >
      <div
        className="landingGlow landingGlowOne"
        aria-hidden="true"
      />
      <div
        className="landingGlow landingGlowTwo"
        aria-hidden="true"
      />

      <section
        className="landingCard"
        aria-label="Masterworld content"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 560,
          minWidth: 0,
          margin: "0 auto",
          padding: 0,
          boxSizing: "border-box",
        }}
      >
        <div
          className="freeLayoutStack"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
            minWidth: 0,
          }}
        >
          {layoutOrder.map((id) => renderLayoutItem(id))}
        </div>
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
          padding: 0;
          box-sizing: border-box;
          background: var(
            --page-background,
            radial-gradient(
              circle at 50% 10%,
              rgba(255, 194, 55, 0.1),
              transparent 28%
            ),
            radial-gradient(
              circle at 15% 70%,
              rgba(0, 220, 255, 0.07),
              transparent 30%
            ),
            #050505
          );
        }

        .landingCard {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 560px;
          margin: 0 auto;
          min-width: 0;
          padding: 0;
          box-sizing: border-box;
          background: var(--card-background, transparent);
          overflow: hidden;
        }

        .freeLayoutStack {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .promoLink {
          display: block;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          margin: 0;
          padding: 0;
          overflow: hidden;
          box-sizing: border-box;
          border: 0;
          border-radius: 0;
          line-height: 0;
        }

        .promoImage {
          display: block;
          width: 100%;
          max-width: 100%;
          height: auto;
          margin: 0;
          padding: 0;
          object-fit: contain;
        }

        .actionButtons,
        .customButtonRow {
          min-width: 0;
          box-sizing: border-box;
        }

        .registerButton,
        .customButton {
          transition:
            filter 0.2s ease,
            transform 0.2s ease;
        }

        .registerButton:hover,
        .customButton:hover {
          filter: brightness(1.08);
        }

        .registerButton:active,
        .customButton:active {
          transform: scale(0.99);
        }

        .landingGlow {
          position: absolute;
          width: 240px;
          height: 240px;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.12;
          pointer-events: none;
          z-index: 0;
        }

        .landingGlowOne {
          top: 5%;
          left: -120px;
          background: #f0b429;
        }

        .landingGlowTwo {
          top: 40%;
          right: -140px;
          background: #00dcff;
        }

        @media (max-width: 600px) {
          .linkPage {
            width: 100%;
            overflow-x: hidden;
          }

          .landingCard {
            width: 100%;
            max-width: 100%;
          }

          .freeLayoutStack {
            width: 100%;
            gap: 8px;
          }

          .promoLink,
          .promoImage {
            width: 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
