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
