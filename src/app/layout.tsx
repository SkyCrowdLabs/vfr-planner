import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VFR Planner",
  description: "Created by SkyCrowd Labs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full bg-white">
      <body className={`h-full ${inter.className}`}>{children}</body>
    </html>
  );
}
