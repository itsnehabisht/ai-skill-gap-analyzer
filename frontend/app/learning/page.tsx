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

export default function LearningPage() {
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadRecommendations() {
      try {
        /*
         * Get selected target job.
         */
        const selectedJob = localStorage.getItem("selectedJob");

        if (!selectedJob) {
          setMessage("Please select a target job first.");
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
         * Make sure resume analysis has been completed.
         */
        if (resumeSkills.length === 0) {
          setMessage(
            "Please upload and analyze your resume first so we can build your learning roadmap."
          );

          setLoading(false);
          return;
        }


        /*
         * Generate recommendations using the
         * actual skills extracted from the resume.
         */
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


        setData(result);

      } catch (error) {

        console.error("Learning recommendation error:", error);

        setMessage(
          "We couldn't generate your learning recommendations. Please make sure your resume and target job are ready."
        );

      } finally {

        setLoading(false);
      }
    }


    loadRecommendations();

  }, []);


  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-blue-400" />

          <p className="mt-5 text-lg font-medium text-white">
            Building your personalized learning path...
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Turning your skill gaps into your next steps.
          </p>

        </div>

      </div>
    );
  }


  /*
   * Error / missing information
   */
  if (message) {
    return (
      <div className="mx-auto max-w-3xl">

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <p className="text-sm font-medium text-blue-400">
            LEARNING PATH
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Your roadmap is waiting.
          </h1>

          <p className="mt-3 leading-7 text-zinc-400">
            {message}
          </p>

        </div>

      </div>
    );
  }


  if (!data) {
    return null;
  }


  return (
    <div className="mx-auto max-w-6xl space-y-8">


      {/* Header */}

      <section>

        <p className="text-sm font-medium text-blue-400">
          PERSONALIZED LEARNING
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Your roadmap to {data.job_title}
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          We've analyzed your resume and identified the skills that can
          move you closer to your target career.
        </p>

      </section>


      {/* Learning overview */}

      <section className="grid gap-5 md:grid-cols-3">


        {/* Missing skills */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <p className="text-sm text-zinc-500">
            Skills to develop
          </p>

          <div className="mt-2 flex items-end gap-3">

            <span className="text-5xl font-bold">
              {data.missing_skills.length}
            </span>

            <span className="pb-2 text-zinc-500">
              skill{data.missing_skills.length !== 1 ? "s" : ""}
            </span>

          </div>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Skills identified from your career gap.
          </p>

        </div>


        {/* Recommendations */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <p className="text-sm text-zinc-500">
            Learning steps
          </p>

          <p className="mt-2 text-5xl font-bold">
            {data.recommendations.length}
          </p>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Personalized recommendations created for you.
          </p>

        </div>


        {/* Mindset */}

        <div className="rounded-3xl border border-blue-400/20 bg-blue-400/5 p-6">

          <p className="text-sm text-blue-300">
            YOUR MINDSET
          </p>

          <p className="mt-3 text-xl font-semibold">
            Progress, not perfection. 🚀
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Every skill you learn makes your career gap smaller.
          </p>

        </div>

      </section>


      {/* Recommendations */}

      <section>

        <div className="mb-5">

          <p className="text-sm font-medium text-blue-400">
            YOUR LEARNING ROADMAP
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Skills to learn next
          </h2>

        </div>


        <div className="space-y-5">

          {data.recommendations.length > 0 ? (

            data.recommendations.map((recommendation, index) => (

              <article
                key={recommendation.skill}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20"
              >

                <div className="flex flex-col gap-5 md:flex-row">


                  {/* Number */}

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-400/10 text-lg font-bold text-blue-300">
                    {String(index + 1).padStart(2, "0")}
                  </div>


                  {/* Content */}

                  <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-2xl font-semibold">
                        {recommendation.skill}
                      </h2>


                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          recommendation.priority === "High"
                            ? "bg-red-400/10 text-red-300"
                            : recommendation.priority === "Medium"
                              ? "bg-yellow-400/10 text-yellow-300"
                              : "bg-green-400/10 text-green-300"
                        }`}
                      >
                        {recommendation.priority} Priority
                      </span>

                    </div>


                    <p className="mt-3 max-w-3xl leading-7 text-zinc-400">
                      {recommendation.description}
                    </p>


                    {/* Topics */}

                    <div className="mt-5">

                      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                        What to learn
                      </p>


                      <div className="mt-3 flex flex-wrap gap-2">

                        {recommendation.topics.map((topic) => (

                          <span
                            key={topic}
                            className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-300"
                          >
                            {topic}
                          </span>

                        ))}

                      </div>

                    </div>


                    {/* Start learning button */}

                    <button
                      type="button"
                      className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
                    >
                      Start Learning →
                    </button>

                  </div>

                </div>

              </article>

            ))

          ) : (

            <div className="rounded-3xl border border-green-400/20 bg-green-400/5 p-8">

              <p className="text-sm font-medium text-green-400">
                🎉 GREAT JOB
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                You currently match the required skills!
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
                There are no major skill gaps to work on right now.
                Keep practicing and building projects to strengthen your
                knowledge.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* Motivation */}

      <section className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-400/10 to-transparent p-8">

        <p className="text-sm font-medium text-blue-300">
          KEEP GOING 🚀
        </p>

        <h2 className="mt-3 text-2xl font-semibold">
          You don't need to learn everything at once.
        </h2>

        <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
          Start with the highest-priority skill, practice it through a
          small project, and then move to the next one. Your career gap
          becomes smaller with every step you take.
        </p>

      </section>


    </div>
  );
}