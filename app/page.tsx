import Image from "next/image";
import LineButton from "../components/LineButton";

const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "https://line.me/";

export default function Home() {
  return (
    <main className="linkPage">
      <section className="profileCard">
        <a
          className="promoLink"
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="เข้าสู่ LINE"
        >
          <Image
            src="/promo-square.png"
            alt="MTWB"
            width={1080}
            height={1080}
            priority
            className="promoImage"
          />
        </a>

        <div className="links">
          <LineButton href={lineUrl}>เข้าสู่ LINE</LineButton>
        </div>

        <style>{`
          .profileCard{
            width:100%;
            max-width:620px;
            margin:0 auto;
          }

          .promoLink{
            display:block;
            width:100%;
            margin:0 auto 16px;
            border-radius:18px;
            overflow:hidden;
            text-decoration:none;
          }

          .promoImage{
            display:block;
            width:100%;
            height:auto;
          }

          .links{
            width:100%;
          }
        `}</style>
      </section>
    </main>
  );
}
