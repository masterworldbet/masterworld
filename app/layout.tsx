import type { Metadata } from "next";
import MetaPixelSettings from "../components/MetaPixelSettings";
import "./globals.css";

export const metadata: Metadata = {
  title: "MasterW — เสื้อผ้าแฟชั่น",
  description: "เลือกชมเสื้อผ้าแฟชั่นสำหรับทุกวัน พร้อมรายละเอียดสินค้าและช่องทางติดต่อร้าน",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>
        <MetaPixelSettings />

        {children}
      </body>
    </html>
  );
}
