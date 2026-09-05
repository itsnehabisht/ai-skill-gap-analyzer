"use client";

import { useEffect, useState } from "react";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);

  // --------------------------------------------------------
  // Load the currently active user's saved resume skills.
  //
  // This is important when a previous user is restored.
  // Their skills are already stored in profile.json, so the
  // Resume page should display them without requiring another
  // resume upload.
  // --------------------------------------------------------

  async function loadSavedSkills() {
    try {
      setLoadingSkills(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/resume/skills",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || "Could not load saved resume skills.");
        return;
      }

      setExtractedSkills(
        data.skills || []
      );

    } catch (error) {
      console.error("Load resume skills error:", error);
    } finally {
      setLoadingSkills(false);
    }
  }

  useEffect(() => {
    loadSavedSkills();

    // Reload skills whenever another page restores or updates
    // the active user's resume data.
    function handleResumeSkillsUpdated() {
      loadSavedSkills();
    }

    window.addEventListener(
      "resumeSkillsUpdated",
      handleResumeSkillsUpdated
    );

    return () => {
      window.removeEventListener(
        "resumeSkillsUpdated",
        handleResumeSkillsUpdated
      );
    };
  }, []);

  async function handleUpload() {
    if (!file) {
      setError("Please choose a resume first.");
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");
    setExtractedSkills([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/resume",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || "Something went wrong.");
        return;
      }

      console.log("Resume analysis response:", data);

      setMessage(
        `Resume analyzed successfully! Found ${data.skills_found} skill(s).`
      );

      setExtractedSkills(
        data.extracted_skills || []
      );

      // Notify other pages/components that the
      // resume skills have been updated.
      localStorage.setItem(
        "resumeSkillsUpdatedAt",
        Date.now().toString()
      );

      window.dispatchEvent(
        new Event("resumeSkillsUpdated")
      );

    } catch (error) {
      console.error("Resume upload error:", error);
      setError("Could not connect to the backend.");
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF resume.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Resume must be smaller than 5 MB.");
      return;
    }

    setFile(selectedFile);
    setExtractedSkills([]);
    setMessage("");
    setError("");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* Page heading */}

      <section>
        <p className="text-sm font-medium text-blue-400">
          RESUME ANALYSIS
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Let your resume speak for you.
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Upload your resume and we'll use it to understand your current
          skills, experience, and career strengths.
        </p>
      </section>


      {/* Upload card */}

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

        <div className="rounded-2xl border border-dashed border-white/20 bg-black/20 p-12 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-400/10 text-3xl">
            📄
          </div>

          <h2 className="mt-6 text-xl font-semibold">
            Upload your resume
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
            Upload your latest resume in PDF format. We'll analyze it and
            identify the skills you already have.
          </p>


          {/* File input */}

          <label className="mt-6 inline-block cursor-pointer rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200">

            Choose Resume

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

          </label>


          {file && (
            <div className="mx-auto mt-6 max-w-md rounded-xl border border-white/10 bg-white/5 p-4 text-left">

              <p className="text-sm font-medium text-white">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>

              <p className="mt-3 text-xs text-green-400">
                ✓ Resume selected successfully
              </p>

            </div>
          )}

        </div>

      </section>


      {file && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="mt-6 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Analyzing Resume..." : "Analyze Resume →"}
        </button>
      )}


      {message && (
        <p className="mt-4 text-sm text-green-400">
          ✓ {message}
        </p>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}


      {/* Saved / extracted skills */}

      {!loadingSkills && extractedSkills.length > 0 && (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="text-lg font-semibold">
            Skills we found in your resume
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            These have been extracted from your resume automatically.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {extractedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-400/10 px-4 py-1.5 text-sm font-medium text-blue-300"
              >
                {skill}
              </span>
            ))}
          </div>

        </section>
      )}


      {/* No saved skills */}

      {!loadingSkills && extractedSkills.length === 0 && !file && (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="text-lg font-semibold">
            No resume skills yet
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Upload a resume to automatically extract your skills.
          </p>

        </section>
      )}


      <section className="grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-blue-400">
            01
          </p>

          <h3 className="mt-3 font-semibold">
            Upload
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Upload your latest resume as a PDF.
          </p>
        </div>


        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-blue-400">
            02
          </p>

          <h3 className="mt-3 font-semibold">
            Analyze
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Our system will extract useful information from your resume.
          </p>
        </div>


        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-blue-400">
            03
          </p>

          <h3 className="mt-3 font-semibold">
            Discover
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            We'll identify your skills and compare them with your target job.
          </p>
        </div>

      </section>

    </div>
  );
}