
          padding: 0;
          box-sizing: border-box;
          background: var(--card-background, transparent);
          overflow: hidden;
        }

        .freeLayoutStack {
          display: flex;
          flex-direction: column;
          width: 100%;
          min-width: 0;
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
          transition: filter 0.2s ease, transform 0.2s ease;
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
