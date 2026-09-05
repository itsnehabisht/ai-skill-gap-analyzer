"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BunnyIcon from "./BunnyIcon";

type BunnyMessage = {
  title: string;
  message: string;
  action: string;
  actionHref: string;
};

const pageMessages: Record<string, BunnyMessage> = {
  "/": {
    title: "Hey! I'm Bunny 🐰",
    message:
      "I'm your career companion! Let's turn your skills into your next opportunity.",
    action: "Let's begin →",
    actionHref: "/profile",
  },

  "/profile": {
    title: "Let's build your foundation! 🐰",
    message:
      "Tell me about yourself honestly. Your profile helps me understand where you're starting from.",
    action: "Continue to Resume →",
    actionHref: "/resume",
  },

  "/resume": {
    title: "Let me check your resume! 🔎🐰",
    message:
      "Upload your resume and I'll help discover the skills and experience you already have.",
    action: "Choose your career →",
    actionHref: "/jobs",
  },

  "/jobs": {
    title: "Where are we going? 🧭🐰",
    message:
      "Choose your target career. I'll help you understand exactly what skills that career needs.",
    action: "Choose your destination →",
    actionHref: "/jobs",
  },

  "/skill-gap": {
    title: "Don't fear the gaps! 💪🐰",
    message:
      "Your missing skills aren't weaknesses. They are simply clues showing you what to learn next.",
    action: "See what to learn →",
    actionHref: "/learning",
  },

  "/learning": {
    title: "Time to level up! 🚀🐰",
    message:
      "You don't have to learn everything at once. Focus on one skill, practice it, and keep moving forward.",
    action: "Track your progress →",
    actionHref: "/progress",
  },

  "/progress": {
    title: "Look how far you've come! 🎉🐰",
    message:
      "Every completed skill makes your career gap smaller. Keep going — consistency beats speed!",
    action: "See your dashboard →",
    actionHref: "/dashboard",
  },

  "/dashboard": {
    title: "Welcome to your career control center! 🎯🐰",
    message:
      "Here you can see your skill match, AI readiness, learning progress, and your next steps.",
    action: "Review your report →",
    actionHref: "/reports",
  },

  "/reports": {
    title: "Your career picture is ready! 📊🐰",
    message:
      "Your report brings your profile, skill gap, recommendations, and progress together.",
    action: "Back to dashboard →",
    actionHref: "/dashboard",
  },
};

const defaultMessage: BunnyMessage = {
  title: "I'm right here with you! 🐰",
  message:
    "Every step you take is progress. Let's keep building your career one skill at a time.",
  action: "Keep going →",
  actionHref: "/dashboard",
};

export default function BunnyGuide() {
  const pathname = usePathname();

  const [visible, setVisible] = useState(false);
  const [message, setMessage] =
    useState<BunnyMessage>(defaultMessage);

  useEffect(() => {
    const currentMessage =
      pageMessages[pathname] || defaultMessage;

    setMessage(currentMessage);

    const timer = setTimeout(() => {
      setVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  function handleBunnyClick() {
    setVisible((current) => !current);
  }

  return (
    /*
      IMPORTANT:
      The outer fixed container does NOT receive pointer events.
      This prevents Bunny from blocking buttons underneath it.
    */
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end">

      {/* --------------------------------------------- */}
      {/* SPEECH BUBBLE */}
      {/* --------------------------------------------- */}

      <div
        className={`mb-3 w-[300px] max-w-[calc(100vw-2rem)] origin-bottom-right transition-all duration-500 ${
          visible
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0"
        }`}
      >
        <div className="relative rounded-3xl border border-violet-100 bg-white/95 p-5 shadow-2xl shadow-black/15 backdrop-blur-xl">

          {/* Bubble pointer */}

          <div className="absolute -bottom-2 right-9 h-4 w-4 rotate-45 border-b border-r border-violet-100 bg-white" />

          <div className="relative">

            {/* Header */}

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                <BunnyIcon className="h-6 w-6" />
              </div>

              <div className="min-w-0">

                <p className="text-sm font-bold text-zinc-900">
                  {message.title}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  {message.message}
                </p>

              </div>

            </div>

            {/* --------------------------------------- */}
            {/* CLICKABLE ACTION */}
            {/* --------------------------------------- */}

            <Link
              href={message.actionHref}
              className="mt-4 block rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100 hover:text-blue-800"
            >
              {message.action}
            </Link>

          </div>
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* BUNNY BUTTON */}
      {/* --------------------------------------------- */}

      <button
        type="button"
        onClick={handleBunnyClick}
        aria-label="Open Bunny career guide"
        className="pointer-events-auto group relative"
      >

        {/* Glow */}

        <div className="pointer-events-none absolute inset-0 scale-125 rounded-full bg-blue-100 opacity-70 blur-2xl transition duration-500 group-hover:scale-150 group-hover:bg-blue-600/20" />

        {/* Bunny circle */}

        <div className="bunny-float relative flex h-20 w-20 items-center justify-center rounded-full border border-violet-100 bg-gradient-to-br from-[#4C5FEA] to-[#6D4DE8] text-white shadow-2xl shadow-blue-500/25 transition duration-300 group-hover:scale-110">
          <BunnyIcon className="h-12 w-12" />

        </div>

        {/* Notification badge */}

        <div className="pointer-events-none absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-xs font-black text-white shadow-lg">
          !
        </div>

      </button>
    </div>
  );
}