import LineButton from "@/components/LineButton";

const lineUrl =
  process.env.NEXT_PUBLIC_LINE_URL ||
  "https://line.me/";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="glow glowOne" />
        <div className="glow glowTwo" />

        <nav className="nav">
          <div className="brand">
            <span className="brandMark">MW</span>
            <span>MASTER WORLD CLASS</span>
          </div>
          <span className="status">
            <i /> ONLINE
          </span>
        </nav>

        <div className="heroContent">
          <div className="eyebrow">🎮 ONLINE GAME</div>
          <h1>
            สนุกกับเกม
            <br />
            <strong>MASTER WORLD CLASS</strong>
          </h1>
          <p className="heroText">
            เกมออนไลน์ที่ออกแบบให้เข้าใจง่าย เล่นสะดวก
            และเริ่มต้นได้จากมือถือ
          </p>

          <LineButton href={lineUrl} />

          <p className="microcopy">
            กดปุ่มเพื่อเพิ่มเพื่อน LINE และรับข้อมูลสำหรับเริ่มเล่น
          </p>
        </div>

        <div className="gamePreview" aria-label="ตัวอย่างหน้าจอเกม">
          <div className="phone">
            <div className="phoneTop">
              <span>MASTER</span>
              <span>●</span>
            </div>
            <div className="screen">
              <div className="screenBadge">GAME</div>
              <div className="screenTitle">READY?</div>
              <div className="gameCards">
                <span>?</span><span>?</span><span>?</span>
                <span>?</span><span>?</span><span>?</span>
              </div>
              <div className="screenButton">START</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="sectionHeading">
          <span className="eyebrow">HOW TO START</span>
          <h2>เริ่มเล่นง่ายใน 3 ขั้นตอน</h2>
        </div>

        <div className="steps">
          <article className="step">
            <span className="number">01</span>
            <h3>กดเริ่มเล่น</h3>
            <p>กดปุ่มด้านบนเพื่อเข้าสู่ช่องทาง LINE</p>
          </article>
          <article className="step">
            <span className="number">02</span>
            <h3>เพิ่มเพื่อน LINE</h3>
            <p>ติดตามช่องทางเพื่อรับข้อมูลและลิงก์ที่เกี่ยวข้อง</p>
          </article>
          <article className="step">
            <span className="number">03</span>
            <h3>เข้าสู่เกม</h3>
            <p>ทำตามขั้นตอนที่แจ้งใน LINE เพื่อเริ่มเล่น</p>
          </article>
        </div>
      </section>

      <section className="ctaSection">
        <div>
          <span className="eyebrow">READY TO PLAY?</span>
          <h2>พร้อมแล้ว เริ่มเล่นกันเลย</h2>
          <p>กดปุ่มด้านล่างเพื่อไปยัง LINE</p>
        </div>
        <LineButton href={lineUrl} />
      </section>

      <footer>
        <div>© {new Date().getFullYear()} MASTER WORLD CLASS</div>
        <div className="footerLinks">
          <span>Privacy Policy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </footer>
    </main>
  );
}