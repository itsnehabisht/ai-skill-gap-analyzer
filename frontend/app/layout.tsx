import type { Metadata } from "next";
import "./globals.css";

import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "SkillGap AI",
  description: "AI-powered career skill gap analyzer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 text-zinc-900 antialiased">

        {/* Sidebar */}

        <Sidebar />


        {/* Main application */}

        <main className="min-h-screen lg:ml-72">

          <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">
            {children}
          </div>

        </main>

      </body>
    </html>
  );
}