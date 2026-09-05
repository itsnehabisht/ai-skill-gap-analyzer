"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BunnyIcon from "./BunnyIcon";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "◈",
  },
  {
    name: "My Profile",
    href: "/profile",
    icon: "◎",
  },
  {
    name: "Resume",
    href: "/resume",
    icon: "▣",
  },
  {
    name: "Choose Career",
    href: "/jobs",
    icon: "✦",
  },
  {
    name: "Skill Gap",
    href: "/skill-gap",
    icon: "◐",
  },
  {
    name: "Learning",
    href: "/learning",
    icon: "◇",
  },
  {
    name: "Progress",
    href: "/progress",
    icon: "↗",
  },
  {
    name: "Report",
    href: "/reports",
    icon: "▤",
  },
  {
    name: "Previous Users",
    href: "/users",
    icon: "♙",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-black/5 bg-white/80 backdrop-blur-2xl lg:block">
      <div className="flex h-full flex-col px-5 py-6">

        {/* Logo */}

        <Link href="/dashboard" className="group mb-8 block">
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg transition duration-300 group-hover:scale-105">
              <BunnyIcon className="h-7 w-7" />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight text-zinc-900">
                SkillGap AI
              </p>

              <p className="text-xs text-zinc-500">
                Build your career 🚀
              </p>
            </div>

          </div>
        </Link>


        {/* Navigation */}

        <div className="mb-3 px-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
            Your Journey
          </p>
        </div>

        <nav className="space-y-1.5">

          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/10"
                    : "text-zinc-600 hover:bg-black/5 hover:text-zinc-900"
                }`}
              >

                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl text-base transition ${
                    active
                      ? "bg-white/10 text-white"
                      : "bg-zinc-100 text-zinc-500 group-hover:bg-white"
                  }`}
                >
                  {item.icon}
                </span>

                <span>{item.name}</span>

                {active && (
                  <span className="ml-auto text-xs text-blue-300">
                    ●
                  </span>
                )}

              </Link>
            );
          })}

        </nav>


        {/* Footer */}

        <div className="mt-auto">

          <div className="mt-5 px-3">

            <p className="text-[11px] leading-5 text-zinc-400">
              AI Skill Gap Analyzer
            </p>

            <p className="text-[11px] text-zinc-400">
              Your journey. Your growth. ✨
            </p>

          </div>

        </div>

      </div>
    </aside>
  );
}