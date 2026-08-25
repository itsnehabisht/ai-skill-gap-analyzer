"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: "⌂" },
  { name: "My Profile", href: "/profile", icon: "◉" },
  { name: "Resume", href: "/resume", icon: "▣" },
  { name: "Target Job", href: "/jobs", icon: "◎" },
  { name: "Skill Gap", href: "/skill-gap", icon: "◇" },
  { name: "Learning", href: "/learning", icon: "▤" },
  { name: "Progress", href: "/progress", icon: "↗" },
  { name: "Reports", href: "/reports", icon: "▥" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[#EDE8DF]/10 bg-[#0B0F14] px-5 py-6 text-[#EDE8DF]">
     
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono-ui { font-family: 'IBM Plex Mono', monospace; }
        @media (prefers-reduced-motion: reduce) {
          .current-position { animation: none; }
        }
      `}</style>

      <div className="mb-10">
        <h1 className="font-display text-xl font-semibold">
          Skill<span className="text-[#E8A33D]">Gap</span>
        </h1>
        <p className="font-mono-ui mt-1 text-[10px] tracking-wider text-[#8B93A1]">
          AI CAREER INTELLIGENCE
        </p>
      </div>

      <nav className="relative flex flex-1 flex-col gap-1">
        <div
          aria-hidden
          className="absolute left-[26px] top-4 bottom-4 w-px border-l-2 border-dashed border-[#EDE8DF]/10"
        />

        {menuItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm transition ${
                active ? "text-[#EDE8DF]" : "text-[#8B93A1] hover:text-[#EDE8DF]"
              }`}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-xl bg-[#E8A33D]/[0.06]"
                />
              )}

              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm transition ${
                  active
                    ? "current-position animate-pulse border-[#E8A33D] bg-[#E8A33D]/10 text-[#E8A33D]"
                    : "border-[#EDE8DF]/15 bg-[#0B0F14] group-hover:border-[#E8A33D]/50"
                }`}
              >
                {item.icon}
              </span>

              <span className="relative z-10 flex flex-col leading-tight">
                {item.name}
                {active && (
                  <span className="font-mono-ui text-[9px] tracking-wider text-[#E8A33D]/70">
                    YOU ARE HERE
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="relative overflow-hidden rounded-2xl border border-[#EDE8DF]/10 bg-gradient-to-br from-[#12171F] to-[#0B0F14] p-4">
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 text-[#EDE8DF]/[0.05]"
        >
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M50 4 L54 46 L50 50 L46 46 Z" fill="currentColor" />
        </svg>

        <p className="font-mono-ui text-[10px] tracking-[0.2em] text-[#8FB996]">
          TRAILHEAD
        </p>
        <p className="relative mt-1.5 text-sm font-medium text-[#EDE8DF]">
          Keep growing
        </p>
        <p className="relative mt-1 text-xs leading-5 text-[#8B93A1]">
          Your next skill could be the one that changes your career.
        </p>
      </div>
    </aside>
  );
}