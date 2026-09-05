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

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null);
  const [recommendations, setRecommendations] = useState<
    Recommendation[]
  >([]);
  const [jobReadiness, setJobReadiness] = useState<number | null>(
    null
  );

  const [completedSkills, setCompletedSkills] = useState<string[]>(
    []
  );

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

        // --------------------------------
        // 1. Load student profile
        // --------------------------------

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

        if (!profileData.profile) {
          setMessage("Please complete your profile first.");
          setLoading(false);
          return;
        }

        const studentProfile = profileData.profile;

        setProfile(studentProfile);

        // --------------------------------
        // 2. Load resume-extracted skills
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

        // --------------------------------
        // 3. Calculate skill gap
        // --------------------------------

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

        const skillGapData = await skillGapResponse.json();

        if (skillGapData.error) {
          throw new Error(skillGapData.error);
        }

        setSkillGap(skillGapData);

        // --------------------------------
        // 4. Load recommendations
        // --------------------------------

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
          throw new Error(
            "Could not load recommendations."
          );
        }

        const recommendationData =
          await recommendationResponse.json();

        setRecommendations(
          recommendationData.recommendations || []
        );

        // --------------------------------
        // 5. Load learning progress
        // --------------------------------

        const progressResponse = await fetch(
          "http://127.0.0.1:8000/api/progress",
          {
            cache: "no-store",
          }
        );

        if (!progressResponse.ok) {
          throw new Error("Could not load learning progress.");
        }

        const progressData =
          await progressResponse.json();

        setCompletedSkills(
          progressData.completed_skills || []
        );

        // --------------------------------
        // 6. Calculate ML job readiness
        // --------------------------------

        const skills = resumeSkills;

        const normalizedSkills = skills.map(
          (skill: string) => skill.toLowerCase().trim()
        );

        const studentData = {
          python: normalizedSkills.includes("python")
            ? 1
            : 0,

          sql: normalizedSkills.includes("sql")
            ? 1
            : 0,

          pandas: normalizedSkills.includes("pandas")
            ? 1
            : 0,

          numpy: normalizedSkills.includes("numpy")
            ? 1
            : 0,

          machine_learning:
            normalizedSkills.includes("machine learning")
              ? 1
              : 0,

          statistics:
            normalizedSkills.includes("statistics")
              ? 1
              : 0,

          data_visualization:
            normalizedSkills.includes("data visualization")
              ? 1
              : 0,

          scikit_learn:
            normalizedSkills.includes("scikit-learn") ||
            normalizedSkills.includes("scikit learn")
              ? 1
              : 0,

          experience_years:
            studentProfile.experience_years,

          education_level:
            studentProfile.education === "BCA"
              ? 2
              : studentProfile.education === "B.Tech"
              ? 3
              : 1,

          skill_match_percentage:
            skillGapData.skill_match_percentage,
        };

        const predictionResponse = await fetch(
          "http://127.0.0.1:8000/api/predict",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(studentData),
          }
        );

        if (predictionResponse.ok) {
          const predictionData =
            await predictionResponse.json();

          setJobReadiness(
            predictionData.job_readiness
          );
        }
      } catch (error) {
        console.error(error);

        setMessage(
          error instanceof Error
            ? error.message
            : "We couldn't load your dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />

          <p className="mt-4 text-slate-600">
            Preparing your dashboard...
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
            DASHBOARD
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Your dashboard is waiting.
          </h1>

          <p className="mt-3 text-slate-600">
            {message}
          </p>
        </div>
      </div>
    );
  }

  if (!profile || !skillGap) {
    return null;
  }

  const totalSkills = recommendations.length;

  const completedCurrentSkills =
    recommendations.filter((recommendation) =>
      completedSkills.includes(recommendation.skill)
    );

  const completedCount =
    completedCurrentSkills.length;

  const learningProgress =
    totalSkills === 0
      ? 100
      : Math.min(
          100,
          Math.round(
            (completedCount / totalSkills) * 100
          )
        );

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* -------------------------------- */}
      {/* Welcome */}
      {/* -------------------------------- */}

      <section>
        <p className="text-sm font-medium text-blue-700">
          YOUR CAREER DASHBOARD
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Welcome back, {profile.name} 👋
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600">
          Here's a snapshot of your progress toward becoming a{" "}
          <span className="font-medium text-slate-800">
            {skillGap.job_title}
          </span>
          .
        </p>
      </section>

      {/* -------------------------------- */}
      {/* Main scores */}
      {/* -------------------------------- */}

      <section className="grid gap-5 md:grid-cols-2">

        {/* Skill Match */}

        <div className="rounded-3xl border border-violet-100 bg-white p-7">
          <p className="text-sm text-slate-500">
            SKILL MATCH
          </p>

          <div className="mt-2 flex items-end gap-3">
            <span className="text-6xl font-bold">
              {skillGap.skill_match_percentage}%
            </span>

            <span className="pb-2 text-slate-500">
              of required skills
            </span>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-700"
              style={{
                width: `${skillGap.skill_match_percentage}%`,
              }}
            />
          </div>
        </div>

        {/* Job Readiness */}

        <div className="rounded-3xl border border-violet-100 bg-white p-7">
          <p className="text-sm text-slate-500">
            AI JOB READINESS
          </p>

          <div className="mt-2 flex items-end gap-3">
            <span className="text-6xl font-bold">
              {jobReadiness !== null
                ? `${jobReadiness}%`
                : "--"}
            </span>

            <span className="pb-2 text-slate-500">
              model prediction
            </span>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-500">
            This score is generated by the trained
            machine-learning model using your current
            profile information.
          </p>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Quick stats */}
      {/* -------------------------------- */}

      <section className="grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
          <p className="text-sm text-green-700">
            MATCHING SKILLS
          </p>

          <p className="mt-2 text-4xl font-bold">
            {skillGap.matching_skills.length}
          </p>
        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-400/5 p-6">
          <p className="text-sm text-orange-700">
            SKILLS TO DEVELOP
          </p>

          <p className="mt-2 text-4xl font-bold">
            {skillGap.missing_skills.length}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <p className="text-sm text-blue-700">
            LEARNING PROGRESS
          </p>

          <p className="mt-2 text-4xl font-bold">
            {learningProgress}%
          </p>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Strengths + gaps */}
      {/* -------------------------------- */}

      <section className="grid gap-6 md:grid-cols-2">

        {/* Strengths */}

        <div className="rounded-3xl border border-violet-100 bg-white p-7">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-green-700">
              YOUR STRENGTHS
            </p>

            <a
              href="/skill-gap"
              className="text-xs text-slate-500 transition hover:text-zinc-900"
            >
              View all →
            </a>
          </div>

          <h2 className="mt-2 text-2xl font-semibold">
            Skills you already have
          </h2>

          <div className="mt-5 flex flex-wrap gap-2">
            {skillGap.matching_skills.slice(0, 5).map(
              (skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-green-200 bg-green-100 px-3 py-2 text-sm text-green-700"
                >
                  ✓ {skill}
                </span>
              )
            )}

            {skillGap.matching_skills.length > 5 && (
              <span className="rounded-full border border-violet-100 bg-white px-3 py-2 text-sm text-slate-500">
                +{skillGap.matching_skills.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Gaps */}

        <div className="rounded-3xl border border-violet-100 bg-white p-7">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-orange-700">
              YOUR GROWTH AREAS
            </p>

            <a
              href="/skill-gap"
              className="text-xs text-slate-500 transition hover:text-zinc-900"
            >
              View all →
            </a>
          </div>

          <h2 className="mt-2 text-2xl font-semibold">
            Skills to focus on
          </h2>

          <div className="mt-5 flex flex-wrap gap-2">
            {skillGap.missing_skills.slice(0, 5).map(
              (skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-orange-200 bg-orange-100 px-3 py-2 text-sm text-orange-700"
                >
                  + {skill}
                </span>
              )
            )}

            {skillGap.missing_skills.length > 5 && (
              <span className="rounded-full border border-violet-100 bg-white px-3 py-2 text-sm text-slate-500">
                +{skillGap.missing_skills.length - 5} more
              </span>
            )}
          </div>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Learning progress */}
      {/* -------------------------------- */}

      <section className="rounded-3xl border border-violet-100 bg-white p-7">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-slate-500">
              LEARNING JOURNEY
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Keep moving forward 🚀
            </h2>
          </div>

          <p className="text-lg font-semibold">
            {completedCount}/{totalSkills} completed
          </p>
        </div>

        <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-700"
            style={{
              width: `${learningProgress}%`,
            }}
          />
        </div>

        <p className="mt-4 text-sm text-slate-500">
          {learningProgress === 100
            ? "You've completed your current learning roadmap! 🎉"
            : "Every skill you complete takes you one step closer to your target career."}
        </p>
      </section>

      {/* -------------------------------- */}
      {/* Next skills */}
      {/* -------------------------------- */}

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">
              YOUR NEXT STEPS
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Skills worth focusing on
            </h2>
          </div>

          <a
            href="/learning"
            className="text-sm text-slate-500 transition hover:text-zinc-900"
          >
            Full roadmap →
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {recommendations
            .slice(0, 4)
            .map((recommendation, index) => (
              <div
                key={recommendation.skill}
                className="rounded-2xl border border-violet-100 bg-white p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {recommendation.skill}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {recommendation.priority} priority
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Motivation */}
      {/* -------------------------------- */}

      <section className="rounded-3xl border border-blue-100 bg-blue-50 p-8 text-center">
        <p className="text-sm font-medium text-blue-700">
          YOUR POTENTIAL 🚀
        </p>

        <h2 className="mt-3 text-3xl font-bold">
          You are closer than you think.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
          Your current skill set is only the starting
          point. Use your learning roadmap, build
          projects, and keep improving one skill at a
          time.
        </p>
      </section>

    </div>
  );
}