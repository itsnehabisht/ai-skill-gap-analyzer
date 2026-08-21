"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [backendMessage, setBackendMessage] = useState("Connecting...");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }
        return response.json();
      })
      .then((data) => {
        setBackendMessage(data.message);
      })
      .catch((error) => {
        console.error(error);
        setError("Could not connect to backend");
      });
  }, []);

  return (
    <main>
      <h1>AI Skill Gap Analyzer</h1>

      <h2>Backend Connection</h2>

      {error ? (
        <p>{error}</p>
      ) : (
        <p>{backendMessage}</p>
      )}
    </main>
  );
}