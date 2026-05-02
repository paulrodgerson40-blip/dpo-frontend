"use client";

import { useState } from "react";

const API_BASE = "";

export default function Home() {
  const [url, setUrl] = useState("");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("Waiting");
  const [loading, setLoading] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  async function startJob() {
    setLoading(true);
    setDownloadReady(false);
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
      setStatus("❌ Job failed to start");
      setLoading(false);
    }
  }

  function pollJob(id: string) {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/dpo/jobs/${id}`);
        const data = await res.json();

        setStatus(data.status || "processing...");

        if (["completed", "complete", "phase_b_complete", "ready"].includes(data.status)) {
          clearInterval(timer);
          setLoading(false);
          setDownloadReady(true);
          setStatus("✅ Ready to download");
        }

        if (data.status === "failed") {
          clearInterval(timer);
          setLoading(false);
          setStatus("❌ Job failed");
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial", maxWidth: 600 }}>
      <h1 style={{ marginBottom: 20 }}>🚀 DPO Image Engine</h1>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste Uber Eats URL"
        style={{
          width: "100%",
          padding: 12,
          fontSize: 16,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />

      <div style={{ marginTop: 20 }}>
        <button
          onClick={startJob}
          disabled={loading || !url}
          style={{
            padding: "12px 18px",
            fontSize: 16,
            borderRadius: 6,
            border: "none",
            cursor: loading || !url ? "not-allowed" : "pointer",
            background: loading ? "#999" : "#000",
            color: "#fff",
            opacity: loading || !url ? 0.7 : 1,
          }}
        >
          {loading ? "Processing..." : "Start Job"}
        </button>
      </div>

      <div style={{ marginTop: 25 }}>
        <p><b>Job ID:</b> {jobId || "-"}</p>
        <p><b>Status:</b> {status}</p>
      </div>

      {downloadReady && (
        <div style={{ marginTop: 20 }}>
          <a
            href="http://170.64.209.149:8001/download-latest"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 18px",
              background: "#16a34a",
              color: "white",
              textDecoration: "none",
              borderRadius: 6,
              fontSize: 16,
            }}
          >
            ⬇ Download Images
          </a>
        </div>
      )}
    </main>
  );
}
