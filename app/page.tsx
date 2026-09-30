import Image from "next/image";
import LineButton from "../components/LineButton";

const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "https://line.me/";

const activities = [
  ["MW***77", "Mystery", "กำลังเล่น"],
  ["เจ๊หมวย***96", "Wild", "กำลังเล่น"],
  ["บอล***10", "Anubis", "กำลังเล่น"],
  ["natt***091", "Fortune", "กำลังเล่น"],
  ["user***72", "Dragon", "กำลังเล่น"],
];

export default function Home() {
  return (
    <main className="linkPage">
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />

      <section className="profileCard">
        <div className="topBar">
          <span className="brandMini">MASTERWORLD</span>
          <span className="online"><i /> ONLINE</span>
        </div>

        <div className="profile">
          <div className="logoWrap">
            <Image
              src="/masterworld-logo.png"
              alt="MasterWorld"
              width={310}
              height={310}
              priority
              className="logo"
            />
          </div>

          <h1>MASTER WORLD CLASS</h1>
          <p className="bio">
            เกมออนไลน์บนมือถือ<br />
            เข้าถึงง่าย เล่นสะดวก ผ่าน LINE
          </p>
        </div>

        <div className="links">
          <LineButton href={lineUrl}>
            🎮 เริ่มเล่นผ่าน LINE
          </LineButton>

          <a className="linkButton secondary" href="#how">
            <span className="linkIcon">✦</span>
            <span>วิธีเริ่มเล่น</span>
            <span className="linkArrow">›</span>
          </a>

          <a className="linkButton secondary" href="#contact">
            <span className="linkIcon">💬</span>
            <span>ติดต่อทีมงาน</span>
            <span className="linkArrow">›</span>
          </a>
        </div>

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
                <div className="activityRow" key={`${user}-${game}`}>
                  <div className="gameIcon">
                    {game === "Mystery" ? "🎰" :
                     game === "Wild" ? "💎" :
                     game === "Anubis" ? "🔥" :
                     game === "Fortune" ? "🪙" : "🐉"}
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
              ข้อมูลตัวอย่างสำหรับแสดงรูปแบบกิจกรรมในเกม
            </div>
          </div>
        </section>

        <section className="demoMoneyWrap" aria-label="Demo activity">
          <div className="demoLabel">
            <span className="demoDot" />
            DEMO • กิจกรรมตัวอย่าง
          </div>

          <div className="demoMoneyBox">
            <div className="demoMoneyTitle">
              🎮 รายการกิจกรรมล่าสุด
              <small>ข้อมูล DEMO ไม่ใช่รายการเงินจริง</small>
            </div>

            <div className="demoMoneyList">
              {[
                ["ZZx19007xx", "Mystery", "21:27"],
                ["ZZx26602xx", "Wild", "21:27"],
                ["natt***091", "Fortune", "21:26"],
              ].map(([user, game, time]) => (
                <div className="demoMoneyItem" key={`${user}-${game}`}>
                  <div className="demoGameIcon">
                    {game === "Mystery" ? "🎰" : game === "Wild" ? "💎" : "🪙"}
                  </div>
                  <div className="demoMoneyInfo">
                    <strong>{user}</strong>
                    <span>{game} • {time}</span>
                  </div>
                  <div className="demoStatus">DEMO</div>
                </div>
              ))}
            </div>
          </div>

          <div className="demoLuckyBox">
            <div className="demoLuckyTitle">
              🏆 กิจกรรมเกมตัวอย่าง
              <small>DEMO ONLY</small>
            </div>

            <div className="demoTableHead">
              <div>ยูสเซอร์</div>
              <div>เกม</div>
              <div>เวลา</div>
              <div>สถานะ</div>
            </div>

            {[
              ["สายปั่น***77", "Mystery", "21:27"],
              ["เจ๊หมวย1996", "Wild", "21:27"],
              ["บอล***10", "Anubis", "21:27"],
              ["natt***091", "Fortune", "21:26"],
            ].map(([user, game, time]) => (
              <div className="demoTableRow" key={`${user}-${game}`}>
                <div className="demoUser">{user}</div>
                <div className="demoGame">{game}</div>
                <div className="demoTime">{time}</div>
                <div className="demoWin">DEMO</div>
              </div>
            ))}

            <div className="demoFooter">
              ข้อมูลทั้งหมดในส่วนนี้เป็นข้อมูลจำลองเพื่อแสดงรูปแบบหน้าเว็บ
            </div>
          </div>
        </section>

        <style>{`
          .demoMoneyWrap {
            width: 100%;
            margin-top: 18px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .demoLabel {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #f5f5f5;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: .1px;
          }

          .demoDot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #ffd54a;
            box-shadow: 0 0 10px rgba(255, 213, 74, .7);
            flex: 0 0 auto;
          }

          .demoMoneyBox,
          .demoLuckyBox {
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, .10);
            border-radius: 16px;
            background: linear-gradient(180deg, rgba(24,24,24,.96), rgba(12,12,12,.96));
            box-shadow: 0 10px 28px rgba(0,0,0,.28);
          }

          .demoMoneyTitle,
          .demoLuckyTitle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 13px 15px;
            color: #fff;
            font-size: 13px;
            font-weight: 800;
            border-bottom: 1px solid rgba(255,255,255,.08);
          }

          .demoMoneyTitle small,
          .demoLuckyTitle small {
            color: #8d8d8d;
            font-size: 9px;
            font-weight: 600;
            white-space: nowrap;
          }

          .demoMoneyList {
            display: flex;
            flex-direction: column;
          }

          .demoMoneyItem {
            display: grid;
            grid-template-columns: 34px minmax(0,1fr) auto;
            align-items: center;
            gap: 10px;
            padding: 11px 15px;
            border-bottom: 1px solid rgba(255,255,255,.06);
          }

          .demoMoneyItem:last-child { border-bottom: 0; }

          .demoGameIcon {
            width: 32px;
            height: 32px;
            display: grid;
            place-items: center;
            border-radius: 10px;
            background: rgba(255,255,255,.06);
            font-size: 17px;
          }

          .demoMoneyInfo {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .demoMoneyInfo strong {
            color: #fff;
            font-size: 12px;
            line-height: 1.25;
          }

          .demoMoneyInfo span {
            color: #888;
            font-size: 10px;
          }

          .demoStatus,
          .demoWin {
            color: #ffd54a;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: .5px;
            border: 1px solid rgba(255,213,74,.28);
            background: rgba(255,213,74,.07);
            padding: 4px 7px;
            border-radius: 999px;
          }

          .demoTableHead,
          .demoTableRow {
            display: grid;
            grid-template-columns: 1.35fr 1fr .75fr .65fr;
            gap: 8px;
            align-items: center;
            padding: 10px 14px;
          }

          .demoTableHead {
            color: #777;
            font-size: 9px;
            font-weight: 700;
            background: rgba(255,255,255,.025);
          }

          .demoTableRow {
            color: #ddd;
            font-size: 10px;
            border-top: 1px solid rgba(255,255,255,.055);
          }

          .demoTableRow > div {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .demoUser { color: #fff; font-weight: 700; }
          .demoGame, .demoTime { color: #929292; }
          .demoWin { justify-self: start; }

          .demoFooter {
            padding: 11px 14px 13px;
            color: #666;
            font-size: 9px;
            line-height: 1.5;
            border-top: 1px solid rgba(255,255,255,.06);
          }

          @media (max-width: 420px) {
            .demoMoneyTitle, .demoLuckyTitle {
              align-items: flex-start;
              flex-direction: column;
            }
            .demoTableHead, .demoTableRow {
              grid-template-columns: 1.3fr .9fr .65fr .55fr;
              gap: 5px;
              padding-left: 11px;
              padding-right: 11px;
            }
          }
        `}</style>

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
            <span>Privacy Policy</span>
            <span>Terms</span>
          </div>
        </div>
      </section>
    </main>
  );
}
