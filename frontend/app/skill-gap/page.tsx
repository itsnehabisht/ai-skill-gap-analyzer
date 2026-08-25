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
    async function analyzeSkillGap() {
      try {
        /*
         * Get the target job selected by the student.
         */
        const selectedJob = localStorage.getItem("selectedJob");

        if (!selectedJob) {
          setMessage("Please choose a target career first.");
          setLoading(false);
          return;
        }


        /*
         * Get skills extracted from the uploaded resume.
         */
        const resumeResponse = await fetch(
          "http://127.0.0.1:8000/api/resume/skills"
        );

        if (!resumeResponse.ok) {
          throw new Error("Could not load resume skills.");
        }

        const resumeData = await resumeResponse.json();

        const resumeSkills = resumeData.skills || [];


        /*
         * If no resume skills exist, ask the student
         * to upload a resume first.
         */
        if (resumeSkills.length === 0) {
          setMessage(
            "Please upload and analyze your resume first so we can identify your skills."
          );

          setLoading(false);
          return;
        }


        /*
         * Send resume-extracted skills + target job
         * to the skill gap engine.
         */
        const response = await fetch(
          "http://127.0.0.1:8000/api/skill-gap",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              student_skills: resumeSkills,
              job_id: selectedJob,
            }),
          }
        );


        if (!response.ok) {
          throw new Error("Skill gap analysis failed.");
        }


        const data = await response.json();


        if (data.error) {
          throw new Error(data.error);
        }


        setResult(data);

      } catch (error) {

        console.error("Skill gap error:", error);

        setMessage(
          "We couldn't analyze your skill gap. Please upload your resume and choose a target job."
        );

      } finally {

        setLoading(false);
      }
    }


    analyzeSkillGap();

  }, []);


  /*
   * Loading screen
   */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-blue-400" />

          <p className="mt-5 text-lg font-medium text-white">
            Analyzing your career readiness...
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Comparing your resume skills with your target role.
          </p>

        </div>

      </div>
    );
  }


  /*
   * Error / missing information screen
   */
  if (message) {
    return (
      <div className="mx-auto max-w-3xl">

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <p className="text-sm font-medium text-blue-400">
            SKILL GAP ANALYSIS
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Let's find your skill gap.
          </h1>

          <p className="mt-3 leading-7 text-zinc-400">
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


      {/* Heading */}

      <section>

        <p className="text-sm font-medium text-blue-400">
          SKILL GAP ANALYSIS
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Your path to {result.job_title}
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          We analyzed the skills found in your resume and compared them
          with the requirements of your target career.
        </p>

      </section>


      {/* Main score */}

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

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


          <div className="text-left md:text-right">

            <p className="text-sm text-zinc-500">
              Skills matched
            </p>

            <p className="mt-1 text-2xl font-semibold">

              {result.matching_skills.length}

              <span className="text-zinc-600">
                /{result.required_skills.length}
              </span>

            </p>

          </div>

        </div>


        {/* Progress bar */}

        <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full rounded-full bg-blue-400 transition-all duration-1000"
            style={{
              width: `${result.skill_match_percentage}%`,
            }}
          />

        </div>


        <p className="mt-3 text-sm text-zinc-500">
          Your resume currently covers{" "}
          {result.skill_match_percentage}% of the skills required
          for this role.
        </p>

      </section>


      {/* Skill comparison */}

      <section className="grid gap-6 md:grid-cols-2">


        {/* Matching skills */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-green-400">
                ✓ SKILLS YOU HAVE
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Skills found in your resume
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


        {/* Missing skills */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-medium text-orange-400">
                ◇ SKILLS TO DEVELOP
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Skills required by your target role
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
                Amazing! You currently match every required skill.
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


      {/* Resume-based insight */}

      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-8">

        <p className="text-sm font-medium text-blue-400">
          YOUR CAREER INSIGHT
        </p>

        <h2 className="mt-3 text-2xl font-semibold">
          Your skill gap is your roadmap. 🚀
        </h2>

        <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
          Your missing skills aren't weaknesses. They show you exactly
          what to learn next. We'll use these gaps to create a
          personalized learning path for you.
        </p>

      </section>


    </div>
  );
}