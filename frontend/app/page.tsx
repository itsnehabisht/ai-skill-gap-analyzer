"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Profile = {
  name: string;
  education: string;
  experience_years: number;
  skills: string[];
};

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/profile",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data.profile) {
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("Dashboard profile error:", error);
      }
    }

    loadProfile();
  }, []);

  const studentName = profile?.name || "Explorer";
  const skillCount = profile?.skills?.length || 0;

  return (
    <div className="fade-up mx-auto max-w-7xl space-y-7">

      {/* Hero */}

      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-purple-600 to-blue-500 p-7 text-white shadow-xl shadow-violet-200 md:p-9">

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 right-1/3 h-32 w-32 rounded-full bg-pink-300/20 blur-2xl" />

        <div className="relative flex flex-col items-center gap-7 md:flex-row">

          {/* Bunny */}

          <div className="bunny-float flex h-36 w-36 shrink-0 items-center justify-center rounded-[2rem] bg-white/15 text-8xl shadow-lg backdrop-blur-sm">
            🐰
          </div>


          <div className="flex-1">

            <p className="text-sm font-semibold uppercase tracking-widest text-violet-200">
              Your Career Journey ✨
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
              You're doing great, {studentName}! 🚀
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-violet-100 md:text-base">
              Every skill you learn is a step closer to your dream career.
              Let's discover your strengths, close your skill gaps, and build
              your future together.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">

              <Link
                href="/skill-gap"
                className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-50"
              >
                Explore My Skill Gap →
              </Link>

              <Link
                href="/learning"
                className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Start Learning 📚
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* Stats */}

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <div className="app-card rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Job Readiness
            </p>

            <span className="rounded-xl bg-violet-50 p-2 text-xl">
              🎯
            </span>
          </div>

          <p className="mt-4 text-4xl font-extrabold text-slate-900">
            48%
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Your current readiness score
          </p>
        </div>


        <div className="app-card rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Skills You Have
            </p>

            <span className="rounded-xl bg-emerald-50 p-2 text-xl">
              💪
            </span>
          </div>

          <p className="mt-4 text-4xl font-extrabold text-slate-900">
            {skillCount}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Skills in your profile
          </p>
        </div>


        <div className="app-card rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Skills to Develop
            </p>

            <span className="rounded-xl bg-orange-50 p-2 text-xl">
              🔥
            </span>
          </div>

          <p className="mt-4 text-4xl font-extrabold text-slate-900">
            6
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Opportunities to grow
          </p>
        </div>


        <div className="app-card rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Learning Streak
            </p>

            <span className="rounded-xl bg-pink-50 p-2 text-xl">
              🔥
            </span>
          </div>

          <p className="mt-4 text-4xl font-extrabold text-slate-900">
            1
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Keep the momentum going!
          </p>
        </div>

      </section>


      {/* Main content */}

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">

        {/* Career roadmap */}

        <div className="app-card rounded-3xl p-7">

          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-sm font-semibold text-violet-600">
                🗺️ YOUR ROADMAP
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                Build your career step by step
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Complete each stage and watch your confidence grow.
              </p>
            </div>
            <Link
              href="/learning"
              className="hidden rounded-xl border border-violet-200 px-4 py-2 text-xs font-bold text-violet-600 transition hover:bg-violet-50 sm:block"
            >
              View Roadmap →
            </Link>

          </div>


          <div className="mt-7 space-y-4">

            <RoadmapItem
              number="01"
              icon="👤"
              title="Complete Your Profile"
              description="Tell us about your education, experience and skills."
              completed={skillCount > 0}
            />

            <RoadmapItem
              number="02"
              icon="🎯"
              title="Choose Your Target Career"
              description="Select the career you want to prepare for."
              completed={false}
            />

            <RoadmapItem
              number="03"
              icon="🔍"
              title="Discover Your Skill Gap"
              description="See which skills you already have and which you need."
              completed={false}
            />

            <RoadmapItem
              number="04"
              icon="📚"
              title="Follow Your Learning Path"
              description="Learn the most important missing skills first."
              completed={false}
            />

          </div>

        </div>


        {/* Bunny coach */}

        <div className="space-y-6">

          <div className="soft-card overflow-hidden rounded-3xl p-6">

            <p className="text-sm font-bold text-violet-600">
              🐰 BUNNY'S MESSAGE
            </p>

            <div className="mt-4 flex items-center gap-4">

              <div className="bunny-float flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-5xl">
                🐰
              </div>

              <div>
                <p className="font-bold text-slate-800">
                  You've got this! 💪
                </p>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Don't compare your beginning with someone else's middle.
                </p>
              </div>

            </div>

          </div>


          <div className="rounded-3xl bg-gradient-to-br from-pink-50 to-violet-50 p-6">

            <p className="text-sm font-bold text-violet-700">
              ✨ Today's Motivation
            </p>

            <p className="mt-4 text-lg font-bold leading-7 text-slate-800">
              “The expert in anything was once a beginner.”
            </p>

            <p className="mt-3 text-sm text-slate-500">
              One small learning session today can change where you are
              tomorrow. 🌱
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}


function RoadmapItem({
  number,
  icon,
  title,
  description,
  completed,
}: {
  number: string;
  icon: string;
  title: string;
  description: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-violet-200 hover:bg-violet-50/40">

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
          completed
            ? "bg-emerald-100 text-emerald-600"
            : "bg-violet-100 text-violet-600"
        }`}
      >
        {completed ? "✓" : number}
      </div>

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex flex-wrap items-center gap-2">

          <h3 className="font-bold text-slate-800">
            {title}
          </h3>

          {completed && (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-600">
              COMPLETED
            </span>
          )}

        </div>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

      <span className="hidden text-slate-300 sm:block">
        →
      </span>

    </div>
  );
}