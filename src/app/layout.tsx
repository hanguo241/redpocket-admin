import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font";
import { GeistMono } from "geist/font/mono";
import { AuthProvider } from "@/lib/auth";
import { Shell } from "./shell";

export const metadata: Metadata = {
  title: "RedPacket Admin",
  description: "RedPacket 管理后台",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif" }}>
        <AuthProvider>
          <Shell>{children}</Shell>
        </AuthProvider>
      </body>
    </html>
  );
}
