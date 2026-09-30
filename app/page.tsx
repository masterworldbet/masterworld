import Image from "next/image";
import LineButton from "@/components/LineButton";

const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "https://line.me/";

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
