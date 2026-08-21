import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Skill Gap Analyzer",
  description: "Discover the skills you need for your dream job.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}