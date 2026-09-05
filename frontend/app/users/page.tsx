"use client";

import { useEffect, useState } from "react";

type PreviousUser = {
  archived_at: string;
  name: string;
  education: string;
  experience_years: string;
  skills: string[];
  completed_skills: string[];
};

export default function UsersPage() {
  const [users, setUsers] = useState<PreviousUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/api/users/history",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || "Could not load previous users.");
        return;
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error("Previous users error:", error);
      setError("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function formatDate(dateString: string) {
    if (!dateString) {
      return "Unknown date";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      {/* Page heading */}

      <section>
        <p className="text-sm font-medium text-blue-400">
          USER HISTORY
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900">
          Previous users
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-500">
          View information saved from users who previously used SkillGap AI.
          Their current profile was archived when a new user was started.
        </p>
      </section>


      {/* Loading */}

      {loading && (
        <section className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />

            <p className="text-sm text-zinc-500">
              Loading previous users...
            </p>
          </div>
        </section>
      )}


      {/* Error */}

      {!loading && error && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>
        </section>
      )}


      {/* Empty state */}

      {!loading && !error && users.length === 0 && (
        <section className="rounded-3xl border border-black/5 bg-white p-10 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
            👤
          </div>

          <h2 className="mt-5 text-xl font-semibold text-zinc-900">
            No previous users yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
            When you use “Start New User” from the Profile page,
            the current user's information will appear here.
          </p>

        </section>
      )}


      {/* User history */}

      {!loading && !error && users.length > 0 && (
        <section className="space-y-5">

          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Archived users
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {users.length} previous user{users.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>


          {users.map((user, index) => (
            <article
              key={`${user.archived_at}-${index}`}
              className="rounded-3xl border border-black/5 bg-white p-7 shadow-sm transition hover:shadow-md"
            >

              {/* User header */}

              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                    👤
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-zinc-900">
                      {user.name || "Unnamed User"}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                      {user.education || "Education not provided"}
                    </p>
                  </div>

                </div>


                <div className="rounded-xl bg-zinc-50 px-4 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
                    Archived
                  </p>

                  <p className="mt-1 text-xs font-medium text-zinc-600">
                    {formatDate(user.archived_at)}
                  </p>
                </div>

              </div>


              {/* User details */}

              <div className="mt-7 grid gap-4 md:grid-cols-3">

                <div className="rounded-2xl bg-zinc-50 p-5">
                  <p className="text-xs font-medium text-zinc-400">
                    Experience
                  </p>

                  <p className="mt-2 text-lg font-semibold text-zinc-900">
                    {user.experience_years || "0"}{" "}
                    {user.experience_years === "1" ? "year" : "years"}
                  </p>
                </div>


                <div className="rounded-2xl bg-zinc-50 p-5">
                  <p className="text-xs font-medium text-zinc-400">
                    Skills Found
                  </p>

                  <p className="mt-2 text-lg font-semibold text-zinc-900">
                    {user.skills.length}
                  </p>
                </div>


                <div className="rounded-2xl bg-zinc-50 p-5">
                  <p className="text-xs font-medium text-zinc-400">
                    Skills Completed
                  </p>

                  <p className="mt-2 text-lg font-semibold text-zinc-900">
                    {user.completed_skills.length}
                  </p>
                </div>

              </div>


              {/* Skills */}

              <div className="mt-6">

                <p className="text-sm font-semibold text-zinc-900">
                  Resume skills
                </p>

                {user.skills.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-zinc-400">
                    No skills were extracted from the resume.
                  </p>
                )}

              </div>


              {/* Completed skills */}

              <div className="mt-6">

                <p className="text-sm font-semibold text-zinc-900">
                  Completed learning skills
                </p>

                {user.completed_skills.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {user.completed_skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-zinc-400">
                    No learning skills were completed.
                  </p>
                )}

              </div>

            </article>
          ))}

        </section>
      )}

    </div>
  );
}