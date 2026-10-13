"use client";

import Image from "next/image";
import { useEffect } from "react";
import LineButton from "../components/LineButton";

const lineUrl =
  process.env.NEXT_PUBLIC_LINE_URL || "https://line.me/";

const activities = [
  ["MW***77", "Mystery", "กำลังเล่น"],
  ["เจ๊หมวย***96", "Wild", "กำลังเล่น"],
  ["บอล***10", "Anubis", "กำลังเล่น"],
  ["natt***091", "Fortune", "กำลังเล่น"],
  ["user***72", "Dragon", "กำลังเล่น"],
];

const demoUsers = [
  "ZZx19007xx",
  "ZZx26602xx",
  "natt***091",
  "สายปั่น***77",
  "บอลจัดเต็ม***10",
  "เจ๊หมวย1996",
  "ลูกค้า***88",
  "me88***",
  "user***72",
];

const demoGames = [
  ["🎰", "Mystery"],
  ["💎", "Wild"],
  ["🔥", "Anubis"],
  ["🐉", "Dragon"],
  ["🪙", "Fortune"],
  ["👑", "Mega"],
  ["🌟", "Golden"],
  ["💜", "Purple"],
];

const demoAmounts = [
  762,
  1290,
  4292,
  5860,
  9869.75,
  12651.45,
  15006.2,
  18900.25,
  24100,
  42100,
];

