import type { Metadata } from "next";
import MetaPixelSettings from "../components/MetaPixelSettings";
import "./globals.css";

export const metadata: Metadata = {
  title: "MASTER WORLD CLASS | เกมออนไลน์",
  description: "หน้าแนะนำเกมออนไลน์ของ MASTER WORLD CLASS",
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
