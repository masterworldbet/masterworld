"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { DEFAULT_SITE_CONFIG, type SiteConfig } from "../lib/site-config";

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

  return (
    <main className="linkPage" style={customStyles}>
      <div className="landingGlow landingGlowOne" aria-hidden="true" />
      <div className="landingGlow landingGlowTwo" aria-hidden="true" />

      <section className="landingCard" aria-label="Masterworld สมัครสมาชิก">
        {config.showImage ? (
          <div className="promoLink">
            <img
              src={config.promoImageUrl}
              alt={config.imageAlt}
              fetchPriority="high"
              className="promoImage"
            />
          </div>
        ) : null}

        {config.showButton ? (
          <div className="actionButtons">
            <a
              className="registerButton"
              href={config.registerUrl}
              onClick={() => trackEvent("register_click")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={config.buttonText}
            >
              <span>{config.buttonText}</span>
              <span className="buttonArrow" aria-hidden="true">
                ›
              </span>
            </a>
          </div>
        ) : null}

        {config.customButtons?.filter((button) => button.enabled).map((button) => (
          <div className="customButtonRow" key={button.id} style={{ justifyContent: button.align }}>
            <a
              className={`customButton customButton-${button.size}`}
              href={button.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: button.backgroundColor, color: button.textColor }}
            >
              <span>{button.text}</span><span aria-hidden="true">›</span>
            </a>
          </div>
        ))}
      </section>

      <style jsx>{`
        .linkPage {
          position: relative;
          min-height: 100svh;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          padding: 18px 14px;
          box-sizing: border-box;
          background: var(--page-background, radial-gradient(circle at 50% 10%, rgba(255, 194, 55, 0.10), transparent 28%), radial-gradient(circle at 15% 70%, rgba(0, 220, 255, 0.07), transparent 30%), #050505);
        }

        .landingCard {
          position: relative;
          z-index: 2;
          width: min(100%, 520px);
          padding: 12px;
          box-sizing: border-box;
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 26px;
          background: var(--card-background, linear-gradient(180deg, rgba(20, 20, 20, 0.96), rgba(7, 7, 7, 0.98)));
          box-shadow:
            0 28px 80px rgba(0, 0, 0, 0.60),
            0 0 45px rgba(255, 190, 40, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .promoLink {
          display: block;
          width: 100%;
          overflow: hidden;
          border-radius: 20px;
          background: #0b0b0b;
          border: 1px solid rgba(255, 255, 255, 0.09);
          box-shadow:
            0 18px 45px rgba(0, 0, 0, 0.45),
            0 0 24px rgba(255, 190, 40, 0.08);
        }

        .promoImage {
          display: block;
          width: 100%;
          height: auto;
          max-width: 100%;
        }

        .actionButtons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 14px;
        }

        .registerButton {
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-sizing: border-box;
          padding: 0 48px;
          border-radius: 15px;
          border: 1px solid rgba(255, 215, 100, 0.55);
          background: var(--button-background, linear-gradient(180deg, #ffd76a, #f0a900));
          color: var(--button-text-color, #171000);
          text-decoration: none;
          font-size: 17px;
          font-weight: 900;
          box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.35),
            0 0 20px rgba(255, 190, 40, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.35);
          transition:
            transform 0.18s ease,
            filter 0.18s ease;
        }

        .registerButton:hover {
          transform: translateY(-2px);
          filter: brightness(1.08);
        }

        .registerButton:active {
          transform: translateY(0);
        }

        .customButtonRow { display:flex; margin-top:10px; }
        .customButton { display:flex; align-items:center; justify-content:space-between; gap:18px; max-width:100%; padding:12px 18px; border-radius:12px; text-decoration:none; font-weight:800; box-sizing:border-box; transition:transform .18s ease,filter .18s ease; }
        .customButton:hover { transform:translateY(-2px); filter:brightness(1.08); }
        .customButton-small { min-height:36px; font-size:13px; }
        .customButton-medium { min-height:46px; font-size:15px; }
        .customButton-large { min-height:56px; font-size:17px; width:100%; }
        .buttonArrow {
          position: absolute;
          right: 18px;
          font-size: 26px;
          line-height: 1;
          color: rgba(23, 16, 0, 0.75);
        }

        .landingGlow {
          position: absolute;
          z-index: 1;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .landingGlowOne {
          top: -100px;
          left: -90px;
          background: rgba(255, 180, 30, 0.10);
        }

        .landingGlowTwo {
          right: -100px;
          bottom: -100px;
          background: rgba(0, 180, 255, 0.08);
        }

        @media (max-width: 520px) {
          .linkPage {
            padding: 10px;
            align-items: flex-start;
          }

          .landingCard {
            margin-top: 4px;
            padding: 9px;
            border-radius: 22px;
          }

          .promoLink {
            border-radius: 17px;
          }

          .registerButton {
            min-height: 54px;
            font-size: 16px;
          }
        }
      `}</style>
    </main>
  );
}
