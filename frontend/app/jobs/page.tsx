"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Job = {
  title: string;
  description?: string;
  required_skills: string[];
};

type Jobs = Record<string, Job>;

export default function JobsPage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Jobs>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/jobs",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load jobs");
        }

        const data = await response.json();

        setJobs(data);

        // Remember which job was already chosen, if any,
        // so the page reflects it when you come back.
        const alreadySelected =
          localStorage.getItem("selectedJob");

        if (alreadySelected) {
          setSelectedJobId(alreadySelected);
        }
      } catch (error) {
        console.error(error);
        setError(
          "Unable to load jobs. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  // --------------------------------------------------
  // RESET CAREER WHEN A NEW USER STARTS
  // --------------------------------------------------

  useEffect(() => {
    function handleProfileUpdated() {
      const currentSelectedJob =
        localStorage.getItem("selectedJob");

      if (!currentSelectedJob) {
        setSelectedJobId(null);
      }
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

  function selectJob(jobId: string) {
    localStorage.setItem("selectedJob", jobId);
    setSelectedJobId(jobId);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-zinc-400">
          Loading career options...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6">
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      <section>
        <p className="text-sm font-medium text-blue-400">
          TARGET CAREER
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Where do you want to go?
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Choose the role you want to work toward. We'll compare its
          requirements with your current skills.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">

        {Object.entries(jobs).map(([jobId, job]) => {
          const isSelected = selectedJobId === jobId;

          return (
            <div
              key={jobId}
              className={`group rounded-3xl border p-6 transition hover:-translate-y-1 ${
                isSelected
                  ? "border-blue-400/40 bg-blue-400/5"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
              }`}
            >

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Career path
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    {job.title}
                  </h2>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
                    isSelected
                      ? "bg-blue-400/20 text-blue-300"
                      : "bg-blue-400/10"
                  }`}
                >
                  {isSelected ? "✓" : "✦"}
                </div>

              </div>

              <p className="mt-4 min-h-12 text-sm leading-6 text-zinc-400">
                {job.description ||
                  "Build the skills needed for this career path."}
              </p>

              <div className="mt-5">

                <p className="text-sm text-zinc-500">
                  Required skills
                </p>

                <div className="mt-3 flex flex-wrap gap-2">

                  {job.required_skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-black/20 bg-green/20 px-3 py-1.5 text-xs text-zinc-300"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

              </div>

              <button
                onClick={() => selectJob(jobId)}
                className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isSelected
                    ? "border border-blue-400/30 bg-blue-400/10 text-blue-300"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                {isSelected
                  ? "✓ Selected"
                  : "Choose this career →"}
              </button>

            </div>
          );
        })}

      </section>

      {selectedJobId && (
        <section className="rounded-3xl border border-blue-400/20 bg-blue-400/5 p-8">

          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <p className="text-sm font-medium text-blue-300">
                CAREER SELECTED
              </p>

              <p className="mt-1 text-lg font-semibold">
                Ready to see how your skills compare?
              </p>
            </div>

            <button
              onClick={() => router.push("/skill-gap")}
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Continue to Skill Gap →
            </button>

          </div>

        </section>
      )}

    </div>
  );
}