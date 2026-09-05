"use client";

import { useEffect, useState } from "react";

type SkillGapResult = {
  job_title: string;
  required_skills: string[];
  matching_skills: string[];
  missing_skills: string[];
  skill_match_percentage: number;
};

export default function SkillGapPage() {
  const [result, setResult] = useState<SkillGapResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSkillGap() {
      try {
        setLoading(true);
        setMessage("");

        const selectedJob = localStorage.getItem("selectedJob");

        console.log("Selected job:", selectedJob);

        if (!selectedJob) {
          setMessage("Please select a target job first.");
          return;
        }

        const profileResponse = await fetch(
          "http://127.0.0.1:8000/api/profile",
          {
            cache: "no-store",
          }
        );

        if (!profileResponse.ok) {
          throw new Error("Could not load profile.");
        }

        const profileData = await profileResponse.json();

        console.log("Profile:", profileData.profile);

        if (!profileData.profile) {
          setMessage("Please complete your profile first.");
          return;
        }

        // Resume-extracted skills are the source of truth.
        const skillsResponse = await fetch(
          "http://127.0.0.1:8000/api/resume/skills",
          {
            cache: "no-store",
          }
        );

        if (!skillsResponse.ok) {
          throw new Error("Could not load resume skills.");
        }

        const skillsData = await skillsResponse.json();
        const skills: string[] = skillsData.skills || [];

        console.log("Resume skills sent to skill-gap:", skills);

        const response = await fetch(
          "http://127.0.0.1:8000/api/skill-gap",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              student_skills: skills,
              job_id: selectedJob,
            }),
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Skill gap request failed.");
        }

        const data = await response.json();

        console.log("Skill gap response:", data);

        if (data.error) {
          throw new Error(data.error);
        }

        setResult({
          job_title: data.job_title,
          required_skills: data.required_skills || [],
          matching_skills: data.matching_skills || [],
          missing_skills: data.missing_skills || [],
          skill_match_percentage:
            Number(data.skill_match_percentage) || 0,
        });
      } catch (error) {
        console.error("Skill gap error:", error);

        setMessage(
          error instanceof Error
            ? error.message
            : "We couldn't analyze your skill gap. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSkillGap();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-blue-400" />

          <p className="mt-4 text-zinc-400">
            Analyzing your skills...
          </p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm font-medium text-blue-400">
            SKILL GAP ANALYSIS
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Let's analyze your career fit.
          </h1>

          <p className="mt-3 text-zinc-400">
            {message}
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      {/* Header */}

      <section>
        <p className="text-sm font-medium text-blue-400">
          SKILL GAP ANALYSIS
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Your path to {result.job_title}
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Here's how your current skills compare with the requirements
          of your target career.
        </p>
      </section>


      {/* Main score */}

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="text-sm text-zinc-500">
              Overall Skill Match
            </p>

            <div className="mt-2 flex items-end gap-3">
              <span className="text-6xl font-bold">
                {result.skill_match_percentage}%
              </span>

              <span className="pb-2 text-zinc-500">
                match
              </span>
            </div>
          </div>


          <div className="md:text-right">

            <p className="text-sm text-zinc-500">
              Skills matched
            </p>

            <p className="mt-1 text-3xl font-bold">
              {result.matching_skills.length}
              <span className="text-zinc-600">
                /{result.required_skills.length}
              </span>
            </p>

          </div>

        </div>


        <div className="mt-6 h-4 overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full rounded-full bg-blue-400 transition-all duration-700"
            style={{
              width: `${Math.min(
                Math.max(result.skill_match_percentage, 0),
                100
              )}%`,
            }}
          />

        </div>

      </section>


      {/* Quick statistics */}

      <section className="grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-zinc-500">
            Match Score
          </p>

          <p className="mt-3 text-4xl font-bold">
            {result.skill_match_percentage}%
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Your current role alignment
          </p>
        </div>


        <div className="rounded-2xl border border-green-400/10 bg-green-400/5 p-6">
          <p className="text-sm text-green-400">
            Skills You Have
          </p>
          <p className="mt-3 text-4xl font-bold text-green-300">
            {result.matching_skills.length}
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Skills matching this role
          </p>
        </div>


        <div className="rounded-2xl border border-orange-400/10 bg-orange-400/5 p-6">
          <p className="text-sm text-orange-400">
            Skills To Develop
          </p>

          <p className="mt-3 text-4xl font-bold text-orange-300">
            {result.missing_skills.length}
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Skills remaining in your roadmap
          </p>
        </div>

      </section>


      {/* Matching and missing skills */}

      <section className="grid gap-6 md:grid-cols-2">

        {/* Matching */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-green-400">
                ✓ SKILLS YOU HAVE
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Already aligned with your target role
              </p>
            </div>

            <span className="rounded-full bg-green-400/10 px-3 py-1 text-sm text-green-300">
              {result.matching_skills.length}
            </span>

          </div>


          <div className="mt-6 flex flex-wrap gap-3">

            {result.matching_skills.length > 0 ? (
              result.matching_skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm text-green-300"
                >
                  ✓ {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-zinc-500">
                No matching skills yet.
              </p>
            )}

          </div>

        </div>


        {/* Missing */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-orange-400">
                ◇ SKILLS TO DEVELOP
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                These skills can improve your career readiness
              </p>
            </div>

            <span className="rounded-full bg-orange-400/10 px-3 py-1 text-sm text-orange-300">
              {result.missing_skills.length}
            </span>

          </div>


          <div className="mt-6 flex flex-wrap gap-3">

            {result.missing_skills.length > 0 ? (
              result.missing_skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-sm text-orange-300"
                >
                  + {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-zinc-500">
                Amazing! You match every required skill.
              </p>
            )}

          </div>

        </div>

      </section>


      {/* Required skills */}

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">

        <p className="text-sm font-medium text-zinc-400">
          ROLE REQUIREMENTS
        </p>

        <h2 className="mt-2 text-xl font-semibold">
          Skills expected for {result.job_title}
        </h2>

        <div className="mt-5 flex flex-wrap gap-3">

          {result.required_skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-zinc-300"
            >
              {skill}
            </span>
          ))}

        </div>

      </section>


      {/* Next step */}

      <section className="rounded-3xl border border-blue-400/20 bg-blue-400/5 p-8">

        <p className="text-sm font-medium text-blue-300">
          YOUR NEXT STEP 🚀
        </p>

        <h2 className="mt-3 text-2xl font-semibold">
          Your missing skills are your roadmap.
        </h2>

        <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
          You already have {result.matching_skills.length} skill
          {result.matching_skills.length !== 1 ? "s" : ""} that match
          this role. Focus on the {result.missing_skills.length} skill
          {result.missing_skills.length !== 1 ? "s" : ""} you still need
          to develop.
        </p>

      </section>

    </div>
  );
}