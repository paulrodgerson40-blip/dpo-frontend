"use client";

import { useState } from "react";

const API_BASE = "";

export default function Home() {
  const [url, setUrl] = useState("");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("Waiting");
  const [loading, setLoading] = useState(false);

  async function startJob() {
    setLoading(true);
    setStatus("Creating job...");

    try {
      const res = await fetch(`${API_BASE}/api/dpo/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setJobId(data.job_id || "");
      setStatus(data.status || "Job started");

      if (data.job_id) pollJob(data.job_id);
    } catch (err) {
      console.error(err);
      setStatus("Job failed to start. Check backend logs.");
      alert("Job failed to start. Check backend logs.");
      setLoading(false);
    }
  }

  function pollJob(id: string) {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/dpo/jobs/${id}`);
        const data = await res.json();

        setStatus(data.status || "processing...");

        if (["completed", "complete", "phase_b_complete"].includes(data.status)) {
          clearInterval(timer);
          setLoading(false);
          window.open(`${API_BASE}/download-latest`, "_blank");
        }

        if (data.status === "failed") {
          clearInterval(timer);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>🚀 DPO Image Engine</h1>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste Uber Eats URL"
        style={{ width: 520, padding: 12, fontSize: 16 }}
      />

      <div style={{ marginTop: 20 }}>
        <button onClick={startJob} disabled={loading || !url}>
          Start Job
        </button>
      </div>

      <div style={{ marginTop: 25 }}>
        <p><b>Job ID:</b> {jobId || "-"}</p>
        <p><b>Status:</b> {status}</p>
      </div>
    </main>
  );
}
