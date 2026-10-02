"use client";

import Image from "next/image";
import { useEffect } from "react";
import LineButton from "../components/LineButton";

const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "https://line.me/";

const activities = [
  ["user_01", "กำลังใช้งานระบบ", "2 นาทีที่แล้ว"],
  ["user_02", "เข้าสู่ระบบสำเร็จ", "4 นาทีที่แล้ว"],
  ["user_03", "กำลังใช้งานระบบ", "6 นาทีที่แล้ว"],
  ["user_04", "เข้าสู่ระบบสำเร็จ", "8 นาทีที่แล้ว"],
];

const demoUsers = [
  "MTWB_4821",
  "MTWB_7319",
  "MTWB_2940",
  "MTWB_6158",
  "MTWB_9032",
  "MTWB_1746",
  "MTWB_5284",
  "MTWB_8461",
];

const demoGames = [
  ["Game A", "WIN"],
  ["Game B", "WIN"],
  ["Game C", "WIN"],
  ["Game D", "WIN"],
];

const demoAmounts = [
  1250,
  1850,
  2350,
  3150,
  4250,
  5200,
  6850,
  7950,
];

function moneyFormat(value: number) {
  return new Intl.NumberFormat("th-TH").format(value);
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
    const activityList = document.querySelector(
      ".activityList"
    ) as HTMLElement | null;

    const moneyList = document.querySelector(
      ".moneyList"
    ) as HTMLElement | null;

    if (!activityList || !moneyList) return;

    const activityTimer = window.setInterval(() => {
      const user =
        demoUsers[Math.floor(Math.random() * demoUsers.length)];

      const game =
        demoGames[Math.floor(Math.random() * demoGames.length)];

      const item = document.createElement("div");
      item.className = "activityItem";

      item.innerHTML = `
        <div class="activityUser">
          <span class="activityDot"></span>
          <span>${user}</span>
        </div>

        <div class="activityGame">
          ${game[0]}
        </div>

        <div class="activityTime">
          ${getShortTime()}
        </div>
      `;

      activityList.prepend(item);

      while (activityList.children.length > 5) {
        activityList.removeChild(activityList.lastElementChild!);
      }
    }, 7000);

    const moneyTimer = window.setInterval(() => {
      const amount =
        demoAmounts[Math.floor(Math.random() * demoAmounts.length)];

      const user =
        demoUsers[Math.floor(Math.random() * demoUsers.length)];

      const item = document.createElement("div");
      item.className = "moneyItem";

      item.innerHTML = `
        <div>
          <div class="moneyUser">${user}</div>
          <div class="moneyTime">${getTime()}</div>
        </div>

        <div class="moneyAmount">
          +฿${moneyFormat(amount)}
        </div>
      `;

      moneyList.prepend(item);

      while (moneyList.children.length > 4) {
        moneyList.removeChild(moneyList.lastElementChild!);
      }
    }, 9000);

    return () => {
      window.clearInterval(activityTimer);
      window.clearInterval(moneyTimer);
    };
  }, []);

  return (
    <main className="linkPage">
      <div className="landingGlow landingGlowOne" />
      <div className="landingGlow landingGlowTwo" />

      <section className="landingCard">
        <div className="brandBar">
          <span className="brandDot" />
          <span>MTWB</span>
        </div>

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

        <div className="actionButtons">
          <LineButton href={lineUrl}>เข้าสู่ LINE</LineButton>

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

        {/* ===== ส่วนที่เพิ่มใหม่ ต่อท้ายของเดิมเท่านั้น ===== */}

        <div className="activityBox">
          <div className="sectionTitle">
            <span className="sectionTitleDot" />
            <span>กิจกรรมล่าสุด</span>
          </div>

          <div className="activityList">
            {activities.map((activity, index) => (
              <div className="activityItem" key={index}>
                <div className="activityUser">
                  <span className="activityDot" />
                  <span>{activity[0]}</span>
                </div>

                <div className="activityGame">
                  {activity[1]}
                </div>

                <div className="activityTime">
                  {activity[2]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="demo-money-wrap">
          <div className="sectionTitle">
            <span className="sectionTitleDot" />
            <span>รายการล่าสุด</span>
          </div>

          <div className="moneyList">
            {demoAmounts.slice(0, 4).map((amount, index) => (
              <div className="moneyItem" key={index}>
                <div>
                  <div className="moneyUser">
                    {demoUsers[index]}
                  </div>

                  <div className="moneyTime">
                    {getShortTime()}
                  </div>
                </div>

                <div className="moneyAmount">
                  +฿{moneyFormat(amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="infoBox">
          <div className="infoIcon">✓</div>

          <div className="infoContent">
            <div className="infoTitle">
              MASTERWORLD
            </div>

            <div className="infoText">
              ระบบออนไลน์พร้อมให้บริการ
              <br />
              หากต้องการความช่วยเหลือสามารถติดต่อพนักงานได้ทันที
            </div>
          </div>
        </div>

        <div className="footerArea">
          <div className="footerBrand">
            MASTERWORLD
          </div>

          <div className="footerText">
            ระบบออนไลน์ • ให้บริการตลอดเวลา
          </div>

          <div className="footerLinks">
            <a href={lineUrl}>ติดต่อพนักงาน</a>
            <span>•</span>
            <a href={lineUrl}>LINE</a>
          </div>
        </div>

        {/* ===== จบส่วนที่เพิ่มใหม่ ===== */}

        <style>{`
          .activityBox,
          .demo-money-wrap{
            margin-top:14px;
            padding:14px;
            border:1px solid rgba(255,255,255,.08);
            border-radius:16px;
            background:rgba(255,255,255,.025);
          }

          .sectionTitle{
            display:flex;
            align-items:center;
            gap:8px;
            margin-bottom:10px;
            color:#f4f4f4;
            font-size:13px;
            font-weight:800;
          }

          .sectionTitleDot{
            width:6px;
            height:6px;
            border-radius:50%;
            background:#20e878;
            box-shadow:0 0 10px rgba(32,232,120,.7);
          }

          .activityList,
          .moneyList{
            display:flex;
            flex-direction:column;
            gap:7px;
          }

          .activityItem,
          .moneyItem{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:10px;
            min-height:40px;
            padding:8px 10px;
            box-sizing:border-box;
            border-radius:10px;
            background:rgba(255,255,255,.035);
            border:1px solid rgba(255,255,255,.05);
          }

          .activityUser{
            display:flex;
            align-items:center;
            gap:7px;
            min-width:0;
            color:#eee;
            font-size:11px;
            font-weight:700;
          }

          .activityDot{
            width:5px;
            height:5px;
            flex:0 0 auto;
            border-radius:50%;
            background:#20e878;
            box-shadow:0 0 8px rgba(32,232,120,.7);
          }

          .activityGame{
            flex:1;
            color:rgba(255,255,255,.65);
            font-size:10px;
            text-align:center;
          }

          .activityTime{
            color:rgba(255,255,255,.38);
            font-size:9px;
            white-space:nowrap;
          }

          .moneyUser{
            color:#f3f3f3;
            font-size:10px;
            font-weight:800;
          }

          .moneyTime{
            margin-top:2px;
            color:rgba(255,255,255,.35);
            font-size:8px;
          }

          .moneyAmount{
            color:#20e878;
            font-size:12px;
            font-weight:900;
            white-space:nowrap;
            text-shadow:0 0 12px rgba(32,232,120,.18);
          }

          .infoBox{
            display:flex;
            align-items:center;
            gap:12px;
            margin-top:14px;
            padding:13px;
            box-sizing:border-box;
            border-radius:15px;
            border:1px solid rgba(255,211,78,.10);
            background:linear-gradient(
              180deg,
              rgba(255,211,78,.045),
              rgba(255,255,255,.02)
            );
          }

          .infoIcon{
            width:30px;
            height:30px;
            flex:0 0 30px;
            display:flex;
            align-items:center;
            justify-content:center;
            border-radius:50%;
            color:#050505;
            background:#ffd34e;
            font-size:15px;
            font-weight:900;
            box-shadow:0 0 16px rgba(255,211,78,.22);
          }

          .infoContent{
            min-width:0;
          }

          .infoTitle{
            color:#ffd34e;
            font-size:11px;
            font-weight:900;
            letter-spacing:1px;
          }

          .infoText{
            margin-top:3px;
            color:rgba(255,255,255,.55);
            font-size:9px;
            line-height:1.55;
          }

          .footerArea{
            margin-top:16px;
            padding:12px 4px 3px;
            text-align:center;
          }

          .footerBrand{
            color:rgba(255,255,255,.75);
            font-size:10px;
            font-weight:900;
            letter-spacing:2px;
          }

          .footerText{
            margin-top:4px;
            color:rgba(255,255,255,.30);
            font-size:8px;
          }

          .footerLinks{
            display:flex;
            align-items:center;
            justify-content:center;
            gap:8px;
            margin-top:7px;
            font-size:9px;
          }

          .footerLinks a{
            color:rgba(255,255,255,.48);
            text-decoration:none;
          }

          .footerLinks a:hover{
            color:#fff;
          }
        `}</style>
      </section>

      <style>{`
        .linkPage{
          position:relative;
          min-height:100svh;
          display:flex;
          justify-content:center;
          align-items:center;
          overflow:hidden;
          padding:18px 14px;
          box-sizing:border-box;
          background:
            radial-gradient(circle at 50% 10%,rgba(255,194,55,.10),transparent 28%),
            radial-gradient(circle at 15% 70%,rgba(0,220,255,.07),transparent 30%),
            #050505;
        }

        .landingCard{
          position:relative;
          z-index:2;
          width:min(100%,520px);
          padding:12px;
          box-sizing:border-box;
          border:1px solid rgba(255,255,255,.10);
          border-radius:26px;
          background:linear-gradient(180deg,rgba(20,20,20,.96),rgba(7,7,7,.98));
          box-shadow:
            0 28px 80px rgba(0,0,0,.60),
            0 0 45px rgba(255,190,40,.07),
            inset 0 1px 0 rgba(255,255,255,.06);
        }

        .brandBar{
          height:34px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          color:#f7f7f7;
          font-size:12px;
          font-weight:900;
          letter-spacing:2.5px;
          opacity:.9;
        }

        .brandDot{
          width:6px;
          height:6px;
          border-radius:50%;
          background:#20e878;
          box-shadow:0 0 12px rgba(32,232,120,.8);
        }

        .promoLink{
          display:block;
          width:100%;
          overflow:hidden;
          border-radius:20px;
          background:#0b0b0b;
          border:1px solid rgba(255,255,255,.09);
          box-shadow:
            0 18px 45px rgba(0,0,0,.45),
            0 0 24px rgba(255,190,40,.08);
        }

        .promoImage{
          display:block;
          width:100%;
          height:auto;
        }

        .actionButtons{
          display:flex;
          flex-direction:column;
          gap:10px;
          margin-top:14px;
        }

        .contactButton{
          min-height:54px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          position:relative;
          box-sizing:border-box;
          padding:0 48px;
          border-radius:15px;
          border:1px solid rgba(255,255,255,.16);
          background:linear-gradient(180deg,#202020,#111111);
          color:#fff;
          text-decoration:none;
          font-size:16px;
          font-weight:800;
          box-shadow:
            0 8px 24px rgba(0,0,0,.35),
            inset 0 1px 0 rgba(255,255,255,.08);
          transition:
            transform .18s ease,
            border-color .18s ease,
            background .18s ease;
        }

        .contactButton:hover{
          transform:translateY(-1px);
          border-color:rgba(255,255,255,.28);
          background:linear-gradient(180deg,#292929,#151515);
        }

        .contactIcon{
          font-size:18px;
        }

        .buttonArrow{
          position:absolute;
          right:18px;
          font-size:26px;
          line-height:1;
          color:rgba(255,255,255,.65);
        }

        .bottomGlow{
          height:2px;
          width:55%;
          margin:14px auto 2px;
          border-radius:999px;
          background:linear-gradient(90deg,transparent,#ffd34e,transparent);
          box-shadow:0 0 18px rgba(255,211,78,.45);
          opacity:.55;
        }

        .landingGlow{
          position:absolute;
          z-index:1;
          width:280px;
          height:280px;
          border-radius:50%;
          filter:blur(80px);
          pointer-events:none;
        }

        .landingGlowOne{
          top:-100px;
          left:-90px;
          background:rgba(255,180,30,.10);
        }

        .landingGlowTwo{
          right:-100px;
          bottom:-100px;
          background:rgba(0,180,255,.08);
        }

        @media(max-width:520px){
          .linkPage{
            padding:10px;
            align-items:flex-start;
          }

          .landingCard{
            margin-top:4px;
            padding:9px;
            border-radius:22px;
          }

          .brandBar{
            height:30px;
            font-size:11px;
          }

          .promoLink{
            border-radius:17px;
          }

          .contactButton{
            min-height:52px;
            font-size:15px;
          }
        }
      `}</style>
    </main>
  );
}
