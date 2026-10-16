"use client";

import { useEffect } from "react";

const registerUrl =
  "https://masterworldbet.com/sign-up?ref_agent=1feacd0466b9&ref_zean=9ED5866AF713";

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
  useEffect(() => {
    trackEvent("page_view");
  }, []);

  return (
    <main className="linkPage">
      <div className="landingGlow landingGlowOne" aria-hidden="true" />
      <div className="landingGlow landingGlowTwo" aria-hidden="true" />

      <section className="landingCard" aria-label="Masterworld สมัครสมาชิก">
        <div className="promoLink">
          <img
            src="/promo-square.png"
            alt="Masterworld"
            fetchPriority="high"
            className="promoImage"
          />
        </div>

        <div className="actionButtons">
          <a
            className="registerButton"
            href={registerUrl}
            onClick={() => trackEvent("register_click")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="สมัครสมาชิก Masterworld"
          >
            <span>สมัครเลย</span>
            <span className="buttonArrow" aria-hidden="true">
              ›
            </span>
          </a>
        </div>
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
          background:
            radial-gradient(
              circle at 50% 10%,
              rgba(255, 194, 55, 0.10),
              transparent 28%
            ),
            radial-gradient(
              circle at 15% 70%,
              rgba(0, 220, 255, 0.07),
              transparent 30%
            ),
            #050505;
        }

        .landingCard {
          position: relative;
          z-index: 2;
          width: min(100%, 520px);
          padding: 12px;
          box-sizing: border-box;
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-radius: 26px;
          background: linear-gradient(
            180deg,
            rgba(20, 20, 20, 0.96),
            rgba(7, 7, 7, 0.98)
          );
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
          background: linear-gradient(180deg, #ffd76a, #f0a900);
          color: #171000;
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
