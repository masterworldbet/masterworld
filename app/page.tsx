          box-shadow: none;
          line-height: 0;
        }

        .promoLink + .promoLink { margin-top: 0; }

        .promoImage {
          display: block;
          width: 100%;
          height: auto;
          max-width: 100%;
          min-width: 0;
          object-fit: contain;
          object-position: center;
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
            width: 100%;
            max-width: 100vw;
            min-height: 100svh;
            padding: 0 0 24px;
            align-items: center;
          }

          .landingCard {
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 0;
            border: 0;
            border-radius: 0;
            background: transparent;
            box-shadow: none;
          }

          .freeLayoutStack { gap: 8px; }
          .promoLink {
            border-radius: 0;
            border-left: 0;
            border-right: 0;
            box-shadow: none;
          }
          .promoLink + .promoLink { margin-top: 0; }
          .registerButton {
            min-height: 54px;
            font-size: 16px;
            border-radius: 12px;
          }
          .actionButtons { margin: 10px 12px 0; }
          .customButtonRow { margin: 8px 12px 0; }
          .imageStack .allButtons { left: 10px; right: 10px; }
        }

      `}</style>
    </main>
  );
}
