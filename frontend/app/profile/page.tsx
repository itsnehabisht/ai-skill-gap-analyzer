"use client";

import { useEffect, useState } from "react";

type StudentProfile = {
  name: string;
  education: string;
  experience_years: number;
  skills: string[];
};

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  // --------------------------------------------------
  // LOAD CURRENT PROFILE
  // --------------------------------------------------

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/profile",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Could not load profile.");
        }

        const data = await response.json();

        if (data.profile) {
          const profile = data.profile;

          setName(profile.name || "");
          setEducation(profile.education || "");

          setExperience(
            profile.experience_years !== undefined
              ? String(profile.experience_years)
              : ""
          );
        }
      } catch (error) {
        console.error("Error loading profile:", error);

        setSaveError(
          "Could not load your saved profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // --------------------------------------------------
  // SAVE PROFILE
  // --------------------------------------------------

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setSaveMessage("");
    setSaveError("");

    const profile: StudentProfile = {
      name: name.trim(),
      education: education.trim(),
      experience_years: Number(experience) || 0,
      skills: [],
    };

    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    if (!profile.name) {
      setSaveError("Please enter your name.");
      setSaving(false);
      return;
    }

    if (!profile.education) {
      setSaveError("Please select your education.");
      setSaving(false);
      return;
    }

    try {
      // ---------------------------------------------
      // SEND UPDATED PROFILE TO BACKEND
      // ---------------------------------------------

      const response = await fetch(
        "http://127.0.0.1:8000/api/profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Could not save profile.");
      }

      const data = await response.json();

      console.log("Profile save response:", data);

      // ---------------------------------------------
      // GET THE PROFILE ACTUALLY SAVED BY BACKEND
      // ---------------------------------------------

      if (!data.profile) {
        throw new Error(
          "Backend did not return the saved profile."
        );
      }

      const savedProfile: StudentProfile = data.profile;

      console.log(
        "Profile confirmed by backend:",
        savedProfile
      );

      // ---------------------------------------------
      // IMPORTANT:
      // UPDATE THE SCREEN WITH THE SAVED DATA
      // ---------------------------------------------

      setName(savedProfile.name || "");

      setEducation(
        savedProfile.education || ""
      );

      setExperience(
        savedProfile.experience_years !== undefined
          ? String(savedProfile.experience_years)
          : ""
      );

      // ---------------------------------------------
      // NOTIFY OTHER PAGES THAT PROFILE CHANGED
      // ---------------------------------------------

      localStorage.setItem(
        "profileUpdatedAt",
        Date.now().toString()
      );

      // Keep selected career/job
      const selectedJob =
        localStorage.getItem("selectedJob");

      if (selectedJob) {
        localStorage.setItem(
          "selectedJob",
          selectedJob
        );
      }

      // Tell other open components/pages
      // that the profile has changed.
      window.dispatchEvent(
        new Event("profileUpdated")
      );

      // ---------------------------------------------
      // SUCCESS MESSAGE
      // ---------------------------------------------

      setSaveMessage(
        "Profile saved successfully! ✨"
      );

      // Remove any previous error
      setSaveError("");

      // ---------------------------------------------
      // SCROLL TO TOP
      // ---------------------------------------------

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // ---------------------------------------------
      // AUTOMATICALLY HIDE SUCCESS MESSAGE
      // AFTER 4 SECONDS
      // ---------------------------------------------

      setTimeout(() => {
        setSaveMessage("");
      }, 4000);

    } catch (error) {

      console.error(
        "Error saving profile:",
        error
      );

      setSaveError(
        "Could not save your profile. Please make sure the backend is running."
      );

    } finally {

      setSaving(false);
    }
  }

  // --------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-violet-100 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-600">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* HEADER */}

      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-600">
          YOUR PROFILE
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#211D3D]">
          Tell us about yourself.
        </h1>

        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#615C7A]">
          Your profile is the foundation of your
          personalized career journey. Keep it updated
          so SkillGap AI can give you better results.
        </p>
      </section>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-[28px] border border-violet-100 bg-white p-6 shadow-[0_18px_60px_rgba(72,50,120,0.07)] sm:p-8"
      >

        {/* BASIC INFORMATION */}

        <div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              STEP 01
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#211D3D]">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-[#615C7A]">
              Tell us a little about your current
              education and experience.
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#211D3D]">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter your name"
                className="w-full rounded-2xl border border-violet-100 bg-[#FBFAFE] px-4 py-3.5 text-sm text-[#211D3D] outline-none transition placeholder:text-[#8B86A3] focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* EDUCATION */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#211D3D]">
                Education
              </label>

              <select
                value={education}
                onChange={(event) =>
                  setEducation(event.target.value)
                }
                className="w-full rounded-2xl border border-violet-100 bg-[#FBFAFE] px-4 py-3.5 text-sm text-[#211D3D] outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="">
                  Select your education
                </option>

                <option value="BCA">BCA</option>
                <option value="B.Tech">B.Tech</option>
                <option value="BBA">BBA</option>
                <option value="B.Pharm">B.Pharm</option>
                <option value="MCA">MCA</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MBA">MBA</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* EXPERIENCE */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#211D3D]">
                Experience
              </label>

              <input
                type="number"
                min="0"
                max="50"
                value={experience}
                onChange={(event) =>
                  setExperience(event.target.value)
                }
                placeholder="Years of experience"
                className="w-full rounded-2xl border border-violet-100 bg-[#FBFAFE] px-4 py-3.5 text-sm text-[#211D3D] outline-none transition placeholder:text-[#8B86A3] focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

          </div>
        </div>

        {/* RESUME NOTE */}

        <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
              📄
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">
                NEXT STEP
              </p>

              <h3 className="mt-1 text-lg font-bold text-[#211D3D]">
                Your skills will come from your resume.
              </h3>

              <p className="mt-1 text-sm leading-6 text-[#615C7A]">
                After saving your profile, upload your
                resume on the Resume page. SkillGap AI
                will analyze it and automatically extract
                your skills for the rest of your career
                analysis.
              </p>
            </div>

          </div>

        </div>

        {/* SAVE STATUS */}

        {saveError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {saveError}
          </div>
        )}

        {/* SUCCESS TOAST */}

        {saveMessage && (
          <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-white px-5 py-4 shadow-[0_15px_40px_rgba(34,163,102,0.18)]">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-lg">
                ✓
              </div>

              <div>
                <p className="text-sm font-semibold text-[#211D3D]">
                  Profile saved successfully!
                </p>

                <p className="mt-0.5 text-xs text-[#615C7A]">
                  Your career journey has been updated. 🚀
                </p>
              </div>

            </div>
          </div>
        )}

        {/* SAVE BUTTON */}

        <div className="flex justify-end border-t border-violet-100 pt-6">

          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-[#4C5FEA] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#3B4AD1] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving your profile..."
              : "Save Profile →"}
          </button>

        </div>

      </form>
    </div>
  );
}