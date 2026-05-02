"use client";

import { useState } from "react";

const API_BASE = "";

export default function Home() {
  const [url, setUrl] = useState("");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("Waiting");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [verificationStarting, setVerificationStarting] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState("");

  async function startVerification() {
    setVerificationStarting(true);

    try {
      const res = await fetch(`${API_BASE}/api/dpo/verify/start`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Failed to start verification browser");
      }

      const vncUrl =
        data.vnc_url || "http://170.64.209.149:6080/vnc.html";

      setVerificationUrl(vncUrl);
      window.open(vncUrl, "_blank");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to start verification browser");
    } finally {
      setVerificationStarting(false);
    }
  }

  async function startJob() {
    setLoading(true);
    setDownloadReady(false);
    setError("");
    setErrorCode("");
    setJobId("");
    setProgress(0);
    setStatus("Starting job...");

    try {
      const res = await fetch(`${API_BASE}/api/dpo/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (data.job_id) setJobId(data.job_id);

      if (!res.ok || data.ok === false) {
        setStatus("Job failed");
        setError(data.error || "Job failed to start");
        setErrorCode(data.error_code || "");
        setProgress(100);
        setLoading(false);
        return;
      }

      setJobId(data.job_id || "");
      setStatus(data.status || "Processing...");
      setProgress(data.progress || 5);

      if (data.job_id) pollJob(data.job_id);
    } catch (err) {
      console.error(err);
      setStatus("Job failed");
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }

  function pollJob(id: string) {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/dpo/jobs/${id}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.ok === false || data.status === "failed") {
          clearInterval(timer);
          setLoading(false);
          setStatus("Job failed");
          setError(data.error || "Unknown job error");
          setErrorCode(data.error_code || "");
          setProgress(data.progress || 100);
          return;
        }

        setStatus(data.status || "Processing...");
        setProgress(data.progress || 0);

        if (data.status === "phase_b_complete") {
          clearInterval(timer);
          setLoading(false);
          setDownloadReady(true);
          setProgress(100);
          setStatus("Ready to download");
        }
      } catch (err) {
        console.error(err);
        setError("Could not check job status");
      }
    }, 3000);
  }

  const blockedByUber = errorCode === "UBER_CHALLENGE";
  const buttonDisabled = loading || !url.trim();

  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif", maxWidth: 720 }}>
      <h1>🚀 DPO Image Engine</h1>

      <p style={{ color: "#555" }}>
        Paste an Uber Eats store URL, scrape the menu, enhance images, then download the package.
      </p>

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste Uber Eats store URL"
        style={{
          width: "100%",
          padding: 12,
          fontSize: 16,
          borderRadius: 8,
          border: "1px solid #ccc",
          marginTop: 12,
        }}
      />

      <div style={{ marginTop: 20 }}>
        <button
          onClick={startJob}
          disabled={buttonDisabled}
          style={{
            padding: "12px 18px",
            fontSize: 16,
            borderRadius: 8,
            border: "none",
            cursor: buttonDisabled ? "not-allowed" : "pointer",
            background: loading ? "#777" : "#000",
            color: "#fff",
            opacity: buttonDisabled ? 0.65 : 1,
          }}
        >
          {loading ? "Processing..." : "Start Job"}
        </button>
      </div>

      <div style={{ marginTop: 28 }}>
        <p><b>Job ID:</b> {jobId || "-"}</p>
        <p><b>Status:</b> {status}</p>
        <p><b>Progress:</b> {progress}%</p>

        <div style={{ width: "100%", height: 14, background: "#e5e7eb", borderRadius: 999 }}>
          <div
            style={{
              width: `${Math.min(progress, 100)}%`,
              height: "100%",
              background: blockedByUber ? "#f59e0b" : "#16a34a",
              borderRadius: 999,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {blockedByUber && (
        <div
          style={{
            marginTop: 24,
            padding: 18,
            border: "1px solid #f59e0b",
            background: "#fffbeb",
            borderRadius: 10,
          }}
        >
          <h3 style={{ marginTop: 0 }}>⚠️ Blocked by Uber</h3>

          <p>
            Uber showed a verification challenge. Open the verification browser,
            complete the Uber check, then retry the scrape.
          </p>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={startVerification}
              disabled={verificationStarting}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                background: verificationStarting ? "#93c5fd" : "#2563eb",
                color: "#fff",
                fontWeight: 700,
                cursor: verificationStarting ? "not-allowed" : "pointer",
              }}
            >
              {verificationStarting ? "Opening..." : "Open Verification Browser"}
            </button>

            <button
              onClick={startJob}
              disabled={!url.trim()}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                background: "#f59e0b",
                color: "#111",
                fontWeight: 700,
                cursor: !url.trim() ? "not-allowed" : "pointer",
              }}
            >
              Retry Scrape
            </button>
          </div>

          {verificationUrl && (
            <p style={{ marginTop: 12, fontSize: 14 }}>
              Verification browser opened. If it did not open,{" "}
              <a href={verificationUrl} target="_blank" rel="noopener noreferrer">
                click here
              </a>.
            </p>
          )}
        </div>
      )}

      {error && !blockedByUber && (
        <p style={{ color: "#dc2626", marginTop: 18 }}>
          <b>Error:</b> {error}
        </p>
      )}

      {downloadReady && (
        <div style={{ marginTop: 24 }}>
          <a
            href="/api/dpo/download-latest"
            download
            style={{
              display: "inline-block",
              padding: "12px 18px",
              background: "#16a34a",
              color: "white",
              textDecoration: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            ⬇ Download Images
          </a>
        </div>
      )}
    </main>
  );
}
