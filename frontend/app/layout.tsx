import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-ui",
});

export const metadata: Metadata = {
  title: "AI Skill Gap Analyzer",
  description: "Discover your career skill gaps and build your roadmap.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="bg-[#0B0F14] text-[#EDE8DF] antialiased">
        <Sidebar />

        <main className="ml-64 min-h-screen">
          <Header />

          <div className="px-8 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}