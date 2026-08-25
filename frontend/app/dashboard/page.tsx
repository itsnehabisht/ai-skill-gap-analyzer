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

        const studentProfile = profileData.profile;

        setProfile(studentProfile);


        // --------------------------------
        // 2. Calculate skill gap
        // --------------------------------

        const skillGapResponse = await fetch(
          "http://127.0.0.1:8000/api/skill-gap",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              student_skills: studentProfile.skills,
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
        // 3. Load recommendations
        // --------------------------------

        const recommendationResponse = await fetch(
          "http://127.0.0.1:8000/api/recommendations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              student_skills: studentProfile.skills,
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
        // 4. Load saved learning progress
        // --------------------------------

        const savedProgress = localStorage.getItem(
          `learningProgress_${selectedJob}`
        );

        if (savedProgress) {
          setCompletedSkills(
            JSON.parse(savedProgress)
          );
        }


        // --------------------------------
        // 5. Calculate ML job readiness
        // --------------------------------

        const skills = studentProfile.skills;

        const normalizedSkills = skills.map(
        (skill: string) => skill.toLowerCase().trim()
        );

        const studentData = {
            python: normalizedSkills.includes("python") ? 1 : 0,

            sql: normalizedSkills.includes("sql") ? 1 : 0,

            pandas: normalizedSkills.includes("pandas") ? 1 : 0,

            numpy: normalizedSkills.includes("numpy") ? 1 : 0,

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
          "We couldn't load your dashboard."
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

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-blue-400" />

          <p className="mt-4 text-zinc-400">
            Preparing your dashboard...
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
            DASHBOARD
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Your dashboard is waiting.
          </h1>

          <p className="mt-3 text-zinc-400">
            {message}
          </p>

        </div>

      </div>
    );
  }


  if (!profile || !skillGap) {
    return null;
  }


  const totalSkills =
    recommendations.length;

  const completedCount =
    completedSkills.length;

  const learningProgress =
    totalSkills === 0
      ? 100
      : Math.round(
          (completedCount / totalSkills) * 100
        );


  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* -------------------------------- */}
      {/* Welcome */}
      {/* -------------------------------- */}

      <section>

        <p className="text-sm font-medium text-blue-400">
          YOUR CAREER DASHBOARD
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">

          Welcome back, {profile.name} 👋

        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">

          Here's a snapshot of your progress toward becoming a{" "}

          <span className="font-medium text-zinc-200">
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

        <div className="rounded-3xl border border-white/10 bg-white/5 p-7">

          <p className="text-sm text-zinc-500">
            SKILL MATCH
          </p>

          <div className="mt-2 flex items-end gap-3">

            <span className="text-6xl font-bold">
              {skillGap.skill_match_percentage}%
            </span>

            <span className="pb-2 text-zinc-500">
              of required skills
            </span>

          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">

            <div
              className="h-full rounded-full bg-blue-400 transition-all duration-700"
              style={{
                width: `${skillGap.skill_match_percentage}%`,
              }}
            />

          </div>

        </div>


        {/* Job Readiness */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-7">

          <p className="text-sm text-zinc-500">
            AI JOB READINESS
          </p>

          <div className="mt-2 flex items-end gap-3">

            <span className="text-6xl font-bold">
              {jobReadiness !== null
                ? `${jobReadiness}%`
                : "--"}
            </span>

            <span className="pb-2 text-zinc-500">
              model prediction
            </span>

          </div>

          <p className="mt-5 text-sm leading-6 text-zinc-500">

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

        <div className="rounded-2xl border border-green-400/20 bg-green-400/5 p-6">

          <p className="text-sm text-green-400">
            MATCHING SKILLS
          </p>

          <p className="mt-2 text-4xl font-bold">
            {skillGap.matching_skills.length}
          </p>

        </div>


        <div className="rounded-2xl border border-orange-400/20 bg-orange-400/5 p-6">

          <p className="text-sm text-orange-400">
            SKILLS TO DEVELOP
          </p>

          <p className="mt-2 text-4xl font-bold">
            {skillGap.missing_skills.length}
          </p>

        </div>


        <div className="rounded-2xl border border-blue-400/20 bg-blue-400/5 p-6">

          <p className="text-sm text-blue-400">
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

        <div className="rounded-3xl border border-white/10 bg-white/5 p-7">

          <p className="text-sm font-medium text-green-400">
            YOUR STRENGTHS
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Skills you already have
          </h2>

          <div className="mt-5 flex flex-wrap gap-2">

            {skillGap.matching_skills.map(
              (skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-2 text-sm text-green-300"
                >
                  ✓ {skill}
                </span>
              )
            )}

          </div>

        </div>


        {/* Gaps */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-7">

          <p className="text-sm font-medium text-orange-400">
            YOUR GROWTH AREAS
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Skills to focus on
          </h2>

          <div className="mt-5 flex flex-wrap gap-2">

            {skillGap.missing_skills.map(
              (skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-2 text-sm text-orange-300"
                >
                  + {skill}
                </span>
              )
            )}

          </div>

        </div>

      </section>


      {/* -------------------------------- */}
      {/* Learning progress */}
      {/* -------------------------------- */}

      <section className="rounded-3xl border border-white/10 bg-white/5 p-7">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>

            <p className="text-sm text-zinc-500">
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


        <div className="mt-6 h-4 overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full rounded-full bg-blue-400 transition-all duration-700"
            style={{
              width: `${learningProgress}%`,
            }}
          />

        </div>

        <p className="mt-4 text-sm text-zinc-500">

          {learningProgress === 100
            ? "You've completed your current learning roadmap! 🎉"
            : "Every skill you complete takes you one step closer to your target career."}

        </p>

      </section>


      {/* -------------------------------- */}
      {/* Next skills */}
      {/* -------------------------------- */}

      <section>

        <div className="mb-5">

          <p className="text-sm font-medium text-blue-400">
            YOUR NEXT STEPS
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Skills worth focusing on
          </h2>

        </div>


        <div className="grid gap-4 md:grid-cols-2">

          {recommendations
            .slice(0, 4)
            .map((recommendation, index) => (

              <div
                key={recommendation.skill}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/10 text-sm font-bold text-blue-300">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div>

                    <h3 className="font-semibold">
                      {recommendation.skill}
                    </h3>

                    <p className="mt-1 text-xs text-zinc-500">
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

      <section className="rounded-3xl border border-blue-400/20 bg-blue-400/5 p-8 text-center">

        <p className="text-sm font-medium text-blue-300">
          YOUR POTENTIAL 🚀
        </p>

        <h2 className="mt-3 text-3xl font-bold">
          You are closer than you think.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl leading-7 text-zinc-400">

          Your current skill set is only the starting
          point. Use your learning roadmap, build
          projects, and keep improving one skill at a
          time.

        </p>

      </section>

    </div>
  );
}