"use client";

import { useState } from "react";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  
  async function handleUpload() {
    if (!file) {
      setError("Please choose a resume first.");
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

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

      setMessage("Resume analyzed successfully!");
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
