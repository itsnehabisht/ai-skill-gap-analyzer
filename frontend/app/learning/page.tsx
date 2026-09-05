"use client";

import { useEffect, useState } from "react";
import BunnyIcon from "@/components/BunnyIcon";

type Resource = {
  name: string;
  url: string;
};

type Recommendation = {
  skill: string;
  priority: string;
  description: string;
  topics: string[];
  resources: Resource[];
  practice: string;
};

type RecommendationResponse = {
  job_title: string;
  missing_skills: string[];
  recommendations: Recommendation[];
};

export default function LearningPage() {
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const selectedJob = localStorage.getItem("selectedJob");

        if (!selectedJob) {
          setMessage("Please select a target job first.");
          setLoading(false);
          return;
        }

        const progressResponse = await fetch(
          "http://127.0.0.1:8000/api/progress",
          {
            cache: "no-store",
          }
        );

        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setCompleted(progressData.completed_skills || []);
        }

        const profileResponse = await fetch(
          "http://127.0.0.1:8000/api/profile",
          {
            cache: "no-store",
          }
        );

        if (!profileResponse.ok) {
          throw new Error("Could not load your profile.");
        }

        const profileData = await profileResponse.json();

        if (!profileData.profile) {
          setMessage("Please complete your profile first.");
          setLoading(false);
          return;
        }

        /*
         * Resume-extracted skills are the source of truth.
         * The backend stores them in profile.json after resume analysis.
         */
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
        const resumeSkills = skillsData.skills || [];

        const response = await fetch(
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

        if (!response.ok) {
          throw new Error("Could not generate recommendations.");
        }

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error);
        }

        console.log("Learning API response:", result);

        setData(result);
      } catch (error) {
        console.error(error);
        setMessage(
          error instanceof Error
            ? error.message
            : "We couldn't generate your learning recommendations."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, []);

  async function toggleSkill(skill: string) {
    const willBeCompleted = !completed.includes(skill);

    const previous = completed;

    const updated = willBeCompleted
      ? [...completed, skill]
      : completed.filter((item) => item !== skill);

    setCompleted(updated);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/progress",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skill: skill,
            completed: willBeCompleted,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not save progress.");
      }

      const result = await response.json();

      setCompleted(result.completed_skills || []);

    } catch (error) {
      console.error("Progress update error:", error);
      setCompleted(previous);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-white">
            <BunnyIcon className="h-9 w-9" />
          </div>

          <div className="mx-auto mt-5 h-10 w-10 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />

          <p className="mt-5 text-slate-700">
            Bunny is building your learning roadmap...
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Finding the skills that will move you forward 🚀
          </p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-violet-100 bg-white p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <BunnyIcon className="h-8 w-8" />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-700">
                LEARNING PATH
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Your roadmap is waiting.
              </h1>

              <p className="mt-3 text-slate-600">
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const totalSkills = data.recommendations.length;

  const completedCount = data.recommendations.filter(
    (recommendation) =>
      completed.includes(recommendation.skill)
  ).length;

  const progressPercentage =
    totalSkills === 0
      ? 100
      : Math.round((completedCount / totalSkills) * 100);

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">

      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-blue-50 via-white/5 to-transparent p-8 md:p-10">

        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-100 blur-3xl" />

        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

          <div className="max-w-3xl">

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold tracking-wider text-blue-700">
                PERSONALIZED LEARNING
              </span>

              <span className="rounded-full border border-blue-100 bg-blue-100 px-3 py-1 text-xs text-blue-700">
                AI ROADMAP
              </span>
            </div>

            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              Your roadmap to{" "}
              <span className="text-blue-700">
                {data.job_title}
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Bunny has identified the skills that can take you
              closer to your target career. Learn them one by one,
              practice them, and watch your career gap disappear. 🚀
            </p>
          </div>


          {/* Bunny */}

          <div className="shrink-0">

            <div className="relative">

              <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-blue-600 text-white shadow-2xl">
                <BunnyIcon className="h-16 w-16" />
              </div>

              <div className="absolute -bottom-3 -right-3 rounded-full border border-violet-100 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                Let's learn! ✨
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* PROGRESS */}
      {/* ========================================================= */}

      <section className="rounded-3xl border border-violet-100 bg-white p-6 md:p-8">

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="text-sm font-medium text-slate-500">
              YOUR LEARNING PROGRESS
            </p>

            <div className="mt-2 flex items-end gap-3">

              <span className="text-5xl font-bold">
                {progressPercentage}%
              </span>

              <span className="pb-2 text-slate-500">
                roadmap completed
              </span>

            </div>

            <p className="mt-3 text-sm text-slate-600">
              {completedCount} of {totalSkills} recommended skills
              completed.
            </p>

          </div>


          <div className="text-left md:text-right">

            {progressPercentage === 100 ? (
              <>
                <p className="text-2xl">🎉</p>

                <p className="mt-1 font-semibold text-green-700">
                  Roadmap completed!
                </p>
              </>
            ) : progressPercentage >= 50 ? (
              <>
                <p className="text-2xl">🔥</p>

                <p className="mt-1 font-semibold text-blue-700">
                  You're doing great!
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl">🌱</p>

                <p className="mt-1 font-semibold text-slate-700">
                  Every step counts.
                </p>
              </>
            )}

          </div>

        </div>


        <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-700"
            style={{
              width: `${progressPercentage}%`,
            }}
          />

        </div>

      </section>


      {/* ========================================================= */}
      {/* BUNNY MESSAGE */}
      {/* ========================================================= */}

      <section className="flex gap-4 rounded-3xl border border-blue-100 bg-blue-50 p-6">

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
          <BunnyIcon className="h-8 w-8" />
        </div>

        <div>

          <p className="text-sm font-semibold text-blue-700">
            BUNNY'S ADVICE
          </p>

          <p className="mt-2 leading-7 text-slate-700">

            {progressPercentage === 0
              ? "Start with the first high-priority skill. You don't need to know everything today — you just need to start. 💙"
              : progressPercentage < 50
              ? "You're already moving! Keep learning one skill at a time and don't worry about the size of the gap. 🚀"
              : progressPercentage < 100
              ? "Look at you go! 🔥 You're more than halfway there. Keep the momentum going."
              : "You did it! 🎉 Your learning roadmap is complete. Now it's time to build projects and prove what you've learned."}

          </p>

        </div>

      </section>


      {/* ========================================================= */}
      {/* RECOMMENDATIONS */}
      {/* ========================================================= */}

      <section>

        <div className="mb-5">

          <p className="text-sm font-medium text-blue-700">
            YOUR SKILLS ROADMAP
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Skills to develop
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Follow these recommendations in order of priority.
          </p>

        </div>


        <div className="space-y-6">

          {data.recommendations.map(
            (recommendation, index) => {

              const isCompleted = completed.includes(
                recommendation.skill
              );
              return (
                <article
                  key={recommendation.skill}
                  className={`overflow-hidden rounded-[2rem] border transition-all duration-300 ${
                    isCompleted
                      ? "border-green-200 bg-green-500/[0.03]"
                      : "border-violet-100 bg-white hover:border-violet-300"
                  }`}
                >

                  {/* Card top */}

                  <div className="p-6 md:p-8">

                    <div className="flex flex-col gap-6 md:flex-row">

                      {/* Number */}

                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                          isCompleted
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {isCompleted
                          ? "✓"
                          : String(index + 1).padStart(2, "0")}
                      </div>


                      {/* Main */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-3">

                          <h2
                            className={`text-2xl font-semibold ${
                              isCompleted
                                ? "text-green-700"
                                : "text-zinc-900"
                            }`}
                          >
                            {recommendation.skill}
                          </h2>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              recommendation.priority === "High"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {recommendation.priority} Priority
                          </span>

                          {isCompleted && (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                              Completed 🎉
                            </span>
                          )}

                        </div>


                        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                          {recommendation.description}
                        </p>


                        {/* ================================================= */}
                        {/* WHAT TO LEARN */}
                        {/* ================================================= */}

                        <div className="mt-7">

                          <div className="flex items-center gap-2">

                            <span className="text-xl">
                              📚
                            </span>

                            <h3 className="font-semibold">
                              What to learn
                            </h3>

                          </div>


                          <div className="mt-4 grid gap-3 sm:grid-cols-2">

                            {recommendation.topics.map(
                              (topic, topicIndex) => (

                                <div
                                  key={topic}
                                  className="flex items-center gap-3 rounded-xl border border-violet-100 bg-slate-100 p-3"
                                >

                                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs text-blue-700">
                                    {topicIndex + 1}
                                  </span>

                                  <span className="text-sm text-slate-700">
                                    {topic}
                                  </span>

                                </div>

                              )
                            )}

                          </div>

                        </div>


                        {/* ================================================= */}
                        {/* WHERE TO STUDY */}
                        {/* ================================================= */}

                        {recommendation.resources &&
                          recommendation.resources.length > 0 && (

                            <div className="mt-7">

                              <div className="flex items-center gap-2">

                                <span className="text-xl">
                                  🔗
                                </span>

                                <h3 className="font-semibold">
                                  Where to study
                                </h3>

                              </div>

                              <p className="mt-2 text-sm text-slate-500">
                                Hand-picked resources to help you
                                learn this skill.
                              </p>


                              <div className="mt-4 grid gap-3 sm:grid-cols-2">

                                {recommendation.resources.map(
                                  (resource) => (

                                    <a
                                      key={resource.url}
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group rounded-2xl border border-violet-100 bg-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-600/5"
                                    >

                                      <div className="flex items-center justify-between gap-3">

                                        <div>

                                          <p className="text-sm font-medium text-slate-800 group-hover:text-blue-700">
                                            {resource.name}
                                          </p>

                                          <p className="mt-1 text-xs text-slate-500">
                                            Open learning resource
                                          </p>

                                        </div>

                                        <span className="text-lg text-slate-500 transition group-hover:translate-x-1 group-hover:text-blue-700">
                                          →
                                        </span>

                                      </div>

                                    </a>

                                  )
                                )}

                              </div>

                            </div>

                          )}


                        {/* ================================================= */}
                        {/* PRACTICE */}
                        {/* ================================================= */}

                        {recommendation.practice && (

                          <div className="mt-7 rounded-2xl border border-purple-200 bg-purple-100 p-5">

                            <div className="flex items-start gap-3">

                              <span className="text-xl">
                                🛠️
                              </span>

                              <div>

                                <p className="font-semibold text-purple-800">
                                  Practice challenge
                                </p>

                                <p className="mt-2 leading-6 text-slate-600">
                                  {recommendation.practice}
                                </p>

                              </div>
                            </div>

                          </div>

                        )}


                        {/* ================================================= */}
                        {/* COMPLETE BUTTON */}
                        {/* ================================================= */}

                        <div className="mt-7 flex flex-col gap-4 border-t border-violet-100 pt-6 sm:flex-row sm:items-center sm:justify-between">

                          <div>

                            <p className="text-sm font-medium text-slate-700">
                              Ready to mark this skill?
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Learn it, practice it, then check it off.
                            </p>

                          </div>


                          <button
                            onClick={() =>
                              toggleSkill(
                                recommendation.skill
                              )
                            }
                            className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                              isCompleted
                                ? "border border-green-200 bg-green-100 text-green-700 hover:bg-green-500/15"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {isCompleted
                              ? "✓ Skill Completed"
                              : "Mark as Completed →"}
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                </article>
              );
            }
          )}

        </div>

      </section>


      {/* ========================================================= */}
      {/* FINAL MOTIVATION */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-50 to-transparent p-8 md:p-10">

        <div className="flex flex-col gap-6 md:flex-row md:items-center">

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-blue-600 text-white">
            <BunnyIcon className="h-11 w-11" />
          </div>

          <div>

            <p className="text-sm font-semibold tracking-wider text-blue-700">
              ONE LAST THING
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Your skill gap is not your weakness.
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              It's simply a list of things you haven't learned yet.
              Keep showing up, keep building, and keep improving.
              Future-you will thank you. 💙
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}