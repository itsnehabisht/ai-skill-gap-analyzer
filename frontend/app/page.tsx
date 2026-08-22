"use client";

import { useState } from "react";

export default function Home() {
  const [readiness, setReadiness] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [python, setPython] = useState(0);
  const [sql, setSql] = useState(0);
  const [pandas, setPandas] = useState(0);
  const [numpy, setNumpy] = useState(0);
  const [machineLearning, setMachineLearning] = useState(0);
  const [statistics, setStatistics] = useState(0);
  const [dataVisualization, setDataVisualization] = useState(0);
  const [scikitLearn, setScikitLearn] = useState(0);
  const [experienceYears, setExperienceYears] = useState(1);
  const [educationLevel, setEducationLevel] = useState(2);
  const [skillMatchPercentage, setSkillMatchPercentage] = useState(65);

  const predictReadiness = async () => {
    setLoading(true);
    setReadiness(null);
    setError("");

    const studentData = {
    python: python,
    sql: sql,
    pandas: pandas,
    numpy: numpy,
    machine_learning: machineLearning,
    statistics: statistics,
    data_visualization: dataVisualization,
    scikit_learn: scikitLearn,
    experience_years: experienceYears,
    education_level: educationLevel,
    skill_match_percentage: skillMatchPercentage,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const data = await response.json();

      setReadiness(data.job_readiness);
    } catch (error) {
      console.error(error);
      setError("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">
      <h1 className="text-4xl font-bold mb-4">
        AI Skill Gap Analyzer
      </h1>

      <p className="text-zinc-400 mb-8">
        ML Prediction Test
      </p>

      <div className="mb-6 flex flex-col gap-4">

      <div>
        <label className="mr-4">Python</label>
        <select
          value={python}
          onChange={(e) => setPython(Number(e.target.value))}
          className="rounded-lg px-3 py-2 text-white bg-zinc-800"
        >
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>
      </div>

      <div>
        <label className="mr-4">SQL</label>
        <select
          value={sql}
          onChange={(e) => setSql(Number(e.target.value))}
          className="rounded-lg px-3 py-2 text-white bg-zinc-800"
        >
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>
      </div>

      <div>
        <label className="mr-4">Pandas</label>
        <select
          value={pandas}
          onChange={(e) => setPandas(Number(e.target.value))}
          className="rounded-lg px-3 py-2 text-white bg-zinc-800"
        >
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>
      </div>

      <div>
        <label className="mr-4">NumPy</label>
        <select
          value={numpy}
          onChange={(e) => setNumpy(Number(e.target.value))}
          className="rounded-lg px-3 py-2 text-white bg-zinc-800"
        >
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>
      </div>

      <div>
        <label className="mr-4">Machine Learning</label>
        <select
          value={machineLearning}
          onChange={(e) => setMachineLearning(Number(e.target.value))}
          className="rounded-lg px-3 py-2 text-white bg-zinc-800"
        >
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>
      </div>

      <div>
        <label className="mr-4">Statistics</label>
        <select
          value={statistics}
          onChange={(e) => setStatistics(Number(e.target.value))}
          className="rounded-lg px-3 py-2 text-white bg-zinc-800"
        >
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>
      </div>

      <div>
        <label className="mr-4">Data Visualization</label>
        <select
          value={dataVisualization}
          onChange={(e) => setDataVisualization(Number(e.target.value))}
          className="rounded-lg px-3 py-2 text-white bg-zinc-800"
        >
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>
      </div>

      <div>
        <label className="mr-4">Scikit-learn</label>
        <select
          value={scikitLearn}
          onChange={(e) => setScikitLearn(Number(e.target.value))}
          className="rounded-lg px-3 py-2 text-white bg-zinc-800"
        >
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>
      </div>

    </div>

    <div>
      <label className="mr-4">Experience (Years)</label>

      <input
        type="number"
        min="0"
        max="20"
        value={experienceYears}
        onChange={(e) => setExperienceYears(Number(e.target.value))}
        className="rounded-lg px-3 py-2 text-white"
      />
    </div>

    <div>
      <label className="mr-4">Education Level</label>

      <select
        value={educationLevel}
        onChange={(e) => setEducationLevel(Number(e.target.value))}
        className="rounded-lg px-3 py-2 text-white bg-zinc-800"
      >
        <option value={1}>Undergraduate</option>
        <option value={2}>Bachelor's</option>
        <option value={3}>Master's</option>
      </select>
    </div>

    <div>
      <label className="mr-4">Skill Match (%)</label>

      <input
        type="number"
        min="0"
        max="100"
        value={skillMatchPercentage}
        onChange={(e) => setSkillMatchPercentage(Number(e.target.value))}
        className="rounded-lg px-3 py-2 text-white"
      />
    </div>

      <button
        onClick={predictReadiness}
        disabled={loading}
        className="rounded-lg bg-white px-6 py-3 font-medium text-black hover:bg-zinc-200 disabled:opacity-50"
      >
        {loading ? "Predicting..." : "Predict Job Readiness"}
      </button>

      {readiness !== null && (
        <div className="mt-8 rounded-2xl border border-zinc-700 bg-zinc-900 p-8 text-center">

          <p className="text-sm uppercase tracking-widest text-zinc-400">
            Your Job Readiness
          </p>

          <div className="mt-4 text-6xl font-bold text-white">
            {readiness}%
          </div>

          <p className="mt-3 text-lg text-zinc-300">
            {readiness >= 75
              ? "You're looking strong! Keep pushing toward your goal. 🚀"
              : readiness >= 50
              ? "You're on the right track! A few improvements can make a big difference. 💪"
              : "Every expert starts somewhere. Keep learning and you'll get there. 🌱"}
          </p>

        </div>

      )}

      {error && (
        <p className="mt-6 text-red-400">
          {error}
        </p>
      )}
    </main>
  );
}