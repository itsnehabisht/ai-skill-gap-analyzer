"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PreviousUser = {
  user_id: string;
  archived_at: string;
  name: string;
  education: string;
  experience_years: string;
  skills: string[];
  completed_skills: string[];
  selected_job: string | null;
};

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<PreviousUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restoringUserId, setRestoringUserId] = useState("");

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

  async function restoreUser(user: PreviousUser) {
    const confirmed = window.confirm(
      `Continue as ${user.name || "this user"}?\n\n` +
      "Your current session will be archived before the previous user is restored."
    );

    if (!confirmed) {
      return;
    }

    try {
      setRestoringUserId(user.user_id);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/api/users/restore",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.user_id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || "Could not restore this user.");
        return;
      }

      // ------------------------------------------------------
      // Restore the selected career/job.
      //
      // The backend now returns the complete restored profile,
      // including selected_job.
      // ------------------------------------------------------

      const restoredSelectedJob =
        data.profile?.selected_job;

      if (restoredSelectedJob) {
        localStorage.setItem(
          "selectedJob",
          restoredSelectedJob
        );
      } else {
        localStorage.removeItem("selectedJob");
      }

      // ------------------------------------------------------
      // Notify the rest of the frontend that the active user
      // has changed.
      // ------------------------------------------------------

      window.dispatchEvent(
        new Event("profileUpdated")
      );

      window.dispatchEvent(
        new Event("resumeSkillsUpdated")
      );

      // ------------------------------------------------------
      // Remove only timestamps belonging to the previous
      // frontend session.
      //
      // Do NOT remove selectedJob because it now belongs to
      // the restored user.
      // ------------------------------------------------------

      localStorage.removeItem("profileUpdatedAt");
      localStorage.removeItem("resumeSkillsUpdatedAt");

      Object.keys(localStorage).forEach((key) => {
        if (key.toLowerCase().includes("progress")) {
          localStorage.removeItem(key);
        }
      });

      // ------------------------------------------------------
      // Store a timestamp so pages that depend on the active
      // user can detect that a restore has happened.
      // ------------------------------------------------------

      localStorage.setItem(
        "activeUserUpdatedAt",
        Date.now().toString()
      );

      // ------------------------------------------------------
      // Send the restored user to the dashboard.
      // ------------------------------------------------------

      router.push("/dashboard");

    } catch (error) {
      console.error("Restore user error:", error);
      setError("Could not connect to the backend.");
    } finally {
      setRestoringUserId("");
    }
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
          View and restore users who previously used SkillGap AI.
          Restoring a user brings back their profile, resume skills,
          selected career, and learning progress.
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
                {users.length} previous user
                {users.length !== 1 ? "s" : ""}
              </p>

            </div>

          </div>


          {users.map((user, index) => (

            <article
              key={`${user.user_id}-${user.archived_at}-${index}`}
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

                    <p className="mt-1 text-[11px] font-medium text-zinc-400">
                      ID: {user.user_id}
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

              <div className="mt-7 grid gap-4 md:grid-cols-4">

                <div className="rounded-2xl bg-zinc-50 p-5">

                  <p className="text-xs font-medium text-zinc-400">
                    Experience
                  </p>

                  <p className="mt-2 text-lg font-semibold text-zinc-900">
                    {user.experience_years || "0"}{" "}
                    {user.experience_years === "1"
                      ? "year"
                      : "years"}
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


                <div className="rounded-2xl bg-zinc-50 p-5">

                  <p className="text-xs font-medium text-zinc-400">
                    Selected Career
                  </p>

                  <p className="mt-2 truncate text-sm font-semibold text-zinc-900">
                    {user.selected_job || "Not selected"}
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


              {/* Restore user */}

              <div className="mt-7 flex flex-col gap-3 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm font-semibold text-zinc-900">
                    Continue this user
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Restore their profile, resume skills, selected career,
                    and learning progress.
                  </p>

                </div>


                <button
                  type="button"
                  onClick={() => restoreUser(user)}
                  disabled={restoringUserId !== ""}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {restoringUserId === user.user_id ? (

                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                      Restoring...
                    </>

                  ) : (

                    <>
                      ↩
                      Continue as {user.name || "User"}
                    </>

                  )}

                </button>

              </div>

            </article>

          ))}

        </section>
      )}

    </div>
  );
}