"use client";

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

type Recommendation = {
  skill: string;
  priority: string;
  description: string;
  topics: string[];
};

type ReportData = {
  profile: Profile;
  skillGap: SkillGap;
  recommendations: Recommendation[];
  completedSkills: string[];
};

export default function ReportsPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function generateReport() {
      try {
        const selectedJob = localStorage.getItem("selectedJob");

        if (!selectedJob) {
          setMessage("Please select a target job first.");
          setLoading(false);
          return;
        }

        const profileResponse = await fetch(
          "http://127.0.0.1:8000/api/profile",
          {
            cache: "no-store",
          }
        );

        if (!profileResponse.ok) {
          throw new Error("Could not load student profile.");
        }

        const profileData = await profileResponse.json();

        if (!profileData.profile) {
          setMessage("Please complete your profile first.");
          setLoading(false);
          return;
        }

        const profile: Profile = profileData.profile;

        // --------------------------------
        // Load resume-extracted skills
        // --------------------------------

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

        const resumeSkills: string[] =
          skillsData.skills || [];

        const updatedProfile: Profile = {
          ...profile,
          skills: resumeSkills,
        };

        const skillGapResponse = await fetch(
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

        if (!skillGapResponse.ok) {
          throw new Error("Could not calculate skill gap.");
        }

        const skillGap = await skillGapResponse.json();

        if (skillGap.error) {
          throw new Error(skillGap.error);
        }

        const recommendationResponse = await fetch(
          "http://127.0.0.1:8000/api/recommendations",
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

        if (!recommendationResponse.ok) {
          throw new Error("Could not load recommendations.");
        }

        const recommendationData =
          await recommendationResponse.json();

        if (recommendationData.error) {
          throw new Error(recommendationData.error);
        }

        const progressResponse = await fetch(
          "http://127.0.0.1:8000/api/progress",
          {
            cache: "no-store",
          }
        );

        let completedSkills: string[] = [];

        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          completedSkills =
            progressData.completed_skills || [];
        }

        setReport({
          profile: updatedProfile,
          skillGap,
          recommendations:
            recommendationData.recommendations || [],
          completedSkills,
        });
      } catch (error) {
        console.error("Report generation error:", error);

        setMessage(
          error instanceof Error
            ? error.message
            : "We couldn't generate your report."
        );
      } finally {
        setLoading(false);
      }
    }

    generateReport();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />

          <p className="mt-4 text-slate-600">
            Generating your career report...
          </p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-violet-100 bg-white p-8">
          <p className="text-sm font-medium text-blue-700">
            CAREER REPORT
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Your report is waiting.
          </h1>

          <p className="mt-3 text-slate-600">
            {message}
          </p>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  const totalLearningSkills =
    report.recommendations.length;

  const completedCurrentSkills =
    report.recommendations.filter(
      (recommendation) =>
        report.completedSkills.includes(
          recommendation.skill
        )
    );

  const completedCount =
    completedCurrentSkills.length;

  const learningProgress =
    totalLearningSkills === 0
      ? 100
      : Math.min(
          100,
          Math.round(
            (completedCount /
              totalLearningSkills) *
              100
          )
        );

  const skillMatch = Math.round(
    report.skillGap.skill_match_percentage
  );

  const readinessLabel =
    skillMatch >= 80
      ? "Excellent"
      : skillMatch >= 60
      ? "Good progress"
      : skillMatch >= 40
      ? "Developing"
      : "Getting started";

  return (
    <div className="mx-auto max-w-6xl space-y-8 print:max-w-none">

      {/* Header */}

      <section className="rounded-3xl border border-violet-100 bg-white p-8">

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">

          <div>
            <p className="text-sm font-medium text-blue-700">
              AI SKILL GAP ANALYZER
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Career Readiness Report
            </h1>

            <p className="mt-3 text-slate-600">
              Personalized career analysis for{" "}
              <span className="font-medium text-zinc-900">
                {report.profile.name}
              </span>
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 print:hidden"
          >
            Print / Save PDF
          </button>
        </div>

      </section>


      {/* Candidate information */}

      <section className="grid gap-5 md:grid-cols-4">

        <div className="rounded-2xl border border-violet-100 bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Candidate
          </p>

          <p className="mt-2 text-lg font-semibold">
            {report.profile.name}
          </p>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Education
          </p>

          <p className="mt-2 text-lg font-semibold">
            {report.profile.education}
          </p>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Experience
          </p>

          <p className="mt-2 text-lg font-semibold">
            {report.profile.experience_years} year
            {report.profile.experience_years !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Target Career
          </p>

          <p className="mt-2 text-lg font-semibold">
            {report.skillGap.job_title}
          </p>
        </div>

      </section>


      {/* Main readiness score */}

      <section className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white/5 to-transparent p-8">

        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

          <div>

            <p className="text-sm font-medium text-blue-700">
              OVERALL CAREER READINESS
            </p>

            <div className="mt-3 flex items-end gap-4">

              <span className="text-7xl font-bold tracking-tight">
                {skillMatch}%
              </span>

              <span className="pb-3 text-slate-500">
                skill match
              </span>

            </div>

            <p className="mt-3 text-slate-600">
              Readiness status:{" "}
              <span className="font-medium text-zinc-900">
                {readinessLabel}
              </span>
            </p>

          </div>


          <div className="rounded-2xl border border-violet-100 bg-slate-100 p-5 md:min-w-52">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Target Role
            </p>

            <p className="mt-2 font-semibold">
              {report.skillGap.job_title}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {report.skillGap.matching_skills.length} of{" "}
              {report.skillGap.required_skills.length} required
              skills matched
            </p>

          </div>

        </div>


        <div className="mt-8 h-4 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-1000"
            style={{
              width: `${skillMatch}%`,
            }}
          />

        </div>

      </section>


      {/* Summary cards */}

      <section className="grid gap-5 md:grid-cols-4">

        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">

          <p className="text-sm text-green-700">
            MATCHED
          </p>

          <p className="mt-2 text-4xl font-bold">
            {report.skillGap.matching_skills.length}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            skills aligned
          </p>

        </div>


        <div className="rounded-2xl border border-orange-200 bg-orange-400/5 p-6">

          <p className="text-sm text-orange-700">
            TO DEVELOP
          </p>

          <p className="mt-2 text-4xl font-bold">
            {report.skillGap.missing_skills.length}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            skill gaps identified
          </p>

        </div>


        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">

          <p className="text-sm text-blue-700">
            LEARNING
          </p>

          <p className="mt-2 text-4xl font-bold">
            {learningProgress}%
          </p>

          <p className="mt-1 text-sm text-slate-500">
            roadmap completed
          </p>

        </div>


        <div className="rounded-2xl border border-violet-100 bg-white p-6">

          <p className="text-sm text-slate-600">
            PROFILE SKILLS
          </p>

          <p className="mt-2 text-4xl font-bold">
            {report.profile.skills.length}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            skills in your profile
          </p>

        </div>

      </section>


      {/* Strengths */}

      <section className="rounded-3xl border border-violet-100 bg-white p-7">

        <p className="text-sm font-medium text-green-700">
          YOUR STRENGTHS
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          Skills you already have
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          These skills currently match the requirements of your target role.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">

          {report.skillGap.matching_skills.length > 0 ? (
            report.skillGap.matching_skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-green-200 bg-green-100 px-4 py-2 text-sm text-green-700"
              >
                ✓ {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              No matching skills found yet.
            </p>
          )}

        </div>

      </section>


      {/* Skill gaps */}

      <section className="rounded-3xl border border-violet-100 bg-white p-7">

        <p className="text-sm font-medium text-orange-700">
          GROWTH AREAS
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          Skills that can move you forward
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          These are the skills currently missing from your target-role
          requirements.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">

          {report.skillGap.missing_skills.length > 0 ? (
            report.skillGap.missing_skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-orange-200 bg-orange-100 px-4 py-2 text-sm text-orange-700"
              >
                + {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-green-700">
              🎉 You currently match every required skill.
            </p>
          )}

        </div>

      </section>


      {/* Learning progress */}

      <section className="rounded-3xl border border-violet-100 bg-white p-7">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>

            <p className="text-sm font-medium text-blue-700">
              LEARNING PROGRESS
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Your roadmap progress
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {completedCount} of {totalLearningSkills} recommended
              skills completed.
            </p>

          </div>

          <p className="text-4xl font-bold">
            {learningProgress}%
          </p>

        </div>


        <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-700"
            style={{
              width: `${learningProgress}%`,
            }}
          />

        </div>

      </section>


      {/* Recommended roadmap */}

      <section className="rounded-3xl border border-violet-100 bg-white p-7">

        <p className="text-sm font-medium text-blue-700">
          RECOMMENDED ROADMAP
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          What to learn next
        </h2>

        <div className="mt-6 space-y-4">

          {report.recommendations.length > 0 ? (
            report.recommendations.map(
              (recommendation, index) => {

                const completed =
                  report.completedSkills.includes(
                    recommendation.skill
                  );

                return (
                  <div
                    key={recommendation.skill}
                    className="rounded-2xl border border-violet-100 bg-slate-100 p-5"
                  >

                    <div className="flex items-start gap-4">

                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                          completed
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {completed
                          ? "✓"
                          : String(index + 1).padStart(2, "0")}
                      </div>


                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="font-semibold">
                            {recommendation.skill}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              recommendation.priority === "High"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {recommendation.priority} Priority
                          </span>

                          {completed && (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                              Completed
                            </span>
                          )}

                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {recommendation.description}
                        </p>

                      </div>

                    </div>

                  </div>
                );
              }
            )
          ) : (
            <p className="text-sm text-slate-500">
              No learning recommendations available.
            </p>
          )}

        </div>

      </section>


      {/* Final recommendation */}

      <section className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

        <p className="text-sm font-medium text-blue-700">
          YOUR NEXT MOVE 🚀
        </p>

        <h2 className="mt-3 text-3xl font-bold">
          {learningProgress === 100
            ? "You've completed your current roadmap!"
            : skillMatch >= 80
            ? "You're very close to your target."
            : skillMatch >= 60
            ? "You're building strong momentum."
            : "Start with your highest-priority skill."}
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          {learningProgress === 100
            ? "Keep practicing your skills, build projects, and continue updating your profile as you grow."
            : "Your skill gaps are not weaknesses. They are a practical roadmap showing exactly where your next improvement can make the biggest difference."}
        </p>

      </section>


      {/* Footer */}

      <section className="pb-8 text-center">

        <p className="text-xs text-slate-500">
          AI Skill Gap Analyzer • Career Intelligence Report
        </p>

      </section>

    </div>
  );
}