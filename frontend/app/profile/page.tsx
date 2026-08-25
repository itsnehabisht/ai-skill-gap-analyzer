"use client";

import { useEffect, useState } from "react";

const availableSkills = [
  "Python",
  "SQL",
  "Pandas",
  "NumPy",
  "Machine Learning",
  "Statistics",
  "Data Visualization",
  "Scikit-learn",
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "TypeScript",
  "Git",
];

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Load saved profile when the page opens
  useEffect(() => {
    const savedProfile = localStorage.getItem("studentProfile");

    if (savedProfile) {
      const profile = JSON.parse(savedProfile);

      setName(profile.name || "");
      setEducation(profile.education || "");
      setExperience(
        profile.experience_years !== undefined
          ? String(profile.experience_years)
          : ""
      );
      setSelectedSkills(profile.skills || []);
    }
  }, []);

  function toggleSkill(skill: string) {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(
        selectedSkills.filter((item) => item !== skill)
      );
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const profile = {
      name,
      education,
      experience_years: Number(experience),
      skills: selectedSkills,
    };

    // Save profile in browser
    localStorage.setItem(
      "studentProfile",
      JSON.stringify(profile)
    );

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        }
      );

      const data = await response.json();

      console.log("Backend response:", data);
      console.log("Profile saved successfully!");
    } catch (error) {
      console.error(
        "Error connecting to backend:",
        error
      );
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      <section>
        <p className="text-sm font-medium text-blue-400">
          YOUR PROFILE
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Tell us about yourself.
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Your profile helps us understand where you're starting from so we
          can identify the skills you need for your target career.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8"
      >

        <div>
          <h2 className="text-xl font-semibold">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Start with a few details about yourself.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Education
            </label>

            <select
              value={education}
              onChange={(event) => setEducation(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-blue-400"
            >
              <option value="">
                Select your education
              </option>

              <option value="BCA">BCA</option>
              <option value="B.Tech">B.Tech</option>
              <option value="BBA">BBA</option>
              <option value="MCA">MCA</option>
              <option value="M.Tech">M.Tech</option>
              <option value="MBA">MBA</option>
              <option value="B.Pharm">B.Pharm</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Experience
            </label>

            <input
              type="number"
              min="0"
              max="50"
              value={experience}
              onChange={(event) => setExperience(event.target.value)}
              placeholder="Years of experience"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400"
            />
          </div>

        </div>

        <div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Your Skills
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Select the skills you currently have.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            {availableSkills.map((skill) => {
              const selected = selectedSkills.includes(skill);

              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    selected
                      ? "border-blue-400 bg-blue-400/15 text-blue-300"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {selected ? "✓ " : "+ "}
                  {skill}
                </button>
              );
            })}

          </div>

        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

          <p className="text-sm text-zinc-500">
            Selected skills
          </p>

          <p className="mt-2 text-2xl font-bold">
            {selectedSkills.length}
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            skills added to your profile
          </p>

        </div>

        <div className="flex justify-end">

          <button
            type="submit"
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Save Profile →
          </button>

        </div>

      </form>

    </div>
  );
}