function moneyFormat(number: number) {
  return Number(number).toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getTime() {
  return new Date().toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getShortTime() {
  return new Date().toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Home() {
  useEffect(() => {
    const clock = document.getElementById("demoCurrentTime");
    const moneyList = document.getElementById("demoMoneyList");
    const luckyTable = document.getElementById("demoLuckyTable");

    const updateClock = () => {
      if (clock) clock.textContent = getTime();
    };

    const addDemoMoney = () => {
      if (!moneyList) return;

      const user =
        demoUsers[Math.floor(Math.random() * demoUsers.length)];

      const amount =
        demoAmounts[Math.floor(Math.random() * demoAmounts.length)];

      const item = document.createElement("div");

      item.className = "demo-money-item";

      item.innerHTML = `
        <div class="demo-bank-icon">฿</div>
        <div class="demo-money-info">
          <div class="demo-money-user">
            ยูส: <span>${user}</span>
          </div>
          <div class="demo-money-date">
            วันนี้ • ${getTime()} น.
          </div>
        </div>
        <div class="demo-money-right">
          <div class="demo-money-amount">
            ฿${moneyFormat(amount)}
          </div>
          <div class="demo-money-status">สำเร็จ</div>
        </div>
      `;

      moneyList.insertBefore(item, moneyList.firstChild);

      while (moneyList.children.length > 5) {
        moneyList.removeChild(moneyList.lastChild!);
      }
    };

    const addLuckyWinner = () => {
      if (!luckyTable) return;

      const user =
        demoUsers[Math.floor(Math.random() * demoUsers.length)];

      const game =
        demoGames[Math.floor(Math.random() * demoGames.length)];

      const amount =
        demoAmounts[Math.floor(Math.random() * demoAmounts.length)];

      const row = document.createElement("div");

      row.className = "demo-table-row";

      row.innerHTML = `
        <div class="demo-user">${user}</div>
        <div class="demo-game">
          <div class="demo-game-icon">${game[0]}</div>
          <div class="demo-game-name">${game[1]}</div>
        </div>
        <div class="demo-time">${getShortTime()}</div>
        <div class="demo-win">฿${moneyFormat(amount)}</div>
      `;

      luckyTable.insertBefore(row, luckyTable.firstChild);

      while (luckyTable.children.length > 7) {
        luckyTable.removeChild(luckyTable.lastChild!);
      }
    };

    updateClock();

    const clockTimer = window.setInterval(updateClock, 1000);
    const moneyTimer = window.setInterval(addDemoMoney, 4000);
    const luckyTimer = window.setInterval(addLuckyWinner, 6000);

    return () => {
      window.clearInterval(clockTimer);
      window.clearInterval(moneyTimer);
      window.clearInterval(luckyTimer);
    };
  }, []);

  return (
    <main className="linkPage">
      <div className="landingGlow landingGlowOne" />
      <div className="landingGlow landingGlowTwo" />

      <section className="landingCard">
        {/* โลโก้ */}
        <div className="brandBar">
          <span className="brandDot" />
          <span>MTWB</span>
        </div>

        {/* รูปโปรโมต */}
        <div className="promoLink">
          <Image
            src="/promo-square.png"
            alt="MTWB"
            width={1080}
            height={1080}
            priority
            className="promoImage"
          />
        </div>

        {/* ปุ่ม LINE */}
        <div className="actionButtons">
          <LineButton href={lineUrl}>
            เข้าสู่ LINE
          </LineButton>

          <a
            className="contactButton"
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ติดต่อพนักงานผ่าน LINE"
          >
            <span className="contactIcon">💬</span>
            <span>ติดต่อพนักงาน</span>
            <span className="buttonArrow">›</span>
          </a>
        </div>

        <div className="bottomGlow" />

        {/* ส่วนเดิมคงไว้ แต่ซ่อนจากหน้าเว็บ */}
        <section className="activityBox" aria-label="กิจกรรมล่าสุด">
          <div className="activityLabel">
            <span className="liveDot" />
            LIVE • กิจกรรมเกมล่าสุด
          </div>

          <div className="activityCard">
            <div className="activityTitle">
              🎮 กิจกรรมเกมล่าสุด
              <small>ตัวอย่างกิจกรรมภายในเกม</small>
            </div>

            <div className="activityList">
              {activities.map(([user, game, status]) => (
                <div
                  className="activityRow"
                  key={`${user}-${game}`}
                >
                  <div className="gameIcon">
                    {game === "Mystery"
                      ? "🎰"
                      : game === "Wild"
                      ? "💎"
                      : game === "Anubis"
                      ? "🔥"
                      : game === "Fortune"
                      ? "🪙"
                      : "🐉"}
                  </div>

                  <div className="activityInfo">
                    <strong>{user}</strong>
                    <span>{game}</span>
                  </div>

                  <div className="activityStatus">
                    <i />
                    {status}
                  </div>
                </div>
              ))}
            </div>

            <div className="activityFooter">
              ข้อมูลสำหรับแสดงรูปแบบกิจกรรมในเกม
            </div>
          </div>
        </section>

        <section className="demo-money-wrap" aria-label="DEMO activity">
          <div className="demo-label">
            <span className="demo-dot" />
            MASTERWORLD • รายการล่าสุด
          </div>

          <div className="demo-money-box">
            <div className="demo-money-title">
              💰 รายการล่าสุด
              <small>รายการปัจจุบัน</small>
            </div>

            <div className="demo-money-list" id="demoMoneyList">
              <div className="demo-money-item">
                <div className="demo-bank-icon">฿</div>
                <div className="demo-money-info">
                  <div className="demo-money-user">
                    ยูส: <span>ZZx19007xx</span>
                  </div>
                  <div className="demo-money-date">
                    วันนี้ • 21:27:31 น.
                  </div>
                </div>
                <div className="demo-money-right">
                  <div className="demo-money-amount">฿762.00</div>
                  <div className="demo-money-status">สำเร็จ</div>
                </div>
              </div>

              <div className="demo-money-item">
                <div className="demo-bank-icon">฿</div>
                <div className="demo-money-info">
                  <div className="demo-money-user">
                    ยูส: <span>ZZx26602xx</span>
                  </div>
                  <div className="demo-money-date">
                    วันนี้ • 21:27:14 น.
                  </div>
                </div>
                <div className="demo-money-right">
                  <div className="demo-money-amount">฿4,292.00</div>
                  <div className="demo-money-status">สำเร็จ</div>
                </div>
              </div>

              <div className="demo-money-item">
                <div className="demo-bank-icon">฿</div>
                <div className="demo-money-info">
                  <div className="demo-money-user">
                    ยูส: <span>ZZx7753xx</span>
                  </div>
                  <div className="demo-money-date">
                    วันนี้ • 21:26:51 น.
                  </div>
                </div>
                <div className="demo-money-right">
                  <div className="demo-money-amount">฿944.00</div>
                  <div className="demo-money-status">สำเร็จ</div>
                </div>
              </div>
            </div>
          </div>

          <div className="demo-lucky-box">
            <div className="demo-lucky-title">
              🏆 ผู้โชคดีล่าสุด 🏆
              <small>ยินดีด้วยกับทุกท่าน</small>
            </div>

            <div className="demo-table-head">
              <div>ยูสเซอร์</div>
              <div>เกม</div>
              <div>เวลา</div>
              <div style={{ textAlign: "right" }}>เงินรางวัล</div>
            </div>

            <div id="demoLuckyTable">
              {[
                ["สายปั่น***77", "Mystery", "21:27", "฿15,006.20", "🎰"],
                ["เจ๊หมวย1996", "Wild", "21:27", "฿810.60", "💎"],
                ["บอลจัดเต็ม1012", "Anubis", "21:27", "฿15,006.20", "🔥"],
                ["บอลจัดเต็ม***10", "Wild", "21:27", "฿18,900.25", "💜"],
                ["บอลจัดเต็ม***10", "Dragon", "21:27", "฿42,100.00", "🐉"],
                ["natt***091", "Fortune", "21:27", "฿12,651.45", "🪙"],
                ["natt***091", "Mega", "21:27", "฿9,869.75", "👑"],
              ].map(([user, game, time, amount, icon]) => (
                <div
                  className="demo-table-row"
                  key={`${user}-${game}-${amount}`}
                >
                  <div className="demo-user">{user}</div>
                  <div className="demo-game">
                    <div className="demo-game-icon">{icon}</div>
                    <div className="demo-game-name">{game}</div>
                  </div>
                  <div className="demo-time">{time}</div>
                  <div className="demo-win">{amount}</div>
                </div>
              ))}
            </div>

            <div className="demo-footer">
              เวลาอัปเดตล่าสุด:{" "}
              <strong id="demoCurrentTime">--:--:--</strong>
              <br />
              <span>พร้อมให้บริการ 24 ชม.</span>
            </div>
          </div>
        </section>

        <div id="how" className="infoBox">
          <div className="infoTitle">เริ่มต้นง่าย ๆ</div>
          <div className="steps">
            <div><b>01</b><span>กดเริ่มเล่น</span></div>
            <div><b>02</b><span>เพิ่มเพื่อน LINE</span></div>
            <div><b>03</b><span>ทำตามขั้นตอน</span></div>
          </div>
        </div>

        <div id="contact" className="footerArea">
          <div className="footerLine">
            <span>MASTER WORLD CLASS</span>
            <span>•</span>
            <span>© 2026</span>
          </div>
          <div className="legal">
            <a href={lineUrl} target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            <a href={lineUrl} target="_blank" rel="noopener noreferrer">
              Terms
            </a>
          </div>
        </div>
      </section>

      <style>{`
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
            radial-gradient(circle at 50% 10%, rgba(255,194,55,.10), transparent 28%),
            radial-gradient(circle at 15% 70%, rgba(0,220,255,.07), transparent 30%),
            #050505;
        }

        .landingCard {
          position: relative;
          z-index: 2;
          width: min(100%, 520px);
          padding: 12px;
          box-sizing: border-box;
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 26px;
          background: linear-gradient(180deg, rgba(20,20,20,.96), rgba(7,7,7,.98));
          box-shadow:
            0 28px 80px rgba(0,0,0,.60),
            0 0 45px rgba(255,190,40,.07),
            inset 0 1px 0 rgba(255,255,255,.06);
        }

        .brandBar {
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #f7f7f7;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 2.5px;
          opacity: .9;
        }

        .brandDot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #20e878;
          box-shadow: 0 0 12px rgba(32,232,120,.8);
        }

        .promoLink {
          display: block;
          width: 100%;
          overflow: hidden;
          border-radius: 20px;
          background: #0b0b0b;
          border: 1px solid rgba(255,255,255,.09);
          box-shadow:
            0 18px 45px rgba(0,0,0,.45),
            0 0 24px rgba(255,190,40,.08);
        }

        .promoImage {
          display: block;
          width: 100%;
          height: auto;
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
          border: 1px solid rgba(255,255,255,.16);
          background: linear-gradient(180deg, #202020, #111111);
          color: #fff;
          text-decoration: none;
          font-size: 16px;
          font-weight: 800;
          box-shadow:
            0 8px 24px rgba(0,0,0,.35),
            inset 0 1px 0 rgba(255,255,255,.08);
          transition: transform .18s ease, border-color .18s ease, background .18s ease;
        }

        .contactButton:hover {
          transform: translateY(-1px);
          border-color: rgba(255,255,255,.28);
          background: linear-gradient(180deg, #292929, #151515);
        }

        .contactIcon {
          font-size: 18px;
        }

        .buttonArrow {
          position: absolute;
          right: 18px;
          font-size: 26px;
          line-height: 1;
          color: rgba(255,255,255,.65);
        }

        .bottomGlow {
          height: 2px;
          width: 55%;
          margin: 14px auto 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, #ffd34e, transparent);
          box-shadow: 0 0 18px rgba(255,211,78,.45);
          opacity: .55;
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
          background: rgba(255,180,30,.10);
        }

        .landingGlowTwo {
          right: -100px;
          bottom: -100px;
          background: rgba(0,180,255,.08);
        }

        /* ซ่อนส่วนที่ไม่ต้องการแสดง */
        .activityBox,
        .demo-money-wrap,
        .infoBox,
        .footerArea {
          display: none !important;
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

          .brandBar {
            height: 30px;
            font-size: 11px;
          }

          .promoLink {
            border-radius: 17px;
          }

          .contactButton {
            min-height: 52px;
            font-size: 15px;
          }
        }
      `}</style>
    </main>
  );
}
