"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Profile = {
  name: string;
  education: string;
  experience_years: number;
  skills: string[];
};

type SkillGap = {
  job_title: string;
  required_skills: string[];
  matching_skills: string[];
  missing_skills: string[];
  skill_match_percentage: number;
};

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null);
  const [readiness, setReadiness] = useState<number | null>(null);
  const [learningProgress, setLearningProgress] = useState(0);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const selectedJob = localStorage.getItem("selectedJob");

        if (!selectedJob) {
          setMessage("Please select a target job first.");
          setLoading(false);
          return;
        }

        /* -----------------------------
           LOAD PROFILE
        ----------------------------- */

        const profileResponse = await fetch(
          "http://127.0.0.1:8000/api/profile"
        );

        if (!profileResponse.ok) {
          throw new Error("Could not load profile.");
        }

        const profileData = await profileResponse.json();

        if (!profileData.profile) {
          setMessage("Please complete your profile first.");
          setLoading(false);
          return;
        }

        const currentProfile: Profile = profileData.profile;

        setProfile(currentProfile);


        /* -----------------------------
           LOAD SKILL GAP
        ----------------------------- */

        const skillGapResponse = await fetch(
          "http://127.0.0.1:8000/api/skill-gap",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              student_skills: currentProfile.skills,
              job_id: selectedJob,
            }),
          }
        );

        if (!skillGapResponse.ok) {
          throw new Error("Could not calculate skill gap.");
        }

        const skillGapData = await skillGapResponse.json();

        if (skillGapData.error) {
          throw new Error(skillGapData.error);
        }

        setSkillGap(skillGapData);


        /* -----------------------------
           PREPARE ML INPUT
        ----------------------------- */

        const normalizedSkills = currentProfile.skills.map((skill) =>
          skill.toLowerCase().replace("-", "_")
        );

        const educationMap: Record<string, number> = {
          BCA: 1,
          BBA: 1,
          "B.Tech": 2,
          MCA: 2,
          "M.Tech": 3,
          MBA: 3,
          "B.Pharm": 1,
          Other: 1,
        };

        const educationLevel =
          educationMap[currentProfile.education] ?? 1;

        const hasSkill = (skill: string) => {
          return normalizedSkills.includes(skill);
        };

        const mlInput = {
          python: hasSkill("python") ? 1 : 0,
          sql: hasSkill("sql") ? 1 : 0,
          pandas: hasSkill("pandas") ? 1 : 0,
          numpy: hasSkill("numpy") ? 1 : 0,
          machine_learning:
            hasSkill("machine_learning") ||
            normalizedSkills.includes("machine learning")
              ? 1
              : 0,
          statistics: hasSkill("statistics") ? 1 : 0,
          data_visualization:
            hasSkill("data_visualization") ||
            normalizedSkills.includes("data visualization")
              ? 1
              : 0,
          scikit_learn:
            hasSkill("scikit_learn") ||
            normalizedSkills.includes("scikit-learn")
              ? 1
              : 0,

          experience_years: currentProfile.experience_years,
          education_level: educationLevel,

          skill_match_percentage:
            skillGapData.skill_match_percentage,
        };


        /* -----------------------------
           GET ML JOB READINESS
        ----------------------------- */

        const predictionResponse = await fetch(
          "http://127.0.0.1:8000/api/predict",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(mlInput),
          }
        );

        if (predictionResponse.ok) {
          const predictionData =
            await predictionResponse.json();

          setReadiness(
            Math.round(predictionData.job_readiness)
          );
        }


        /* -----------------------------
           LOAD LEARNING PROGRESS
        ----------------------------- */

        const savedProgress = localStorage.getItem(
          `learningProgress_${selectedJob}`
        );

        if (savedProgress) {
          const completedSkills: string[] =
            JSON.parse(savedProgress);

          const totalSkills =
            skillGapData.missing_skills.length;

          if (totalSkills === 0) {
            setLearningProgress(100);
          } else {
            const completed = completedSkills.filter((skill) =>
              skillGapData.missing_skills.includes(skill)
            ).length;

            setLearningProgress(
              Math.min(
                100,
                Math.round((completed / totalSkills) * 100)
              )
            );
          }
        } else if (skillGapData.missing_skills.length === 0) {
          setLearningProgress(100);
        }

      } catch (error) {
        console.error("Dashboard error:", error);
        setMessage(
          "We couldn't load your dashboard. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);


  /* -----------------------------
     LOADING STATE
  ----------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-blue-400" />

          <p className="mt-4 text-zinc-400">
            Building your career dashboard...
          </p>

        </div>

      </div>
    );
  }


  /* -----------------------------
     ERROR / EMPTY STATE
  ----------------------------- */

  if (message) {
    return (
      <div className="mx-auto max-w-3xl">

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <p className="text-sm font-medium text-blue-400">
            CAREER DASHBOARD
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Your career journey starts here.
          </h1>

          <p className="mt-3 text-zinc-400">
            {message}
          </p>

          <Link
            href="/profile"
            className="mt-6 inline-block rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Complete My Profile →
          </Link>

        </div>

      </div>
    );
  }


  if (!profile || !skillGap) {
    return null;
  }


  const readinessScore = readiness ?? 0;

  const readinessMessage =
    readinessScore >= 80
      ? "You're highly prepared for this role."
      : readinessScore >= 60
      ? "You're making strong progress toward this role."
      : readinessScore >= 40
      ? "You have a solid foundation to build on."
      : "This is your starting point — let's build from here.";


  return (
    <div className="mx-auto max-w-6xl space-y-8">


      {/* --------------------------------
          HEADER
      -------------------------------- */}

      <section>

        <p className="text-sm font-medium text-blue-400">
          YOUR CAREER JOURNEY
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
          Welcome back, {profile.name}.
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Here's your current career readiness for{" "}
          <span className="font-medium text-white">
            {skillGap.job_title}
          </span>
          .
        </p>

      </section>


      {/* --------------------------------
          MAIN STATS
      -------------------------------- */}

      <section className="grid gap-5 md:grid-cols-4">


        {/* Readiness */}

        <div className="rounded-2xl border border-blue-400/20 bg-blue-400/5 p-6">

          <p className="text-sm text-blue-300">
            Job Readiness
          </p>

          <p className="mt-3 text-4xl font-bold">
            {readinessScore}%
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            {readinessMessage}
          </p>

        </div>


        {/* Skills matched */}

        <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-6">

          <p className="text-sm text-green-300">
            Skills Matched
          </p>

          <p className="mt-3 text-4xl font-bold">
            {skillGap.matching_skills.length}
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Skills aligned with your target role
          </p>

        </div>


        {/* Missing */}

        <div className="rounded-2xl border border-orange-400/20 bg-orange-400/5 p-6">

          <p className="text-sm text-orange-300">
            Skills to Develop
          </p>

          <p className="mt-3 text-4xl font-bold">
            {skillGap.missing_skills.length}
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Opportunities to improve
          </p>

        </div>


        {/* Learning */}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

          <p className="text-sm text-zinc-400">
            Learning Progress
          </p>

          <p className="mt-3 text-4xl font-bold">
            {learningProgress}%
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Your current roadmap progress
          </p>

        </div>

      </section>


      {/* --------------------------------
          SKILL MATCH BAR
      -------------------------------- */}

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>

            <p className="text-sm text-zinc-500">
              TARGET ROLE
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {skillGap.job_title}
            </h2>

          </div>

          <div className="md:text-right">

            <p className="text-sm text-zinc-500">
              Overall Skill Match
            </p>

            <p className="mt-1 text-3xl font-bold">
              {Math.round(
                skillGap.skill_match_percentage
              )}%
            </p>

          </div>

        </div>


        <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full rounded-full bg-blue-400 transition-all duration-1000"
            style={{
              width: `${skillGap.skill_match_percentage}%`,
            }}
          />

        </div>

      </section>


      {/* --------------------------------
          PROFILE SUMMARY
      -------------------------------- */}

      <section className="grid gap-5 md:grid-cols-3">


        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

          <p className="text-sm text-zinc-500">
            Education
          </p>

          <p className="mt-2 text-xl font-semibold">
            {profile.education}
          </p>

        </div>


        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

          <p className="text-sm text-zinc-500">
            Experience
          </p>

          <p className="mt-2 text-xl font-semibold">
            {profile.experience_years} year
            {profile.experience_years !== 1 ? "s" : ""}
          </p>

        </div>


        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

          <p className="text-sm text-zinc-500">
            Your Skills
          </p>

          <p className="mt-2 text-xl font-semibold">
            {profile.skills.length}
          </p>

        </div>

      </section>


      {/* --------------------------------
          NEXT MOVE
      -------------------------------- */}

      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-8">

        <p className="text-sm text-blue-400">
          YOUR NEXT MOVE
        </p>

        <h2 className="mt-3 text-2xl font-semibold">
          {skillGap.missing_skills.length === 0
            ? "You're ready to take the next step."
            : `Focus on ${skillGap.missing_skills[0]} next.`}
        </h2>

        <p className="mt-3 max-w-2xl leading-7 text-zinc-400">

          {skillGap.missing_skills.length === 0
            ? "You've matched all the required skills for your target role. Keep practicing, building projects, and preparing for opportunities."
            : "Your skill gap is not a barrier. It's a roadmap. Start with the most important missing skill and gradually build your readiness."}

        </p>


        <div className="mt-6 flex flex-wrap gap-3">

          <Link
            href="/skill-gap"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Explore My Skill Gap →
          </Link>

          <Link
            href="/learning"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View Learning Roadmap
          </Link>

        </div>

      </section>


    </div>
  );
}