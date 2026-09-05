"use client";

import { useEffect, useState } from "react";

type Recommendation = {
  skill: string;
  priority: string;
  description: string;
  topics: string[];
};

type RecommendationResponse = {
  job_title: string;
  missing_skills: string[];
  recommendations: Recommendation[];
};

export default function ProgressPage() {
  const [data, setData] =
    useState<RecommendationResponse | null>(null);

  const [completedSkills, setCompletedSkills] =
    useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  // --------------------------------------------------
  // REFRESH WHEN ACTIVE USER CHANGES
  // --------------------------------------------------

  useEffect(() => {
    function handleProfileUpdated() {
      setRefreshKey((value) => value + 1);
    }

    window.addEventListener(
      "profileUpdated",
      handleProfileUpdated
    );

    return () => {
      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdated
      );
    };
  }, []);

  useEffect(() => {
    async function loadProgress() {
      setLoading(true);
      setMessage("");
      setData(null);
      setCompletedSkills([]);

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
          setCompletedSkills(progressData.completed_skills || []);
        }

        const profileResponse = await fetch(
          "http://127.0.0.1:8000/api/profile",
          {
            cache: "no-store",
          }
        );

        if (!profileResponse.ok) {
          throw new Error(
            "Could not load your profile."
          );
        }

        const profileData =
          await profileResponse.json();

        if (!profileData.profile) {
          setMessage(
            "Please complete your profile first."
          );
          setLoading(false);
          return;
        }

        /*
         * Resume-extracted skills are the source of truth.
         * They are stored by the backend after resume analysis.
         */
        const skillsResponse = await fetch(
          "http://127.0.0.1:8000/api/resume/skills",
          {
            cache: "no-store",
          }
        );

        if (!skillsResponse.ok) {
          throw new Error(
            "Could not load resume skills."
          );
        }

        const skillsData =
          await skillsResponse.json();

        const resumeSkills =
          skillsData.skills || [];

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
          throw new Error(
            "Could not load learning progress."
          );
        }

        const result =
          await response.json();

        if (result.error) {
          throw new Error(result.error);
        }

        setData(result);

      } catch (error) {
        console.error(error);

        setMessage(
          error instanceof Error
            ? error.message
            : "We couldn't load your progress."
        );

      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [refreshKey]);

  async function toggleSkill(skill: string) {
    const willBeCompleted =
      !completedSkills.includes(skill);

    const previousSkills =
      completedSkills;

    const updatedSkills =
      willBeCompleted
        ? [...completedSkills, skill]
        : completedSkills.filter(
            (item) => item !== skill
          );

    setCompletedSkills(updatedSkills);

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
        throw new Error(
          "Could not save progress."
        );
      }

      const result =
        await response.json();

      setCompletedSkills(
        result.completed_skills || []
      );

    } catch (error) {
      console.error(
        "Progress update error:",
        error
      );

      setCompletedSkills(
        previousSkills
      );
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />

          <p className="mt-4 text-slate-600">
            Loading your progress...
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
            PROGRESS TRACKER
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Your learning journey starts here.
          </h1>

          <p className="mt-3 text-slate-600">
            {message}
          </p>

        </div>

      </div>
    );
  }

  if (!data) {
    return null;
  }

  const totalSkills =
    data.recommendations.length;

  const completedCount =
    data.recommendations.filter(
      (item) =>
        completedSkills.includes(item.skill)
    ).length;

  const progressPercentage =
    totalSkills === 0
      ? 100
      : Math.round(
          (completedCount / totalSkills) * 100
        );

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      {/* Header */}

      <section>
        <p className="text-sm font-medium text-blue-700">
          PROGRESS TRACKER
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Your journey to {data.job_title}
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600">
          Learn each skill, build projects, and
          check them off as you grow.
        </p>

      </section>


      {/* Progress overview */}

      <section className="rounded-3xl border border-violet-100 bg-white p-8">

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <p className="text-sm text-slate-500">
              Overall Learning Progress
            </p>

            <div className="mt-2 flex items-end gap-3">

              <span className="text-6xl font-bold">
                {progressPercentage}%
              </span>

              <span className="pb-2 text-slate-500">
                complete
              </span>

            </div>

          </div>

          <div className="text-left md:text-right">

            <p className="text-sm text-slate-500">
              Skills completed
            </p>

            <p className="mt-1 text-2xl font-semibold">
              {completedCount}
              <span className="text-slate-500">
                /{totalSkills}
              </span>
            </p>

          </div>

        </div>


        {/* Progress bar */}

        <div className="mt-7 h-4 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-700"
            style={{
              width: `${progressPercentage}%`,
            }}
          />

        </div>

        <p className="mt-4 text-sm text-slate-500">

          {progressPercentage === 100
            ? "Amazing! You've completed your learning roadmap. 🎉"
            : "Keep going. Every completed skill brings you closer to your goal. 🚀"}

        </p>

      </section>


      {/* Learning checklist */}

      <section>

        <div className="mb-5">

          <p className="text-sm font-medium text-slate-500">
            YOUR LEARNING CHECKLIST
          </p>

          <h2 className="mt-1 text-2xl font-semibold">
            Skills to master
          </h2>

        </div>


        <div className="space-y-4">

          {data.recommendations.map(
            (recommendation, index) => {

              const completed =
                completedSkills.includes(
                  recommendation.skill
                );

              return (
                <article
                  key={recommendation.skill}
                  className={`rounded-3xl border p-6 transition ${
                    completed
                      ? "border-green-200 bg-green-50"
                      : "border-violet-100 bg-white"
                  }`}
                >

                  <div className="flex items-start gap-5">

                    {/* Checkbox */}

                    <button
                      onClick={() =>
                        toggleSkill(
                          recommendation.skill
                        )
                      }
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition ${
                        completed
                          ? "border-green-400 bg-green-500 text-black"
                          : "border-violet-200 bg-slate-100 hover:border-blue-400"
                      }`}
                      aria-label={
                        completed
                          ? `Mark ${recommendation.skill} incomplete`
                          : `Mark ${recommendation.skill} complete`
                      }
                    >
                      {completed && "✓"}
                    </button>


                    {/* Skill information */}

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <span className="text-xs text-slate-500">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <h3
                          className={`text-xl font-semibold ${
                            completed
                              ? "text-green-700 line-through"
                              : ""
                          }`}
                        >
                          {recommendation.skill}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            recommendation.priority ===
                            "High"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {recommendation.priority}
                        </span>

                      </div>


                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {recommendation.description}
                      </p>


                      {/* Topics */}

                      <div className="mt-4 flex flex-wrap gap-2">

                        {recommendation.topics.map(
                          (topic) => (
                            <span
                              key={topic}
                              className="rounded-full border border-violet-100 bg-slate-100 px-3 py-1.5 text-xs text-slate-600"
                            >
                              {topic}
                            </span>
                          )
                        )}

                      </div>


                      {completed && (
                        <p className="mt-4 text-sm font-medium text-green-700">
                          ✓ Skill completed — great work!
                        </p>
                      )}

                    </div>

                  </div>

                </article>
              );
            }
          )}

        </div>

      </section>


      {/* Motivation */}

      <section className="rounded-3xl border border-blue-100 bg-blue-50 p-8">

        <p className="text-sm font-medium text-blue-700">
          ONE STEP AT A TIME 🚀
        </p>

        <h2 className="mt-3 text-2xl font-semibold">
          Your progress is your proof.
        </h2>

        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          You don't have to become job-ready overnight.
          Learn one skill, build something with it,
          and keep moving forward.
        </p>

      </section>

    </div>
  );
}