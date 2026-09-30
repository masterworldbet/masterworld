"use client";

import Image from "next/image";
import { useEffect } from "react";
import LineButton from "../components/LineButton";

const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "https://line.me/";

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

      const user = demoUsers[Math.floor(Math.random() * demoUsers.length)];
      const amount = demoAmounts[Math.floor(Math.random() * demoAmounts.length)];
      const item = document.createElement("div");
      item.className = "demo-money-item";
      item.innerHTML = `
        <div class="demo-bank-icon">฿</div>
        <div class="demo-money-info">
          <div class="demo-money-user">ยูส: <span>${user}</span></div>
          <div class="demo-money-date">วันนี้ • ${getTime()} น.</div>
        </div>
        <div class="demo-money-right">
          <div class="demo-money-amount">฿${moneyFormat(amount)}</div>
          <div class="demo-money-status">DEMO</div>
        </div>
      `;

      moneyList.insertBefore(item, moneyList.firstChild);
      while (moneyList.children.length > 5) {
        moneyList.removeChild(moneyList.lastChild!);
      }
    };

    const addLuckyWinner = () => {
      if (!luckyTable) return;

      const user = demoUsers[Math.floor(Math.random() * demoUsers.length)];
      const game = demoGames[Math.floor(Math.random() * demoGames.length)];
      const amount = demoAmounts[Math.floor(Math.random() * demoAmounts.length)];
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
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />

      <section className="profileCard">
        <div className="topBar">
          <span className="brandMini">MASTERWORLD</span>
          <span className="online"><i /> ONLINE</span>
        </div>

        <div className="profile">
          <div className="logoWrap">
            <Image src="/masterworld-logo.png" alt="MasterWorld" width={310} height={310} priority className="logo" />
          </div>
          <h1>MASTER WORLD CLASS</h1>
          <p className="bio">เกมออนไลน์บนมือถือ<br />เข้าถึงง่าย เล่นสะดวก ผ่าน LINE</p>
        </div>

        <div className="links">
          <LineButton href={lineUrl}>🎮 เริ่มเล่นผ่าน LINE</LineButton>
          <a className="linkButton secondary" href="#how"><span className="linkIcon">✦</span><span>วิธีเริ่มเล่น</span><span className="linkArrow">›</span></a>
          <a className="linkButton secondary" href="#contact"><span className="linkIcon">💬</span><span>ติดต่อทีมงาน</span><span className="linkArrow">›</span></a>
        </div>

        <section className="activityBox" aria-label="กิจกรรมล่าสุด">
          <div className="activityLabel"><span className="liveDot" />LIVE • กิจกรรมเกมล่าสุด</div>
          <div className="activityCard">
            <div className="activityTitle">🎮 กิจกรรมเกมล่าสุด<small>ตัวอย่างกิจกรรมภายในเกม</small></div>
            <div className="activityList">
              {activities.map(([user, game, status]) => (
                <div className="activityRow" key={`${user}-${game}`}>
                  <div className="gameIcon">{game === "Mystery" ? "🎰" : game === "Wild" ? "💎" : game === "Anubis" ? "🔥" : game === "Fortune" ? "🪙" : "🐉"}</div>
                  <div className="activityInfo"><strong>{user}</strong><span>{game}</span></div>
                  <div className="activityStatus"><i />{status}</div>
                </div>
              ))}
            </div>
            <div className="activityFooter">ข้อมูลตัวอย่างสำหรับแสดงรูปแบบกิจกรรมในเกม</div>
          </div>
        </section>

        <section className="demo-money-wrap" aria-label="DEMO activity">
          <div className="demo-label">
            <span className="demo-dot" />
            DEMO • การถอนตัวอย่าง
          </div>

          <div className="demo-money-box">
            <div className="demo-money-title">
              💰 รายการล่าสุด
              <small>DEMO • ข้อมูลจำลอง ไม่ใช่รายการเงินจริง</small>
            </div>

            <div className="demo-money-list" id="demoMoneyList">
              <div className="demo-money-item">
                <div className="demo-bank-icon">฿</div>
                <div className="demo-money-info">
                  <div className="demo-money-user">ยูส: <span>ZZx19007xx</span></div>
                  <div className="demo-money-date">วันนี้ • 21:27:31 น.</div>
                </div>
                <div className="demo-money-right">
                  <div className="demo-money-amount">฿762.00</div>
                  <div className="demo-money-status">DEMO</div>
                </div>
              </div>

              <div className="demo-money-item">
                <div className="demo-bank-icon">฿</div>
                <div className="demo-money-info">
                  <div className="demo-money-user">ยูส: <span>ZZx26602xx</span></div>
                  <div className="demo-money-date">วันนี้ • 21:27:14 น.</div>
                </div>
                <div className="demo-money-right">
                  <div className="demo-money-amount">฿4,292.00</div>
                  <div className="demo-money-status">DEMO</div>
                </div>
              </div>

              <div className="demo-money-item">
                <div className="demo-bank-icon">฿</div>
                <div className="demo-money-info">
                  <div className="demo-money-user">ยูส: <span>ZZx7753xx</span></div>
                  <div className="demo-money-date">วันนี้ • 21:26:51 น.</div>
                </div>
                <div className="demo-money-right">
                  <div className="demo-money-amount">฿944.00</div>
                  <div className="demo-money-status">DEMO</div>
                </div>
              </div>
            </div>
          </div>

          <div className="demo-lucky-box">
            <div className="demo-lucky-title">
              🏆 ผู้โชคดีล่าสุด 🏆
              <small>DEMO • ข้อมูลตัวอย่าง</small>
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
                <div className="demo-table-row" key={`${user}-${game}-${amount}`}>
                  <div className="demo-user">{user}</div>
                  <div className="demo-game"><div className="demo-game-icon">{icon}</div><div className="demo-game-name">{game}</div></div>
                  <div className="demo-time">{time}</div>
                  <div className="demo-win">{amount}</div>
                </div>
              ))}
            </div>

            <div className="demo-footer">
              เวลาอัปเดตล่าสุด: <strong id="demoCurrentTime">--:--:--</strong>
              <br />
              <span>DEMO • ข้อมูลจำลองเพื่อแสดงรูปแบบหน้าเว็บ</span>
            </div>
          </div>
        </section>

        <style>{`
          .demo-money-wrap{width:100%;max-width:680px;margin:18px auto 0;padding:10px;box-sizing:border-box;font-family:Arial,"Noto Sans Thai",sans-serif;color:#fff}
          .demo-label{display:inline-flex;align-items:center;gap:7px;padding:5px 12px;margin-bottom:10px;border:1px solid #00d9ff;border-radius:20px;background:rgba(0,15,30,.92);color:#00e5ff;font-size:11px;font-weight:800;letter-spacing:.5px;box-shadow:0 0 15px rgba(0,220,255,.25)}
          .demo-dot{width:7px;height:7px;border-radius:50%;background:#00ff91;box-shadow:0 0 8px #00ff91}
          .demo-money-box{overflow:hidden;border-radius:18px;background:linear-gradient(145deg,rgba(5,18,38,.98),rgba(3,8,20,.98));border:1px solid rgba(0,215,255,.65);box-shadow:0 0 25px rgba(0,180,255,.18),inset 0 0 30px rgba(0,100,180,.08);margin-bottom:18px}
          .demo-money-title{position:relative;text-align:center;padding:17px 10px;font-size:20px;font-weight:900;color:#fff;background:linear-gradient(90deg,#06172c,#073e65,#06172c);border-bottom:1px solid rgba(0,220,255,.35);text-shadow:0 0 12px rgba(0,220,255,.8)}
          .demo-money-title small{display:block;margin-top:5px;font-size:10px;color:#00e5ff;font-weight:700;letter-spacing:1px}
          .demo-money-list{padding:10px}
          .demo-money-item{position:relative;display:flex;align-items:center;gap:11px;min-height:74px;padding:10px;margin-bottom:8px;box-sizing:border-box;border-radius:13px;border:1px solid rgba(0,205,255,.5);background:linear-gradient(110deg,rgba(10,62,105,.95),rgba(4,25,50,.96));box-shadow:inset 0 0 18px rgba(0,160,255,.08),0 4px 14px rgba(0,0,0,.25);animation:demoSlide .45s ease}
          .demo-money-item:last-child{margin-bottom:0}
          @keyframes demoSlide{from{opacity:0;transform:translateY(-18px)}to{opacity:1;transform:translateY(0)}}
          .demo-bank-icon{width:45px;height:45px;flex:0 0 45px;display:flex;align-items:center;justify-content:center;border-radius:12px;border:2px solid #00e5ff;background:radial-gradient(circle at 30% 25%,#36eaff,#07517b 55%,#031b31);box-shadow:0 0 15px rgba(0,225,255,.35);font-size:21px}
          .demo-money-info{min-width:0;flex:1}
          .demo-money-user{font-size:13px;font-weight:800;color:#fff;margin-bottom:4px}
          .demo-money-user span{color:#00e5ff}
          .demo-money-date{font-size:10px;color:#9db8cc}
          .demo-money-right{text-align:right;white-space:nowrap}
          .demo-money-amount{font-size:17px;font-weight:900;color:#ffd84d;text-shadow:0 0 9px rgba(255,210,40,.35)}
          .demo-money-status{margin-top:5px;font-size:9px;font-weight:800;color:#00ff9d}
          .demo-money-status::before{content:"● ";text-shadow:0 0 8px #00ff9d}
          .demo-lucky-box{overflow:hidden;border-radius:18px;background:#080d13;border:1px solid rgba(255,193,50,.6);box-shadow:0 0 28px rgba(255,160,30,.12),inset 0 0 35px rgba(255,170,20,.035)}
          .demo-lucky-title{padding:15px 10px;text-align:center;font-size:19px;font-weight:900;color:#fff;background:linear-gradient(90deg,#7b230e,#c86614,#e7a72c,#c86614,#7b230e);text-shadow:0 2px 4px rgba(0,0,0,.6)}
          .demo-lucky-title small{display:block;margin-top:4px;font-size:10px;color:#fff4bd;letter-spacing:1px}
          .demo-table-head,.demo-table-row{display:grid;grid-template-columns:1.35fr 1fr .8fr 1.15fr;align-items:center}
          .demo-table-head{min-height:45px;padding:0 10px;color:#ffe275;background:#11100b;border-bottom:1px solid rgba(255,210,80,.3);font-size:12px;font-weight:900}
          .demo-table-row{min-height:65px;padding:0 10px;border-bottom:1px solid rgba(255,210,80,.16);background:rgba(8,13,15,.98);font-size:11px;transition:.2s}
          .demo-table-row:hover{background:rgba(255,180,30,.07)}
          .demo-table-row:last-child{border-bottom:none}
          .demo-user{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#f4f4f4;font-weight:700}
          .demo-game{display:flex;align-items:center;gap:7px;min-width:0}
          .demo-game-icon{width:31px;height:31px;flex:0 0 31px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:linear-gradient(145deg,#5a168c,#ed8c22);border:1px solid rgba(255,255,255,.3);font-size:16px}
          .demo-game-name{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;color:#ddd}
          .demo-time{color:#bdbdbd;white-space:nowrap}
          .demo-win{text-align:right;color:#ffe15b;font-weight:900;font-size:13px;text-shadow:0 0 7px rgba(255,200,50,.25)}
          .demo-footer{text-align:center;padding:12px;font-size:9px;color:#788997}
          .demo-footer strong{color:#00dfff}
          @media(max-width:520px){.demo-money-wrap{padding:6px}.demo-money-title{font-size:18px}.demo-money-item{min-height:68px;padding:8px}.demo-bank-icon{width:40px;height:40px;flex-basis:40px}.demo-money-amount{font-size:14px}.demo-money-user{font-size:11px}.demo-table-head,.demo-table-row{grid-template-columns:1.25fr 1fr .7fr 1.1fr;padding-left:7px;padding-right:7px}.demo-table-head{font-size:10px}.demo-table-row{min-height:58px;font-size:9px}.demo-game-icon{width:27px;height:27px;flex-basis:27px;font-size:13px}.demo-win{font-size:11px}}
        `}</style>

        <div id="how" className="infoBox">
          <div className="infoTitle">เริ่มต้นง่าย ๆ</div>
          <div className="steps"><div><b>01</b><span>กดเริ่มเล่น</span></div><div><b>02</b><span>เพิ่มเพื่อน LINE</span></div><div><b>03</b><span>ทำตามขั้นตอน</span></div></div>
        </div>

        <div id="contact" className="footerArea">
          <div className="footerLine"><span>MASTER WORLD CLASS</span><span>•</span><span>© 2026</span></div>
          <div className="legal"><span>Privacy Policy</span><span>Terms</span></div>
        </div>
      </section>
    </main>
  );
}
