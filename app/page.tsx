"use client";

import Image from "next/image";
import LineButton from "../components/LineButton";

const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "https://line.me/";

export default function Home() {
  return (
    <main className="linkPage">
      <div className="landingGlow landingGlowOne" aria-hidden="true" />
      <div className="landingGlow landingGlowTwo" aria-hidden="true" />

      <section className="landingCard" aria-label="Masterworld ติดต่อ LINE">
        <div className="promoLink">
          <Image
            src="/promo-square.png"
            alt="Masterworld"
            width={941}
            height={1672}
            priority
            unoptimized
            className="promoImage"
          />
        </div>

        <div className="actionButtons">
          <LineButton href={lineUrl}>เข้าสู่ LINE</LineButton>

          <a
            className="contactButton"
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ติดต่อพนักงานผ่าน LINE"
          >
            <span className="contactIcon" aria-hidden="true">💬</span>
            <span>ติดต่อพนักงานผ่าน LINE</span>
            <span className="buttonArrow" aria-hidden="true">›</span>
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
            radial-gradient(circle at 50% 10%, rgba(255, 194, 55, .10), transparent 28%),
            radial-gradient(circle at 15% 70%, rgba(0, 220, 255, .07), transparent 30%),
            #050505;
        }

        .landingCard {
          position: relative;
          z-index: 2;
          width: min(100%, 520px);
          padding: 12px;
          box-sizing: border-box;
          border: 1px solid rgba(255, 255, 255, .10);
          border-radius: 26px;
          background: linear-gradient(180deg, rgba(20, 20, 20, .96), rgba(7, 7, 7, .98));
          box-shadow: 0 28px 80px rgba(0, 0, 0, .60), 0 0 45px rgba(255, 190, 40, .07), inset 0 1px 0 rgba(255, 255, 255, .06);
        }

        .promoLink {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          overflow: hidden;
          border-radius: 20px;
          background: #0b0b0b;
          border: 1px solid rgba(255, 255, 255, .09);
          box-shadow: 0 18px 45px rgba(0, 0, 0, .45), 0 0 24px rgba(255, 190, 40, .08);
        }

        .promoImage {
          display: block;
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 65svh;
          object-fit: contain;
        }

        .actionButtons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 14px;
        }

        .contactButton {
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          box-sizing: border-box;
          padding: 0 48px;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, .16);
          background: linear-gradient(180deg, #202020, #111111);
          color: #fff;
          text-decoration: none;
          font-size: 16px;
          font-weight: 800;
          box-shadow: 0 8px 24px rgba(0, 0, 0, .35), inset 0 1px 0 rgba(255, 255, 255, .08);
          transition: transform .18s ease, border-color .18s ease, background .18s ease;
        }

        .contactButton:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 255, 255, .28);
          background: linear-gradient(180deg, #292929, #151515);
        }

        .contactIcon { font-size: 18px; }

        .buttonArrow {
          position: absolute;
          right: 18px;
          font-size: 26px;
          line-height: 1;
          color: rgba(255, 255, 255, .65);
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
          background: rgba(255, 180, 30, .10);
        }

        .landingGlowTwo {
          right: -100px;
          bottom: -100px;
          background: rgba(0, 180, 255, .08);
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

          .promoLink { border-radius: 17px; }
          .contactButton { min-height: 52px; font-size: 15px; }
        }
      `}</style>
    </main>
  );
}
